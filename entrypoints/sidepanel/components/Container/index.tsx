import { useState } from 'react';
import Login from './components/Login'
import EventsEdit from './components/EventsEdit'
import './Container.css'

export type User = {
  email: string;
}

const Components = {
  login: Login,
  eventEdit: EventsEdit
}

const Container = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeComponent, setActiveComponent] = useState<keyof typeof Components>('login');

  const ChildComponent = user ?  Components.eventEdit : Components.login

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
      {/* <div className="containerTab">
        <button onClick={() => {onButtonClick('login')}} className="tab"> Login Component </button>
        <button onClick={() => {onButtonClick('eventEdit')}} className="tab"> Events Edit Container </button>
      </div> */}
      {/* <ChildComponent sendMessage={sendMessage} user={user} setUser={setUser}/> */}
      {user ? <EventsEdit sendMessage={sendMessage} user={user} setUser={setUser}/> : <Login sendMessage={sendMessage} user={user} setUser={setUser}/>}
      <p> user: {user?.email} </p>
    </div>
  );
}

export default Container