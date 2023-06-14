import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import axios from 'axios';
import { setProductos } from '../../features/productos/productosSlice';
import { setUsuarios } from '../../features/usuarios/usuariosSlice';

const PanelAdmin = () => {

    const dispatch = useDispatch();
    const productos = useSelector(state => state.productos.productos);
    const usuarios = useSelector(state => state.usuarios.usuarios);

    useEffect(() => {
        axios.get('/products')
          .then((response) => {
            setTimeout(() => {
              dispatch(setProductos(response.data));
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          })
    
          axios.get('/users')
          .then((response) => {
            setTimeout(() => {
              dispatch(setUsuarios(response.data));
            }, 1000);
          })
          .catch((error) => {
            console.log(error);
          })
      }, [])

    

  return (
    <div>
      <h1>PANEL ADMIN</h1>
        <div className='flex justify-center'>

            <div>
                {/* CREO QUE PUEDO TRAER PRODUCTCARD Y HACER TODO EDESDE ESE COMPONENTE */}
                <h2>Productos</h2>
                <ul className='grid grid-cols-5 gap-x-4 gap-y-4'>
                    {productos.length === 0 || !productos ?
                        <p>Cargando productos...</p>
                        : 
                    productos.map((product) => {
                        return (
                            <ProductCard
                            key={product.id}
                            id={product.id}
                            image={product.image}
                            title={product.title}
                            price={`$ ` + product.price}
                            product={product}
                            />
                        )
                    })
                    }
                </ul>
            </div>

            <div>
                <h2>Usuarios</h2>
                <ul>
                    {usuarios.length === 0 || !usuarios ?
                        <p>Cargando usuarios...</p>
                        :
                    usuarios.map((usuario) => {
                        return (
                            <li key={usuario.id}>
                                <h3>{usuario.username}</h3>
                                <p>{usuario.email}</p>
                                <br />
                            </li>
                        )
                    })
                    }
                </ul>
            </div>

        </div>
    </div>
  )
}

export default PanelAdmin
