import Foundation

typealias MRSendCommand = @convention(c) (Int, CFDictionary?) -> Void

let commands: [String: Int] = [
    "play-pause": 2,
    "next": 4,
    "previous": 5
]

guard CommandLine.arguments.count > 1, let command = commands[CommandLine.arguments[1]] else {
    fputs("Usage: media-key play-pause|next|previous\n", stderr)
    exit(64)
}

let frameworkPath = "/System/Library/PrivateFrameworks/MediaRemote.framework/MediaRemote"

guard let handle = dlopen(frameworkPath, RTLD_NOW) else {
    fputs("Unable to load MediaRemote.framework\n", stderr)
    exit(70)
}

guard let symbol = dlsym(handle, "MRMediaRemoteSendCommand") else {
    fputs("Unable to find MRMediaRemoteSendCommand\n", stderr)
    exit(70)
}

let send = unsafeBitCast(symbol, to: MRSendCommand.self)
send(command, nil)

RunLoop.current.run(until: Date().addingTimeInterval(0.25))
