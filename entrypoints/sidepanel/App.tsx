import { useState, useEffect } from 'react';
import reactLogo from '@/assets/react.svg';
import wxtLogo from '/wxt.svg';
import './App.css';

function sendMessage(action, actionType, params) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ action, actionType, params }).then(response => {
      console.dir(response)
      resolve(response)
    });
  })
}

function App() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])

  const readEvents = async () => {
    const res = await sendMessage('read', 'data', null)
    setEvents(res)
  }

  const doLogin = async () => {
    const res = await sendMessage('login', 'auth', null)
    if (res.error) {
      console.error(res.error)
      return
    }
    setUser(res.user)
    readEvents()
  }

  const addEvent = async () => {
    const res = await sendMessage('create', 'data', [
      'event-name-2',
      {
        test1: 'test1',
        test2: 'test2',
        test3: 'test3',
      }
    ])
    console.log(res)
  }

  const editEvent = async () => {
    const res = await sendMessage('update', 'data', [
      'event-name-1',
      {
        test4: 'test4',
      }
    ])
    console.log(res)
  }

  const deleteEvent = async () => {
    const res = await sendMessage('delete', 'data', ['event-name-1'])
    console.log(res)
  }

  const publishEvent = async () => {
    const res = await sendMessage('upload', 'storage', null)
    console.log(res)
  }

  const setDevMode = async () => {
    console.log('Setting dev mode');
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab.id) return;
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        console.log('Dev mode enabled');
        localStorage.setItem('auto-tracking-dev-mode', 'true');
      },
    });
  };

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
      <div>
        <a href="https://wxt.dev" target="_blank">
          <img src={wxtLogo} className="logo" alt="WXT logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>WXT + React</h1>
      <div className="card">
        <p>Login as { user?.email }</p>
        {events.map((event, index) => (
          <p key={index}>{event.id}</p>
        ))}
        <button onClick={doLogin}>
          Login
        </button>

        <button onClick={setDevMode}>
          Set Dev Mode
        </button>

        <button onClick={addEvent}>
          add event
        </button>

        <button onClick={editEvent}>
          update event
        </button>

        <button onClick={deleteEvent}>
          delete event
        </button>

        <button onClick={publishEvent}>
          publish event
        </button>
      </div>
      <p className="read-the-docs">
        Click on the WXT and React logos to learn more
      </p>
    </>
  );
}

export default App;
