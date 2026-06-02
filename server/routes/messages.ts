import { Router } from 'express';
import * as messagesService from '../services/messagesService.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await messagesService.listMessages();
    res.json(data);
  } catch (err) {
    console.error('GET /api/messages', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load messages' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await messagesService.createMessage(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error('POST /api/messages', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create message' });
  }
});

export default router;
