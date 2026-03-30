import SwiftUI

struct ContentView: View {
    let streams: [VideoStream] = [
        VideoStream(name: "Camera 0 — Front Bumper", codec: "H.264", resolution: "1920×1080", fps: 30, latency: 12),
        VideoStream(name: "Camera 1 — Rear Wide", codec: "H.265", resolution: "2560×1440", fps: 60, latency: 8),
        VideoStream(name: "Camera 2 — Left Blind Spot", codec: "H.264", resolution: "1280×720", fps: 30, latency: 15),
        VideoStream(name: "Camera 3 — Right Blind Spot", codec: "H.264", resolution: "1280×720", fps: 30, latency: 14),
        VideoStream(name: "Camera 4 — Interior Cabin", codec: "MJPEG", resolution: "1920×1080", fps: 15, latency: 22),
    ]

    @State private var selectedStream: VideoStream?

    var body: some View {
        NavigationSplitView {
            List(streams, selection: $selectedStream) { stream in
                VStack(alignment: .leading, spacing: 4) {
                    Text(stream.name).font(.headline)
                    HStack {
                        Label(stream.codec, systemImage: "video")
                        Spacer()
                        Text("\(stream.fps) fps").foregroundStyle(.secondary)
                    }
                    .font(.caption)
                }
                .padding(.vertical, 2)
                .tag(stream)
            }
            .navigationTitle("📹 Video Systems")
        } detail: {
            if let s = selectedStream {
                VStack(spacing: 16) {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color.black)
                        .frame(height: 200)
                        .overlay(Text("▶ Live Preview\n\(s.resolution)").foregroundStyle(.white).multilineTextAlignment(.center))

                    Grid(alignment: .leading, verticalSpacing: 12) {
                        GridRow { Text("Codec").foregroundStyle(.secondary); Text(s.codec) }
                        GridRow { Text("Resolution").foregroundStyle(.secondary); Text(s.resolution) }
                        GridRow { Text("Frame Rate").foregroundStyle(.secondary); Text("\(s.fps) fps") }
                        GridRow { Text("Latency").foregroundStyle(.secondary); Text("\(s.latency) ms") }
                    }
                    .padding()
                    .background(Color(.systemGroupedBackground))
                    .cornerRadius(12)
                }
                .padding()
                .navigationTitle(s.name)
            } else {
                Text("Select a camera stream").foregroundStyle(.secondary)
            }
        }
    }
}

struct VideoStream: Identifiable, Hashable {
    var id: String { name }
    let name: String
    let codec: String
    let resolution: String
    let fps: Int
    let latency: Int
}

#Preview { ContentView() }
