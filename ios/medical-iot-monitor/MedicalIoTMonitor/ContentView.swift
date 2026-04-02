import SwiftUI

struct ContentView: View {
    @State private var vitals: [VitalReading] = VitalReading.mock()
    @State private var selectedTab = 0
    let timer = Timer.publish(every: 3, on: .main, in: .common).autoconnect()

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView(vitals: $vitals)
                .tabItem { Label("Dashboard", systemImage: "waveform.path.ecg") }
                .tag(0)

            DevicesView()
                .tabItem { Label("Devices", systemImage: "wifi") }
                .tag(1)

            AlertsView(vitals: vitals)
                .tabItem { Label("Alerts", systemImage: "bell.badge") }
                .tag(2)
        }
        .onReceive(timer) { _ in
            vitals = VitalReading.mock()
        }
    }
}

// MARK: - Dashboard

struct DashboardView: View {
    @Binding var vitals: [VitalReading]

    var body: some View {
        NavigationStack {
            List {
                Section("Patient Status") {
                    HStack(spacing: 8) {
                        Circle()
                            .fill(Color.green)
                            .frame(width: 10, height: 10)
                        Text("John Doe — Room 204")
                            .font(.subheadline)
                        Spacer()
                        Text("Stable")
                            .font(.caption)
                            .foregroundStyle(.green)
                    }
                }

                Section("Live Vitals") {
                    ForEach(vitals) { vital in
                        HStack {
                            Image(systemName: vital.icon)
                                .foregroundStyle(vital.isAlert ? .red : .teal)
                                .frame(width: 28)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(vital.name).font(.headline)
                                Text(vital.device).font(.caption).foregroundStyle(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 2) {
                                Text(vital.valueFormatted)
                                    .fontWeight(.semibold)
                                    .foregroundStyle(vital.isAlert ? .red : .primary)
                                Text(vital.unit).font(.caption).foregroundStyle(.secondary)
                            }
                        }
                        .padding(.vertical, 2)
                    }
                }

                Section("Connected Devices") {
                    ForEach(["Cardiac Monitor (BLE)", "Infusion Pump (BLE)", "Pulse Oximeter (BLE)", "Ventilator (Wi-Fi)"], id: \.self) { device in
                        HStack {
                            Image(systemName: "checkmark.circle.fill").foregroundStyle(.green)
                            Text(device).font(.subheadline)
                            Spacer()
                            Text("Connected").font(.caption).foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .navigationTitle("🏥 Medical IoT Monitor")
        }
    }
}

// MARK: - Devices

struct DevicesView: View {
    let devices: [MedDevice] = [
        MedDevice(name: "Cardiac Monitor CM-900", type: "BLE 5.x", id: "CM-204-A", battery: 82),
        MedDevice(name: "Infusion Pump IP-3000", type: "BLE 5.x", id: "IP-204-B", battery: 67),
        MedDevice(name: "Pulse Oximeter PO-200", type: "BLE 5.x", id: "PO-204-C", battery: 91),
        MedDevice(name: "Ventilator V-5000", type: "Wi-Fi", id: "VT-204-D", battery: 100),
        MedDevice(name: "BP Monitor BPM-700", type: "BLE 5.x", id: "BP-204-E", battery: 55),
    ]

    var body: some View {
        NavigationStack {
            List(devices) { device in
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(device.name).font(.headline)
                        Spacer()
                        Image(systemName: "wifi.circle.fill").foregroundStyle(.green)
                    }
                    HStack {
                        Label(device.type, systemImage: "antenna.radiowaves.left.and.right")
                            .font(.caption).foregroundStyle(.secondary)
                        Spacer()
                        Label("ID: \(device.deviceId)", systemImage: "qrcode")
                            .font(.caption).foregroundStyle(.secondary)
                    }
                    ProgressView(value: Double(device.battery), total: 100)
                        .tint(device.battery > 30 ? .green : .red)
                    Text("Battery: \(device.battery)%")
                        .font(.caption2).foregroundStyle(.secondary)
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("📡 Devices")
        }
    }
}

// MARK: - Alerts

struct AlertsView: View {
    let vitals: [VitalReading]

    var alerts: [VitalReading] { vitals.filter { $0.isAlert } }

    var body: some View {
        NavigationStack {
            Group {
                if alerts.isEmpty {
                    ContentUnavailableView("No Active Alerts", systemImage: "checkmark.shield.fill",
                                          description: Text("All vitals are within normal range."))
                } else {
                    List(alerts) { vital in
                        HStack {
                            Image(systemName: "exclamationmark.triangle.fill").foregroundStyle(.red)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(vital.name).font(.headline).foregroundStyle(.red)
                                Text("\(vital.valueFormatted) \(vital.unit) — out of range").font(.caption)
                            }
                        }
                    }
                }
            }
            .navigationTitle("🔔 Alerts")
        }
    }
}

// MARK: - Models

struct VitalReading: Identifiable {
    let id = UUID()
    let name: String
    let device: String
    let value: Double
    let unit: String
    let icon: String
    let normalRange: ClosedRange<Double>

    var isAlert: Bool { !normalRange.contains(value) }
    var valueFormatted: String { String(format: "%.1f", value) }

    static func mock() -> [VitalReading] {
        [
            VitalReading(name: "Heart Rate", device: "Cardiac Monitor", value: Double.random(in: 50...130), unit: "bpm", icon: "heart.fill", normalRange: 60...100),
            VitalReading(name: "SpO₂", device: "Pulse Oximeter", value: Double.random(in: 88...100), unit: "%", icon: "lungs.fill", normalRange: 95...100),
            VitalReading(name: "Temperature", device: "Cardiac Monitor", value: Double.random(in: 35.5...39.5), unit: "°C", icon: "thermometer.medium", normalRange: 36.1...37.2),
            VitalReading(name: "Blood Pressure (Sys)", device: "BP Monitor", value: Double.random(in: 100...170), unit: "mmHg", icon: "drop.fill", normalRange: 90...140),
            VitalReading(name: "Respiratory Rate", device: "Ventilator", value: Double.random(in: 10...28), unit: "br/min", icon: "wind", normalRange: 12...20),
            VitalReading(name: "Infusion Rate", device: "Infusion Pump", value: Double.random(in: 20...120), unit: "mL/hr", icon: "syringe.fill", normalRange: 25...100),
        ]
    }
}

struct MedDevice: Identifiable {
    let id = UUID()
    let name: String
    let type: String
    let deviceId: String
    let battery: Int

    init(name: String, type: String, id: String, battery: Int) {
        self.name = name
        self.type = type
        self.deviceId = id
        self.battery = battery
    }
}

#Preview { ContentView() }
