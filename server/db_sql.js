const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('riot', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;
