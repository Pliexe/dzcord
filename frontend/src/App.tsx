import React, { useEffect } from 'react';
import './App.css';
import socketIoClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './Pages/Landing/index';

const socket = socketIoClient.io('http://localhost');

function App() {

  useEffect(() => {
    socket.on('globalMessageRecive', () => { console.log('test') });
    socket.connect();
  }, []);

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={() => <Landing socket={socket} />} />
        </Switch>
      </div>
    </Router>
  )
}

export default App;
