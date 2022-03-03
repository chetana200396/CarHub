const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
let { ObjectId } = require('mongodb');

async function getQuestions(){

    const questionCollection = await questions();
    const getQuestions = await questionCollection.find({status : 'COMPLETED'}).toArray();
    if (getQuestions){
        return getQuestions;
    }else{
        throw `Could not find questions`;
    }
}



module.exports={
    getQuestions
}