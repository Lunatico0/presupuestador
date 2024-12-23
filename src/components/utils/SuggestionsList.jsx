import React from "react";

const SuggestionsList = ({
  predictions,
  selectedIndex,
  setSelectedIndex,
  onSelect,
  getDisplayValue,
  onNewClient,
  type,
}) => {
  return (
    <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 w-full z-20 overflow-auto max-h-60 h-auto">
      {predictions.length === 0 ? (
        <li className="p-2 text-textDark">No se encontraron resultados
          {type === "clients" && (
            <button
              className="block mt-2 text-blue-500 hover:underline"
              onClick={onNewClient}
            >
              Agregar nuevo
            </button>
          )}
        </li>
      ) : (
        predictions.map((prediction, index) => (
          <li
            key={prediction._id}
            className={`p-2 text-textDark cursor-pointer hover:bg-gray-100 ${index === selectedIndex ? "bg-gray-200" : ""}`}
            onClick={() => onSelect(prediction)}
            onMouseEnter={() => setSelectedIndex(index)}
          >
            {getDisplayValue(prediction)}
          </li>
        ))
      )}
    </ul>
  );
};

export default SuggestionsList;
