import { createServer } from 'http';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { app } from './app.js';
import { initializeSocket } from './socket/index.js';

const httpServer = createServer(app);

async function bootstrap(): Promise<void> {
  await connectDatabase();

  initializeSocket(httpServer);

  httpServer.listen(env.PORT, () => {
    console.log(`[Server] Running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
}

bootstrap().catch((err) => {
  console.error('[Server] Failed to start:', err);
  process.exit(1);
});
