const mongoCollections = require('../config/mongoCollections');
const questions = mongoCollections.questions;
let { ObjectId } = require('mongodb');
const users = mongoCollections.users;
const email = require('../data/sendEmail')

async function getQuestions(){

    try{
        const questionCollection = await questions();
        const getQuestions = await questionCollection.find({status : 'PENDING'}).toArray();
        return getQuestions;
    }catch(e){
        throw `Internal Server Error`;
   }
}

async function getQuestionsById(id){

    try{
        const questionCollection = await questions();
        const res = await questionCollection.findOne( {_id : ObjectId(id)});
        return res;
    }catch(e){
        throw `Internal Server Error`;
   }
}

async function addAnswer(answer,id){

    if(!answer){
        throw `Cannot Update question`;
    }

    if (answer == null || answer.trim() === ''){
        throw `Answer cannot be empty`;
    }

    if(typeof answer !=='string'){
        throw `Answer is not String type`;
    }

    const quest = {
        answer : answer,
        status : 'COMPLETED'
    };

    const questionCollection = await questions();
    let updateUser = await questionCollection.updateOne({ _id: ObjectId(id)},
        { $set:  quest });

        if (updateUser.modifiedCount !== 1){
            throw `Could not update question`;
        }  

    const res = await questionCollection.findOne( {_id : ObjectId(id)});
    console.log(res.userId);
    if (!res){
        throw `Could not find question`;
    }  

    const userCollection = await users();
    const res1 = await userCollection.findOne({_id : ObjectId(res.userId)});

    if (res1 === null)  {
        throw "Data is not available";
    }

    let recieveremail = res1.email;

        let subject = 'FAQ : Answer Question';
        let html = `<h1> Admin answered question : Answer is "${answer}"</h1>`;
        await email.sendEmail("CarCS546Hub@gmail.com",recieveremail,subject,html);
        return {questionUpdated: true};

}


module.exports={
    getQuestions,
    getQuestionsById,
    addAnswer
}