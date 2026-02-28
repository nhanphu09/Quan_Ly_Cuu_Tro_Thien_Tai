const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('CampaignUpdate', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
};
