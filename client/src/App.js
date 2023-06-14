import Home from './components/Home/Home';
import ProductDetail from './components/ProductDetail/ProductDetail';
import Login from './components/Login/Login';
import Profile from './components/Profile/Profile';
import PanelAdmin from './components/PanelAdmin/PanelAdmin';
import ProductEdit from './components/PanelAdmin/ProductEdit';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import store from './store';

function App() {
  return (
    <Provider store={store} >
    <div className='App'>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login/>} />
          <Route path="/users/:id" element={<Profile/>} />
          <Route path="/admin" element={<PanelAdmin/>} />
          <Route path="/admin/edit/:id" element={<ProductEdit/>} />
        </Routes>
      </Router>
    </div>
    </Provider>
  )

}

export default App;
