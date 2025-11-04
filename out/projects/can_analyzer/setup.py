from setuptools import setup, find_packages

setup(
    name="can_analyzer",
    version="1.0.0",
    description="Vector CAN Bus Analyzer Application",
    packages=find_packages(),
    install_requires=[
        "PyQt5>=5.15.0",
        "python-can>=4.0.0",
        "cantools>=36.0.0",
        "pyserial>=3.5",
    ],
    python_requires=">=3.8",
)