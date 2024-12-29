import React, { useState, useEffect } from "react";

const SalesSearch = ({ sales, clients, products, onFilter }) => {
  const [filters, setFilters] = useState({
    client: "",
    product: "",
    startDate: "",
    endDate: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { client, product, startDate, endDate } = filters;
    const lowerCaseClient = client.toLowerCase();
    const lowerCaseProduct = product.toLowerCase();

    const filtered = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      const clientData = clients.find((c) => c._id === sale.client._id) || {};

      // Comparar cliente
      const clientMatch =
        clientData.name?.toLowerCase().includes(lowerCaseClient) ||
        clientData.lastName?.toLowerCase().includes(lowerCaseClient) ||
        clientData.dni?.toString().includes(client) ||
        clientData.email?.toLowerCase().includes(lowerCaseClient);

      // Comparar producto
      const productMatch = sale.products.some((p) => {
        const productData = products.find((prod) => prod._id === p.productId) || {};
        return productData.title?.toLowerCase().includes(lowerCaseProduct);
      });

      // Comparar fechas
      const startDateMatch = startDate ? saleDate >= new Date(startDate) : true;
      const endDateMatch = endDate ? saleDate <= new Date(endDate) : true;

      return clientMatch && productMatch && startDateMatch && endDateMatch;
    });

    onFilter(filtered);
  }, [filters, sales, clients, products, onFilter]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="dark:bg-gray-800 bg-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl px-4 py-3">Filtros</h2>
        <form className="dark:bg-gray-800 bg-gray-300 rounded-lg px-4 py-3 shadow-md space-y-4 md:space-y-0 md:flex md:justify-between md:items-center gap-1">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              name="client"
              placeholder=" "
              value={filters.client}
              onChange={handleFilterChange}
              className="block w-full border dark:border-gray-600 border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 bg-gray-200"
            />
            <label
              className="absolute left-4 top-0 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{
                backdropFilter: 'blur(3px)',
              }}
            >
              Cliente
            </label>
          </div>
          <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
            <input
              type="text"
              name="product"
              placeholder=" "
              value={filters.product}
              onChange={handleFilterChange}
              className="block w-full border dark:border-gray-600 border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 bg-gray-200"
            />
            <label
              className="absolute left-4 top-0 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              Producto
            </label>
          </div>
          <div className="relative w-full md:w-1/4 mt-4 md:mt-0">
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="block w-full border dark:border-gray-600 border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 bg-gray-200"
            />
            <label
              className="absolute left-4 top-0 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              Desde
            </label>
          </div>
          <div className="relative w-full md:w-1/4 mt-4 md:mt-0">
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="block w-full border dark:border-gray-600 border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none dark:bg-gray-700 bg-gray-200"
            />
            <label
              className="absolute left-4 top-0 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              Hasta
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesSearch;
