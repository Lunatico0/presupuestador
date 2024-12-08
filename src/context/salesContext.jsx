import React, { createContext, useContext, useEffect, useState } from "react";

const SalesContext = createContext();

export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const URL = import.meta.env.VITE_API_URL;

  const fetchSales = async (saleData) => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${URL}/api/sells`, {
        method: saleData ? "POST" : "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: saleData ? JSON.stringify(saleData) : null,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al procesar las ventas");
      }

      if (saleData) {
        setSales((prevSales) => [...prevSales, result.venta]);
      } else {
        setSales(result.sales || result);
        setIsLoaded(true);
      }

      return result;

    } catch (err) {
      setError(`Error al procesar las ventas: ${err.message}`);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SalesContext.Provider
      value={{
        sales,
        loading,
        isLoaded,
        error,
        fetchSales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};
