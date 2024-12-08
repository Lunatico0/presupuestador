import React, { useState } from 'react';
const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const addToCart = (id, quantity) => {
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + quantity,
    }));
  };

  const getDistinctProductCount = () => {
    return Object.keys(cart).length;
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, getDistinctProductCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
