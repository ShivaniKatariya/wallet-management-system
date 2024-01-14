import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ statusCode, message }) => {
  return (
    <div className='error-message-container'>
      <p>Error Status Code: {statusCode}</p>
      <p>Error Message: {message}</p>
    </div>
  );
};

export default ErrorMessage;
