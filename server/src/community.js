/** Compare community ids from CSV/Firestore (may be string or number). */
export function sameCommunityId(a, b) {
  return String(a ?? '').trim() === String(b ?? '').trim();
}
