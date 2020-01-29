import React from 'react';
import './App.css';
import Header from './components/Header';
import { Fab, Icon } from '@material-ui/core';



function App() {
  return (
    <div className="App">
      <Header />
      <Fab style={{backgroundColor: '#1976d2', position:'absolute', right:'30px', bottom:'15px'}} color='primary' aria-label='add'>
        <Icon>
          addicon
        </Icon>
      </Fab> 
    </div>
  );
}

export default App;
