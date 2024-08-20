import type { User } from '../../index'

type LoginProps = {
  sendMessage: (action: string, actionType: string, params: any) => Promise<any>;
  user: User | null;
  setUser: (user: User) => void;
};

export default function Login({sendMessage, user, setUser}: LoginProps) {
  

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