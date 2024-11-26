import React, { useState, useMemo, useEffect } from 'react';
import { useProducts } from '../context/productContext.jsx';
import { useCart } from '../context/cartContext.jsx';

const SearchableProducts = () => {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState('');
  const { cart, setCart } = useCart();
  const [quantities, setQuantities] = useState({});
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    if (products.length > 0) {
      const initialQuantities = products.reduce((acc, product) => {
        acc[product._id] = 1; // Inicializar todos los productos con cantidad 1
        return acc;
      }, {});
      setQuantities(initialQuantities);
    }
  }, [products]);

  const normalizeText = (text) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  const filteredProducts = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) return products;

    const searchTerms = normalizedSearch.split(' ').filter(Boolean);
    return products.filter((product) =>
      searchTerms.every((term) =>
        normalizeText(product.title).includes(term)
      )
    );
  }, [products, search]);

  const agregarProducto = (id) => {
    const cantidad = quantities[id] || 1;
    setCart((prevCart) => ({
      ...prevCart,
      [id]: (prevCart[id] || 0) + cantidad,
    }));
  };

  const handleCantidadChange = (id, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: value,
    }));
  };

  const handleCantidadBlur = (id) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [id]: prevQuantities[id] === "" || prevQuantities[id] < 1 ? 1 : prevQuantities[id],
    }));
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setIsSuggestionsVisible(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (product) => {
    setSearch(product.title);
    setIsSuggestionsVisible(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevIndex) => Math.min(predictions.length - 1, prevIndex + 1));
    } else if (event.key === 'ArrowUp') {
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (event.key === 'Enter') {
      if (selectedIndex >= 0) {
        setSearch(predictions[selectedIndex].title);
        setIsSuggestionsVisible(false);
      }
    } else if (event.key === 'Escape') {
      setIsSuggestionsVisible(false);
    }
  };

  const predictions = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    if (!normalizedSearch) {
      return [];
    }

    const searchTerms = normalizedSearch.split(' ').filter(Boolean);

    return products.filter((product) => {
      const normalizedTitle = normalizeText(product.title);
      return searchTerms.every((term) => normalizedTitle.includes(term));
    });
  }, [products, search]);

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative group">
      <input
        type="text"
        placeholder="Buscar productos..."
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        value={search}
        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
      />

      {isSuggestionsVisible && search && (
        <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-10 hidden group-focus-within:block">
          {predictions.slice(0, 5).map((product, index) => (
            <li
              key={product._id}
              className={`p-2 text-textDark cursor-pointer hover:bg-gray-100 ${index === selectedIndex ? 'bg-gray-200' : ''
                }`}
              onClick={() => setSearch(product.title)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {product.title}
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="rounded-lg shadow p-4 bg-secondary/40">
              <img
                src={product.thumbnails?.[0]}
                alt={product.title}
                className="w-full h-64 object-cover rounded-md"
              />
              <div className="relative rounded-xl flex flex-col items-start justify-between p-3 min-h-96">
                <h2 className="text-lg block text-left font-semibold">{product.title}</h2>
                {product.description.map((desc) => (
                  <p key={desc._id} className="line-clamp-2">
                    {desc.label}: {desc.value}
                  </p>
                ))}
                <p className="mt-1 font-bold">${product.price.toFixed(2)}</p>
                <div className="flex flex-row w-full gap-4">
                  <input
                    type="number"
                    className="w-1/3 focus:outline-none"
                    min={1}
                    value={quantities[product._id] || ""}
                    onChange={(e) => handleCantidadChange(product._id, e.target.value)}
                    onBlur={() => handleCantidadBlur(product._id)}
                  />
                  <button
                    className="bg-green-600/80 px-4 py-2 rounded-md justify-self-end w-2/3"
                    onClick={() => agregarProducto(product._id)}
                  >
                    Agregar al presupuesto
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron productos para "{search}"</p>
        )}
      </div>
    </div>
  );
};

export default SearchableProducts;
