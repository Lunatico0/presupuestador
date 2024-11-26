import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto
const ProductsContext = createContext();

// Crear el proveedor del contexto
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://backend-70085.onrender.com/api/products?limit=350');
        const data = await response.json();
        setProducts(data.payload);
      } catch (err) {
        setError('Error al cargar los productos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Crear un hook para usar el contexto en otros componentes
export const useProducts = () => useContext(ProductsContext);
