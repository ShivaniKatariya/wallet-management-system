import React, { useState } from 'react';
import { formatIfDate } from '../utils';
import './table.css';

const PaginatedTable = ({ columns, dataset, itemsPerPage, currentPage, setCurrentPage }) => {
  const [sortConfig, setSortConfig] = useState({ column: null, order: 'asc' });

  const nextPage = () => {
    setCurrentPage((cPage) => (cPage + 1));
  };

  const prevPage = () => {
    setCurrentPage((cPage) => (cPage - 1));
  };

  const handleSort = (column) => {
    const order = sortConfig.column === column && sortConfig.order === 'asc' ? 'desc' : 'asc';
    setSortConfig({ column, order });
  };

  const sortedDataset = () => {
    if (!sortConfig.column) return dataset;

    return [...dataset].sort((a, b) => {
      if (a[sortConfig.column] < b[sortConfig.column]) {
        return sortConfig.order === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.column] > b[sortConfig.column]) {
        return sortConfig.order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (column) => {
    if (sortConfig.column === column) {
      return sortConfig.order === 'asc' ? '▲' : '▼';
    }
    return null;
  };

  return (
    <div className='table-container'>
      <table className='paginated-table'>
        <thead className='table-header'>
          <tr>
            {columns.map((column) => (
              <th className='table-header-item' key={column} onClick={() => handleSort(column)}>
                {column} {getSortIcon(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedDataset().map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td className='table-body-item' key={column}>{formatIfDate(row[column])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button className='prev-page' onClick={() => prevPage()} disabled={currentPage === 1}>
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button className='next-page' onClick={() => nextPage()} disabled={dataset.length < itemsPerPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginatedTable;