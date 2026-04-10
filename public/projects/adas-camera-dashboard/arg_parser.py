#!/usr/bin/env python3
"""
arg_parser.py - Magna Electronics Software Test Report Generator
====================================================================
Parses Jenkins CI/CD test result XML / JSON artifacts and produces a
polished, self-contained HTML report with the Magna Electronics brand.

Usage examples
--------------
  # Generate from XML JUnit results
  python arg_parser.py --input results/ --output Software_Test_Report.html

  # Override title / project meta
  python arg_parser.py \\
      --input results/ \\
      --output Software_Test_Report.html \\
      --title  "ADAS Surround View Camera System" \\
      --project "ADAS • Surround View Camera System" \\
      --pipeline "Jenkins CI/CD Pipeline" \\
      --embedded embedded_report_1.html embedded_report_2.html embedded_report_3.html

  # Quick demo (no input files required)
  python arg_parser.py --demo --output demo_report.html
"""

import argparse
import json
import os
import sys
import xml.etree.ElementTree as ET
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Unicode constants used in default CLI values and HTML output
# ---------------------------------------------------------------------------
EN_DASH = "\u2013"   # –
BULLET  = "\u2022"   # •


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

class TestCase:
    def __init__(self, name: str, classname: str = "", time: float = 0.0,
                 status: str = "PASS", message: str = ""):
        self.name = name
        self.classname = classname
        self.time = time
        self.status = status          # PASS | FAIL | ERROR | SKIP
        self.message = message


class TestSuite:
    def __init__(self, name: str, tests: List[TestCase] = None):
        self.name = name
        self.tests: List[TestCase] = tests or []

    @property
    def total(self) -> int:
        return len(self.tests)

    @property
    def passed(self) -> int:
        return sum(1 for t in self.tests if t.status == "PASS")

    @property
    def failed(self) -> int:
        return sum(1 for t in self.tests if t.status in ("FAIL", "ERROR"))

    @property
    def skipped(self) -> int:
        return sum(1 for t in self.tests if t.status == "SKIP")

    @property
    def pass_rate(self) -> float:
        return (self.passed / self.total * 100) if self.total else 0.0


class ReportData:
    def __init__(self):
        self.title: str = f"Magna Electronics {EN_DASH} Software Test Report"
        self.project: str = f"ADAS {BULLET} Surround View Camera System"
        self.pipeline: str = "Jenkins CI/CD Pipeline"
        self.generated_at: str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        self.suites: List[TestSuite] = []
        self.embedded_reports: List[str] = []
        self.log_lines: List[str] = []

    @property
    def total_executed(self) -> int:
        return sum(s.total for s in self.suites)

    @property
    def total_passed(self) -> int:
        return sum(s.passed for s in self.suites)

    @property
    def total_failed(self) -> int:
        return sum(s.failed for s in self.suites)

    @property
    def overall_pass_rate(self) -> float:
        return (self.total_passed / self.total_executed * 100) if self.total_executed else 0.0


# ---------------------------------------------------------------------------
# Parsers
# ---------------------------------------------------------------------------

def parse_junit_xml(path: Path) -> TestSuite:
    """Parse a JUnit-style XML file into a TestSuite."""
    tree = ET.parse(path)
    root = tree.getroot()
    tag = root.tag.lower()

    if tag == "testsuites":
        # Flatten all suites into one
        suite = TestSuite(name=root.get("name", path.stem))
        for ts in root.findall("testsuite"):
            suite.tests.extend(_parse_testsuite_element(ts))
    elif tag == "testsuite":
        suite = TestSuite(name=root.get("name", path.stem))
        suite.tests = _parse_testsuite_element(root)
    else:
        suite = TestSuite(name=path.stem)

    return suite


