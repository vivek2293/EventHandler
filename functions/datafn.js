const data = require('../model/dateSchema');
const appointment = require('../model/appointmentSchema');
const worker = require('../model/workerSchema');
const mongoose = require('mongoose');

const createAppointment = async (worker_id, date, time) => {
    try {
        const newDoc = await appointment.create( {worker_id, date, time} ); 
        return newDoc;
    }
    catch(error) {
        console.error({ message: error.message });
        return ;
    }
}

const getDates = async (req, res) => {
    try {
        const dates = await data.find();
        res.status(200).json(dates);
    }
    catch(error) {
        res.status(404).json({ message: error.message });
    }
};

const updateHourlyData = async (req, res) => {
    const { date, worker_id, reset, hour } = req.body;
    try {
        // check if ID is valid mongoose string
        if (!mongoose.isValidObjectId(worker_id)) {
            res.status(400).json({ message: 'Invalid worker ID format' });
            return;
        }
        
        // check if worker_id is valid
        const workerData = await worker.findById({ _id: worker_id });
        if (!workerData) {
            res.status(404).json({ message: 'Worker not found' });
            return;
        }

        // if there is not a document for the date, create one
        let document = await data.findOne({ date });
        if (!document) {
            document = new data({ date, hoursData: new Map() });
        }

        // if worker is not present create one
        if (!document.hoursData.has(worker_id)) {
            const newData = new Array(24).fill('');
            document.hoursData.set(worker_id, newData);
        }

        // if reset is true, delete the apointment given to the specific worker for the specific hour
        if(reset === 1){
            let hourData = JSON.parse(JSON.stringify(document.hoursData.get(worker_id)));
            if(!(hourData[hour].length > 0)){
                res.status(409).json({ message: 'Appointment does not exist' });
                return;
            }

            await appointment.findByIdAndDelete(hourData[hour]);
            hourData[hour] = '';
            document.hoursData.set(worker_id, hourData);
        }
        else{ // create an appointment for the specific worker for the specific hour
            let hourData = JSON.parse(JSON.stringify(document.hoursData.get(worker_id)));
            if(hourData[hour].length > 0){
                res.status(409).json({ message: 'Appointment already exists' });
                return;
            }

            const result = await createAppointment(worker_id, date, hour);
            hourData[hour] = result._id;
            document.hoursData.set(worker_id, hourData);
        }

        // update the document
        await document.save();
        res.status(200).json({ message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ error: 'Error updating data' });
    }
};

const workerstatus = async(req, res) => {
    const { worker_id, date } = req.body;
    try {
        // check if ID is valid mongoose string
        if (!mongoose.isValidObjectId(worker_id)) {
            res.status(400).json({ message: 'Invalid worker ID format' });
            return;
        }
        
        // check if worker_id is valid
        const workerData = await worker.findById({ _id: worker_id });
        if (!workerData) {
            res.status(404).json({ message: 'Worker not found' });
            return;
        }

        let document = await data.findOne({ date });
        let arr = [];

        // if there is no document for the date, return all hours as free
        if (!document) {
            arr.push(['0 to 23']);
            res.status(200).json({"name:": workerData.name, "freetime": arr});
            return;
        }

        // if worker is not present, then all hours are free
        if (!document.hoursData.has(worker_id)) {
            arr.push(['0 to 23']);
            res.status(200).json({"name:": workerData.name, "freetime": arr});
            return;
        }

        // Simple logic for concatenating the free hours
        let hourData = JSON.parse(JSON.stringify(document.hoursData.get(worker_id)));
        let flag = 0, initial = 0, final = 0;
        for(let i = 0; i < 24; i++){
            if(hourData[i].length === 0 && flag === 0){
                flag = 1;
                initial = i;
            }

            if(hourData[i].length > 0 && flag === 1){
                flag = 0;
                final = i - 1;
                arr.push([`${initial} to ${final}`]);
            }
        }

        if(flag === 1){
            arr.push([`${initial} to 23`]);
        }

        res.status(200).json({"name:": workerData.name, "freetime": arr});
    }
    catch(error) {
        res.status(404).json({ message: error.message });
    }
}

const workerStatusByTime = async (req, res) => {
    const { date, time } = req.body;
    try {
        const allWorkers = await worker.find();
        let document = await data.findOne({ date });

        // if there is no document for the date, return all workers as free
        if(!document){
            const free_workers = allWorkers.map(worker => {
                return {
                    worker_id: worker.worker_id,
                    name: worker.name,
                    email: worker.email,
                    contact: worker.contact
                }
            });
            res.status(200).json({ "free_workers": free_workers, "occupied_workers": [] });
            return;
        }

        // get all the workerID who have even a single hour occupied on the given date and filter them out according to the given time
        const occupiedWorkersID = Array.from(document.hoursData.keys()).filter(worker_id => document.hoursData.get(worker_id)[time] !== '');
        const occupiedWorkers = [];
        
        // using allWorkers and occupiedWorkersID, filter out the free workers and the occupied workers
        const freeWorkers = allWorkers.map(worker => {
            return {
                worker_id: worker._id.toString(),
                name: worker.name,
                email: worker.email,
                contact: worker.contact
            }
        }).filter(worker => {
            const failed = occupiedWorkersID.some(ID => ID === worker.worker_id);
            if (failed) {
                occupiedWorkers.push(worker);
            }
            
            return !failed;
        });

        res.status(200).json({ "free_workers": freeWorkers, "occupied_workers": occupiedWorkers });
    }
    catch(error) {
        res.status(404).json({ message: error.message });
    }
};


module.exports = { getDates, updateHourlyData, workerstatus, workerStatusByTime };