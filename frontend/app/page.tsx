import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Simulate fetching a welcome message from an API
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch('/api/welcome-message');
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Failed to fetch welcome message:', error);
        setMessage('Welcome to the AI Resource Hub!');
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <div>
      <h1>Welcome to the AI Resource Hub!</h1>
      <p>{message}</p>
    </div>
  );
}