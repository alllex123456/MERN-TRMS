export const formatCurrency = (language, currency, value) => {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
  }).format(value);
};
