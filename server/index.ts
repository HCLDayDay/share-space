import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { config } from './config.js';
import settingsRouter from './routes/settings.js';
import memoriesRouter from './routes/memories.js';
import menuRouter from './routes/menu.js';
import messagesRouter from './routes/messages.js';
import uploadsRouter from './routes/uploads.js';
import resetRouter from './routes/reset.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function createApp() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/settings', settingsRouter);
  app.use('/api/memories', memoriesRouter);
  app.use('/api/menu', menuRouter);
  app.use('/api/messages', messagesRouter);
  app.use('/api/uploads', uploadsRouter);
  app.use('/api/reset', resetRouter);

  if (config.nodeEnv === 'production') {
    const distPath = path.join(root, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.join(root, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  return app;
}

createApp()
  .then(app => {
    app.listen(config.port, '0.0.0.0', () => {
      console.log(`Server running at http://localhost:${config.port}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
