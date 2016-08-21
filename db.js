var mongoose = require('mongoose');

mongoose.createConnection('mongodb://localhost:27017/twist');

module.exports = mongoose.connection;