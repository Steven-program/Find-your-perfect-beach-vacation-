import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import Location from './Location';
import Input from './Input';
import Results from './results';


function App() {
  return (
    <div className="App">
        <h1 id='title'>Find your perfect beach vacation!</h1>
        <Input />
        <Location />
      </div>
  );
}

export default App;
