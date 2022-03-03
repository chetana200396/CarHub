const mongoCollections=require('../config/mongoCollections');
const users= mongoCollections.users;
const bookings= mongoCollections.bookinigs;
let { ObjectId } = require('mongodb');  
const app = require('../app');

const getUserById= async function getUserById(id){
    if(typeof(id)=='undefined')
    {
        throw 'id parameter must be passed'
    }
    
    if(typeof(id)!='string'){
        throw 'Incorrect data type of id parameter';
    }
    if(!id.replace(/\s/g, '').length)
          {
            throw 'id contains only spaces';
          }
    let parsedId=ObjectId(id);
    const userCollection = await users();
    const user1 = await userCollection.findOne({ _id: parsedId });
    return user1;
}
const updateById= async function updateById(id,car)
{       
    if(typeof(id)=='undefined')
    {
        throw 'id parameter must be passed'
    }
    
    if(typeof(id)!='string'){
        throw 'Incorrect data type of id parameter';
    }
    if(!id.replace(/\s/g, '').length)
          {
            throw 'id contains only spaces';
          }
    
    let parsedId = ObjectId(id);
        const userCollection = await users();
        var carObj = await userCollection.updateOne({ _id: parsedId }, {
            $push: { cars: car }
        })
    if(carObj["modifiedCount"]==1)
    {
        app.map.set(car._id.toString(), id);
        return true;
    }
}
const deleteCar= async function deleteCar(carId,userId)
{   
    if(typeof(carId)=='undefined')
    {
        throw 'carId parameter must be passed'
    }
    
    if(typeof(carId)!='string'){
        throw 'Incorrect data type of carId parameter';
    }
    if(!carId.replace(/\s/g, '').length)
          {
            throw 'carId contains only spaces';
          }
    if(typeof(userId)=='undefined')
    {
        throw 'userId parameter must be passed'
    }
          
    if(typeof(userId)!='string'){
        throw 'Incorrect data type of userId parameter';
    }
    if(!userId.replace(/\s/g, '').length)
    {
        throw 'userId contains only spaces';
    }
    let parsedId = ObjectId(userId);
    let parsedId1 = ObjectId(carId);
    const userCollection = await users();
    const user1 = await userCollection.updateOne({ _id: parsedId }, {
        "$pull": {
            cars: {
                _id: parsedId1
            }
        }
    });
    if (user1["modifiedCount"] == 1) {
        app.map.delete(carId);
        return true;
    }
}

const checkifCarExists= async function checkifCarExists(number){
    if(typeof(number)=='undefined')
    {
        throw 'number parameter must be passed'
    }
          
    if(typeof(number)!='string'){
        throw 'Incorrect data type of number parameter';
    }
    if(!number.replace(/\s/g, '').length)
    {
        throw 'number contains only spaces';
    }
    const userCollection = await users();
    const userList = await userCollection.find({}).toArray();
    for(let i in userList)
    {
        for(let j in userList[i]["cars"])
        {
        if(userList[i]["cars"][j]["number"]==number)
        {
            return true
        }
    }
    }
    return false
}
module.exports={
    getUserById,
    updateById,
    deleteCar,
    checkifCarExists
}