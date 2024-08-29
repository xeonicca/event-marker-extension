import type { User } from '../../../../index'
import type { EventCriteria } from '../../index'
import { useState } from 'react';
import PrimaryDataList from './components/PrimaryDataList';
import AttributeList from './components/AttributeList';
import './ReceivedEvents.css';

export type Event = {
    [key: string]: string;
};

type ReceivedEventsProps = {
  receivedEvents: Event[];
  addEvent: (data: EventCriteria) => void;
  readEvents: () => void;
  user: User;
};

const primaryKeys = ['eventType', 'trackSection', 'trackId'];

function ReceivedEvents({receivedEvents ,addEvent, readEvents, user}:ReceivedEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilterData, setSelectedFilterData] = useState<{[key: string]: string}>({});
  const [inputValue, setInputValue] = useState('');
  const [description, setDescription] = useState('');

  const onEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedFilterData({});
  }

  const primaryDataList = selectedEvent ? Object.entries(selectedEvent).filter(([key]) => primaryKeys.includes(key)) : [];
  const isAllPrimaryDataHasValue = primaryDataList.every(([_, value]) => !!value);

  const onCheckChange = (key: string, value: string, isChecked: boolean) => {
    setSelectedFilterData(prevData => {
      if (isChecked) {
        return {...prevData, [key]: value};
      } else {
        const newData = {...prevData};
        delete newData[key];
        return newData;
      }
    });
  };

  const onAddButtonClick = () => {
    if(!selectedEvent) return
    if(!inputValue) return alert('Please enter event name');
    const eventName = inputValue;
    const {eventType, trackSection, trackId} = selectedEvent;
    const data: EventCriteria = {
      eventName,
      eventType,
      trackSection,
      description,
      trackId,
      userEmail: user.email
    }

    if(Object.keys(selectedFilterData).length) {
      data.attributes = selectedFilterData;
    }

    addEvent(data);
    readEvents();

    setInputValue('');
    setSelectedEvent(null);
    setSelectedFilterData({});
  }

  return (
    <div>
      <h3>Received Events</h3>
      <div className='receivedEventsContainer'>
        {receivedEvents.map((event, index) => (
          <div key={event.trackId? event.trackId+index: event.xPath+index } onClick={() => {onEventSelect(event)}} className={`receivedEvent ${event.eventName ? 'hasEvent' : ''}`}>
              { event.eventName || `${event.trackSection} - ${event.eventType}` }
          </div>
        ))}
      </div>
      {selectedEvent && 
        <div> 
          <h3> 選取事件: {selectedEvent.eventName || `${selectedEvent.trackSection} - ${selectedEvent.eventType} - ${selectedEvent.elementId}`} </h3>
          <div className='primaryDataContainer'>
            <PrimaryDataList primaryDataList={primaryDataList}/>
          </div>
          {!isAllPrimaryDataHasValue && <AttributeList selectedEvent={selectedEvent} primaryKeys={primaryKeys} selectedFilterData={selectedFilterData} onCheckChange={onCheckChange}/>}
          {!selectedEvent.eventName && <div className='buttonContainer'>
            <input type="text" placeholder="Event Name" onChange={(e) => {setInputValue(e.target.value)}}/>
            <textarea placeholder="Event Description" className='textArea' onChange={(e) => setDescription(e.target.value)}/>
            <button onClick={onAddButtonClick}>
              add event
            </button>
          </div>}
        </div>
      }
    </div>
  );
}

export default ReceivedEvents;
