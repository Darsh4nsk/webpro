# UniShare

Campus resource sharing: Firebase Authentication, Firestore user profiles, and a Node.js API that reads and writes listings and requests as CSV files.

## Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com/) project with:
  - **Authentication** → Sign-in method → **Email/Password** enabled
  - **Firestore** database created (start in test mode for development, then deploy rules from [`firestore.rules`](firestore.rules))
- A **service account** JSON for the Admin SDK (server only): Firebase Console → Project settings → Service accounts → Generate new private key

## Setup

### 1. Firebase (web app)

1. In Firebase Console, add a **Web** app and copy the config values.
2. Copy [`frontend/.env.example`](frontend/.env.example) to `frontend/.env` and fill in all `VITE_FIREBASE_*` variables.

### 2. Firestore rules

Copy the contents of [`firestore.rules`](firestore.rules) into Firebase Console → Firestore → Rules and publish. Users may only read/write their own document at `users/{userId}`.

### 3. Server (CSV API)

1. Copy [`server/.env.example`](server/.env.example) to `server/.env`.
2. Add a service account JSON: either save it as [`server/serviceAccountKey.json`](server/) (gitignored) **or** set `GOOGLE_APPLICATION_CREDENTIALS` in `server/.env` to that file’s path. Relative paths are resolved from the `server/` folder. Restart the server after adding the file.
3. Install and run:

```bash
cd server
npm install
npm run dev
```

The API listens on `http://localhost:3001` by default. Data files live under [`server/data/`](server/data/) (`resources.csv`, `requests.csv`).

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:3001` (see [`frontend/vite.config.ts`](frontend/vite.config.ts)). Use the **same Firebase project** for the web app and the service account so ID tokens verify correctly.

## Scripts

| Location   | Command       | Purpose                    |
| ---------- | ------------- | -------------------------- |
| `server/`  | `npm run dev` | Express API with watch     |
| `server/`  | `npm start`   | Run API without watch      |
| `frontend/`| `npm run dev` | Vite dev server            |
| `frontend/`| `npm run build` | Production build         |

## Architecture

- **Login / signup**: Firebase Auth in the browser; after signup, profile fields (`name`, `communityId`, `communityName`) are stored in Firestore at `users/{uid}`.
- **Listings & requests**: Stored in CSV on the server. The Express app verifies Firebase ID tokens with `firebase-admin` and scopes listings by the user’s `communityId` from Firestore.

## Troubleshooting

- **`auth/configuration-not-found` on sign-up or sign-in**: Firebase Authentication is not enabled for the project yet, or Email/Password is off. In [Firebase Console](https://console.firebase.google.com/) → **Authentication** → click **Get started** if you see it, then open **Sign-in method** → **Email/Password** → **Enable** → Save. Ensure `frontend/.env` uses the web app config from **Project settings** for that same project, then restart Vite.
- **`Invalid or expired token`**: Ensure the server is using a service account from the **same** Firebase project as the web `VITE_FIREBASE_PROJECT_ID`.
- **`Complete your profile`**: Firestore must contain `communityId` and `communityName` for your user (normally set at signup).
- **Empty browse**: Seed data uses `communityId` `1` (MIT). Sign up with **MIT** as your college to see demo listings, or add rows to `server/data/resources.csv` for your community id.
