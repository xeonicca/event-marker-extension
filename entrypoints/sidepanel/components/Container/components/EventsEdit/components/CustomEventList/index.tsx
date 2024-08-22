import type { EventCriteria } from '../../index'
import { useState } from 'react';
import './CustomEventList.css'

type CustomEventListProps = {
  events: EventCriteria[];
  deleteEvent: (id: string) => void;
  readEvents: () => void;
};

export type Event = {
  [key: string]: string;
};

export default function CustomEventList({events, deleteEvent, readEvents }: CustomEventListProps) {
  const [selectedEvent, setSelectedEvent] = useState<EventCriteria | null>(null);

  const onEventClick = (event: EventCriteria) => {
    setSelectedEvent(event);
  }

  const onDeleteCLick = (id: string) => {
    deleteEvent(id);
    readEvents();
  }

  return (
    <div>
      <h3>Custom Event List</h3>
      {events.map((event) => (
        <div key={event.eventName} className='eventItem'>
          <p className='eventName' onClick={() => {onEventClick(event)}}>{event.eventName}</p>
          <button onClick={() => {onDeleteCLick(event.id)}}>
            delete event  
          </button>
        </div>
      ))}

      {selectedEvent && 
        <div> 
          <h3> selected event: {selectedEvent.eventName} </h3>
          <p> description: {selectedEvent.description} </p>
          <p> author: {selectedEvent.userEmail} </p>
          <div className='selectedEventContainer'>
              <p> track-section: {selectedEvent.trackSection} </p>
              <p> eventType: {selectedEvent.eventType} </p>
              {selectedEvent.trackId && <p> trackId: {selectedEvent.trackId} </p>}
              {selectedEvent.attributes && Object.entries(selectedEvent.attributes).map(([key, value]) => (
                  <p key={key}>
                      {key}: {value}
                  </p>
              ))}
          </div>
        </div>
      }
    </div>
  );
}