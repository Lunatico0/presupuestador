import React, { useMemo, useState, useRef, useEffect } from "react";
import { useSales } from "../../context/salesContext.jsx";
import { useProducts } from "../../context/productContext.jsx";
import SuggestionsList from "./SuggestionsList.jsx";

const Search = ({ search, setSearch, type }) => {
  const { sales } = useSales();
  const { products } = useProducts();
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

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

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const normalizeText = (text) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setIsSuggestionsVisible(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        Math.min(predictions.length - 1, prevIndex + 1)
      );
    } else if (event.key === "ArrowUp") {
      setSelectedIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else if (event.key === "Enter") {
      if (selectedIndex >= 0 && predictions[selectedIndex]) {
        handleSelect(predictions[selectedIndex]);
      }
    } else if (event.key === "Escape") {
      setIsSuggestionsVisible(false);
    }
  };

  const predictions = useMemo(() => {
    const normalizedSearch = normalizeText(search);
    if (!normalizedSearch) {
      return [];
    }
    const searchTerms = normalizedSearch.split(" ").filter(Boolean);

    if (type === "sales") {
      return sales.filter((sale) => {
        const normalizedClient = normalizeText(
          `${sale.client?.name || ""} ${sale.client?.lastName || ""}`
        );
        return searchTerms.every((term) => normalizedClient.includes(term));
      });
    } else if (type === "products") {
      return products.filter((product) => {
        const normalizedProductName = normalizeText(product.name || product.title || "");
        return searchTerms.every((term) => normalizedProductName.includes(term));
      });
    }

    return [];
  }, [sales, products, search, type]);

  const handleSelect = (prediction) => {
    const displayValue =
      type === "sales"
        ? `${prediction.client?.name || ""} ${prediction.client?.lastName || ""}`
        : prediction.name || prediction.title || "";
    setSearch(displayValue);
    setIsSuggestionsVisible(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        placeholder={
          type === "sales" ? "Buscar ventas..." : "Buscar productos..."
        }
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
            getDisplayValue={(prediction) =>
              type === "sales"
                ? `${prediction.client?.name || "Nombre desconocido"} ${
                    prediction.client?.lastName || ""
                  }`
                : prediction.name || prediction.title || "Sin título"
            }
          />
        </div>
      )}
    </div>
  );
};

export default Search;
