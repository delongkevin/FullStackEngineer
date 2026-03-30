# Automotive CAN-Bus Logger — Technical Q&A Documentation

## Overview

The Automotive CAN-Bus Logger is a Windows desktop application that connects to a CAN (Controller Area Network) bus interface, captures and decodes CAN frames in real time, and presents them in a professional data-logging interface. Built with Python and distributed as a Windows executable (`.exe`) via PyInstaller, the application targets automotive engineers and embedded systems developers who work with Vector CANoe products, USB-to-CAN adapters, or virtual CAN channels. The application implements the CAN protocol per ISO 11898 and uses the `python-can` library as its driver abstraction layer.

- **Category:** Automotive / Desktop Application  
- **Tech Stack:** Python, python-can, Tkinter (or PyQt5), HTML5/CSS3 (optional web-based UI), PyInstaller  
- **Executable:** `/projects/can_analyzer/dist/CAN_Analyzer.exe` (Windows)  
- **Embeddable:** No (native Windows executable, not a browser application)  
- **GitHub:** https://github.com/delongkevin/FullStackEngineer  
- **CAN Protocol Standard:** ISO 11898  

---

## 1. Architecture & Design Q&A

**Q1. What is the high-level architecture of the CAN-Bus Logger application?**

The application follows a layered architecture with three distinct tiers: (1) the **driver layer**, which abstracts the physical CAN interface hardware behind the `python-can` Bus API; (2) the **message processing layer**, which decodes raw CAN frames, filters messages by arbitration ID, and applies any configured DBC (database container) signal decoding; and (3) the **presentation layer**, which renders the decoded messages in a scrollable log table and optional real-time chart. This separation ensures that the hardware driver can be swapped (e.g., from a Vector XL Driver to a Peak PCAN adapter) by changing only the driver layer configuration, with no changes to message processing or UI code.

**Q2. How does the application interface with the CAN hardware?**

The application uses the `python-can` library (version 4.x), which provides a unified `can.Bus` interface supporting over 20 CAN interface backends: Vector XL (used with Vector CANoe/CANalyzer hardware), PEAK PCAN, Kvaser, SocketCAN (Linux), virtual CAN bus, and others. The backend is selected at runtime via a configuration file or command-line argument (`--interface vector --channel 0 --bitrate 500000`). The `python-can` library communicates with the hardware vendor's driver (e.g., the Vector XL Driver or PEAK PCANBasic.dll) via ctypes FFI bindings. This abstraction means the application code only ever calls `bus.recv()` and `bus.send()`, regardless of the underlying hardware.

**Q3. How are CAN frames received and processed without blocking the UI?**

