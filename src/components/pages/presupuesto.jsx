import emailjs from '@emailjs/browser';
import Search from "../utils/Search.jsx";
import { Modal, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useCart } from '../../context/cartContext.jsx';
import { useProducts } from '../../context/productContext.jsx';
import { useSales } from "../../context/salesContext.jsx";
import { useClients } from '../../context/clientContext.jsx';

const Presupuesto = () => {
  const { fetchSales } = useSales();
  const { cart, setCart } = useCart();
  const [search, setSearch] = useState('');
  const { clients, fetchClients, addClient } = useClients();
  const [ganancia, setGanancia] = useState(() => {
    const initialGanancia = {};
    Object.keys(cart).forEach((id) => {
      initialGanancia[id] = 30;
    });
    return initialGanancia;
  });
  const { productDetails, fetchProductById } = useProducts();
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isNewClientFormVisible, setIsNewClientFormVisible] = useState(false);
  const [newClient, setNewClient] = useState({
    address: {
      street: "",
      number: "",
      city: "",
      province: "",
      zipCode: "",
      country: "",
    },
    name: "",
    lastName: "",
    dni: "",
    email: "",
    phone: "",
  });

  const handleNewClient = () => {
    setIsNewClientFormVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setNewClient((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setNewClient((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSaveClient = async () => {
    try {
      // Llamar a addClient con el nuevo cliente
      await addClient(newClient);

      console.log("Nuevo cliente guardado:", newClient);

      // Cerrar el formulario y reiniciar el estado después de agregar el cliente exitosamente
      setIsNewClientFormVisible(false);
      setNewClient({
        address: {
          street: "",
          number: "",
          city: "",
          province: "",
          zipCode: "",
          country: "",
        },
        name: "",
        lastName: "",
        dni: "",
        email: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error al guardar el cliente:", error);
    }
  };


  const handleSelectClient = (client) => {
    setSelectedClient(client);
  };

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
      const productIds = Object.keys(cart);
      const requests = productIds.map(id => fetchProductById(id));
      await Promise.all(requests);
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

  const handlePrint = () => {
    window.print();
  };

  const handleMail = () => {
    const printableContent = document.getElementById("printable-content").innerHTML;

    const templateParams = {
      subject: "Presupuesto Artemisa",
      to_email: "cliente@correo.com",
      content: printableContent,
    };

    emailjs
      .send("SERVICE_ID", "TEMPLATE_ID", templateParams, "USER_ID")
      .then((response) => {
        console.log("Email enviado con éxito:", response.status, response.text);
        alert("El correo se ha enviado exitosamente.");
      })
      .catch((err) => {
        console.error("Error al enviar el correo:", err);
        alert("Hubo un problema al enviar el correo.");
      });
  };

  const calculateSubtotalWithoutIVA = () => Object.keys(cart).reduce((acc, id) => {
    const price = productDetails[id]?.product.price;
    const cantidad = cart[id];
    const gananciaPorcentaje = ganancia[id] || 0;
    const precioConGanancia = price + (price * gananciaPorcentaje) / 100;
    return acc + cantidad * precioConGanancia;
  }, 0);

  const handleSell = async () => {
    if (!selectedClient) {
      alert("Por favor, selecciona un cliente antes de registrar la venta.");
      return;
    }

    try {
      const products = Object.keys(cart).map((id) => ({
        productId: id,
        quantity: cart[id],
        salePrice: (productDetails[id]?.product.price * (1 + ganancia[id] / 100)),
        buyPrice: productDetails[id]?.product.price,
      }));

      const newSale = {
        client: selectedClient,
        products,
        date: new Date().toISOString(),
      };

      const result = await fetchSales(newSale);

      if (result) {
        alert("¡Venta registrada con éxito!");
        setCart({});
        setSelectedClient(null);
        setIsClientModalOpen(false);
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      alert("Hubo un problema al registrar la venta.");
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const calculateIVA = () => calculateSubtotalWithoutIVA() * 0.21;
  const calculateTotal = () => calculateSubtotalWithoutIVA() + calculateIVA();

  return (
    <div className='w-full px-6'>
      <Modal
        open={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      >
        <Box
          className={`
        dark:bg-gris
        bg-light
        dark:text-light
        text-dark
        shadow-black
        p-4 rounded w-11/12 max-w-xl absolute left-1/2
        transform-cpu -translate-x-1/2 -translate-y-1/2
         ${isNewClientFormVisible ? 'top-2/4' : 'top-1/4'} `}
        >
          {isNewClientFormVisible ? (
            <form className="p-4 space-y-4 flex flex-col justify-center">
              <h3 className="text-gray-500 font-bold  mb-2">Datos personales</h3>
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="name"
                    value={newClient.name}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Nombre
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="lastName"
                    value={newClient.lastName}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Apellido
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <input
                    type="number"
                    name="phone"
                    value={newClient.phone}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Teléfono
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="number"
                    name="dni"
                    value={newClient.dni}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    DNI
                  </label>
                </div>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={newClient.email}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                />
                <label
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                  style={{
                    backdropFilter: 'blur(3px)',
                  }}
                >
                  Email
                </label>
              </div>
              <h3 className="text-gray-500 font-bold mt-6 mb-2">Dirección</h3>
              <div className="flex gap-4">
                <div className="relative w-3/4">
                  <input
                    type="text"
                    name="address.street"
                    value={newClient.address.street}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Calle
                  </label>
                </div>
                <div className="relative w-1/4">
                  <input
                    type="number"
                    name="address.number"
                    value={newClient.address.number}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Número
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="address.city"
                    value={newClient.address.city}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Ciudad
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="address.province"
                    value={newClient.address.province}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    Provincia
                  </label>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative w-1/2">
                  <input
                    type="text"
                    name="address.country"
                    value={newClient.address.country}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    País
                  </label>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="number"
                    name="address.zipCode"
                    value={newClient.address.zipCode}
                    onChange={handleInputChange}
                    className="block w-full border border-gray-300 rounded px-2 pt-4 pb-1 focus:border-blue-500 focus:outline-none"
                  />
                  <label
                    className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2"
                    style={{
                      backdropFilter: 'blur(3px)',
                    }}
                  >
                    C.P.
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={handleSaveClient}
                  className="px-4 py-2 bg-blue-500 rounded text-white"
                >
                  Guardar Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewClientFormVisible(false)}
                  className="px-4 py-2 bg-gray-500 rounded text-white"
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <>
              <Search
                search={search}
                setSearch={setSearch}
                type="clients"
                customData={clients}
                onSelect={handleSelectClient}
                onNewClient={handleNewClient}
                searchFields={["name", "lastName", "dni"]}
              />
              <div className='flex justify-between gap-2'>
                <button
                  className="px-4 py-2 rounded bg-acento/60"
                  onClick={handleSell}
                >
                  Confirmar Venta
                </button>
                <button
                  className="px-4 py-2 rounded bg-acento/60"
                  onClick={handleNewClient}
                >
                  Nuevo cliente
                </button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {
        Object.keys(cart).length <= 0 ? (
          <p>No hay productos en el carrito</p>
        ) : <div id="printable-content">
          <header className='flex flex-row justify-between items-center my-2'>
            <h2 className="text-xl font-bold">Presupuesto Artemisa</h2>
            <button
              className="print:hidden px-4 py-2 rounded bg-acento/60"
              onClick={() => setIsClientModalOpen(true)}
            >
              Vender
            </button>
          </header>


          <div className="grid gap-4">
            {Object.keys(cart).map((id) => (
              <div
                key={id}
                className="rounded-lg shadow p-4 bg-secondary/40 flex flex-col md:flex-row md:items-center md:gap-6 print:flex-row print:items-center print:gap-6 print:rounded-none"
              >
                <img
                  className="w-full h-40 object-cover rounded-lg lg:w-36 lg:h-36 aspect-square md:w-fit print:w-fit"
                  src={productDetails[id]?.product.thumbnails[0]}
                  alt={productDetails[id]?.product.title}
                />

                <div className="flex flex-col gap-2 md:flex-1">
                  <h2 className="text-lg font-semibold text-left">
                    {productDetails[id]?.product.title}
                  </h2>
                  <p className="line-clamp-2 print:line-clamp-4 text-sm text-gray-400 text-left">
                    {
                      productDetails[id]?.product.description.filter((desc) =>
                        desc.label === 'MEDIDAS' ||
                        desc.label === 'COMPOSICIÓN' ||
                        desc.label === 'CANT. DE PIEZAS POR CAJA' ||
                        desc.label === 'PRESENTACIÓN'
                      ).map((desc) => (
                        <span key={desc.label}>
                          {desc.label}: {desc.value} <br />
                        </span>
                      ))
                    }
                  </p>
                  <div className="print:flex w-fit flex-row -mb-4 justify-between hidden">
                    <label htmlFor="cantidad" className="self-center">Cant:</label>
                    <input
                      style={{
                        MozAppearance: "textfield"
                      }}
                      type="number"
                      className="w-20 h-10 px-2 border-none border-gray-300 rounded focus:outline-none"
                      min={1}
                      value={cart[id] || ""}
                      onChange={(e) => handleCantidadChange(id, e.target.value)}
                      onBlur={() => handleBlur(id)}
                    />
                  </div>
                  <p className="text-md font-medium text-left">
                    Precio: ${(productDetails[id]?.product.price * (1 + ganancia[id] / 100)).toFixed(2)} <span className='print:hidden pl-1'>(Con ganancia incluida)</span>
                  </p>
                  <p className="text-md font-medium text-left print:hidden">
                    Subtotal: ${((cart[id] * productDetails[id]?.product.price) * (1 + ganancia[id] / 100)).toFixed(2)} <span className='print:hidden pl-1'>(Con ganancia incluida)</span>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 md:items-end md:justify-end">
                  <div className="flex flex-row md:flex-col gap-2">
                    <div className="flex flex-row pr-2 md:p-0 md:gap-4 justify-between print:hidden">
                      <label htmlFor="cantidad" className="self-center">Cant:</label>
                      <input
                        style={{
                          MozAppearance: "textfield"
                        }}
                        type="number"
                        className="w-16 md:w-20 h-10 px-2 border-none border-gray-300 rounded focus:outline-none"
                        min={1}
                        value={cart[id] || ""}
                        onChange={(e) => handleCantidadChange(id, e.target.value)}
                        onBlur={() => handleBlur(id)}
                      />
                    </div>
                    <div className="flex flex-row pr-2 md:p-0 md:gap-4 justify-between print:hidden">
                      <label htmlFor={`ganancia-${id}`} className="self-center">Ganancia:</label>
                      <div className="relative w-full md:w-20 z-0">
                        <input
                          type="number"
                          className="w-16 md:w-20 h-10 px-2 pr-6 border-none border-gray-300 rounded focus:outline-none"
                          id={`ganancia-${id}`}
                          min={0}
                          max={100}
                          value={ganancia[id] === undefined ? "" : ganancia[id]}
                          onChange={(e) => handleGananciaChange(id, e.target.value)}
                        />
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 z-0">%</span>
                      </div>
                    </div>
                    <p className="text-md font-medium text-left hidden print:block print:ml-auto text-nowrap">
                      Subtotal: ${((cart[id] * productDetails[id]?.product.price) * (1 + ganancia[id] / 100)).toFixed(2)}
                    </p>
                  </div>
                  <button
                    className="bg-red-600 text-textLight px-4 py-2 rounded-md print:hidden"
                    onClick={() => handleRemoveProduct(id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className='flex flex-row-reverse mt-1 md:mt-4 mb-12 gap-4 justify-between'>
            <div className="text-lg font-medium w-full print:w-2/5 md:w-1/3">
              <div className='flex flex-row justify-between'><p>Subtotal: </p><span>${calculateSubtotalWithoutIVA().toFixed(2)}</span></div>
              <div className='flex flex-row justify-between'><p>IVA: </p><span>${calculateIVA().toFixed(2)}</span></div>
              <div className='flex flex-row justify-between'><p className="font-bold">Total: </p><span>${calculateTotal().toFixed(2)}</span></div>
            </div>
            <div className='flex flex-col md:items-center md:flex-row gap-1 md:gap-4 print:hidden'>
              <button
                onClick={handlePrint}
                className="bg-blue-600 px-4 py-2 h-fit text-textLight rounded-md print:hidden text-nowrap"
              >🖨️ Presupuesto
              </button>
              <button
                onClick={handleMail}
                className="bg-blue-600 px-4 py-2 h-fit text-textLight rounded-md print:hidden text-nowrap"
              >📨 Presupuesto
              </button>
            </div>
          </div>
        </div>
      }
    </div >
  );
};

export default Presupuesto;
