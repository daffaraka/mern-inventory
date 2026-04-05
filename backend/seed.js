/**
 * Dummy Data Seeder
 * 
 * Cara pakai:
 * 1. Pastikan backend/.env sudah ada MONGO_URI
 * 2. Jalankan: node backend/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/UserModel');
const Product = require('./models/ProductModel');

const seed = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // ── 1. Buat users dummy ──────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('password123', 10);

    const usersData = [
        { name: 'Admin Utama',    email: 'admin@demo.com',      password: hashedPassword, role: 'admin' },
        { name: 'Budi Santoso',   email: 'staff@demo.com',      password: hashedPassword, role: 'staff' },
        { name: 'Sari Dewi',      email: 'finance@demo.com',    password: hashedPassword, role: 'finance' },
        { name: 'Rudi Hartono',   email: 'management@demo.com', password: hashedPassword, role: 'management' },
    ];

    // Hapus user lama kalau ada, lalu insert baru
    await User.deleteMany({ email: { $in: usersData.map(u => u.email) } });
    const users = await User.insertMany(usersData);
    const adminUser = users.find(u => u.role === 'admin');
    console.log(`✓ ${users.length} users created`);

    // ── 2. Buat products dummy ───────────────────────────────────────
    await Product.deleteMany({ user: adminUser._id });

    const products = [
        // Electronics
        {
            user: adminUser._id,
            name: 'Laptop Dell Inspiron 15',
            sku: 'ELC-001',
            category: 'Electronics',
            price: 8500000,
            quantity: 25,
            minStock: 5,
            description: 'Laptop bisnis 15 inch, Intel Core i5, RAM 8GB, SSD 512GB',
            supplier: 'PT. Dell Indonesia',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Monitor LG 24 inch',
            sku: 'ELC-002',
            category: 'Electronics',
            price: 2300000,
            quantity: 40,
            minStock: 10,
            description: 'Monitor Full HD IPS 24 inch, 75Hz',
            supplier: 'PT. LG Electronics',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Keyboard Mechanical Logitech',
            sku: 'ELC-003',
            category: 'Electronics',
            price: 850000,
            quantity: 8,
            minStock: 10,
            description: 'Keyboard mechanical TKL, switch red, backlit RGB',
            supplier: 'PT. Logitech Indonesia',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Mouse Wireless Logitech M185',
            sku: 'ELC-004',
            category: 'Electronics',
            price: 180000,
            quantity: 3,
            minStock: 10,
            description: 'Mouse wireless 2.4GHz, baterai AA',
            supplier: 'PT. Logitech Indonesia',
            status: 'approved',
        },

        // Office Supplies
        {
            user: adminUser._id,
            name: 'Kertas HVS A4 80gsm',
            sku: 'OFF-001',
            category: 'Office Supplies',
            price: 55000,
            quantity: 200,
            minStock: 50,
            description: 'Kertas HVS A4 80gsm, 1 rim = 500 lembar',
            supplier: 'CV. Sinar Dunia',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Pulpen Pilot G2 (Box)',
            sku: 'OFF-002',
            category: 'Office Supplies',
            price: 95000,
            quantity: 60,
            minStock: 20,
            description: 'Pulpen gel Pilot G2, 1 box isi 12 pcs, warna biru',
            supplier: 'CV. Alat Tulis Jaya',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Tinta Printer Canon PG-745',
            sku: 'OFF-003',
            category: 'Office Supplies',
            price: 120000,
            quantity: 5,
            minStock: 10,
            description: 'Tinta printer Canon original, warna hitam',
            supplier: 'PT. Canon Indonesia',
            status: 'pending',
        },
        {
            user: adminUser._id,
            name: 'Stapler Kenko No. 10',
            sku: 'OFF-004',
            category: 'Office Supplies',
            price: 35000,
            quantity: 30,
            minStock: 10,
            description: 'Stapler ukuran kecil, untuk staples No. 10',
            supplier: 'CV. Alat Tulis Jaya',
            status: 'approved',
        },

        // Furniture
        {
            user: adminUser._id,
            name: 'Kursi Ergonomis Ergotec E200',
            sku: 'FRN-001',
            category: 'Furniture',
            price: 3200000,
            quantity: 15,
            minStock: 3,
            description: 'Kursi kantor ergonomis, sandaran punggung adjustable, armrest 4D',
            supplier: 'PT. Ergotec Furniture',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Meja Kerja Minimalis 120cm',
            sku: 'FRN-002',
            category: 'Furniture',
            price: 1800000,
            quantity: 10,
            minStock: 3,
            description: 'Meja kerja kayu MDF, ukuran 120x60x75cm, warna walnut',
            supplier: 'PT. Ergotec Furniture',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Lemari Arsip 4 Laci',
            sku: 'FRN-003',
            category: 'Furniture',
            price: 2500000,
            quantity: 0,
            minStock: 2,
            description: 'Lemari arsip besi 4 laci, dilengkapi kunci, warna abu-abu',
            supplier: 'CV. Besi Kuat',
            status: 'approved',
        },

        // Networking
        {
            user: adminUser._id,
            name: 'Router WiFi TP-Link Archer C6',
            sku: 'NET-001',
            category: 'Networking',
            price: 450000,
            quantity: 12,
            minStock: 5,
            description: 'Router WiFi dual band AC1200, 4 antena, MU-MIMO',
            supplier: 'PT. TP-Link Indonesia',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Kabel LAN Cat6 (Roll 50m)',
            sku: 'NET-002',
            category: 'Networking',
            price: 320000,
            quantity: 20,
            minStock: 5,
            description: 'Kabel UTP Cat6, panjang 50 meter per roll',
            supplier: 'CV. Kabel Nusantara',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Switch 8 Port TP-Link',
            sku: 'NET-003',
            category: 'Networking',
            price: 280000,
            quantity: 7,
            minStock: 3,
            description: 'Network switch unmanaged 8 port Gigabit',
            supplier: 'PT. TP-Link Indonesia',
            status: 'validated',
        },

        // Cleaning Supplies
        {
            user: adminUser._id,
            name: 'Sabun Cuci Tangan Dettol 5L',
            sku: 'CLN-001',
            category: 'Cleaning Supplies',
            price: 145000,
            quantity: 35,
            minStock: 10,
            description: 'Sabun cuci tangan antibakteri, kemasan galon 5 liter',
            supplier: 'PT. Reckitt Indonesia',
            status: 'approved',
        },
        {
            user: adminUser._id,
            name: 'Tisu Multifungsi (Karton)',
            sku: 'CLN-002',
            category: 'Cleaning Supplies',
            price: 185000,
            quantity: 4,
            minStock: 10,
            description: '1 karton isi 6 pack, 250 lembar per pack',
            supplier: 'CV. Bersih Selalu',
            status: 'approved',
        },
    ];

    const inserted = await Product.insertMany(products);
    console.log(`✓ ${inserted.length} products created`);

    // ── Summary ──────────────────────────────────────────────────────
    console.log('\n── Akun Login ──────────────────────────────');
    usersData.forEach(u => {
        console.log(`  ${u.role.padEnd(12)} | ${u.email.padEnd(25)} | password123`);
    });
    console.log('\n── Kategori Produk ─────────────────────────');
    const categories = [...new Set(products.map(p => p.category))];
    categories.forEach(c => {
        const count = products.filter(p => p.category === c).length;
        console.log(`  ${c.padEnd(20)} ${count} produk`);
    });
    console.log('\n── Status Produk ───────────────────────────');
    console.log(`  Low stock (qty ≤ minStock): ${products.filter(p => p.quantity <= p.minStock).length} produk`);
    console.log(`  Out of stock (qty = 0):     ${products.filter(p => p.quantity === 0).length} produk`);
    console.log('────────────────────────────────────────────\n');

    await mongoose.disconnect();
    console.log('Done. MongoDB disconnected.');
};

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
