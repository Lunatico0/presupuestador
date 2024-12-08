import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dolar from '../utils/Dolar.jsx';

const HomePage = () => {
  return (
    <div className="dark:bg-gris bg-light min-h-screen p-4 px-6">
      <Dolar />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Tarjeta 1 PRODUCTOS */}
        <Link to="/products">
          <div className="p-6 bg-secondary text-light rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Productos</h3>
            <p>Administra los productos disponibles para presupuestos.</p>
          </div>
        </Link>

        {/* Tarjeta 2 PRESUPUESTO */}
        <Link to="/presupuesto">
          <div className="p-6 bg-secondary text-light rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Presupuestos</h3>
            <p>Gestiona y crea nuevos presupuestos para tus clientes.</p>
          </div>
        </Link>

        {/* Tarjeta 3 VENTAS */}
        <Link to="/ventas">
          <div className="p-6 bg-secondary text-light rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
            <h3 className="text-xl font-bold mb-2">Caja</h3>
            <p>Consulta el historial de ventas y el libro de caja.</p>
          </div>
        </Link>

      </section>
    </div>
  );
};

export default HomePage;
