const accountRepository = require('./accounts-repository');
const validationRules = require('./validation-rules');
const validate = require('../validation')

module.exports = (accountInput) => {
  const validation = validate(accountInput, "accounts-schema")
  if (validation.valid) {
    const newAccount = Object.assign({}, accountInput);
    newAccount.violations = validationRules(newAccount);
  
    if (newAccount.violations.length) {
      return newAccount;
    }
  
    accountRepository.insertOne(accountInput);  
    return newAccount; 
  }  
};

