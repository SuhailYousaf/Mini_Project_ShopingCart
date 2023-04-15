const db = require('../config/connection');
const collection = require('../config/collections');
const ObjectId = require('mongodb-legacy').ObjectId;

module.exports = {
    adminLogin: (adminDetail) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            const admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminDetail.email });
            if (admin) {
                if (admin.password === adminDetail.password && admin.email === adminDetail.email) {
                    response.admin = admin;
                    resolve(response);
                } else {
                    response.status = "Invalid Password";
                    resolve(response)
                }
            } else {
                response.status = "Invalid Email";
                response.passErr = "Invalid Password";
                resolve(response)
            }
        })
    },

    getUsers: () => {
        return new Promise(async (resolve, reject) => {
            const users = await db.get().collection(collection.USER_COLLECTION).find().toArray();
            resolve(users);
        });
    },

    editUser: (userId, data) => {
        return new Promise((resolve, reject) => {
            userId = new ObjectId(userId)
            db.get().collection(collection.USER_COLLECTION)
                .updateOne(
                    {
                        _id: userId
                    },
                    {
                        $set: {
                            Username: data.name,
                            Email: data.email,
                            // mobile: data.mobile,
                            // password: data.password
                        }
                    }
                )
                .then((response) => {
                    console.log(response);
                    resolve();
                })
                .catch((err) => {
                    console.log(err);
                    reject();
                })
        })
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            console.log("api call")
            db.get().collection(collection.USER_COLLECTION)
                .deleteOne(
                    {
                        _id: new ObjectId(userId)
                    }
                )
                .then((response) => {
                    resolve();
                })
                .catch((err) => {
                    reject();
                })
        })
    },

    searchUser: (search) => {
        return new Promise(async (resolve, reject) => {
            const userData = await db.get().collection(collection.USER_COLLECTION).find({
                Username: { $regex: new RegExp(search) }
            }).toArray()
                .then((users) => {
                    resolve(users)
                })
                .catch(() => {
                    console.log('errr');
                    reject()
                })
        })
    }

}