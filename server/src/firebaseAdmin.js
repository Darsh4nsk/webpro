import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';
import { basename, dirname, join, resolve, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** Always the `server/` directory, regardless of shell cwd */
const serverRoot = join(__dirname, '..');

function resolveCredentialPath(p) {
  if (!p || typeof p !== 'string') return null;
  const trimmed = p.trim();
  if (!trimmed) return null;
  return isAbsolute(trimmed) ? trimmed : resolve(serverRoot, trimmed);
}

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const candidatePaths = [
    resolveCredentialPath(process.env.GOOGLE_APPLICATION_CREDENTIALS),
    join(serverRoot, 'serviceAccountKey.json'),
  ].filter(Boolean);

  for (const filePath of candidatePaths) {
    if (!existsSync(filePath)) continue;
    try {
      const serviceAccount = JSON.parse(readFileSync(filePath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log(`[unishare-server] Firebase Admin OK (${basename(filePath)})`);
      return;
    } catch (e) {
      console.error(`[unishare-server] Failed to load service account from ${filePath}:`, e.message);
    }
  }

  console.warn(
    '[unishare-server] No valid service account. Download a JSON key from Firebase Console → Project settings → Service accounts → Generate new private key. Save it as server/serviceAccountKey.json or set GOOGLE_APPLICATION_CREDENTIALS in server/.env to that file path (relative paths are resolved from the server/ folder). Restart after adding the file.'
  );
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || 'demo-unishare',
    credential: admin.credential.applicationDefault(),
  });
}

initFirebaseAdmin();

export function getAuth() {
  return admin.auth();
}

export function getFirestore() {
  return admin.firestore();
}

export { admin };
