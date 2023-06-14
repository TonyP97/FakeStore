const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Product, User, Carrito, Carrito_product } = require('../db.js');


const getApiInfo = async () => {
  try {
    let api = await axios.get('https://fakestoreapi.com/users');
    api = await api.data.map((e) => {
        const user = {
            email: e.email,
            username: e.username,
            password: e.password,
            firstname: e.name.firstname,
            lastname: e.name.lastname,
            address: e.address.street + ' ' + e.address.number + ' ' + e.address.city,
            phone: e.phone,
        }
        return user;
    });
    return api;
  
  } catch (error) {
    console.log(error);
  }
};

const usersToDb = async () => {
  try {
    const users = await User.findAll();
    if (!users.length) {
      const apiInfo = await getApiInfo();

      const usersWithHashedPasswords = await Promise.all(apiInfo.map(async (e) => {
        const hashedPassword = await bcrypt.hash(e.password, 10);
        return {
          email: e.email,
          username: e.username,
          password: hashedPassword,
          firstname: e.firstname,
          lastname: e.lastname,
          address: e.address,
          phone: e.phone,
        };
      }));
        await User.bulkCreate(usersWithHashedPasswords);
        console.log('Usuarios cargados en la base de datos');
    } else {
      console.log('Los usuarios ya se encuentran cargados en la base de datos');
    }
  } catch (error) {
    console.log(error);
  }
}


//ADMIN
const initializateAdmin = async () => {
  try {
    // Crear usuario administrador si no existe
    const adminUser = await User.findOne({ where: { email: 'admin@fakestore.com' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdminUser = await User.create({
        email: 'admin@fakestore.com',
        username: 'admin',
        password: hashedPassword,
        firstname: 'Admin',
        lastname: 'User',
        address: '123 Admin Street',
        phone: '123456789',
        isAdmin: true,
      });
      console.log('Usuario administrador creado:', newAdminUser);
    } else {
      console.log('El usuario administrador ya existe en la base de datos');
    }
  }
  catch (error) {
    console.log(error);
  }
}
const loadUsers = async () => { await usersToDb(), await initializateAdmin() }
// loadUsers();



// Configura las rutas de tu servidor  
router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.findAll({
      include: {
        model: Carrito,
        include: {
          model: Product,
        }
      }
    });
    res.status(200).send(allUsers);
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userById = await User.findByPk(id, {
      include: {
        model: Carrito,
        include: {
          model: Product,
        }
      }
    });
    res.status(200).send(userById);
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/users', async (req, res) => {
  try {
    const { email, username, password, firstname, lastname, address, phone } = req.body;
    const newUser = await User.create({
      email,
      username,
      password,
      firstname,
      lastname,
      address,
      phone,
    });
    res.status(200).send(newUser);
  } catch (error) {
    console.error(error.message);
  }
});



// router.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ where: { username: username } });
//   if (user && user.password === password) {
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       res.status(401).json({ error: 'Credenciales incorrectas' });
//     } else {
//     const token = jwt.sign({ userId: user.id, admin: user.isAdmin }, process.env.SECRET_KEY);
//     res.json({ token });
//     }
//   } else {
//     res.status(401).json({ error: 'Credenciales incorrectas' });
//   }
// });
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username } });
  if (user) {
      const token = jwt.sign({ userId: user.id, admin: user.isAdmin }, process.env.SECRET_KEY);
      res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

router.patch('/admin/edit/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, image, description, category } = req.body;
    const product = await Product.findByPk(id);
    if (product) {
      await product.update({
        title,
        price,
        image,
        description,
        category,
      });
      res.status(200).send(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error(error.message);
  }
});


module.exports = {router, loadUsers}
