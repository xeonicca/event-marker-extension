import { useState, useEffect } from 'react';
import Container from './components/Container';
import './App.css';

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const handleMessage = (message) => {
      if(message.type === 'at-event-from-content') {
        console.log('Message received in the sidepanel:', message.data)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <>
      <Container />
    </>
  );
}

export default App;
