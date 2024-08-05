import { useState, useEffect } from 'react';

export default function Login({sendMessage}) {
  const [user, setUser] = useState(null)

  const doLogin = async () => {
    const res = await sendMessage('login', 'auth', null)
    if (res.error) {
      console.error(res.error)
      return
    }
    setUser(res.user)
  }

  return (
    <>
      <div className="card">
        <p>Login as { user?.email }</p>
        <button onClick={doLogin}>
          Login
        </button>
      </div>
    </>
  );
}