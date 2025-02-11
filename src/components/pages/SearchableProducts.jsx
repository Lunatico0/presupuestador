import React, { useState, useMemo } from "react";
import { useProducts } from "../../context/productContext.jsx";
import ProductsList from "../utils/ProductList.jsx";
import Search from "../utils/Search.jsx";
import { filterItems } from "../utils/filteredItems.js";
import { useNavigate } from "react-router-dom";

const SearchableProducts = () => {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleNew = () => {
    navigate("/add-product");
  }

  const filteredProducts = useMemo(
    () =>
      filterItems(
        products,
        search,
        (product) => product.title
      ),
    [products, search]
  );

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="relative group px-6">
      <div className="flex justify-between w-full flex-row-reverse items-center">
        <button onClick={handleNew}
          className="px-2 py-1 my-auto border bg-slate-500 rounded">
          Agregar nuevo
        </button>
        <Search
          search={search}
          setSearch={setSearch}
          type="products"
          customData={products}
          searchFields={["description", "title", "categoriaNombre", "subcategoriaNombre"]}
        />
      </div>
      <ProductsList products={filteredProducts} />
    </div>
  );
};

export default SearchableProducts;
