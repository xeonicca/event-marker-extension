import { useState } from 'react';
import Login from './components/Login'
import EventsEdit from './components/EventsEdit'
import './Container.css'

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

  function sendMessage(action: string, actionType: string, params: any) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action, actionType, params }).then(response => {
        console.dir(response)
        resolve(response)
      });
    })
  }

  return (
    <div className='container'>
      <div className="containerTab">
        <button onClick={() => {onButtonClick('login')}} className="tab"> Login Component </button>
        <button onClick={() => {onButtonClick('eventEdit')}} className="tab"> Events Edit Container </button>
      </div>
      <ChildComponent sendMessage={sendMessage}/>
    </div>
  );
}

export default Container