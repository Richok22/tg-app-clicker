const { Sequelize } = require('sequelize');
const config = require('./config.json');

const sequelize = new Sequelize('riot', 'root', '', {
    host: config.db.sql.host,
    password: config.db.sql.password,
    dialect: 'mysql',
    port: config.db.sql.port,
    logging: false,
});

module.exports = sequelize;
