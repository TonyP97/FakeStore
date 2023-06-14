import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Profile = () => {

    const userID = localStorage.getItem('userID');
    const carrito = useSelector(state => state.carrito.carrito);
    const [userData, setUserData] = useState({});

    

  useEffect(() => {
    axios.get(`/users/${userID}`)
      .then((response) => {
        setUserData(response.data);
      })
        .catch((error) => {
        console.log(error);
      })

    // axios.get(`/carritos?userId=${userID}`)
    // .then((response) => {
    //   console.log(response.data[0].products);
    // })
    // .catch((error) => {
    //   console.log(error);
    // });
  }, [])

  return (
    <div>
        {Object.keys(userData).length === 0 ? 
            <p>Cargando...</p >
            :
            <div>
                <h1>Perfil de {userData.username }</h1>
                <p>Nombre: {userData.firstname} {userData.lastname}</p>
                <p>Email: {userData.email}</p>
                <p>Dirección: {userData.address.street} {userData.address.number}, {userData.address.city}</p>
                <p>Teléfono: {userData.phone}</p>
                {!Array.isArray(carrito?.products) || carrito.products.length === 0 ?
                    <p>No hay productos en el carrito</p>
                    :
                    
                    carrito.products.map((producto) => {
                        return (
                          <ul>
                            <li>
                              <div key={producto.id}>
                                  <p>{producto.title}</p>
                                  <p>${producto.price}</p>
                                  <p>{producto.category}</p>
                                  <p>{producto.description}</p>
                                  <img src={producto.image} alt={producto.title} />
                              </div>
                            </li> 
                          </ul>
                        )
                    })
              }

            </div>    
        }
    </div>
  )
}

export default Profile
