const express = require('express');
const router = express.Router();
const myQuestionsData = require('../data/myQuestions')

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let title = "My Questions";
    let userId = req.session.userId;
    let user = req.session.user;
    let role = req.session.role;

    try {
        if (userId) {
            const questions = await myQuestionsData.getQuestions(userId);
            res.render('carHub/myQuestions', { title, questions, role, loginUser: true, user });
            return;
        } else {
            res.render('carHub/landing');
            return;
        }

    } catch (e) {
        res.status(404);
        errors.push(e);
        res.render('carHub/myQuestions', { errors, hasErrors: true, title, loginUser: true, user ,role });
    }
});

module.exports = router;