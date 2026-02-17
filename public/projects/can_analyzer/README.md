# CAN Analyzer

A professional automotive CAN bus analysis tool with a PyQt5 GUI interface, designed for debugging and analyzing CAN network communications.

## 🚗 Features

- 🔌 **CAN Interface Support** - Connect to various CAN hardware adapters
- 📊 **Real-time Monitoring** - Live CAN message viewing and analysis
- 📝 **Message Parsing** - Decode CAN messages using DBC files
- 💾 **Data Logging** - Record CAN traffic to SQLite database
- 📄 **PDF Reports** - Generate professional analysis reports
- 🖥️ **Modern GUI** - User-friendly PyQt5 interface

## 🛠 Tech Stack

- **GUI Framework**: PyQt5
- **CAN Protocol**: python-can
- **Message Parsing**: cantools
- **Serial Communication**: pyserial
- **Report Generation**: pdfkit, wkhtmltopdf
- **Database**: SQLite3
- **Templates**: Jinja2

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager
- wkhtmltopdf (for PDF generation)

### Setup
```bash
# Install dependencies
pip install -r requirements.txt

# For building Windows executables
pip install -r requirements_build.txt
```

### Installing wkhtmltopdf
**Windows:**
- Download from: https://wkhtmltopdf.org/downloads.html
- Add to system PATH

**Linux:**
```bash
sudo apt-get install wkhtmltopdf
```

**macOS:**
```bash
brew install wkhtmltopdf
```

## 🚀 Running the Application

### Development Mode
```bash
python main.py
```

### Building Executable

**Windows:**
```bash
python build_windows.py
```

**Cross-platform:**
```bash
python build_exe.py
```

The built executable will be in the `dist/` directory.

## 📁 Project Structure

```
can_analyzer/
├── main.py                 # Application entry point
├── gui/                    # PyQt5 GUI components
│   └── main_window.py     # Main application window
├── hardware/              # CAN hardware interfaces
├── parsers/               # Message parsing logic
├── loggers/               # Data logging functionality
├── config/                # Configuration files
├── can_data.db           # SQLite database
└── dist/                 # Built executables
```

## 🔧 Configuration

The application supports various CAN interfaces:
- SocketCAN (Linux)
- PCAN (Peak Systems)
- Vector CANoe/CANalyzer
- Kvaser
- USB-to-CAN adapters

Configure your interface in the application settings or via the GUI.

## 📊 Features in Detail

### Real-time Monitoring
- View CAN messages as they arrive
- Filter by CAN ID, data, or timestamp
- Pause/resume monitoring
- Adjustable update rates

### Message Parsing
- Import DBC files for automatic message decoding
- View signal values in engineering units
- Display message metadata and descriptions

### Data Logging
- Record all CAN traffic to SQLite database
- Timestamp each message
- Export logs to CSV or other formats
- Replay recorded sessions

### Report Generation
- Generate PDF reports of CAN analysis
- Include message statistics
- Show signal trends over time
- Customizable report templates

## 🐛 Testing

```bash
# Test Python imports
python test_imports.py

# Run application in debug mode
python main.py
```

## 📝 Usage Tips

1. **Connect to CAN Interface**: Select your CAN hardware from the interface menu
2. **Load DBC File**: Import your vehicle's DBC file for message decoding
3. **Start Monitoring**: Begin capturing CAN traffic
4. **Analyze Data**: Use filters and search to find specific messages
5. **Generate Report**: Export your analysis to PDF

## 🔒 Requirements

See `requirements.txt` for all dependencies:
- PyQt5 >= 5.15.0
- python-can >= 4.0.0
- cantools >= 36.0.0
- pyserial >= 3.5
- pdfkit >= 1.0.0
- Jinja2 >= 3.0.0

## 🚢 Deployment

The application can be distributed as:
- **Executable** - Standalone .exe for Windows
- **Python Package** - Install via pip
- **Portable** - Run from USB drive with Python installed

## 📄 License

MIT License - Kevin Douglas Delong

## 🤝 Compatible With

- Vector CANoe/CANalyzer products
- PEAK PCAN interfaces
- Kvaser CAN interfaces
- SocketCAN (Linux)
- USB-to-CAN adapters
