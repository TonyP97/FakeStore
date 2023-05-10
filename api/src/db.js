require('dotenv').config();
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
    DB_USER, DB_PASSWORD, DB_HOST, DB_NAME
  } = process.env;

// Crea una nueva instancia de Sequelize con los datos de conexión a la base de datos
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres'
  });


const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { User, Product, Carrito, Carrito_product } = sequelize.models;

// Definimos las relaciones
// // Un usuario puede tener muchos productos en su carrito y un producto puede estar en muchos carritos
// User.belongsToMany(Product, { through: Carrito });
// Product.belongsToMany(User, { through: Carrito });

// Carrito.belongsTo(User, { unique: true });
// // Carrito.belongsTo(User);
// User.hasOne(Carrito);

// // Agregamos la relación entre el modelo Carrito y Product
// Carrito.belongsToMany(Product, { through: 'carrito_product' });
// Product.belongsToMany(Carrito, { through: 'carrito_product' });

Carrito.belongsTo(User);
User.hasOne(Carrito);

Carrito.belongsToMany(Product, { through: Carrito_product });
Product.belongsToMany(Carrito, { through: Carrito_product });


// Agregamos la relación entre el modelo Carrito y User
// Carrito.belongsTo(User);
// User.hasMany(Carrito);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};