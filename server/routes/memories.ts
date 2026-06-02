import { Router } from 'express';
import * as memoriesService from '../services/memoriesService.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await memoriesService.listMemories();
    res.json(data);
  } catch (err) {
    console.error('GET /api/memories', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load memories' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await memoriesService.createMemory(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error('POST /api/memories', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create memory' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await memoriesService.deleteMemory(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/memories/:id', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to delete memory' });
  }
});

export default router;
