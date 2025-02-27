import emailjs from '@emailjs/browser';
import Swal from "sweetalert2";
import { useEffect, useState } from 'react';
import { useCart } from '../../context/cartContext.jsx';
import { useProducts } from '../../context/productContext.jsx';
import { useSales } from "../../context/salesContext.jsx";
import { useClients } from '../../context/clientContext.jsx';
import BudgetHeader from './presupuesto/BudgetHeader.jsx';
import ModalBox from './presupuesto/ModalBox.jsx';
import InputField from './presupuesto/InputField.jsx';

const Presupuesto = () => {
  const { fetchSales } = useSales();
  const { isPesos, dollarRate } = useProducts();
  const { cart, setCart } = useCart();
  const { clients, fetchClients, addClient, clientDetails, findClientById } = useClients();
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

  const transformedPrice = (productPrice) => {
    if (isPesos) {
      return (productPrice * dollarRate.sell).toFixed(2);
    } else {
      return productPrice;
    }
  }

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
      await addClient(newClient);

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

  const handleSelectClient = async (client) => {
    setSelectedClient(client);
    if (!clientDetails[client._id]) {
      await findClientById(client._id);
    }
  };

  useEffect(() => {
    setGanancia((prevGanancia) => {
      const updatedGanancia = { ...prevGanancia };
      Object.keys(cart).forEach((id) => {
        if (!(id in prevGanancia)) {
          updatedGanancia[id] = 30;
        }
      });
      return updatedGanancia;
    });
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
      return Object.keys(newCart).length ? newCart : {};
    });
  };

  const handlePrint = () => {
    if (!selectedClient) {
      setIsClientModalOpen(true);
      return;
    }
    window.print();
  };

  const handleMail = () => {
    if (!selectedClient) {
      setIsClientModalOpen(true);
      return;
    }

    const printableElement = document.getElementById("printable-content");
    if (!printableElement) {
      alert("No hay contenido para enviar.");
      return;
    }

    const printableContent = printableElement.innerHTML;
    const templateParams = {
      subject: "Presupuesto Artemisa",
      to_email: "cliente@correo.com",
      content: printableContent,
    };

    emailjs
      .send("SERVICE_ID", "TEMPLATE_ID", templateParams, "USER_ID")
      .then((response) => {
        console.log("Email enviado con éxito:", response.status, response.text);
        Swal.fire("Éxito", "El correo se ha enviado exitosamente.", "success");
      })
      .catch((err) => {
        console.error("Error al enviar el correo:", err);
        Swal.fire("Error", "Hubo un problema al enviar el correo.", "error");
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
      Swal.fire({
        title: "¡Atención!",
        text: "Por favor, selecciona un cliente antes de registrar la venta.",
        icon: "warning",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      const products = Object.keys(cart).map((id) => ({
        productId: id,
        quantity: cart[id],
        salePrice: productDetails[id]?.product.price * (1 + ganancia[id] / 100),
        buyPrice: productDetails[id]?.product.price,
      }));

      const newSale = {
        client: selectedClient._id,
        products,
        date: new Date().toISOString(),
      };


      const result = await fetchSales(newSale);

      if (result) {
        Swal.fire({
          title: "¡Éxito!",
          text: "¡Venta registrada con éxito!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });

        setCart({});
        setSelectedClient(null);
        setIsClientModalOpen(false);
      }
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al registrar la venta. Inténtalo nuevamente.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  useEffect(() => {
    if (clients.length === 0) {
      fetchClients();
    }
  }, [clients, fetchClients]);

  const calculateTotal = () => calculateSubtotalWithoutIVA();

  return (
    <div className='w-full px-6'>

      <ModalBox
        modalState={{ isClientModalOpen, setIsClientModalOpen, isNewClientFormVisible, setIsNewClientFormVisible }}
        clientData={{ newClient, clients }}
        actions={{ handleInputChange, handleSaveClient, handleSelectClient, handleNewClient, handleSell }}
      />

      {
        Object.keys(cart).length <= 0 ? (
          <p>No hay productos en el carrito</p>
        ) : <div id="printable-content">
          <header className='flex flex-row justify-between items-center my-2'>
            <h2 className="text-xl font-bold print:hidden">Presupuesto Artemisa</h2>
            <button
              className="print:hidden px-4 py-2 rounded bg-acento/60"
              onClick={() => setIsClientModalOpen(true)}
            >
              Asignar Cliente
            </button>
          </header>

          <BudgetHeader selectedClient={selectedClient} />
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
                  <p className="line-clamp-2 print:line-clamp-4 text-sm dark:text-gray-400 text-gray-700 text-left">
                    {
                      productDetails[id]?.product.description.filter((desc) =>
                        desc.label === 'MEDIDAS' ||
                        desc.label === 'COMPOSICIÓN' ||
                        desc.label === 'CANT. DE PIEZAS POR CAJA' ||
                        desc.label === 'PRESENTACIÓN'
                      ).map((desc) => (
                        <span key={desc._id}>
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
                    Precio: ${(transformedPrice(productDetails[id]?.product.price) * (1 + ganancia[id] / 100)).toFixed(2)} <span className='print:hidden pl-1'>(Con ganancia incluida)</span>
                  </p>
                  <p className="text-md font-medium text-left print:hidden">
                    Subtotal: ${(transformedPrice(cart[id] * productDetails[id]?.product.price) * (1 + ganancia[id] / 100)).toFixed(2)} <span className='print:hidden pl-1'>(Con ganancia incluida)</span>
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 md:items-end md:justify-end">
                  <div className="flex flex-row md:flex-col gap-2">
                    <div className="flex flex-row pr-2 md:p-0 md:gap-4 justify-between print:hidden">
                      <InputField label="Cant" id={`cantidad-${id}`} value={cart[id] || ""} onChange={(e) => handleCantidadChange(id, e.target.value)} />

                    </div>
                    <div className="flex flex-row pr-2 md:p-0 md:gap-4 justify-between print:hidden">
                      <div className="relative w-full md:w-20 z-0">
                        <InputField label="Ganancia" id={`ganancia-${id}`} value={ganancia[id] || ""} onChange={(e) => handleGananciaChange(id, e.target.value)} min={0} max={100} />
                        <span className="absolute right-5 md:-right-12 top-1/2 transform -translate-y-1/2 text-gray-500 z-0">%</span>
                      </div>
                    </div>
                    <p className="text-md font-medium text-left hidden print:block print:ml-auto text-nowrap">
                      Subtotal: ${(transformedPrice(cart[id] * productDetails[id]?.product.price) * (1 + ganancia[id] / 100)).toFixed(2)}
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
              <div className='flex flex-row justify-between'><p>Subtotal: </p><span>${transformedPrice(calculateSubtotalWithoutIVA().toFixed(2))}</span></div>
              <div className='flex flex-row justify-between'><p className="font-bold">Total: </p><span>${transformedPrice(calculateTotal().toFixed(2))}</span></div>
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
