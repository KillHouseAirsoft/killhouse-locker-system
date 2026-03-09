import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import route handlers
import { getLockerStatus } from './routes/getLockerStatus.js';
import { unlockLocker } from './routes/unlockLocker.js';
import { reserveLocker } from './routes/reserveLocker.js';
import { releaseLocker } from './routes/releaseLocker.js';
import { getLockersList } from './routes/getLockersList.js';



// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// List all lockers
app.get('/api/lockers', getLockersList);
// Get status of a specific locker
app.get('/api/lockers/:lockerId', getLockerStatus);
// Unlock a locker
app.post('/api/lockers/:lockerId/unlock', unlockLocker);
// Reserve a locker
app.post('/api/lockers/:lockerId/reserve', reserveLocker);
// Release a locker
app.post('/api/lockers/:lockerId/release', releaseLocker);

// Healthcheck endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Start server (for local development)
app.listen(port, () => {
  console.log(`Locker API listening on port ${port}`);
});

// Export the Express app for Vercel serverless function
export default app;
