import SwiftUI

struct ContentView: View {
    @State private var sensorReadings: [SensorReading] = SensorReading.mock()
    @State private var isOnline = true
    let timer = Timer.publish(every: 3, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationStack {
            List {
                Section("System Status") {
                    HStack {
                        Circle()
                            .fill(isOnline ? Color.green : Color.red)
                            .frame(width: 10, height: 10)
                        Text(isOnline ? "All systems operational" : "Connectivity issue")
                            .font(.subheadline)
                    }
                }

                Section("Live Sensor Data") {
                    ForEach(sensorReadings) { sensor in
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(sensor.name).font(.headline)
                                Text(sensor.location).font(.caption).foregroundStyle(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(sensor.valueFormatted).fontWeight(.semibold)
                                    .foregroundStyle(sensor.isAlert ? .red : .primary)
                                Text(sensor.unit).font(.caption).foregroundStyle(.secondary)
                            }
                        }
                    }
                }

                Section("Services") {
                    ForEach(["vision-api", "plc-bridge", "api-gateway", "mqtt-broker", "grafana"], id: \.self) { svc in
                        HStack {
                            Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
                            Text(svc).font(.subheadline)
                            Spacer()
                            Text("running").font(.caption).foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("🏭 Smart Factory")
            .onReceive(timer) { _ in
                sensorReadings = SensorReading.mock()
            }
        }
    }
}

struct SensorReading: Identifiable {
    let id = UUID()
    let name: String
    let location: String
    let value: Double
    let unit: String
    let isAlert: Bool

    var valueFormatted: String { String(format: "%.1f", value) }

    static func mock() -> [SensorReading] {
        [
            SensorReading(name: "Temperature", location: "Assembly Line A", value: Double.random(in: 18...95), unit: "°C", isAlert: false),
            SensorReading(name: "Pressure", location: "Hydraulic Unit 3", value: Double.random(in: 1.0...8.5), unit: "bar", isAlert: false),
            SensorReading(name: "Vibration", location: "CNC Machine 2", value: Double.random(in: 0.1...4.2), unit: "mm/s", isAlert: false),
            SensorReading(name: "Camera FPS", location: "Vision Station", value: Double.random(in: 25...30), unit: "fps", isAlert: false),
            SensorReading(name: "Power Draw", location: "Main Panel", value: Double.random(in: 40...120), unit: "kW", isAlert: false),
        ]
    }
}

#Preview { ContentView() }
