import express from 'express';
import cors from 'cors';
import {router} from './src/routes/pgs_route.js';
import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
const app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REMOTE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization','accesstoken','authcode'], // Specify allowed headers
    credentials: true // Allow cookies to be sent with the request
}));

app.use('/ops',router);


app.listen(3001, () => {
    console.log('listening on port 3001!');
});