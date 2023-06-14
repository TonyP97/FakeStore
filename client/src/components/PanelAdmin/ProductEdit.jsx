import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'

const ProductEdit = () => {

    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({
      id: '',
      title: '',
      image: '',
      description: '',
      category: '',
      price: 0,
    });

    useEffect(() => {
      axios.get(`/products/${id}`)
      .then((response) => {
        const { id, title, image, description, category, price } = response.data;
        setProduct({
          id,
          title,
          image,
          description,
          category,
          price,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
    }, [id]);

  console.log(product)

  const handleUpdateProduct = () => {
    axios.patch(`/admin/edit/${product.id}`, product)
      .then((response) => {
        // Lógica adicional después de la actualización
        console.log('Producto actualizado:', response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Editar Producto</h1>
      <p>ID: {product.id}</p>
      <input type="text" value={product.title} onChange={(e) => setProduct({ ...product, title: e.target.value })} />
      <input type="text" value={product.image} onChange={(e) => setProduct({ ...product, image: e.target.value })} />
      <input type="text" value={product.description} onChange={(e) => setProduct({ ...product, description: e.target.value })} />
      <input type="text" value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} />
      <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} />


      <button onClick={handleUpdateProduct}>Actualizar Producto</button>


      {/* Renderizar otros campos de edición */}
    </div>
  )
}

export default ProductEdit
