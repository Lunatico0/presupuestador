import React, { useState, useEffect } from "react";

const SalesSearch = ({ sales, clients, products, onFilter }) => {
  const [filters, setFilters] = useState({
    client: "",
    product: "",
    date: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const { client, product, date } = filters;
    const lowerCaseClient = client.toLowerCase();
    const lowerCaseProduct = product.toLowerCase();

    const filtered = sales.filter((sale) => {
      const clientData = clients.find((c) => c._id === sale.client._id) || {};
      const clientMatch =
        clientData.name?.toLowerCase().includes(lowerCaseClient) ||
        clientData.lastName?.toLowerCase().includes(lowerCaseClient) ||
        clientData.dni?.toString().includes(client) ||
        clientData.email?.toLowerCase().includes(lowerCaseClient);

      const productMatch = sale.products.some((p) => {
        const productData = products.find((prod) => prod._id === p.productId) || {};
        return productData.title?.toLowerCase().includes(lowerCaseProduct);
      });

      const dateMatch = date ? sale.date.includes(date) : true;

      return clientMatch && productMatch && dateMatch;
    });

    onFilter(filtered);
  }, [filters, sales, clients, products, onFilter]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl px-4 py-3">Filtros</h2>
        <form className="bg-gray-800 rounded-lg px-4 py-3 shadow-md space-y-4 md:space-y-0 md:flex md:justify-between md:items-center">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              name="client"
              placeholder=" "
              value={filters.client}
              onChange={handleFilterChange}
              className="block w-full border border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none bg-gray-700 text-white"
            />
            <label
              className="absolute left-4 top-0 text-gray-400 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
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
              className="block w-full border border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none bg-gray-700 text-white"
            />
            <label
              className="absolute left-4 top-0 text-gray-400 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              Producto
            </label>
          </div>
          <div className="relative w-full md:w-1/3 mt-4 md:mt-0">
            <input
              type="date"
              name="date"
              placeholder=" "
              value={filters.date}
              onChange={handleFilterChange}
              className="block w-full border border-gray-300 rounded px-4 pt-4 pb-2 focus:border-blue-500 focus:outline-none bg-gray-700 text-white"
            />
            <label
              className="absolute left-4 top-0 text-gray-400 text-sm transition-all transform -translate-y-1/2 px-1 rounded-full pr-2"
              style={{ backdropFilter: 'blur(3px)' }}
            >
              Fecha
            </label>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesSearch;
