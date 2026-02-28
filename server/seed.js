const { sequelize, InventoryItem, ReliefRequest } = require('./models');

(async () => {
    try {
        // Đảm bảo tất cả các bảng đã được tạo
        await sequelize.sync();

        const invCount = await InventoryItem.count();
        if (invCount === 0) {
            await InventoryItem.bulkCreate([
                { name: 'Mì gói', quantity: 1500, unit: 'thùng' },
                { name: 'Gạo', quantity: 5000, unit: 'kg' },
                { name: 'Nước lọc', quantity: 2000, unit: 'thùng' },
                { name: 'Thuốc men', quantity: 300, unit: 'thùng' }
            ]);
            console.log('Inventory seeded');
        }

        const reqCount = await ReliefRequest.count();
        if (reqCount === 0) {
            await ReliefRequest.bulkCreate([
                { name: 'Nguyễn Văn A', phone: '0901234567', address: 'Quảng Trị', needs: 'Lương thực, nước uống', status: 'Pending' },
                { name: 'Trần Thị B', phone: '0912345678', address: 'Quảng Bình', needs: 'Áo phao, đèn pin', status: 'Pending' }
            ]);
            console.log('Relief Requests seeded');
        }
    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        process.exit(0);
    }
})();
