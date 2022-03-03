const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;
const xss = require('xss');

router.get('/', async(req, res) => {
    if (req.session.userId) {
        res.render('map/index', { loginUser: true, user: req.session.user, role: req.session.role })
    } else {
        res.render('map/index', { loginUser: false })
    }
})
router.post('/car', async(req, res) => {
    try {
        if (req.body.sourceAddress.length == 0 || req.body.sourceAddress.trim().length == 0) {
            throw 'Enter a Valid City';
        }
        const carData = await searchCarData.searchResults(xss(req.body.sourceAddress));
        res.send(carData)
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
})

module.exports = router;