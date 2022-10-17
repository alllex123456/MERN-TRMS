exports.translateUnits = (source) => {
  const units = source.map((unit) => {
    if (unit === '2000cw/s')
      return {
        value: unit,
        displayedValue: '2000 ccs',
      };
    else if (unit === 'word') return { value: unit, displayedValue: 'cuvânt' };
    else if (unit === '300w')
      return { value: unit, displayedValue: '300 cuv.' };
    else
      return {
        value: unit,
        displayedValue: '1800 cfs',
      };
  });
  return units;
};

exports.translateServices = (source) => {
  const services = source.map((service) => {
    if (service === 'translation')
      return {
        value: service,
        displayedValue: 'traducere',
      };
    if (service === 'proofreading')
      return {
        value: service,
        displayedValue: 'corectura',
      };
    if (service === 'postediting')
      return {
        value: service,
        displayedValue: 'post-editare',
      };
  });
  if (services.length === 1) return services[0];

  return services;
};
