const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
let { ObjectId } = require('mongodb');

async function getQuestions(userId){

    const questionCollection = await questions();
    // status : 'COMPLETED' ,
    const getQuestions = await questionCollection.find({userId : userId}).toArray();
    if (getQuestions.length !== 0){
        return getQuestions;
    }else{
        throw `Could not find questions`;
    }
}



module.exports={
    getQuestions
}