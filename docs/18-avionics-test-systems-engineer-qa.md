# Avionics Test Systems Engineer — Technical Q&A

## Project Overview

**Project Name:** Avionics Test Systems Engineer (AvionicsTEST)  
**Category:** Full-Stack / Aerospace  
**Slug:** `avionics-test-systems`  
**Live Demo:** `/projects/avionics-test-systems/index.html`  
**GitHub:** <https://github.com/delongkevin/FullStackEngineer>  
**Mobile Downloads:** <https://github.com/delongkevin/FullStackEngineer/releases/latest>

### Description

AvionicsTEST is a full-stack interactive dashboard that simulates a production-grade automated test station for complex electronic aerospace Line Replaceable Units (LRUs). The system demonstrates NI TestStand sequence execution with live pass/fail reporting, ARINC 429/664/825 bus decode with a label inspector, CAN ISO 11898 frame tracing, RS-422/232/485 serial streaming, analog signal conditioning with stimulus and low-pass filter controls, and 5-Why / 8D root-cause analytics. The responsive dashboard targets web, Android (Kotlin), and iOS (Swift/SwiftUI) with a professional aerospace-grade dark UI — aligned with DO-178C, DO-254, AS9100, MIL-STD-461, and RTCA DO-160 standards.

### Technology Stack

| Layer | Technologies |
|-------|-------------|
| Test Automation | NI TestStand, LabWindows/CVI, PXI/GPIB |
| Languages | C/C++, C#, Python |
| Avionics Buses | ARINC 429, ARINC 664 (AFDX), ARINC 825 (CAN Aerospace), CAN ISO 11898 |
| Serial Interfaces | RS-422, RS-485, RS-232 |
| Analog I/O | Signal conditioning, stimulus generation, low-pass filtering |
| Mobile | Android (Kotlin), iOS (Swift/SwiftUI) |
| Standards | DO-178C, DO-254, AS9100, MIL-STD-461, RTCA DO-160 |
| DevOps | Git, GitHub, Agile/Scrum |

### Key Features

- NI TestStand sequence runner with animated step-by-step LRU functional, ARINC 429, Power Supply, CAN Bus, and RS-422 test execution
- Live ARINC 429 bus monitor with label decode (altitude, IAS, heading, acceleration), SSM/SDI fields, parity check, and scrolling bus log
- CAN ISO 11898 frame trace: ID, DLC, data bytes, node name, and live bus-load percentage
- RS-232/422/485 serial streaming with NMEA GPS sentences, IMU yaw/pitch/roll, and multi-drop node temperature telemetry
- Analog signal conditioning panel: stimulus voltage slider, low-pass filter control, and 4-channel in-spec/out-of-spec monitoring
- 5-Why root-cause drill-down and 8D defect-trend chart with corrective-action status chips
- Live KPI dashboard: test coverage, first-pass yield, throughput (UUT/hr), and ARINC waveform canvas
- Cross-platform mobile targets: Android APK (Kotlin), iOS (Swift/SwiftUI), and responsive web

---

## 1. Architecture & Design Q&A

**Q1: What is the overall architecture of the AvionicsTEST system?**

AvionicsTEST follows a layered architecture that mirrors a real production automated test station. At the hardware abstraction layer, NI PXI instruments communicate with LRUs via ARINC 429, CAN, RS-422/485, and analog I/O buses. The test logic layer is implemented in NI TestStand, which orchestrates sequences calling LabWindows/CVI code modules or C/C++ DLLs for bus encode/decode and signal generation. Above this sits a C#/.NET data aggregation service that collects pass/fail results, waveform samples, and bus logs. The presentation layer is a responsive web dashboard (HTML5/CSS3/JavaScript) that displays live data via WebSocket or REST polling, together with native Android (Kotlin) and iOS (Swift/SwiftUI) companion apps. This separation of concerns allows the test logic to evolve independently of the UI and enables the same data feeds to power both web and mobile clients.

**Q2: How does the system handle real-time data streaming for bus monitors and KPI dashboards?**

Real-time data streaming is achieved through a WebSocket server embedded in the C#/.NET aggregation layer. NI TestStand sequences publish telemetry events — bus frame captures, step results, analog samples — to an in-process message queue. The C# service dequeues these events at a configurable rate (typically 50 ms) and broadcasts JSON payloads to all connected WebSocket clients. The web dashboard subscribes to these WebSocket messages and updates the ARINC 429 scrolling log, CAN frame trace table, and KPI gauges without page reloads. The mobile apps (Android and iOS) connect to the same WebSocket endpoint via OkHttp (Android) or URLSessionWebSocketTask (iOS). A REST fallback endpoint provides snapshot data for environments where WebSocket connections are blocked by a firewall or proxy.