CAN frame reception runs on a dedicated background thread (`threading.Thread`) separate from the UI thread. The receiver thread calls `bus.recv(timeout=0.1)` in a loop — the 0.1-second timeout ensures the thread can check a `stop_event` (a `threading.Event`) between receive calls, allowing clean shutdown without blocking. Received messages are placed into a thread-safe `queue.Queue`. The UI thread polls this queue on a timer (Tkinter's `after(50, poll_queue)` for 50ms polling, or a Qt signal/slot connection) and appends new messages to the log table. This producer-consumer pattern ensures the UI remains responsive regardless of CAN bus traffic volume.

**Q4. How is the message processing layer structured?**

The message processing layer consists of: (1) a `MessageFilter` class that accepts a list of arbitration IDs to log (an allowlist) or ignore (a blocklist); (2) an optional `DBCDecoder` class that loads a `.dbc` file and uses it to decode signal values from the raw CAN frame data bytes; and (3) a `MessageRecord` dataclass that captures the timestamp (from `can.Message.timestamp`, a float in seconds since epoch), arbitration ID (hex), DLC (data length code), raw data bytes (hex string), and decoded signal values. `MessageRecord` instances are the canonical data unit passed from the processing layer to the presentation layer.

**Q5. How is the application's configuration managed?**

Application configuration is managed via a `config.ini` file in the user's application data directory (Windows: `%APPDATA%\CAN_Analyzer\config.ini`), read using Python's `configparser` module. Key configuration sections include: `[CAN]` (interface type, channel, bitrate, sample point), `[Logging]` (output directory, log format: CSV or ASC), `[Filter]` (ID allowlist and blocklist), and `[UI]` (theme, refresh rate). A settings dialog within the application provides a GUI for editing these values without direct file editing. Configuration changes take effect on the next bus connection; the application does not hot-reload configuration mid-session.

**Q6. How does the application handle CAN bus errors, such as bus-off events?**

The `python-can` library surfaces bus error events (error frames, bus-off transitions) as `can.Message` objects with the `is_error_frame` flag set. The receiver thread checks this flag on every received message and routes error frames to a separate error log rather than the main message log. A bus-off event (where the CAN controller's error counter exceeds 255 and the controller withdraws from the bus) is detected by a separate `can.Notifier` listener that calls a `handle_bus_off()` callback on the main thread. This callback displays a modal error dialog, stops reception, and offers a "Reconnect" option that reinitializes the `can.Bus` object.

**Q7. What logging file formats are supported and how are they structured?**

The application supports two output formats: (1) **CSV**: each row contains `timestamp_ms, arbitration_id_hex, dlc, data_hex, [decoded_signals...]`. CSV is the easiest format to import into Excel, MATLAB, or Python pandas for post-processing analysis. (2) **ASC (ASCII Log Format)**: the standard Vector/CANoe log format, recognized by CANalyzer, CANdb++, and most professional CAN analysis tools. The ASC format begins with a header block (log file version, date, base timestamp) followed by one message per line in the format `{timestamp:.4f} {channel} {id_hex}x {rx} d {dlc} {data_bytes}`. Writing is performed by a `LogWriter` class that abstracts the format choice behind a common `write(record)` interface.

**Q8. How is the DBC file decoding integrated?**

DBC (database container) file parsing is handled by the `cantools` library (`pip install cantools`). On application startup (or when the user loads a DBC file via the File menu), `cantools.db.load_file(dbc_path)` parses the file and returns a `Database` object containing message and signal definitions. For each received `can.Message`, the `DBCDecoder` looks up the message definition by arbitration ID (`db.get_message_by_frame_id(msg.arbitration_id)`) and calls `message_def.decode(msg.data)`, which returns a dictionary of `{signal_name: decoded_value}`. Decoded values are appended to the `MessageRecord` and displayed as additional columns in the log table.

---

## 2. Technology Stack Q&A

**Q1. Why is Python chosen for this automotive tooling application?**

Python is the dominant language for automotive test tooling for several reasons: (1) The `python-can` library provides production-quality, MIT-licensed support for nearly every CAN interface on the market, maintained by a large open-source community and used in industry. (2) `cantools` provides robust DBC, KCD, and SYM file parsing. (3) Python's rapid development cycle enables fast prototyping of new decoding logic and filter rules. (4) Vector's CAPL (Communication Access Programming Language) and Python APIs are often used together in professional environments — Python can communicate with a running CANoe instance via the Vector XL Driver. (5) PyInstaller enables distribution as a self-contained `.exe` without requiring Python to be installed on the target machine.

**Q2. What version of Python is used and what are the minimum system requirements?**

The application targets Python 3.10 or higher (3.11 recommended for performance improvements). It requires Windows 10 or Windows 11 (64-bit) for the distributed executable. Development can occur on Windows, macOS, or Linux, but the distributed `.exe` artifact is Windows-only because Vector's XL Driver is a Windows-only DLL. If the SocketCAN backend is configured, the application can also be built for Linux. Minimum hardware: x86-64 processor, 4 GB RAM, 100 MB disk space for the executable and dependencies.

**Q3. What is `python-can` and how is it installed?**

`python-can` is an open-source Python library that provides a unified, hardware-agnostic API for CAN bus communication. It abstracts platform-specific and vendor-specific CAN interfaces behind a consistent `can.Bus(interface, channel, bitrate)` constructor and `bus.recv()` / `bus.send()` / `bus.shutdown()` methods. It is installed via `pip install python-can[vector]` (the `[vector]` extra installs the Vector XL Driver Python bindings). Other supported extras include `[pcan]` for Peak PCAN, `[kvaser]` for Kvaser, and `[virtual]` for a virtual in-process CAN bus useful for testing.

**Q4. How is the UI implemented — Tkinter, PyQt5, or a web-based frontend?**

The UI is implemented using Tkinter (Python's built-in GUI toolkit) for the primary desktop interface, supplemented with the `ttk` (themed Tkinter widgets) module for a more modern appearance. A `ttk.Treeview` widget is used for the scrollable message log table, providing sortable columns and efficient virtual rendering for large message counts. The application optionally generates an HTML/CSS report (referenced in the project description under HTML5/CSS3) as an export format — a styled HTML file containing a formatted table of all logged messages that can be opened in any browser, which is where the HTML5 and CSS3 technology applies.

**Q5. How is PyInstaller used to create the Windows executable?**

PyInstaller bundles the Python interpreter, all imported modules, and all required DLL dependencies into a single directory (`--onedir` mode) or a single file (`--onefile` mode). The recommended mode for this application is `--onedir` because it produces faster startup times (the `--onefile` mode extracts to a temp directory on each launch, which is slow for large applications) and is easier to inspect and debug. The build command includes hooks for `python-can` and `cantools` to ensure their data files (backend configs, schema files) are correctly included. A `.spec` file commits the exact PyInstaller configuration to version control for reproducible builds.

**Q6. How does the application interact with Vector CANoe specifically?**

Vector CANoe is a professional network and ECU analysis tool that uses the Vector XL Driver as its hardware access layer. The CAN-Bus Logger application can operate in two modes with Vector hardware: (1) **Direct hardware access mode**: the application opens a Vector XL channel directly using the `python-can` Vector backend, bypassing CANoe. This requires that CANoe is not simultaneously connected to the same channel. (2) **CANoe co-simulation mode**: using Vector's `CANoe COM API` (Python `win32com.client`), the application can connect to a running CANoe instance, subscribe to its CAN channel objects, and receive messages that CANoe is already processing — enabling the logger to run alongside CANoe's simulation without hardware conflicts.

---

## 3. Features & Implementation Q&A

**Q1. How does the real-time message log table handle high-volume CAN traffic?**

At 500 kbps with typical automotive frame sizes and bus loads, a CAN bus can carry 2,000–5,000 frames per second. Rendering every frame as a new row in the Tkinter `Treeview` at this rate would cause severe UI lag. The application implements three strategies to handle high traffic: (1) **Rate limiting**: the UI refresh timer updates the table at most every 50ms (20 Hz), processing all queued messages since the last update in a batch. (2) **Circular buffer**: the Treeview maintains a maximum row count (configurable, default 10,000). When the limit is reached, the oldest rows are deleted as new ones are added. (3) **Filtering**: active ID filters reduce the number of messages reaching the table, directly reducing rendering load.

**Q2. How is message timestamping performed and how accurate are the timestamps?**

Message timestamps come from the `can.Message.timestamp` field, which `python-can` populates from the hardware interface's timestamp when available. Vector XL hardware timestamps individual frames with hardware-level precision (sub-microsecond resolution using the XL Driver's internal timer). When hardware timestamping is not available (virtual bus, some USB adapters), `python-can` falls back to `time.time()` at the moment of the Python `recv()` call, which has millisecond-level precision and is subject to OS scheduling jitter. The application displays both absolute timestamps (wall clock time) and relative timestamps (milliseconds since the first received message) in the log table.

**Q3. How does the message filter work — by ID range, by mask, or by list?**

The filter supports three modes, configurable in the settings dialog: (1) **Allowlist by ID**: only messages whose arbitration ID exactly matches one of a user-specified list of IDs are logged. (2) **ID range**: messages with IDs between a `min_id` and `max_id` are logged. (3) **Mask filter**: a standard CAN acceptance filter, specified as a `(can_id, can_mask)` pair — a message passes if `(message.arbitration_id & can_mask) == (can_id & can_mask)`. The mask filter is passed to `bus.set_filters([{'can_id': id, 'can_mask': mask}])`, which applies the filter in hardware (on supported interfaces) or in software (on unsupported interfaces), with hardware filtering being far more efficient for high-volume buses.

**Q4. How is the CSV logging implemented to avoid data loss?**

The log file is opened in append mode with buffered I/O (`open(path, 'a', buffering=1)`, line-buffered). The `LogWriter.write()` method is called from the UI thread after the queue is drained, ensuring that all messages are written in received order. The file is not opened/closed per message (which would be extremely slow); instead, it is opened once at the start of a logging session and closed (with an explicit `flush()` call) when logging stops or the application exits. A `try/finally` block in the application shutdown sequence guarantees the file is flushed and closed even if the application terminates due to an unhandled exception.

**Q5. How is the HTML report generated?**

At the end of a logging session, the user can export an HTML report via the File → Export → HTML menu. The report generator iterates over all `MessageRecord` objects collected during the session and renders them into an HTML string using Python's string formatting or `jinja2` templates. The resulting HTML file embeds all CSS inline (for portability — no external stylesheets are referenced) and uses a `<table>` element with sortable columns implemented via a small inline JavaScript snippet. The file is written to the user-selected output path and can be opened in any web browser, making it easy to share with colleagues who do not have the application installed.

---

## 4. Testing & Quality Q&A

**Q1. How is the application tested when physical CAN hardware may not be available?**

Testing uses `python-can`'s virtual CAN bus backend (`interface='virtual'`), which creates an in-process virtual bus that does not require any hardware. Test scripts use `can.Bus(interface='virtual')` to create a sender bus and the application connects to the same virtual bus as the receiver. The sender bus transmits predefined test messages, and the test asserts that the application correctly received, decoded, and logged them. This approach enables full integration testing in a CI environment with no hardware dependency.

**Q2. How are the DBC decoding tests structured?**

DBC decoding tests use a small, self-contained `.dbc` test fixture file (committed to the repository) containing a handful of well-defined messages and signals. Unit tests load this fixture with `cantools`, construct `can.Message` objects with known data bytes, pass them through the `DBCDecoder`, and assert that the decoded signal values match the expected engineering values. Edge cases covered include: signals that span byte boundaries, little-endian vs. big-endian signal byte order, signed vs. unsigned integer signals, and scale/offset application (e.g., a raw value of 100 with scale 0.1 and offset -40 should decode to -30.0°C).

**Q3. What is the testing framework used?**

The project uses `pytest` for all tests. Test files are organized in a `tests/` directory mirroring the source structure. Fixtures (virtual bus instances, test DBC files, sample `MessageRecord` objects) are defined in `tests/conftest.py` and shared across test modules via `pytest` fixture injection. `pytest-mock` is used for mocking `can.Bus` hardware calls in unit tests where the virtual bus is insufficient.

**Q4. How is the threading model tested for race conditions?**

Threading tests use `time.sleep()` with generous margins to allow background threads to process messages, then assert on the queue state. More deterministic testing is achieved by using `threading.Event` synchronization: a test sets up a receiver with an event that fires when a specific message is received, sends the message from the virtual sender bus, and blocks with `event.wait(timeout=2.0)` — the test fails if the event does not fire within 2 seconds. This pattern avoids arbitrary `sleep()` calls and makes threading tests both fast and reliable.

**Q5. How is the packaged `.exe` tested before release?**

The packaged executable is tested on a clean Windows VM (Windows 10 22H2, 64-bit) with no Python installation. Smoke tests verify: (1) the application launches without errors; (2) the settings dialog opens and saves configuration correctly; (3) the virtual bus backend can be selected and a session started; (4) CSV and HTML export produce valid output files. These smoke tests are performed manually before each release. Automated smoke testing of the `.exe` can be added using Pywinauto or WinAppDriver for UI automation on Windows.

---

## 5. Security Q&A

**Q1. What are the primary security considerations for an automotive diagnostic tool?**

The application's primary security concerns are: (1) **Physical access to the CAN bus**: unauthorized CAN bus access is a vehicle cybersecurity risk. The tool should only be used by authorized personnel on test benches or development vehicles, not on production vehicles connected to safety-critical ECUs. (2) **DBC file trust**: DBC files loaded by the user could contain malformed data that crashes the `cantools` parser. The application wraps all `cantools` calls in `try/except` blocks to handle malformed DBC files gracefully. (3) **Untrusted CAN frame data**: raw CAN frame data bytes are treated as binary data and are never executed or interpreted as code — they are displayed as hex strings only.

**Q2. Is there a risk of CAN bus injection from the logger?**

In its default read-only logging mode, the application only calls `bus.recv()` and never calls `bus.send()`. The "transmit" feature (if implemented) is protected by a confirmation dialog and is disabled unless the user explicitly enables it in the settings. In a production vehicle context, any write access to the CAN bus must comply with OEM security policies and should only be used on development and test vehicles, never on production vehicles with active safety systems.

**Q3. How is the application's configuration file protected?**

The `config.ini` file is stored in the user's `%APPDATA%` directory, which is access-controlled by Windows ACLs to the current user account. The file does not contain credentials, API keys, or cryptographic secrets. If integration with a Vector CANoe license server is configured, the license is managed by the Vector License Client (a separate signed application from Vector Informatik) and is not stored in `config.ini`.

**Q4. How should the executable be secured for distribution within an organization?**

For enterprise distribution: (1) Sign the `.exe` with an Extended Validation (EV) code-signing certificate to prevent SmartScreen warnings and ensure authenticity. (2) Distribute via an internal software distribution system (Microsoft SCCM, Intune, or a network share with AD-controlled access) rather than via email or public web hosting. (3) Compute and publish a SHA-256 hash of the `.exe` alongside each release so recipients can verify the file has not been tampered with. (4) Use Windows AppLocker or WDAC policies to restrict execution of the tool to authorized machines and users.

**Q5. What are the ISO 11898 compliance implications for data logging?**

ISO 11898 defines the CAN physical and data link layer. Compliance in this context means: (1) configuring the correct bitrate (125 kbps, 250 kbps, 500 kbps, or 1 Mbps) for the target network — mismatched bitrates cause framing errors and bus disruption; (2) correctly interpreting the arbitration ID as 11-bit (standard frame) or 29-bit (extended frame, indicated by `msg.is_extended_id`); and (3) not transmitting malformed frames (incorrect DLC, invalid CRC) that could disturb bus communication. The `python-can` library enforces these constraints at the driver level when using supported hardware.

---

## 6. Source Code Update Guide

### Prerequisites
- Python 3.10 or higher (3.11 recommended), 64-bit
- pip 22+
- Git with write access to the repository
- Windows 10/11 for Vector XL Driver integration (Linux/macOS for virtual or SocketCAN development)
- Vector XL Driver 20.x+ (for Vector hardware integration; not required for virtual bus development)

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/delongkevin/FullStackEngineer.git
   cd FullStackEngineer/projects/can_analyzer
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. **Install development dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install -r requirements-dev.txt
   ```

4. **Run the application in development mode:**
   ```bash
   python src/main.py --interface virtual
   ```
   The `--interface virtual` flag starts with the in-process virtual bus, requiring no hardware.

5. **Key source files:**
   - Entry point: `src/main.py`
   - CAN driver layer: `src/can_driver.py` — `CanBusDriver` class wrapping `python-can`
   - Message processing: `src/message_processor.py` — filtering and DBC decoding
   - DBC decoder: `src/dbc_decoder.py` — `cantools`-based signal decoding
   - Log writer: `src/log_writer.py` — CSV and ASC format writers
   - UI (main window): `src/ui/main_window.py`
   - UI (settings dialog): `src/ui/settings_dialog.py`
   - Configuration: `src/config.py`

6. **Adding support for a new CAN interface backend:**
   - Add the interface name to the `SUPPORTED_INTERFACES` list in `src/config.py`
   - Add any interface-specific configuration parameters to the settings dialog
   - Test with `python-can`'s backend detection: `python -c "import can; can.Bus(interface='your_backend')"`

7. **Run tests:**
   ```bash
   pytest tests/ -v
   ```

8. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "feat: describe your change here"
   git push origin main
   ```

---

## 7. Build & Compile Instructions

### Prerequisites for Building
- All development prerequisites above
- PyInstaller 6.x: `pip install pyinstaller`
- Windows 10/11 64-bit build machine (for `.exe` output)

### Steps

1. **Ensure all tests pass:**
   ```bash
   pytest tests/ -v
   ```

2. **Review the PyInstaller spec file:**
   Open `CAN_Analyzer.spec` and verify:
   - `pathex` includes the project root
   - `datas` includes DBC schemas, the default config, and any icon files
   - `hiddenimports` includes all required `python-can` backends and `cantools` submodules

3. **Build the executable:**
   ```bash
   pyinstaller CAN_Analyzer.spec
   ```
   This generates:
   - `dist/CAN_Analyzer/CAN_Analyzer.exe` — main executable
   - `dist/CAN_Analyzer/` — all supporting DLLs and data files

4. **Verify the build on a clean system:**
   Copy `dist/CAN_Analyzer/` to a machine with no Python installation and run `CAN_Analyzer.exe`.

5. **For a single-file build (slower startup, simpler distribution):**
   ```bash
   pyinstaller --onefile --name CAN_Analyzer --icon assets/icon.ico src/main.py
   ```
   Output: `dist/CAN_Analyzer.exe`

6. **Code-sign the executable (production releases only):**
   ```bash
   signtool sign /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 \
     /f certificate.pfx /p password dist\CAN_Analyzer\CAN_Analyzer.exe
   ```

---

## 8. Deployment Guide

### Internal Network Share Distribution

1. Build the executable as described above.
2. Compute the SHA-256 hash:
   ```cmd
   certutil -hashfile dist\CAN_Analyzer\CAN_Analyzer.exe SHA256
   ```
3. Copy the `dist/CAN_Analyzer/` folder to an internal network share:
   ```cmd
   xcopy /E /I dist\CAN_Analyzer\ \\server\software\CAN_Analyzer\v1.0.0\
   ```
4. Publish release notes and the SHA-256 hash to the team wiki.

### Windows Installer (MSI) via WiX

1. Install WiX Toolset 4.x.
2. Create a `CAN_Analyzer.wxs` WiX source file defining the installation directory, shortcuts, and registry entries.
3. Build the MSI:
   ```bash
   wix build CAN_Analyzer.wxs -o dist/CAN_Analyzer_Setup.msi
   ```
4. Sign the MSI with the code-signing certificate.
5. Distribute via SCCM/Intune for automated enterprise deployment.

### GitHub Releases

1. Create a GitHub release tagged with the version number (e.g., `v1.2.0`).
2. Upload `dist/CAN_Analyzer.exe` (or the MSI) and the SHA-256 hash file as release assets.
3. The release description should include: version changelog, minimum system requirements, and the SHA-256 verification instructions.

---

## 9. Full-Scale Production Adaptation Notes

To evolve the CAN-Bus Logger into a production-grade automotive data acquisition and analysis platform:

- **CAN FD Support:** Extend the driver layer to support CAN FD (CAN with Flexible Data-rate, ISO 11898-7), which allows up to 8 Mbps data phase bitrate and 64-byte payloads. `python-can` supports CAN FD on compatible hardware (Vector XL, Kvaser). Update the log writer and DBC decoder to handle extended frame formats.
- **Multi-Channel Support:** Support simultaneous logging across multiple CAN channels (CAN1, CAN2, LIN, FlexRay) within a single session, with channel-tagged message records and per-channel filtering. This is essential for full-vehicle network analysis.
- **LIN Bus Support:** Extend the driver layer to support LIN (Local Interconnect Network) using `python-can`'s LIN interface or a dedicated LIN library, capturing LIN frames from body control modules and other low-speed nodes.
- **UDS Diagnostic Support:** Implement a UDS (Unified Diagnostic Services, ISO 14229) client layer on top of the CAN driver, enabling the tool to send diagnostic requests (read DTC, read data by identifier, clear DTCs) and display the responses. This transforms the logger into a basic diagnostic tool comparable to Vector's CANdito.
- **Database-Backed Session Storage:** Replace CSV/ASC flat-file storage with a SQLite or PostgreSQL database for session data. This enables fast indexed queries (e.g., "show all messages with ID 0x200 between timestamp T1 and T2") and long-duration logging without memory exhaustion.
- **Web-Based Dashboard:** Build a Flask or FastAPI backend that reads session data from the database and serves a React-based analysis dashboard, enabling remote review of captured data without installing the desktop application.
- **Real-Time Signal Plotting:** Integrate `matplotlib` or a PyQtGraph widget for real-time plotting of decoded signal values (e.g., engine RPM, vehicle speed) as time-series charts, providing immediate visual insight into dynamic system behavior.
- **Automated Regression Testing:** Integrate the logger into a CI/CD pipeline for HIL (Hardware-in-the-Loop) testing: configure it to capture CAN traffic during automated test scenarios, compare against golden reference log files, and flag any frame-level deviations as test failures.
- **AUTOSAR-Compliant Logging:** Add support for MDF4 (Measurement Data Format 4.x, ASAM MDF standard) log output, which is the industry-standard format for automotive measurement data, compatible with ETAS INCA, Vector DAQsys, and all major automotive post-processing tools.
- **OEM Security Requirements:** For deployment in a vehicle connected to safety-critical networks (ADAS, powertrain), comply with ISO/SAE 21434 automotive cybersecurity engineering requirements and UNECE WP.29 cybersecurity regulations. This includes penetration testing of the tool, threat analysis and risk assessment (TARA), and secure update mechanisms.
