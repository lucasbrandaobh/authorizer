const { assert } = require('chai');
const sinon = require('sinon');
const createAccount = require('../../../lib/accounts/create')
const authorization = require('../../../lib/transactions/authorization')

describe('Test authorization transactions', () => {
  afterEach((done)=>{
    global.account = {};
    global.transactions = [];
    done();
  });  

  it('Test authorization sucess', (done) => {    
    const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };
    createAccount(populateAccount);
    const transactionInput = { "transaction": { "merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } }
    const expetedAccount = { "account": { "activeCard": true, "availableLimit": 80 }, violations: [] };
    const result = authorization(transactionInput);
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));
    done();
  });

  it('Test authorization fail, violation rule activeCard', (done) => {    
    const populateAccount = { "account": { "activeCard": false, "availableLimit": 100 } };
    createAccount(populateAccount);
    const transactionInput = { "transaction": { "merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } }
    const expetedAccount = { "account": { "activeCard": false, "availableLimit": 100 }, violations: ['card-not-active'] };
    const result = authorization(transactionInput);
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));
    done();
  });

  it('Test authorization fail, violation rule high-frequency-small-interval', (done) => {    
    const dateNow = new Date("2019-02-13T10:02:00.000Z");
    sinon.useFakeTimers(dateNow);
    const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };
    createAccount(populateAccount);
    
    const transactionInput1 = { "transaction": { "merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } };
    const transactionInput2 = { "transaction": { "merchant": "Habbib's", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } };
    const transactionInput3 = { "transaction": { "merchant": "McDonalds", "amount": 20, "time": "2019-02-13T10:01:00.000Z" } };
    const transactionInput4 = { "transaction": { "merchant": "Subway", "amount": 20, "time": "2019-02-13T10:02:00.000Z" } };
    
    const expetedAccount1 = { "account": { "activeCard": true, "availableLimit": 80 }, violations: [] };
    const expetedAccount2 = { "account": { "activeCard": true, "availableLimit": 60 }, violations: [] };
    const expetedAccount3 = { "account": { "activeCard": true, "availableLimit": 40 }, violations: [] };
    const expetedAccount4 = { "account": { "activeCard": true, "availableLimit": 40 }, violations: ['high-frequency-small-interval'] };
    
    const result1 = authorization(transactionInput1);
    assert.equal(JSON.stringify(result1), JSON.stringify(expetedAccount1));

    const result2 = authorization(transactionInput2);
    assert.equal(JSON.stringify(result2), JSON.stringify(expetedAccount2));

    const result3 = authorization(transactionInput3);
    assert.equal(JSON.stringify(result3), JSON.stringify(expetedAccount3));

    const result4 = authorization(transactionInput4);
    assert.equal(JSON.stringify(result4), JSON.stringify(expetedAccount4));
    
    done();
  });

  it('Test authorization fail, violation rule doubled-transaction', (done) => {    
    const dateNow = new Date("2019-02-13T10:02:00.000Z");
    sinon.useFakeTimers(dateNow);
    const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };
    createAccount(populateAccount);
    
    const transactionInput1 = { "transaction": { "merchant": "Habbib's", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } };
    const transactionInput2 = { "transaction": { "merchant": "Habbib's", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } };    
    
    const expetedAccount1 = { "account": { "activeCard": true, "availableLimit": 80 }, violations: [] };    
    const expetedAccount2 = { "account": { "activeCard": true, "availableLimit": 80 }, violations: ['doubled-transaction'] };
    
    const result1 = authorization(transactionInput1);
    assert.equal(JSON.stringify(result1), JSON.stringify(expetedAccount1));

    const result2 = authorization(transactionInput2);
    assert.equal(JSON.stringify(result2), JSON.stringify(expetedAccount2));
    
    done();
  });

  it('Test authorization fail, violation rule insufficient-limit', (done) => {    
    const dateNow = new Date("2019-02-13T10:02:00.000Z");
    sinon.useFakeTimers(dateNow);
    const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };
    createAccount(populateAccount);
    
    const transactionInput = { "transaction": { "merchant": "Habbib's", "amount": 101, "time": "2019-02-13T10:00:00.000Z" } };    
    const expetedAccount = { "account": { "activeCard": true, "availableLimit": 100 }, violations: ['insufficient-limit'] };        
    
    const result = authorization(transactionInput);
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));    
    done();
  });

  it('Test authorization fail, contract invalid', (done) => {    
    const dateNow = new Date("2019-02-13T10:02:00.000Z");
    sinon.useFakeTimers(dateNow);
    const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };
    createAccount(populateAccount);
    
    const transactionInput = { "merchant": ""};    
    const result = authorization(transactionInput);

    assert.isUndefined(result);    
    done();
  });

  it('Test authorization failed, transaction attempt without account created.', (done) => {    
    const transactionInput = { "transaction": { "merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } }
    const result = authorization(transactionInput);

    assert.equal(JSON.stringify(result), JSON.stringify({ message: 'account not found' }));    
    done();
  });
});