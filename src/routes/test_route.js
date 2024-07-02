import { Router } from 'express';
export const test_router = Router();
import { sensorTestData } from '../controller/sensor.js';
import { testdb } from '../utills/db.js';

let testData = {};
test_router.post('/data', (req, res) => {
    testData = req.body;
    //console.log('Data received:', testData);
    res.send({ status: 'success',
result:testData });
});

//test_router.get('/data',sensorTestData );


test_router.get('/data', (req, res) => {
    console.log("get api for test data" , );
    //res.json(testData);

    if (Array.isArray(testData)) {
       





        console.log("sensorData is inside is block" , testData);
        res.status(200).send({data:testData})
        // res.status(200).send({data:[{
        //     ErrCode : 0,
        //     ErrDesc : "slots updated successfully",
        //     result : testData
        // }]})
       
    }
    else {
        console.log("sensor data is empty",testData);
        res.status(202).send({
            ErrCode : 202,
            ErrDesc:"sensor data is empty"
        })
    }
});