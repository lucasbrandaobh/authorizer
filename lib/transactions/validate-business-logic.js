const transactionsRepository = require('../transactions/transactions-repository')

const messagesBusinessLogical = {
  insufficientlimit: 'insufficient-limit',
  cardNotActive: 'card-not-active',
  highFrequencySmallInterval: 'high-frequency-small-interval',
  doubledTransaction: 'doubled-transaction'
};

const getSimilarTransactions = (recentTransactions, transactionInput) => {
  const similarTrasactions = recentTransactions.filter((item) => {
    return item.transaction.merchant === transactionInput.transaction.merchant && 
           item.transaction.amount === transactionInput.transaction.amount;
  });
  return similarTrasactions;
};
module.exports = (transactionInput, actualAccount) => {  
  const businessViolations = [];

  if (!actualAccount.account.activeCard) {
    businessViolations.push(messagesBusinessLogical.cardNotActive)
  }

  if (actualAccount.account.availableLimit < transactionInput.transaction.amount) {
    businessViolations.push(messagesBusinessLogical.insufficientlimit)
  }  

  const recentTransactions = transactionsRepository.findRecentTransactions();

  if (recentTransactions && recentTransactions.length >= 3) {
    businessViolations.push(messagesBusinessLogical.highFrequencySmallInterval);
  }

  const similarTransactions = getSimilarTransactions(recentTransactions, transactionInput);

  if (similarTransactions && similarTransactions.length >= 1) {
    businessViolations.push(messagesBusinessLogical.doubledTransaction);
  }

  return businessViolations;
};