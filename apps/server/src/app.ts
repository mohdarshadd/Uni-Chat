import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRoutes } from './routes/auth.routes.js';
import { citiesRoutes } from './routes/cities.routes.js';
import { universitiesRoutes } from './routes/universities.routes.js';
import { messagesRoutes } from './routes/messages.routes.js';

export const app: Express = express();

app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/universities', universitiesRoutes);
app.use('/api/room', messagesRoutes);
app.use('/api/messages', messagesRoutes);

app.use(errorHandler);