**Q3: How is the NI TestStand sequence model structured?**

The NI TestStand sequence model is structured hierarchically. A top-level `MainSequence` coordinates five major sub-sequences: `LRU_Functional`, `ARINC429_BusTest`, `PowerSupply_Verify`, `CANBus_Integrity`, and `RS422_SerialStream`. Each sub-sequence is a `.seq` file containing ordered steps that reference C/C++ or LabWindows/CVI code modules via the TestStand Code Module API. Steps are categorized as Action (execute a measurement), Pass/Fail (compare result to limits), and Cleanup (restore instrument state). Test limits are stored in a separate database (SQLite or SQL Server) and are loaded at sequence start, which allows limits to be updated without modifying sequence files. A `ProcessModel` template enforces pre-test calibration checks and post-test logging, consistent with AS9100 process control requirements.

**Q4: What design patterns are applied in the C# data aggregation service?**

The C# aggregation service applies several enterprise design patterns. The Observer pattern decouples the TestStand event source from the WebSocket broadcast layer — TestStand raises `StepComplete` and `MeasurementReady` events, and the service's observer handler formats and forwards them. A Repository pattern abstracts database access, allowing the storage backend to be swapped between SQLite (development), SQL Server (on-premises production), and Azure SQL (cloud) without changing business logic. The Command pattern is used for test control operations (start, stop, pause, abort) issued from the web UI, ensuring each command is logged, auditable, and reversible where applicable. Dependency Injection (via Microsoft.Extensions.DependencyInjection) makes all services testable in isolation with mock instruments.

**Q5: How does the system ensure traceability from a test result back to the hardware and software configuration?**

Each test execution record is stamped with a Test Report ID, the operator's user ID, the NI TestStand sequence version (from Git commit SHA), the instrument calibration certificate IDs read from an NI MAX asset database, and the LRU serial number scanned via barcode. These attributes are written to a `TestReport` table in the relational database at the beginning of execution, and individual `MeasurementResult` rows are linked to it by foreign key. A `ConfigSnapshot` table records the exact software build version of every code module loaded by TestStand, meeting the configuration management requirements of AS9100 Section 8.5.2 and supporting DO-178C traceability from test case to source code.

**Q6: How is the analog signal conditioning panel implemented, and what is its relationship to PXI hardware?**

In the live hardware implementation, the analog panel controls a PXI-6289 multifunction I/O card via NI-DAQmx calls. The stimulus voltage slider maps directly to an analog output channel (`ao0`) that drives the unit under test, while the low-pass filter control sends a digital control word to a signal conditioning module (e.g., NI SCXI-1141) over the PXI backplane. In the dashboard demo, JavaScript simulates the instrument responses: a sine wave generator function produces time-domain samples at the configured frequency, applies a simulated Butterworth IIR filter at the cutoff frequency set by the slider, and renders the result on an HTML5 Canvas using `requestAnimationFrame`. The 4-channel in-spec/out-of-spec indicators compare simulated measurements against hardcoded nominal limits and apply green/red CSS classes accordingly. To replace the simulation with real hardware, the JavaScript fetch calls would be redirected to REST endpoints backed by a LabWindows/CVI server controlling NI-DAQmx.

**Q7: How does the 8D / 5-Why root-cause module integrate with the test workflow?**

When a test step fails, TestStand triggers a `DefectCreated` event that is forwarded to the C# service, which inserts a new row into the `DefectLog` table with the failing step name, measured value, limit, and timestamp. The web dashboard's 8D panel queries this table and renders a Kanban-style card for the defect. The 5-Why form presents five sequential cause-and-effect text fields; each saved response is appended as a `CauseEntry` child record. The 8D chart aggregates defects over a 30-day rolling window grouped by failure category and renders a bar chart using Chart.js. Corrective action status chips (Open, In-Progress, Verified, Closed) are updated by authorized users via a PATCH REST endpoint and reflected in real time via WebSocket broadcast to all dashboard consumers.

---

## 2. Technology Stack Q&A

**Q1: Why was NI TestStand chosen as the test sequencing engine rather than a custom framework?**

NI TestStand is the aerospace and defense industry standard for automated test sequencing because it provides built-in concepts essential for compliance: sequence versioning, operator login, pass/fail step logic with limit checking, process model enforcement, and report generation in XML, HTML, and ATML formats. Writing an equivalent framework from scratch would require months of development and would not benefit from NI's established validation documentation, which is accepted by certifying authorities. TestStand also integrates natively with LabWindows/CVI, LabVIEW, and .NET code modules, allowing teams to leverage existing IP. Its station-level licensing model is cost-effective for multi-station deployments, and its scripting API (via COM or .NET) enables CI/CD integration.

