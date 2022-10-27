import i18next from 'i18next';

export const translateUnits = (source) => {
  const units = source.map((unit) => {
    if (unit === '2000cw/s')
      return {
        value: unit,
        short: i18next.t('appUnits.short.2000cw/s'),
        displayedValue: i18next.t('appUnits.2000cw/s'),
      };
    else if (unit === 'word')
      return {
        value: unit,
        short: i18next.t('appUnits.short.word'),
        displayedValue: i18next.t('appUnits.word'),
      };
    else if (unit === '300w')
      return {
        value: unit,
        short: i18next.t('appUnits.short.300w'),
        displayedValue: i18next.t('appUnits.300w'),
      };
    else
      return {
        value: unit,
        short: i18next.t('appUnits.short.1800cw/os'),
        displayedValue: i18next.t('appUnits.1800cw/os'),
      };
  });

  if (units.length === 1) return units[0];

  return units;
};

export const translateServices = (source) => {
  const services = source.map((service) => {
    if (service === 'translation')
      return {
        value: service,
        displayedValue: i18next.t('appServices.translation'),
      };
    if (service === 'proofreading')
      return {
        value: service,
        displayedValue: i18next.t('appServices.proofreading'),
      };
    if (service === 'postediting')
      return {
        value: service,
        displayedValue: i18next.t('appServices.postEditing'),
      };
  });
  if (services.length === 1) return services[0];

  return services;
};
