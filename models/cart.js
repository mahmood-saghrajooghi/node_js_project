const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Cart = sequelize.define('cart' , {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: true,
    primaryKey: true
  }
})

module.exports = Cart;