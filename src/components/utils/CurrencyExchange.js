export const convertPricesToPesos = (products, dollarRate, toPesos) => {
  if (!products || !dollarRate) return products;

  return products.map((product) => ({
    ...product,
    price: toPesos
      ? (product.price / parseFloat(dollarRate.sell)).toFixed(2)
      : (product.price * parseFloat(dollarRate.sell)).toFixed(2),
  }));
};
