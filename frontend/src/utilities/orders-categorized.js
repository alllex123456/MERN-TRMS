export const ordersCategorized = (ordersArray) => {
  let jobs = {
    translation: {
      '2000cw/s': [],
      '1800cwo/s': [],
      word: [],
      '300w': [],
    },
    proofreading: {
      '2000cw/s': [],
      '1800cwo/s': [],
      word: [],
      '300w': [],
    },
    postediting: {
      '2000cw/s': [],
      '1800cwo/s': [],
      word: [],
      '300w': [],
    },
  };

  ordersArray.forEach((order) => {
    jobs[order.service][order.unit].push(order);
  });

  return jobs;
};
