import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../context/productContext";
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';
import Swal from 'sweetalert2';
import ImageLazy from './ImageLazy.jsx'

const ProductCard = ({ product, quantity, onQuantityChange, onAddToCart, onQuantityBlur }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { deleteProduct, isPesos, dollarRate } = useProducts();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const transformedPrice = isPesos
    ? (product.price * dollarRate.sell).toFixed(2)
    : product.price.toFixed(2);

  const [editableQuantity, setEditableQuantity] = useState(quantity || '' || 1);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target) && !buttonRef.current.contains(e.target)) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === '' || /^[0-9]+$/.test(value)) {
      setEditableQuantity(value);
      onQuantityChange(value === '' ? '' : parseInt(value, 10));
    }
  };

  const handleQuantityBlur = () => {
    const validQuantity = editableQuantity === '' || editableQuantity < 1 ? 1 : parseInt(editableQuantity, 10);
    setEditableQuantity(validQuantity);
    onQuantityBlur(validQuantity);
  };

  const handleEdit = () => {
    navigate("/edit-product/" + product._id);
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres eliminar el producto ${product.title}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProduct(product._id)
          .then(() => {
            Swal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
          })
          .catch((err) => {
            Swal.fire('Error', 'Hubo un problema al eliminar el producto.', 'error');
            console.error('Error al eliminar el producto:', err);
          });
      }
    });
  };

  return (
    <div className="relative rounded-lg shadow p-3 bg-secondary/40">
      <div className="absolute top-0 right-0 p-2 z-10">
        <button className="text-xl" onClick={handleMenuToggle} ref={buttonRef}>
          <SettingsApplicationsTwoToneIcon className='text-gray-500' fontSize="large" />
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute bg-textLight dark:bg-dark z-10 shadow-lg rounded mt-1 w-32"
          >
            <button onClick={handleEdit}
              className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded w-full">
              Editar producto
            </button>
            <button onClick={handleDelete}
              className="block p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded w-full">
              Eliminar producto
            </button>
          </div>
        )}
      </div>

      <ImageLazy
        src={product.thumbnails?.[0]}
        alt={product.title}
        className="z-10 object-cover aspect-square w-auto h-auto"
        loading="lazy"
      />

      <div className="relative rounded-xl flex flex-col items-start justify-between min-h-96">
        <h2 className="text-lg block text-left font-semibold">{product.title}</h2>
        {product.description.map((desc, index) => (
          <p key={index} className="line-clamp-2">{desc.label}: {desc.value}</p>
        ))}
        <p className="mt-1 font-bold">{isPesos ? "ARS" : "USD"} ${transformedPrice}</p>

        <div className="flex flex-row w-full gap-1 lg:gap-4">
          <label htmlFor="cantidad" className="self-center">Cant:</label>
          <input
            type="number"
            className="w-1/3 focus:outline-none"
            value={editableQuantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}

          />
          <button className="bg-green-600/80 px-4 py-2 rounded-md justify-self-end w-2/3 text-nowrap" onClick={onAddToCart}>
            Agregar al presupuesto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
