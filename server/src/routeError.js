/** Maps known errors (e.g. Firestore down) to HTTP responses; otherwise 500. */
export function sendRouteError(res, err, fallbackMessage) {
  const message = err?.message || fallbackMessage;
  if (err?.statusCode == 503) {
    return res.status(503).json({ error: message });
  }
  console.error(err?.stack || err);
  return res.status(500).json({ error: message });
}
