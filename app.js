const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
var session = require('express-session');

const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser')

const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users.routes');
const categoriesRouter = require('./routes/admin/productsCategories.routes');
const apiRouter = require("./routes/api.routes");
const cartsRouter = require("./routes/carts.routes");
const testRouter = require("./routes/test.routes");

// express built in middleware json parser
const app = express();
app.use(express.json());

/// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// cookie parser
app.use(cookieParser());

// cors middleware
app.use(cors())


/// MongoDB Session
app.use(
    session({
        key: 'user_sid',
        secret: 'your secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 14 * 24 * 60 * 60
        }
    })
)

console.log(process.env.NODE_ENV);

if (process.env.NODE === 'development') {
    app.use(morgan('dev'));
}

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).send('Hello ! from the server side')
})

app.use((req, res, next) => {
    console.log('Hello from the middlewars');
    next();
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
})

// routes

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/admin/products/categories', categoriesRouter);
app.use('/api', apiRouter);
app.use('/api/test', testRouter);



module.exports = app;