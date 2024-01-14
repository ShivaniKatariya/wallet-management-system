import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import './Wallet.css';
import { apiEndpoints } from '../apiConfig';
import { generateUUID, isValidAmount } from '../common/utils';

const SetUpWallet = props => {

  const { setWalletId } = props;
  const [username, setUsername] = useState();
  const [formattedAmount, setFormattedAmount] = useState('');

  const initializeWallet = (e) => {
    e.preventDefault();

    const wId = generateUUID();
    const controller = new AbortController();
    fetch(apiEndpoints.setup, {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: wId, balance: formattedAmount.replace(/,/g, ''), name: username })
    }).then(res => res.json())
      .then(walletDetails => {

        if (walletDetails) {
          localStorage.setItem('walletId', walletDetails.id);
          setWalletId(walletDetails.id);
        }
      });

    return () => { controller.abort() }
  }

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

  const enableCreatingWallet = username && username.length;

  return <div >
    <h3>Wallet Management System</h3>
    <div className="set-up-form-container">
      <form className='set-up-form' onSubmit={initializeWallet}>
        <label className='form-label'>
          Username
          <input className='form-input'
            type="text"
            value={username}
            onInput={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <br />
        <label className='form-label'>
          Initial Balance <span className='optional-text'>(optional)</span>
          <input
            className='form-input'
            type="text"
            placeholder="Enter amount"
            value={formattedAmount}
            onInput={handleInput}
          />
        </label>
        <br />
        <button
          className={`form-submit-button ${enableCreatingWallet ? '' : 'disabled'}`}
          disabled={!enableCreatingWallet}
          type="submit"
        >
          Create Wallet
        </button>
      </form>
    </div>
  </div>;
};

SetUpWallet.propTypes = {
  setWalletId: PropTypes.func
};

export default SetUpWallet;