**Q2: What is ARINC 429 and how does the bus monitor decode it?**

ARINC 429 is a unidirectional serial data bus standard used in commercial aviation (Boeing 737/747, Airbus A320/A380) for communication between avionics LRUs such as flight management computers, air data computers, and inertial reference units. Each 32-bit word consists of an 8-bit label (LSB-first, octal-encoded), an optional Source/Destination Identifier (SDI, 2 bits), a data field (19 bits), a Sign/Status Matrix (SSM, 2 bits), and an odd parity bit. The bus monitor decode process reads raw 32-bit words from a PXI ARINC 429 interface card (e.g., Astronics 429-4), extracts the label by reversing the 8 LSBs and converting to octal, looks up the label in a Data Item dictionary (which maps labels such as `0x01B` to "Altitude", `0x114` to "Airspeed"), applies the BNR or BCD encoding formula to extract the engineering-unit value, validates the parity bit, and displays the result in the scrolling bus log table. The dashboard simulation performs this decode in JavaScript using a pre-populated label dictionary and a synthetic word generator.

**Q3: What distinguishes ARINC 664 (AFDX) from ARINC 429, and why does the project reference it?**

ARINC 664 Part 7, commonly known as AFDX (Avionics Full-Duplex Switched Ethernet), is a deterministic Ethernet-based network used in modern aircraft such as the Airbus A380 and Boeing 787. Unlike ARINC 429, which is unidirectional point-to-point at 12.5 or 100 kbps, AFDX is a switched, full-duplex, 100 Mbps network with end-system partitioning via Virtual Links (VLs). Each Virtual Link has a Bandwidth Allocation Gap (BAG) that enforces maximum transmission interval, ensuring bounded latency. AFDX monitoring requires an AFDX Interface Unit (AIU) such as an Astronics RCX-3000 to capture and timestamp frames. The AvionicsTEST project references ARINC 664 to demonstrate competency with modern avionics networking relevant to Integrated Modular Avionics (IMA) architectures found in current aircraft programs.

**Q4: How is CAN ISO 11898 different from ARINC 825, and when is each used?**

CAN ISO 11898 is the generic Controller Area Network physical and data link layer standard widely used in automotive and industrial applications, operating at up to 1 Mbps on a two-wire differential bus. ARINC 825 is an aerospace-specific application layer standard built on top of CAN ISO 11898, defining message identifier formats, priority levels, node address assignment, and service protocols (e.g., Node Service, Engineering Service) tailored for avionics LRU communication. ARINC 825 is used in aircraft for secondary avionics buses — cabin management, power distribution control, fuel management — where the strict determinism of ARINC 429 or AFDX is not required. The AvionicsTEST project monitors both: raw CAN ISO 11898 frames (relevant to ground support equipment and test harnesses) and ARINC 825 service protocol messages (relevant to avionics LRU testing).

**Q5: Why is LabWindows/CVI used alongside C/C++ rather than using pure C/C++ everywhere?**

LabWindows/CVI is an ANSI C development environment from National Instruments that provides direct API bindings for all NI instrument drivers (NI-DAQmx, NI-VISA, NI-488.2), a built-in panel-based UI editor for instrument control panels, and integration with NI TestStand as a code module host. Pure C/C++ code is used for performance-critical paths — such as ARINC 429 word encode/decode routines and digital signal processing for analog signal conditioning — because those algorithms are shared across TestStand, Windows services, and potentially real-time PXI embedded controllers running VxWorks or Phar Lap ETS. LabWindows/CVI wraps these C libraries and exposes them to TestStand as DLL code modules with a standard entry point signature (`int ModuleName(CVI_TestStandAPI_Type *seqContextPtr, ...)`), enabling TestStand to call them from sequence steps.

**Q6: How do the Android and iOS mobile apps connect to the test station?**

The Android app (Kotlin, Jetpack) connects to the C# WebSocket server using OkHttp's WebSocket API (`OkHttpClient.newWebSocket(request, listener)`). JSON payloads received from the server are parsed using Gson or Moshi into Kotlin data classes. The parsed data is posted to a LiveData observable in a ViewModel, which the UI fragments observe to update RecyclerView adapters for the bus log table and the KPI gauge views. The iOS app (Swift, SwiftUI) uses `URLSessionWebSocketTask` to maintain the WebSocket connection, receives `URLSessionWebSocketTask.Message` payloads, decodes them with `JSONDecoder` into Swift Codable structs, and publishes them through an `ObservableObject` via `@Published` properties that SwiftUI views subscribe to automatically. Both apps support offline mode by caching the last-received test report in SharedPreferences (Android) or UserDefaults (iOS).

**Q7: What compliance standards govern this type of automated test system?**

