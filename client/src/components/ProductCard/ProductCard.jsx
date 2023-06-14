import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios';
import { setCarrito } from '../../features/carrito/carritoSlice';
import addCartIcon from '../../assets/addCart.svg';

const ProductCard = ({id, title, price, image, description, category, product}) => {
   
  const dispatch = useDispatch();
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const userIDls = localStorage.getItem('userID');
  const tokenls = localStorage.getItem('token');
  const adminls = localStorage.getItem('admin');
  const carrito = useSelector(state => state.carrito.carrito);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (tokenls) {
      setIsLogged(true);
    }
    if (tokenls === null) {
      setIsLogged(false);
    }
    if (adminls === 'true') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [tokenls, adminls])

  const addToCart = async () => {
    try {
      const quantity = cantidad;
      const userId = userIDls;
      const productId = product.id;
      const response = await axios.post('/carritos', { userId, productId, quantity });
      const updatedCarrito = response.data;
      dispatch(setCarrito(updatedCarrito));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='flex flex-col md:flex-row lg:flex-row xl:flex-row space-x-8 justify-center mx-1 md:mx-30 lg:mx-30 xl:mx-30 h-full'>
    <div className='flex flex-col items-center justify-between'>
      <Link className='flex flex-col items-center' to={`/product/${id}`}>
        <img src={image} alt="Imagen de producto" className='h-60 w-60'/>
        <h2 className='w-60 font-serif font-bold underline'> {title}</h2>
      </Link>
        <div className='w-60'>
          <div className='flex space-x-5 justify-between'>
            <p className='font-bold'>{price}</p>
            {isLogged && (
              isAdmin ? (
                <Link to={`/admin/edit/${id}`}>
                  <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Editar
                  </button>
                </Link>
              ) : (
                <div>
                  <input type="number" name="quantity" value={cantidad} min="1" onChange={(e) => setCantidad(e.target.value)} />
                  <button title='Agregar al Carrito' onClick={() => addToCart()}>
                    <img src={addCartIcon} alt="Agregar al Carrito" className=''/>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
    </div>
    <div>
      {description && <p className='w-60'>{description}</p>}
        {category && <h2>{category}</h2>}
    </div>
    </div>
  )
}

export default ProductCard
