# AgroVision AI – Frontend Client Application 🌿

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4.3-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

The **AgroVision AI Client** is a responsive, high-performance Single Page Application (SPA) built with **React 19**, **Vite 8**, and **Tailwind CSS v4**. It is specifically tailored for Ethiopian smallholder farmers with an **Amharic-first** policy, natural voice guidance, animated mascot interactions, real-time epidemiological weather warnings, and clean PDF report printing.

---

## 📑 Table of Contents

- [Technology Stack](#-technology-stack)
- [Application Architecture & State Management](#-application-architecture--state-management)
- [Voice Guidance & Audio Engine](#-voice-guidance--audio-engine)
- [PDF Generation & Print Styles](#-pdf-generation--print-styles)
- [Directory Structure & Components](#-directory-structure--components)
- [Pages & Routing](#-pages--routing)
- [Dynamic Asset Resolution](#-dynamic-asset-resolution)
- [Docker Multi-Stage Build & Nginx Proxy](#-docker-multi-stage-build--nginx-proxy)
- [Local Development & Scripts](#-local-development--scripts)

---

## 🛠️ Technology Stack

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^19.2.6` | Core declarative UI component library |
| **Vite** | `^8.0.12` | Ultra-fast build tool and Hot Module Replacement (HMR) server |
| **Tailwind CSS** | `^4.3.0` | Zero-runtime CSS styling using CSS variables & utility classes |
| **React Router DOM** | `^7.15.1` | Client-side routing and protected route wrappers |
| **Axios** | `^1.16.1` | HTTP client with automatic cookie credential transmission |
| **Recharts** | `^3.8.1` | Responsive SVG charts (e.g. crop scan distribution on Dashboard) |
| **Framer Motion** | `^12.40.0` | Micro-interactions and mascot animations |
| **Headless UI** | `^2.2.10` | Accessible unstyled UI primitives (modals, dropdowns) |
| **React Dropzone** | `^15.0.0` | Accessible drag-and-drop leaf image uploader |
| **React Hot Toast** | `^2.6.0` | Non-blocking animated toast notifications |

---

## 🧠 Application Architecture & State Management

The frontend avoids heavy external state libraries (like Redux) in favor of three specialized **React Context Providers** wrapped around the application in `src/App.jsx`:

### 1. `AuthContext.jsx` (`src/context/AuthContext.jsx`)
- **State:** `user`, `isAuthenticated`, `loading`.
- **Session Recovery:** On initial mount, automatically dispatches `GET /api/auth/me`. If a valid `HttpOnly` JWT cookie exists, the user session is seamlessly restored without manual re-login.
- **Methods:** `login({ phone, password, rememberMe })`, `register(...)`, `logout()`.

### 2. `LanguageContext.jsx` (`src/context/LanguageContext.jsx`)
- **State:** `locale` ('am' for Amharic, 'en' for English).
- **Default:** `'am'` (Amharic-first policy for Ethiopian agricultural demographic).
- **Persistence:** Saved in `localStorage['agrovision_locale']`.
- **Methods:** `t(key)` resolves localized strings from an in-memory dictionary; `toggleLanguage()` swaps the language globally.

### 3. `AudioContext.jsx` (`src/context/AudioContext.jsx`)
- **State:** `isMuted` (persisted in `localStorage['agrovision_muted']`).
- **Sound Generation:**
  - `playHoverSound()`: Synthesizes a woodblock sound using browser `AudioContext` sine-wave oscillators (ramps 800 Hz down to 100 Hz in 50 ms) with zero network overhead.
  - `playChimeSound(type)`: Produces ascending musical frequencies for healthy scans [523.25 Hz (C5) ➔ 659.25 Hz (E5)] or descending tones for disease alerts [349.23 Hz (F4) ➔ 293.66 Hz (D4)].
  - `speakText(textAmharic, textEnglish)`: Dynamically selects text matching the current locale and routes it to the speech synthesis queue.
  - `toggleMute()`: Mutes all audio and immediately cancels any active speech via `stopSpeech()`.

---

## 🗣️ Voice Guidance & Audio Engine (`src/utils/speech.js`)

### The Challenge with Browser Amharic Speech
Standard browsers (Chrome, Edge, Safari) and mobile operating systems do not include native Amharic (`am-ET`) speech synthesis engines. Standard `window.speechSynthesis` falls back to default English voices that attempt to pronounce Ge'ez script phonetically, producing garbled noise.

### The Solution: Google Translate TTS Queue
1. **Endpoint Integration:** Streams natural Amharic audio from:
   ```
   https://translate.google.com/translate_tts?ie=UTF-8&tl=am&client=tw-ob&q=<encodedText>
   ```
2. **Intelligent Sentence Chunker:** Google Translate TTS limits requests to 200 characters. Agricultural advice often contains 300–600 characters. Our chunker divides text by Amharic full stops (`።`) and punctuation (`.`, `!`, `?`), ensuring all chunks are strictly under 180 characters.
3. **Sequential Audio Queue:** Chunks are queued in an array and played sequentially via HTML5 `Audio` objects with recursive `onended` event triggers.
4. **Offline Fallback:** If internet connectivity drops, network exceptions are caught and gracefully routed to local `window.speechSynthesis`.

---

## 📄 PDF Generation & Print Styles (`src/index.css`)

Exporting clean agronomic diagnostic reports directly from the browser without third-party watermarks or URL clutter is achieved through CSS print rules:

```css
@media print {
  @page {
    size: auto;
    margin: 0mm; /* Completely removes browser default title (top) and URL (bottom) */
  }
  body {
    padding: 15mm !important; /* Re-establishes clean physical margins */
    background: white !important;
    color: black !important;
  }
  .print\:hidden {
    display: none !important; /* Hides navigation, language switches, audio toggles */
  }
}
```

- In `index.html`, the default `<title>` is configured as `አግሮቪዥን AI — AgroVision AI`.
- In `History.jsx`, the export button activates `window.print()`, producing a clean, formal agronomic summary complete with dates, leaf images, severity tags, and treatment advice.

---

## 📁 Directory Structure & Components

```
client/
├── public/
│   └── favicon.svg                    # Brand leaf icon
├── src/
│   ├── assets/
│   │   ├── maize.png                  # Maize crop illustration
│   │   └── wheat.png                  # Wheat crop illustration
│   ├── components/
│   │   ├── AbelMascot.jsx             # Animated SVG mascot with interactive speech bubble
│   │   ├── AudioPlayer.jsx            # Floating voice toggle button with animated wave bars
│   │   ├── DiseaseCard.jsx            # Expandable catalog item with symptoms and audio readout
│   │   ├── Navbar.jsx                 # Header with language toggle ('አማ'/'EN'), theme, and auth
│   │   ├── ResultCard.jsx             # Diagnostic cards, confidence progress, severity badge
│   │   └── UploadZone.jsx             # Drag-and-drop zone and camera snapshot capture
│   ├── context/
│   │   ├── AudioContext.jsx           # Oscillator and TTS context provider
│   │   ├── AuthContext.jsx            # Authentication and session state provider
│   │   └── LanguageContext.jsx        # Bilingual locale dictionary provider
│   ├── data/
│   │   └── diseaseData.js             # Static disease reference profiles
│   ├── pages/
│   │   ├── Dashboard.jsx              # Analytics, Recharts pie chart, weather & calendar
│   │   ├── Detect.jsx                 # Leaf upload, inference progress cues & scan cache
│   │   ├── Diseases.jsx               # Searchable encyclopedic leaf pathology catalog
│   │   ├── History.jsx                # Scan audit logs table, filter pills & PDF printing
│   │   ├── Home.jsx                   # Landing hero section, feature cards & workflow
│   │   ├── Login.jsx                  # Phone and password authentication
│   │   └── Register.jsx               # Farmer profile registration portal
│   ├── utils/
│   │   ├── api.js                     # Axios client with credentials and getImageUrl helper
│   │   └── speech.js                  # Sentence-chunking Google Translate TTS player
│   ├── App.jsx                        # Application routes and context provider wrappers
│   ├── index.css                      # Tailwind imports, custom animations & print styles
│   └── main.jsx                       # DOM initialization entrypoint
├── Dockerfile                         # Multi-stage build (node:20-alpine -> nginx:alpine)
├── nginx.conf                         # Reverse proxy config for /api & /uploads
├── index.html                         # HTML template
├── package.json                       # Dependencies and build scripts
└── vite.config.js                     # Vite plugin configuration
```

---

## 🗺️ Pages & Routing

All routes are defined in `src/App.jsx`:

| Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Public | Hero landing portal, Abel greeting, workflow guide |
| `/detect` | `Detect.jsx` | Public / Guest | Primary leaf scanner with camera capture and offline fallback |
| `/diseases`| `Diseases.jsx` | Public | Searchable crop disease handbook with voice summaries |
| `/dashboard`| `Dashboard.jsx` | Protected (User) | Metrics, crop scan distribution, Debre Markos weather |
| `/history` | `History.jsx` | Protected (User) | Scan audit log, search, filters, and PDF export |
| `/login` | `Login.jsx` | Public | Authentication portal with Ethiopian phone validation |
| `/register`| `Register.jsx`| Public | Farmer registration portal |

---

## 🖼️ Dynamic Asset Resolution (`src/utils/api.js`)

When running in development, Vite serves frontend assets on port `5173`, whereas uploaded images are stored on the Express backend on port `5000`. Relative image paths (e.g. `/uploads/image.jpg`) will fail if requested from port `5173`.

The `getImageUrl(path)` utility safely normalizes image URLs across development, Docker production, and PDF print exports:

```javascript
export const getImageUrl = (path) => {
  if (!path) return '/uploads/placeholder.jpg';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const serverBase = apiBase.replace(/\/api\/?$/, '');
  return `${serverBase}${path.startsWith('/') ? '' : '/'}${path}`;
};
```

---

## 🐳 Docker Multi-Stage Build & Nginx Proxy

The client utilizes an ultra-compact **Multi-Stage Dockerfile** (`client/Dockerfile`):
1. **Stage 1 (Builder):** Uses `node:20-alpine` to install dependencies and execute `npm run build` with `VITE_API_URL=/api`.
2. **Stage 2 (Production):** Copies compiled static assets from `/app/dist` into `nginx:alpine` (~25 MB footprint).

### `nginx.conf` Highlights
- **Single Page Application Routing:** `try_files $uri $uri/ /index.html;` ensures React Router handles all subpaths on page refresh.
- **Reverse Proxy `/api/`:** Proxies internal API requests directly to `http://server:5000/api/`.
- **Reverse Proxy `/uploads/`:** Proxies uploaded image requests directly to `http://server:5000/uploads/`.
- **Eliminating CORS:** Because the browser communicates exclusively with Nginx on Port 80, all API and upload calls are same-origin, eliminating CORS preflights and ensuring `HttpOnly` cookies work reliably with standard `sameSite: 'lax'`.

---

## 💻 Local Development & Scripts

### Prerequisites
- Node.js v20+
- npm v9+

### Commands
```bash
# Install dependencies
npm install

# Start development server with Hot Module Replacement
npm run dev

# Compile production bundle into /dist
npm run build

# Preview production build locally
npm run preview

# Run ESLint validation
npm run lint
```
