'use strict'


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotification = functions.database.ref('/notifications/{receiver_user_id}/{notification_id}')
    .onWrite((data, context) => {
        const receiver_user_id = context.params.receiver_user_id;
        const notification_id = context.params.notification_id;


        console.log('We have a notification to send to :', receiver_user_id);


        if (!data.after.val()) {
            console.log('A notification has been deleted :', notification_id);
            return null;
        }

        const DeviceToken = admin.database().ref(`/users/${receiver_user_id}/token`).once('value');

        return DeviceToken.then(result => {
            const token_id = result.val();

            const payload =
                {
                    notification:
                        {
                            title: "New Chat Request",
                            body: `you have a new Chat Request, Please Check.`,
                            icon: "https://firebasestorage.googleapis.com/v0/b/saiedmathapp-50194.appspot.com/o/profile_images%2FIMG-20180122-WA0033.jpg?alt=media&token=c3b6a835-d6a4-4222-a94d-b970f7c87556"
                        }
                };

            return admin.messaging().sendToDevice(token_id, payload)
                .then(response => {
                    console.log('This was a notification feature.');
                });
        });
    });
