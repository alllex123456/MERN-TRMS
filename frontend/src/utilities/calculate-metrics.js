import {
  eachWeekOfInterval,
  format,
  isWithinInterval,
  subDays,
} from 'date-fns';

export const computePages = (unit, count) => {
  let page;
  if (unit === '2000cw/s') {
    page = count / 2000;
  }
  if (unit === 'word' || unit === '300w') {
    page = count / 300;
  }
  if (unit === '1800cw/os') {
    page = count / 1800;
  }
  return page;
};

export const getUnitMetrics = (time, source) => {
  let metrics = {};
  source.forEach((order) => {
    if (time(new Date(order.deliveredDate))) {
      metrics = {
        ...metrics,
        [order.unit]: metrics[order.unit] || 0,
        [order.currency]: metrics[order.currency] || 0,
      };
      metrics[order.unit] += order.count;
      metrics[order.currency] += order.total;
    }
  });
  return metrics;
};

export const getIntervalMetrics = (minusDays, source) => {
  let lastWeekArr = [];
  let uniqueDays = [];
  let dataObject = {};

  source.forEach((order) => {
    if (
      isWithinInterval(new Date(order.deliveredDate), {
        start: new Date(subDays(new Date(), minusDays)),
        end: new Date(),
      })
    ) {
      lastWeekArr.push(order);
    }
  });

  lastWeekArr.forEach((order) => {
    if (!uniqueDays.includes(format(new Date(order.deliveredDate), 'dd/LL'))) {
      uniqueDays.push(format(new Date(order.deliveredDate), 'dd/LL'));
    }
  });

  lastWeekArr.forEach((order, index, array) => {
    for (const date of uniqueDays) {
      if (format(new Date(order.deliveredDate), 'dd/LL') === date) {
        dataObject = {
          ...dataObject,
          [format(new Date(order.deliveredDate), 'dd/LL')]: {
            ...dataObject[format(new Date(order.deliveredDate), 'dd/LL')],
            [order.unit]: dataObject[order.unit] || 0,
            [order.currency]: dataObject[order.currency] || 0,
          },
        };

        dataObject[format(new Date(order.deliveredDate), 'dd/LL')][
          order.unit
        ] += order.count;
        dataObject[format(new Date(order.deliveredDate), 'dd/LL')][
          order.currency
        ] += order.total;
      }

      if (!format(new Date(order.deliveredDate), 'dd/LL') === date) {
        dataObject = {
          ...dataObject,
          [format(new Date(order.deliveredDate), 'dd/LL')]: {
            [order.unit]: order.count,
            [order.currency]: order.total,
          },
        };
      }
    }

    return dataObject;
  });

  return dataObject;
};

export const getMonths = (source, currency) => {
  const months = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  source.forEach((order) => {
    if (order.currency !== currency) return;
    const orderMonth = new Date(order.deliveredDate).getMonth();
    const objectMonth = new Date(order.deliveredDate).toLocaleString('en', {
      month: 'long',
    });
    if (orderMonth === 0) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 1) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 2) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 3) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 4) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 5) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 6) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 7) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 8) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 9) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 10) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
    if (orderMonth === 11) {
      months[objectMonth] = months[objectMonth] + order.total;
    }
  });

  return months;
};
