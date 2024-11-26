import './App.css'
import React from 'react';
import { ProductsProvider } from './context/productConext.jsx';
import SearchableProducts from './components/SearchableProducts.jsx';

function App() {

  return (
    <ProductsProvider>
      <div>
        <h1 className='text-3xl md:text-6xl font-bold pb-4'>Todos los productos</h1>
        <SearchableProducts />
      </div>
    </ProductsProvider>
  );
}

export default App
