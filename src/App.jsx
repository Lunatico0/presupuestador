import './App.css'
import './index.css'
import React from 'react';
import { ProductsProvider } from './context/productContext.jsx';
import { SalesProvider } from './context/salesContext.jsx';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CartProvider } from './context/cartContext.jsx';
import SearchableProducts from './components/pages/SearchableProducts.jsx';
import Presupuesto from './components/pages/presupuesto.jsx';
import ProductForm from './components/pages/ProductForm.jsx';
import Ventas from './components/pages/Ventas.jsx';
import HomePage from './components/pages/Home.jsx';
import Sidebar from './components/utils/SideBar.jsx';

function App() {

  return (
    <CartProvider>
      <ProductsProvider>
        <SalesProvider>
          <Router>
            <div className='flex print:w-full print:h-auto max-w-7xl mx-auto w-full'>
              <Sidebar />
              <div className="flex-1 flex flex-col justify-center sm:px-16 md:px-24 md:pt-8 ml-0 md:ml-20">
                <header className="mb-8 print:hidden">
                  <Link to="/">
                    <h1 className="text-5xl font-titleFont text-logo text-center mt-3 md:mt-0">Artemisa</h1>
                    <p className="text-center mt-3 md:mt-0">¡Organiza tus presupuestos y ventas fácilmente!</p>
                  </Link>
                </header>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<SearchableProducts />} />
                  <Route path="/presupuesto" element={<Presupuesto />} />
                  <Route path="/ventas" element={<Ventas />} />
                  <Route path="/edit-product/:id" element={<ProductForm />} />
                  <Route path="/add-product" element={<ProductForm />} />
                </Routes>
              </div>
            </div>
          </Router>
        </SalesProvider>
      </ProductsProvider>
    </CartProvider>
  );
}

export default App
