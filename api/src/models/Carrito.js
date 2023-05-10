const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('carrito', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        finalizado: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    });
}