# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('config', 'config'), ('gui', 'gui'), ('loggers', 'loggers'), ('hardware', 'hardware'), ('parsers', 'parsers')],
    hiddenimports=['can.interfaces.vector', 'can.interfaces.socketcan', 'can.interfaces.pcan', 'can.interfaces.ixxat', 'can.interfaces.slcan', 'cantools.database', 'cantools.database.can', 'cantools.database.dbc', 'PyQt5.QtCore', 'PyQt5.QtGui', 'PyQt5.QtWidgets', 'loggers.data_logger', 'loggers.report_generator', 'parsers.dbc_parser', 'parsers.cdd_parser', 'parsers.message_processor', 'hardware.vector_interface', 'hardware.can_detector', 'config.settings'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='CAN_Analyzer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
