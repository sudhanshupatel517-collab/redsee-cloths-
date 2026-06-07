const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seedAdmin = async () => {
    try {
        const adminEmail = 'himanshu4admin9@redsee.com';
        const existingAdmin = await User.findOne({ email: adminEmail });
        
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('6Meow#ghop#ghop9', salt);
            
            await User.create({
                name: 'Himanshu Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin',
                hasPassword: true,
                isVerified: true
            });
            console.log('Super Admin account seeded successfully.');
        }

        const coadminEmail = 'sudhanshu4coadmin9@redsee.com';
        const existingCoadmin = await User.findOne({ email: coadminEmail });

        if (!existingCoadmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('6Yele9Password#', salt);
            
            await User.create({
                name: 'Sudhanshu Staff',
                email: coadminEmail,
                password: hashedPassword,
                role: 'coadmin',
                hasPassword: true,
                isVerified: true,
                permissions: ['manage_products', 'manage_orders', 'manage_support', 'manage_categories', 'manage_banners', 'manage_events', 'manage_discounts', 'manage_inventory']
            });
            console.log('Initial Coadmin account seeded successfully.');
        }

        // Seed default categories
        const Category = require('../models/Category');
        const defaultCategories = [
            { name: 'Oversized', slug: 'oversized', imageUrl: '/overts.png', order: 1, isActive: true },
            { name: 'Hoodies', slug: 'hoodies', imageUrl: '/hoodie.png', order: 2, isActive: true },
            { name: 'Cargo', slug: 'cargo', imageUrl: '/cargo.png', order: 3, isActive: true },
            { name: 'Lower', slug: 'lower', imageUrl: '/lower.png', order: 4, isActive: true },
            { name: 'Shirts', slug: 'shirts', imageUrl: '/shirt.png', order: 5, isActive: true },
            { name: 'Jackets', slug: 'jacket', imageUrl: '/jacket.png', order: 6, isActive: true },
        ];

        for (const cat of defaultCategories) {
            const exists = await Category.findOne({ slug: cat.slug });
            if (!exists) {
                await Category.create(cat);
                console.log(`Seeded category: ${cat.name}`);
            }
        }

    } catch (error) {
        console.error('Error seeding admin/categories:', error);
    }
};

module.exports = seedAdmin;
