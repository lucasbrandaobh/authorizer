const { assert } = require('chai');
const createAccount = require('../../../lib/accounts/create')

describe('Test Create Accounts', () => {  
  const populateAccount = { "account": { "activeCard": true, "availableLimit": 100 } };

  beforeEach((done)=>{
    global.account = {};
    done();
  });

  it('Test input new account', (done) => {
    const result = createAccount(populateAccount);
    const expetedAccount = { "account": { "activeCard": true, "availableLimit": 100 }, violations: [] };
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));
    done();
  });

  it('Test input account duplicate should return violation rule account-already-initialized', (done) => {
    createAccount(populateAccount);
    const result = createAccount(populateAccount);
    const expetedAccount = { "account": { "activeCard": true, "availableLimit": 100 }, violations: ['account-already-initialized'] };
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));
    done();
  });

  it('Test restart account duplicate with availableLimit altered, should return violation rule account-already-initialized', (done) => {    
    createAccount(populateAccount);
    const newAccountInput = { "account": { "activeCard": true, "availableLimit": 350 } };
    const result = createAccount(newAccountInput);
    const expetedAccount = { "account": { "activeCard": true, "availableLimit": 350 }, violations: ['account-already-initialized'] };
    assert.equal(JSON.stringify(result), JSON.stringify(expetedAccount));
    done();
  });

  it('Test input new account, contract invalid', (done) => {
    const accountInput = { "activeCard": true }; 
    const result = createAccount(accountInput);
    assert.isUndefined(result);
    done();
  });
});