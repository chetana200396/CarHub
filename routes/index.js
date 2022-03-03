const searchCarRoutes = require('./searchCar');
const landingRoutes = require('./landing');
const loginRoutes = require('./loginRoutes/login');
const mycars = require('./myCars');
const myBookings = require('./bookings');
const bookACar = require('./bookACar');
const approveCars = require('./approveCars');
const mapRoute = require('./map');
const updateProfile = require('./updateProfile');
const faqQuestions = require('./faqQuestions');
const askQuestions = require('./askQuestions');
const answerQuestions = require('./answerQuestions');
const myQuestions = require('./myQuestions');
const userProfile = require('./userProfile');
const path = require('path');

const constructorMethod = (app) => {

    app.use('/searchCar', searchCarRoutes);
    app.get('/', landingRoutes);
    app.use('/login', loginRoutes);
    app.use('/myCar', mycars);
    app.use('/myBookings', myBookings);
    app.use('/booking_a_car', bookACar);
    app.use('/approveCars', approveCars);
    app.use('/updateProfile', updateProfile);
    app.use('/userProfile', userProfile);
    app.use('/map', mapRoute);
    app.use('/faqQuestions', faqQuestions);
    app.use('/askQuestions', askQuestions);
    app.use('/answerQuestions', answerQuestions);
    app.use('/myQuestions', myQuestions);

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;