def _parse_testsuite_element(ts_el) -> List[TestCase]:
    cases: List[TestCase] = []
    for tc_el in ts_el.findall("testcase"):
        name = tc_el.get("name", "unnamed")
        classname = tc_el.get("classname", "")
        time_ = float(tc_el.get("time", 0))

        failure = tc_el.find("failure")
        error = tc_el.find("error")
        skipped = tc_el.find("skipped")

        if failure is not None:
            status = "FAIL"
            msg = failure.get("message", "") or (failure.text or "")
        elif error is not None:
            status = "ERROR"
            msg = error.get("message", "") or (error.text or "")
        elif skipped is not None:
            status = "SKIP"
            msg = skipped.get("message", "")
        else:
            status = "PASS"
            msg = ""

        cases.append(TestCase(name=name, classname=classname,
                               time=time_, status=status, message=msg))
    return cases


def load_from_directory(directory: Path) -> List[TestSuite]:
    """Recursively load all XML test results from a directory."""
    suites: List[TestSuite] = []
    for xml_file in sorted(directory.rglob("*.xml")):
        try:
            suites.append(parse_junit_xml(xml_file))
        except Exception as exc:
            print(f"  [WARN] Could not parse {xml_file}: {exc}", file=sys.stderr)
    return suites


# ---------------------------------------------------------------------------
# Demo / sample data
# ---------------------------------------------------------------------------

def make_demo_data() -> ReportData:
    """Return realistic demo data matching the Magna Electronics report style."""
    data = ReportData()
    data.project = f"ADAS {BULLET} Surround View Camera System"
    data.pipeline = "Jenkins CI/CD Pipeline"
    data.generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    suites = [
        ("Camera Validation", 96, 0),
        ("USS Parking Assist", 80, 0),
        ("Lane Keep Assist", 60, 0),
        ("Auto Emergency Braking", 48, 0),
    ]

    for suite_name, passed_count, failed_count in suites:
        total = passed_count + failed_count
        tests = []
        for i in range(passed_count):
            tests.append(TestCase(
                name=f"TC_{suite_name.replace(' ', '_')}_{i+1:03d}",
                classname=suite_name,
                time=round(0.12 + i * 0.003, 3),
                status="PASS",
            ))
        for i in range(failed_count):
            tests.append(TestCase(
                name=f"TC_{suite_name.replace(' ', '_')}_FAIL_{i+1:03d}",
                classname=suite_name,
                time=round(0.20 + i * 0.01, 3),
                status="FAIL",
                message="Expected value mismatch on channel output.",
            ))
        data.suites.append(TestSuite(name=suite_name, tests=tests))

    data.embedded_reports = [
        "Camera_Validation_Report.html",
        "USS_Parking_Report.html",
        "ADAS_Feature_Report.html",
    ]

    data.log_lines = [
        "[INFO]  Jenkins pipeline: master_CT_2026",
        "[INFO]  Test executor: HIL-NODE-04 / Ubuntu 22.04",
        "[INFO]  ECU firmware: SVC2600_FW_v3.14.2",
        "[INFO]  All 284 test cases executed successfully.",
        "[INFO]  No failures detected across embedded reports.",
    ]

    return data


# ---------------------------------------------------------------------------
# HTML generation
# ---------------------------------------------------------------------------

def _render_donut_svg(pass_rate: float, size: int = 120) -> str:
    """Return an inline SVG donut chart for the given pass rate."""
    r = 44
    cx = cy = size // 2
    circumference = 2 * 3.14159 * r
    filled = circumference * (pass_rate / 100)
    empty = circumference - filled

    return (
        f'<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}" '
        f'style="display:block;">'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" '
        f'stroke="#2d2d2d" stroke-width="12"/>'
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" '
        f'stroke="#22c55e" stroke-width="12" '
        f'stroke-dasharray="{filled:.2f} {empty:.2f}" '
        f'stroke-linecap="round" '
        f'transform="rotate(-90 {cx} {cy})"/>'
        f'<text x="{cx}" y="{cy - 6}" text-anchor="middle" '
        f'font-size="16" font-weight="800" fill="#22c55e">'
        f'{pass_rate:.1f}%</text>'
        f'<text x="{cx}" y="{cy + 12}" text-anchor="middle" '
        f'font-size="9" fill="#94a3b8" letter-spacing="0.5">PASS RATE</text>'
        f'</svg>'
    )


