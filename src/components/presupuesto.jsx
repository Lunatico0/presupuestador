import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext.jsx';
import { useProducts } from '../context/productContext.jsx';

const Presupuesto = () => {
  const { cart, setCart } = useCart();
  const { productDetails, fetchProductById } = useProducts();

  useEffect(() => {
    const fetchDetails = async () => {
      for (let id of Object.keys(cart)) {
        await fetchProductById(id);
      }
    };
    if (Object.keys(cart).length > 0) {
      fetchDetails();
    }
  }, [cart, fetchProductById]);

  const handleCantidadChange = (id, value) => {
    const cantidad = parseInt(value, 10);
    if (isNaN(cantidad) || cantidad < 1) {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: "",
      }));
    } else {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: cantidad,
      }));
    }
  };

  const handleBlur = (id) => {
    if (!cart[id]) {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: 1,
      }));
    }
  };

  const handleRemoveProduct = (id) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  return (
    <div>
      {
        Object.keys(cart).length <= 0 ? (
          <p>No hay productos en el carrito</p>
        ) : <>
          <h2 className="text-xl font-bold mb-4 text-center">Presupuesto</h2>
          <div className="grid gap-4">
            {Object.keys(cart).map((id) => (
              <div
                key={id}
                className="rounded-lg shadow p-4 bg-secondary/40 flex flex-col lg:flex-row lg:items-center lg:gap-6"
              >
                <img
                  src={productDetails[id]?.product.thumbnails[0]}
                  alt={productDetails[id]?.product.title}
                  className="w-full h-40 object-cover rounded-lg lg:w-36 lg:h-36"
                />

                <div className="flex flex-col gap-2 lg:flex-1">
                  <h2 className="text-lg font-semibold text-center lg:text-left">
                    {productDetails[id]?.product.title}
                  </h2>
                  <p className="text-sm text-gray-600 text-center lg:text-left">
                    {productDetails[id]?.product.description[0]?.value}
                  </p>
                  <p className="text-md font-medium text-center lg:text-left">
                    Precio: ${productDetails[id]?.product.price.toFixed(2)}
                  </p>
                  <p className="text-md font-medium text-center lg:text-left">
                    Subtotal: ${(cart[id] * productDetails[id]?.product.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 lg:gap-4 lg:flex-row lg:justify-end">
                  <input
                    type="number"
                    className="w-full lg:w-20 h-10 px-2 border border-gray-300 rounded focus:outline-none"
                    min={1}
                    value={cart[id] || ""}
                    onChange={(e) => handleCantidadChange(id, e.target.value)}
                    onBlur={() => handleBlur(id)}
                  />
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleRemoveProduct(id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );

};

export default Presupuesto;
