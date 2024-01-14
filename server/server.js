const express = require('express');
const cors = require('cors');

const log = require('./logger').webLog;

const { setUpWallet, creditOrDebitFromWallet, listOfTransactions, getWalletDetails, listOfAllTransactions } = require('./utils');

const PORT = 8080;

const app = express();

app.use(cors());
app.use(express.json());

app.post('/setup', setUpWallet);

app.post('/transact/:walletId', creditOrDebitFromWallet);

app.get('/transactions', listOfTransactions);

app.get('/wallet/:id', getWalletDetails);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  log.info(`Server is running on PORT: ${PORT}`);
});