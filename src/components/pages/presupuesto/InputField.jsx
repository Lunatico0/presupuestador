import React from 'react'

const InputField = ({ label, id, value, onChange, min = 1, max }) => {
  return (
    <div className="flex flex-row pr-2 gap-2 md:p-0 md:gap-4 justify-between">
    <label htmlFor={id} className="self-center">{label}:</label>
    <input
      type="number"
      id={id}
      className="w-16 md:w-20 h-10 px-2 border-none border-gray-300 rounded focus:outline-none"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
    />
  </div>
  )
}

export default InputField
