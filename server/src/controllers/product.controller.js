import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import { put } from '@vercel/blob';

const prisma = new PrismaClient();

// Helper to upload to Vercel Blob
const uploadToBlob = async (file) => {
    if (!file) return null;
    const stream = fs.createReadStream(file.path);
    const { url } = await put(`products/${Date.now()}-${file.originalname}`, stream, {
        access: 'public',
        addRandomSuffix: true
    });
    // Cleanup local temp file
    fs.unlinkSync(file.path);
    return url;
};

// Helper to calculate PVP
const calculatePVP = (purchasePrice, profitMargin, hasTax) => {
    const basePrice = Number(purchasePrice) * (1 + (Number(profitMargin) / 100));
    const taxRate = hasTax ? 1.21 : 1; // 21% Tax
    return basePrice * taxRate;
};

export const getProducts = async (req, res) => {
    try {
        const { categoryId } = req.query;
        let where = {};

        if (categoryId) {
            // Find category and its children (1 level deep for now as per requirement, but clear for self-relation)
            // A more robust way for N-levels is a recursive helper, but for now:
            const subcategories = await prisma.category.findMany({
                where: { parentId: Number(categoryId) },
                select: { id: true }
            });

            const categoryIds = [Number(categoryId), ...subcategories.map(c => c.id)];

            where = {
                categoryId: { in: categoryIds }
            };
        }

        const products = await prisma.product.findMany({
            where,
            include: {
                category: {
                    include: { parent: true }
                }
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { name, description, purchasePrice, profitMargin, hasTax, categoryId, stock } = req.body;

        // Handle Image Upload to Vercel Blob
        let imageUrl = req.body.image; // Fallback to URL if provided as text
        if (req.file) {
            imageUrl = await uploadToBlob(req.file);
        }

        const price = calculatePVP(purchasePrice, profitMargin, hasTax);

        const product = await prisma.product.create({
            data: {
                name,
                description,
                purchasePrice: Number(purchasePrice),
                profitMargin: Number(profitMargin),
                hasTax: String(hasTax) === 'true',
                price: price,
                categoryId: Number(categoryId),
                image: imageUrl,
                stock: Number(stock || 0)
            }
        });
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, purchasePrice, profitMargin, hasTax, categoryId, stock } = req.body;

        // Handle Image Upload to Vercel Blob
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = await uploadToBlob(req.file);
        }

        // Recalculate price if pricing fields change
        let price;
        if (purchasePrice !== undefined && profitMargin !== undefined && hasTax !== undefined) {
            price = calculatePVP(purchasePrice, profitMargin, hasTax);
        }

        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                ...(purchasePrice !== undefined && { purchasePrice: Number(purchasePrice) }),
                ...(profitMargin !== undefined && { profitMargin: Number(profitMargin) }),
                ...(hasTax !== undefined && { hasTax: String(hasTax) === 'true' }),
                ...(price !== undefined && { price }),
                ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
                ...(imageUrl !== undefined && { image: imageUrl }),
                ...(stock !== undefined && { stock: Number(stock) })
            }
        });
        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: Number(id) } });
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const bulkUploadProducts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Assuming CSV columns: name, purchasePrice, profitMargin, hasTax, stock, categoryName
                // We'd need to lookup category ID by name or passing ID. For simplicity assuming ID or mapping.
                // Let's assume CSV has 'categoryId'.
                let count = 0;
                for (const row of results) {
                    const purchasePrice = Number(row.purchasePrice);
                    const profitMargin = Number(row.profitMargin);
                    const hasTax = row.hasTax === 'true' || row.hasTax === '1' || row.hasTax === 'SI';

                    const price = calculatePVP(purchasePrice, profitMargin, hasTax);

                    await prisma.product.create({
                        data: {
                            name: row.name,
                            purchasePrice,
                            profitMargin,
                            hasTax,
                            price,
                            categoryId: Number(row.categoryId) || null,
                            stock: Number(row.stock || 0)
                        }
                    });
                    count++;
                }

                // Cleanup file
                fs.unlinkSync(req.file.path);

                res.json({ message: `Imported ${count} products successfully` });
            } catch (error) {
                res.status(500).json({ message: 'Error processing CSV', error: error.message });
            }
        });
};
