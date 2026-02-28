const express = require('express');
const router = express.Router();
const { Campaign, Donation, Volunteer, ReliefRequest, InventoryItem, DisasterReport, News, Comment, User, Expense, CampaignUpdate } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Setup mock email transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'mario.harvey29@ethereal.email', // Replace with valid test acc if needed, or we just log
        pass: '6J3F9sJtVwP4XwqkEa'
    }
});

// Get all campaigns
router.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.findAll();
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new campaign (Admin only)
router.post('/campaigns', verifyToken, isAdmin, async (req, res) => {
    try {
        const newCampaign = await Campaign.create(req.body);
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get campaign updates (Timeline)
router.get('/campaigns/:id/updates', async (req, res) => {
    try {
        const updates = await CampaignUpdate.findAll({
            where: { CampaignId: req.params.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(updates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Post campaign update (Admin only)
router.post('/campaigns/:id/updates', verifyToken, isAdmin, async (req, res) => {
    try {
        const { content, imageUrl } = req.body;
        const newUpdate = await CampaignUpdate.create({
            content,
            imageUrl,
            CampaignId: req.params.id
        });
        res.status(201).json(newUpdate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all donations (Admin only)
router.get('/donations', verifyToken, isAdmin, async (req, res) => {
    try {
        const donations = await Donation.findAll({ include: Campaign });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get recent donations (Public live feed)
router.get('/donations/recent', async (req, res) => {
    try {
        const donations = await Donation.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5,
            attributes: ['id', 'donorName', 'amount', 'message', 'createdAt'] // Only public info
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a donation
router.post('/donations', async (req, res) => {
    try {
        const { amount, campaign, donorName, email, message, paymentMethod } = req.body;

        let userId = null;
        const authHeader = req.header('Authorization');
        if (authHeader) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET || 'your_jwt_secret');
                userId = decoded.id;
            } catch (e) { }
        }

        // Find campaign first if provided
        let campaignRecord = null;
        if (campaign) {
            campaignRecord = await Campaign.findOne({ where: { title: campaign } });
        }

        const newDonation = await Donation.create({
            amount,
            donorName,
            email,
            message,
            paymentMethod,
            status: 'completed',
            CampaignId: campaignRecord ? campaignRecord.id : null,
            UserId: userId
        });

        if (campaignRecord) {
            campaignRecord.current += Number(amount);
            await campaignRecord.save();
        }

        // Mock Send Email
        try {
            await transporter.sendMail({
                from: '"Quỹ Cứu Trợ Thiên Tai" <no-reply@cuutrothientai.vn>',
                to: email,
                subject: "Xác nhận quyên góp thành công",
                text: `Cảm ơn ${donorName} đã ủng hộ ${amount} VNĐ qua ${paymentMethod}.`,
                html: `<h3>Cảm ơn ${donorName}!</h3>
                       <p>Chúng tôi đã nhận được khoản quyên góp <b>${amount} VNĐ</b> của bạn thông qua <b>${paymentMethod}</b>.</p>
                       <p>Mã giao dịch: #${newDonation.id}</p>
                       <p>Chúc bạn một ngày tốt lành!</p>`
            });
            console.log(`[Email Sent] Phân hệ đã gửi biên lai tới: ${email}`);
        } catch (mailErr) {
            console.error('[Email Error] Lỗi gửi mail (có thể do config ethereal sai):', mailErr.message);
        }

        res.status(201).json(newDonation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Removed old mock login route

// Volunteers
router.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll();
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/volunteers', async (req, res) => {
    try {
        const newVolunteer = await Volunteer.create(req.body);
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Dashboard Summary
router.get('/dashboard/summary', verifyToken, isAdmin, async (req, res) => {
    try {
        const totalCampaigns = await Campaign.count();
        const campaignsData = await Campaign.findAll({ attributes: ['title', 'target', 'current'] });
        const totalDonated = campaignsData.reduce((acc, curr) => acc + curr.current, 0);
        const totalVolunteers = await Volunteer.count();
        const inventoryItems = await InventoryItem.findAll();

        res.json({
            stats: { totalCampaigns, totalDonated, totalVolunteers },
            campaigns: campaignsData,
            inventory: inventoryItems
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Relief Requests
router.get('/relief-requests', async (req, res) => {
    try {
        const requests = await ReliefRequest.findAll();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/relief-requests', async (req, res) => {
    try {
        const newReq = await ReliefRequest.create(req.body);
        res.status(201).json(newReq);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/relief-requests/:id/status', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const request = await ReliefRequest.findByPk(id);
        if (!request) return res.status(404).json({ error: 'Not found' });

        request.status = status;
        await request.save();
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Inventory (Relief Items)
router.get('/inventory', async (req, res) => {
    try {
        const items = await InventoryItem.findAll();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/inventory', verifyToken, isAdmin, async (req, res) => {
    try {
        const newItem = await InventoryItem.create(req.body);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Disasters (Map Hotspots)
router.get('/disasters', async (req, res) => {
    try {
        const disasters = await DisasterReport.findAll();
        res.json(disasters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/disasters', verifyToken, async (req, res) => {
    try {
        const newDisaster = await DisasterReport.create(req.body);
        res.status(201).json(newDisaster);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// News
router.get('/news', async (req, res) => {
    try {
        const news = await News.findAll({ order: [['createdAt', 'DESC']] });
        res.json(news);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/news/:id', async (req, res) => {
    try {
        const item = await News.findByPk(req.params.id);
        if (!item) return res.status(404).json({ error: 'News not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/news', verifyToken, isAdmin, async (req, res) => {
    try {
        const newlyCreated = await News.create(req.body);
        res.status(201).json(newlyCreated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Comments for Campaign
router.get('/campaigns/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.findAll({
            where: { CampaignId: req.params.id },
            include: [{ model: User, attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/campaigns/:id/comments', verifyToken, async (req, res) => {
    try {
        const newComment = await Comment.create({
            content: req.body.content,
            CampaignId: req.params.id,
            UserId: req.user.id // fix from req.userId to req.user.id
        });

        // Fetch again to get the associated user data for immediate frontend display
        const createdCommentWithUser = await Comment.findByPk(newComment.id, {
            include: [{ model: User, attributes: ['username'] }]
        });

        res.status(201).json(createdCommentWithUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Expenses (Chi tiêu)
router.get('/expenses', async (req, res) => {
    try {
        const expenses = await Expense.findAll({ order: [['date', 'DESC']] });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/expenses', verifyToken, isAdmin, async (req, res) => {
    try {
        const newExpense = await Expense.create(req.body);
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Statement (Sao kê tổng hợp)
router.get('/statements', async (req, res) => {
    try {
        const donations = await Donation.findAll({
            where: { status: 'completed' },
            attributes: ['id', 'amount', 'donorName', 'createdAt', 'paymentMethod'],
            order: [['createdAt', 'DESC']]
        });

        const expenses = await Expense.findAll({
            attributes: ['id', 'amount', 'title', 'date', 'description'],
            order: [['date', 'DESC']]
        });

        const totalIn = donations.reduce((sum, d) => sum + d.amount, 0);
        const totalOut = expenses.reduce((sum, e) => sum + e.amount, 0);

        res.json({
            summary: {
                totalIn,
                totalOut,
                balance: totalIn - totalOut
            },
            donations,
            expenses
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Profile & history
router.get('/users/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'role', 'createdAt']
        });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const history = await Donation.findAll({
            where: { UserId: user.id, status: 'completed' },
            include: [{ model: Campaign, attributes: ['title'] }],
            order: [['createdAt', 'DESC']]
        });

        const totalDonated = history.reduce((sum, d) => sum + d.amount, 0);

        res.json({
            user,
            history,
            totalDonated
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Volunteers
router.get('/volunteers', verifyToken, isAdmin, async (req, res) => {
    try {
        const volunteers = await Volunteer.findAll({
            include: [{ model: ReliefRequest, attributes: ['id', 'name', 'address'] }]
        });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/volunteers', async (req, res) => {
    try {
        const newVolunteer = await Volunteer.create(req.body);
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/volunteers/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, ReliefRequestId } = req.body;
        const volunteer = await Volunteer.findByPk(id);
        if (!volunteer) return res.status(404).json({ error: 'Volunteer not found' });

        volunteer.status = status !== undefined ? status : volunteer.status;
        volunteer.ReliefRequestId = ReliefRequestId !== undefined ? ReliefRequestId : volunteer.ReliefRequestId;

        await volunteer.save();
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
