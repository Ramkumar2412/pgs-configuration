import ModbusRTU from 'modbus-serial';
import fs from 'fs';
import config from 'config'; 
import { formattedDate } from '../utills/formatedTime.js';
import { sensordb , testdb } from '../utills/db.js';
import {upsertObject} from '../models/sensor.js';
import axios from 'axios';

import {isImageRunning} from './docker.js';


export async function sensorHeight (req , res)  {

    const imageName = process.env.DOCKER_CONTAINER;
    const isRunning = await isImageRunning(imageName);
    console.log("Running" , isRunning);

    if(isRunning === true){

        try{

            const sensorData = await sensordb.findAsync({});

            console.log("sensorData in sensorHeight function" , sensorData);
            

            res.status(200).send({
                ErrCode : 0,
                ErrDesc : "sensor data received",
                data : sensorData
            });

        }
        catch (e) {
            console.log("error in catch block of function sensorValue " , e);
        }

    }

    else {      
     
        try{
            const testData = await axios.get('http://192.168.1.35:3001/data')
               console.log("get result from axios" , testData.data.data);
            //    const sensorData = testdb.findAsync({});

            //    console.log("sensorData in sensorHeight function" , sensorData);
               
   
               res.status(200).send({
                   ErrCode : 0,
                   ErrDesc : "sensor data received",
                   data : testData.data.data
               });
           

          

        }
        catch (e) {
            console.log("error in catch block of function sensorValue " , e);
        }
        
      
    }   

}

export async function sensorMainData (req , res) {
    try{

        const sensorData =  req.body;
        console.log("sensorData" , sensorData);
        if (Array.isArray(sensorData)) {
       


         sensorData.forEach(async function(item) {
            //const query = { external_slot_id: item.external_slot_id };

            const findSeneor = await sensordb.findAsync({external_slot_id :item.external_slot_id});

            if(findSeneor.length === 0){
                console.log("findSensor" , findSeneor);
                try{
                    const insertSensor = await sensordb.insertAsync(item)
                console.log("insertSensor" , insertSensor);
                }
                catch(error){
                    console.error("error in inserting data",error);
                }
            }
            else{
                console.log("array as object",findSeneor);
                try{
                    const updateSensor = await sensordb.updateAsync({external_slot_id :item.external_slot_id},{$set : {status : item.status , height : item.height}},{multi : true});
                    console.log("updateSensor",updateSensor);
     }
            catch(error){
                console.error("error in updating data",error);
            }

                }


          })
    

            console.log("sensorData is inside is block" , sensorData);
            res.status(200).send({data:[{
                ErrCode : 0,
                ErrDesc : "slots updated successfully",
                result : sensorData
            }]})
           
        }
        else {
            console.log("sensor data is empty",sensorData);
            res.status(202).send({
                ErrCode : 202,
                ErrDesc:"sensor data is empty"
            })
        }

    }
    catch (e) {
        console.log("error in catch block of function sensorValue " , e);
    }
}


export async function sensorTestData (req , res) {
    try{

        let testData;
        console.log("sensorData" , testData);
        if (Array.isArray(testData)) {
       


            testData.forEach(async function(item) {
            //const query = { external_slot_id: item.external_slot_id };

            const findSeneor = await testdb.findAsync({external_slot_id :item.external_slot_id});

            if(findSeneor.length === 0){
                console.log("findSensor" , findSeneor);
                try{
                    const insertSensor = await testdb.insertAsync(item)
                console.log("insertSensor" , insertSensor);
                }
                catch(error){
                    console.error("error in inserting data",error);
                }
            }
            else{
                console.log("array as object",findSeneor);
                try{
                    const updateSensor = await testdb.updateAsync({external_slot_id :item.external_slot_id},{$set : {status : item.status , height : item.height}},{multi : true});
                    console.log("updateSensor",updateSensor);
     }
            catch(error){
                console.error("error in updating data",error);
            }

                }


          })
    

            console.log("sensorData is inside is block" , sensorData);
            res.status(200).send({data:[{
                ErrCode : 0,
                ErrDesc : "slots updated successfully",
                result : sensorData
            }]})
           
        }
        else {
            console.log("sensor data is empty",sensorData);
            res.status(202).send({
                ErrCode : 202,
                ErrDesc:"sensor data is empty"
            })
        }

    }
    catch (e) {
        console.log("error in catch block of function sensorValue " , e);
    }
}