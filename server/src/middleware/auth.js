import { getAuth } from '../firebaseAdmin.js';

/**
 * Expects Authorization: Bearer <Firebase ID token>
 * Sets req.uid from verified token.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const idToken = header.slice(7);
  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    req.uid = decoded.uid;
    next();
  } catch (e) {
    console.error('[auth]', e.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}
