const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');



var API_KEY = "R8kKWErJ8hVpxH9b1QnZZsONFHrKbMPKyKoXPdws"; // Your Firebase Cloud Messaging Server API key
admin.initializeApp();


// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({ original: original }).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// Listen for any change on document `leave_check` in collection `users`
exports.sendNotification_studentLeave = functions.firestore
  .document('Leave/{leave_check}')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newLeave = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

    // access a particular field as you would any JS property
    const name = newLeave.student_name;
    console.log(newLeave.student_name);
    // This registration token comes from the client FCM SDKs.
    // student app token
    var registrationToken = 'f-U826PDj3o:APA91bEEQpUniEaT5gcbNxLlvkwydB9b5NA4EL41_qVNKzbg6kh4tTvowVYs4RDR4JHEXOSVx4tThDkktGCdpYhFHIej9o2Yk2LJ6mT4S0LyTOebupq-2jSGM7AhDs_XxMN_c-rtE8hn';
    var student_registrationToken = newLeave.student_registrationToken;

    //teacher app token      


    // Notification details.
    const payload = {
      notification: {
        title: '請假清單',
        body: `${newLeave.student_name} 您有一筆假單，已被審核。`
      }
    };

    // Set the message as high priority and have it expire after 24 hours.
    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };


    return admin.messaging().sendToDevice(student_registrationToken, payload, options)
      .then(function (response) {
        return console.log("Successfully sent message:", response);
      })
      .catch(function (error) {
        return console.log("Error sending message:", error);
      });

  });

exports.newLeave = functions.firestore
  .document('Leave/{leave_check}')
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newLeave = snap.data();



    // perform desired operations ...
    // access a particular field as you would any JS property
    const teacher_email = newLeave.teacher_email;
    console.log(newLeave.teacher_email);
    // This registration token comes from the client FCM SDKs.

    //teacher app token
    // const teacher_registrationToken = "ffZYAc8lMX8:APA91bHm51L_neMSw3nQaNyhgdmyhJsPvI5oV1N-rYCO4FfbHXohliskZXjIGlx73-eKJpx39kXJ7dkj3yciuxGvg9ueFtB-aazO0fwZWVr84Wjbw7HOh9AunooM4vzrS9KgLvPHxePh";
    var teacher_registrationToken = "";


    // Notification details.
    const payload = {
      notification: {
        title: '請假清單',
        body: `您有一筆假單，需要審核。`
      }
    };

    // Set the message as high priority and have it expire after 24 hours.
    var options = {
      priority: "high",
      timeToLive: 60 * 60 * 24
    };
    console.log(context);


    var db = admin.firestore();
    // Create a reference to the cities collection
    var teachersRef = db.collection('Teacher');
    // Create a query against the collection
    var queryRef = teachersRef.where('teacher_email', '==', teacher_email);

    return getDoc = queryRef.get()
      .then(snapshot => {
        return snapshot.forEach(doc => {
          // send(doc.data().teacher_registrationToken, payload, options);
          return admin.messaging().sendToDevice(doc.data().teacher_registrationToken, payload, options)
            .then(function (response) {
              return console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
              return console.log("Error sending message:", error);
            });
        });
      })
      .catch(err => {
        return console.log('Error getting documents', err);
      });

  });

// exports.groupNotification = functions.firestore
//   .document('Class/{group_state_go}')
//   .onUpdate((change, context) => {
//     // Get an object representing the document
//     // e.g. {'name': 'Marie', 'age': 66}
//     const newClass = change.after.data();

//     // ...or the previous value before this update
//     const previousValue = change.before.data();

//     // access a particular field as you would any JS property
//     const group_state = newClass.group_state;
//     const group_state_go = newClass.group_state_go;
//     const arr_student_id = newClass.student_id;

//     // Notification details.
//     const payload = {
//       notification: {
//         title: '小組分組',
//         body: `目前有課程正在進行小組分組!`
//       }
//     };

//     // Set the message as high priority and have it expire after 24 hours.
//     const options = {
//       priority: "high",
//       timeToLive: 60 * 60 * 24
//     };

    

//     if (group_state === false && group_state_go === true) {
      
//       var student_registrationTokenList = [];
//       var getDoc;
      
//      arr_student_id.forEach(function (student_id) {

//         var db = admin.firestore();
//         // Create a reference to the cities collection
//         var teachersRef = db.collection('Student');
//         // Create a query against the collection
//         var queryRef = teachersRef.where('student_id', '==', student_id);

//         queryRef.get()
//           .then(snapshot => {
//             snapshot.forEach(doc => {
//               // send(doc.data().teacher_registrationToken, payload, options);
           
//               this.student_registrationTokenList.push(doc.data().student_registrationToken);

//             });
//             return admin.messaging().sendToDevice(getDoc.student_registrationTokenList, payload, options)
//             .then(function (response) {
//               return console.log("Successfully sent message:", response);
//             })
//             .catch(function (error) {
//               return console.log("Error sending message:", error);
//             });
      
//           })
//           .catch(err => {
//            return console.log('Error getting documents', err);
//           });

//       });

     

//     }
//     // perform desired operations ...
//   });



