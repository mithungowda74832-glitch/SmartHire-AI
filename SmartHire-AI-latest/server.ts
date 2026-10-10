import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { resumeRouter } from './server/routes/resumeRoutes';

// Load environment variables from .env
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Parse JSON and form-urlencoded requests
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Mount API router under /api
  app.use('/api', resumeRouter);

  // Serve static public folder (manifest, sw, icons)
  const publicPath = path.resolve(process.cwd(), 'public');
  app.use(express.static(publicPath));

  // Vite development middleware or static production serve
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
    console.log('[SmartHire] Vite development middleware attached.');
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));

    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log('[SmartHire] Serving static production bundle from', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SmartHire AI] Full-stack application running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SmartHire] Server startup failure:', err);
  process.exit(1);
});
