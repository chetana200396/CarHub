const express = require('express');
const router = express.Router();
const data = require('../data');
const updateprofiledata = data.updateprofiledata;
const e = require('express');
const xss = require('xss');

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let title = "Update Profile";
    let user = req.session.user;
    let role = req.session.role;
    try {
    if(user){
        const response = await updateprofiledata.getRegisteredUser(user);
            res.render('login/updateProfile.handlebars', { title, loginUser: true, user ,role , response : response});
            return;
    }else{
        res.render('carHub/landing');
        return;
    }
  }catch (e) {
        errors.push(e);
        res.render('login/updateProfile.handlebars', { title, errors, hasErrors: true, user ,role ,loginUser: true});
    }
});

router.post('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;
    let user = req.session.user;
    let messages = [];
    let isMessage = false;
    let role = req.session.role;
    let title = "Update Profile";

    try {
        let age = xss(req.body.age).toLowerCase();
        let phoneNumber = xss(req.body.phoneNumber).toLowerCase();
        let houseNumber = xss(req.body.houseNumber).toLowerCase();
        let street = xss(req.body.street).toLowerCase();
        let city = xss(req.body.city).toLowerCase();
        let state = xss(req.body.state).toLowerCase();
        let zip = xss(req.body.zip).toLowerCase();

        //Required Fields
        if(!age){
            throw `Age is required!`;
        }
        if(!phoneNumber){
            throw `Phone Number is required!`;
        }
        if(!houseNumber){
            throw `House Number is required!`;
        }
        if(!street){
            throw `Street is required`;
        }
        if(!city){
            throw `City is required!`;
        }
        if(!state){
            throw `State is required!`;
        }
        if(!zip){
            throw `Zip is required!`;
        }
       
        age = parseInt(age);
        if(age < 18){
            throw `You're below 18, sorry!`;
        }

        if(phoneNumber.length < 10){
            throw `Invalid phone number!`;
        }else if(!/^\d+$/.test(phoneNumber)){
            throw 'Invalid phone number!';
        }

        const response = await updateprofiledata.getRegisteredUser(user);
        const resp = await updateprofiledata.checkPassword(response, age, phoneNumber, houseNumber, street,city,state,zip);

        if(resp.userUpdated){
            messages.push("User Updated Successfully");
            res.status(200).render('login/updateProfile.handlebars', {title, isMessage : true , messages , loginUser: true, user ,role });
        }
    } catch (e) {
        errors.push(e);
        res.status(200).render('login/updateProfile.handlebars', {hasErrors : true , errors, title, loginUser: true, user ,role});
    }    
});

module.exports = router;