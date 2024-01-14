import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { apiEndpoints } from '../apiConfig';
import Elipses from '../common/Loading/Elipses';
import { Link } from 'react-router-dom';
import { isValidAmount } from '../common/utils';
import { useRef } from 'react';

const NewTransaction = props => {
  const { walletId, currentBalance, setWalletDetails } = props;

  const [loading, setLoading] = useState();
  const [formattedAmount, setFormattedAmount] = useState('');
  const [transactionType, setTransactionType] = useState();
  const transactionDesc = useRef();
  const [successMsg, setSuccessMsg] = useState();

  const transactionAmount = formattedAmount.replace(/,/g, '');

  const handleTransaction = (e) => {

    e.preventDefault();
    const controller = new AbortController();
    setLoading(true);
    fetch(apiEndpoints.transact(walletId), {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: transactionType === 'CREDIT' ? transactionAmount : (-1 * transactionAmount),
        description: transactionDesc.current.value
      })
    }).then(res => res.json())
      .then(updatedWallet => {
        setWalletDetails(existingWallet => ({
          ...existingWallet,
          balance: updatedWallet.balance
        }));
        setSuccessMsg(transactionType === 'CREDIT' ? 'Amount Credited!' : 'Amount Debited!');
        resetForm(e);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    return () => { controller.abort() }

  };

  const resetForm = (e) => {
    e.target.reset();
    setTransactionType('');
    setLoading(false);
    setFormattedAmount('');
    setTimeout(() => {
      setSuccessMsg('');
    }, 5000);
  };
  console.log('Re render');
  const handleInput = (e) => {
    const value = e.target.value;
    const valueWithoutComas = value.replace(/,/g, '');

    const isValidInput = isValidAmount(valueWithoutComas);
    if (isValidInput) {
      const hasDecimal = valueWithoutComas.includes('.');
      const [valueBeforeDecimal, valueAfterDecimal] = valueWithoutComas.split('.');
      const formattedValue = valueBeforeDecimal.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        + (hasDecimal ? '.' : '')
        + (valueAfterDecimal ? `${valueAfterDecimal}` : '');
      setFormattedAmount(formattedValue);
    }
  };

  const disableTransaction = loading || (transactionAmount == 0) || !transactionAmount || !transactionType || (currentBalance - transactionAmount < 0 && transactionType === 'DEBIT');

  return <div style={{ marginLeft: 50 }} className="set-up-form-container">
    <form className='set-up-form' onSubmit={handleTransaction}>
      <input
        className='form-input'
        required
        type="text"
        placeholder="Enter amount"
        value={formattedAmount}
        onInput={handleInput}
      />
      <input
        className='form-input'
        placeholder="Optional note/comments"
        ref={transactionDesc}
      />
      <select style={{ width: '96%', height: 35 }} value={transactionType || ''} onChange={(e) => setTransactionType(e.target.value)}>
        <option value="" disabled hidden style={{ color: 'gray' }}>Select Transaction Type</option>
        <option value="CREDIT">CREDIT</option>
        <option value="DEBIT">DEBIT</option>
      </select>
      <br />
      <button
        className={`form-submit-button ${disableTransaction ? 'disabled' : ''}`}
        disabled={disableTransaction}
        type='submit'>
        Submit Transaction
        {loading && <Elipses />}
      </button>
      <div style={{ color: 'green', alignSelf: 'center' }}>{successMsg}</div>
      <Link to="/transactions">Go to Transaction List</Link>

    </form>
  </div>;
};

NewTransaction.propTypes = {
  walletId: PropTypes.string.isRequired,
  currentBalance: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  setWalletDetails: PropTypes.func.isRequired,
};

export default NewTransaction;