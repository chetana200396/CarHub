const express = require('express');
const router = express.Router();
const getBookings = require('../data/getBookings')
const app = require('../app');
const searchData = require('../data/searchCar')
const xss = require('xss');
let { ObjectId } = require('mongodb');

router.get('/', async(req, res) => {
    try {
        let title = "Book a car";
        let user = req.session.user;
        let role = req.session.role;
        let userId = req.session.userId;
        const booking1 = await getBookings.getAllByUserId(userId);
        res.render('booking/bookings', {title, data: booking1, loginUser: true, user , role})
    } catch (e) {
        res.render('booking/bookings', {errors: [e], hasErrors: true, title, data: booking1, loginUser: true, user , role})
    }
});
router.post('/:id', async(req, res) => {
    let user = req.session.user;
    let role = req.session.role;
    try {
        let title = "Book a car";
        const fromDate = xss(req.body.fromDate)
        const toDate = xss(req.body.toDate)
        const carId = xss(req.params.id)
        const myId = req.session.userId
    

        if (fromDate && toDate) {
            let startdata = fromDate.split('-');
            let endd = toDate.split('-');
            let std = (new Date(parseInt(startdata[0]), parseInt(startdata[1]) - 1, parseInt(startdata[2]))).getTime()
            let end = (new Date(parseInt(endd[0]), parseInt(endd[1]) - 1, parseInt(endd[2]))).getTime()
            let currDate = (new Date()).getTime();
            if (end < std) {
                throw `End date cannot be less than start date!`;
            } else if (std < currDate && currDate - std > 86400000) {
                console.log('here')
                throw `start date cannot be less than current date!`;
            }
        } else if (fromDate || toDate) {
            throw `Provide Both start and end dates`
        }

        if (!myId) {
            throw `Please login`;
        } else if (!carId) {
            throw `Please Select A Car`;
        }

        if (!ObjectId.isValid(myId)) {
            throw `Please login`;
        } else if (!ObjectId.isValid(carId)) {
            throw `Please Select A Car`;
        }

        await getBookings.newBooking(fromDate, toDate, carId, myId);
        res.redirect('/myBookings')
    } catch (e) {
        const ownerId = await app.map.get(xss(req.params.id))
        const data = await searchData.getCar_Person(ownerId, xss(req.params.id))
        const car = {
            firstName: data[0].firstName,
            lastName: data[0].lastName,
            email: data[0].email,
            phoneNumber: data[0].phoneNumber,
            address: data[0].address,
            brandName: data[0].cars[0].brandName,
            color: data[0].cars[0].color,
            number: data[0].cars[0].number,
            status: data[0].cars[0].status,
            rate: data[0].cars[0].rate,
            capacity: data[0].cars[0].capacity,
            carId: req.params.id
        }
        res.render('bookACar/index', { loginUser: true, car, errors: [e], hasErrors: true , loginUser: true, user , role})
    }
})
module.exports = router;