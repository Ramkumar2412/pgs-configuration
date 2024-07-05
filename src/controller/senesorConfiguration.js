import ModbusRTU from 'modbus-serial';
import fs from 'fs';
import { restartDocker ,stopDocker} from './docker.js';
import dotenv from 'dotenv';
dotenv.config();



  export  function sensorConfigutation (req , res) {
    // const imageName = process.env.DOCKER_CONTAINER;
    // stopDocker(imageName);
    const modbusClient = new ModbusRTU();

    const serialPortConfig = {
      baudRate: 115200,      // Baud rate
      parity: 'none',      // Parity ('none', 'even', 'odd', 'mark', 'space')
      dataBits: 8,         // Data bits (usually 8)
      stopBits: 1,         // Stop bits (usually 1 or 2)
  };

    const port = '/dev/ttySC0';
    const slaveID=req.query.slave_id;
    const startAddress= 40;
    const length= 9;

    function close (){
      modbusClient.close((err) => {
        if (err) {
          console.error('Error closing the port:', err);
      } else {
          console.log('Port closed successfully after then block');
      }
       });  
    }
  
    modbusClient.connectRTUBuffered(port , serialPortConfig).then(setClient)
     .then(readRegister)
     .then(restartDocker(imageName))
     .catch(console.error);
   
    function setClient() {
      modbusClient.setID(slaveID); // Set the Modbus slave ID (1-247)
      modbusClient.setTimeout(1000); // Set a timeout for requests (milliseconds)
  }
    function readRegister() {



    console.log('slave_id', slaveID);
       
       // Set the slave ID, adjust as necessary
       modbusClient.readInputRegisters(startAddress, length).then((result) => {
        
        console.log('Holding Registers Data:', result.buffer);
        const data = result.buffer;
        console.log("register buffer",data);
         return res.status(200).send({
          ErrCode : 200,
          slaveID : slaveID,
          parked_color : data.readUInt8(1),
          Free_colour : data.readUInt8(3),
          offset : data.readUInt8(5),
          parked_min: data.readUInt8(7),
          parked_max : data.readUInt8(9),
          free_min : data.readUInt8(11),
          free_max : data.readUInt16BE(12),
          Timeout: data.readUInt8(15),
          Configure : data.readUInt8(16),
        });

      }).catch((error) => {
        console.log("Holding register error" , error);
            modbusClient.close((err) => {
      if (err)  {
        console.error('Error closing the port in catch block :', err);
    } else {
        console.log('Port closed successfully in catch block');
        res.status(202).send({
          ErrCode : 202,
          slaveID : slaveID,
          parked_color : 0,
          Free_colour : 0,
          offset : 0,
          parked_min: 0,
          parked_max : 0,
          free_min : 0,
          free_max : 0,
          Timeout: 0,
          Configure : 0,
          message : "Something Went Wrong.Please Check the Connection"
        })
    }
     }); 
      }).finally(()=>{

      close();
      });
    }
    

  
  }


  export  async function editsensorConfigutation (req , res ) {

    const imageName = process.env.DOCKER_CONTAINER;
    //stopDocker(imageName);
    const modbusClient = new ModbusRTU();

    const port = '/dev/ttySC0';
    const baudRate= 115200;
    const slaveID=req.body.slave_id;
    const parkedColor = req.body.parked_color;
    const vacantColor = req.body.free_color;
    const Offset = req.body.offset;
    const parkedMinimum = req.body.parked_min;
    const parkedMaximum = req.body.parked_max;
    const freeMinimum = req.body.free_min;
    const freeMaximum = req.body.free_max;
    const timeout = req.body.timeout;
    // const configure = 1;
    console.log('slave_id', slaveID);


    function close (){
      modbusClient.close((err) => {
        if (err) {
          console.error('Error closing the port:', err);
      } else {
          console.log('Port closed successfully after then block');
      }
       });  
    }
  

    async function connectModbus() {
     await  modbusClient.connectRTUBuffered(port , {baudRate:baudRate,parity:"none",dataBits:8 , stopBits:1},writeRegister,restartDocker(imageName));
    }

    async function writeRegister() {
      try{
        modbusClient.setID(slaveID); 
        await modbusClient.writeRegister(40,parkedColor);
        await modbusClient.writeRegister(41,vacantColor);
        await modbusClient.writeRegister(42,Offset);
        await modbusClient.writeRegister(43,parkedMinimum);
        await modbusClient.writeRegister(44,parkedMaximum);
        await modbusClient.writeRegister(45,freeMinimum);
        await modbusClient.writeRegister(46,freeMaximum);
        await modbusClient.writeRegister(47,timeout);
        await modbusClient.writeRegister(49,1);
        await modbusClient.writeRegister(48,1);
        res.status(200).send({
          ErrCode : 200,
          message : "Sensor Configured Successfully"
        })

        return close();

      }
      catch (error) {
        console.error('Error writing to registers:', error);
      } finally {          
         if (modbusClient.isOpen) {
        modbusClient.close((err) => {
              if (err instanceof Error) {
                  console.error('Error closing the port:', err);
              } else {
                  console.log('Port closed successfully');
              }
          });
      } else {
          console.log('final block : Port was not open.');
         
      }
      }
     
    }


      await connectModbus();
  



  
  }