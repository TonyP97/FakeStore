const express = require('express');
const router = express.Router();
const axios = require('axios');

const { Product, User, Carrito, Carrito_product } = require('../db.js');

router.get('/carritos', async (req, res) => {
    try {
       const allCarritos = await Carrito.findAll({
          include: {
            model: Product,
          }
       })
       res.status(200).send(allCarritos)
    } catch (error) {
       console.log(error)
    }
 });

router.get('/carritos/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const carrito = await Carrito.findOne({
      where: {
        finalizado: false
      },
      include: {
        model: Product,
      },
      include: {
        model: User({
          where: {
            id: userId
          }
        })
      }
    });
    res.status(200).json(carrito);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/carritos', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    // Buscamos el producto en la base de datos
    const producto = await Product.findByPk(productId);
    if (!producto) {
      return res.status(404).json({ error: 'El producto no existe' });
    }
    // Buscamos el carrito en la base de datos o lo creamos
    let carrito = await Carrito.findOne({
      where: {
        userId,
        finalizado: false,
      },
      include: Product,
    });
    // Si no existe el carrito, lo creamos
    if (!carrito) {
      carrito = await Carrito.create({
        userId,
        price: 0,
        finalizado: false,
      });
      await carrito.setUser(userId);
    }
    // Buscamos el producto en el carrito
    let productoEnCarrito = await Carrito_product.findOne({
      where: {
        carritoId: carrito.id,
        productId: producto.id
      }
    });
    // Calculamos el precio del producto
    const precioProducto = producto.price * quantity;
    if (productoEnCarrito) {
      // Si el producto ya está en el carrito, actualizamos su cantidad y precio
      const nuevaCantidad = productoEnCarrito.quantity + quantity;
      const nuevoPrecio = productoEnCarrito.price + precioProducto;
      // Recargamos el carrito para actualizar los productos y el precio total
      await carrito.reload();
      await carrito.addProduct(producto, {
        through: {
          quantity: nuevaCantidad,
          price: nuevoPrecio,
        }
      });
      let productosEnCarrito = await carrito.getProducts();
      let nuevoPrecioTotal = 0;
      productosEnCarrito.forEach(productoEnCarrito => {
        nuevoPrecioTotal += productoEnCarrito.carrito_product.price;
      });
      carrito.price = nuevoPrecioTotal;
      await carrito.save();
    } else {
      // Si el producto no está en el carrito, lo agregamos
      await carrito.addProduct(producto, {
        through: {
          quantity: quantity,
          price: precioProducto,
        }
      });
      // Recargamos el carrito para actualizar los productos y el precio total
    await carrito.reload();
    let productosEnCarrito = await carrito.getProducts();
    let nuevoPrecioTotal = 0;
    productosEnCarrito.forEach(productoEnCarrito => {
      nuevoPrecioTotal += productoEnCarrito.carrito_product.price;
    });
      carrito.price = nuevoPrecioTotal;
      await carrito.save();
    }
    
    // Devolvemos el carrito actualizado
    res.json({ 
      carrito: {
        id: carrito.id,
        price: carrito.price,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocurrió un error al procesar la solicitud' });
  }
});

router.patch('/carritos/:userId/:productId', async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const { quantity } = req.body;
  const producto = await Product.findByPk(productId);
  try {
    // Buscamos el carrito activo del usuario
    let carrito = await Carrito.findOne({
      where: {
        finalizado: false,
        userId: userId
      },
      include: Product,
    });
    if (carrito) {
      // Buscamos el producto en el carrito
      let productoEnCarrito = await Carrito_product.findOne({
        where: {
          carritoId: carrito.id,
          productId: producto.id
        }
      });
      if (productoEnCarrito) {
        // Si el producto existe en el carrito, actualizamos la cantidad y el precio
        const nuevaCantidad = productoEnCarrito.quantity + quantity;
        if (nuevaCantidad > 0) {
          const nuevoPrecio = producto.price * nuevaCantidad;
          await carrito.addProduct(producto, {
            through: {
              quantity: nuevaCantidad,
              price: nuevoPrecio,
            },
          });
      
          // Recuperamos todos los productos en el carrito y calculamos el nuevo precio total
          let productosEnCarrito = await carrito.getProducts();
          let nuevoPrecioTotal = 0;
          productosEnCarrito.forEach(productoEnCarrito => {
            nuevoPrecioTotal += productoEnCarrito.carrito_product.price;
          });
          carrito.price = nuevoPrecioTotal;
          await carrito.save();
      
          // Recuperamos el carrito actualizado para enviarlo como respuesta
          const updatedCarrito = await Carrito.findOne({
            where: { id: carrito.id },
            include: Product,
            include: User
          });
          res.status(200).json(updatedCarrito);
        } else {
          // Si la cantidad es cero o negativa, eliminamos el producto del carrito
          await carrito.removeProduct(producto);
      
          // Recuperamos todos los productos en el carrito y calculamos el nuevo precio total
          let productosEnCarrito = await carrito.getProducts();
          let nuevoPrecioTotal = 0;
          productosEnCarrito.forEach(productoEnCarrito => {
            nuevoPrecioTotal += productoEnCarrito.carrito_product.price;
          });
          carrito.price = nuevoPrecioTotal;
          await carrito.save();
      
          // Recuperamos el carrito actualizado para enviarlo como respuesta
          const updatedCarrito = await Carrito.findOne({
            where: { id: carrito.id },
            include: Product,
            include: User
          });
          res.status(200).json(updatedCarrito);
        }
      } else {
        // Si el producto no existe en el carrito, enviamos una respuesta con un mensaje de error
        res.status(404).json({ message: 'El producto no está en el carrito' });
      }
    } else {
      // Si no existe el carrito, enviamos una respuesta con un mensaje de error
      res.status(404).json({ message: 'No se encontró un carrito activo para el usuario especificado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



router.delete('/carritos/:userId/:productId', async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    // Buscamos el carrito activo del usuario
    const carrito = await Carrito.findOne({
      where: {
        finalizado: false,
        userId: userId
      }
    });
    if (carrito) {
      // Si el carrito existe, eliminamos el producto del carrito
      await carrito.removeProduct(productId);
      // Recuperamos el carrito actualizado para enviarlo como respuesta
      const updatedCarrito = await Carrito.findOne({
        where: { id: carrito.id },
        include: Product,
        include: User
      });
      res.status(200).json(updatedCarrito);
    } else {
      // Si no existe el carrito, enviamos una respuesta con un mensaje de error
      res.status(404).json({ message: 'No se encontró un carrito activo para el usuario especificado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


  module.exports = router;