#!/usr/bin/env python3
import PyInstaller.__main__
import os
import shutil

def build_executable():
    # Clean up previous builds
    if os.path.exists('build'):
        shutil.rmtree('build')
    if os.path.exists('dist'):
        shutil.rmtree('dist')
    
    # PyInstaller command
    PyInstaller.__main__.run([
        'main.py',
        '--name=CAN_Analyzer',
        '--onefile',
        '--windowed',  # Use --console if you want to see console output
        '--icon=icon.ico',  # Optional: add an icon file
        '--add-data=config;config',
        '--add-data=gui;gui',
        '--hidden-import=can.interfaces.vector',
        '--hidden-import=can.interfaces.socketcan',
        '--hidden-import=can.interfaces.pcan',
        '--hidden-import=can.interfaces.ixxat',
        '--hidden-import=cantools.database',
        '--hidden-import=cantools.database.can',
        '--hidden-import=PyQt5.QtCore',
        '--hidden-import=PyQt5.QtGui',
        '--hidden-import=PyQt5.QtWidgets',
        '--hidden-import=loggers',
        '--hidden-import=parsers',
        '--hidden-import=hardware',
        '--hidden-import=config',
        '--clean',
        '--noconfirm',
    ])

if __name__ == '__main__':
    build_executable()