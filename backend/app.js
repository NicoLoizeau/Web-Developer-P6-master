const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user')
const sauceRoutes = require('./routes/sauce')

const app = express();
//const sauce = require('./modelSauce')

///connect to mongoose////
const uri = "mongodb+srv://nico:nC9EMrtMpE6iLq8@cluster0.o7axf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connection à la base de données'))
    .catch(() => console.log('non connecté à la base de données'))

app.use(express.json());

////// CORS accept cross-orrigin//////
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;