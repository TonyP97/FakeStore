const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { Product, User, Carrito, Carrito_product } = require('../db.js');


const getApiInfo = async () => {
  try {
    let api = await axios.get('https://fakestoreapi.com/users');
    api = await api.data.map((e) => {
        const user = {
            // id: e.id,
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
        await User.bulkCreate(apiInfo);
        console.log('Usuarios cargados en la base de datos');
    } else {
      console.log('Los usuarios ya se encuentran cargados en la base de datos');
    }
  } catch (error) {
    console.log(error);
  }
}

const loadUsers = async () => { await usersToDb() }
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



router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username: username } });
  if (user && user.password === password) {
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});


module.exports = {router, loadUsers}
