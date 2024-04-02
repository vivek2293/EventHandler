const express = require('express');
const app = express();
const routes = require('./routes/router');
const connect = require('./connect');
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());
app.use('/api/v1', routes);

// Connect to MongoDB
connect(process.env.MONGO_URI);

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});