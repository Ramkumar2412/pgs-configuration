import { Router } from 'express';
export const test_router = Router();

let sensorData = {};
test_router.post('/data', (req, res) => {
    sensorData = req.body;
    res.send({ status: 'success',
result:sensorData });
});

//test_router.get('/data',sensorTestData );


test_router.get('/data', (req, res) => {
    console.log("get api for test data" , );
    if (Array.isArray(sensorData)) {
       





        console.log("sensorData is inside is block" , sensorData);
        res.status(200).send({data:sensorData})
  
       
    }
    else {
        console.log("sensor data is empty",sensorData);
        res.status(202).send({
            ErrCode : 202,
            ErrDesc:"sensor data is empty"
        })
    }
});