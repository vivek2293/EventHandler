const appointment = require('../model/appointmentSchema');

const getAppointments = async (req, res) => {
    try {
        const appointments = await appointment.find();
        res.status(200).json(appointments);
    }
    catch(error) {
        console.log(error)
        res.status(404).json({ message: error.message });
    }
};

module.exports = { getAppointments };