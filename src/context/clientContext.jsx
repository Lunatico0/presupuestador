import { createContext, useContext, useState, useCallback } from "react";

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [clientDetails, setClientDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_API_URL;

  const addClient = async (client) => {
    try {
      setLoading(true);
      console.log(client);
      const response = await fetch(`${URL}/api/clients/newClients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(client),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Error adding client: ${response.statusText}`);
      }
      const data = await response.json();
      console.log(data);
      setClients((prev) => [...prev, data]);
    } catch (error) {
      console.error("Error adding client:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/clients`);
      if (!response.ok) throw new Error(`Error fetching clients: ${response.statusText}`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const findClientById = useCallback(
    async (id) => {
      // Evita hacer el fetch si ya existe el cliente
      if (clientDetails[id]) return;

      try {
        const response = await fetch(`${URL}/api/clients/${id}`);
        if (!response.ok) throw new Error(`Error fetching client: ${response.statusText}`);
        const data = await response.json();

        // Agrega el cliente al estado
        setClientDetails((prev) => ({ ...prev, [id]: data }));
      } catch (error) {
        console.error(`Error buscando cliente ${id}:`, error);
      }
    },
    [clientDetails]
  );

  return (
    <ClientsContext.Provider value={{
      clients,
      loading,
      fetchClients,
      addClient,
      findClientById,
      clientDetails
    }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => useContext(ClientsContext);
