const {DataTypes} = require('sequelize');
const sequelize = require('../db_sql');

const Task = sequelize.define('Task', {
    taskId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    TaskName_en: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    TaskName_ru: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reward: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    channelId: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
}, {
    timestamps: true,
    freezeTableName: true,
});

module.exports = Task;
