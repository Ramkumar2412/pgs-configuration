import { Router } from 'express';
export const test_router = Router();
import { sensorTestData } from '../controller/sensor.js';
import { testdb } from '../utills/db.js';

let modbusData = {};
test_router.post('/data', (req, res) => {
    modbusData = req.body;
    //console.log('Data received:', modbusData);
    res.send({ status: 'success',
result:modbusData });
});

//test_router.get('/data',sensorTestData );


test_router.get('/data', (req, res) => {
    console.log("get api for test data" , );
    //res.json(modbusData);

    if (Array.isArray(modbusData)) {
       


//         modbusData.forEach(async function(item) {
//         //const query = { external_slot_id: item.external_slot_id };

//         const findSeneor = await testdb.findAsync({external_slot_id :item.external_slot_id});

//         if(findSeneor.length === 0){
//             console.log("findSensor" , findSeneor);
//             try{
//                 const insertSensor = await testdb.insertAsync(item)
//             console.log("insertSensor" , insertSensor);
//             }
//             catch(error){
//                 console.error("error in inserting data",error);
//             }
//         }
//         else{
//             console.log("array as object",findSeneor);
//             try{
//                 const updateSensor = await testdb.updateAsync({external_slot_id :item.external_slot_id},{$set : {status : item.status , height : item.height}},{multi : true});
//                 console.log("updateSensor",updateSensor);
//  }
//         catch(error){
//             console.error("error in updating data",error);
//         }

//             }


//       })


        console.log("sensorData is inside is block" , modbusData);
        res.status(200).send({data:modbusData})
        // res.status(200).send({data:[{
        //     ErrCode : 0,
        //     ErrDesc : "slots updated successfully",
        //     result : modbusData
        // }]})
       
    }
    else {
        console.log("sensor data is empty",modbusData);
        res.status(202).send({
            ErrCode : 202,
            ErrDesc:"sensor data is empty"
        })
    }
});