import ModbusRTU from 'modbus-serial';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

  export  function sensorConfigutation (req , res) {
    
    const modbusClient = new ModbusRTU();

    const port = '/dev/ttySC0';
    const baudRate= 115200;
    const slaveID=Number(req.query.slave_id);
    const startAddress= 40;
    const length= 9;
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
     await modbusClient.connectRTUBuffered(port , {baudRate:baudRate,parity:"none",dataBits:8 , stopBits:1}).then((result) => {
      console.log("connection Establised",result);
      readRegister().then((result) => {
        console.log("Then block of read register function",result);
      }).catch((error) => {
        console.log("catch block of the read register function " , error);
      });
     }).catch((error) => {
      console.log("unable to establish Connection ",error);
      return res.status(200).send({
        ErrCode : 407,
        messsage : error
      })
     });
    }
   
    async function readRegister() {

   
      
      modbusClient.setID(slaveID); 
       
       // Set the slave ID, adjust as necessary
       await modbusClient.readInputRegisters(startAddress, length).then((result) => {
        
        console.log('Holding Registers Data:', result.buffer);
        const data = result.buffer;
        console.log("register buffer",data);
        return res.status(200).send({
          slaveID : slaveID,
          parked_color : data.readUInt8(1),
          Free_colour : data.readUInt8(3),
          offset : data.readUInt8(5),
          parked_min: data.readUInt8(7),
          parked_max : data.readUInt8(9),
          free_min : data.readUInt8(11),
          free_max : data.readUInt8(12),
          Timeout: data.readUInt8(15),
          Configure : data.readUInt8(16),
        });

      }).catch((error) => {
        console.log("Holding register error" , error);
            modbusClient.close((err) => {
      if (err instanceof Error)  {
        console.error('Error closing the port in catch block :', err);
    } else {
        console.log('Port closed successfully in catch block');
    }
     }); 
      });

      close();
    }
    
    if(modbusClient.isOpen){
      console.log("connection is open so readRegister function is called");
         readRegister().then((result) => {
          console.log("Main block of then readRegister function",result);
        }).catch((error) => {
          console.log("catch block of the main readRegister function " , error);
        }).finally(() => {
          if (modbusClient.isOpen) {
                  modbusClient.close((err) => {
                        if (err instanceof Error) {
                            console.error('Error closing the port:', err);
                        } else {
                            console.log('Port closed successfully in finally block');
                        }
                    });
                } else {
                    console.log('final block : Port was not open.');
                    close();
                   
                }
        });
    }else{
      console.log("Connection is not open so call connectModdbus Function");
        connectModbus().then((result) => {
          console.log("Main block of then connectModbus function",result);
        }).catch((error) => {
          console.log("catch block of the main connectModbus function " , error);
        }).finally(() => {
          if (modbusClient.isOpen) {
                  modbusClient.close((err) => {
                        if (err instanceof Error) {
                            console.error('Error closing the port:', err);
                        } else {
                            console.log('Port closed successfully in finally block');
                        }
                    });
                } else {
                    console.log('final block : Port was not open.');
                   
                }
        });
    }
  
        // try {

        //   if (modbusClient.isOpen){
        //     console.log("connection is open so readRegister function is called");
        //     readRegister();
        //   }
        //   else{
        //     console.log("Connection is not open so call connectModdbus Function");
        //     connectModbus();
        //   }
  
        // }
        //  catch (error) {
        //     console.error('Error reading holding registers:', error);
        // } 
        // finally {
        //     if (modbusClient.isOpen) {
        //       modbusClient.close((err : unknown) => {
        //             if (err instanceof Error) {
        //                 console.error('Error closing the port:', err);
        //             } else {
        //                 console.log('Port closed successfully in finally block');
        //             }
        //         });
        //     } else {
        //         console.log('final block : Port was not open.');
               
        //     }
        // }
  }


  export  async function editsensorConfigutation (req , res ) {
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
    const configure = req.body.configure;
    console.log('slave_id', slaveID);

    async function connectModbus() {
     await  modbusClient.connectRTUBuffered(port , {baudRate:baudRate,parity:"none",dataBits:8 , stopBits:1},writeRegister);
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
        await modbusClient.writeRegister(49,configure);

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