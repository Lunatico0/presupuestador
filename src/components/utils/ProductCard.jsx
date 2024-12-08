import React, { useState, useEffect, useRef, useContext } from 'react';
import { useProducts } from "../../context/productContext";
import Swal from 'sweetalert2';

const ProductCard = ({ product, quantity, onQuantityChange, onAddToCart, onQuantityBlur }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { deleteProduct } = useProducts();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const [editableQuantity, setEditableQuantity] = useState(quantity || '');

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

  useEffect(() => {
    if (quantity !== editableQuantity) {
      setEditableQuantity(quantity || '');
    }
  }, [quantity]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      setEditableQuantity(value);
      onQuantityChange(value);
    }
  };

  const handleQuantityBlur = () => {
    if (editableQuantity === '' || isNaN(editableQuantity) || editableQuantity < 1) {
      setEditableQuantity(1);
      onQuantityBlur(1);  // Enviar el valor de 1 a la función de onBlur
    } else {
      onQuantityBlur(editableQuantity);  // Mantener el valor actual si es válido
    }
  };

  const handleEdit = () => {
    window.location.href = `/edit-product/${product._id}`;
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
        deleteProduct(product._id) // Llamar a la función deleteProduct desde el contexto
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
      <div className="absolute top-0 right-0 p-2">
        <button className="text-xl" onClick={handleMenuToggle} ref={buttonRef}>
          ⚙️
        </button>
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute bg-textLight z-10 shadow-lg rounded mt-1 w-32"
          >
            <button onClick={handleEdit} className="block p-2 text-textDark/80">
              Editar producto
            </button>
            <button onClick={handleDelete} className="block p-2 text-textDark/80">
              Eliminar producto
            </button>
          </div>
        )}
      </div>

      <img src={product.thumbnails?.[0]} alt={product.title} className="w-full h-64 object-cover rounded-md" />

      <div className="relative rounded-xl flex flex-col items-start justify-between min-h-96">
        <h2 className="text-lg block text-left font-semibold">{product.title}</h2>
        {product.description.map((desc) => (
          <p key={desc._id += 1} className="line-clamp-2">{desc.label}: {desc.value}</p>
        ))}
        <p className="mt-1 font-bold">${typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)}</p>

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
