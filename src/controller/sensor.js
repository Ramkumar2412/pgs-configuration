import ModbusRTU from 'modbus-serial';
import fs from 'fs';
import config from 'config'; 
import { formattedDate } from '../utills/formatedTime.js';
import { sensordb } from '../utills/db.js';
import {upsertObject} from '../models/sensor.js';

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
            // const sensorData =  req.body;
            // console.log("sensorData" , sensorData);
            // if (Array.isArray(sensorData)) {
            //     await sensordb
            //     console.log("sensorData" , sensorData);
            //     res.status(200).send({data:[{
            //         ErrCode : 0,
            //         ErrDesc : "slots updated successfully",
            //         result : sensorData
            //     }]})
               
            // }else {
            //     console.log("sensor data is empty",sensorData);
            //     res.status(400).send({
            //         ErrCode : 400,
            //         ErrDesc:"sensor data is empty"
            //     })
            // }


            // res.status(404).send([{
            //     Errcode : 404,
            //     ErrDesc : "Live service is on .Please check in Live page"
            // }])
        }
        catch (e) {
            console.log("error in catch block of function sensorValue " , e);
        }

    }

    else {      
        const modbusClient = new ModbusRTU();

        const connectClient = async () => {
            // open connection to a serial port
            await modbusClient.connectRTUBuffered("/dev/ttySC0", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 });
            // set timeout, if slave did not reply back
            modbusClient.setTimeout(1500);
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
            lastSensor : config.get('SENSOR')
        }
        for (let i = sensor.firstSensor; i <= sensor.lastSensor; i++) {
            sensorsIdList.push(i);
        }
    
        connectClient();
    
        const getsensorsValue = async (sensors) => {
            try {
                const sensorData = [];
                for (let sensor of sensors) {
                    const value = await getsensorValue(sensor);
                    console.log(`Sensor[${sensor}]: ${value}`);
                    let timestamp = formattedDate;
                    sensorData.push({ external_slot_id: sensor, height: value , status : 1 , status_name : "TEST" , timestamp : timestamp });
                    await sleep (1500);
    
                }
                res.status(200).send({
                    ErrCode : 200,
                    data : sensorData
                })
            } catch (e) {
                console.log("error in catch block of function getsensorsValue " , e);
                close();
            } finally {
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
        // const filePath = process.env.LIVE_DATA;
        // console.log("filePath of live data",filePath);
        const sensorData =  req.body;
        console.log("sensorData" , sensorData);
        if (Array.isArray(sensorData)) {
            // let sensor = [];
            
            // const sensorStatus = sensor.push(...sensorData);
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
                
            
            // upsertObject(query,item ,(err ,result)=>{
            //     if (err) {
            //         return console.error('Error upserting object:', err);
            //     }
            //     if (result.inserted) {
            //         console.log('Inserted new object:', result.newDoc);
            //     } else if (result.updated) {
            //         console.log('Updated existing object. Number of objects updated:', result.numReplaced);
            //     }
            //   })
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

// export function selectRows(external_slot_id) {
//     createDbConnection.each(`SELECT * FROM sensor WHERE external_slot_id = ?`,external_slot_id, (error, row) => {
//       if (error) {
//         throw new Error(error.message);
//       }
//       console.log(row);
//     });
//   }