const express = require('express');
const router = express.Router();
const faqQuestionsData = require('../data/faqQuestions')

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let title = "FAQ";
    let userId = req.session.userId;
    let user = req.session.user;
    let role =  req.session.role;
    try {
        const questions = await faqQuestionsData.getQuestions();
        if(userId){
            res.render('carHub/faq', {title , questions, role ,loginUser: true , user, role});
            return;
        }else{
            res.render('carHub/faq', {title , questions, role ,loginUser: false });
            return;
        }
    } catch (e) {
        res.status(404);
        errors.push(e);
        if(userId){
            res.render('carHub/faq', {errors , hasErrors : true, title,loginUser: true, user, role});
            return;
        }else{
            res.render('carHub/faq', {errors , hasErrors : true, title,loginUser: false});
        }
    }
});

module.exports = router;