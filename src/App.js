import React from 'react';
import './App.css';
import { StoreProvider } from './context/store';
import Home from './components/Home';


const App = ()=> (
  <StoreProvider>
    <Home/>
  </StoreProvider>
);


export default App;
