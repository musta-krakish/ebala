import Foundation
import IOBluetooth

// Reads battery info per connected Bluetooth device through IOBluetooth
// private properties (KVC-accessible — same source the macOS Bluetooth
// menubar uses). For multi-battery devices (AirPods-style) we collect
// each channel and let the consumer decide which to display.

let devices = IOBluetoothDevice.pairedDevices() as? [IOBluetoothDevice] ?? []

func readInt(_ obj: NSObject, _ key: String) -> Int? {
    let value = obj.value(forKey: key)
    if let n = value as? NSNumber { return n.intValue }
    return nil
}

func readBool(_ obj: NSObject, _ key: String) -> Bool {
    let value = obj.value(forKey: key)
    if let n = value as? NSNumber { return n.boolValue }
    return false
}

var output: [[String: Any]] = []

for dev in devices {
    let address = dev.addressString ?? ""
    if address.isEmpty { continue }

    var entry: [String: Any] = ["address": address]
    entry["connected"] = dev.isConnected()

    let obj = dev as NSObject
    let single = readInt(obj, "batteryPercentSingle") ?? 0
    let combined = readInt(obj, "batteryPercentCombined") ?? 0
    let left = readInt(obj, "batteryPercentLeft") ?? 0
    let right = readInt(obj, "batteryPercentRight") ?? 0
    let caseLevel = readInt(obj, "batteryPercentCase") ?? 0
    let isMulti = readBool(obj, "isMultiBatteryDevice")

    if single > 0 { entry["single"] = single }
    if combined > 0 { entry["combined"] = combined }
    if left > 0 { entry["left"] = left }
    if right > 0 { entry["right"] = right }
    if caseLevel > 0 { entry["case"] = caseLevel }
    entry["isMulti"] = isMulti

    output.append(entry)
}

if let data = try? JSONSerialization.data(withJSONObject: output, options: [.sortedKeys]),
   let json = String(data: data, encoding: .utf8) {
    print(json)
} else {
    print("[]")
}
