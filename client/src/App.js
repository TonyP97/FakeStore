import Home from './components/Home/Home';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import store from './store';

function App() {
  return (
    <Provider store={store} >
    <div className='App bg-yellow-100'>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/users/:id" element={<Profile/>} />
        </Routes>
      </Router>
    </div>
    </Provider>
  )

}

export default App;
