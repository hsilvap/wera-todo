import React, { useContext } from 'react';
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const NotificationSnack = () => {
    const { state, dispatch } = useContext(StoreContext);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        dispatch({ type: StoreActions.HIDE_NOTIFICATION })
    };


    return <Snackbar
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        open={state.showNotification}
        autoHideDuration={2000}
        onClose={handleClose}
        message={state.notification}
        action={
            <React.Fragment>
                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </React.Fragment>
        }
    />
}

export default NotificationSnack