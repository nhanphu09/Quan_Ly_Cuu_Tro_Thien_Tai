const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const { sequelize } = require('./models');

app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Sync Database and seeding mock data if empty
sequelize.sync({ force: false }).then(async () => {
  console.log('Database synced');

  // Check if campaigns exist
  const { Campaign, User } = require('./models');

  // Seed initial Admin
  const adminCount = await User.count({ where: { role: 'admin' } });
  if (adminCount === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user seeded');
  }

  const count = await Campaign.count();
  if (count === 0) {
    await Campaign.bulkCreate([
      {
        title: 'Cứu Trợ Bão Lũ Miền Trung',
        target: 1000000000,
        current: 700000000,
        status: 'Active',
        description: 'Hỗ trợ bà con miền Trung...',
        lat: 16.4637,
        lng: 107.5909
      },
      {
        title: 'Hỗ Trợ Hạn Mặn Miền Tây',
        target: 500000000,
        current: 225000000,
        status: 'Active',
        description: 'Cung cấp nước sạch...',
        lat: 10.0452,
        lng: 105.7469
      }
    ]);
    console.log('Mock data seeded');
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
