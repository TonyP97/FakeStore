import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import jwt_decode from 'jwt-decode';
import { 
  setToken,
  setUserID } from '../../features/login/loginSlice'
import { setUsuario, setCarrito } from '../../features/carrito/carritoSlice'

const Login = () => {

    const dispatch = useDispatch();
    const token = useSelector(state => state.login.token);
    const userID = useSelector(state => state.login.userID);
    const carrito = useSelector(state => state.carrito.carrito);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [usersLoaded, setUsersLoaded] = useState(false);

    useEffect(() => {
      const downloadAllUsers = async () => {  
        const response = await axios.get('/users');
        setAllUsers(response.data);
        setUsersLoaded(true);
      }
      downloadAllUsers();
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
    
          // Actualizar el estado del usuario en la aplicación
          dispatch(setUserID(userId));
          dispatch(setUsuario(userId));
          localStorage.setItem('userID', userId);
        }
      })
      .then(() => {
        axios.get(`/users/${userID}`)
        .then((response) => {
          dispatch(setCarrito(response.data.carrito.products));
        })
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
      {usersLoaded && ( // muestra la lista desplegable solo si la descarga de usuarios ha terminado
        <div>
          <label>Selecciona un usuario:</label>
          <select onChange={(e) => {
            setUsername(e.target.value.split(',')[0]);
            setPassword(e.target.value.split(',')[1]);
          }}>
            <option value="">Selecciona un usuario</option>
            {allUsers.map(user => (
              <option key={user.id} value={[user.username, user.password]}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
      )}
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


