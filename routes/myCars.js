const express = require('express');
const router = express.Router();
const myCars = require("../data/myCars")
const getBookings = require("../data/getBookings")
let { ObjectId } = require('mongodb');
const xss = require("xss");
const app = require('../app');
router.get('/', async(req, res) => {
    try {
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        const a = req.session.userId;
        const user1 = await myCars.getUserById(a);
        for (let i in user1["cars"]) {
            user1["cars"][i]["_id"] = user1["cars"][i]["_id"].toString();
        }
        var user2 = []; //pending
        var user3 = []; //approved
        for (let j in user1["cars"]) {
            if (user1["cars"][j]["status"] == "PENDING") {
                user2.push(user1["cars"][j]);
            }
            if (user1["cars"][j]["status"] == "APPROVED") {
                user3.push(user1["cars"][j]);
            }
        }
        res.render('mycars/cars', { pending: user2, approved: user3, hasErrors: false, loginUser: true, user: req.session.user, role: req.session.role, title: "My Cars" });
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.status(404).render('mycars/cars', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "My Cars" });
    }
});
router.get('/addCar', async(req, res) => {

    let role = req.session.role;
    try {
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        let user = req.session.user;
        res.render('mycars/addCar', { hasErrors: false, loginUser: true, user: user, role: role, title: "Add Car" });
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.status(404).render('mycars/addCar', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "Add Car" });
    }
});
router.post('/addCar', async(req, res) => {
    try {
        let errors = [];
        let brand_name = xss(req.body.brand_name);
        let color = xss(req.body.color);
        let number = xss(req.body.number);
        let capacity = xss(req.body.capacity);
        let rate = xss(req.body.rate);

        const upload_File = req.files.upload_File;

        if (!brand_name) {
            errors.push('Brand Name must be entered');
        }
        if (!color) {
            errors.push('Color must be entered');
        }
        if (!number) {
            errors.push('Car number must be entered');
        }
        if (!capacity) {
            errors.push('Capacity must be entered');
        }
        if (!rate) {
            errors.push('Rate must be entered');
        }
        if (typeof(brand_name) != 'string') {
            errors.push('Invalid data type of Brand Name');
        }
        if (typeof(color) != 'string') {
            errors.push('Invalid data type of Color');
        }
        if (typeof(number) != 'string') {
            errors.push('Invalid data type of Number');
        }
        if (typeof(capacity) != 'string') {
            errors.push('Invalid data type of Capacity');
        }
        if (typeof(rate) != 'string') {
            errors.push('Invalid data type of Rate');
        }
        if (typeof(parseInt(capacity)) != 'number') {
            errors.push('Invalid format of capacity');
        }
        if (typeof(parseInt(rate)) != 'number') {
            errors.push('Invalid format of capacity');
        }
        if (!brand_name.replace(/\s/g, '').length) {
            errors.push('Brand Name contains only spaces');
        }
        if (!color.replace(/\s/g, '').length) {
            errors.push('Color contains only spaces');
        }
        if (!number.replace(/\s/g, '').length) {
            errors.push('Number contains only spaces');
        }
        if (!number.match("^[a-zA-Z0-9]*$")) {
            errors.push('Car Number must only contain alpha-numeric characters');
        }
        if (number.length != 6) {
            errors.push('Car Number must contain exactly 6 alpha-numeric characters');
        }
        const result = await myCars.checkifCarExists(number);
        if (result) {
            errors.push("There already exists a car registered with that number");
        } else {
            //upload file
            if (!(req.files) && !(Object.keys(req.files).length !== 0)) {
                errors.push('No file uploaded');
            }
            if (!upload_File) {
                errors.push('Request you to upload file');
            }

            let fileName = number;
            const uploadPath = __dirname + "/uploads/" + fileName + ".pdf";
            // To save the file using mv() function
            upload_File.mv(uploadPath, function(err) {
                if (err) {
                    res.send("Failed !!");
                } else {
                    console.log("file uplaoded success")
                }
            });

            if (errors.length > 0) {
                res.status(404).render('mycars/addCar', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "Add Car" }); //role,title
                return;
            }
            let rest3 = {
                _id: ObjectId(),
                brandName: brand_name,
                color: color,
                number: number,
                capacity: parseInt(capacity),
                rate: parseInt(rate),
                status: "PENDING",
                filename: uploadPath
            }
            const b = req.session.userId;
            var carObj = await myCars.updateById(b, rest3);
            if (carObj) {
                res.redirect('/myCar');
            }
        }
    } catch (e) {
        let errors = [];
        errors.push(e)
        res.status(404).render('mycars/addCar', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "Add Car" });
    }
});
router.get('/MyRequests/:id', async(req, res) => {
    let errors = [];
    try {
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        const id1 = xss(req.params.id);
        if (!isNaN(Number(id1))) {
            errors.push('Invalid ID Data Type');
        }
        var p = encodeURIComponent(id1);
        if (p.includes("%20") == true) {
            errors.push('ID contains spaces');
        }
        if (errors.length > 0) {
            res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" })
        }
        const t = req.session.userId;
        const req1 = await getBookings.pendingByCarId(id1, t)
        for (let i in req1) {
            req1[i]["_id"] = req1[i]["_id"].toString();
            req1[i]["userId"] = req1[i]["userId"].toString();
            const user2 = await myCars.getUserById(req1[i]["userId"]);
            req1[i]["firstName"] = user2["firstName"];
            req1[i]["lastName"] = user2["lastName"];
            req1[i]["phoneNumber"] = user2["phoneNumber"];
        }

        res.render('request/requests', { data: req1, loginUser: true, hasErrors: false, user: req.session.user, role: req.session.role, title: "My Requests" })
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" })

    }
});
router.get('/MyRequests/:id/:id1/approved', async(req, res) => {
    try {
        let errors = [];
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        const id3 = xss(req.params.id1);
        if (!isNaN(Number(id3))) {
            errors.push('Invalid ID Data Type');
        }
        var p = encodeURIComponent(id3);
        if (p.includes("%20") == true) {
            errors.push('ID contains spaces');
        }
        if (errors.length > 0) {
            res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" })
        }
        var bookObj = await getBookings.updateById(id3)
        if (bookObj) {
            var book1 = await getBookings.getById(id3);
            var st = book1["car"]["startdate"];
            var et = book1["car"]["enddate"];
            var book = [];
            var st1;
            var et1;
            var bookObj1;
            book1["car"]["_id"] = book1["car"]["_id"].toString();
            book = await getBookings.getpendingByCarId(book1["car"]["_id"]);
            for (let i in book) {
                st1 = book[i]["car"]["startdate"];
                et1 = book[i]["car"]["enddate"];
                if ((st1 >= st) && (et1 <= et)) {
                    bookObj1 = await getBookings.updateRejectedById(book[i]["_id"]);
                } else if ((st1 <= st) && (et1 >= st)) {
                    bookObj1 = await getBookings.updateRejectedById(book[i]["_id"]);
                } else if ((st1 <= et) && (et1 >= et)) {
                    bookObj1 = await getBookings.updateRejectedById(book[i]["_id"]);
                }
            }
            res.redirect('/myCar');
        }
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" })
    }
});
router.get('/MyRequests/:id/rejected', async(req, res) => {
    try {
        let errors = [];
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        const id4 = xss(req.params.id);
        if (!isNaN(Number(id4))) {
            errors.push('Invalid ID Data Type');
        }
        var p = encodeURIComponent(id4);
        if (p.includes("%20") == true) {
            errors.push('ID contains spaces');
        }
        if (errors.length > 0) {
            res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" })
        }
        let parsedId = ObjectId(id4);
        var bookObj = await getBookings.updateRejectedById(parsedId);
        if (bookObj) {
            res.redirect('/myCar');
        }
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.render('request/requests', { errors: errors, loginUser: true, hasErrors: true, user: req.session.user, role: req.session.role, title: "My Requests" });
    }
});
router.get('/deleteCar/:id', async(req, res) => {
    try {
        let errors = [];
        if (!req.session.userId) {
            res.redirect("/login");
            return;
        }
        const b = req.session.userId
        const ownerId = await app.map.get(xss(req.params.id))
        if (b == ownerId) {
            const c = xss(req.params.id);
            if (!isNaN(Number(c))) {
                errors.push('Invalid ID Data Type');
            }
            var p = encodeURIComponent(c);
            if (p.includes("%20") == true) {
                errors.push('ID contains spaces');
            }
            const user1 = await myCars.deleteCar(c, b);
            if (user1) {
                getBookings.deletePending(c);
            }
            res.redirect('/myCar');
        } else {
            errors.push('CarId does not belong to the user logged in')
        }
        if (errors.length > 0) {
            res.status(404).render('mycars/cars', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "My Cars" });
        }
    } catch (e) {
        let errors = [];
        errors.push(e);
        res.status(404).render('mycars/cars', { errors: errors, hasErrors: true, loginUser: true, user: req.session.user, role: req.session.role, title: "My Cars" });
    }
});
module.exports = router;