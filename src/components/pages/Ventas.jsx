import React, { useState, useEffect, useMemo } from "react";
import { useSales } from "../../context/salesContext.jsx";
import { useClients } from "../../context/clientContext.jsx";
import { useProducts } from "../../context/productContext.jsx";
import SalesSearch from "../utils/salesSearch.jsx";

const Ventas = () => {
  let acumulado = 0;
  const [setSelectedClient] = useState(null);
  const [sortOption, setSortOption] = useState("fecha");
  const [filteredSales, setFilteredSales] = useState([]);
  const { products, loading: productsLoading } = useProducts();
  const { sales, isLoaded, fetchSales, loading: salesLoading } = useSales();
  const { clients, fetchClients, clientDetails, loading: clientsLoading, findClientById } = useClients();

  useEffect(() => {
    if (!isLoaded) fetchSales();
  }, [isLoaded, fetchSales]);

  useEffect(() => {
    if (clients.length === 0) fetchClients();
  }, [clients, fetchClients]);

  useEffect(() => {
    const fetchMissingClients = async () => {
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

  const calcularTotal = (productos = []) =>
    productos.reduce(
      (acc, prod) => acc + (prod.salePrice - prod.buyPrice) * prod.quantity,
      0
    );

  const sumatoriaVentas = useMemo(() => sales.reduce((acc, venta) => acc + calcularTotal(venta.products), 0), [sales]);

  const obtenerTituloProducto = (id) => {
    const producto = products.find((p) => p._id === id);
    return producto ? producto.title : null;
  };

  const handleSortChange = (e) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
  };

  useEffect(() => {
    let sortedSales = [...sales];

    if (sortOption === "fecha") {
      sortedSales.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortOption === "ganancia") {
      sortedSales.sort((a, b) => calcularTotal(b.products) - calcularTotal(a.products));
    } else if (sortOption === "cliente") {
      sortedSales.sort((a, b) => {
        const clientA = clientDetails[a.client._id]?.name || "";
        const clientB = clientDetails[b.client._id]?.name || "";
        return clientA.localeCompare(clientB);
      });
    }

    setFilteredSales(sortedSales);
  }, [sortOption, sales, clientDetails]);

  const handleSelectClient = (client) => setSelectedClient(client);

  if (isDataLoading) return <div>Cargando ventas y productos...</div>;
  if (sales.length === 0) return <div>No hay ventas realizadas.</div>;

  return (
    <div className="w-full px-2">
      <div className="max-w-full md:max-w-4xl mx-auto">
        <div className="flex flex-col justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center">Ventas</h1>
          <SalesSearch
            sales={sales}
            clients={clients}
            products={products}
            onFilter={setFilteredSales}
            sortValue={sortOption}
            sortOnChange={handleSortChange}
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-300 text-right">Total ventas: ${sumatoriaVentas.toFixed(2)}</h2>
        </div>
        <div className="overflow-auto max-h-[70dvh] w-full dark:bg-gray-800 bg-gray-300 rounded-lg p-1 pt-2 md:p-2 shadow-md">
          {filteredSales.map((venta) => {
            const clientData = clientDetails[venta.client._id] || {};
            const address = clientData.address || {};
            const totalVenta = calcularTotal(venta.products || []);
            acumulado += totalVenta;
            return (
              <details key={venta._id} className="dark:bg-gray-700/90 bg-gray-200 border dark:border-gray-600 border-gray-300 rounded-lg p-1 py-2 mb-1">
                <summary className="cursor-pointer grid md:grid-cols-[1fr_3fr_1fr] grid-cols-[1fr_3fr_1fr] justify-between md:justify-center items-center">
                  <span className="font-semibold border-r border-gray-500 pr-1 md:border-none">{new Date(venta.date).toLocaleDateString()}</span>
                  <div className="pl-1 text-sm md:text-left text-center mt-2 md:mt-0">
                    <p className="text-base text-left line-clamp-1"><strong>Cliente:</strong> {clientData.name ? `${clientData.name} ${clientData.lastName}` : "No disponible."}</p>
                    <p className="text-base text-left line-clamp-1"><strong>Dirección:</strong> {address.street ? `${address.street} ${address.number}` : "No disponible."}</p>
                  </div>
                  <span className="font-bold text-lg dark:text-primary text-secondary text-right text-wrap md:text-nowrap">
                    Total: ${acumulado.toFixed(2)}
                  </span>
                </summary>

                <div className="flex flex-col items-center justify-center mt-4">
                  <div className="dark:bg-gray-600 bg-gray-400 p-4 rounded-lg w-full max-w-4xl">
                    <p className="text-base"><strong>Email:</strong> {clientData.email ? `${clientData.email}` : "No disponible."}</p>
                    <p className="text-base"><strong>Tel.:</strong> {clientData.phone ? <a href={`tel:${clientData.phone}`}>{clientData.phone}</a> : 'No disponible.'}</p>
                    <p className="text-base"><strong>Dirección:</strong> {address.street ? `${address.street} ${address.number}` : "No disponible."}</p>
                  </div>

                  <div className="mt-4 overflow-auto w-full max-w-4xl">
                    <table className="w-full border-collapse text-sm">
                      <thead className="dark:bg-gray-600 bg-gray-400">
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
                              <td className="py-1 line-clamp-2">{titulo || "Cargando..."}</td>
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
