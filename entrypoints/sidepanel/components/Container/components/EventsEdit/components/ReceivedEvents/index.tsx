import { useState } from 'react';
import './ReceivedEvents.css';

export type Event = {
    [key: string]: string;
};

type ReceivedEventsProps = {
  receivedEvents: Event[];
  addEvent: (name: string, data: {[key:string]:string}) => void;
  readEvents: () => void;
};

function ReceivedEvents({receivedEvents ,addEvent, readEvents}:ReceivedEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedFilterData, setSelectedFilterData] = useState<{[key: string]: string}>({});

  const onEventSelect = (event: Event) => {
    setSelectedEvent(event);
    setSelectedFilterData({});
  }

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
    const eventName = `${selectedEvent.section} - ${selectedEvent.elementId}`;
    addEvent(eventName, selectedFilterData);
    readEvents();
  }

  return (
    <div>
      <h3>Received Events</h3>
      <div className='receivedEventsContainer'>
        {receivedEvents.map(event => (
          <div key={event.id || event.elementId} onClick={() => {onEventSelect(event)}} className="receivedEvent">
              { event.id || `${event.eventType} - ${event.elementId}`}
          </div>
        ))}
      </div>
      {selectedEvent && 
        <div> 
          <h3> selected event: {selectedEvent.name} </h3>
          <div className='selectedEventContainer'>
              {Object.entries(selectedEvent).map(([key, value]) => (
                  <label key={key} className="receivedEvent">
                      <input type="checkbox" name={key} checked={!!selectedFilterData[key]} onChange={(e) => onCheckChange(key, value, e.target.checked)}/>
                      {key}: {value}
                  </label>
              ))}
          </div>
          <button onClick={onAddButtonClick}>
            add event
          </button>
        </div>
      }
    </div>
  );
}

export default ReceivedEvents;
