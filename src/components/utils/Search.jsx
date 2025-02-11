import React, { useMemo, useState, useRef, useEffect } from "react";
import { useSales } from "../../context/salesContext.jsx";
import { useProducts } from "../../context/productContext.jsx";
import { useClients } from "../../context/clientContext.jsx";
import SuggestionsList from "./SuggestionsList.jsx";
import { normalizeText } from "./normalizeText.js";

const Search = ({ search, setSearch, type, customData, onSelect, searchFields, onNewClient }) => {
  const contexts = { sales: useSales, clients: useClients, products: useProducts };
  const { sales, clients, products } = {
    sales: contexts.sales()?.sales || [],
    clients: contexts.clients()?.clients || [],
    products: contexts.products()?.products || [],
  };

  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  const typeSettings = {
    sales: {
      placeholder: "Buscar ventas...",
      display: (item) => `${item.client?.name || ""} ${item.client?.lastName || ""}`,
    },
    products: {
      placeholder: "Buscar productos...",
      display: (item) => item.name || item.title || "",
    },
    clients: {
      placeholder: "Buscar clientes...",
      display: (item) => `${item.name || ""} ${item.lastName || ""} (${item.dni || "DNI no disponible"})`,
    },
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsSuggestionsVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const data = useMemo(() => customData || (type === "sales" ? sales : type === "products" ? products : clients), [customData, type, sales, products, clients]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setIsSuggestionsVisible(true);
    setSelectedIndex(-1);
  };

  const predictions = useMemo(() => {
    const normalizedSearch = normalizeText(search || "");
    if (!normalizedSearch) return [];
    const searchTerms = normalizedSearch.split(" ").filter(Boolean);

    return data.filter((item) =>
      searchFields.some((field) => searchTerms.every((term) => normalizeText(item[field] || "").includes(term)))
    );
  }, [data, search, searchFields]);

  const handleSelect = (prediction) => {
    setSearch(typeSettings[type]?.display(prediction) || "");
    onSelect?.(prediction);
    setIsSuggestionsVisible(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) => Math.min(predictions.length - 1, prevIndex + 1));
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (event.key === "Enter" && selectedIndex >= 0) {
      handleSelect(predictions[selectedIndex]);
    } else if (event.key === "Escape") {
      setIsSuggestionsVisible(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-2/3">
      <input
        type="text"
        placeholder={typeSettings[type]?.placeholder || ""}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        value={search}
        className="block w-full p-2 mb-2 border border-gray-300 rounded-md"
      />
      {isSuggestionsVisible && search && (
        <div ref={suggestionsRef}>
          <SuggestionsList
            predictions={predictions}
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            onSelect={handleSelect}
            getDisplayValue={typeSettings[type]?.display}
            onNewClient={onNewClient}
            type={type}
          />
        </div>
      )}
    </div>
  );
};

export default Search;
