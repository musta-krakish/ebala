import Foundation
import CoreBluetooth

// Reads BLE Battery Service (0x180F) characteristic 0x2A19 for every peripheral
// that macOS already considers connected. Matches what Bluetooth menubar shows
// for BLE peripherals (Keychron, MX Keys, AirTags-style, fitness trackers, etc.).
//
// BLE peripherals in CoreBluetooth do NOT expose BD_ADDR — only a per-Mac
// CoreBluetooth UUID. We export both `name` and `uuid` so the consumer can
// match by name against IOBluetooth's address-keyed list.

let BATTERY_SERVICE = CBUUID(string: "180F")
let BATTERY_LEVEL = CBUUID(string: "2A19")
let GLOBAL_TIMEOUT_SEC: Double = 6.0

struct Result: Codable {
    var name: String
    var uuid: String
    var batteryLevel: Int?
}

final class BatteryReader: NSObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var central: CBCentralManager!
    private var queued: [CBPeripheral] = []
    private var pending = 0
    private var results: [String: Result] = [:]
    private var didFinish = false

    private func debug(_ message: String) {
        guard ProcessInfo.processInfo.environment["BLE_BATTERY_DEBUG"] != nil else { return }
        FileHandle.standardError.write("[ble] \(message)\n".data(using: .utf8)!)
    }

    func start() {
        central = CBCentralManager(delegate: self, queue: nil, options: [
            CBCentralManagerOptionShowPowerAlertKey: false
        ])

        DispatchQueue.main.asyncAfter(deadline: .now() + GLOBAL_TIMEOUT_SEC) { [weak self] in
            self?.finish()
        }
    }

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        debug("state=\(central.state.rawValue)")
        guard central.state == .poweredOn else {
            finish()
            return
        }

        let connected = central.retrieveConnectedPeripherals(withServices: [BATTERY_SERVICE])
        debug("retrieved=\(connected.count)")
        if connected.isEmpty {
            finish()
            return
        }

        for peripheral in connected {
            let id = peripheral.identifier.uuidString
            results[id] = Result(name: peripheral.name ?? "", uuid: id, batteryLevel: nil)
            peripheral.delegate = self
            // Hold a strong reference — CB will release peripherals not retained
            // by the caller, killing pending connects/discovery silently.
            queued.append(peripheral)
            pending += 1
            debug("queue \(peripheral.name ?? "?") state=\(peripheral.state.rawValue)")

            if peripheral.state == .connected {
                peripheral.discoverServices([BATTERY_SERVICE])
            } else {
                central.connect(peripheral, options: nil)
            }
        }
    }

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        debug("didConnect \(peripheral.name ?? "?")")
        peripheral.discoverServices([BATTERY_SERVICE])
    }

    func centralManager(_ central: CBCentralManager, didFailToConnect peripheral: CBPeripheral, error: Error?) {
        debug("didFailToConnect \(peripheral.name ?? "?") error=\(error?.localizedDescription ?? "?")")
        done(peripheral, nil)
    }

    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        debug("didDisconnect \(peripheral.name ?? "?") error=\(error?.localizedDescription ?? "-")")
    }

    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        debug("didDiscoverServices \(peripheral.name ?? "?") count=\(peripheral.services?.count ?? 0) error=\(error?.localizedDescription ?? "-")")
        guard let service = peripheral.services?.first(where: { $0.uuid == BATTERY_SERVICE }) else {
            done(peripheral, nil)
            return
        }
        peripheral.discoverCharacteristics([BATTERY_LEVEL], for: service)
    }

    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        debug("didDiscoverChars \(peripheral.name ?? "?") count=\(service.characteristics?.count ?? 0)")
        guard let ch = service.characteristics?.first(where: { $0.uuid == BATTERY_LEVEL }) else {
            done(peripheral, nil)
            return
        }
        peripheral.readValue(for: ch)
    }

    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        debug("didUpdate \(peripheral.name ?? "?") bytes=\(characteristic.value?.count ?? 0)")
        guard characteristic.uuid == BATTERY_LEVEL else { return }
        var level: Int? = nil
        if let data = characteristic.value, let first = data.first {
            level = Int(first)
        }
        done(peripheral, level)
    }

    private func done(_ peripheral: CBPeripheral, _ level: Int?) {
        let id = peripheral.identifier.uuidString
        if results[id] != nil, let level = level {
            results[id]?.batteryLevel = level
        }
        central?.cancelPeripheralConnection(peripheral)
        pending -= 1
        if pending == 0 { finish() }
    }

    private func finish() {
        if didFinish { return }
        didFinish = true

        let payload = Array(results.values)
        if let data = try? JSONEncoder().encode(payload),
           let json = String(data: data, encoding: .utf8) {
            print(json)
        } else {
            print("[]")
        }
        exit(0)
    }
}

let reader = BatteryReader()
reader.start()
dispatchMain()
