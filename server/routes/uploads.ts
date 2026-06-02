import { Router } from 'express';
import multer from 'multer';
import * as uploadService from '../services/uploadService.js';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
const router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (req.file) {
      const url = await uploadService.uploadImage(
        req.file.buffer,
        req.file.mimetype,
        req.file.originalname
      );
      return res.json({ url });
    }

    const { dataUrl } = req.body;
    if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
      const url = await uploadService.uploadBase64Image(dataUrl);
      return res.json({ url });
    }

    res.status(400).json({ error: 'No file or dataUrl provided' });
  } catch (err) {
    console.error('POST /api/uploads', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to upload image' });
  }
});

export default router;
