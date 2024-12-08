import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/cartContext.jsx';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InventoryIcon from '@mui/icons-material/Inventory';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

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
      {/* Botón del menú hamburguesa con indicador */}
      <div className="print:hidden relative">
        <button
          onClick={toggleSidebar}
          className="print:hidden fixed top-4 left-4 z-50 text-logo bg-dark p-2 rounded-full shadow-lg focus:outline-none hover:bg-secondary transition w-12 h-12"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
        {totalProducts > 0 && (
          <span className="print:hidden fixed top-4 left-14 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center z-50 md:hidden">
            {totalProducts}
          </span>
        )}
      </div>

      {/* Sidebar */}
      <nav
        ref={sidebarRef}
        className={`print:hidden md:block fixed top-0 left-0 h-full bg-dark text-light transition-all duration-300 z-40 ${isOpen ? 'w-64 block' : 'w-20 hidden'} shadow-lg`}
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
            {/* Enlace del carrito con indicador */}
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
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
