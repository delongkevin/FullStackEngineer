# Medical IoT Device Monitor — Technical Q&A Documentation

**Project:** MedIoT Connect  
**Client:** DornerWorks  
**Slug:** `dornerworks-iot`  
**Category:** Mobile  
**Live Demo:** `/projects/dornerworks-iot/index.html`  
**Repository:** [github.com/delongkevin/FullStackEngineer](https://github.com/delongkevin/FullStackEngineer)  
**Mobile Builds:** [Latest Release](https://github.com/delongkevin/FullStackEngineer/releases/latest)

---

## Overview

MedIoT Connect is a cross-platform medical IoT application demonstrating enterprise-grade mobile development across iOS (Swift/Xcode), Android (Kotlin/Android Studio), Flutter, and React Native. The application simulates a real-world clinical IoT deployment: BLE 5.x connectivity to cardiac monitors, infusion pumps, and ventilators; NFC patient wristband pairing; live ECG traces; and wearable integration across Apple Watch (WatchKit), Wear OS, and Garmin Connect IQ. Security is enforced throughout via AES-256 encryption, certificate pinning, biometric authentication, and HIPAA-compliant data handling patterns. REST APIs are secured with OAuth 2.0 and JWT, and distribution covers the App Store, Play Store, TestFlight, and enterprise ad-hoc channels.

---

## 1. Architecture & Design Q&A

**Q1. How is the application architected across its four target platforms (iOS Swift, Android Kotlin, Flutter, React Native), and what shared-layer strategy is employed?**

The project adopts a "core-shared, shell-native" architecture. Business logic — device state machines, BLE session management, FHIR data models, and OAuth token lifecycle — is placed in platform-agnostic layers. On iOS, this is a Swift package (local SPM module) consumed by both the WatchKit extension and the main app target. On Android, it is a pure-Kotlin module shared between the phone module and the Wear OS companion module via Gradle multi-module configuration. The Flutter and React Native variants consume the same REST API contract and share a TypeScript-defined OpenAPI schema, ensuring all four surfaces render identical vital data. The UI shells are fully native per platform to preserve platform conventions (SwiftUI/UIKit on iOS, Jetpack Compose on Android) while cross-platform variants (Flutter/React Native) use declarative widget trees with platform-channel bridges for BLE and biometric access.

**Q2. What design patterns govern BLE device lifecycle management across all platforms?**

BLE lifecycle is modeled using a finite-state machine (FSM) with six states: `Idle`, `Scanning`, `Connecting`, `Connected`, `Streaming`, and `Error`. State transitions are driven by platform BLE delegate callbacks (iOS `CBCentralManagerDelegate`, Android `BluetoothGattCallback`). On iOS, the FSM lives in a `DeviceSession` actor (Swift concurrency), ensuring thread-safe state mutations. On Android, it is a Kotlin `StateFlow`-backed `ViewModel` in the `core-ble` module. Flutter and React Native consume state over a method channel (`MedIoTBleChannel`) that marshals events as JSON payloads. Reconnection employs an exponential back-off with a cap of 30 seconds, and a watchdog timer triggers a full re-scan if the device is silent for more than 10 seconds — critical for medical-grade reliability.

**Q3. How does the application structure its HIPAA-compliant data pipeline from BLE packet ingestion to persistent storage?**

Raw BLE notifications arrive as binary characteristic values and are immediately parsed by codec layers specific to each device profile (cardiac monitor: IEEE 11073-10406 waveform; infusion pump: proprietary TLV; ventilator: HL7 FHIR R4 Observation resource). Parsed vitals are held in an in-memory circular ring buffer (2,048 samples per channel) for real-time display. Any sample persisted to disk is first encrypted with AES-256-GCM using a device-bound key stored in the Secure Enclave (iOS) or Android Keystore. Database writes go through a repository layer that enforces a "minimum necessary" access policy — only the fields required for the current user's clinical role are written. PHI fields (patient name, MRN, DOB) are stored in separate encrypted tables with role-based column-level access controls, satisfying HIPAA §164.312(a)(2)(iv) technical safeguards.

**Q4. Describe the OAuth 2.0 and JWT integration pattern used for REST API authentication.**

The application implements the OAuth 2.0 Authorization Code flow with PKCE (RFC 7636), which is mandatory for public mobile clients. On launch, the app checks the Keychain (iOS) / EncryptedSharedPreferences (Android) for a valid refresh token. If present and unexpired, it performs a silent token refresh against the authorization server (configurable endpoint in `AppConfig.plist` / `config.properties`). On expiry, a native ASWebAuthenticationSession (iOS) or Custom Chrome Tab (Android) opens the authorization URL, capturing the authorization code via a deep-link redirect URI (`mediot://oauth/callback`). The access token is a signed RS256 JWT carrying `sub`, `scope`, `iat`, and `exp` claims. Every API request attaches the token in the `Authorization: Bearer` header. On 401 responses, the token refresh path is retried once before forcing re-authentication — preventing token cycling attacks.

**Q5. How does certificate pinning work in MedIoT Connect, and what is the fallback strategy when a certificate is rotated?**

Certificate pinning is implemented via SHA-256 SPKI pin sets, not leaf-certificate pinning, to survive routine certificate renewals while still blocking MITM attacks. On iOS, pinning is enforced in a custom `URLSession` delegate that overrides `urlSession(_:didReceive:completionHandler:)` and compares the server's public key digest against a compiled list of pins stored in `Pins.plist`. On Android, OkHttp's `CertificatePinner` applies the same SHA-256 pins. The pin set includes both the current and next-rotation pins so that pre-staged rotations do not cause outages. A fallback grace period is configurable: if the server returns a special `X-Pin-Rotation-Deadline` header, the app accepts the new pin up to 72 hours before deprecating the old one. Pin updates are delivered via a signed over-the-air configuration payload (not the full app binary), reducing emergency deployment lead times.

**Q6. What wearable integration architecture supports Apple Watch, Wear OS, and Garmin Connect IQ simultaneously?**

Each wearable target is treated as a satellite display consuming a stripped-down representation of the phone's current device session. On Apple Watch, the WatchKit extension connects to the phone companion via `WCSession` (WatchConnectivity framework), receiving `applicationContext` updates for current heart rate, SpO₂, and alert flags at 1 Hz. The extension renders an MVVM SwiftUI complication and a full watch app face with a scrolling ECG mini-trace using `TimelineProvider`. On Wear OS, the Kotlin `DataLayer` API replicates a `DataMap` from the phone's `WearableListenerService` to the watch's `DataLayerListenerService`. Garmin Connect IQ is handled separately: the phone pushes vitals to a Garmin Express–compatible Connect IQ companion app written in Monkey C, using the Garmin Mobile SDK's `GarminSDK` iOS/Android bridge. Each wearable receives only de-identified, aggregated vital readings — raw waveform data never leaves the phone.

**Q7. How are real-time ECG traces rendered performantly across platforms without dropping samples at medical-grade 500 Hz acquisition rates?**

The ECG rendering engine is a custom Metal shader (iOS) / OpenGL ES 3.0 canvas (Android). On iOS, a `CAMetalLayer`-backed view receives vertex buffers populated from the ring buffer by a background serial dispatch queue. The shader renders a continuous rolling waveform by scrolling vertex X-coordinates on each display link tick, avoiding full redraws. On Android, a `SurfaceView` with a dedicated render thread draws segments using `Canvas.drawLines()` from a pre-allocated `float[]` pool, eliminating GC pressure during sustained streaming. In Flutter, a custom `CustomPainter` subclass receives down-sampled data (250 Hz) via a `StreamController` and paints bezier-smoothed polylines. React Native uses a `react-native-skia` canvas for GPU-accelerated path rendering. Each platform maintains a 10-second rolling display window with configurable gain and sweep speed — matching clinical monitor conventions.

**Q8. What NFC pairing workflow is used for patient wristband association, and how is the session cryptographically bound?**

NFC pairing uses ISO 14443-A Type 2 NDEF tags embedded in patient wristbands. On iOS, the `Core NFC` framework's `NFCNDEFReaderSession` reads a wristband tag containing a signed CBOR payload: `{ patient_id, session_nonce, timestamp, device_id }`, signed with the facility's Ed25519 private key. The app verifies the signature against a pinned public key from the `TrustStore.bundle`. On successful verification, the `session_nonce` is combined with the phone's `device_id` using HKDF-SHA256 to derive a 256-bit session binding key. Subsequent BLE and REST communications include an HMAC over each request body using this key, providing request-level authenticity tied to the physical patient tag scan. The binding expires after 8 hours or on patient discharge, whichever occurs first, and the nonce is single-use — preventing replay attacks using a previously captured NFC tag read.

---

## 2. Technology Stack Q&A

**Q1. Why was Swift chosen for the iOS target over a pure Flutter or React Native implementation?**

Swift with SwiftUI was chosen for the iOS native target because medical-grade hardware access — specifically the Core NFC framework for Type 2 NDEF tags, CoreBluetooth's `CBCentralManager` with background-mode BLE, HealthKit for biometric data, and WatchConnectivity for seamless Apple Watch bridging — requires direct framework access without plugin intermediaries. Plugin-based BLE libraries in Flutter and React Native introduce an additional abstraction layer that can delay characteristic notifications by one or more event-loop cycles. At 500 Hz ECG acquisition, even a 2 ms jitter is clinically significant. Additionally, App Transport Security (ATS) and the Secure Enclave integration for AES-256 key storage are most cleanly expressed in native Swift, where KeychainServices APIs are type-safe and Codable-compatible.

**Q2. What motivated the decision to include both Flutter and React Native in the same project?**

Including both cross-platform runtimes serves a portfolio demonstration purpose as well as a technical evaluation purpose. Flutter's Dart-based single-code-tree approach compiles to ARM machine code via Ahead-Of-Time (AOT) compilation, giving it performance closer to native for animation-heavy screens like the live ECG trace. React Native's JavaScript thread model — with the new Fabric renderer and JSI (JavaScript Interface) — is more suitable for teams already invested in TypeScript/React ecosystems and allows direct web component reuse. For DornerWorks' embedded systems clients, who often deploy to both iOS medical tablets and Android kiosk hardware, having both pathways demonstrated side-by-side provides a concrete basis for platform selection decisions in real procurement contexts.

**Q3. Describe BLE 5.x features leveraged beyond classic BLE 4.2 capabilities.**

BLE 5.x provides four key advances exploited in this application. First, the 2 Mbps PHY doubles throughput for ECG waveform characteristic notifications compared to the 1 Mbps BLE 4.2 PHY — allowing 12-lead waveform data (approximately 9,600 bytes/s at 500 Hz × 16 channels × 16-bit) to be transmitted within a single connection interval without fragmentation. Second, Extended Advertising packets (up to 1,650 bytes vs. 31 bytes in 4.2) carry full device metadata in the advertisement payload, eliminating the need for a separate GATT service discovery round-trip during initial connection. Third, Coded PHY (125 kbps, 500 kbps) with forward error correction supports reliable connectivity in electrically noisy ICU environments. Fourth, BLE 5.x's improved co-existence features reduce interference with 802.11ax Wi-Fi channels — essential in hospital environments where both are simultaneously active.

**Q4. How does the TypeScript OpenAPI schema serve as a contract across the four mobile platforms?**

The `openapi.yaml` schema is the single source of truth for all REST API shapes. A code-generation step in the CI pipeline uses `openapi-generator-cli` to produce Swift `Codable` structs (generator: `swift5`), Kotlin data classes (generator: `kotlin`), Dart model classes (generator: `dart`), and TypeScript interfaces (generator: `typescript-axios`) from the same schema file. All four platform clients are therefore guaranteed to serialize and deserialize identical JSON payloads without hand-written mapping code. When the backend team updates an endpoint, they bump the OpenAPI schema version, the CI pipeline regenerates all four client libraries, and compilation errors in any platform surface breaking changes before any mobile code is merged.

**Q5. What role does WatchKit play versus Wear OS in the wearable stack, and what are the key technical differences?**

WatchKit (Apple Watch) and Wear OS (Android) differ fundamentally in their communication models. WatchKit extensions run directly on the watch hardware and communicate with the paired iPhone over a proprietary Apple BT/Wi-Fi link via the `WatchConnectivity` framework. The phone acts as a gateway: it maintains the BLE session with the medical device and pushes derived vitals to the watch. Wear OS uses the `Wearable.DataClient` and `MessageClient` APIs over a similarly proprietary Android BT channel, but the programming model is more symmetric — both phone and watch run independent Android processes. Key technical differences: WatchKit complications must use `TimelineEntry`-based data, suitable for periodic updates, whereas Wear OS tiles use `TileService` with a push-update model. Garmin Connect IQ is the most constrained platform: it uses a resource-limited Monkey C VM, supports only integer arithmetic, and communicates via a Garmin-proprietary BLE profile over the Garmin Mobile SDK, requiring a separate SDK integration on both iOS and Android phone sides.

**Q6. How is HIPAA compliance architecturally enforced rather than bolted on after development?**

HIPAA compliance is treated as an architectural constraint from the start using Privacy by Design principles. The data model is annotated with sensitivity classifications at the field level: `@PHI`, `@DeIdentified`, `@Administrative`. The persistence layer's repository protocol enforces that any field tagged `@PHI` must pass through the encryption gateway before being written to SQLite (iOS: GRDB with SQLCipher; Android: Room with SQLCipher). Network transport enforces TLS 1.3 minimum via ATS configuration (`NSMinimumTLSVersion: TLSv1.3`) on iOS and OkHttp's `ConnectionSpec.RESTRICTED_TLS` on Android. Audit logging for PHI access is implemented as a cross-cutting concern via a repository decorator pattern — every PHI read or write emits an audit event to an append-only local log that is periodically synced to the HIPAA-compliant audit service. Minimum-necessary access is enforced via role scopes in the JWT, and the app enforces these scopes client-side before even making an API call.

**Q7. What is the distribution strategy across App Store, Play Store, TestFlight, and enterprise ad-hoc channels?**

Each distribution channel has a distinct build configuration in both Xcode and Gradle. `Debug` builds target internal simulators and connect to a local mock BLE server (`MockBLEPeripheral` on iOS, `MockBluetoothAdapter` on Android). `Staging` builds target TestFlight (iOS) and Firebase App Distribution (Android) — these builds use a staging OAuth server, staging certificate pins, and synthetic patient data. `Release` builds target the App Store and Play Store, with production pins and production OAuth endpoints baked in at compile time via build-time environment variable injection (`xcconfig` on iOS, `buildConfigField` on Android). Enterprise ad-hoc distribution uses Apple Developer Enterprise Program certificates with an MDM-managed provisioning profile, allowing silent over-the-air installation on hospital-owned iPads without App Store review — critical for rapid clinical iteration.

**Q8. How is OAuth 2.0 PKCE implemented on mobile without a client secret?**

PKCE (Proof Key for Code Exchange) eliminates the need for a client secret by generating a cryptographically random `code_verifier` (43–128 characters, base64url-encoded) at the start of each authorization flow. The `code_challenge` is computed as `BASE64URL(SHA-256(code_verifier))` and sent in the initial authorization request. The authorization server stores the challenge. When the app exchanges the authorization code for tokens, it sends the original `code_verifier`; the server re-hashes it and compares to the stored challenge. Since an intercepted authorization code is useless without the `code_verifier` (known only to the originating app instance), the flow is secure without a static secret. On iOS, `AuthenticationServices.ASWebAuthenticationSession` handles the redirect interception. On Android, a `CustomTabsIntent` with an intent-filter on the redirect URI handles the callback. The `code_verifier` is stored ephemerally in process memory only — never written to disk or logs.

---

## 3. Features & Implementation Q&A

**Q1. How are the three simulated medical devices (cardiac monitor, infusion pump, ventilator) differentiated at the BLE GATT layer?**

Each device type is identified during BLE scanning by its advertised service UUID in the advertisement payload. Cardiac monitors advertise UUID `0x180D` (Heart Rate Service) plus a custom UUID `F3E1xxxx-...` for the 12-lead waveform service. Infusion pumps advertise a custom manufacturer-specific UUID conforming to a proprietary infusion pump profile modeled after Baxter's IEC 62443-referenced profile. Ventilators advertise the standard Health Device Profile (HDP) UUID `0x1400` plus a `Respiratory Rate` characteristic UUID. After connection, GATT service discovery populates a `DeviceProfile` enum (`cardiac | infusionPump | ventilator`) that drives which codec, UI template, and alert thresholds are active for that session. Each profile registers distinct GATT notifications: cardiac monitors notify on the ECG waveform characteristic at 500 Hz; infusion pumps notify on a flow-rate characteristic at 1 Hz; ventilators notify on tidal volume and FiO₂ at 5 Hz.

**Q2. Describe the live ECG alert system — how are arrhythmia alerts detected and surfaced to the clinician?**

The alert engine runs a simplified Pan-Tompkins QRS detector on the incoming 500 Hz ECG stream. R-peak intervals are computed in a background thread, and the RR interval history is maintained in a 30-beat deque. Deviation from the mean RR interval beyond ±20% for three consecutive beats triggers a potential arrhythmia event. The event is classified (sinus tachycardia, bradycardia, irregular) and dispatched to the alert manager, which applies a clinical escalation hierarchy: first a non-intrusive banner notification, then an audible tone (using `AVAudioEngine` on iOS / `AudioManager` on Android), and finally — for critical events — a full-screen takeover alert requiring clinician acknowledgment. All alerts are logged with a `POSIX` timestamp and device session ID for audit purposes. Wearable companions receive the alert state via `WCSession`/`DataClient` within 500 ms and display a haptic alert on Apple Watch or Wear OS.

**Q3. How is the infusion pump rate control implemented, and what safety interlocks are in place?**

Infusion rate adjustments are sent as GATT write-with-response commands to the pump's `Flow Rate Set Point` characteristic. The command payload is a structured TLV: `{ tag: 0x01, length: 4, value: float32_ml_hr }`. Before writing, the app enforces client-side range validation against the drug-specific dose table fetched from the REST API (`GET /api/v1/drug-limits/{ndc_code}`). The allowable range is also stored in the pump's `Rate Limits` characteristic, and the app reads this on connection to enforce a hardware-backed ceiling. A confirmation round-trip is required: after writing the set point, the app reads back the `Flow Rate Actual` characteristic within 2 seconds to verify the pump accepted the command. If the readback differs by more than 0.5 mL/hr, an `InfusionDiscrepancy` alert is raised. These interlocks simulate IEC 60601-1 risk management requirements for programmable medical devices.

**Q4. How does the NFC patient wristband pairing flow work from a UX perspective, and what feedback is provided?**

The NFC pairing UX is a three-step modal flow. Step 1: the clinician taps "Pair Patient" — the app requests NFC entitlement via `NFCNDEFReaderSession` (iOS) or `NfcAdapter.enableReaderMode()` (Android) and displays a full-screen animated NFC scan indicator with instructional copy. Step 2: on successful tag read, the CBOR payload is decoded and the patient identity is displayed for visual confirmation — name (truncated), MRN suffix, and room number. The clinician confirms or cancels. Step 3: on confirmation, the session binding key is derived and a success haptic with a green checkmark animation is shown. The active patient name badge then appears in the navigation bar for the remainder of the session. Error states are handled gracefully: tag read timeout (10 s) shows an actionable "Try Again" state; signature verification failure shows a "Wristband Not Recognized" error with a contact-IT CTA; expired nonce shows a "Wristband Expired — Request New Tag" message.

**Q5. What does the "professional medical-grade UI/UX" entail in design system terms?**

The design system follows FDA Human Factors Engineering (HFE) guidance for medical device software (FDA 2016 HFE Guidance) and IEC 62366-1. Key design decisions: a dark-background theme with high-contrast waveform colors (ECG: lime green `#00FF41`; SpO₂: cyan; temp: amber) matching clinical monitor conventions to reduce cognitive load for clinicians trained on GE/Philips monitors. Alert colors strictly follow IEC 60601-1-8: red for critical, amber for serious, cyan for advisory, white for informational — never swapped. Touch targets for all interactive controls are a minimum of 9mm × 9mm (per FDA HFE guidance) to support gloved-hand operation. Typography uses SF Pro Display (iOS) / Roboto (Android) at a minimum body size of 16pt for readability under varying ICU lighting conditions. Animation is kept purposeful — only waveform scrolling and alert state transitions animate; decorative animations are suppressed in the accessibility settings path for cognitively impaired users.

**Q6. How is background BLE session continuity maintained when the app moves to the background on iOS?**

iOS background BLE requires the `bluetooth-central` UIBackgroundMode to be declared in `Info.plist`. With this entitlement, `CBCentralManager` can continue to receive characteristic notifications while the app is in the background, but with throttled delivery (system batches notifications). For ECG data at 500 Hz, raw waveform delivery in the background is not guaranteed — instead, the app subscribes to a lower-rate `Alert Status` characteristic (1 Hz) that the medical device synthesizes from its own onboard processor. This characteristic carries pre-computed alert flags (arrhythmia, lead-off, battery-critical) rather than raw samples. The iOS app processes these flags and generates local `UNNotificationRequest` alerts if a critical event is detected — surfacing a lock-screen notification to the clinician even when the app is backgrounded. Full waveform streaming resumes automatically when the app returns to the foreground.

**Q7. Describe the patient management dashboard and how patient records are organized across sessions.**

The patient management screen presents a `UICollectionView` (iOS) / `RecyclerView` (Android) of active patient sessions, each rendered as a card showing: patient alias (de-identified in demo mode), room/bed assignment, monitored device count, most recent vital values, and alert badge count. Sessions are persisted in the encrypted local database and survive app restarts. Each session is identified by a `session_uuid` generated at NFC pairing time, and all GATT data records are foreign-keyed to this UUID. A session can be in one of three states: `Active` (live BLE connection), `Paused` (NFC-paired but BLE disconnected), or `Archived` (patient discharged). Archived sessions are retained for 30 days (configurable for facility compliance requirements) before automatic secure deletion using NIST SP 800-88 media sanitization — overwriting the SQLite page, then vacuuming the database to reclaim storage.

**Q8. What push notification strategy is used for over-threshold alerts, and how does it integrate with wearable companions?**

Push notifications use APNs (iOS) and FCM (Android) for remote, server-originated alerts when the app is not running (e.g., clinician has left the unit). The REST API's alert service evaluates streamed vital telemetry from the BLE gateway (a background service running on a bedside tablet) and calls APNs/FCM with a `critical` notification category on iOS — bypassing silent mode to play an audible alert tone in clinical environments. On iOS 15+, time-sensitive notifications are used for moderate alerts, ensuring delivery even in Focus modes. When the app is foregrounded, local in-app alerts take precedence and the push is silently dismissed. The Apple Watch companion receives alert state updates via `WCSession.transferCurrentComplicationUserInfo()` (high-priority complication updates) and via `WKExtendedRuntimeSession` for real-time streaming during an active monitoring session without the watch going to sleep.

---

## 4. Testing & Quality Q&A

**Q1. What is the overall testing strategy, and what frameworks are used per platform?**

Each platform has a dedicated test framework: iOS uses XCTest for unit tests and XCUITest for UI automation; Android uses JUnit 5 with Mockito for unit tests and Espresso for instrumented UI tests; Flutter uses the `flutter_test` package with `mockito` for unit/widget tests; React Native uses Jest with React Native Testing Library. Integration tests that span the BLE-to-UI data flow use a `MockBLEPeripheral` (iOS: `CBPeripheralManager` simulation; Android: `BluetoothLeAdvertiser` mock) to inject synthetic ECG and vital data at configurable rates and error conditions. The CI pipeline runs all unit and widget tests on every pull request; instrumented and UI tests run on a nightly schedule against real device farm environments (Firebase Test Lab for Android, Xcode Cloud for iOS).

**Q2. How is BLE connectivity tested in a deterministic, repeatable way without physical medical hardware?**

The `MockBLEPeripheral` module simulates the GATT service tree of each device type in software. On iOS, it is a separate `CBPeripheralManager`-based process that runs in the Simulator — advertising the cardiac monitor's service UUID and sending synthetic ECG waveform notifications driven by a pre-recorded 30-second NSR (Normal Sinus Rhythm) dataset stored as a binary fixture file. Error injection is configurable via environment variables: `BLE_SIMULATE_DISCONNECT_AFTER=5s`, `BLE_SIMULATE_NOISY_RSSI=true`, `BLE_SIMULATE_WRONG_PIN=true`. This allows CI to test reconnection logic, error state recovery, and pin verification failures without physical hardware. On Android, `Robolectric`'s `ShadowBluetoothAdapter` is extended with a custom shadow that replays the same fixture dataset, enabling unit-level tests of the BLE FSM without any Android device.

**Q3. What security-specific tests are run, and how is HIPAA compliance validated in the test suite?**

Security tests include: (1) certificate pinning rejection tests — a `MockURLSession` returns a certificate from a different CA and the test asserts that the connection is rejected; (2) AES-256 round-trip tests — data is encrypted, written to the test database, re-read, and decrypted, verifying byte-for-byte identity; (3) token expiry tests — the token is back-dated by 1 hour and the test asserts that the app routes to the re-authentication flow rather than making an API call with an expired token; (4) unauthorized role tests — a JWT with `scope: nurse` is used to attempt a `scope: physician`-only endpoint and the test asserts a 403 response is handled gracefully without crashing; (5) NFC replay tests — the same CBOR nonce is presented twice and the test asserts that the second presentation is rejected. HIPAA field-level encryption compliance is validated by a `PHIAuditTest` that reads the raw SQLite file bytes and asserts that known PHI strings are absent from the plaintext pages.

**Q4. How is the ECG rendering performance tested to ensure it meets the 500 Hz requirement?**

Performance tests use `XCTest`'s `measure` block (iOS) and `BenchmarkRule` (Android Jetpack Benchmark) to measure frame rendering time under load. The test fixture replays 60 seconds of 12-lead ECG data at 500 Hz into the rendering pipeline and asserts that the 99th-percentile frame render time is below 16.6 ms (60 FPS). On iOS Metal, `MTLCommandBuffer` completion handlers are used to measure GPU commit-to-presentation latency. Memory pressure is also asserted: the ring buffer must not grow beyond its 2,048-sample ceiling. A dedicated leak test uses `XCTest`'s memory graph snapshot before and after a full 60-second streaming session and asserts zero leaked `DeviceSession` or `ECGSampleBuffer` instances.

**Q5. How is cross-platform parity validated — ensuring the iOS, Android, Flutter, and React Native apps behave identically?**

Cross-platform parity is enforced by a shared contract test suite written against the OpenAPI schema. A Pact broker generates consumer-driven contract tests: each mobile client generates a pact file describing its expectations of the REST API, and these pacts are verified against the actual API in CI. For BLE data interpretation, a canonical fixture JSON file (`vitals_fixture_v1.json`) contains reference vital values decoded from a canonical BLE binary blob. Each platform's codec implementation is tested against this fixture: given the binary blob, the decoded `HeartRate`, `SpO₂`, and `ECGSample` values must match the reference JSON to four decimal places. Any platform-specific deviation fails CI, ensuring codec parity. UI parity is checked via screenshot comparison tests using Percy (React Native), Flutter's `goldenFileComparison`, and iOS Snapshot testing (`FBSnapshotTestCase`).

**Q6. What quality gates are enforced in the CI/CD pipeline before a build is promoted to TestFlight or Firebase App Distribution?**

Quality gates in the CI pipeline include: (1) SwiftLint / Detekt / flutter analyze / ESLint — zero warnings policy for all four platforms; (2) unit test pass rate — 100% of unit tests must pass; (3) code coverage — minimum 80% line coverage enforced via Codecov with PR status checks; (4) security scan — Dependabot alerts and `trivy` container scan (for any bundled dependencies) must return zero critical or high CVEs; (5) binary size check — iOS IPA and Android APK must not exceed size budget thresholds (iOS: 75 MB, Android: 50 MB) to maintain OTA update viability; (6) privacy manifest validation — iOS PrivacyInfo.xcprivacy must declare all API usage reasons required by App Store Review since iOS 17; (7) accessibility audit — XCUITest runs a `AXAudit` pass on every screen and asserts zero accessibility violations.

---

## 5. Security Q&A

**Q1. How is AES-256 encryption implemented for data at rest, and where are the encryption keys stored?**

AES-256-GCM is used for all PHI at rest. On iOS, the encryption key is a 256-bit random key generated by `SecRandomCopyBytes` and stored in the Keychain under a `kSecAttrAccessibleWhenUnlockedThisDeviceOnly` access control policy — the key never leaves the Secure Enclave and is bound to the device's UID. Database operations use GRDB with the SQLCipher extension; the SQLCipher passphrase is derived from the Keychain key using PBKDF2-HMAC-SHA256 with 100,000 iterations and a device-unique salt. On Android, the key is generated by `KeyGenerator` backed by the Android Keystore system, also bound to the device and requiring user authentication for `ENCRYPT` operations. Room with SQLCipher uses the same PBKDF2-derived passphrase pattern. Key rotation is implemented annually or on device transfer: the old database is decrypted and re-encrypted with a new key derived from a new Keystore entry.

**Q2. How does biometric authentication integrate with PHI access controls?**

Biometric authentication (Face ID / Touch ID on iOS; fingerprint / face on Android) is required at two points: app launch (replacing the PIN for low-risk unlock) and before displaying any PHI field. On iOS, `LAContext.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics)` is called before any PHI-containing view appears. The Keychain item storing the session token carries a `kSecAccessControl` created with `SecAccessControlCreateWithFlags` using `.biometryAny` + `.privateKeyUsage`, meaning the OS requires a successful biometric evaluation before allowing the Keychain item to be read — not just a software check. On Android, `BiometricPrompt` with `CryptoObject` wrapping the Keystore `Cipher` instance enforces the same hardware-level gate. Failed biometric attempts (>3 in 60 s) lock the session and require re-authentication via the OAuth flow, providing defense-in-depth against device theft.

**Q3. What App Transport Security (ATS) configuration is applied, and what exceptions, if any, are necessary?**

The `NSAppTransportSecurity` dictionary in `Info.plist` mandates TLS 1.3 (`NSMinimumTLSVersion: TLSv1_3`), forward secrecy (`NSRequiresForwardSecrecy: true`), and certificate transparency (`NSRequiresCertificateTransparency: true`) for all connections. No `NSAllowsArbitraryLoads` exceptions are permitted. The only domain-specific exception is the on-premises MQTT broker endpoint used in some hospital configurations, which may present a self-signed certificate on the internal network — this is handled by trust evaluation through a custom `TrustKit` integration that accepts facility-provided root CA certificates pre-loaded into the app bundle (pinned to a hash) rather than the system trust store. The BLE gateway localhost connection (used for debugging with a wired proxy) is excluded from ATS using `NSLocalNetworkUsageDescription` and a domain exception for `localhost` only in debug builds.

**Q4. How is audit logging implemented to satisfy HIPAA §164.312(b) audit control requirements?**

The audit log is implemented as an append-only SQLite table (`phi_audit_log`) with write permissions but no delete or update permissions granted at the SQLite connection level (enforced via `PRAGMA writable_schema = OFF` and a separate read-write connection exclusively for audit writes). Each audit record contains: `timestamp` (POSIX microseconds), `user_id` (from JWT `sub` claim), `action` (READ / WRITE / DELETE / EXPORT), `resource_type` (PATIENT / VITAL / SESSION), `resource_id` (UUID), and `ip_address` (for API calls). The audit table is stored in a separate SQLCipher database from the PHI tables, with a distinct encryption key, so that PHI data corruption cannot affect the audit record integrity. Audit records are periodically exported (batch sync) to the HIPAA-compliant audit cloud service over mutual TLS. The local audit DB is retained for 90 days before rotation to comply with HIPAA's 6-year record-retention requirement via the cloud copy.

**Q5. What protections guard against BLE spoofing and man-in-the-middle attacks on medical device communications?**

BLE MITM protection is multi-layered. At the BLE pairing level, LE Secure Connections (LESC) with Numeric Comparison association model is used for initial device pairing — the clinician verifies a 6-digit passkey displayed on both the medical device and the mobile app, preventing passive eavesdropping and MITM during pairing. The resulting LTK (Long-Term Key) stored in the phone's BLE bonding database is used to encrypt all subsequent BLE sessions (AES-CCM, 128-bit). At the application layer, the BLE device's application-layer messages include an HMAC-SHA256 MAC using the session binding key derived during NFC pairing — any tampered characteristic value fails MAC verification and raises a `DataIntegrityAlert`. Device identity is additionally verified via an X.509 certificate stored in a locked GATT characteristic: on first connect, the app performs a challenge-response using the device's private key (held in the device's secure element) to authenticate the hardware identity against a pinned device CA certificate.

**Q6. How is the application hardened against reverse engineering and binary tampering?**

On iOS, bitcode is disabled (to prevent re-optimization by Apple) and symbol stripping (`STRIP_INSTALLED_PRODUCT = YES`) removes all debug symbols from the release binary. The app uses the `ENABLE_HARDENED_RUNTIME` entitlement which enables: JIT prevention, library injection blocking, and memory protection. On Android, ProGuard R8 obfuscation with a custom obfuscation rule set is applied, removing class and method names from the DEX bytecode. Root detection (`RootBeer` library) and emulator detection are checked at launch; if triggered, the app refuses to display PHI and logs a `SECURITY_TAMPER` audit event. The app binary's code signature is validated at launch using the native `SecStaticCodeCheckValidity` (iOS) / `PackageManager.GET_SIGNATURES` with a pinned signing certificate hash (Android). For the production release, Google Play Integrity API (Android) and Apple's DeviceCheck / App Attest (iOS) provide server-verified attestation that the app binary has not been tampered with before the OAuth server issues a token.

---

## 6. Source Code Update Guide

### Prerequisites

- macOS 14+ (Sequoia) for iOS/macOS builds
- Xcode 16+ with iOS 18 SDK
- Android Studio Iguana (2023.2.1+) with Kotlin 2.0
- Flutter SDK 3.22+ (`flutter --version`)
- Node.js 20 LTS with npm 10+ (React Native)
- CocoaPods 1.15+ (`pod --version`)

### Repository Structure

```
FullStackEngineer/
├── android/mediot/          # Kotlin Android source
│   ├── app/src/main/
│   ├── core-ble/            # Shared BLE module
│   └── wear/                # Wear OS companion
├── ios/MedIoT/              # Swift Xcode project
│   ├── MedIoT/              # Main app target
│   ├── MedIoTWatch/         # WatchKit extension
│   └── Packages/CoreBLE/    # SPM local package
├── flutter/mediot_flutter/  # Flutter cross-platform
├── react-native/MedIoTRN/   # React Native app
├── openapi/openapi.yaml     # Shared API contract
└── scripts/                 # Code generation scripts
```

### Updating iOS Source

1. Open `ios/MedIoT/MedIoT.xcworkspace` in Xcode.
2. BLE device profiles are in `ios/MedIoT/Packages/CoreBLE/Sources/CoreBLE/Profiles/`. Add new profiles by creating a new `.swift` file conforming to `DeviceProfileProtocol`.
3. Update REST models by running: `cd scripts && ./gen-models.sh --platform swift5` — this regenerates `ios/MedIoT/Generated/APIModels/`.
4. Update `AppConfig.plist` for new environment endpoints or pin sets.
5. Run `pod install --repo-update` in `ios/MedIoT/` if any CocoaPod dependencies changed.

### Updating Android Source

1. Open `android/mediot/` in Android Studio.
2. BLE FSM logic lives in `core-ble/src/main/kotlin/com/mediot/ble/`. Update `DeviceStateMachine.kt` for new transition logic.
3. Regenerate Kotlin models: `cd scripts && ./gen-models.sh --platform kotlin`
4. Update `app/src/main/res/raw/config.properties` for staging/production endpoint changes.
5. Sync Gradle: `./gradlew --refresh-dependencies`

### Updating Flutter Source

1. Navigate to `flutter/mediot_flutter/`.
2. BLE plugin bridge is in `lib/services/ble_service.dart`. Update method channel calls to match any native changes.
3. Run `flutter pub get` after modifying `pubspec.yaml`.
4. Regenerate Dart models: `cd scripts && ./gen-models.sh --platform dart`

### Updating React Native Source

1. Navigate to `react-native/MedIoTRN/`.
2. API layer is in `src/api/`. Update `vitalsApi.ts` for new endpoints.
3. Regenerate TypeScript types: `cd scripts && ./gen-models.sh --platform typescript-axios`
4. Run `npm install` after `package.json` changes.
5. Run `npx pod-install` for iOS pod updates.

---

## 7. Build & Compile Instructions

### iOS Build

```bash
# Install dependencies
cd ios/MedIoT
pod install

# Command-line build (release)
xcodebuild \
  -workspace MedIoT.xcworkspace \
  -scheme MedIoT \
  -configuration Release \
  -destination "generic/platform=iOS" \
  -archivePath build/MedIoT.xcarchive \
  archive

# Export IPA for App Store
xcodebuild \
  -exportArchive \
  -archivePath build/MedIoT.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptions-AppStore.plist

# Export IPA for TestFlight
xcodebuild \
  -exportArchive \
  -archivePath build/MedIoT.xcarchive \
  -exportPath build/ipa-tf \
  -exportOptionsPlist ExportOptions-TestFlight.plist
```

### Android Build

```bash
cd android/mediot

# Debug build
./gradlew assembleDebug

# Staging build
./gradlew assembleStagingRelease

# Production release (requires keystore)
export KEYSTORE_PATH=/path/to/mediot-release.jks
export KEY_ALIAS=mediot
export STORE_PASSWORD=<secret>
export KEY_PASSWORD=<secret>
./gradlew assembleProductionRelease

# Output: app/build/outputs/apk/production/release/app-production-release.apk

# Bundle for Play Store
./gradlew bundleProductionRelease
# Output: app/build/outputs/bundle/production/release/app-production-release.aab
```

### Flutter Build

```bash
cd flutter/mediot_flutter
flutter pub get

# iOS release
flutter build ios --release --flavor production

# Android release APK
flutter build apk --release --flavor production \
  --build-name=2.1.0 --build-number=210

# Android App Bundle
flutter build appbundle --release --flavor production
```

### React Native Build

```bash
cd react-native/MedIoTRN
npm install

# iOS
npx pod-install
npx react-native build-ios --mode Release --scheme MedIoTRN-Production

# Android
cd android
./gradlew assembleRelease
```

### OpenAPI Code Generation

```bash
cd scripts
npm install -g @openapitools/openapi-generator-cli

./gen-models.sh  # runs all four platforms sequentially
# Equivalent to:
openapi-generator-cli generate -i ../openapi/openapi.yaml -g swift5 -o ../ios/MedIoT/Generated
openapi-generator-cli generate -i ../openapi/openapi.yaml -g kotlin -o ../android/mediot/core-api/generated
openapi-generator-cli generate -i ../openapi/openapi.yaml -g dart -o ../flutter/mediot_flutter/lib/generated
openapi-generator-cli generate -i ../openapi/openapi.yaml -g typescript-axios -o ../react-native/MedIoTRN/src/generated
```

---

## 8. Deployment Guide

### Development Environment

**iOS Simulator:**
```bash
xcrun simctl list devices available
xcodebuild -workspace ios/MedIoT/MedIoT.xcworkspace \
  -scheme MedIoT-Dev \
  -destination "platform=iOS Simulator,name=iPhone 16 Pro" \
  test
```

**Android Emulator:**
```bash
$ANDROID_HOME/emulator/emulator -avd Pixel_8_Pro_API_34 &
cd android/mediot && ./gradlew installDebug
```

**Flutter:**
```bash
flutter run --flavor development -t lib/main_dev.dart
```

### Staging Deployment (TestFlight / Firebase App Distribution)

**iOS → TestFlight:**
```bash
# Using Fastlane (recommended)
cd ios/MedIoT
bundle exec fastlane staging
# Fastlane lane builds, signs, and uploads to TestFlight automatically

# Manual upload via altool
xcrun altool --upload-app \
  --type ios \
  --file build/ipa-tf/MedIoT.ipa \
  --apiKey $APP_STORE_API_KEY_ID \
  --apiIssuer $APP_STORE_ISSUER_ID
```

**Android → Firebase App Distribution:**
```bash
cd android/mediot
./gradlew assembleStagingRelease
firebase appdistribution:distribute \
  app/build/outputs/apk/staging/release/app-staging-release.apk \
  --app $FIREBASE_APP_ID \
  --groups "qa-team,clinical-beta" \
  --release-notes "Staging build $(date)"
```

### Production Deployment

**iOS → App Store:**
```bash
# Fastlane production lane (includes metadata and screenshots)
bundle exec fastlane production

# Manual submit for review
xcrun altool --upload-app \
  --type ios \
  --file build/ipa/MedIoT.ipa \
  --apiKey $APP_STORE_API_KEY_ID \
  --apiIssuer $APP_STORE_ISSUER_ID
# Then submit for review via App Store Connect API or GUI
```

**Android → Play Store:**
```bash
./gradlew bundleProductionRelease
bundle exec fastlane supply \
  --aab app/build/outputs/bundle/production/release/app-production-release.aab \
  --track production \
  --json_key $PLAY_STORE_JSON_KEY
```

**Enterprise Ad-Hoc (MDM):**
```bash
# Build with enterprise distribution profile
xcodebuild ... -exportOptionsPlist ExportOptions-Enterprise.plist
# Upload IPA to MDM server (Jamf Pro, Mosyle, etc.)
curl -X POST $MDM_SERVER_URL/api/v1/apps \
  -H "Authorization: Bearer $MDM_TOKEN" \
  -F "file=@build/ipa-enterprise/MedIoT.ipa"
```

### Backend API Deployment (Kubernetes)

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets.yaml        # TLS certs, JWT keys
kubectl apply -f k8s/mediot-api.yaml     # API deployment + service
kubectl apply -f k8s/ingress.yaml        # NGINX ingress with TLS

# Verify rollout
kubectl rollout status deployment/mediot-api -n mediot
kubectl get pods -n mediot
```

---

## 9. Full-Scale Adaptation Notes

**HL7 FHIR R4 Integration:** The current demo uses a simplified vital data model. Full-scale production would replace all vitals transport with FHIR R4 `Observation`, `Patient`, and `Device` resources, enabling interoperability with EHR systems (Epic, Cerner) via SMART on FHIR OAuth.

**FDA 510(k) / SaMD Pathway:** If any alert logic (arrhythmia detection) is promoted to a clinical decision support tool, FDA Software as a Medical Device (SaMD) classification review is required. The QRS detector would need clinical validation studies and IEC 62304 software lifecycle documentation.

**Real BLE Hardware Integration:** Replace `MockBLEPeripheral` with certified medical device SDKs (e.g., Masimo's Open Connect, Nihon Kohden, Dräger API). Each device SDK has proprietary GATT profile documentation under NDA.

**Scalable Backend:** The REST API backend would migrate from a single-node deployment to a horizontally scaled microservices architecture (Spring Boot or FastAPI) with a PostgreSQL cluster (AWS Aurora), Redis session cache, and Kafka event streaming for real-time telemetry ingestion from thousands of concurrent BLE gateways.

**Compliance Certifications:** Formal HIPAA Business Associate Agreements (BAAs) with all cloud vendors; SOC 2 Type II audit of the backend infrastructure; ISO 27001 ISMS implementation; FDA cybersecurity pre-market submission (per FDA 2023 Cybersecurity Guidance) including a Software Bill of Materials (SBOM) for all dependencies.

**Multi-Tenant Hospital Network:** The patient and session data model would extend to support multi-facility tenancy with strict database-level tenant isolation (PostgreSQL Row Level Security), federated identity via SAML 2.0 integration with hospital Active Directory, and RBAC with facility-configurable clinical roles.

**Offline Mode:** Full offline capability using a local FHIR server (HAPI FHIR embedded) on the bedside tablet, with background sync to the cloud EHR when connectivity is restored — critical for operating rooms and ICUs with intermittent Wi-Fi.
