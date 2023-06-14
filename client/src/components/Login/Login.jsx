import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { setAdmin, setToken, setUserID } from '../../features/login/loginSlice'
import { setUsuario, setCarrito } from '../../features/carrito/carritoSlice'
import { setUsuarios } from '../../features/usuarios/usuariosSlice';

const Login = () => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.login.token);
    const userID = useSelector(state => state.login.userID);
    const carrito = useSelector(state => state.carrito.carrito);
    const usuarios = useSelector(state => state.usuarios.usuarios);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [usersLoaded, setUsersLoaded] = useState(false);

    //TRAER EL SETADMIN Y EMPEZAR A ORGANIZAR TODO LO DEL ADMIN
    useEffect(() => {
      if (usuarios !== [] && usuarios.length !== 0) {
        setUsersLoaded(true);
      } 
      else if (!usuarios || usuarios.length === 0 || usuarios === []) {
      axios.get('/users')
      .then((response) => {
        setTimeout(() => {
          dispatch(setUsuarios(response.data));
        }, 1000);
      })
      .then(() => {
        setUsersLoaded(true);
        })
      .catch((error) => {
        console.log(error);
      })}
    }, [])

    const handleLogin = () => {
      axios.post('/login', {
        username: username,
        password: password
      })
      .then(response => {
        if (response.status === 200) {
          const token = response.data.token;
          localStorage.setItem('token', token);
          dispatch(setToken(token));
          setMessage('Login correcto');
    
          // Decodificar el token y obtener el id del usuario
          const decodedToken = jwt_decode(token);
          const userId = decodedToken.userId;
          const admin = decodedToken.admin;
          // Actualizar el estado del usuario en la aplicación
          dispatch(setUserID(userId));
          dispatch(setUsuario(userId));
          localStorage.setItem('userID', userId);
          dispatch(setAdmin(admin));
          localStorage.setItem('admin', admin);
        }
      })
      .then(() => {
        axios.get(`/users/${userID}`)
        .then((response) => {
          if (response.data.carritos.length === 0) {
          dispatch(setCarrito([]));
        } else {
          dispatch(setCarrito(response.data.carritos[0].products));
        }})
        .catch((error) => {
          console.log(error);
        })
      })
      .catch(error => {
        console.log(error);
        setMessage('Login incorrecto');
      });
    }

  return (
    <div>
    <h1>PANTALLA LOGIN</h1>
      <label>Username:</label>
      <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <br />
      {usersLoaded === true ? ( // muestra la lista desplegable solo si la descarga de usuarios ha terminado
        <div>
          <label>Selecciona un usuario:</label>
          <select onChange={(e) => {
            setUsername(e.target.value.split(',')[0]);
            setPassword(e.target.value.split(',')[1]);
          }}>
            <option value="">Selecciona un usuario</option>
            {usuarios.map(user => (
              <option key={user.id} value={[user.username, user.password]}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      ) : (<p>Cargando usuarios...</p>)}
      <br />
      <button onClick={handleLogin}>Login</button>
    <br />
    {message && <p>{message}</p>}
    <br />
    <Link to="/"><button>Volver</button></Link>
  </div>
  )
}

export default Login


