import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create SuperAdmin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@healthstore.com' },
        update: {},
        create: {
            email: 'admin@healthstore.com',
            name: 'Super Admin',
            surname: 'System',
            phone: '0000000000',
            municipality: 'Central',
            province: 'Central',
            password: hashedPassword,
            role: 'SUPERADMIN',
        },
    });

    console.log('SuperAdmin created:', admin);

    // Categories Data
    const categoriesData = [
        {
            name: 'Alimentación',
            subcategories: ['Frutas y Verduras', 'Despensa', 'Lácteos']
        },
        {
            name: 'Salud y Belleza',
            subcategories: ['Cuidado Personal', 'Farmacia', 'Maquillaje']
        },
        {
            name: 'Hogar',
            subcategories: ['Limpieza', 'Decoración', 'Cocina']
        },
        {
            name: 'Tecnología',
            subcategories: ['Electrónica', 'Accesorios']
        }
    ];

    // Seed Categories
    for (const catData of categoriesData) {
        const parent = await prisma.category.create({
            data: { name: catData.name }
        });
        console.log(`Created parent category: ${parent.name}`);

        if (catData.subcategories) {
            for (const subName of catData.subcategories) {
                await prisma.category.create({
                    data: {
                        name: subName,
                        parentId: parent.id
                    }
                });
            }
        }
    }

    // Fetch categories for product assignment
    const catSalud = await prisma.category.findFirst({ where: { name: 'Farmacia' } });
    const catHogar = await prisma.category.findFirst({ where: { name: 'Limpieza' } });

    // Seed Products
    const products = [
        {
            name: "Proteína Whey Gold Standard",
            description: "Proteína de suero de alta calidad.",
            purchasePrice: 180.000,
            profitMargin: 20, // 20%
            hasTax: true,
            price: 261.360, // approx
            categoryId: catSalud ? catSalud.id : null,
            stock: 50
        },
        {
            name: "Vitamina C 1000mg x 100 Tabs",
            purchasePrice: 30.000,
            profitMargin: 30, // 30%
            hasTax: true,
            price: 47.190,
            categoryId: catSalud ? catSalud.id : null,
            stock: 100
        },
        {
            name: "Detergente Líquido 3L",
            purchasePrice: 15.000,
            profitMargin: 25,
            hasTax: true,
            price: 22.687, // ~ (15 * 1.25) * 1.21
            categoryId: catHogar ? catHogar.id : null,
            stock: 20
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: {
                name: product.name,
                description: product.description,
                price: product.price,
                purchasePrice: product.purchasePrice,
                profitMargin: product.profitMargin,
                hasTax: product.hasTax,
                categoryId: product.categoryId,
                stock: product.stock
            }
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
