import React, { createContext, useState, useEffect, useContext } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [fetchedIds, setFetchedIds] = useState(new Set());

  const fetchProductById = async (id) => {
    if (!fetchedIds.has(id)) {
      try {
        setLoading(true);
        const response = await fetch(`${URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Producto no encontrado');
        const data = await response.json();
        setProductDetails((prevDetails) => ({
          ...prevDetails,
          [id]: {
            ...data,
          }
        }));
        setFetchedIds((prevIds) => new Set(prevIds.add(id)));
      } catch (err) {
        setError('Error al cargar el detalle del producto: ', err.message);
        console.error("Error al cargar producto: ", err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${URL}/api/products?limit=350`);
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

  const saveProduct = async (productData, id = null) => {
    try {
      setLoading(true);
      const url = id
        ? `${URL}/api/products/${id}`
        : `${URL}/api/products`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result.message || 'Error al guardar el producto');
      }

      if (id) {
        setProductDetails((prevDetails) => ({
          ...prevDetails,
          [id]: result.newProduct,
        }));
      } else {
        setProducts((prevProducts) => [...prevProducts, result.newProduct]);
      }

      return result || 'Producto actualizado correctamente';
    } catch (err) {
      setError(`Error al guardar el producto: ${err.message}`);
      console.error("Error al guardar producto: ", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== id));

      setFetchedIds((prevIds) => {
        const newIds = new Set(prevIds);
        newIds.delete(id);
        return newIds;
      });

      setProductDetails((prevDetails) => {
        const { [id]: removed, ...rest } = prevDetails;
        return rest;
      });

      return Promise.resolve();
    } catch (err) {
      setError(`Error al eliminar el producto: ${err.message}`);
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        saveProduct,
        products,
        loading,
        error,
        productDetails,
        fetchProductById,
        deleteProduct
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
