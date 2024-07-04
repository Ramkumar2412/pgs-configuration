import ModbusRTU from 'modbus-serial';
import fs from 'fs';
import config from 'config'; 
import { formattedDate } from '../utills/formatedTime.js';
import { sensordb , testdb } from '../utills/db.js';
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
     
        // try{
        //     const testData = await axios.get('http://192.168.1.35:3001/data')
        //        console.log("get result from axios" , testData.data.data);
         
               
   
        //        res.status(200).send({
        //            ErrCode : 0,
        //            ErrDesc : "sensor data received",
        //            data : testData.data.data
        //        });
           

          

        // }
        // catch (e) {
        //     console.log("error in catch block of function sensorValue " , e);
        // }
        
        const filePath = process.env.MODBUS_PATH;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContent);
        const totalSensor = jsonData.channels[0].number_of_sensors;
        console.log("total Sensor" ,totalSensor );
        const modbusClient = new ModbusRTU();

        const connectClient = async () => {


            await modbusClient.connectRTUBuffered("/dev/ttySC0", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 });
            modbusClient.setTimeout(500);
        };
    
        function close (){
            modbusClient.close((err) => {
              if (err) {
                console.error('Error closing the port:', err);
            } else {
                console.log('Port closed successfully after then block');
            }
             });  
          }
    
        const sensorsIdList = [];
        const sensor = {
            firstSensor : 1,
            lastSensor : totalSensor
        }

        console.log("sensor json",sensor)
        for (let i = sensor.firstSensor; i <= sensor.lastSensor; i++) {
            sensorsIdList.push(i);
        }
    
       connectClient();
    
        const getsensorsValue = async (sensors) => {
            try {
                // connectClient();
                const sensorData = [];
                for (let sensor of sensors) {
                    const value = await getsensorValue(sensor);
                    console.log(`Sensor[${sensor}]: ${value}`);
                    let timestamp = formattedDate;
                    sensorData.push({ external_slot_id: sensor, height: value , status : 1 , status_name : "TEST" , timestamp : timestamp });
                    await sleep (300);
    
                }
                res.status(200).send({
                    ErrCode : 200,
                    data : sensorData
                })
            } catch (e) {
                console.log("error in catch block of function getsensorsValue " , e);
                close();
            } finally {
                console.log("inside the final block");
                
    
                
             close();
            }
        }
    
        const getsensorValue = async (id) => {
            try {
                await modbusClient.setID(id);
                let height = await modbusClient.readInputRegisters(32, 2);
                return height.data[0];
            } catch (e) {
                console.log("error in catch block of function sensorValue " , e);
                close();
                return -1;
            }
        }
    
    
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
        getsensorsValue(sensorsIdList);
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