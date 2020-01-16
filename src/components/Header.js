import React, { useState, useEffect } from 'react';
import firebase from 'firebase'

import db from '../db';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Icon, Avatar } from '@material-ui/core';

const styles = () => ({
    root: {
        display: 'flex',
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
    button: {
        color: '#FFF !important',
    }
})


const Header = ({ classes }) => {
    const [userData, setUserData] = useState({})
    // Returns the signed-in user's profile Pic URL.
    const getProfilePicUrl = () => {
        return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
    }

    // Returns the signed-in user's display name.
    const getUserName = () => {
        return firebase.auth().currentUser.displayName;
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

    useEffect(() => {
        db.auth().onAuthStateChanged((user) => {
            if (user) {
                var profilePicUrl = getProfilePicUrl();
                var userName = getUserName();
                setUserData({
                    profilePicUrl,
                    userName
                })
            } else {
                setUserData({})
            }
        })

    }, [])

    return (
        <header className={classes.root}>

            <div className={classes.container}>
                <Icon >style</Icon>
                <h3>&nbsp; My to-do's</h3>
            </div>

            <div id="user-container" className={classes.container}>
                {!!userData.userName ? 
                <> 
                    <Button className={classes.container}>
                        <Avatar alt={userData.userName} src={userData.profilePicUrl}>&nbsp;</Avatar>
                        <span id="user-name" style={{fontWeight:500}}>{userData.userName}&nbsp;</span>
                    </Button>
                    <Button onClick={signOut} className={classes.button}>
                        Sign-out
                    </Button> 
                </> :
                <Button onClick={() => signIn()} className={classes.button}>
                    <Icon >fingerprint</Icon> &nbsp; Sign-in with Google
                </Button>}
            </div>
        </header>
    )
}

export default withStyles(styles)(Header)