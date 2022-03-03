const express = require('express');
const router = express.Router();
const userProfile = require('../data/userProfile')

router.get('/', async(req, res) => {
    try {

        let title = "User Profile";
        let user = req.session.user;
        let role = req.session.role;

        let userId = req.session.userId;
        if(userId){
            const profile = await userProfile.getUser(userId);
            res.status(400).render('login/userProfile', {title, profile : profile, role, loginUser : true ,user});    
            return;
        }else{
            res.render('carHub/landing');
            return;
        }
    } catch (error) {
        res.status(400).render('login/userProfile', { error: error });
    }
});

module.exports = router;