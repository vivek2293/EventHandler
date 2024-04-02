const mongoose = require('mongoose');

// Worker Schema for the worker collection
const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('worker', workerSchema);