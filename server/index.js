import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import boxesController from './controllers/boxes.ctrl.js';
import scansController from './controllers/scans.ctrl.js';
import adminsController from './controllers/admins.ctrl.js';
import authController from './controllers/auth.ctrl.js';
import insightsController from './controllers/insights.ctrl.js';

dotenv.config();

import mongoose from 'mongoose';
const mongoString = process.env.STRING_URI;

mongoose.connect(mongoString, {
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 300000, // Close sockets after 5 minutes of inactivity
});
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error)
})

database.once('connected', () => {
    console.info('Database Connected');
})

const app = express();
app.disable('x-powered-by');
const apiPort = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: '*',
        methods: 'GET,POST,PUT,DELETE, PATCH',
        credentials: true,
        maxAge: 3600,
    })
);
app.use(bodyParser.raw({ type: 'application/octet-stream' }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api', boxesController);
app.use('/api', scansController);
app.use('/api', adminsController);
app.use('/api', authController);
app.use('/api', insightsController);

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));

export default app;
