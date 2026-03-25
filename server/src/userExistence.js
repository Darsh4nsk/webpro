import { getFirestore } from './firebaseAdmin.js';

/**
 * Checks which user documents exist in Firestore: users/{uid}.
 * Returns a Set of uids that exist.
 */
export async function getExistingUserUids(uids) {
  const db = getFirestore();
  const unique = [...new Set((uids || []).map((u) => String(u)).filter((u) => u.trim() !== ''))];
  if (unique.length === 0) return new Set();

  try {
    const results = await Promise.all(
      unique.map(async (uid) => {
        const snap = await db.collection('users').doc(uid).get();
        return [uid, snap.exists];
      })
    );
    return new Set(results.filter(([, exists]) => exists).map(([uid]) => uid));
  } catch (e) {
    console.error('[userExistence] Firestore check failed:', e?.code || e?.message);
    const err = new Error(
      'Firestore is not available. In Firebase Console open Build → Firestore Database and create a database if you have not. Use the same project as your service account.'
    );
    err.statusCode = 503;
    throw err;
  }
}

