import { useState } from 'react';

'use client';

export default function Home() {
  const [message, setMessage] = useState('Welcome to the AI Resource Hub!');
  const [subMessage, setSubMessage] = useState('Explore our collection of AI resources and tools.');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">{message}</h1>
      <p className="text-xl text-gray-600">{subMessage}</p>
    </div>
  );
}