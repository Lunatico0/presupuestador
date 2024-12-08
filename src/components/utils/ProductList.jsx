import React, { useState } from 'react';
import { useCart } from '../../context/cartContext.jsx';
import ProductCard from './ProductCard';

const ProductsList = ({ products }) => {
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState({});

  const agregarProducto = (id) => {
    const cantidad = parseInt(quantities[id] || 1, 10);
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (parseInt(prevCart[id] || 0, 10) + cantidad),
    }));
  };

  const handleCantidadChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value === "" || isNaN(value) ? "" : value,
    }));
  };

  const handleCantidadBlur = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value === "" || isNaN(value) || value < 1 ? 1 : value,
    }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            quantity={quantities[product._id] || ""}
            onQuantityChange={(value) => handleCantidadChange(product._id, value)}
            onAddToCart={() => agregarProducto(product._id)}
            onQuantityBlur={(value) => handleCantidadBlur(product._id, value)}
          />
        ))
      ) : (
        <p>No se encontraron productos</p>
      )}
    </div>
  );
};

export default ProductsList;