DO-178C (Software Considerations in Airborne Systems and Equipment Certification) governs the software development lifecycle for software components used in airborne systems, defining five Design Assurance Levels (DAL A–E) based on failure consequences. DO-254 is the hardware equivalent for complex electronic hardware (FPGAs, ASICs). AS9100 is the aerospace quality management system standard (based on ISO 9001) governing organizational processes including design control, configuration management, and nonconformance handling. MIL-STD-461 governs electromagnetic compatibility (EMC) requirements for military equipment. RTCA DO-160 defines environmental test conditions (temperature, humidity, vibration, EMC) for airborne equipment. A production AvionicsTEST station would require its test software to be developed under an approved DO-178C plan (at minimum DAL C for most secondary systems) and its instruments to be calibrated under an ISO 17025-accredited program.

---

## 3. Features & Implementation Q&A

**Q1: How is the NI TestStand sequence runner animated in the dashboard demo?**

In the dashboard demo, the TestStand sequence runner is simulated using a JavaScript state machine. An array of step objects defines each test step's name, expected duration, and simulated outcome (pass, fail, or in-progress). A `setInterval` timer advances through the array at configurable speed, updating the step's CSS class to `step-running`, `step-pass`, or `step-fail`. A summary counter tracks total steps, pass count, fail count, and elapsed time, updating the KPI chips in real time. The progress bar uses a CSS transition on `width` to animate smoothly between steps. In a production integration, this JavaScript would be replaced by WebSocket event handlers that consume `StepComplete` events from the NI TestStand .NET API (`TS.Engine.NewResultListEntry`), maintaining the same DOM update logic.

**Q2: How does the ARINC 429 label inspector work?**

