import { useState, useEffect } from 'react';

export default function EventsEdit({sendMessage}) {
  const [events, setEvents] = useState([])

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

  const readEvents = async () => {
    const res = await sendMessage('read', 'data', null)
    console.log(res)
    if(res.error) return
    setEvents(res)
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

  useEffect(() => {
    setDevMode()
    readEvents()
  }, [])

  return (
    <div>
      <div>
        {events.map((event, index) => (
          <p key={index}>{event.id}</p>
        ))}

      </div>

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
  );
}