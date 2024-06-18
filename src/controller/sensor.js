import ModbusRTU from 'modbus-serial';
import config from 'config'; 
import { formattedDate } from '../utills/formatedTime.js';

import {isImageRunning} from './docker.js';


export async function sensorHeight (req , res)  {

    const imageName = process.env.DOCKER_CONTAINER;
    const isRunning = await isImageRunning(imageName);
    console.log("Running" , isRunning);

    if(isRunning === true){

        try{

            // const sensorData =  req.body;
            // if (Array.isArray(sensorData)) {
            //     console.log("sensorData" , sensorData);
            //     res.status(200).send([{
            //         ErrCode : 0,
            //         ErrDesc : "slots updated successfully",
            //         result : sensorData
            //     }])
               
            // }else {
            //     console.log("sensor data is empty",sensorData);
            //     res.status(405).send({
            //         ErrCode : 405,
            //         ErrDesc:"sensor data is empty"
            //     })
            // }


            res.status(404).send([{
                Errcode : 404,
                ErrDesc : "Live service is on .Please check in Live page"
            }])
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
                    result : sensorData
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

export function sensorMainData (req , res) {
    try{
        const sensorData = req.body;
        if (Array.isArray(sensorData)) {
            res.status(405).send({
                ErrCode : 405,
                message:"sensor data is empty"
            })
        }else {
            res.status(200).send({
                ErrCode : 200,
                result : sensorData
            })
        }
    }
    catch (e) {
        console.log("error in catch block of function sensorValue " , e);
    }
}