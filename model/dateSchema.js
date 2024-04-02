const mongoose = require('mongoose');

// Date Schema for the storing booking dates and the status of workers
const DateSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true
    },
    hoursData: {
        type: Map
    }
});

module.exports = mongoose.model('data', DateSchema);