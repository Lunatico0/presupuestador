import React, { useEffect, useState } from 'react'

const Dolar = () => {
  const [dollarRate, setDollarRate] = useState({ buy: 0, sell: 0 });
  const [inputDollars, setInputDollars] = useState('');
  const [convertedValue, setConvertedValue] = useState(0);

  useEffect(() => {
    const fetchDollarRate = async () => {
      try {
        const response = await fetch('https://dolarapi.com/v1/dolares');
        const data = await response.json();
        const dataOficial = data.find((dolar) => dolar.casa === 'oficial')
        setDollarRate({ buy: dataOficial.compra, sell: dataOficial.venta, casa: dataOficial.casa });
      } catch (error) {
        console.error('Error fetching dollar rates:', error);
      }
    };
    fetchDollarRate();
  }, []);

  const handleConvert = () => {
    const pesos = parseFloat(inputDollars) * parseFloat(dollarRate.sell);
    setConvertedValue(pesos.toFixed(2));
  };

  return (
    <div>
      <section className="mb-8 p-4 bg-gris dark:bg-light rounded-lg shadow-lg text-light dark:text-textDark">
        <h2 className="text-2xl font-bold mb-4">Cotización Dólar Oficial</h2>
        <div className="flex justify-between text-nowrap text-[4vw] sm:text-2xl gap-2 items-center mb-4">
          <p>Compra: <span className="font-bold dark:text-secondary text-textLight/80">US$ {dollarRate.buy}</span></p>
          <p>Venta: <span className="font-bold dark:text-secondary text-textLight/80">US$ {dollarRate.sell}</span></p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Ingresa dólares"
            value={inputDollars}
            onChange={(e) => setInputDollars(e.target.value)}
            className="p-2 rounded-md bg-light text-dark border border-primary"
          />
          <button
            onClick={handleConvert}
            className="p-2 dark:bg-acento bg-acento/65 hover:bg-acento text-dark font-bold rounded-md dark:hover:bg-acento/65 transition-all"
          >
            Convertir a Pesos
          </button>
          {convertedValue > 0 && (
            <p className="text-lg text-nowrap text-[4vw] sm:text-2xl font-bold dark:text-secondary text-textLight/80">
              US${inputDollars} dólares = ${convertedValue} pesos
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

export default Dolar
