import React from 'react'
import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom'

const ProductDetail = () => {

  const token = localStorage.getItem('token');
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    if (token !== null) {
      setIsLogged(true);
    }
  }, [token])
  
    const { id } = useParams();
    const [product, setProduct] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`/products/${id}`)
        .then((response) => {
            setProduct(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
        })
    })

  return (
    <div>
      <h1>Información del producto</h1>
      {loading ? 
        <p>Cargando...</p> :
        <ProductCard
            id={product.id}
            title={product.title}
            image={product.image}
            description={product.description}
            category={product.category}
            price={`$ ` + product.price}
            product={product}
        />
      }
      <Link to="/"><button>Volver</button></Link>
    </div>
  )
}

export default ProductDetail
