import React, { useState, useMemo } from "react";
import { useProducts } from "../../context/productContext.jsx";
import ProductsList from "../utils/ProductList.jsx";
import Search from "../utils/Search.jsx";
import { filterItems } from "../utils/filteredItems.js";

const SearchableProducts = () => {
  const { products, loading, error } = useProducts();
  const [search, setSearch] = useState("");

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
      <Search search={search} setSearch={setSearch} type="products" />
      <ProductsList products={filteredProducts} />
    </div>
  );
};

export default SearchableProducts;
