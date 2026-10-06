# AgroVision AI – Detailed Architectural & Operational Guide 🌾

---

## 📑 Table of Contents
1. [Project Architecture Overview](#1-project-architecture-overview)
2. [Frontend Overview (`client/`)](#2-frontend-overview-client)
3. [Backend Overview (`server/`)](#3-backend-overview-server)
4. [Machine Learning Service Overview (`ml_service/`)](#4-machine-learning-service-overview-ml_service)
5. [End-to-End Diagnostic Flow](#5-end-to-end-diagnostic-flow)
6. [Authentication & Session Flow](#6-authentication--session-flow)
7. [Environment Variables Matrix](#7-environment-variables-matrix)
8. [Multi-Terminal Local Run Instructions](#8-multi-terminal-local-run-instructions)
9. [Important Runtime Notes](#9-important-runtime-notes)
10. [File Structure Summary](#10-file-structure-summary)
11. [How to Replace Trained Model Weights (.pt)](#11-how-to-replace-trained-model-weights-pt)

---

## 1. Project Architecture Overview

AgroVision AI is a modular, decoupled application featuring three primary tiers:

```
+──────────────────────────────────────────────────────────+
│                     React 19 Frontend                    │
│             (Vite 8, Tailwind CSS v4, Context API)       │
+─────────────────────────────┬────────────────────────────+
                              │ HTTP REST / JSON
                              ▼
+──────────────────────────────────────────────────────────+
│                  Express.js Backend Server               │
│          (Node.js, Mongoose, JWT HttpOnly Cookies)       │
+──────────────┬────────────────────────────┬──────────────+
               │ Multipart HTTP Forwarding  │ Mongoose ODM
               ▼                            ▼
+─────────────────────────────+    +───────────────────────+
│   Python FastAPI Service    │    │   MongoDB Database    │
│  (PyTorch, Ultralytics YOLO)│    │ (Users, Detections,   │
│                             │    │  Disease Handbooks)   │
+─────────────────────────────+    +───────────────────────+
```

Each tier has an isolated scope and communicates via standard HTTP protocols.

---

## 2. Frontend Overview (`client/`)

### Technology Stack
- **React 19** & **Vite 8**
- **Tailwind CSS v4**
- **React Router v7**
- **Axios** with `withCredentials: true`
- **Recharts** (Distribution charts)
- **Framer Motion** (Mascot micro-animations)
- **React Dropzone** & **React Hot Toast**

### Key Responsibilities
- Render the responsive Amharic-first user interface.
- Manage drag-and-drop crop leaf image uploads and live camera feeds.
- Present diagnostic prediction outcomes, severity tags, and confidence percentages.
- Maintain persistent authentication sessions through `AuthContext`.
- Provide bilingual speech synthesis narration via Google Translate TTS (`speech.js`).
- Render clean printable reports stripped of browser headers and footers.

### Key Modules
- `client/src/App.jsx`: Global router and context provider wrapper.
- `client/src/utils/api.js`: Axios client with cookie interceptors and dynamic `getImageUrl` resolver.
- `client/src/context/AuthContext.jsx`: Manages logged-in user state via `/api/auth/me`.
- `client/src/context/LanguageContext.jsx`: Bilingual dictionary controller (`am` / `en`).
- `client/src/context/AudioContext.jsx`: Global voice narration controller and Web Audio oscillators.
- `client/src/pages/Detect.jsx`: Primary scanning interface with multi-stage inference indicators.
- `client/src/pages/Dashboard.jsx`: Executive analytics, Debre Markos weather feed, and seasonal calendars.
- `client/src/pages/History.jsx`: Historical scan audit log with clean PDF export.

---

## 3. Backend Overview (`server/`)

### Technology Stack
- **Node.js** & **Express**
- **MongoDB** & **Mongoose ODM**
- **JWT (JSON Web Tokens)** stored in `HttpOnly` cookies
- **Bcrypt.js** (10 salt rounds)
- **Multer** (Disk file storage with MIME type verification)
- **Axios** & **Form-Data** (Multipart forwarding to FastAPI)

### Key Endpoints
- `server/routes/auth.js`:
  - `POST /api/auth/register`: Phone validation (`^\+251[79]\d{8}$`), password hashing, JWT cookie issue.
  - `POST /api/auth/login`: Credential validation and cookie renewal (30 days if rememberMe).
  - `GET /api/auth/me`: Sanitized profile retrieval.
  - `POST /api/auth/logout`: Clears the session cookie.
- `server/routes/detect.js`:
  - `POST /api/detect`: Enforces in-memory rate limiting (max 10 requests/min/IP), accepts leaf upload via Multer, forwards stream to FastAPI, checks confidence, and saves to MongoDB.
- `server/routes/history.js`:
  - `GET /api/history`: Returns user scan logs.
  - `DELETE /api/history/:id`: Removes a scan record.
  - `GET /api/history/stats`: 4-stage MongoDB aggregation pipeline computing total scans and most frequent disease.
- `server/routes/diseases.js`:
  - Disease catalog retrieval with automatic initial database seeding.

---

## 4. Machine Learning Service Overview (`ml_service/`)

### Technology Stack
- **Python 3.10+**
- **FastAPI** & **Uvicorn**
- **Pillow (PIL)**
- **Ultralytics YOLOv8** & **PyTorch (CPU-Optimized Wheel)**

### Key Responsibilities
- Accept image buffers and target crop strings (`maize` or `wheat`).
- Validate image stream integrity and convert to RGB.
- Execute classification inference against `maize_best.pt` or `wheat_best.pt`.
- Enforce confidence gating (`MIN_CONFIDENCE = 0.40`). Rejects non-leaf uploads with HTTP 422.
- Provide a high-fidelity simulation engine when weights are uninitialized to prevent demo failures.

---

## 5. End-to-End Diagnostic Flow

```
1. Farmer takes leaf photo on http://localhost:5173/detect
2. Frontend creates instant base64 preview
3. Axios sends POST /api/detect (multipart/form-data)
4. Express enforces Rate Limiting (IP <= 10 req/min)
5. Multer saves photo to server/uploads/
6. Express streams file to http://localhost:8000/predict
7. FastAPI validates image via Pillow & runs YOLOv8 model
8. FastAPI verifies confidence >= 0.40 & returns JSON
9. Express saves Detection record to MongoDB
10. React receives JSON, displays ResultCard, plays chime & narrates Amharic audio
```

---

## 6. Authentication & Session Flow

1. **Registration/Login:** The farmer submits credentials.
2. **Password Cryptography:** Passwords are salted and hashed via Bcrypt before database storage.
3. **HttpOnly Cookie:** The server generates a signed JWT and sets an `HttpOnly` cookie named `token`.
4. **XSS Protection:** Client JavaScript cannot read `document.cookie`.
5. **CSRF Protection:** Cookie is marked with `sameSite: 'lax'`.
6. **Session Recovery:** On page reload, `AuthContext` calls `GET /api/auth/me` to seamlessly recover the user profile.

---

## 7. Environment Variables Matrix

| Variable | Location | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `server/.env` | `5000` | Express HTTP server port |
| `MONGO_URI` | `server/.env` | `mongodb://localhost:27017/agrovision` | MongoDB connection URI |
| `JWT_SECRET` | `server/.env` | *(random cryptographic string)* | HMAC key for signing JWTs |
| `ML_SERVICE_URL` | `server/.env` | `http://localhost:8000/predict` | Internal URL for ML service |
| `CLIENT_URL` | `server/.env` | `http://localhost:5173` | Allowed CORS frontend origin |
| `VITE_API_URL` | `client/.env` | `http://localhost:5000/api` | Base API URL for frontend Axios |

---

## 8. Multi-Terminal Local Run Instructions

```bash
# Terminal 1 - Backend Server
cd server
npm install
npm run dev

# Terminal 2 - Frontend Client
cd client
npm install
npm run dev

# Terminal 3 - ML Microservice
cd ml_service
pip install -r requirements.txt
python main.py
```

---

## 9. Important Runtime Notes

- **Dynamic CORS:** The backend allows requests from `localhost:5173`, `localhost:80`, and environment-defined client URLs with `credentials: true`.
- **Persistent Volume:** Leaf uploads in `server/uploads/` are mounted to `agrovision_upload_data` in Docker.
- **Fail-Safe Operation:** If the Python ML microservice is temporarily stopped, Express engages an automated fallback simulation, returning realistic diagnostics to prevent presentation crashes.

---

## 10. File Structure Summary

```
agrovision-ai/
├── client/              # React 19 Frontend
├── server/              # Node.js Express REST Backend
├── ml_service/          # Python FastAPI ML Microservice
├── docker-compose.yml   # Multi-container Docker orchestration
└── .env                 # Master configuration
```

---

## 11. How to Replace Trained Model Weights (.pt)

To update the system with newly trained PyTorch weights from Google Colab or Kaggle:

1. **Locate Target Model:**
   - Maize model path: `ml_service/models/maize_best.pt`
   - Wheat model path: `ml_service/models/wheat_best.pt`
2. **Download Weights:**
   - Download the `.pt` weights file to your machine.
   - Copy the file into `ml_service/models/` replacing the existing file.
3. **Verify File:**
   ```bash
   ls -l ml_service/models/
   ```
4. **Restart the ML Service:**
   ```bash
   # If running locally:
   # Stop the running terminal and run:
   python main.py

   # If running in Docker:
   docker compose restart ml_service
   ```
The FastAPI microservice will automatically load the new PyTorch weights on boot!
