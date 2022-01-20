import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Admin from './components/Admin.js';
import Test from './components/Test.js';
import './App.css';

function App() {
  const [path] = useState(window.location.pathname)
  const [socket, setSocket] = useState(null)
  useEffect(() => {
    const newSocket = io("https://testhelper-server.herokuapp.com")
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket])
  const WaitingForSocket = ({children}) => {
    if (socket)
      return children
    else
      return <h1>Conectando</h1>
  }
  return (
    <div className="App">
      {path === "/godmode"
        ? <WaitingForSocket><Admin socket={socket} /></WaitingForSocket>
        : <WaitingForSocket><Test socket={socket} /></WaitingForSocket>}
    </div>
  );
}

export default App;
