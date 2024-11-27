import './App.css'
import './index.css'
import React from 'react';
import { ProductsProvider } from './context/productContext.jsx';
import SearchableProducts from './components/SearchableProducts.jsx';
import Presupuesto from './components/presupuesto.jsx';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CartProvider } from './context/cartContext.jsx';

function App() {

  return (
    <CartProvider>
      <ProductsProvider>
        <Router>
          <div className='flex flex-col justify-center max-w-7xl px-6 md:px-16 lg:px-24 mx-auto w-full'>
            <header className='w-full my-6 flex flex-row justify-between'>
              <Link to="/">
                <h1 className='text-3xl md:text-6xl font-bold pb-4'>Todos los productos</h1>
              </Link>
              <Link to="/presupuesto">
                <button className="px-8 py-4 rounded-lg bg-secondary">Presupuesto</button>
              </Link>
            </header>
            <Routes>
              <Route path="/" element={<SearchableProducts />} />
              <Route path="/presupuesto" element={<Presupuesto />} />
            </Routes>
          </div>
        </Router>
      </ProductsProvider>
    </CartProvider>
  );
}

export default App
