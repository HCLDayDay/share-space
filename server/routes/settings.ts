import { Router } from 'express';
import * as settingsService from '../services/settingsService.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await settingsService.getSettings();
    res.json(data);
  } catch (err) {
    console.error('GET /api/settings', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load settings' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { anniversaryDate, customQuote, partnerAName, partnerJName } = req.body;
    const data = await settingsService.updateSettings({
      anniversaryDate,
      customQuote,
      partnerAName,
      partnerJName,
    });
    res.json(data);
  } catch (err) {
    console.error('PUT /api/settings', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update settings' });
  }
});

export default router;
