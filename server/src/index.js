import 'dotenv/config';
import './firebaseAdmin.js';
import express from 'express';
import cors from 'cors';
import listingsRouter from './routes/listings.js';
import requestsRouter from './routes/requests.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',')
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'unishare-server' });
});

app.use('/api/listings', listingsRouter);
app.use('/api/requests', requestsRouter);

app.listen(PORT, () => {
  console.log(`[unishare-server] listening on http://localhost:${PORT}`);
});
