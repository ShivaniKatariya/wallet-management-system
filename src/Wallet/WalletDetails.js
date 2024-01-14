import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { apiEndpoints } from '../apiConfig';
import Spinner from '../common/Loading/Spinner';
import { formatAmount, formatDateStripTime } from '../common/utils';
import NewTransaction from '../WalletTransactions/NewTransaction';
import ErrorMessage from '../common/ErrorMessage/ErrorMessage';

const WalletDetails = () => {
  const [walletDetails, setWalletDetails] = useState();
  const [loading, setLoading] = useState();
  const [errMsg, setErrMsg] = useState();

  const storedWalletId = localStorage.getItem('walletId');

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    fetch(apiEndpoints.wallet(storedWalletId), {
      signal: controller.signal
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setWalletDetails(data);
        }
        else
          setErrMsg({
            statusCode: res.status,
            message: res.statusText
          })
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching wallet details:', error);
        setLoading(false);
      });

    return () => { controller.abort() }

  }, [storedWalletId]);

  if (loading) return <Spinner />;
  if (errMsg) return <ErrorMessage statusCode={errMsg.statusCode} message={errMsg.message} />
  if (!walletDetails) return <div>Error loading wallet details.</div>;

  const { balance, name, date, id } = walletDetails;

  return (
    <div >
      <h3>Wallet Details</h3>
      <div style={{ justifyContent: 'space-evenly', background: 'white', padding: 20, width: 300, marginLeft: 50, borderRadius: 8, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <p><label className='wallet-detail-label'>Created At:</label> {formatDateStripTime(date)}</p>
        <p><label className='wallet-detail-label'>Name:</label> {name}</p>
        <p><label className='wallet-detail-label'>Balance:</label> {formatAmount(balance)}</p>
      </div>
      <h3>New Transaction</h3>
      <NewTransaction currentBalance={balance} walletId={id} setWalletDetails={setWalletDetails} />
    </div >
  );
};

WalletDetails.propTypes = {
};

export default WalletDetails;
