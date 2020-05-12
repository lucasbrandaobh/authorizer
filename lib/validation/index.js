const tv4 = require('tv4');
const accountSchema = require('../accounts/accounts-schema.json');
const transactionsSchema = require('../transactions/transactions-schema.json');

tv4.addSchema(accountSchema);
tv4.addSchema(transactionsSchema);

module.exports = (json, schema) => {
  const result = tv4.validateMultiple(json, schema);
  return result;
};

