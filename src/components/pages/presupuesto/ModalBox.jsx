import React, { useState } from 'react'
import Search from '../../utils/Search.jsx';
import { Modal, Box } from '@mui/material';

const ModalBox = ({ modalState, clientData, actions }) => {
  const [search, setSearch] = useState('');
  const { isClientModalOpen, setIsClientModalOpen, isNewClientFormVisible, setIsNewClientFormVisible } = modalState;
  const { newClient, clients } = clientData;
  const { handleInputChange, handleSaveClient, handleSelectClient, handleNewClient, handleSell } = actions;
  const modalClass = `
  dark:bg-gris bg-light dark:text-light text-dark
  shadow-black p-4 rounded w-11/12 max-w-xl absolute left-1/2
  transform-cpu -translate-x-1/2 -translate-y-1/2
`;

  return (
    <Modal
      open={isClientModalOpen}
      onClose={() => setIsClientModalOpen(false)}
    >
      <Box
        className={`${modalClass}
          ${isNewClientFormVisible ? 'top-2/4' : 'top-1/4'}
        `}>
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
                  className="absolute left-2 top-0 text-acento text-sm transition-all transform -translate-y-1/2 px-1 rounded pr-2 backdrop-blur-sm"
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
          </>)
        }
      </Box>
    </Modal>
  )
}

export default ModalBox
