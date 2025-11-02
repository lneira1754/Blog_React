import React from 'react';
import { Message } from 'primereact/message';

const ErrorMessage = ({ message, severity = 'error' }) => {
  if (!message) return null;
  
  return (
    <Message 
      severity={severity} 
      text={message}
      className="w-full mb-3"
    />
  );
};

export default ErrorMessage;