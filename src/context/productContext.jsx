import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [fetchedIds, setFetchedIds] = useState(new Set());

  const fetchProductById = async (id) => {
    if (!fetchedIds.has(id)) { // Verifica si ya se ha solicitado este producto
      try {
        setLoading(true);
        const response = await fetch(`https://backend-70085.onrender.com/api/products/${id}`);
        const data = await response.json();
        setProductDetails((prevDetails) => ({
          ...prevDetails,
          [id]: {
            ...data,
          }
        }));
        setFetchedIds((prevIds) => new Set(prevIds.add(id)));
      } catch (err) {
        setError('Error al cargar el detalle del producto: ', err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://backend-70085.onrender.com/api/products?limit=350');
        const data = await response.json();
        setProducts(data.payload);
      } catch (err) {
        setError('Error al cargar los productos: ', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        error,
        productDetails,
        fetchProductById, // Pasamos la función a los componentes
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
