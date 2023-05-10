import React, { useEffect } from 'react'
import { useState } from 'react';
import { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCarrito, setCarroActualizado } from '../../features/carrito/carritoSlice';
import axios from 'axios';
const Carrito = () => {

    const dispatch = useDispatch();
    const carrito = useSelector(state => state.carrito.carrito);
    const userID = localStorage.getItem('userID');

    
    // const handleRemoveFromCarrt = (productId) => {
    //   const newCart = carrito.filter((product) => product.id !== productId);
    // dispatch(setCarrito(newCart));
    // localStorage.setItem("carrito", JSON.stringify(newCart));
    // };

    const handleRemoveFromCart = (productId) => {
      const userId = localStorage.getItem('userID');
      axios.delete(`http://localhost:3001/carritos/${userId}/${productId}`)
        .then(response => {
          // manejar la respuesta si es exitosa
          console.log(response.data);
        })
        .catch(error => {
          // manejar el error si ocurre
          console.error(error);
        });
    };
    
    return (
      <div className='absolute z-50 m-4 bg-white shadow-lg p-4'>
        <h2>Carrito</h2>
        {/* {carrito.map((product) => { */}
        {carrito.map((product) => {
          return (
            <div key={product.id}>
              <p>{product.title}</p>
              <p>{product.price}</p>
              <button onClick={() => handleRemoveFromCart(product.id)} >Eliminar</button>
            </div>
          )
        })}
      </div>
    );
}

export default Carrito
