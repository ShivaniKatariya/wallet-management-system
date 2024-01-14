const mysql = require('mysql2/promise');
const { generateUUID } = require('../src/common/utils');
const log = require('./logger').webLog;

async function initializeServer() {
  try {
    return await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'wallet_management_system',
    });
  }
  catch (err) { console.error(err); }
}

exports.setUpWallet = async (req, res) => {
  try {
    let { id: walletId, balance = 0, name } = req.body;
    const connection = await initializeServer();

    if (!walletId) walletId = generateUUID();
    if (!name) {
      res.status(400).json({ error: 'Missing required parameters' });
      return;
    }

    await connection.beginTransaction();

    try {
      await connection.execute(
        'INSERT INTO Wallets (id, balance, name) VALUES (?, ?, ?)',
        [walletId, balance, name]
      );

      const transactionId = generateUUID();

      await connection.execute(
        'INSERT INTO Transactions (id, WalletId, amount, balance, description, type) VALUES (?, ?, ?, ?, ?, ?)',
        [transactionId, walletId, balance, balance, 'Setup', 'CREDIT']
      );

      await connection.commit();

      res.status(200).json({
        id: walletId,
        balance,
        name,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error(error);
      log.error(error);
      await connection.rollback();
      res.status(500).send('Internal Server Error');
    }

  } catch (error) {
    console.error(error);
    log.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.creditOrDebitFromWallet = async (req, res) => {
  try {
    const { walletId } = req.params;
    const { amount, description = '' } = req.body;

    const connection = await initializeServer();

    const [walletResults] = await connection.execute('SELECT * FROM Wallets WHERE id = ?', [walletId]);

    if (walletResults.length === 0) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const wallet = walletResults[0];
    const newBalance = parseFloat(wallet.balance) + parseFloat(amount);

    await connection.beginTransaction();

    try {
      await connection.execute('UPDATE Wallets SET balance = ? WHERE id = ?', [Math.abs(newBalance), walletId]);
      const id = generateUUID();
      const [transactionResult] = await connection.execute(
        'INSERT INTO Transactions (id, WalletId, amount, balance, description, type) VALUES (?, ?, ?, ?, ?, ?)',
        [id, walletId, Math.abs(amount), newBalance, description, amount > 0 ? 'CREDIT' : 'DEBIT']
      );

      await connection.commit();

      res.status(200).json({ balance: newBalance, transactionId: transactionResult.insertId });
    } catch (error) {
      console.error(error);
      log.error(error);
      await connection.rollback();
      res.status(500).send('Internal Server Error');
    }
  } catch (error) {
    console.error(error);
    log.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.listOfTransactions = async (req, res) => {
  try {
    const { walletId, skip, limit } = req.query;
    const connection = await initializeServer();
    let transactionResults;

    if (skip >= 0 && limit > 0) {
      [transactionResults] = await connection.execute(
        'SELECT * FROM Transactions WHERE walletId = ? ORDER BY date DESC limit ?, ?',
        [walletId, skip, limit]
      );
    }
    else {
      [transactionResults] = await connection.execute(
        'SELECT * FROM Transactions WHERE walletId = ? ORDER BY date DESC',
        [walletId]
      );
    }

    res.status(200).json(transactionResults);
  } catch (error) {
    console.error(error);
    log.error(error);
    res.status(500).send('Internal Server Error');
  }
};


exports.listOfAllTransactions = async (req, res) => {
  try {
    const connection = await initializeServer();

    const [transactionResults] = await connection.execute(
      'SELECT * FROM Transactions'
    )
    res.status(200).json(transactionResults);
  } catch (error) {
    console.error(error);
    log.error(error);
    res.status(500).send('Internal Server Error');
  }
}

exports.getWalletDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await initializeServer();

    const [walletResults] = await connection.execute('SELECT * FROM Wallets WHERE id = ?', [id]);

    if (walletResults.length === 0) {
      res.status(404).json({ error: 'Wallet not found' });
      return;
    }

    const wallet = walletResults[0];
    res.status(200).json({
      id: wallet.id,
      balance: wallet.balance,
      name: wallet.name,
      date: wallet.date,
    });
  } catch (error) {
    console.error(error);
    log.error(error);
    res.status(500).send('Internal Server Error');
  }
}