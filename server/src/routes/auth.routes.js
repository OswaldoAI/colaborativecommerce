import { Router } from 'express';
import { login, register, createAdmin } from '../controllers/auth.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected Route for Creating Admins (Only SuperAdmin)
router.post('/create-admin', verifyToken, requireRole('SUPERADMIN'), createAdmin);

export default router;
