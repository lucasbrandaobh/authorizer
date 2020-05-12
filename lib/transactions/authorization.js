const validateBusinessLogical = require('./validate-business-logic');
const accountRepository = require('../accounts/accounts-repository')
const transactionsRepository = require('../transactions/transactions-repository')
const validate = require('../validation')

module.exports = (transactionInput) => {
  const validation = validate(transactionInput, "transactions-schema")
  if (validation.valid) {
    const actualAccount = accountRepository.findOne();

    if (Object.keys(actualAccount).length == 0) {
      return { message: 'account not found' };
    }
    const businessViolations = validateBusinessLogical(transactionInput, actualAccount)

    let accountReturn = Object.assign({}, actualAccount)
    accountReturn.violations = businessViolations;

    if (businessViolations.length > 0) {
      return accountReturn;
    }

    const newLimit = actualAccount.account.availableLimit - transactionInput.transaction.amount;
    accountRepository.updateOne({ availableLimit: newLimit });

    accountReturn = accountRepository.findOne();
    accountReturn.violations = [];

    transactionsRepository.insertOne(transactionInput);

    return Object.assign(accountReturn, { violations: [] });
  }
};