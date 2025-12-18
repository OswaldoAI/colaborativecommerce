import bcrypt from 'bcrypt';
import prisma from '../utils/prisma.js';

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                surname: true,
                role: true,
                phone: true,
                municipality: true,
                province: true,
                createdAt: true
            }
        });
        res.json(users);
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Create User (Admin)
export const createUser = async (req, res) => {
    try {
        const { email, password, name, surname, phone, municipality, province, role } = req.body;

        // Validate role hierarchy if needed (e.g. only SuperAdmin can create Admin)
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                surname,
                phone,
                municipality,
                province,
                role
            }
        });

        res.status(201).json({ message: 'User created', user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, surname, phone, municipality, province, role, email } = req.body;
        // Password update should be separate or handled carefully

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                surname,
                phone,
                municipality,
                province,
                role,
                email
            }
        });

        res.json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
