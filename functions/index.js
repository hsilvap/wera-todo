const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
sgMail.setApiKey("your/sendgrid/apikey");
admin.initializeApp();

const priorities = [
    {
        value: 0,
        label: 'Low',
    },
    {
        value: 1,
        label: 'Medium',
    },
    {
        value: 2,
        label: 'High',
    },
    {
        value: 3,
        label: 'Urgent',
    },
    {
        value: 4,
        label: 'Critical',
    },
];


exports.scheduledEmailReminder = functions.pubsub.schedule('45 9 * * 1-5')
    .timeZone('America/Mexico_City')
    .onRun((context) => {


        var db = admin.firestore();
        var tasksRef = db.collection('tasks');
        var date = moment().add(2, 'd').startOf('day')
        var dateLimit = moment().add(3, 'd').endOf('day')

        return tasksRef.get()
            .then(snapshot => {
                let users = [];
                snapshot.forEach(doc => {
                    users.push(doc.id);
                })

                return users.forEach(uid => {
                    db.collection('tasks').doc(uid)
                        .collection('todo')
                        .where('complete', '==', false)
                        .where('dueDate', '>', date)
                        .where('dueDate','<',dateLimit)
                        .orderBy("dueDate", "asc").get().then((querySnapshot) => {
                            let tasklist = [];
                            querySnapshot.forEach(function (snap) {
                                const taskData = snap.data();
                                const priorityLabel = priorities.find(x => x.value === taskData.priority).label;
                                const taskMailData = `Task name <i> ${taskData.title} </i> with priority <strong> ${priorityLabel}</strong>`
                                tasklist.push(taskMailData);
                            });

                            if (tasklist.length === 0) {
                                return
                            }

                            return admin.auth().getUser(uid)
                                .then(function (userRecord) {
                                    // See the UserRecord reference doc for the contents of userRecord.
                                    const usermail = userRecord.toJSON().email;
                                    const msg = {
                                        to: usermail,
                                        from: 'reminder@wera-todo.firebaseapp.com',
                                        subject: 'Your task summary for the next 2 days',
                                        html: `<h3>Hello ${userRecord.toJSON().displayName}!</h3> You have <strong>${tasklist.length}</strong> pending tasks, they are due date the next 2 days. 
                                        <ul>
                                            ${tasklist.map(task => `<li> ${task} </li>`).join('')}
                                        </ul>
                                        `,
                                    };
                                    return sgMail
                                        .send(msg)
                                        .then(() => { return 'Email sent' }).catch((error) => console.log(error));

                                })
                                .catch(function (error) {
                                    console.log('Error fetching user data:', error);
                                });
                        }).catch(error => console.log(error))
                })
            }).catch(error => console.log(error));
    });
