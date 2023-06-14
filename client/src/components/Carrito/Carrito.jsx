import React, { useEffect } from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCarrito, setCarroActualizado } from '../../features/carrito/carritoSlice';
import axios from 'axios';

const Carrito = ({showCart}) => {

    const dispatch = useDispatch();
    const carrito = useSelector(state => state.carrito.carrito);
    const userID = localStorage.getItem('userID');
    // const [localCarrito, setLocalCarrito] = useState([]);
    // console.log(carrito)

    
    useEffect(() => {
      if (userID) {
        axios.get(`/carritos/${userID}`)
        .then((response) => {
          if (response.data !== carrito) {
            dispatch(setCarrito(response.data));
          }
        })
      }
    }, [carrito])

    // useEffect(() => {
    //   if (carrito !== localCarrito) {
    //     setLocalCarrito(carrito);
    //   }
    // }, [carrito]);

    useEffect(() => {
      if (!userID) {
        dispatch(setCarrito([]));
        // setLocalCarrito([]);
      }
    }, [userID]);

    const handleRemoveFromCart = (productId) => {
      const userId = localStorage.getItem('userID');
      axios.delete(`/carritos/${userId}/${productId}`)
        .then(response => {
          // manejar la respuesta si es exitosa
          
        })
        .catch(error => {
          // manejar el error si ocurre
          console.error(error);
        });
    };

  const handleUpdateCart = (product, action) => {
    const userId = localStorage.getItem('userID');
    let newQuantity;

    if (action === 'increment') {
      newQuantity = product.carrito_product.quantity + 1;
    } else if (action === 'decrement') {
      newQuantity = product.carrito_product.quantity - 1;
      if (newQuantity < 1) {
        // Si la cantidad es menor a 1, no permitir valores negativos y salir de la función
        return;
      }
    }

    axios.patch(`/carritos/${userId}/${product.id}`, { quantity: newQuantity })
      .then(response => {
        // manejar la respuesta si es exitosa
      })
      .catch(error => {
        // manejar el error si ocurre
        console.error(error);
      });
  };

  // puede que la solución de abajo tambien funcione si agrego un ID autoincrement en el model de carrito_product pero todavia no lo se.
  // funciona, el problema es que al agregar o modifica run producto en el carrito, este vuelve a ser llamado y se reordena distinto. una posible solución es agregar en el model carrito_product" un campo llamado order, y despues ordenar la lista del carrito basandose en ese orden. La logica deberia agregarse en el post de carritos, y creo que con eso ya estaria, sino puede que tambien haya que agregarlo en el patch de carritos
    
    return (
      <div className='absolute z-50 m-4 bg-white shadow-lg p-4'>
        {showCart &&(
          <>
          {!Array.isArray(carrito?.products) || carrito.products.length === 0 ?
            <p>No hay productos en el carrito</p>
            :
            <>
              <h2>Carrito</h2> <p>Precio: {carrito.price}</p>
              <br />
              {carrito.products.map((product) => {
                const cartItemId = product.id;
                return (
                  <div key={cartItemId}>
                    <div>
                      <p>{product.title}</p>
                      <p>{product.price}</p>
                      <button onClick={() => handleRemoveFromCart(product.id)} >Eliminar</button>
                    </div>
                    <div>
                      <p>Cantidad: {product.carrito_product.quantity}</p>
                      <button onClick={() => handleUpdateCart(product, 'increment')} >+</button>
                      <br />
                      <button onClick={() => handleUpdateCart(product, 'decrement')} >-</button>
                      <p>Precio total: {product.carrito_product.price}</p>
                    </div>
                    <br />
                  </div>
                )
              })}
            </>
              }
          </>
        )}
      </div>
    );
}

export default Carrito
