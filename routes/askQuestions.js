const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');
const app = require('../app');
const askQuestionsData = require('../data/askQuestions')
const xss = require('xss');

router.get('/', async (req, res) => {
    let errors = [];
    let hasErrors = false; 
    title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;
    let user = req.session.user;
    try {
        if(userId){
            res.render('carHub/askQuestions', {title , role ,loginUser: true, user});
            return;
        } else {
            res.render('carHub/landing');
            return;
        }
    } catch (e) {
        res.status(404);
        errors.push(e);
        res.render('carHub/askQuestions', {errors , hasErrors : true, title ,role ,loginUser: true ,user});
    }
});

router.post('/', async (req, res) => {
    let errors = [];
    let messages = [];
    let hasErrors = false;
    let isMessage = false;

    title = "Ask Questions";
    let userId = req.session.userId;
    let role =  req.session.role;
    let user = req.session.user;

    if(!userId){
        res.render('carHub/landing');
        return;
    }


    try {
    let question = xss(req.body.question);
    if(!question){
        throw 'Question is not provided, Request you to provide question';
    }
    
    if (question == null || question.trim() === ''){
        throw 'Question can not be empty';
    }

    if(typeof question!=='string'){
        throw 'Question is not String type';
    }
    
    const addQuestion = await askQuestionsData.addQuestion(question,userId);

    if(!userId){
        res.render('carHub/askQuestions', {loginUser: false});
        return;
    }

    if(addQuestion.questionUpdated){
        messages.push("Question has been sent to admin, Wait for reply");
        res.render('carHub/askQuestions', {isMessage : true, messages, title, role ,loginUser: true, user});
        return;
    }
    } catch (e) {
        res.status(404);
        errors.push(e);
        res.render('carHub/askQuestions', {errors , hasErrors : true, title , role ,loginUser: true, user});
    }
});

module.exports = router;

