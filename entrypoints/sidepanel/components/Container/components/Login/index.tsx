import { useState } from 'react';

type LoginProps = {
  sendMessage: (action: string, actionType: string, params: any) => Promise<any>;
};

type User = {
  email: string;
}

export default function Login({sendMessage}: LoginProps) {
  const [user, setUser] = useState<User | null>(null)

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