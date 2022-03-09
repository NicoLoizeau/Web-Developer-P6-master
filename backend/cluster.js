const mongoose = require('mongoose');


///connect to mongoose////
const uri = "mongodb+srv://nico:nC9EMrtMpE6iLq8@cluster0.o7axf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('connection à la base de données'))
    .catch(() => console.log('non connecté à la base de données'))

module.exports = mongoose