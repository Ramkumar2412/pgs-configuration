import fs from 'fs';
import dotenv from 'dotenv';
import {updateConfig} from '../../config/sensorCount.js';
dotenv.config();

// const currentDirectory = __dirname;
// const currentFile = __filename;



export function readModbus(req, res) {
  console.log('Router is working');

  const filePath = process.env.MODBUS_PATH;
  console.log(filePath);

  if (typeof filePath === 'string') {
    if (!fs.existsSync(filePath)) {
      console.log(`The file "${filePath}" does not exist.`);
      return res.status(200).send({
        message: 'The file ${filePath} does not exist.',
      });
    } else {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Parse the JSON content
      let jsonData = JSON.parse(fileContent);

      // Display the current content of the JSON file
      console.log(`Current content of JSON file "${filePath}":`);
      console.log("data",jsonData.channels[0]);
      //updateConfig('SENSOR' , jsonData.channels[0].number_of_sensors);
      res.status(200).send(jsonData);
    }
  } else {
    // Handle case where filePath is undefined or not a string
    console.error('FILE_PATH is not defined or not a string');
  }
}

export function writeModbus(req, res) {
  const address = req.body.address;
  const port = req.body.port;
  const method = req.body.method;
  const baudrate = req.body.baudrate;
  const full_scan_time = req.body.full_scan_time;
  const number_of_sensors = req.body.number_of_sensors;
  const filePath = process.env.MODBUS_PATH;
  const modbus_config = {
    channels: [
      {
        address: address,
        port: port,
        method: method,
        baudrate: baudrate,
        full_scan_time: full_scan_time,
        number_of_sensors: number_of_sensors,
      },
    ],
  };
  if (typeof filePath === 'string') {
    try {
      fs.writeFileSync(
        filePath,
        JSON.stringify(modbus_config, null, 2),
        'utf8'
      );
      //updateConfig('SENSOR' , modbus_config.channels[0].number_of_sensors);
      console.log('Data successfully saved to disk');
      res.status(200).send({
        ErrCode: 200,
        message: 'File Successfull updated',
        result: modbus_config,
      });
    } catch (error) {
      console.log('An error has occurred ', error);
      res.status(300).send({
        ErrCode: 300,
        message: error,
        result: 'Something went wrong',
      });
    }
  } else {
    // Handle case where filePath is undefined or not a string
    console.error('FILE_PATH is not defined or not a string');
  }
}