The ARINC 429 label inspector receives a 32-bit hexadecimal word (either from the live PXI interface or from the demo's word generator). It extracts bits 1–8 (LSB first) as the label byte, reverses the bit order to obtain the octal label number, and performs a dictionary lookup to retrieve the parameter name (e.g., label `0o101` = "Altitude"). It then extracts the SSM field (bits 30–31) to determine the data sign and status (Normal Operation, No Computed Data, Functional Test, or Failure Warning), the SDI field (bits 9–10) for source/destination routing, and the data field (bits 11–29) which it decodes as Binary (BNR) or Binary-Coded Decimal (BCD) depending on the label definition. The parity bit (bit 32) is verified by XOR-ing all 31 data bits; a parity error is flagged in the bus log with a red indicator. This decode logic is implemented both in JavaScript (dashboard) and in the C/C++ code module (production).

**Q3: How is the RS-422 serial streaming panel implemented?**

RS-422 is a differential serial standard that supports multi-drop configurations at distances up to 1,200 meters and data rates up to 10 Mbps. In the production system, an NI PXI-8431 RS-485/422 interface card opens a VISA serial session and reads NMEA 0183 sentences from GPS receivers, IMU telemetry frames from an inertial measurement unit, and temperature sensor readings from multi-drop nodes at configurable baud rates (typically 115,200 bps). Received bytes are buffered in a circular buffer and parsed by a state machine that identifies sentence start (`$`), field delimiters (`,`), and sentence terminators (`\r\n`). In the dashboard demo, a JavaScript timer generates synthetic NMEA GGA sentences, IMU quaternion-to-Euler conversions, and random temperature values and appends them to the scrolling serial stream display using `insertAdjacentHTML` on a pre-formatted code block element.

**Q4: How are the 5-Why root-cause entries validated and stored?**

Each 5-Why entry must be non-empty and at least 10 characters to prevent shallow, uninformative entries. Client-side validation in JavaScript checks character count before enabling the Save button. On the server side, the C# REST endpoint validates that the `DefectId` exists and belongs to the current operator's station, that the entry index (1–5) is sequential with no gaps, and that the entry text passes a profanity/content filter. Validated entries are written to the `FiveWhyEntry` table with the operator ID, timestamp, and sequence number. The 5-Why chain is considered complete when all five entries are populated; at that point, the UI enables the 8D Corrective Action form. All entries are immutable after submission; corrections require creating a superseding entry with a reference to the original, maintaining a full audit trail as required by AS9100.

**Q5: What does the live KPI dashboard display and how are the metrics calculated?**

The live KPI dashboard displays four primary metrics. Test Coverage is the ratio of test steps executed to total test steps defined in the sequence, expressed as a percentage. First-Pass Yield (FPY) is the ratio of LRUs that passed all tests on the first attempt (without retest) to the total LRUs tested in the current shift; it is a standard manufacturing quality indicator. Throughput (UUT/hr) is calculated as the number of Units Under Test completed in the last 60 minutes, updated every minute by querying `TestReport` records with a `CompletedAt` timestamp within the rolling window. The ARINC waveform canvas renders a time-domain view of the last 256 ARINC 429 word transitions, drawing bit cells at the standard 10 µs/bit rate using HTML5 Canvas 2D API with `moveTo` and `lineTo` calls inside a `requestAnimationFrame` loop.

**Q6: How does the cross-platform mobile build pipeline work for this project?**

The Android APK is built from the Kotlin source in `android/kamps-factory/` (a representative Android module) using Gradle. The release APK is signed with a keystore defined in `local.properties` and assembled with `./gradlew assembleRelease`. The iOS IPA is built using Xcode's archive workflow: `xcodebuild archive -scheme AvionicsTEST -archivePath build/AvionicsTEST.xcarchive`, followed by `xcodebuild -exportArchive -archivePath build/AvionicsTEST.xcarchive -exportPath build/ipa -exportOptionsPlist ExportOptions.plist`. Both builds are triggered by the GitHub Actions workflow `.github/workflows/release-android.yml` on `workflow_dispatch` or `v*` tag pushes, and the resulting artifacts are attached to the GitHub Release as downloadable assets.

---

## 4. Testing & Quality Q&A

**Q1: How would unit tests be structured for the ARINC 429 decode logic?**

ARINC 429 decode logic is pure functional computation — given a 32-bit input word, produce a structured output object — which makes it ideal for table-driven unit testing. In C/C++, test cases use Google Test with parameterized fixtures (`TEST_P`). Each test case provides a known 32-bit hex word and asserts the expected label number (octal), parameter name, SSM status, SDI bits, decoded engineering value (with tolerance for floating-point BNR decode), and parity check result. Edge cases include words with all-zeros data (NCD status), maximum positive and negative BNR values, BCD-encoded labels, and intentional parity errors. In JavaScript, Vitest or Jest parameterized tests (`test.each`) cover the same cases for the dashboard's decode function. The test suite should achieve 100% branch coverage on the decode function since incorrect decoding of safety-critical flight parameters could result in dangerous maintenance actions.

**Q2: How is integration testing performed for the TestStand sequence runner?**

Integration testing for NI TestStand sequences is performed using the TestStand API (`TS.Engine`) in a headless mode. A C# test harness instantiates a `TS.Engine` object, loads the sequence file, configures a simulated hardware mode (where all NI-DAQmx and NI-VISA calls are intercepted by a simulation layer), executes the sequence, and asserts on the `ResultList` object returned by TestStand. Simulated instrument responses are injected via a configuration file that maps VISA resource names to response scripts. This approach validates the sequence logic — step ordering, limit checking, branching on fail, and cleanup execution — without requiring physical PXI hardware. The integration test suite runs in the CI/CD pipeline (Azure DevOps) as part of the nightly build.

**Q3: What testing strategy applies to the C# WebSocket server?**

The C# WebSocket server is tested at three levels. Unit tests (xUnit) mock the `ITestStandEngine` dependency and verify that received `StepComplete` events are correctly serialized to JSON and enqueued for broadcast. Integration tests use `Microsoft.AspNetCore.TestHost` to host the WebSocket server in-process and connect a test WebSocket client (`ClientWebSocket`) to verify end-to-end message delivery within a timeout. Load tests (using NBomber or k6) simulate 50 concurrent dashboard clients receiving 20 messages per second per client and verify that P99 latency remains below 200 ms and no messages are dropped. These load test targets reflect the worst-case scenario of a large test station with multiple operator screens and a supervisory monitoring console.

**Q4: How are analog signal conditioning measurements validated for accuracy?**

Analog measurement validation is performed using a calibrated reference standard (e.g., a Fluke 5522A Multi-Product Calibrator) to inject known voltage signals at the PXI input and compare the measured values against the calibrator's traceable reference. The acceptance criterion is that the measured value must be within ±0.1% of the reference value plus the instrument's specified absolute accuracy at the configured range. This calibration is performed at the start of each shift and recorded in the `CalibrationRecord` table. A `CalibrationDue` flag is checked by the TestStand sequence at startup; if the calibration has expired (configurable interval, typically 8 hours for production or 12 months for periodic calibration), the sequence halts and prompts the operator to recalibrate before proceeding. This aligns with ISO 17025 measurement traceability requirements.

**Q5: What code quality gates are enforced in the CI/CD pipeline?**

The Azure DevOps pipeline enforces the following quality gates before a build artifact is promoted to the test station: static analysis using PC-lint Plus (C/C++) and SonarQube (C#) with zero new critical or high findings; unit test pass rate of 100% with minimum 80% line coverage (92% achieved per the project description); ARINC 429 decode golden-reference test suite pass (all 64 defined labels decode correctly against known reference data); and a manual code review approval from at least one senior engineer before merge to the `main` branch. Additionally, the release build must pass a smoke test suite that exercises the top-level TestStand sequence in simulation mode and verifies that all five sub-sequences complete without unhandled exceptions.

---

## 5. Security Q&A

**Q1: How is operator authentication handled in the test station software?**

Operator authentication uses Active Directory (AD) integration via LDAP. Operators log in with their Windows domain credentials; the C# service validates the credentials against the corporate AD using `PrincipalContext.ValidateCredentials`. Upon successful authentication, a JWT is issued with claims including the operator's ID, display name, station identifier, and role (Operator, Engineer, Supervisor, Administrator). The JWT is signed with an RSA-256 private key held in Windows Certificate Store and verified by all service endpoints using the corresponding public key. Session tokens expire after 8 hours (one shift), after which the operator must re-authenticate. All authentication events (login, logout, failed attempt) are written to the `AuditLog` table.

**Q2: How does the system protect against unauthorized test sequence modification?**

Test sequence files (`.seq`) are stored in a Git repository with branch protection rules that require pull request review by a Verification Engineer before merging. The sequence loader in C# computes a SHA-256 hash of the `.seq` file at load time and compares it against a signed manifest stored in the configuration database. If the hashes do not match, the sequence is rejected and an alert is raised. This prevents tampering with sequence files on the file system between deployments. Additionally, NI TestStand's built-in password protection can be applied to sequence files to prevent modifications without the correct password, providing a defense-in-depth layer independent of the file-system hash check.

**Q3: What network security controls are applied to the WebSocket server?**

The WebSocket server listens on WSS (WebSocket Secure, TLS 1.3) using a certificate issued by the corporate PKI. Connections from the web dashboard are restricted to the test station's local subnet via a firewall rule; external connections require a VPN. The mobile apps connect over HTTPS/WSS with certificate pinning — the server's public key fingerprint is embedded in the mobile app bundle and verified using `OkHttp CertificatePinner` (Android) and a custom `URLSession` delegate with `SecTrustEvaluateWithError` (iOS). WebSocket frame payloads are authenticated by including the operator JWT in the `Authorization` WebSocket header on the initial handshake; the server validates the JWT before upgrading the HTTP connection to WebSocket.

**Q4: How is sensitive test data (PII, proprietary LRU data) protected?**

Test reports may contain LRU serial numbers, operator names, and measurement data that are proprietary to the aircraft manufacturer. Data at rest is encrypted using Transparent Data Encryption (TDE) in SQL Server or AES-256 column-level encryption for particularly sensitive fields. Data in transit is protected by TLS 1.3 on all network connections. Access to the test database is granted only to the `TestStationService` Windows service account and the `TestEngineer` AD security group; individual operators do not have direct database access. Test reports exported to PDF or ATML format are watermarked with the operator's name and export timestamp. Exported files are logged in the `ExportAuditLog` table. Long-term data retention and deletion follow the aircraft manufacturer's data management policy, typically 10–20 years for airworthiness records.

**Q5: What security considerations apply to the iframe-embedded web demo?**

The web demo is rendered in an `<iframe>` with the `sandbox="allow-scripts allow-same-origin"` attribute, which prevents the demo from accessing the parent page's DOM, initiating form submissions, opening new windows, or invoking browser APIs such as `navigator.geolocation`. A Content Security Policy (CSP) header is set on the hosting page with `frame-src 'self'` to prevent the iframe from loading content from unauthorized origins. The demo itself does not make external network requests; all data is generated in JavaScript within the sandbox. A `<meta http-equiv="X-Frame-Options" content="SAMEORIGIN">` tag prevents the demo page from being embedded in third-party sites, reducing clickjacking risk.

---

## 6. Source Code Update Guide

### Prerequisites

- Node.js 18+ and npm 9+ (for the Next.js portfolio that hosts the demo)
- .NET 8 SDK (for the C# WebSocket aggregation service)
- NI TestStand 2021 or later (for sequence editing)
- LabWindows/CVI 2020 or later (for C code modules)
- Android Studio Flamingo or later (for the Android Kotlin app)
- Xcode 15 or later (for the iOS Swift/SwiftUI app)
- Git 2.40+

### Updating the Dashboard Demo (HTML/JavaScript)

1. Clone the repository and navigate to the demo directory:
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer/public/projects/avionics-test-systems
   ```

2. Open `index.html` in your editor. The file is self-contained and includes inline CSS and JavaScript.

3. To update test step definitions, locate the `TEST_STEPS` array near the top of the `<script>` block and add or modify step objects:
   ```javascript
   const TEST_STEPS = [
     { name: 'LRU Power-On Self-Test', duration: 1200, outcome: 'pass' },
     { name: 'ARINC 429 Label 0o101 Altitude', duration: 800, outcome: 'pass' },
     // Add new steps here
   ];
   ```

4. To update the ARINC 429 label dictionary, locate the `ARINC_LABELS` object and add new label-to-parameter mappings:
   ```javascript
   const ARINC_LABELS = {
     '0o101': { name: 'Altitude', units: 'ft', encoding: 'BNR', resolution: 0.125 },
     // Add new labels here
   };
   ```

5. To modify KPI thresholds for in-spec/out-of-spec coloring, update the `ANALOG_LIMITS` object:
   ```javascript
   const ANALOG_LIMITS = {
     ch1: { min: 4.75, max: 5.25, units: 'V' },
     // Update limits per channel
   };
   ```

6. Save and open `index.html` in a browser to verify changes visually before committing.

### Updating the C# Aggregation Service

1. Navigate to the service project:
   ```bash
   cd src/AvionicsTEST.Service
   ```

2. Add new NuGet packages if required:
   ```bash
   dotnet add package <PackageName> --version <Version>
   ```

3. Update the `StepResultHandler.cs` to handle new TestStand event types.

4. Update `appsettings.json` for new configuration values (station ID, WebSocket port, database connection string).

5. Run unit tests after changes:
   ```bash
   dotnet test tests/AvionicsTEST.Service.Tests --logger trx
   ```

### Updating the Android App

1. Open Android Studio and load the project from `android/book-app/` (or the avionics-specific module).
2. Update the WebSocket server URL in `NetworkConfig.kt`:
   ```kotlin
   const val WS_BASE_URL = "wss://your-test-station-host:8443/ws"
   ```
3. Update version code and name in `build.gradle.kts`:
   ```kotlin
   versionCode = 2
   versionName = "1.1.0"
   ```
4. Add new data classes in `data/model/` for any new JSON payload fields.
5. Update `StepResultAdapter.kt` for any new RecyclerView columns.

### Updating the iOS App

1. Open the Xcode project in `ios/AvionicsTEST/`.
2. Update `NetworkManager.swift` with the new WebSocket URL.
3. Add new `Codable` structs for new data fields in `Models/`.
4. Increment the build number in the Xcode project settings (`CURRENT_PROJECT_VERSION`).
5. Update the certificate pin hash in `NetworkManager.swift` if the server certificate has been renewed.

---

## 7. Build & Compile Instructions

### Next.js Portfolio (Web Demo Host)

```bash
# Install dependencies
cd /path/to/FullStackEngineer
npm install

# Run development server
npm run dev           # http://localhost:3000

# Production build (static export to out/)
npm run build

# Verify the output
ls out/projects/avionics-test-systems/
```

### C# Aggregation Service

```bash
cd src/AvionicsTEST.Service

# Restore NuGet packages
dotnet restore

# Build in Release mode
dotnet build --configuration Release

# Publish self-contained executable for Windows x64
dotnet publish --configuration Release \
  --runtime win-x64 \
  --self-contained true \
  --output publish/win-x64

# Run locally for development
dotnet run --configuration Debug
```

### C/C++ ARINC 429 Code Module (LabWindows/CVI)

```bash
# Build using LabWindows/CVI command-line compiler
cvi /b "ARINC429Decode.prj"

# Or using MSVC for standalone DLL
cl /W4 /WX /O2 /LD arinc429_decode.c arinc429_encode.c \
  /Fe:ARINC429.dll /link /DEF:ARINC429.def
```

### Android APK

```bash
cd android

# Debug build
./gradlew assembleDebug

# Release build (requires keystore in local.properties)
./gradlew assembleRelease

# Output location
ls book-app/build/outputs/apk/release/
```

### iOS IPA (requires macOS with Xcode)

```bash
cd ios/AvionicsTEST

# Resolve Swift Package Manager dependencies
xcodebuild -resolvePackageDependencies

# Archive
xcodebuild archive \
  -scheme AvionicsTEST \
  -configuration Release \
  -archivePath build/AvionicsTEST.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/AvionicsTEST.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptions.plist
```

---

## 8. Deployment Guide

### Development Environment

1. Start the Next.js development server:
   ```bash
   npm run dev
   ```
2. Access the demo at `http://localhost:3000/projects/avionics-test-systems`.
3. For the C# service, run with the `Development` environment flag:
   ```bash
   ASPNETCORE_ENVIRONMENT=Development dotnet run
   ```
4. The service connects to a local SQLite database (`avionics_dev.db`) in development mode.

### Staging Environment

1. Build the Next.js static site:
   ```bash
   npm run build
   ```
2. Upload the `out/` directory to the staging server or CDN (Netlify, Vercel, or S3 + CloudFront).
3. Deploy the C# service to the staging Windows Server:
   ```powershell
   # Copy publish artifacts
   Copy-Item -Recurse publish\win-x64\* \\staging-server\apps\avionicstest\

   # Restart Windows Service
   Restart-Service -Name "AvionicsTEST.Service" -ComputerName staging-server
   ```
4. Run integration tests against the staging endpoints:
   ```bash
   dotnet test tests/AvionicsTEST.Integration.Tests \
     --environment Staging \
     --logger trx --results-directory TestResults/
   ```

### Production Deployment

1. Tag the release in Git to trigger the GitHub Actions CI/CD pipeline:
   ```bash
   git tag -a v1.2.0 -m "Release 1.2.0 — ARINC 825 support"
   git push origin v1.2.0
   ```
2. The CI pipeline performs: lint → unit tests → integration tests → Docker build → artifact upload → deployment to production servers.
3. The Next.js static site is deployed to Netlify (or equivalent CDN) via the `deploy.yml` workflow.
4. The C# service is deployed to production Windows Server via a PowerShell DSC script that validates the file hash before replacing the existing binary.
5. Android APK and iOS IPA are attached as GitHub Release assets automatically by the `release-android.yml` workflow.
6. Post-deployment smoke tests are executed automatically; if they fail, the pipeline triggers an automatic rollback by reinstating the previous deployment artifact.

### NI TestStand Deployment to Test Station

1. Export the sequence bundle (`.seq` files + code modules + configuration) using the NI TestStand Deployment Utility.
2. Transfer the bundle to the test station using a secure file transfer (SFTP or encrypted USB drive, per the data classification policy).
3. Run the station installation script (`InstallSequence.bat`) which copies files, registers DLLs, and validates the SHA-256 hash against the signed manifest.
4. Log into the test station UI with Supervisor credentials and run the `VerificationSuite` sequence in simulation mode to confirm correct installation.
5. Record the installation in the `StationConfigLog` table with the sequence version, installer name, and timestamp.

---

## 9. Full-Scale Adaptation Notes

### Hardware Integration

To operate with real PXI hardware, replace the JavaScript simulation layer with REST/WebSocket calls to the C# service that wraps actual NI-DAQmx, NI-VISA, and ARINC 429 board drivers. The instrument abstraction layer (`IInstrumentDriver` interface) makes this substitution straightforward — swap the `SimulatedInstrumentDriver` registration in the DI container for the `NiInstrumentDriver` implementation.

### Database Scalability

For high-volume production environments (multiple test stations running 24/7), migrate from SQLite to SQL Server 2022 or PostgreSQL 16. Partition the `TestReport` and `MeasurementResult` tables by date to maintain query performance as the dataset grows. Add read replicas for the reporting and analytics workloads to avoid contention with the write path from TestStand.

### Multi-Station Orchestration

In a factory with dozens of test stations, a central orchestration layer is needed. A message broker (RabbitMQ or Azure Service Bus) can aggregate events from all stations into a factory-wide data lake. An Operations Dashboard application (React + SignalR) provides supervisors with a real-time overview of all stations, aggregate FPY and throughput KPIs, and alerts for stations in a failure state.

### Compliance and Certification

For software used in airworthiness-affecting roles, a DO-178C Software Development Plan (SDP), Software Verification Plan (SVP), and Software Configuration Management Plan (SCMP) must be drafted and approved by a Designated Engineering Representative (DER). The source code repository must be placed under a Configuration Management tool with baseline labeling, change control, and problem report tracking (e.g., IBM DOORS + Rational ClearCase, or Jira + Git with traceability links). All software artifacts (source, tests, review records) must be archived in accordance with 14 CFR Part 21 / EASA Part 21 retention requirements.

### Security Hardening for Production

Replace the self-signed development certificate with a certificate from the corporate PKI or a trusted CA. Implement role-based access control (RBAC) at the database level, restricting each service account to only the tables and operations it requires. Enable SQL Server Audit to log all data access. Apply the principle of least privilege to all Windows service accounts running the C# service and TestStand engine. Conduct an annual penetration test of the network-facing WebSocket and REST endpoints and remediate findings before the next station software deployment.

### Monitoring and Alerting

Integrate the C# service with an APM tool (Datadog, Elastic APM, or Azure Application Insights) to capture request latency, error rates, and custom metrics (sequence execution time, instrument communication errors). Configure alerts for: instrument communication failure (VISA timeout), test sequence abort rate exceeding 5% per shift, and WebSocket disconnections lasting more than 30 seconds. Feed aggregated KPIs into a Grafana dashboard backed by InfluxDB for long-term trending of FPY and throughput across stations and shifts.
