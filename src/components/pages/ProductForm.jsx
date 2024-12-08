import React, { useEffect } from "react";
import Swal from 'sweetalert2';
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/productContext.jsx";

const ProductForm = ({ onSubmit }) => {
  const { id } = useParams();
  const { productDetails, fetchProductById, loading } = useProducts();
  const product = id ? productDetails[id]?.product || productDetails[id] : null;
  const { saveProduct } = useProducts();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      price: "",
      code: "",
      stock: "",
      status: true,
      category: {
        categoriaNombre: "",
        subcategoria: { subcategoriaNombre: "" },
      },
      description: [],
      thumbnails: [],
    },
  });

  const { fields: descriptionFields, append: appendDescription, remove: removeDescription } = useFieldArray({
    control,
    name: "description",
  });

  const { fields: thumbnailFields, append: appendThumbnail, remove: removeThumbnail } = useFieldArray({
    control,
    name: "thumbnails",
  });

  useEffect(() => {
    const loadProduct = async () => {
      if (id && !product) {
        await fetchProductById(id);
      }
    };
    loadProduct();
  }, [id, product, fetchProductById]);

  useEffect(() => {
    product && reset(product)
  }, [product, reset]);

  const formatCategory = (categoryName) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-');
  };

  const formattedData = (data) => {
    const formatted = {
      ...data,
      category: {
        categoriaNombre: data.category.categoriaNombre,
        categoriaId: formatCategory(data.category.categoriaNombre),
        subcategoria: {
          subcategoriaNombre: data.category.subcategoria.subcategoriaNombre,
          subcategoriaId: formatCategory(data.category.subcategoria.subcategoriaNombre),
        },
      },
    };
    ("Datos formateados: ", formatted);
    return formatted;
  };

  const handleFormSubmit = async (data) => {
    try {
      const newData = formattedData(data);
      const response = await saveProduct(newData, id);
      Swal.fire({
        title: '¡Éxito!',
        text: response,
        icon: 'success',
        confirmButtonText: 'Aceptar',
      });
      navigate('/');
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  if (loading) {
    return <p className="text-center">Cargando producto...</p>;
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="p-4 space-y-4 bg-gray-700 rounded-md">
      <div className="flex flex-col">
        <label htmlFor="title" className="text-sm font-medium">
          Título
        </label>
        <input
          id="title"
          type="text"
          {...register("title", { required: "El título es obligatorio" })}
          className="p-2 border rounded"
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="price" className="text-sm font-medium">
          Precio
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register("price", { required: "El precio es obligatorio" })}
          className="p-2 border rounded"
        />
        {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="code" className="text-sm font-medium">
          Código
        </label>
        <input
          id="code"
          type="text"
          {...register("code", { required: "El código es obligatorio" })}
          className="p-2 border rounded"
        />
        {errors.code && <span className="text-red-500 text-sm">{errors.code.message}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="stock" className="text-sm font-medium">
          Stock
        </label>
        <input
          id="stock"
          type="number"
          {...register("stock", { required: "El stock es obligatorio" })}
          className="p-2 border rounded"
        />
        {errors.stock && <span className="text-red-500 text-sm">{errors.stock.message}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="status" className="text-sm font-medium">
          Estado
        </label>
        <select id="status" {...register("status")} className="p-2 border rounded">
          <option value={true}>Activo</option>
          <option value={false}>Inactivo</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="category.categoriaNombre" className="text-sm font-medium">
          Categoría
        </label>
        <input
          id="category.categoriaNombre"
          type="text"
          {...register("category.categoriaNombre", { required: "La categoría es obligatoria" })}
          className="p-2 border rounded"
        />
        {errors.category?.categoriaNombre && (
          <span className="text-red-500 text-sm">{errors.category.categoriaNombre.message}</span>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="category.subcategoria.subcategoriaNombre" className="text-sm font-medium">
          Subcategoría (Opcional)
        </label>
        <input
          id="category.subcategoria.subcategoriaNombre"
          type="text"
          {...register("category.subcategoria.subcategoriaNombre")}
          className="p-2 border rounded"
        />
      </div>

      {/* Descripciones dinámicas */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Descripciones</label>
        {descriptionFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Etiqueta"
              {...register(`description.${index}.label`, { required: "Campo requerido" })}
              className="p-2 border rounded flex-1"
            />
            <input
              type="text"
              placeholder="Valor"
              {...register(`description.${index}.value`, { required: "Campo requerido" })}
              className="p-2 border rounded flex-1"
            />
            <button type="button" onClick={() => removeDescription(index)} className="p-2 text-white bg-red-500 rounded">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => appendDescription({ label: "", value: "" })} className="p-2 bg-blue-500 text-white rounded">
          Agregar descripción
        </button>
      </div>

      {/* Miniaturas dinámicas */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Imágenes</label>
        {thumbnailFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <input
              type="url"
              placeholder="URL de la imagen"
              {...register(`thumbnails.${index}`, { required: "Campo requerido" })}
              className="p-2 border rounded flex-1"
            />
            <button type="button" onClick={() => removeThumbnail(index)} className="p-2 text-white bg-red-500 rounded">
              X
            </button>
          </div>
        ))}
        <button type="button" onClick={() => appendThumbnail("")} className="p-2 bg-blue-500 text-white rounded">
          Agregar imagen
        </button>
      </div>

      <button type="submit" className="p-2 bg-green-500 text-white rounded">
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};

export default ProductForm;
