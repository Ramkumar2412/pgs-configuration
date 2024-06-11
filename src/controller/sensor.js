import ModbusRTU from 'modbus-serial';

export function sensorHeight (req , res)  {
    const modbusClient = new ModbusRTU();

    const connectClient = async () => {
        // open connection to a serial port
        await modbusClient.connectRTUBuffered("/dev/ttySC0", { baudRate: 115200, parity: "none", dataBits: 8, stopBits: 1 });
        // set timeout, if slave did not reply back
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
        firstSensor : req.body.firstSensor,
        lastSensor : req.body.lastSensor
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
                sensorData.push({ id: sensor, height: value });
                await sleep(100);
            }
            res.status(200).send({
                Errcode : 200,
                result : sensorData
            })
        } catch (e) {
            console.log(e);
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
            return -1;
        }
    }

    // const postSensorData = async (data) => {
    //     try {
    //         await axios.post('http://192.168.1.4:5000/data', data);
    //         console.log('Data posted successfully');
    //     } catch (error) {
    //         console.error('Error posting data:', error);
    //     }
    // }

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    getsensorsValue(sensorsIdList);
}