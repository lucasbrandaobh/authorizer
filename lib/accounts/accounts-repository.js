
const insertOne = (account) => {
  global.account = account;
};

const findOne = () => {
  const result = global.account;
  return result;
};

const updateOne = (query) => {
  global.account.account.availableLimit = query.availableLimit;

};

module.exports = {
  insertOne,
  findOne,
  updateOne
};
