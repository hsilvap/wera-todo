import React, { useContext } from 'react';
import firebase from 'firebase'

import db from '../db';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { Icon, Avatar } from '@material-ui/core';
import { StoreContext } from '../context/store';
import { StoreActions } from '../context/reducer';
import { green } from '@material-ui/core/colors';

const styles = () => ({
    root: {
        display: 'flex',
        height: 62,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexShrink: '0',
        backgroundColor: '#0288d1 !important',
        alignItems: 'center',
        color: '#FFF !important',
        boxShadow: '0 2px 2px 0 rgba(0,0,0,.14), 0 3px 1px -2px rgba(0,0,0,.2), 0 1px 5px 0 rgba(0,0,0,.12)'
    },
    container: {
        display: 'flex',
        alignItems: 'center'
    },
    usernameContainer:{
        paddingBottom: 6
    },
    button: {
        color: '#FFF !important',
    },
    colorPrimary:{
        color: 'green'
    }
})

const CustomSwitch = withStyles({
    switchBase: {
      color: 'white',
      '&$checked': {
        color: 'white',
      },
      '&$checked + $track': {
        backgroundColor: green['A200'],
      },
    },
    checked: {},
    track: {},
  })(Switch);
  

const Header = ({ classes }) => {
    const {state, dispatch} = useContext(StoreContext);
    const handleOpen = () => {
        dispatch({type: StoreActions.CREATE_NEW})
    };

    const handleToggle = () =>{
        const completed = !state.showCompleted 
        dispatch({type: StoreActions.TOGGLE_COMPLETED, data: completed })
    }

    const saveMessagingDeviceToken = () => {
        firebase.messaging().getToken().then(function (currentToken) {
            if (currentToken) {
                console.log('Got FCM device token:', currentToken);
                // Saving the Device Token to the datastore.
                firebase.firestore().collection('fcmTokens').doc(currentToken)
                    .set({ uid: firebase.auth().currentUser.uid });
            } else {
                // Need to request permissions to show notifications.
                requestNotificationsPermissions();
            }
        }).catch(function (error) {
            console.error('Unable to get messaging token.', error);
        });
    }

    const requestNotificationsPermissions = () => {
        console.log('Requesting notifications permission...');
        firebase.messaging().requestPermission().then(function () {
            // Notification permission granted.
            saveMessagingDeviceToken();
        }).catch(function (error) {
            console.error('Unable to get permission to notify.', error);
        });
    }

    const signIn = () => {
        var provider = new firebase.auth.GoogleAuthProvider();
        db.auth().signInWithPopup(provider);
    }
    const signOut = () => {
        db.auth().signOut();
    }


    return (
        <>
        <header className={classes.root}>
            <div className={classes.container}>
                <Icon >style</Icon>
                <h3>&nbsp; My to-do's</h3>
            </div>

            <div id="user-container" className={classes.container}>
                {!!state.loggedIn ?
                <>
                    <div  className={`${classes.container} ${classes.usernameContainer}`} >
                        <Avatar alt={state.user.userName} src={state.user.profilePicUrl}/>&nbsp;
                        <span id="user-name" style={{fontWeight:500}}>{state.user.userName}&nbsp;</span>
                    </div>

                    <Button onClick={handleOpen} className={classes.button}>
                        <Icon >addbox</Icon> &nbsp; Add new &nbsp; 
                    </Button>
                    <FormControlLabel 
                    control={
                        <CustomSwitch
                        className={classes.colorPrimary}
                        checked={state.showCompleted}
                        onChange={()=> handleToggle()}
                        value={state.showCompleted}
                        color="primary"
                        />
                        } 
                    label="Show completed" />
                    <Button onClick={signOut} className={classes.button}>
                        Sign-out
                    </Button>
                </> :
                <Button onClick={() => signIn()} className={classes.button}>
                    <Icon >fingerprint</Icon> &nbsp; Sign-in with Google
                </Button>}
            </div>
        </header>
        </>
    )
}

export default withStyles(styles)(Header)