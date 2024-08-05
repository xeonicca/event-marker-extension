import { useState, FunctionComponent, createElement } from 'react';
import Login from './components/Login'
import EventsEdit from './components/EventsEdit'

const Components = {
  login: Login,
  eventEdit: EventsEdit
}

const Container = () => {
  const [activeComponent, setActiveComponent] = useState<keyof typeof Components>('login');

  const ChildComponent = Components[activeComponent];

  const onButtonClick = (component: string) => {
    setActiveComponent(component as keyof typeof Components);
  };

  function sendMessage(action, actionType, params) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, actionType, params }).then(response => {
        console.dir(response)
        resolve(response)
      });
    })
  }

  return (
    <div>
      <button onClick={() => {onButtonClick('login')}}> Login Component </button>
      <button onClick={() => {onButtonClick('eventEdit')}}> Events Edit Container </button>
      <div>
        <ChildComponent sendMessage={sendMessage}/>
      </div>
    </div>
  );
}

export default Container