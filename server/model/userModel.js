const { DataTypes } = require('sequelize');
const sequelize = require('../db_sql');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    tgId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    balance: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lvl: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    exp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    maxExp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    daily: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    energy: {
        type: DataTypes.INTEGER,
        defaultValue: 1000
    },
    maxEnergy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1000
    },
    coin_multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1
    },
    energy_multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1
    },
    photoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg"
    },
    referralCode: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        unique: true
    },
    friends: {
        type: DataTypes.JSON, // Store as JSON string
        allowNull: true,
    }
}, {
    timestamps: true, // Ensure Sequelize manages createdAt and updatedAt
    freezeTableName: true, // Prevent Sequelize from pluralizing the table name
});

module.exports = User;
