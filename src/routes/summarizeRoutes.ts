import { Router } from 'express';
import multer from 'multer';
import { handleSummarize } from '../controllers/summarizeController';
import { handleTranslation } from '../controllers/translateController';

const router = Router();

// Configure Multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
});

/**
 * SUMMARIZE ROUTE
 * Uses 'upload.single' because it needs to parse FormData (Files + Text)
 */
router.post('/summarize', upload.single('file'), handleSummarize);

/**
 * TRANSLATE ROUTE
 * Does NOT use upload.single because the frontend sends a standard JSON body.
 * This prevents the "Unexpected end of form" error for translation.
 */
router.post('/translate', handleTranslation);

export default router;