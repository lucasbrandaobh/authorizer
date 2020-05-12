
const insertOne = (transaction) => {
  if (global.transactions) {
    global.transactions.push(transaction);
  } else {
    global.transactions = [transaction];
  }
};

const findRecentTransactions = () => {
  let result = [];
  if (global.transactions) {
    result = global.transactions.filter((item) => {
      const dateNow = new Date();
      const dateItem = new Date(item.transaction.time);
      const hourNow = dateNow.getUTCHours();
      const minuteNow = dateNow.getUTCMinutes();
      const minuteLimit = minuteNow - 2;
      if (dateItem.getUTCHours() === hourNow && 
          dateItem.getUTCMinutes() <= minuteNow && 
          dateItem.getUTCMinutes() >= minuteLimit) {
        return item;
      }
    });
  }
  return result;
};


// const findAll = () => {
//   const result = global.transactions ? global.transactions : {};
//   return result;
// };

module.exports = {
  insertOne,
  findRecentTransactions,
  // findAll
};
