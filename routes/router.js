const express = require('express');
const router = express.Router();

const { getWorkers, createWorker } = require('../functions/workerfn');
const { getAppointments } = require('../functions/appointmentfn');
const { getDates, updateHourlyData, workerstatus, workerStatusByTime } = require('../functions/datafn');

router.get('/', (req, res) => {
    res.send('Hello!');
});


// Get all workers or create a new worker
router.get('/workers', getWorkers);
router.post('/createWorker', createWorker);
router.get('/appointments', getAppointments);
router.get('/dates', getDates);

// Mark or unmark a worker as booked or free for a particular time
router.post('/updateHourlyData', updateHourlyData);

// Get the status of a worker for a particular date
router.post('/workerstatus', workerstatus);

// Get the status of all workers for a particular date and time
router.post('/workerStatusByTime', workerStatusByTime);

module.exports = router;