const express = require('express');
const router = express.Router();
let { ObjectId } = require('mongodb');
const app = require('../app');
const searchData = require('../data/searchCar')
const xss = require('xss');

router.get('/', async (req, res) => {
    res.redirect('/')
})

router.get('/:id', async(req, res) => {
    try {
        let role= req.session.role;
        let user= req.session.user;
        const ownerId = await app.map.get(xss(req.params.id))
        if (ownerId === undefined || !ownerId) {
            throw "Car not found"
        }
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
        res.render('bookACar/index', { loginUser: true, car,role,user })
        return;
    } catch (e) {
        res.redirect('/')
        return
    }
});


module.exports = router;