def _failure_rows(data: ReportData) -> str:
    failures = [
        tc
        for suite in data.suites
        for tc in suite.tests
        if tc.status in ("FAIL", "ERROR")
    ]
    if not failures:
        return (
            '<div class="no-failures">'
            '&#10003; No test failures detected across all embedded reports.'
            '</div>'
        )
    rows = ""
    for tc in failures:
        rows += (
            f'<tr>'
            f'<td class="fc-name">{_esc(tc.name)}</td>'
            f'<td class="fc-class">{_esc(tc.classname)}</td>'
            f'<td><span class="badge badge-fail">{tc.status}</span></td>'
            f'<td class="fc-msg">{_esc(tc.message[:120])}</td>'
            f'</tr>'
        )
    return (
        '<table class="failure-table">'
        '<thead><tr>'
        '<th>Test Case</th><th>Suite</th><th>Status</th><th>Message</th>'
        '</tr></thead>'
        f'<tbody>{rows}</tbody>'
        '</table>'
    )


def _embedded_section(reports: List[str]) -> str:
    if not reports:
        return ""
    items = ""
    for rpt in reports:
        label = Path(rpt).stem.replace("_", " ")
        items += (
            f'<li class="embed-item" id="emb-{_slug(rpt)}">'
            f'<span class="embed-icon">&#128196;</span>'
            f'<a class="embed-link" href="{_esc(rpt)}">{_esc(label)}</a>'
            f'</li>'
        )
    return (
        f'<section class="report-section" id="sec-embedded">'
        f'<div class="section-header">'
        f'<span class="section-icon">&#128203;</span>'
        f'<h2 class="section-title">Embedded Reports '
        f'<span class="badge-count">{len(reports)}</span></h2>'
        f'</div>'
        f'<ul class="embed-list">{items}</ul>'
        f'</section>'
    )


def _log_section(lines: List[str]) -> str:
    if not lines:
        return ""
    entries = "".join(
        f'<div class="log-line">{_esc(ln)}</div>' for ln in lines
    )
    return (
        '<section class="report-section" id="sec-logs">'
        '<div class="section-header">'
        '<span class="section-icon">&#128196;</span>'
        '<h2 class="section-title">Logs &amp; Info</h2>'
        '</div>'
        f'<div class="log-box">{entries}</div>'
        '</section>'
    )


def _suite_breakdown(data: ReportData) -> str:
    if not data.suites:
        return ""
    rows = ""
    for suite in data.suites:
        pct = suite.pass_rate
        bar_color = "#22c55e" if pct == 100 else ("#f59e0b" if pct >= 50 else "#ef4444")
        rows += (
            f'<tr>'
            f'<td class="sb-name">{_esc(suite.name)}</td>'
            f'<td class="sb-num">{suite.total}</td>'
            f'<td class="sb-num" style="color:#22c55e">{suite.passed}</td>'
            f'<td class="sb-num" style="color:#ef4444">{suite.failed}</td>'
            f'<td class="sb-bar-cell">'
            f'<div class="sb-bar-track">'
            f'<div class="sb-bar-fill" style="width:{pct:.1f}%;background:{bar_color}"></div>'
            f'</div>'
            f'<span class="sb-pct">{pct:.1f}%</span>'
            f'</td>'
            f'</tr>'
        )
    return (
        '<section class="report-section" id="sec-suites">'
        '<div class="section-header">'
        '<span class="section-icon">&#128202;</span>'
        '<h2 class="section-title">Suite Breakdown</h2>'
        '</div>'
        '<table class="suite-table">'
        '<thead><tr>'
        '<th>Suite</th><th>Total</th><th>Pass</th><th>Fail</th><th>Pass Rate</th>'
        '</tr></thead>'
        f'<tbody>{rows}</tbody>'
        '</table>'
        '</section>'
    )


