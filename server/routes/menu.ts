import { Router } from 'express';
import * as menuService from '../services/menuService.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const data = await menuService.listMenuItems();
    res.json(data);
  } catch (err) {
    console.error('GET /api/menu', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to load menu' });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await menuService.createMenuItem(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error('POST /api/menu', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to create menu item' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const data = await menuService.updateMenuItem(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    console.error('PUT /api/menu/:id', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to update menu item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await menuService.deleteMenuItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error('DELETE /api/menu/:id', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to delete menu item' });
  }
});

export default router;
