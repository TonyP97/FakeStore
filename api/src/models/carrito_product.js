const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('carrito_product', {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        order: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
}