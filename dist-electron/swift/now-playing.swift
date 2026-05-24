import Foundation
import AppKit

typealias MRGetNowPlayingInfo = @convention(c) (DispatchQueue, @escaping ([String: Any]?) -> Void) -> Void
typealias MRGetNowPlayingApplicationPID = @convention(c) (DispatchQueue, @escaping (Int32) -> Void) -> Void

let frameworkPath = "/System/Library/PrivateFrameworks/MediaRemote.framework/MediaRemote"

guard let handle = dlopen(frameworkPath, RTLD_NOW) else {
    fputs("Unable to load MediaRemote.framework\n", stderr)
    print("[]")
    exit(0)
}

func loadSymbol<T>(_ name: String, as type: T.Type) -> T? {
    guard let raw = dlsym(handle, name) else { return nil }
    return unsafeBitCast(raw, to: type)
}

let getNowPlayingInfo = loadSymbol("MRMediaRemoteGetNowPlayingInfo", as: MRGetNowPlayingInfo.self)
let getNowPlayingApplicationPID = loadSymbol("MRMediaRemoteGetNowPlayingApplicationPID", as: MRGetNowPlayingApplicationPID.self)

func sanitize(_ info: [String: Any]) -> [String: Any] {
    var output: [String: Any] = [:]
    for (key, value) in info {
        if value is String || value is NSNumber || value is Bool {
            output[key] = value
        } else if let date = value as? Date {
            output[key] = date.timeIntervalSince1970
        } else if let data = value as? Data {
            output[key] = data.base64EncodedString()
        }
    }
    return output
}

let workQueue = DispatchQueue(label: "ebala.media.collector")
var mainInfo: [String: Any]?
var mainPid: Int32 = 0

let group = DispatchGroup()
if let getInfo = getNowPlayingInfo {
    group.enter()
    getInfo(workQueue) { info in
        mainInfo = info.map(sanitize)
        group.leave()
    }
}
if let getPid = getNowPlayingApplicationPID {
    group.enter()
    getPid(workQueue) { pid in
        mainPid = pid
        group.leave()
    }
}
_ = group.wait(timeout: .now() + 3.0)

var output: [[String: Any]] = []
if var info = mainInfo, !info.isEmpty {
    let runningApp = mainPid > 0 ? NSRunningApplication(processIdentifier: mainPid) : nil
    info["__pid"] = mainPid
    info["__bundleId"] = runningApp?.bundleIdentifier ?? ""
    info["__displayName"] = runningApp?.localizedName ?? runningApp?.bundleIdentifier ?? ""

    let hasTitle = info["kMRMediaRemoteNowPlayingInfoTitle"] != nil
    let hasArtist = info["kMRMediaRemoteNowPlayingInfoArtist"] != nil
    if hasTitle || hasArtist {
        output.append(info)
    }
}

if let data = try? JSONSerialization.data(withJSONObject: output, options: [.sortedKeys]),
   let json = String(data: data, encoding: .utf8) {
    print(json)
} else {
    print("[]")
}
exit(0)
