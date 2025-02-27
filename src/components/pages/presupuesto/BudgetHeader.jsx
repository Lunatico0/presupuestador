import React from "react";

const BudgetHeader = ({ selectedClient }) => {
  return (
    <div className="border-b m-0 p-0 pb-4 mb-4 print:border-none">
      {/* Información del local */}
      <div className="justify-between items-center hidden print:flex">
        <div>
          <h2 className="text-xl font-bold">Artemisa</h2>
          <p className="text-sm">Dirección: Bulevard Ramirez 1156. Nogoyá, Entre Rios.</p>
          <p className="text-sm">Teléfono: +54 9 3435 578-195</p>
          <p className="text-sm">Email: contacto@artemisa-pvc.com</p>
        </div>
        <div>
          <h3 className="text-lg font-bold">Fecha: {new Date().toLocaleDateString("es-AR")}</h3>
        </div>
      </div>

      {/* Información del cliente */}
      {selectedClient && (
        <div className="m-0 mt-4 roundedprint:border-none print:bg-transparent">
          <h3 className="text-lg font-bold">Datos del Cliente:</h3>

          {(selectedClient.name || selectedClient.lastName) && <p className="text-sm">{!(selectedClient.name == "Consumidor" & selectedClient.lastName == "Final") && <strong>Nombre: </strong>}{selectedClient.name} {selectedClient.lastName} </p>}

          {selectedClient.dni && <p className="text-sm"><strong>DNI:</strong> {selectedClient.dni}</p>}

          {selectedClient.phone && <p className="text-sm"><strong>Teléfono:</strong> {selectedClient.phone}</p>}

          {selectedClient.email && <p className="text-sm"><strong>Email:</strong> {selectedClient.email}</p>}

          {(selectedClient.address.street || selectedClient.address.number || selectedClient.address.city) && <p className="text-sm"><strong>Dirección:</strong> {selectedClient.address.street} {selectedClient.address.number}, {selectedClient.address.city}</p>}

        </div>
      )}
    </div>
  );
};

export default BudgetHeader;
