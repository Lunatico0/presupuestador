import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext.jsx';
import { useProducts } from '../context/productContext.jsx';

const Presupuesto = () => {
  const { cart, setCart } = useCart();
  const { productDetails, fetchProductById } = useProducts();

  const [ganancia, setGanancia] = useState(() => {
    const initialGanancia = {};
    Object.keys(cart).forEach((id) => {
      initialGanancia[id] = 30;
    });
    return initialGanancia;
  });

  useEffect(() => {
    const updatedGanancia = { ...ganancia };
    Object.keys(cart).forEach((id) => {
      if (!(id in ganancia)) {
        updatedGanancia[id] = 30;
      }
    });
    setGanancia(updatedGanancia);
  }, [cart]);

  useEffect(() => {
    const fetchDetails = async () => {
      for (let id of Object.keys(cart)) {
        await fetchProductById(id);
      }
    };
    if (Object.keys(cart).length > 0) {
      fetchDetails();
    }
  }, [cart, fetchProductById]);

  const handleCantidadChange = (id, value) => {
    const cantidad = parseInt(value, 10);
    setCart((prevCart) => ({
      ...prevCart,
      [id]: isNaN(cantidad) || cantidad < 1 ? "" : cantidad,
    }));
  };

  const handleGananciaChange = (id, value) => {
    if (value === "") {
      setGanancia((prevGanancia) => ({
        ...prevGanancia,
        [id]: "",
      }));
      return;
    }

    const porcentaje = parseInt(value, 10);
    setGanancia((prevGanancia) => ({
      ...prevGanancia,
      [id]: isNaN(porcentaje) || porcentaje < 0 ? "" : porcentaje,
    }));
  };

  const handleBlur = (id) => {
    if (!cart[id]) {
      setCart((prevCart) => ({
        ...prevCart,
        [id]: 1,
      }));
    }
  };

  const handleRemoveProduct = (id) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  return (
    <div>
      {
        Object.keys(cart).length <= 0 ? (
          <p>No hay productos en el carrito</p>
        ) : <>
          <h2 className="text-xl font-bold mb-4 text-center">Presupuesto</h2>
          <div className="grid gap-4">
            {Object.keys(cart).map((id) => (
              <div
                key={id}
                className="rounded-lg shadow p-4 bg-secondary/40 flex flex-col lg:flex-row lg:items-center lg:gap-6"
              >
                <img
                  src={productDetails[id]?.product.thumbnails[0]}
                  alt={productDetails[id]?.product.title}
                  className="w-full h-40 object-cover rounded-lg lg:w-36 lg:h-36"
                />

                <div className="flex flex-col gap-2 lg:flex-1">
                  <h2 className="text-lg font-semibold text-center lg:text-left">
                    {productDetails[id]?.product.title}
                  </h2>
                  <p className="line-clamp-2 text-sm text-gray-400 text-center lg:text-left">
                    {
                      productDetails[id]?.product.description.filter((desc) =>
                        desc.label === 'MEDIDAS' ||
                        desc.label === 'COMPOSICIÓN' ||
                        desc.label === 'CANT. DE PIEZAS POR CAJA'||
                        desc.label === 'PRESENTACIÓN'
                      ).map((desc) => (
                        <span key={desc.label}>
                          {desc.label}: {desc.value} <br />
                        </span>
                      ))
                    }
                  </p>
                  <p className="text-md font-medium text-center lg:text-left">
                    Precio: ${productDetails[id]?.product.price.toFixed(2)}
                  </p>
                  <p className="text-md font-medium text-center lg:text-left">
                    Subtotal: ${(cart[id] * productDetails[id]?.product.price).toFixed(2)}
                  </p>
                  {/* Muestra el precio con ganancia si está configurado */}
                  {ganancia[id] !== undefined && (
                    <p className="text-md font-medium text-center lg:text-left">
                      Precio con ganancia: $
                      {(
                        (cart[id] * productDetails[id]?.product.price) *
                        (1 + ganancia[id] / 100)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-2 lg:gap-4 lg:flex-row lg:justify-end">
                  <label htmlFor="cantidad" className='self-center'>Cant:</label>
                  <input
                    style={{
                      MozAppearance: "textfield"
                    }}
                    type="number"
                    className="w-full lg:w-20 h-10 px-2 border border-gray-300 rounded focus:outline-none"
                    min={1}
                    value={cart[id] || ""}
                    onChange={(e) => handleCantidadChange(id, e.target.value)}
                    onBlur={() => handleBlur(id)}
                  />
                  <label htmlFor={`ganancia-${id}`} className="self-center">Ganancia:</label>
                  <input
                    type="number"
                    className="w-full lg:w-20 h-10 px-2 border border-gray-300 rounded focus:outline-none"
                    id={`ganancia-${id}`}
                    min={0}
                    max={100}
                    value={ganancia[id] === undefined ? "" : ganancia[id]}
                    onChange={(e) => handleGananciaChange(id, e.target.value)}
                  />
                  <label htmlFor={`ganancia-${id + 1}`} className="self-center"> %</label>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleRemoveProduct(id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      }
    </div>
  );

};

export default Presupuesto;
