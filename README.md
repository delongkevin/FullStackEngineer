# FullStackEngineer Portfolio

A modern, responsive portfolio website showcasing full-stack development projects, mobile applications, and automotive integrations.

## 🚀 Quick Start

### One-time Setup
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Android Multi-App APK Build (Linux/devcontainer)
```bash
chmod +x scripts/build-all-android-apks.sh
scripts/build-all-android-apks.sh
```

This command writes downloadable APKs to `public/apk-artifacts/` so portfolio Android links can download directly.

Useful flags:
- `--skip-clean` skip `clean` and run only `assembleDebug`

### Insurance Policy Administration System (PolicyCore) — cross-platform app
The `insurance-policy-admin` project is a full-stack demo with real persistence and downloadable native shells:
- **Live demo**: `public/projects/insurance-policy-admin/index.html` — data persists in the browser via `localStorage`
- **Backend API**: `insurance-backend/` — standalone Express + file-store REST API (`npm install && npm start`)
- **Android**: `android/insurance-app/` — WebView-wrapped APK, built by `scripts/build-all-android-apks.sh`
- **Windows/macOS desktop**: `desktop/insurance-admin-desktop/` — Electron shell, installers built by `.github/workflows/release-desktop.yml` and published to the `desktop-artifacts-latest` GitHub Release

### Other cross-platform fullstack demos (Android + Windows/macOS desktop)
The same WebView-wrapper (Android) + Electron-shell (desktop) pattern used for PolicyCore has also been applied to:

| Project | Android module | Desktop app |
|---|---|---|
| Online Grocery Order System | `android/order-system/` | `desktop/order-system-desktop/` (ShopQuick) |
| Task Manager | `android/task-manager/` | `desktop/task-manager-desktop/` (TaskFlow) |
| Avionics Test Systems Engineer | `android/avionics-test/` | `desktop/avionics-test-desktop/` (AvionicsTest) |
| SQL & XML Data Operations Platform | `android/om-platform/` | `desktop/om-platform-desktop/` (OMPlatform) |
| System Integration Test Management Dashboard | `android/sit-dashboard/` | `desktop/sit-dashboard-desktop/` (SITDashboard) |
| Software QA Analyst Platform | `android/qa-dashboard/` | `desktop/qa-dashboard-desktop/` (QADashboard) |
| AI Code Training Platform | `android/ai-trainer/` | `desktop/ai-trainer-desktop/` (AICodeTrainer) |
| Accessibility QA Engineer – AI Trainer Platform | `android/a11y-qa-trainer/` | `desktop/a11y-qa-trainer-desktop/` (A11yQATrainer) |
| SAP Test Manager Greenfield Command Center | `android/sap-test-manager/` | `desktop/sap-test-manager-desktop/` (SAPTestManager) |
| Enterprise ERP Workbench | `android/erp-workbench/` | `desktop/erp-workbench-desktop/` (ERPWorkbench) |
| Wireless Audio Platform | `android/wireless-audio/` | `desktop/wireless-audio-desktop/` (WirelessAudio) |

All Android modules are built together by `scripts/build-all-android-apks.sh`, and all desktop apps are built by the `.github/workflows/release-desktop.yml` matrix workflow, publishing installers to the rolling `desktop-artifacts-latest` GitHub Release.

### Preview Production Build
```bash
npx serve out
```

## 📁 Project Structure

This repository contains:
- **Main Portfolio Site** - Next.js 14 application with TypeScript and Tailwind CSS
- **Web Games & Apps** - Interactive browser-based projects in `public/projects/`
- **Mobile Applications** - React Native and Android projects
- **Desktop & Data Analysis** - Python applications for automotive and computer vision

## 🎮 Featured Projects

### Web Games
- **Circle Clicker** - Enhanced with modern UI, animations, high score tracking, and progressive difficulty
- **Tic-Tac-Toe** - Professional React-based game with score tracking
- **Blackjack** - Interactive card game with dealer AI
- **Poker App** - Texas Hold'em with betting system
- **Color Match** - Color matching challenge game

### Mobile & Automotive
- **ComputerStoreApp** - E-commerce mobile app with React Native/Expo
- **CAN Analyzer** - Automotive CAN bus logger with Python/PyQt5
- **Object Detection** - Real-time camera-based detection with OpenCV

## 🔧 Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Mobile**: React Native, Expo, Kotlin/Android
- **Backend**: Node.js, Python
- **Automotive**: CAN protocols, PyQt5
- **Computer Vision**: OpenCV, Python

## ✨ Recent Optimizations

### Portfolio Site Improvements
- ✅ Fixed Google Fonts build issue - switched to system fonts for offline capability
- ✅ Enhanced hero section with better typography and animations
- ✅ Improved skills section with hover effects and updated content
- ✅ Fixed project filters to include all categories (mobile, Automotive, Web, fullstack)
- ✅ Added smooth animations and transitions throughout the site

### Game Improvements
- ✅ Circle Clicker: Complete UI overhaul with gradient backgrounds, game over modal, high score persistence, multiple colors
- ✅ Verified all web games compile and function properly

## 🌐 Deployment

This site can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- Any static hosting service

## 📬 Contact

The contact page includes a Netlify-compatible contact form for direct outreach.

## 📝 License
- Kevin Douglas Delong
