var db = require('../config/connection');
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
// module.exports={
//     doSignup:(userData)=>{
//         return new Promise(async(resolve,reject)=>{
//             userData.Password=await bcrypt.hash(userData.Password,10)
//             db.get().collection(collection.USER_COLLECTION).insertOne.then((response)=>{
//             //    resolve(data.insertedId)
//                  resolve(userData)
//             })

//         })

//     }
// }
// module.exports = {
//     doSignup: (userData) => {
//       return new Promise(async (resolve, reject) => {
//         userData.password = await bcrypt.hash(userData.password, 10);
//         db.get()
//           .collection(collection.USER_COLLECTION)
//           .insertOne(userData)
//           .then((response) => {
//             resolve(response.insertedId);
//           })
//           .catch((err) => {
//             reject(err);
//           });
//       });
//     },

// module.exports = {
//   doSignup: (userData) => {
//     return new Promise(async (resolve, reject) => {
//       if (!userData || Object.keys(userData).length === 0) {
//         reject('Request body is missing');

//       } else if (!userData.password) {
//         reject('Password is missing');
//       } else {
//         userData.password = await bcrypt.hash(userData.password, 10);
//         db.get()
//           .collection(collection.USER_COLLECTION)
//           .insertOne(userData)
//           .then((response) => {
//             resolve(response.insertedId);
//           });
//       }
//     });
//   },

module.exports = {
doSignup: (userData) => {
  return new Promise(async (resolve, reject) => {
    if (!userData || Object.keys(userData).length === 0) {
      reject('Request body is missing');
    } else if (!userData.password) {
      reject('Password is missing') ;
    } else {
      // Check if the email already exists in the database
      const user = await db.get()
        .collection(collection.USER_COLLECTION)
        .findOne({ Email: userData.Email });
      if (user) {
        reject('Email already exists');
      } else {
        userData.password = await bcrypt.hash(userData.password, 10);
        db.get()
          .collection(collection.USER_COLLECTION)
          .insertOne(userData)
          .then((response) => {
            resolve(response.insertedId);
          });
      }
    };
  });
},

  //login helper
  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let response = {};
      let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email });
      if (user) {
        bcrypt.compare(userData.password, user.password).then((status) => {
          if (status) {
            console.log("login success");
            response.status = true;
            response.user = user;
            resolve(response);
          } else {
            console.log("login failed");
            response.status = false;
            resolve(response);
          }
        });
      } else {
        console.log("login failed");
        response.status = false;
        resolve(response);
      }
    });
  }

};