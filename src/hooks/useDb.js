import { useContext, useEffect } from 'react'
import moment from 'moment'

import { StoreContext } from '../context/store'
import { StoreActions } from '../context/reducer'
import db, {
  mondayCollectionRef,
  getCurrentUser,
  taskCollectionRef,
  tuesdayCollectionRef,
  wednesdayCollectionRef,
  thursdayCollectionRef,
  fridayCollectionRef
} from '../db'

export function LoadMondayTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        query = mondayCollectionRef(getCurrentUser().uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          querySnapshot.forEach(function (doc) {
            tasks.push({ ...doc.data(), uid: doc.id })
          })
          dispatch({ type: StoreActions.SET_MONDAY, data: tasks })
        })
      }
    })
    return () => query
  }, [dispatch])
}

export function LoadTuesdayTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        query = tuesdayCollectionRef(getCurrentUser().uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          querySnapshot.forEach(function (doc) {
            tasks.push({ ...doc.data(), uid: doc.id })
          })
          dispatch({ type: StoreActions.SET_TUESDAY, data: tasks })
        })
      }
    })
    return () => query
  }, [dispatch])
}

export function LoadWednesdayTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        query = wednesdayCollectionRef(getCurrentUser().uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          querySnapshot.forEach(function (doc) {
            tasks.push({ ...doc.data(), uid: doc.id })
          })
          dispatch({ type: StoreActions.SET_WEDNESDAY, data: tasks })
        })
      }
    })
    return () => query
  }, [dispatch])
}

export function LoadThursdayTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        query = thursdayCollectionRef(getCurrentUser().uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          querySnapshot.forEach(function (doc) {
            tasks.push({ ...doc.data(), uid: doc.id })
          })
          dispatch({ type: StoreActions.SET_THURSDAY, data: tasks })
        })
      }
    })
    return () => query
  }, [dispatch])
}

export function LoadFridayTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        query = fridayCollectionRef(getCurrentUser().uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          querySnapshot.forEach(function (doc) {
            tasks.push({ ...doc.data(), uid: doc.id })
          })
          dispatch({ type: StoreActions.SET_FRIDAY, data: tasks })
        })
      }
    })
    return () => query
  }, [dispatch])
}

export function LoadTasks () {
  const { dispatch } = useContext(StoreContext)

  useEffect(() => {
    var query
    db.auth().onAuthStateChanged(user => {
      if (user) {
        const profilePicUrl =
          getCurrentUser().photoURL || '/images/profile_placeholder.png'
        const userName = getCurrentUser().displayName
        const uid = getCurrentUser().uid

        query = taskCollectionRef(uid)
        query.onSnapshot(function (querySnapshot) {
          const tasks = []
          const completedTasks = []
          querySnapshot.forEach(function (doc) {
            if (doc.data().complete === false) {
              const dateType = typeof doc.data().dueDate
              const dateObj = moment(
                dateType === 'string'
                  ? doc.data().dueDate
                  : doc.data().dueDate.toDate()
              )
              tasks.push({ ...doc.data(), uid: doc.id, dateObj })
            } else {
              const dateType = typeof doc.data().dueDate
              const dateObj = moment(
                dateType === 'string'
                  ? doc.data().dueDate
                  : doc.data().dueDate.toDate()
              )
              completedTasks.push({ ...doc.data(), uid: doc.id, dateObj })
            }
          })
          dispatch({
            type: StoreActions.LOGIN,
            data: {
              loggedIn: true,
              user: { profilePicUrl, userName, uid },
              toDos: tasks.sort((a, b) => a.dateObj - b.dateObj),
              completedToDos: completedTasks
            }
          })
        })
      } else {
        dispatch({ type: StoreActions.LOGOUT })
      }
    })
    return () => query
  }, [dispatch])
}
