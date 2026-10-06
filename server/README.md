# AgroVision AI – Backend REST Server ⚙️

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-HttpOnly-orange.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

The **AgroVision AI Server** is a robust, production-grade REST API backend built on **Node.js** and **Express**. It handles secure farmer authentication, image ingestion with MIME validation, in-memory rate limiting, multipart forwarding to the Python YOLOv8 microservice, aggregation analytics, and persistence via **MongoDB** and **Mongoose**.

---

## 📑 Table of Contents

- [Technology Stack](#-technology-stack)
- [Directory Architecture](#-directory-architecture)
- [Authentication & Security Architecture](#-authentication--security-architecture)
- [In-Memory Rate Limiting](#-in-memory-rate-limiting)
- [Image Ingestion & ML Pipeline Forwarding](#-image-ingestion--ml-pipeline-forwarding)
- [Database Models & Schemas](#-database-models--schemas)
- [MongoDB Aggregation Pipeline Deep Dive](#-mongodb-aggregation-pipeline-deep-dive)
- [REST API Reference](#-rest-api-reference)
- [Docker Containerization & Storage Volume](#-docker-containerization--storage-volume)
- [Environment Configuration & Local Setup](#-environment-configuration--local-setup)

---

## 🛠️ Technology Stack

| Library | Version | Purpose |
| :--- | :--- | :--- |
| **Express** | `^4.19.2` | Fast, unopinionated web framework for Node.js |
| **Mongoose** | `^8.3.1` | Object Data Modeling (ODM) library for MongoDB |
| **JSONWebToken** | `^9.0.2` | Cryptographic signing of authentication tokens |
| **Bcrypt.js** | `^2.4.3` | Password hashing with 10 salt rounds |
| **Cookie-Parser** | `^1.4.7` | Parsing HttpOnly cookies from client requests |
| **Multer** | `^1.4.5-lts.1` | Multipart form-data parser for image uploads |
| **Axios** | `^1.6.8` | HTTP client for dispatching requests to Python FastAPI |
| **Form-Data** | `^4.0.0` | Streaming multipart payloads between Node.js and FastAPI |
| **Cors** | `^2.8.5` | Dynamic CORS origin negotiation with credential support |
| **Dotenv** | `^16.4.5` | Environment variable management |

---

## 📁 Directory Architecture

```
server/
├── middleware/
│   ├── auth.js                        # JWT verification & session attachment middleware
│   └── upload.js                      # Multer disk storage & MIME filtering middleware
├── models/
│   ├── Detection.js                   # Mongoose schema for scan logs & Debre Markos coords
│   ├── Disease.js                     # Mongoose schema for static disease guides
│   └── User.js                        # Mongoose schema with Bcrypt pre-save hashing
├── routes/
│   ├── auth.js                        # /api/auth endpoints (register, login, logout, me)
│   ├── detect.js                      # /api/detect with rate limiting & ML proxying
│   ├── diseases.js                    # /api/diseases handbook catalog & auto-seed
│   └── history.js                     # /api/history logs & MongoDB aggregation stats
├── uploads/                           # Uploaded crop photos (mounted to persistent volume)
├── Dockerfile                         # Production Node 20 Alpine container specification
├── index.js                           # Server entrypoint, CORS configuration & MongoDB connection
└── package.json                       # Dependencies and run scripts
```

---

## 🔒 Authentication & Security Architecture

### 1. Anti-XSS Defense with HttpOnly Cookies
Storing JWT tokens in `localStorage` leaves tokens vulnerable to Cross-Site Scripting (XSS) attacks. AgroVision AI transmits and receives JWTs exclusively via `HttpOnly` cookies named `token`:
- `httpOnly: true`: Prevents client-side scripts from reading `document.cookie`.
- `sameSite: 'lax'`: Defends against Cross-Site Request Forgery (CSRF) on cross-site requests.
- `secure: process.env.NODE_ENV === 'production'`: Enforces HTTPS in production.

### 2. Password Cryptography
Passwords are never stored in plaintext. In `server/models/User.js`, a Mongoose pre-save hook automatically hashes passwords using `bcrypt.genSalt(10)` and `bcrypt.hash()` whenever the password field is modified.

### 3. Session Expiration Strategy
- **Standard Login:** Cookie expires in **24 hours**.
- **Remember Me Enabled:** When `rememberMe: true` is passed during login, the cookie expiration extends to **30 days**.

---

## ⏱️ In-Memory Rate Limiting (`server/routes/detect.js`)

To protect the compute-intensive YOLOv8 machine learning pipeline from denial-of-service (DoS) attacks and brute-force image spamming, an in-memory sliding window rate limiter monitors client requests:
- Request counts are mapped by client IP (`req.ip`).
- Every IP is restricted to a maximum of **10 scan requests per minute**.
- If a client exceeds 10 scans within the 60-second window, the server immediately rejects the request with `HTTP 429 Too Many Requests`:
  ```json
  {
    "message": "በአንድ ደቂቃ ውስጥ ከ10 ጊዜ በላይ መመርመር አይችሉም። እባክዎ ጥቂት ሰከንዶችን ይጠብቁ።"
  }
  ```
- The tracking table is automatically flushed every 60,000 milliseconds (`setInterval`).

---

## 🔄 Image Ingestion & ML Pipeline Forwarding

When a farmer submits a crop photo on `/api/detect`:
1. **Multer Middleware (`middleware/upload.js`):**
   - Validates that the file has an acceptable MIME type (`image/jpeg`, `image/png`, `image/webp`).
   - Generates a collision-resistant filename using `image-${Date.now()}-${Math.round(Math.random()*1E9)}.${ext}`.
   - Writes the file to the persistent `server/uploads/` volume.
2. **Crop Validation:** Ensures the crop parameter matches supported species (`maize` or `wheat`).
3. **Multipart Forwarding:** Node.js streams the uploaded file buffer to the Python FastAPI microservice using `form-data` and Axios:
   ```javascript
   const formData = new FormData();
   formData.append('file', fs.createReadStream(req.file.path));
   formData.append('crop', crop);

   const response = await axios.post(
     process.env.ML_SERVICE_URL || 'http://localhost:8000/predict',
     formData,
     { headers: formData.getHeaders(), timeout: 15000 }
   );
   ```
4. **Confidence Verification:** Enforces `MINIMUM_CONFIDENCE = 0.40`. If confidence falls below 40%, the server returns `HTTP 422 Unprocessable Entity` with localized guidance.
5. **Database Persistence:** On valid diagnosis, a new `Detection` record is saved in MongoDB and returned to the client.
6. **Graceful Fallback Simulator:** If the Python ML microservice is unreachable, the route engages an internal diagnostic simulator so field demos and evaluations never throw a 500 error.

---

## 🗄️ Database Models & Schemas

### 1. `User` Schema (`server/models/User.js`)
- `name` (String, required, trimmed)
- `phone` (String, required, unique, validated against `^\+251[79]\d{8}$`)
- `passwordHash` (String, required)
- `profilePhoto` (String, default placeholder)
- `role` (String, enum: `['user', 'admin', 'expert']`, default: `'user'`)
- `lastLogin` (Date, default: `Date.now`)
- `createdAt` (Date, default: `Date.now`)

### 2. `Detection` Schema (`server/models/Detection.js`)
- `userId` (ObjectId referencing `User`, optional for guest scans)
- `cropType` (String, required, enum: `['maize', 'wheat', 'teff']`)
- `imagePath` (String, required, e.g. `/uploads/image-1718000000000.jpg`)
- `diseaseDetected` (String, required, e.g. `Common_Rust`)
- `diseaseAmharic` (String, required, e.g. `የጋራ ዝገት`)
- `confidence` (Number, required, float between `0.0` and `1.0`)
- `severity` (String, required, enum: `['none', 'low', 'medium', 'high']`)
- `recommendationAmharic` (String, required)
- `recommendationEnglish` (String, required)
- `location` (Object with defaults to Debre Markos: `{ lat: 10.35, lng: 37.73 }`)
- `deviceInfo` (String, client user-agent)
- `createdAt` (Date, default: `Date.now`)

### 3. `Disease` Schema (`server/models/Disease.js`)
- `name` (String, required)
- `nameAmharic` (String, required)
- `cropType` (String, required)
- `symptomsAmharic` & `symptomsEnglish` (Array of Strings)
- `preventionAmharic` & `preventionEnglish` (Array of Strings)
- `severity` (String, enum: `['low', 'medium', 'high']`)

---

## 📊 MongoDB Aggregation Pipeline Deep Dive

To compute aggregate dashboard metrics for `/api/history/stats` without expensive in-memory JavaScript looping, the server executes a native 4-stage MongoDB aggregation pipeline:

```javascript
const aggregation = await Detection.aggregate([
  // Stage 1: Filter to current user's records where severity is not 'none'
  { 
    $match: { 
      userId: new mongoose.Types.ObjectId(userId), 
      severity: { $ne: 'none' } 
    } 
  },
  // Stage 2: Group by Amharic disease name and sum frequencies
  { 
    $group: { 
      _id: '$diseaseAmharic', 
      count: { $sum: 1 } 
    } 
  },
  // Stage 3: Sort in descending order of frequency
  { 
    $sort: { count: -1 } 
  },
  // Stage 4: Pick the single most frequent pathology
  { 
    $limit: 1 
  }
]);
```

> [!NOTE]
> In raw MongoDB aggregation pipelines, Mongoose query auto-casting is bypassed. Passing a raw string `userId` causes `$match` to fail silently. Explicitly casting `new mongoose.Types.ObjectId(userId)` guarantees exact BSON type parity and flawless execution.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register account; returns user profile and sets JWT cookie |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials; sets JWT cookie |
| `GET` | `/api/auth/me` | Protected | Verify active session cookie and return sanitized profile |
| `POST` | `/api/auth/logout` | Protected | Clear session cookie |

### Detection (`/api/detect`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/detect` | Rate Limited | Ingests multipart image and crop; returns full diagnosis |

### Scan History (`/api/history`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/history` | Protected | Retrieve paginated scan history for authenticated user |
| `DELETE`| `/api/history/:id`| Protected | Delete a specific scan record from database |
| `GET` | `/api/history/stats`| Protected | Aggregate total scans, weekly scans, and top disease |

### Disease Handbook (`/api/diseases`)
| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/diseases` | Public | Retrieve all cataloged diseases with auto-seeding |
| `GET` | `/api/diseases/:id` | Public | Retrieve specific disease entry |

---

## 🐳 Docker Containerization & Storage Volume

The backend is packaged into a production container (`server/Dockerfile`):
- **Base Image:** `node:20-alpine` for minimal vulnerability surface and rapid image builds.
- **Production Install:** Runs `npm install --omit=dev` to omit development dependencies like `nodemon`.
- **Storage Volume:** The uploads directory is bound to the named volume `agrovision_upload_data` (`/app/uploads`), guaranteeing that farmer-uploaded leaf images survive container stops, restarts, and image updates.
- **Network Resolution:** Resolves the Python microservice internally via `http://ml_service:8000/predict` and MongoDB via `mongodb://mongodb:27017/agrovision`.

---

## ⚙️ Environment Configuration & Local Setup

### `.env` Parameters
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/agrovision
JWT_SECRET=agrovision_super_secure_sha256_cryptographic_signing_key_2026
ML_SERVICE_URL=http://localhost:8000/predict
CLIENT_URL=http://localhost:5173
```

### Local Commands
```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run in standard production mode
npm start
```
