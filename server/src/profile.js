import { getFirestore } from './firebaseAdmin.js';

/**
 * @returns {Promise<{ name: string; email?: string; communityId: string; communityName: string } | null>}
 */
export async function getUserProfile(uid) {
  try {
    const db = getFirestore();
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return null;
    const d = snap.data();
    const communityId =
      d.communityId != null && String(d.communityId).trim() !== ''
        ? String(d.communityId).trim()
        : '';
    const communityName =
      d.communityName != null && String(d.communityName).trim() !== ''
        ? String(d.communityName).trim()
        : '';
    if (!communityId || !communityName) return null;
    return {
      name: d.name || 'User',
      email: d.email,
      communityId,
      communityName,
    };
  } catch (e) {
    console.error('[profile] Firestore read failed:', e.code || e.message);
    const err = new Error(
      'Firestore is not available. In Firebase Console open Build → Firestore Database and create a database if you have not. Use the same project as your service account.'
    );
    err.statusCode = 503;
    throw err;
  }
}
