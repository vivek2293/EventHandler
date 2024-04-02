const mongoose = require('mongoose');

// Appointment Schema for the appointment collection used during allotment of workers
const appointmentSchema = new mongoose.Schema({
    worker_id: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: Number,
        required: true
    }
});


module.exports = mongoose.model('appointment', appointmentSchema);