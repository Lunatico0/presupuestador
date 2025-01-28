import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/cartContext.jsx';
import { useProducts } from '../../context/productContext.jsx';
import { convertPricesToPesos } from './CurrencyExchange.js';
import { checkForUpdates, applyUpdate } from './update';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyExchange from '@mui/icons-material/CurrencyExchange';
import UpdateIcon from '@mui/icons-material/Update';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const sidebarRef = useRef(null);
  const { isPesos, setIsPesos, dollarRate, setDollarRate } = useProducts();
  const [hasUpdate, setHasUpdate] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const response = await fetch("https://dolarapi.com/v1/dolares");
        const data = await response.json();
        const oficial = data.find((dolar) => dolar.casa === "oficial");
        setDollarRate({ sell: parseFloat(oficial.venta) });
      } catch (error) {
        console.error("Error al obtener la tasa de cambio:", error);
      }
    };
    fetchDollarRate();
  }, [setDollarRate]);

  const handleCurrencyExchange = () => {
    setIsPesos((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const totalProducts = Object.keys(cart).length;

  return (
    <div>
      <div className="print:hidden relative">
        <button
          onClick={toggleSidebar}
          className="print:hidden fixed top-4 left-4 z-50 dark:text-logo text-menu dark:bg-dark bg-gris/50 p-2 rounded-full shadow-lg focus:outline-none hover:bg-secondary transition w-12 h-12"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        {totalProducts > 0 && (
          <span className="print:hidden fixed top-4 left-14 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center z-50 md:hidden">
            {totalProducts}
          </span>
        )}
      </div>

      <nav
        ref={sidebarRef}
        className={`print:hidden md:block fixed top-0 left-0 h-full dark:bg-dark bg-gray-300 dark:text-textLight text-textDark transition-all duration-300 z-40 ${isOpen ? 'w-64 block' : 'w-20 hidden'} shadow-lg`}
      >
        <ul className="flex flex-col gap-4 p-4 mt-16">
          <li>
            <Link
              to="/"
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}
            >
              <HomeIcon />
              {isOpen && <span className="text-lg">Inicio</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}
            >
              <InventoryIcon />
              {isOpen && <span className="text-lg">Productos</span>}
            </Link>
          </li>
          <li className="relative">
            <Link
              to="/presupuesto"
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}
            >
              <ShoppingCartIcon />
              {isOpen && <span className="text-lg">Presupuestos</span>}
              {totalProducts > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {totalProducts}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link
              to="/ventas"
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}
            >
              <AttachMoneyIcon />
              {isOpen && <span className="text-lg">Ventas</span>}
            </Link>
          </li>
          <li>
            <button
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary
                ${isOpen ? '' : 'justify-center'}
                transform transition-transform duration-300
                ${isPesos ? 'animate-flipY' : ''}`}
              onClick={handleCurrencyExchange}
            >
              <CurrencyExchange />
              {isOpen && <span className="text-lg whitespace-nowrap">Cambiar a {isPesos ? "Dólares" : "Pesos"}</span>}
            </button>
          </li>
          <li className='relative'>
            <button
              className={`flex items-center gap-3 p-3 rounded hover:bg-secondary transition-all duration-300 ${isOpen ? '' : 'justify-center'}`}
              onClick={applyUpdate}
            >
              {hasUpdate ? <CloudDownloadIcon /> : <UpdateIcon />}
              {hasUpdate && <span className="absolute top-3 right-2 w-2 h-2 bg-red-500 rounded-full" />}
              {isOpen && <span className="text-lg">Actualizar</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
