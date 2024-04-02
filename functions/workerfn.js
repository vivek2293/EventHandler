const worker = require('../model/workerSchema');

const getWorkers = async (req, res) => {
    try {
        const workers = await worker.find();
        res.status(200).json(workers);
    }
    catch(error) {
        res.status(404).json({ message: error.message });
    }
};  

// Register a new worker
const createWorker = async (req, res) => {
    const { name, email, contact } = req.body;
    const newWorker = { name, email, contact };
    
    try {
        const newDoc = await worker.create( newWorker ); 
        res.status(201).json(newDoc);
    }
    catch(error) {
        res.status(409).json({ message: error.message });
    }
};

module.exports = { getWorkers, createWorker };