def _esc(s: str) -> str:
    return (
        str(s)
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def _slug(s: str) -> str:
    return "".join(c if c.isalnum() else "-" for c in s).strip("-")


# ---------------------------------------------------------------------------
# Main HTML template
# ---------------------------------------------------------------------------

CSS = """
/* ===== RESET & BASE ===================================================== */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --sidebar-w: 268px;
  --sidebar-bg: #1a0a0a;
  --sidebar-border: rgba(255,255,255,0.07);
  --accent-red: #c0392b;
  --accent-red-light: #e74c3c;
  --header-bg: #2c0f0f;
  --main-bg: #f4f6f9;
  --card-bg: #ffffff;
  --card-border: #e2e8f0;
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-light: #94a3b8;
  --green: #22c55e;
  --red: #ef4444;
  --blue: #3b82f6;
  --purple: #8b5cf6;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,.10), 0 2px 4px rgba(0,0,0,.07);
}

html, body { height: 100%; }

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--main-bg);
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

/* ===== LAYOUT ============================================================ */
.layout {
  display: flex;
  min-height: 100vh;
}

/* ===== SIDEBAR =========================================================== */
.sidebar {
  width: var(--sidebar-w);
  min-width: var(--sidebar-w);
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  position: relative;     /* establishes stacking context for children */
  overflow: hidden;       /* clips the watermark so it never bleeds outside */
  flex-shrink: 0;
}

/*
 * FIX: Watermark icon (Magna "A" mark).
 * – position:absolute keeps it inside the sidebar (overflow:hidden clips it).
 * – opacity, filter and pointer-events make it purely decorative.
 * – bottom/right anchoring means it stays in place as the sidebar height grows.
 */
.sidebar-watermark {
  position: absolute;
  bottom: -40px;
  right: -30px;
  width: 220px;
  height: 220px;
  opacity: 0.13;
  pointer-events: none;
  user-select: none;
  filter: blur(0.4px);
  z-index: 0;
}

.sidebar-watermark svg {
  width: 100%;
  height: 100%;
}

/* Everything inside sidebar sits above the watermark */
.sidebar > *:not(.sidebar-watermark) {
  position: relative;
  z-index: 1;
}

/* ===== BRAND BLOCK ======================================================= */
/*
 * FIX: Logo circle (red Magna icon).
 * Previously floated outside its container by using absolute positioning
 * relative to the page.  Now it lives inside .sidebar-brand and is sized
 * with a fixed width/height so it never overflows or detaches on resize.
 */
.sidebar-brand {
  padding: 24px 20px 20px;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-logo-wrap {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #e74c3c, #8b1a1a);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 3px rgba(192,57,43,.35), 0 4px 12px rgba(0,0,0,.5);
}

.brand-logo-wrap svg {
  width: 30px;
  height: 30px;
  opacity: 0.92;
}

.brand-info { min-width: 0; }

.brand-name {
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-sub {
  font-size: 10px;
  color: rgba(255,255,255,.45);
  letter-spacing: .4px;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== SIDEBAR STATS ===================================================== */
.sidebar-stats {
  padding: 18px 20px;
  border-bottom: 1px solid var(--sidebar-border);
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.ss-item { text-align: center; flex: 1; }

.ss-val {
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}

.ss-lbl {
  font-size: 9px;
  color: rgba(255,255,255,.4);
  text-transform: uppercase;
  letter-spacing: .7px;
  margin-top: 3px;
}

/* ===== SIDEBAR NAV ======================================================= */
.sidebar-nav-label {
  padding: 14px 20px 6px;
  font-size: 9px;
  font-weight: 700;
  color: rgba(255,255,255,.3);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.sidebar-nav { list-style: none; }

.nav-item a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 20px;
  font-size: 12px;
  color: rgba(255,255,255,.65);
  text-decoration: none;
  transition: background .15s, color .15s;
  border-left: 3px solid transparent;
}

.nav-item a:hover {
  background: rgba(255,255,255,.06);
  color: #fff;
  border-left-color: var(--accent-red-light);
}

.nav-item.active a {
  background: rgba(192,57,43,.2);
  color: #fff;
  border-left-color: var(--accent-red);
}

.nav-icon { font-size: 14px; flex-shrink: 0; }

.nav-badge {
  margin-left: auto;
  background: var(--accent-red);
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  border-radius: 10px;
  padding: 1px 6px;
  min-width: 18px;
  text-align: center;
}

.sidebar-nav-label.emb-label {
  padding-top: 20px;
}

.embed-nav-item a {
  font-size: 11px;
  color: rgba(255,255,255,.5);
  padding: 7px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: color .15s;
}

.embed-nav-item a:hover { color: #fff; }

/* ===== MAIN AREA ========================================================= */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* ===== MAIN HEADER ======================================================= */
.main-header {
  background: linear-gradient(135deg, #3d1010 0%, #5c1a1a 50%, #3d1010 100%);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,.25);
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

/*
 * Small inline header icon – uses a background shape only (no floated element).
 */
.header-logo {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-logo svg { width: 36px; height: 36px; }

.header-title-wrap {}

.header-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: .2px;
  white-space: nowrap;
}

.header-meta {
  font-size: 11px;
  color: rgba(255,255,255,.55);
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 600px;
}

.header-timestamp {
  background: rgba(0,0,0,.35);
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 20px;
  padding: 5px 14px;
  font-size: 12px;
  color: rgba(255,255,255,.8);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-timestamp::before {
  content: "\\1F551";   /* clock emoji */
  font-size: 13px;
}

/* ===== MAIN CONTENT ====================================================== */
.main-content {
  flex: 1;
  padding: 24px 28px;
  overflow-y: auto;
}

/* ===== STAT CARDS ROW ==================================================== */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  gap: 14px;
  margin-bottom: 24px;
  align-items: stretch;
}

.stat-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 18px 16px 14px;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: box-shadow .2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-card:hover { box-shadow: var(--shadow-md); }

.stat-icon { font-size: 22px; line-height: 1; margin-bottom: 2px; }

.stat-value {
  font-size: 34px;
  font-weight: 800;
  line-height: 1;
}

.stat-label {
  font-size: 9px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: .8px;
}

.stat-bar {
  width: 100%;
  height: 4px;
  border-radius: 2px;
  margin-top: 6px;
}

/* Donut card */
.donut-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
  min-width: 140px;
}

.donut-legend {
  display: flex;
  gap: 12px;
  font-size: 10px;
  color: var(--text-secondary);
}

.donut-legend span { display: flex; align-items: center; gap: 4px; }

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* ===== SECTION BLOCK ===================================================== */
.report-section {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.section-header {
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  padding: 12px 18px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon { font-size: 16px; }

.section-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: .6px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-toggle {
  margin-left: auto;
  font-size: 11px;
  color: var(--text-light);
  cursor: pointer;
  user-select: none;
}

.section-toggle:hover { color: var(--text-secondary); }

.section-body { padding: 16px 18px; }

/* ===== EXEC SUMMARY ====================================================== */
.exec-header {
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
}

.exec-header .section-title { color: #1e40af; }

/* ===== FAILURE TABLE ===================================================== */
.failure-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.failure-table th {
  background: #f8fafc;
  padding: 8px 12px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: .5px;
  border-bottom: 1px solid var(--card-border);
}

.failure-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
}

.failure-table tr:last-child td { border-bottom: none; }

.fc-name { font-family: monospace; color: #c0392b; font-size: 11px; }
.fc-class { color: var(--text-secondary); font-size: 11px; }
.fc-msg { color: var(--text-secondary); font-size: 11px; max-width: 340px; }

.no-failures {
  padding: 14px 18px;
  color: #166534;
  background: #f0fdf4;
  border-radius: 6px;
  font-size: 13px;
  border: 1px solid #bbf7d0;
}

/* ===== SUITE TABLE ======================================================= */
.suite-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.suite-table th {
  background: #f8fafc;
  padding: 8px 12px;
  text-align: left;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: .5px;
  border-bottom: 1px solid var(--card-border);
}

.suite-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.suite-table tr:last-child td { border-bottom: none; }

.sb-name { font-weight: 600; color: var(--text-primary); }
.sb-num { font-variant-numeric: tabular-nums; text-align: right; width: 60px; }

.sb-bar-cell {
  width: 180px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sb-bar-track {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.sb-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width .6s ease;
}

.sb-pct {
  font-size: 11px;
  font-weight: 600;
  min-width: 40px;
  text-align: right;
  color: var(--text-secondary);
}

/* ===== BADGES ============================================================ */
.badge { display: inline-block; padding: 2px 8px; border-radius: 10px;
         font-size: 10px; font-weight: 700; letter-spacing: .2px; }
.badge-pass { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
.badge-fail { background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca; }
.badge-count { background: var(--accent-red); color: #fff;
               border-radius: 10px; padding: 1px 7px; font-size: 11px;
               font-weight: 700; }

.failure-badge {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
  border-radius: 12px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
}

/* ===== EMBEDDED REPORTS LIST ============================================= */
.embed-list { list-style: none; padding: 14px 18px; }

.embed-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.embed-item:last-child { border-bottom: none; }
.embed-icon { font-size: 16px; flex-shrink: 0; }

.embed-link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.embed-link:hover { text-decoration: underline; }

/* ===== LOG BOX =========================================================== */
.log-box {
  margin: 0 18px 16px;
  background: #0d1117;
  border-radius: 6px;
  border: 1px solid #1e3a5f;
  padding: 12px 14px;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.7;
  color: #94a3b8;
  max-height: 200px;
  overflow-y: auto;
}

/* ===== RESPONSIVE ======================================================== */
@media (max-width: 900px) {
  .sidebar { width: 220px; min-width: 220px; }
  .stat-cards { grid-template-columns: repeat(2, 1fr); }
  .donut-card { grid-column: span 2; }
}

@media (max-width: 650px) {
  .layout { flex-direction: column; }
  .sidebar { width: 100%; min-width: unset; overflow: visible; }
  .sidebar-watermark { display: none; } /* hide decorative watermark on mobile */
  .stat-cards { grid-template-columns: 1fr 1fr; }
  .donut-card { grid-column: span 2; }
  .main-header { padding: 12px 16px; }
  .main-content { padding: 16px; }
  .header-meta { display: none; }
}
"""

# Magna "A" mark SVG (simplified triangle + top dot).
MAGNA_ICON_SVG = """\
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <polygon points="50,8 96,88 4,88"
           fill="none" stroke="white" stroke-width="7"
           stroke-linejoin="round"/>
  <line x1="24" y1="68" x2="76" y2="68"
        stroke="white" stroke-width="7" stroke-linecap="round"/>
  <circle cx="50" cy="8" r="6" fill="white"/>
</svg>"""


def generate_html(data: ReportData) -> str:
    total_failed = data.total_failed
    fail_badge = (
        f'<span class="failure-badge">{total_failed} Failure(s) Across All Reports</span>'
    )

    failure_toggle = (
        '<span class="section-toggle" '
        'onclick="toggleSection(\'failure-body\')">'
        '&#9660; expand / collapse</span>'
    )

    # Executive summary stat cards
    exec_cards = f"""
    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-icon">&#127919;</div>
        <div class="stat-value" style="color:#3b82f6">{data.total_executed}</div>
        <div class="stat-label">Total Executed</div>
        <div class="stat-bar" style="background:#3b82f6"></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#10003;</div>
        <div class="stat-value" style="color:#22c55e">{data.total_passed}</div>
        <div class="stat-label">Tests Passed</div>
        <div class="stat-bar" style="background:#22c55e"></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#10007;</div>
        <div class="stat-value" style="color:#ef4444">{data.total_failed}</div>
        <div class="stat-label">Tests Failed</div>
        <div class="stat-bar" style="background:#ef4444"></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#128175;</div>
        <div class="stat-value" style="color:#8b5cf6">{data.overall_pass_rate:.1f}%</div>
        <div class="stat-label">Pass Rate</div>
        <div class="stat-bar" style="background:#8b5cf6"></div>
      </div>
      <div class="donut-card">
        {_render_donut_svg(data.overall_pass_rate)}
        <div class="donut-legend">
          <span><i class="dot" style="background:#22c55e"></i> Pass</span>
          <span><i class="dot" style="background:#ef4444"></i> Fail</span>
        </div>
      </div>
    </div>
    """

    # Build embedded sidebar nav items
    emb_nav = ""
    if data.embedded_reports:
        emb_nav = (
            f'<div class="sidebar-nav-label emb-label">'
            f'EMBEDDED REPORTS ({len(data.embedded_reports)})</div>'
            f'<ul class="sidebar-nav">'
        )
        for rpt in data.embedded_reports:
            label = Path(rpt).stem.replace("_", " ")
            emb_nav += (
                f'<li class="embed-nav-item">'
                f'<a href="#{_slug(rpt)}">'
                f'<span class="nav-icon">&#128196;</span>{_esc(label)}'
                f'</a></li>'
            )
        emb_nav += "</ul>"

    embedded_count_meta = (
        f" &bull; {len(data.embedded_reports)} embedded report(s)"
        if data.embedded_reports else ""
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{_esc(data.title)}</title>
  <style>{CSS}</style>
</head>
<body>

<div class="layout">

  <!-- ============================================================
       SIDEBAR
       overflow:hidden clips the .sidebar-watermark so it never
       bleeds outside the sidebar boundary on any viewport size.
  ============================================================ -->
  <aside class="sidebar">

    <!-- Decorative watermark: Magna "A" mark, subtle opacity,
         anchored bottom-right so it stays put on resize. -->
    <div class="sidebar-watermark" aria-hidden="true">
      {MAGNA_ICON_SVG}
    </div>

    <!-- Brand block: logo circle is a flex child – it is always
         inside the sidebar and scales correctly on resize. -->
    <div class="sidebar-brand">
      <div class="brand-logo-wrap" aria-label="Magna Electronics logo">
        {MAGNA_ICON_SVG}
      </div>
      <div class="brand-info">
        <div class="brand-name">Magna Electronics</div>
        <div class="brand-sub">{_esc(data.project)}</div>
      </div>
    </div>

    <!-- Summary stats -->
    <div class="sidebar-stats">
      <div class="ss-item">
        <div class="ss-val" style="color:#60a5fa">{data.total_executed}</div>
        <div class="ss-lbl">Executed</div>
      </div>
      <div class="ss-item">
        <div class="ss-val" style="color:#4ade80">{data.total_passed}</div>
        <div class="ss-lbl">Passed</div>
      </div>
      <div class="ss-item">
        <div class="ss-val" style="color:#f87171">{data.total_failed}</div>
        <div class="ss-lbl">Failed</div>
      </div>
    </div>

    <!-- Quick-jump navigation -->
    <div class="sidebar-nav-label">Quick Jump</div>
    <ul class="sidebar-nav">
      <li class="nav-item active">
        <a href="#sec-summary">
          <span class="nav-icon">&#9650;</span>
          Failure Summary
          <span class="nav-badge">{total_failed}</span>
        </a>
      </li>
      <li class="nav-item">
        <a href="#sec-logs">
          <span class="nav-icon">&#128196;</span>
          Logs &amp; Info
        </a>
      </li>
      <li class="nav-item">
        <a href="#sec-embedded">
          <span class="nav-icon">&#128203;</span>
          Embedded Reports
        </a>
      </li>
      <li class="nav-item">
        <a href="#sec-suites">
          <span class="nav-icon">&#128202;</span>
          Suite Breakdown
        </a>
      </li>
    </ul>

    {emb_nav}

  </aside>

  <!-- ============================================================
       MAIN
  ============================================================ -->
  <div class="main">

    <!-- Top header bar -->
    <header class="main-header">
      <div class="header-brand">
        <div class="header-logo" aria-hidden="true">{MAGNA_ICON_SVG}</div>
        <div class="header-title-wrap">
          <div class="header-title">{_esc(data.title)}</div>
          <div class="header-meta">
            {_esc(data.project)}
            &bull; {_esc(data.pipeline)}
            {embedded_count_meta}
            &bull; Generated: {_esc(data.generated_at)}
          </div>
        </div>
      </div>
      <div class="header-timestamp">{_esc(data.generated_at)}</div>
    </header>

    <!-- Page content -->
    <div class="main-content">

      <!-- Executive Test Summary -->
      <section class="report-section" id="sec-exec">
        <div class="section-header exec-header">
          <span class="section-icon">&#9989;</span>
          <h2 class="section-title">
            Executive Test Summary &mdash;
            {_esc(data.project.upper())} &mdash;
            All Reports Combined
          </h2>
        </div>
        <div class="section-body">
          {exec_cards}
        </div>
      </section>

      <!-- Consolidated Failure Summary -->
      <section class="report-section" id="sec-summary">
        <div class="section-header">
          <span class="section-icon">&#9888;</span>
          <h2 class="section-title">
            Consolidated Failure Summary
            {fail_badge}
          </h2>
          {failure_toggle}
        </div>
        <div class="section-body" id="failure-body">
          {_failure_rows(data)}
        </div>
      </section>

      <!-- Suite Breakdown -->
      {_suite_breakdown(data)}

      <!-- Logs & Info -->
      {_log_section(data.log_lines)}

      <!-- Embedded Reports -->
      {_embedded_section(data.embedded_reports)}

    </div><!-- /main-content -->
  </div><!-- /main -->
</div><!-- /layout -->

<script>
function toggleSection(id) {{
  var el = document.getElementById(id);
  if (el) el.style.display = (el.style.display === 'none') ? '' : 'none';
}}
</script>

</body>
</html>
"""


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def build_arg_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        prog="arg_parser.py",
        description=f"Magna Electronics {EN_DASH} Software Test Report Generator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )

    p.add_argument(
        "--input", "-i",
        metavar="DIR_OR_FILE",
        help="Directory of JUnit XML files, or a single XML file",
    )
    p.add_argument(
        "--output", "-o",
        metavar="FILE",
        default="Software_Test_Report.html",
        help="Output HTML file path (default: Software_Test_Report.html)",
    )
    p.add_argument(
        "--title", "-t",
        default=f"Magna Electronics {EN_DASH} Software Test Report",
        help="Report title shown in the header",
    )
    p.add_argument(
        "--project",
        default=f"ADAS {BULLET} Surround View Camera System",
        help="Project / system-under-test label",
    )
    p.add_argument(
        "--pipeline",
        default="Jenkins CI/CD Pipeline",
        help="CI/CD pipeline name",
    )
    p.add_argument(
        "--embedded",
        metavar="HTML_FILE",
        nargs="*",
        default=[],
        help="Paths to embedded sub-reports to link from the report",
    )
    p.add_argument(
        "--log",
        metavar="LOG_FILE",
        help="Plain-text log file to embed in the Logs & Info section",
    )
    p.add_argument(
        "--demo",
        action="store_true",
        help="Generate a demo report with sample data (no --input required)",
    )
    return p


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_arg_parser()
    args = parser.parse_args(argv)

    if args.demo:
        data = make_demo_data()
    elif args.input:
        inp = Path(args.input)
        data = ReportData()
        if inp.is_dir():
            data.suites = load_from_directory(inp)
        elif inp.is_file():
            data.suites = [parse_junit_xml(inp)]
        else:
            print(f"ERROR: --input path not found: {inp}", file=sys.stderr)
            return 1
    else:
        parser.print_help()
        return 0

    data.title = args.title
    data.project = args.project
    data.pipeline = args.pipeline
    data.embedded_reports = args.embedded or []
    data.generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    if args.log:
        try:
            with open(args.log, encoding="utf-8", errors="replace") as fh:
                data.log_lines = [ln.rstrip() for ln in fh if ln.strip()]
        except OSError as exc:
            print(f"  [WARN] Could not read log file: {exc}", file=sys.stderr)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    html = generate_html(data)
    with open(out_path, "w", encoding="utf-8") as fh:
        fh.write(html)

    print(f"Report generated: {out_path.resolve()}")
    print(f"  Suites  : {len(data.suites)}")
    print(f"  Executed: {data.total_executed}")
    print(f"  Passed  : {data.total_passed}")
    print(f"  Failed  : {data.total_failed}")
    print(f"  Pass Rate: {data.overall_pass_rate:.1f}%")
    return 0


if __name__ == "__main__":
    sys.exit(main())
