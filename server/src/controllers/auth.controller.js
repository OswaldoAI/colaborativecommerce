import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/prisma.js';

export const register = async (req, res) => {
    try {
        const { email, password, name, surname, phone, municipality, province, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Allow role selection only if valid for public registration (PROMOTOR or CLIENTE), else default to CLIENTE
        let assignedRole = 'CLIENTE';
        if (role === 'PROMOTOR') {
            assignedRole = 'PROMOTOR';
        }

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                surname,
                phone,
                municipality,
                province,
                role: assignedRole
            }
        });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { email, password, name, surname, phone, municipality, province } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                surname: surname || 'Admin',
                phone: phone || '0000000000',
                municipality: municipality || 'Central',
                province: province || 'Central',
                role: 'ADMIN'
            }
        });

        res.status(201).json({ message: 'Admin created', user: { id: user.id, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error creating admin', error: error.message });
    }
};
