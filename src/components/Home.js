import React, {useContext} from 'react';
import './../App.css';
import { Fab, Icon } from '@material-ui/core';
import Header from './Header';
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';



function Home() {
    const {dispatch } = useContext(StoreContext)

    const handleOpen = () =>{
        dispatch({type: StoreActions.CREATE_NEW})
    }
    return (
        <div className="App">
            <Header />
            <Fab onClick={handleOpen} style={{ backgroundColor: '#1976d2', position: 'absolute', right: '30px', bottom: '15px' }} color='primary' aria-label='add'>
                <Icon>
                addicon
                </Icon>
            </Fab>
        </div>
    );
}


export default Home;
