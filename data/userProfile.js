const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const {ObjectId} = require('mongodb');

async function getUser(userId){
    
    const userCollection = await users();

    const user = await userCollection.findOne( {_id : ObjectId(userId)});

    if (!user){
        throw `Could not found`;
    }  

    return user;
}

module.exports = {
    getUser
};