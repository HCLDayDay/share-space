import { Router } from 'express';
import { seedDatabase } from '../seed.js';

const router = Router();

router.post('/', async (_req, res) => {
  try {
    await seedDatabase();
    res.json({ ok: true });
  } catch (err) {
    console.error('POST /api/reset', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to reset data' });
  }
});

export default router;
