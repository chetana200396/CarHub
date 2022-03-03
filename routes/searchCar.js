const express = require('express');
const router = express.Router();
const data = require('../data');
const searchCarData = data.searchcardata;
const xss = require('xss');

router.post('/', async(req, res) => {

    let title = "Search a car";
    const reqBody = xss(req.body.sourceAddress);
    let role = req.session.role;
    let user = req.session.user;
    let admin = null;
    if (role) {
        admin = false;
    } else {
        admin = true;
    }

    if (!req.session.userId) {
        admin = true;
    }

    let sourceAddress = reqBody;
    //Call data funtion to search the cars
    try {
        if (!sourceAddress) {
            throw `Invalid City!`;
        } else if (sourceAddress.trim().length == 0) {
            throw `source address cannot be empty!`;
        }

        //Check sourceAddress, fromDate, toDate are provided or not
        let error = checkArgumentProvided(sourceAddress);
        if (error !== undefined) {
            throw error;
        }

        //If sourceAddress, fromDate, toDate are not strings or are empty strings, the method should throw.
        let error1 = checkArgumentIsString(sourceAddress);
        if (error1 !== undefined) {
            throw error1;
        }

        //Check string is empty or not - sourceAddress, fromDate, toDate
        let error2 = checkArgumentIsNullOrEmpty(sourceAddress);
        if (error2 !== undefined) {
            throw error2;
        }

        const carData = await searchCarData.searchResults(sourceAddress);
        if (req.session.userId) {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: true,
                user,
                role,
                admin,
                title: "Search a car"
            });
        } else {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: false,
                admin,
                title: "Search a car"
            });
        }

    } catch (e) {
        let errors = []
        errors.push(e)
        if (req.session.userId) {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: true,
                errors,
                hasErrors: true,
                user,
                role,
                admin,
                title: "Search a car"
            });
        } else {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: false,
                errors,
                hasErrors: true,
                admin,
                title: "Search a car"
            });
        }
    }
});

router.post('/filters', async(req, res) => {

    let role = req.session.role;
    let user = req.session.user;

    let admin = null;
    if (role) {
        admin = false;
    } else {
        admin = true;
    }

    if (!req.session.userId) {
        admin = true;
    }

    const sourceAddress = xss(req.body.sourceAddress)
    const brandName = xss(req.body.brandName)
    const capacity = xss(req.body.capacity)
    const low_rate = xss(req.body.low_rate)
    const high_rate = xss(req.body.high_rate)
    const zip = xss(req.body.zip)
    const fromDate = xss(req.body.fromDate)
    const toDate = xss(req.body.toDate)
    try {
        if (sourceAddress) {
            if (sourceAddress.trim().length == 0) {
                throw `source address cannot be empty!`;
            }
        }

        if (brandName) {
            if (brandName.trim().length == 0) {
                throw `brand name cannot be empty!`;
            }
        }

        if (zip) {
            if (zip.trim().length == 0) {
                throw `zip cannot be empty!`;
            } else if (zip.length < 5) {
                throw `give a valid zip!`;
            }
        }

        if (capacity) {
            if (capacity == '' || parseInt(capacity) <= 0) {
                errors.push(`Invalid capacity!`);
            }
        }

        if (low_rate) {
            if (parseInt(low_rate) <= 0) {
                throw `Invalid low rate!`;
            }
        }
        if (high_rate || low_rate) {
            if (!low_rate || !high_rate) {
                throw `Have to provide both High and Low Rates!`;
            }
        }

        if (high_rate) {
            if (parseInt(high_rate) < parseInt(low_rate)) {
                throw `Invalid high rate!`;
            }
        }
        if (zip) {
            if (zip.trim().length == 0) {
                throw `zip cannot be empty!`;
            } else if (zip.length < 5) {
                throw `give a valid zip!`;
            }
        }

        if (fromDate && toDate) {
            const startdata_array = fromDate.split('-');
            const enddate_array = toDate.split('-');
            const startdate = (new Date(parseInt(startdata_array[0]), parseInt(startdata_array[1]) - 1, parseInt(startdata_array[2]))).getTime()
            const enddate = (new Date(parseInt(enddate_array[0]), parseInt(enddate_array[1]) - 1, parseInt(enddate_array[2]))).getTime()
            const currDate = (new Date()).getTime();
            if (enddate < startdate) {
                throw `End date cannot be less than start date!`;
            } else if (startdate < currDate && currDate - startdate > 86400000) {
                throw `start date cannot be less than current date!`;
            }
        } else if (fromDate || toDate) {
            throw `Provide Both start and end dates`
        }

        const carData = await searchCarData.searchByFilter(sourceAddress, brandName, capacity, low_rate, high_rate, zip, fromDate, toDate);
        if (req.session.userId) {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: true,
                user,
                role,
                admin,
                title: "Search a car"
            });
        } else {
            res.render('searchResults/index', {
                carData,
                sourceAddress,
                loginUser: false,
                admin,
                title: "Search a car"
            });
        }
    } catch (e) {
        let errors = []
        errors.push(e)
        if (req.session.userId) {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: true,
                errors,
                hasErrors: true,
                user,
                role,
                admin,
                title: "Search a car"
            });
        } else {
            res.render('searchResults/index', {
                sourceAddress,
                loginUser: false,
                errors,
                hasErrors: true,
                admin,
                title: "Search a car"
            });
        }
    }
})




function checkArgumentProvided(sourceAddress) {
    if (!sourceAddress) {
        throw new Error("Source Address parameter is not provided");
    }

}

function checkArgumentIsString(sourceAddress) {
    if (!(typeof sourceAddress == 'string')) {
        throw new Error("Source Address parameter is not string type");
    }

}

function checkArgumentIsNullOrEmpty(sourceAddress) {
    if (sourceAddress == null || sourceAddress.trim() === '') {
        throw new Error("Source Address parameter is empty");
    }

}

module.exports = router;