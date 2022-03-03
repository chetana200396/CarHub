const mongoCollections = require('../config/mongoCollections');
const bookings = mongoCollections.bookings;
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('./searchCar')
const questions = mongoCollections.questions;
const users = mongoCollections.users;
const email = require('../data/sendEmail')


async function addQuestion(question,userId){

    if(!question){
        throw 'Question is not provided, Request you to provide question';
    }
    
    if (question == null || question.trim() === ''){
        throw 'Question can not be empty';
    }

    if(typeof question!=='string'){
        throw 'Question is not String type';
    }

    const quest = {
        userId : userId,
        question : question,
        status : 'PENDING'
    };

    const questionCollection = await questions();
    const updateQuestions = await questionCollection.insertOne(quest);
    if (updateQuestions.acknowledged){

    const userCollection = await users();
    let arr = await userCollection.find({"_id" : ObjectId(userId)}).toArray();
    if (arr === null)  {
        throw "Data is not available";
    }

    let senderEmail = arr[0].email;
        let subject = 'FAQ';
        let html = `<h1> ${senderEmail} added one new question : Question is "${question}"</h1>`;
        await email.sendEmail(senderEmail,"CarCS546Hub@gmail.com",subject,html);
        return {questionUpdated: true};
    }else{
        throw `Could not update question`;
    }
}


module.exports={
    addQuestion
}