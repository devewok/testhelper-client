import {useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import Admin from './components/Admin.js';
import Test from './components/Test.js';
import './App.css';

function App() {
  const [path] = useState(window.location.pathname)
  const [socket, setSocket] = useState(null)
  const [uid, setUid] = useState()
  const generateUID = () => {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    let uid = firstPart + secondPart
    setUid(uid)
  }
  useEffect(() => {
    const newSocket = io("wss://testhelper-server.herokuapp.com/", {transports: ['websocket'], path: "/api/"})
    // const newSocket = io("http://localhost:5000", {transports: ['websocket'], path: "/api/"})
    generateUID()
    setSocket(newSocket)
    return () => newSocket.close()
  }, [setSocket])
  useEffect(() => {
    const ssuid = sessionStorage.getItem("uid")
    if (!ssuid)
      localStorage.clear()
  })
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
        : <WaitingForSocket><Test uid={uid} socket={socket} /></WaitingForSocket>}
    </div>
  );
}

export default App;
