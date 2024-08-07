import { useState, useEffect } from 'react';
import CustomEventList from './components/CustomEventList';
import ReceivedEvents from './components/ReceivedEvents';
import { COMPONENTS } from './constants';

type EventsEditProps = {
  sendMessage: (action: string, actionType: string, params: any) => Promise<any>;
};

export type Event = {
  [key: string]: string;
};

export default function EventsEdit({sendMessage}: EventsEditProps) {
  const [customEvents, setCustomEvents] = useState<Event[]>([])
  const [activeComponent, setActiveComponent] = useState<string>(COMPONENTS.ReceivedEvents);
  const showReceivedEvents = activeComponent === COMPONENTS.ReceivedEvents;

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
    console.log('read',res)
    if(res.error) return
    setCustomEvents(res)
  }

  const addEvent = async (name: string, data: {[key:string]: string}) => {
    console.log('Adding event:', name, data)
    const res = await sendMessage('create', 'data', [
      name,
      data
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

  const deleteEvent = async (id: string) => {
    const res = await sendMessage('delete', 'data', [id])
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
      <button onClick={() => {setActiveComponent(COMPONENTS.CustomEventList)}}> {COMPONENTS.CustomEventList} </button>
      <button onClick={() => {setActiveComponent(COMPONENTS.ReceivedEvents)}}> {COMPONENTS.ReceivedEvents} </button>
      <button onClick={publishEvent}>
        publish event
      </button>
      {!showReceivedEvents && <CustomEventList events={customEvents} deleteEvent={deleteEvent} readEvents={readEvents}/>}
      <button onClick={editEvent}>
        update event
      </button>
      {showReceivedEvents && <ReceivedEvents addEvent={addEvent} readEvents={readEvents}/>}
    </div>
  );
}