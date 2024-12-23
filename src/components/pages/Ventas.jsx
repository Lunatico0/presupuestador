import React, { useState, useEffect, useMemo } from "react";
import { useSales } from "../../context/salesContext.jsx";
import { useClients } from "../../context/clientContext.jsx";
import { useProducts } from "../../context/productContext.jsx";
import Search from "../utils/Search.jsx";
import { filterItems } from "../utils/filteredItems.js";

const Ventas = () => {
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const { sales, isLoaded, fetchSales, loading: salesLoading } = useSales();
  const { products, loading: productsLoading } = useProducts();
  const { clients, fetchClients, clientDetails, loading: clientsLoading, findClientById } = useClients();

  useEffect(() => {
    if (!isLoaded) fetchSales();
  }, [isLoaded, fetchSales]);

  useEffect(() => {
    if (clients.length === 0) fetchClients();
  }, [clients, fetchClients]);

  useEffect(() => {
    const fetchMissingClients = async () => {
      // Crear una lista única de IDs no buscados
      const uniqueClientIds = [...new Set(sales.map((venta) => venta.client._id))];

      for (const clientId of uniqueClientIds) {
        if (!clientDetails[clientId]) {
          await findClientById(clientId);
        }
      }
    };

    if (sales.length > 0) fetchMissingClients();
  }, [sales, clientDetails, findClientById]);

  const isDataLoading = !isLoaded || salesLoading || productsLoading || clientsLoading;

  const filteredSales = useMemo(() => {
    let filtered = sales;

    if (selectedClient) {
      filtered = filtered.filter((venta) => venta.client._id === selectedClient._id);
    }

    return filterItems(
      filtered,
      search,
      (sale) => `${sale.client?.name || ""} ${sale.client?.lastName || ""}`
    );
  }, [sales, selectedClient, search]);

  const calcularTotal = (productos = []) =>
    productos.reduce(
      (acc, prod) => acc + (prod.salePrice - prod.buyPrice) * prod.quantity,
      0
    );

  const obtenerTituloProducto = (id) => {
    const producto = products.find((p) => p._id === id);
    return producto ? producto.title : null;
  };

  const handleSelectClient = (client) => setSelectedClient(client);

  if (isDataLoading) return <div>Cargando ventas y productos...</div>;

  return (
    <div className="w-full">
      <div className="max-w-full md:max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">Ventas</h1>
          <Search
            search={search}
            setSearch={setSearch}
            type="sales"
            customData={clients}
            onSelect={handleSelectClient}
            searchFields={["name", "lastName", "dni", "email"]}
          />
        </div>
        <div className="overflow-auto max-h-[75vh] w-full bg-gray-800 rounded-lg p-1 pt-2 md:p-2 shadow-md">
          {filteredSales.map((venta) => {
            const clientData = clientDetails[venta.client._id] || {};
            const address = clientData.address || {};
            return (
              <details key={venta._id} className="bg-gray-700 border border-gray-600 rounded-lg my-1 p-1">
                <summary className="cursor-pointer flex flex-col md:grid md:grid-cols-[1fr_3fr_1fr] justify-center items-center">
                  <span className="font-semibold">{new Date(venta.date).toLocaleDateString()}</span>
                  <div className="text-sm text-gray-300 md:text-left text-center mt-2 md:mt-0">
                    <p className="text-base"><strong>Cliente:</strong> {clientData.name} {clientData.lastName}</p>
                    <p className="text-base"><strong>Dirección:</strong> {address.street ? `${address.street} ${address.number}` : "Dirección no disponible"}</p>
                  </div>
                  <span className="font-bold text-lg text-green-400">Total: ${calcularTotal(venta.products || []).toFixed(2)}</span>
                </summary>
                <div className="mt-4">
                  <div className="bg-gray-600 p-4 rounded-lg">
                    <p className="text-base"><strong>Email:</strong> {clientData.email}</p>
                    <p className="text-base"><strong>Dirección:</strong> {address.street ? `${address.street} ${address.number}` : "Dirección no disponible"}</p>
                  </div>
                  <div className="mt-4 overflow-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-gray-600">
                        <tr>
                          <th className="p-2 text-left">Cant.</th>
                          <th className="p-2 text-left">Título</th>
                          <th className="p-2 text-left">Ingreso</th>
                          <th className="p-2 text-left">Costo</th>
                          <th className="p-2 text-left">Ganancia</th>
                        </tr>
                      </thead>
                      <tbody>
                        {venta.products?.map((product) => {
                          const titulo = obtenerTituloProducto(product.productId);
                          return (
                            <tr key={product.productId} className="border-t border-gray-500">
                              <td className="p-2">{product.quantity}</td>
                              <td className="p-2 line-clamp-2">{titulo || "Cargando..."}</td>
                              <td className="p-2">${(product.salePrice * product.quantity).toFixed(2)}</td>
                              <td className="p-2">${(product.buyPrice * product.quantity).toFixed(2)}</td>
                              <td className="p-2">${((product.salePrice - product.buyPrice) * product.quantity).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <h3 className="font-bold mt-4 text-lg text-right mr-2">
                    Total: ${calcularTotal(venta.products || []).toFixed(2)}
                  </h3>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Ventas;
