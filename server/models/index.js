const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const ReliefRequest = require('./reliefRequest');
const InventoryItem = require('./inventoryItem');
const DisasterReport = require('./disasterReport');
const News = require('./news');
const Comment = require('./comment');
const Expense = require('./expense');
const CampaignUpdateModel = require('./CampaignUpdate');

const Campaign = sequelize.define('Campaign', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    target: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    current: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Active'
    },
    description: {
        type: DataTypes.TEXT
    },
    lat: {
        type: DataTypes.FLOAT
    },
    lng: {
        type: DataTypes.FLOAT
    }
});

const Donation = sequelize.define('Donation', {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    donorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'anonymous@example.com'
    },
    message: {
        type: DataTypes.TEXT
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'bank'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'completed'
    }
});

const Volunteer = sequelize.define('Volunteer', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    skills: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'Pending'
    },
    ReliefRequestId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

// Relationships
Campaign.hasMany(Donation);
Donation.belongsTo(Campaign);

User.hasMany(Donation);
Donation.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Campaign.hasMany(Comment);
Comment.belongsTo(Campaign);

Campaign.hasMany(Expense);
Expense.belongsTo(Campaign);

ReliefRequest.hasMany(Volunteer);
Volunteer.belongsTo(ReliefRequest);

const CampaignUpdate = CampaignUpdateModel(sequelize);
Campaign.hasMany(CampaignUpdate);
CampaignUpdate.belongsTo(Campaign);

module.exports = {
    User,
    Campaign,
    Donation,
    Volunteer,
    ReliefRequest,
    InventoryItem,
    DisasterReport,
    News,
    Comment,
    Expense,
    CampaignUpdate,
    sequelize
};
