const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_URI, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', () => {
    console.log('Error on database connection');
});

db.once('open', () => {
    console.log('Successfully connected to the database!');
});


module.export = {mongoose};