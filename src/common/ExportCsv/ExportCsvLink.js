import React from 'react';
import { CSVLink } from 'react-csv';
import { getColumnsFromList } from '../PaginatedTable/utils';

function ExportCsvLink(props) {

  const {
    exportData: csvData,
    exportLinkText = 'Export',
    noDataMessage = 'No data found'
  } = props;

  const headers = csvData.headers ? csvData.headers : getColumnsFromList(csvData.data);

  return (
    <div>
      {csvData && csvData.data && csvData.data.length > 0 &&
        <CSVLink data={csvData.data}
          filename={csvData.fileName || 'export'}
          headers={headers}
        >
          {exportLinkText}
        </CSVLink>
      }
      {csvData && (!csvData.data || csvData.data.length === 0) &&
        <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
          {noDataMessage}
        </div>
      }
    </div>
  );

}

export default ExportCsvLink;