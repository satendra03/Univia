/**
 * User routes — REST API endpoints.
 */
import { Router } from 'express';
import { getOnlineUsers, getStats } from '../controllers/userController.js';

const router = Router();

router.get('/online', getOnlineUsers);
router.get('/stats', getStats);

export default router;