# Authorizer

> Application that authorizes a transaction for a specific account following a set of
predefined rules.

> Application developed in javacript with Nodejs.


> The application will have to basically perform two operations:
  * Account Creation
  * Transaction Authorization.

# Instructions for execution

> To run the application directly on the system operation you will need a machine with Mac, Unix or Windows operating system with Nodejs package lasted version installed.

https://nodejs.org/en/

> When unzipping the 'Authorizer' folder, go to the directory root on the command terminal and execute the command below to download the dependency packages:
  * $ npm install

> To run the application run the command below at the root of the project:
  * $ npm start or node index.js

> To create an account, enter a json as example below at the command terminal:
  * { "account": { "activeCard": true, "availableLimit": 100 } }

> To authorize a transaction, enter a json as example below at the command terminal:
  * { "transaction": { "merchant": "Burger King", "amount": 20, "time": "2019-02-13T10:00:00.000Z" } }

# Tests

> Unitary tests were created testing the main scenarios described in the project specification. I emphasize the importance of intonation tests but since the application does not depend on any external packages or APIs these types of tests were not created.

> To run the tests run the command below:

  * $ npm test or npm run mocha
  * The 'npm test' command will perform a complete eslint and coverege coding verification run of the test coverage in the code.
  * The command 'npm run mocha' will only perform unit tests.

# eslint

> To run eslint check run the following command:
  * $ npm run check

# coverage

> To run the test code coverage check run the following command:
  * $ npm run coverage

# Modules
  * tv4
  * chai
  * eslint
  * mocha
  * sinon
  * nyc