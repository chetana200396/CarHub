const express = require('express')
const app = express()
const rateLimit = require("express-rate-limit");
const path = require('path');
const search = require("./data/searchCar")

const stat = express.static(__dirname + '/public');
const session = require('express-session');
const configRoutes = require('./routes')
const exphbs = require('express-handlebars')

app.use('/public', stat);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
const fileUpload = require("express-fileupload");
app.use(fileUpload());


const limiter = rateLimit({
    windowMs: 1000,
    max: 10,
});

var map = new Map();

const firstTodo = async() => {
    map = await search.carToOwner(map)
}

exports.map = map
app.use(
    session({
        name: 'AuthCookie',
        secret: "navi dendi",
        saveUninitialized: true,
        resave: false,
        cookie: { maxAge: 900000000 }
    })
);

// Apply to all requests
app.use(limiter);

//Logging middleware
app.use(async(req, res, next) => {
    // console.log(new Date().toUTCString());
    // console.log(req.method);
    // console.log(req.originalUrl);
    if (req.session.userId) {
        console.log("Authenticated User");
    } else {
        console.log("Non-Authenticated User");
    }
    next();
})

//Authentication middleware
app.use('/login/private', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(403).render("login/error", { error: "user is not logged in" });
        return;
    }
})

app.use('/searchCar', async(req, res, next) => {
    if (req.method === 'GET') {
        res.redirect('/')
    } else {
        next();
    }
})

app.use('/landing/*', async(req, res, next) => {
    if (req.session.userId) {
        //call your API
        next();
    } else {
        res.status(403).render("login/error", { error: "user is not logged in" });
        return;
    }
})

app.use('/booking_a_car/*', async(req, res, next) => {
    if (req.session.userId) {
        //call your API
        next();
    } else {
        res.redirect('/login')
        return;
    }
})

app.use('/approveCars', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }
})


app.use('/updateProfile', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }

})

app.use('/askQuestions', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }
})

app.use('/answerQuestions', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }
})


app.use('/myQuestions', async(req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        if (req.method === 'GET') {
            res.redirect('/login')
        } else {
            next();
        }
    }
})


configRoutes(app);
const port = process.env.PORT || 3000
app.listen(port, async() => {
    await firstTodo()
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});