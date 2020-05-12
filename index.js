const readline = require('readline');
const createAccount = require('./lib/accounts/create')
const authorization = require('./lib/transactions/authorization')

const interface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

interface.on('line', (line) => {
  try {
    const objectInput = JSON.parse(line);
    let result = {};

    switch (Object.keys(objectInput)[0]) {
      case 'account':
        result = createAccount(objectInput);
        break;
      case 'transaction':
        result = authorization(objectInput);
        break;
      default:
        break;
    }

    console.log(JSON.stringify(result) + '\n');    

    if (line === 'exit') {
      interface.close();
    }
  } catch (e) {
    console.log('{} \n');
  }
  console.log('--------------------------------------------------------');
});