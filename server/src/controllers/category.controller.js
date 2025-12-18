import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCategories = async (req, res) => {
    try {
        // Fetch top-level categories with their children
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: true
            }
        });
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};
