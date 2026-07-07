import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
// Register all models before any routes use them
import './models/Country.js';
import './models/State.js';
import './models/City.js';
import './models/University.js';
import './models/AnonymousUser.js';
import './models/Message.js';
import './models/Report.js';
import './models/Poll.js';
import { authRoutes } from './routes/auth.routes.js';
import { citiesRoutes } from './routes/cities.routes.js';
import { countriesRoutes } from './routes/countries.routes.js';
import { universitiesRoutes } from './routes/universities.routes.js';
import { messagesRoutes } from './routes/messages.routes.js';
import { reportRoutes } from './routes/report.routes.js';
import { adminRoutes } from './routes/admin.routes.js';
import { apiLimiter } from './middleware/rateLimiter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const app: Express = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/universities', universitiesRoutes);
app.use('/api/room', messagesRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reports', apiLimiter, reportRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend in production
if (env.NODE_ENV === 'production') {
  const webDist = path.resolve(__dirname, '../../web/dist');
  app.use(express.static(webDist));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API route not found' } });
    } else {
      res.sendFile(path.join(webDist, 'index.html'));
    }
  });
}

app.use(errorHandler);
