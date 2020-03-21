import React, { useContext } from 'react'
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import { Fab, Icon } from '@material-ui/core';

const NewTaskFab = () => {
    const { state, dispatch } = useContext(StoreContext)

    const handleOpen = () => {
        dispatch({ type: StoreActions.CREATE_NEW })
    }

    return (
        <>{state.loggedIn && 
        <Fab onClick={handleOpen} style={{ backgroundColor: '#1976d2', position: 'absolute', right: '30px', bottom: '15px' }} color='primary' aria-label='add'>
            <Icon>
                addicon
            </Icon>
        </Fab>}
        </>)
}

export default NewTaskFab