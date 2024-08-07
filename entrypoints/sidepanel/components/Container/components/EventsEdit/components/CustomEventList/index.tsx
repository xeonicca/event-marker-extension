type CustomEventListProps = {
  events: Event[];
  deleteEvent: (id: string) => void;
  readEvents: () => void;
};

export type Event = {
  [key: string]: string;
};

export default function CustomEventList({events, deleteEvent, readEvents }: CustomEventListProps) {

  const onDeleteCLick = (id: string) => {
    deleteEvent(id);
    readEvents();
  }

  return (
    <div>
      {events.map((event, index) => (
        <div>
          <p key={index}>{event.id}</p>
          <button onClick={() => {onDeleteCLick(event.id)}}>
            delete event  
          </button>
        </div>
      ))}
    </div>
  );
}