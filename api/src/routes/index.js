const { Router } = require('express');
const router = Router();

// traigo las tablas
const { User, Product, Carrito, Carrito_product } = require("../db.js")

// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const {router: Users, loadUsers} = require("./users.js")
const {router: Products, loadProducts} = require("./products.js")
const Carritos = require("./carritos.js")



// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use("/", Users)
router.use("/", Products)
router.use("/", Carritos)


module.exports = router;