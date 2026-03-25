# UniShare (Web App) - Project Summary

## What this project is
UniShare is a campus resource-sharing app that lets authenticated students browse and request shared resources inside their college/community.

## Tech stack
- Frontend: **React + Vite**
- Backend: **Node.js + Express** (REST API)
- Authentication: **Firebase Authentication** (email/password)
- Profile storage: **Firebase Firestore**
- Resource storage: **CSV files on the server** (`server/data/resources.csv`, `server/data/requests.csv`)

## Architecture (high level)
```text
Browser (React)
  - Firebase Auth (client SDK)
  - Sends Firebase ID token to backend
      |
      v
Express API (server)
  - Verifies ID token with firebase-admin
  - Reads user's Firestore profile: users/{uid}
  - Filters listings/requests by user's communityId
  - Reads/writes resources/requests from CSV files
      |
      v
CSV files (server/data/)
```

## Data model
### Firestore
`users/{uid}` document:
- `name` (string)
- `email` (string, optional)
- `communityId` (string)
- `communityName` (string)

### CSV (server-side)
#### `resources.csv` (listings)
Each row represents a listing:
- `id`
- `title`
- `description`
- `category`
- `isPaid`
- `price` (optional)
- `conditions`
- `status` (e.g. `available`, `unavailable`)
- `ownerId`, `ownerName`
- `communityId`, `communityName`
- `createdAt`

#### `requests.csv` (requests)
Each row represents a request:
- `id`
- `listingId`, `listingTitle`
- `requesterId`, `requesterName`
- `ownerId`
- `status` (e.g. `pending`, `approved`, `rejected`, `completed`)
- `createdAt`
- `message` (optional)

## API endpoints (Express)
All API requests require:
- `Authorization: Bearer <Firebase ID token>`

### Health
- `GET /api/health`

### Listings
- `GET /api/listings` (returns listings for the user's community)
- `GET /api/listings/:id` (community-scoped)
- `POST /api/listings` (create listing; uses profile community fields)
- `PATCH /api/listings/:id` (update listing fields; owner-only)

### Requests
- `GET /api/requests?role=incoming|outgoing` (community-scoped)
- `POST /api/requests/listing/:listingId` (create request)
- `PATCH /api/requests/:id` with `{ action: 'approve'|'reject'|'complete' }`
  - updates request status and may update the listing status

## Configuration
### Frontend environment
`frontend/.env` (must contain all required Firebase web config keys):
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Backend environment
`server/.env` typically includes:
- credentials path for service account (or uses `server/serviceAccountKey.json`)
- `PORT` (defaults to `3001`)
- `CORS_ORIGIN` (defaults to local Vite origins)

### Service account
The backend uses `firebase-admin` and expects a service account JSON at:
- `server/serviceAccountKey.json`
or via `GOOGLE_APPLICATION_CREDENTIALS`.

## Common setup requirements
1. Firebase Authentication:
   - Enable **Email/Password** in Firebase Console.
2. Firestore:
   - Create a Firestore database in the same Firebase project.
   - Publish rules that allow users to access only their own document:
     - `users/{userId}`

## Troubleshooting notes
- If listings/requests fail with `403`, the user profile in Firestore likely lacks:
  - `communityId` and `communityName`
- If listings/requests fail with `503`, Firestore is not available (database not created, or wrong project/service account).
- CSV read/parse failures are hardened to return empty arrays instead of crashing routes.

