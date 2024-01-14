import React, { useEffect } from 'react';
import { useState } from 'react';
import PaginatedTable from '../common/PaginatedTable/PaginatedTable';
import { apiEndpoints } from '../apiConfig';
import { getColumnsFromList } from '../common/PaginatedTable/utils';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/Loading/Spinner';
import ExportCsvLink from '../common/ExportCsv/ExportCsvLink';

const WalletTransactions = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState({ columns: [], dataset: [] });
  const [walletDetails, setWalletDetails] = useState();
  const [exportData, setExportData] = useState();
  const [loading, setLoading] = useState();

  let itemsPerPage = 10;
  const storedWalletId = localStorage.getItem('walletId');

  const fetchTransactions = () => {
    const controller = new AbortController();
    setLoading(true);
    fetch(apiEndpoints.transactions(storedWalletId, currentPage, itemsPerPage), {
      signal: controller.signal,
    }).then(res => res.json())
      .then(tList => {
        const excludedKeys = ['id', 'walletId'];
        setTableData({
          columns: getColumnsFromList(tList, excludedKeys),
          dataset: tList
        });
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
    return () => { controller.abort() }
  };

  const fetchExportData = () => {
    const controller = new AbortController();
    fetch(apiEndpoints.transactions(storedWalletId), {
      signal: controller.signal,
    }).then(res => res.json())
      .then(allTrx => {
        setExportData({
          data: allTrx,
          fileName: `${walletDetails ? walletDetails.name : ''} Transaction History`,
          headers: getColumnsFromList(allTrx, ['walletId', 'id'])
        })
      })
      .catch(err => console.log(err));
    return () => { controller.abort() }
  }

  const renderExportButtonOrLink = () => {
    if (exportData)
      return <ExportCsvLink
        exportData={exportData}
        exportLinkText={`${walletDetails ? walletDetails.name : ''} Wallet Transaction History.csv`}
        noDataMessage='*No transactions found.' />

    return <button className='generate-csv' onClick={fetchExportData}>Generate csv</button>
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch(apiEndpoints.wallet(storedWalletId), {
      signal: controller.signal,
    }).then((res) => res.json())
      .then((data) => {
        setWalletDetails(data);
      })
      .catch((error) => {
        console.error('Error fetching wallet details:', error);
      });
    return () => { controller.abort() }
  }, [storedWalletId]);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [currentPage, storedWalletId]);

  if (!storedWalletId) return <Link style={{ float: 'right' }} to="/wallet">Please setup a wallet</Link>
  if (loading) return <LoadingSpinner />;
  return <div>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: 1000 }}>
      <h3 >{`${walletDetails ? walletDetails.name : ''} Wallet Transaction History`}</h3>
      {renderExportButtonOrLink()}
    </div>

    <PaginatedTable
      columns={tableData.columns}
      dataset={tableData.dataset}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      sortEnableColumns={['amount', 'date']}
    />
  </div>;
};

WalletTransactions.propTypes = {};

export default WalletTransactions;