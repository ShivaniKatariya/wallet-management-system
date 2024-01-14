import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import './loading.css';

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner' >
      <FaSpinner size={50} color="#007bff" />
    </div>
  );
};

export default LoadingSpinner;
