import React from 'react'
import ProductCard from '../ProductCard/ProductCard';
import Carrito from '../Carrito/Carrito';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setToken, setUserID } from '../../features/login/loginSlice'
import { setCarrito } from '../../features/carrito/carritoSlice';

import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  
  const dispatch = useDispatch();
  // const login = useSelector(state => state.login);
  const userIDls = localStorage.getItem('userID');
  const tokenls = localStorage.getItem('token');
  const carrito = useSelector(state => state.carrito.carrito);
  const [userData, setUserData] = useState({});
  const [isLogged, setIsLogged] = useState(false);
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showDetails, setShowDetails] = useState(false);


  useEffect(() => {

    if (tokenls && userIDls) {
      axios.get(`/users/${userIDls}`)
      .then((response) => {
        setUserData(response.data);
        dispatch(setCarrito(response.data.carrito.products));
      })
      .catch((error) => {
        console.log(error);
      })
    }

    if (tokenls !== null) {
      setIsLogged(true);
    }

    axios.get('/products')
      .then((response) => {
        setTimeout(() => {
          setProducts(response.data);
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      })

  }, [carrito])

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    localStorage.removeItem('userID');
    setIsLogged(false); // Cambia el estado de isLogged a false
    dispatch(setToken(null)); // Actualiza el estado del token en la aplicación
    dispatch(setUserID(null));
    dispatch(setCarrito([])); // Actualiza el estado del carrito en la aplicación
  };

  
    return (
      <div>
        <div className='flex justify-end mr-1'>
          {
            isLogged ? 
            <div className='relative'>
              <p className='text-right'>Bienvenido, <button className='text-blue-500 hover:text-yellow-400 focus:text-yellow-400' onClick={() => setShowDetails(!showDetails) }>{userData.username}</button></p>
              {showDetails &&
                <div className='absolute right-0 top-6 z-50 flex flex-col bg-yellow-200 rounded border-yellow-400 border-dashed border'>
                  <Link className='hover:bg-yellow-400 p-1.5' to={`/users/${userIDls}`}><button>Profile</button></Link>
                  <button className='hover:bg-yellow-400 p-1.5' onClick={handleLogout}>Logout</button>
                </div>   
              }
            </div>
            :
            <div className=''>
              <Link to="/login"><button>Login</button></Link>
            </div>
          }

        </div>
      <div className="flex flex-col items-center relative">
        <a href={"/"}>
        <h1 className='text-3xl font-mono font-medium uppercase mb-8 p-2.5 shadow-xl shadow-yellow-300 rounded-2xl border-4 border-yellow-300 border-double animate-[bounce_0.2s] cursor-pointer'>Fake.Store</h1>
        </a>
        <div>
          <h1 className='text-center font-semibold my-5 text-2xl'>Explore nuestros productos</h1>
          <div>   
              {carrito.length > 0 && 
              <div>
                <button onClick={() => setShowCart(!showCart)}>
                  CARRO
                </button>
                {showCart && <Carrito />}
              </div>
              }
          </div>
          {/* <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-20 lg:gap-40 xl:gap-40 mx-10'> */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-20 lg:gap-40 xl:gap-40 mx-10'>
          {products.length === 0 ? 
            <p>Cargando...</p >
          : products.map((product) => {
            return (
              <div className=' rounded-xl w-fit min-h-300'>
                <ProductCard 
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  price={`$ ` + product.price}
                  product={product}
                />
              </div>
            )
          })}
          </div>

        </div>
      </div>
      </div>
    );
}

export default Home
