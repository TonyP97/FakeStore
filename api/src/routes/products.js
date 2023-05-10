const express = require('express');
const router = express.Router();
const axios = require('axios');
const { Product, User, Carrito, Carrito_product } = require('../db.js');


const getApiProductsInfo = async () => {
    try {
      let apiUrl = await axios.get('https://fakestoreapi.com/products');
      
      apiUrl = await apiUrl.data.map((e) => {
          const product = {
            id: e.id,
            title: e.title,
            price: e.price,
            description: e.description,
            category: e.category,
            image: e.image,
          }
          return product;
      });
      return apiUrl;
    
    } catch (error) {
      console.log(error);
    }
  };
  
  const productsToDb = async () => {
    try {
      const products = await Product.findAll();
      if (!products.length) {
        const apiInfo = await getApiProductsInfo();
          await Product.bulkCreate(apiInfo);
          console.log('Productos cargados en la base de datos');
      } else {
        console.log('Los productos ya se encuentran cargados en la base de datos');
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  const loadProducts = async () => { await productsToDb() }
  // loadProducts();
  
  
  // Configura las rutas de tu servidor  
  router.get('/products', async (req, res) => {
    try {
      const allProducts = await Product.findAll({
        include: {
          model: Carrito,
          include: {
            model: User,
          }
        }
      });
      res.status(200).send(allProducts);
    } catch (error) {
      console.error(error.message);
    }
  });
  
  router.get('/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const productByID = await Product.findByPk(id, {
        include: {
          model: Carrito,
          include: {
            model: User,
          }
        }
      });
      res.status(200).send(productByID);
    } catch (error) {
      console.error(error.message);
    }
  });

module.exports = {router, loadProducts};
