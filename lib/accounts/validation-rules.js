const accountRepository = require('./accounts-repository');

module.exports = () => {
  const violations = [];
  if (Object.keys(accountRepository.findOne()).length > 0) {
    violations.push('account-already-initialized');
  }
  return violations;
};