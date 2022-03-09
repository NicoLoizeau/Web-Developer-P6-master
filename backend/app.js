const express = require('express');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const bodyParser = require('body-parser');

const app = express();
//const sauce = require('./modelSauce')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))


////// CORS accept cross-orrigin//////
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;