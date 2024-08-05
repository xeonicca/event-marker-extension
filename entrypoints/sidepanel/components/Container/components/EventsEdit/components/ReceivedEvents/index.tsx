import { useState, useEffect } from 'react';

export type Event = {
    [key: string]: string;
};

type ReceivedEventsProps = {
  addEvent: (name: string, data: {[key:string]:string}) => void;
  readEvents: () => void;
};

type Message = {
    type: string;
    data: any;
  }

function ReceivedEvents({addEvent, readEvents}:ReceivedEventsProps) {
  const [receivedEvents, setReceivedEvents] = useState<Event[]>([]);
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
    addEvent(selectedEvent.elementId, selectedFilterData);
    readEvents();
  }

  useEffect(() => {
    const handleMessage = (message: Message) => {
      if(message.type === 'at-event-from-content') {
        console.log('Message received in the sidepanel:', message.data)
        setReceivedEvents((prevEvents) => [...prevEvents, message.data]);
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return (
    <div>
      <h3>Selected Events</h3>
      <div>
        {receivedEvents.map(event => (
          <div key={event.elementId} onClick={() => {onEventSelect(event)}} className="eventItem">
              {event.elementId}
          </div>
        ))}
      </div>
      {selectedEvent && 
        <div> 
          <p> selected event: {selectedEvent.name} </p>
          <div>
              {Object.entries(selectedEvent).map(([key, value]) => (
                  <label key={key}>
                      <input type="checkbox" name={key} onChange={(e) => onCheckChange(key, value, e.target.checked)}/>
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
