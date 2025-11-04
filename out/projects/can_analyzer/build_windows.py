#!/usr/bin/env python3
import PyInstaller.__main__
import os
import shutil
import sys
import platform

def check_dependencies():
    """Check if all required packages are installed"""
    required_packages = ['PyQt5', 'can', 'cantools', 'serial']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"Missing packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install " + " ".join(missing_packages))
        return False
    return True

def build_executable():
    print("Starting build process...")
    print(f"Python version: {platform.python_version()}")
    print(f"Platform: {platform.system()} {platform.release()}")
    
    # Clean previous builds
    for folder in ['build', 'dist']:
        if os.path.exists(folder):
            print(f"Cleaning {folder} folder...")
            shutil.rmtree(folder)
    
    # PyInstaller configuration
    pyinstaller_args = [
        'main.py',
        '--name=CAN_Analyzer',
        '--onefile',
        '--windowed',  # No console window
        # '--console',  # Uncomment if you want console output
        
        # Add data files
        '--add-data=config;config',
        '--add-data=gui;gui',
        '--add-data=loggers;loggers',
        '--add-data=hardware;hardware',
        '--add-data=parsers;parsers',
        
        # Hidden imports
        '--hidden-import=can.interfaces.vector',
        '--hidden-import=can.interfaces.socketcan',
        '--hidden-import=can.interfaces.pcan',
        '--hidden-import=can.interfaces.ixxat',
        '--hidden-import=can.interfaces.slcan',
        '--hidden-import=cantools.database',
        '--hidden-import=cantools.database.can',
        '--hidden-import=cantools.database.dbc',
        '--hidden-import=PyQt5.QtCore',
        '--hidden-import=PyQt5.QtGui',
        '--hidden-import=PyQt5.QtWidgets',
        '--hidden-import=loggers.data_logger',
        '--hidden-import=loggers.report_generator',
        '--hidden-import=parsers.dbc_parser',
        '--hidden-import=parsers.cdd_parser',
        '--hidden-import=parsers.message_processor',
        '--hidden-import=hardware.vector_interface',
        '--hidden-import=hardware.can_detector',
        '--hidden-import=config.settings',
        
        # Build options
        '--clean',
        '--noconfirm',
    ]
    
    # Add icon if exists
    if os.path.exists('icon.ico'):
        pyinstaller_args.append('--icon=icon.ico')
        print("Using custom icon...")
    else:
        print("No custom icon found, using default...")
    
    try:
        print("Starting PyInstaller...")
        PyInstaller.__main__.run(pyinstaller_args)
        print("Build completed successfully!")
        
        # Check if executable was created
        exe_path = os.path.join('dist', 'CAN_Analyzer.exe')
        if os.path.exists(exe_path):
            print(f"Executable created: {exe_path}")
            print(f"File size: {os.path.getsize(exe_path) / (1024*1024):.2f} MB")
        else:
            print("Executable not found in dist folder!")
            
    except Exception as e:
        print(f"Build failed: {e}")
        return False
    
    return True

if __name__ == '__main__':
    if check_dependencies():
        if build_executable():
            print("\n🎉 Build successful! Check the 'dist' folder for CAN_Analyzer.exe")
        else:
            print("\n❌ Build failed!")
            sys.exit(1)
    else:
        sys.exit(1)