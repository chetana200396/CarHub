const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;
    let title = "Landing Page";
    let user = req.session.user;
    let role = req.session.role;

    try {
        if (req.session.userId) {
            res.render('carHub/landing', { title: title, loginUser: true, user, role });
        } else {
            res.render('carHub/landing', { title: title, loginUser: false });
            return;
        }
    } catch (e) {
        if (req.session.userId) {
            errors.push(e);
            res.status(404).render('carHub/landing', { errors, hasErrors: true, loginUser: true, user, role });
            return;
        } else {
            errors.push(e);
            res.status(404).render('carHub/landing', { errors, hasErrors: true, loginUser: false });
        }
    }
});

module.exports = router;