import type { User } from '../../index'
import { useState, useEffect } from 'react';
import useDevModeSetting from './hooks/use-dev-mode-setting';
import CustomEventList from './components/CustomEventList';
import ReceivedEvents from './components/ReceivedEvents';
import { COMPONENTS } from './constants';
import './EventEdit.css'

type EventsEditProps = {
  sendMessage: (action: string, actionType: string, params: any) => Promise<any>;
  setUser: (user: User) => void;
  user: User;
};

export type Event = {
  [key: string]: string;
};

type Message = {
  type: string;
  data: any;
}

export interface EventCriteria {
    eventName: string;
    eventType: string;
    trackSection: string;
    description: string;
    userEmail: string;
    id: string;
    trackId?: string;
    attributes?: { [x: string]: string; };
}

export default function EventsEdit({sendMessage, user}: EventsEditProps) {
  const [customEvents, setCustomEvents] = useState<EventCriteria[]>([])
  const [receivedEvents, setReceivedEvents] = useState<Event[]>([]);
  const [activeComponent, setActiveComponent] = useState<string>(COMPONENTS.ReceivedEvents);
  const showReceivedEvents = activeComponent === COMPONENTS.ReceivedEvents;

  const { devMode, toggleDevMode } = useDevModeSetting();

  const readEvents = async () => {
    console.log('Reading events')
    const res = await sendMessage('read', 'data', null)
    console.log('read', res)
    if(res.error) return alert(`Error reading events : ${res.error}`)
    setCustomEvents(res)
  }

  const addEvent = async (data: EventCriteria) => {
    console.log('Adding event', data)
    const res = await sendMessage('create', 'data', [
      data
    ])
    console.log('add', res)
    if(res.error) return alert(`Error adding event : ${res.error}`)
    alert('Event added successfully');
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
    console.log('delete res', res)
  }

  const publishEvent = async () => {
    const res = await sendMessage('upload', 'storage', null)
    console.log(res)
    if(res.error) return alert(`Error reading events : ${res.error}`)
    alert('Events published')
  }

  function flattenAttributes(eventData: EventCriteria) {
    return {
        ...eventData,
        ...eventData.attributes,
        attributes: '',
        trackId: ''
    };
  }

  useEffect(() => {
    readEvents()
  }, [])

  useEffect(() => {
    const handleMessage = async (message: Message) => {
      if(message.type === 'at-event-from-content') {
        console.log('Message received in the sidepanel:', message.data)
        const newEvent = message.data as Event;
        const hasTrackId = !!newEvent.trackId;
        const params = [
            newEvent.eventType,
            newEvent.trackSection,
            hasTrackId ? newEvent.trackId : null
          ]
        
        const result = await sendMessage('query', 'data', params)
        console.log('query result', result)
        const hasResult = result && result.length > 0;
        
        if(!hasResult) return setReceivedEvents((prevEvents) => [newEvent, ...prevEvents]);
        if(hasResult && hasTrackId) return setReceivedEvents((prevEvents) => [result[0], ...prevEvents]);

        const secondaryKeys = ['className', 'innerText', 'xPath']
        const matchedEvent = result.find((event: EventCriteria) => {
          return secondaryKeys.some(key => newEvent[key] && event.attributes && newEvent[key] === event.attributes[key])
        })
        console.log('matched event', matchedEvent)
        
        if(matchedEvent) {
          const newMatchedEvent = flattenAttributes(matchedEvent);
          setReceivedEvents((prevEvents) => [newMatchedEvent, ...prevEvents]);
          return 
        }
        
  
        setReceivedEvents((prevEvents) => [newEvent, ...prevEvents]);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [customEvents]);

  return (
    <div className='eventEditContainer'>
      <div className="containerTab">
        <button onClick={() => {setActiveComponent(COMPONENTS.CustomEventList)}} className="tab"> {'已新增事件列表'} </button>
        <button onClick={() => {setActiveComponent(COMPONENTS.ReceivedEvents)}} className="tab"> {'接收與創建事件'} </button>
      </div>
      {!showReceivedEvents && <CustomEventList events={customEvents} deleteEvent={deleteEvent} readEvents={readEvents}/>}
      {/* <button onClick={editEvent}>
        update event
      </button> */}
      {showReceivedEvents && <ReceivedEvents receivedEvents={receivedEvents} addEvent={addEvent} readEvents={readEvents} user={user} />}
      <button onClick={publishEvent} className='publishButton'>
        publish event
      </button>
      <button onClick={toggleDevMode}>
        {devMode ? 'Disable Dev Mode' : 'Enable Dev Mode'}
      </button>
    </div>
  );
}