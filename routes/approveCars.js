const express = require('express');
const router = express.Router();
const data = require('../data');
const approveCarsData = data.approvecarsdata;
const xss = require('xss');

const e = require('express');

router.get('/', async(req, res) => {
    let errors = [];
    let hasErrors = false;

    let user = req.session.user;
    let role = req.session.role;

    const title = "Approve car";
    try {
        const carArray = await approveCarsData.getPendingCars();
        if (carArray.length === 0) {
            errors.push("Data is not available");
            res.render('mycars/carApprove', { errors, hasErrors: true, title,role, loginUser: true, user});
            return;
        }

        res.render('mycars/carApprove', {title, carArray : carArray, role, loginUser: true, user});
    } catch (e) {
        res.status(404);
        errors.push(e.message);
        res.render('mycars/carApprove', { errors: errors, hasErrors: true, title ,role , loginUser: true, user});
    }
});


router.post('/:id', async(req, res) => {
    let errors = [];
    let hasErrors = false;
    let user = req.session.user;

    try {
        const { Approved, Rejected , Download} = req.body;
        
        const id = xss(req.params.id);
        let adminEmailAddress = req.session.emailAddress;

        //Check that the Id is provided or not
        if (!id) {
            throw "Id parameter is not provided";
        }

        //Check that Id is string type or not
        if (!(typeof id == 'string')) {
            throw "Id parameter is not string type";
        }

        //Check that Id is not empty
        if (id == null || id.trim() === '') {
            throw "Id parameter is empty";
        }

        //Check format for Id
        if ((/\s/).test(id)) {
            throw "Id parameter contains spaces";
        }

        //Id length should be equal to
        if (id.length !== 24) {
            throw "Username parameter is less than 4 character length";
        }

        let buttonClicked = null;
        if(Approved == ''){
            buttonClicked = "APPROVED";
        }else if(Rejected == ''){
            buttonClicked = "REJECTED";
        }else if(Download == ''){
            const carArray = await approveCarsData.getPendingCars();
            if (carArray.length === 0) {
                errors.push("Data is not available");
                res.render('mycars/carApprove', { loginUser: true, errors: errors, hasErrors: true, user: user ,role : req.session.role});
                return;
            }
    
            for(const element of carArray){
                    if(element._id.toString() === id){
                        let fileName = element.filename;
                        res.download(fileName , function (err) {
                            if (err) {
                              console.log(err);
                              throw err;
                            }
                        });
                        return;
                }
            }
        }else{
            errors.push("Invalid Id");
            res.status(404);
            res.render('mycars/carApprove', { errors: errors, hasErrors: true, user: user,role : req.session.role });
            return;
        }

        const carArray = await approveCarsData.approveOrRejectCar(id, buttonClicked,adminEmailAddress);
        if (carArray.length === 0) {
            errors.push("Data is not available");
            res.render('mycars/carApprove', { loginUser: true, errors: errors, hasErrors: true, user: user ,role : req.session.role});
            return;
        }
        res.render('mycars/carApprove', { loginUser: true, carArray: carArray, user: user ,role : req.session.role});
    } catch (e) {
        errors.push(e);
        res.status(404);
        res.render('mycars/carApprove', { errors: errors, hasErrors: true, user: user ,role : req.session.role});
    }
});

module.exports = router;