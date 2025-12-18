import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken, requireRole } from '../middleware/auth.middleware.js';

const router = Router();

// Base route: /api/users

// List Users: Admin, SuperAdmin, Gestor, Supervisor? (Let's stick to Admin/SuperAdmin for now)
router.get('/', verifyToken, requireRole('ADMIN'), getAllUsers);

// Create: Admin/SuperAdmin
router.post('/', verifyToken, requireRole('ADMIN'), createUser);

// Update: Admin/SuperAdmin
router.put('/:id', verifyToken, requireRole('ADMIN'), updateUser);

// Delete: SuperAdmin Only
router.delete('/:id', verifyToken, requireRole('SUPERADMIN'), deleteUser);

export default router;
