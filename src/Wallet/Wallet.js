import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import WalletDetails from './WalletDetails';
import SetUpWallet from './SetUpWallet';

const Wallet = props => {
  const [walletId, setWalletId] = useState(null);

  useEffect(() => {
    const storedWalletId = localStorage.getItem('walletId');
    if (storedWalletId) {
      setWalletId(storedWalletId);
    }
  }, []);

  if (!walletId) return <SetUpWallet setWalletId={setWalletId} />;
  else
    return <WalletDetails walletId={walletId} />;
};

Wallet.propTypes = {};

export default Wallet;