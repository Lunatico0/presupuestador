import { data } from "autoprefixer";
import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchWithErrorHandling } from "../components/utils/fetchUtils.js";

const SalesContext = createContext();

export const useSales = () => useContext(SalesContext);

export const SalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState('');
  const URL = import.meta.env.VITE_API_URL;

  const fetchSales = async (saleData) => {
    setLoading(true);
    setIsLoaded(false);
    setError("");

    try {
      const result = await fetchWithErrorHandling(`${URL}/api/sells`, {
        method: saleData ? "POST" : "GET",
        body: saleData ? JSON.stringify(saleData) : null,
      });

      if (saleData) {
        setSales((prevSales) => [...prevSales, result.venta]);
      } else {
        setSales(result.sales || result);
        setIsLoaded(true);
      }

      return result;
    } catch (err) {
      setError(`Error al procesar las ventas: ${err.message}`);
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
