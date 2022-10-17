export const formatCurrency = (language, currency, value, decimalPoints) => {
  return new Intl.NumberFormat(language, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: decimalPoints,
  }).format(value);
};
