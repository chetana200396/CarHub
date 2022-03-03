const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

async function getRegisteredUser(user){
try {    
    const collection = await users();
    const res = await collection.findOne( {email: user});
        if(!res){
            throw `User not found`;
        }else{
            return res;
        }
    }
    catch (e) {
        throw new Error(e);
    }
}

async function checkPassword(response, age, phoneNumber, houseNumber, street
    ,city,state,zip){

    const dataToUpdate = {};

    dataToUpdate['age'] = age;
    dataToUpdate['phoneNumber'] = phoneNumber;

    const address = {};
    address['number'] = houseNumber;
    address["street"] = street;
    address["city"] = city;
    address["state"] = state;
    address["zip"] = zip;
    dataToUpdate["address"] = address;


    const userCollection = await users();

    var updateUser = await userCollection.updateOne({ _id:  response._id},
       { $set:  dataToUpdate });
    
    if (updateUser.insertedCount === 0){
        throw `Could not update user`;
    }  

    return {userUpdated: true};
}

    module.exports = {
        getRegisteredUser,
        checkPassword
    };