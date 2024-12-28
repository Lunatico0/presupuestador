import { createContext, useContext, useState, useCallback } from "react";
import { fetchWithErrorHandling } from "../components/utils/fetchUtils.js";

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientDetails, setClientDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const URL = import.meta.env.VITE_API_URL;

  const addClient = async (client) => {
    try {
      setLoading(true);
      const data = await fetchWithErrorHandling(`${URL}/api/clients/newClients`, {
        method: "POST",
        body: client,
      });
      setClients((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding client:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWithErrorHandling(`${URL}/api/clients`);
      if (!Array.isArray(data) || data.length === 0) {
        setClients([]);
        throw new Error("No hay clientes disponibles en la base de datos.");
      }
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const findClientById = useCallback(
    async (id) => {
      if (!id) {
        console.warn("El ID del cliente no es válido:", id);
        return;
      }

      if (clientDetails[id]) return;

      try {
        const data = await fetchWithErrorHandling(`${URL}/api/clients/${id}`);
        setClientDetails((prev) => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error(`Error buscando cliente ${id}:`, error);
      }
    },
    [clientDetails]
  );

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        fetchClients,
        addClient,
        findClientById,
        clientDetails,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => useContext(ClientsContext);
