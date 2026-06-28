import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('Welcome to the AI Resource Hub!');
  const [subMessage, setSubMessage] = useState('Explore our collection of AI resources and tools.');

  return (
    <div>
      <h1>{message}</h1>
      <p>{subMessage}</p>
    </div>
  );
}