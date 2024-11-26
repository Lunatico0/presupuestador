import React, { useState } from 'react';
const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
