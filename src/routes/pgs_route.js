import { Router } from 'express';
import {readModbus ,writeModbus } from '../controller/configuration.js';
import { readGateway ,writeGateway} from '../controller/gatewyConfiguration.js';
import { pgsLogin } from '../controller/login.js';
import { sensorConfigutation ,editsensorConfigutation} from '../controller/senesorConfiguration.js';
import { sensorHeight ,sensorMainData } from '../controller/sensor.js';
import {startTestservice} from '../controller/pm2.js';

export const router = Router();

//export const liveRouter = Router();


router.get("/modbus_config",readModbus);
router.post("/login",pgsLogin);
router.post("/modbus_config",writeModbus);
router.post("/sensor_config",editsensorConfigutation);
router.get('/sensor',sensorConfigutation)
router.get("/gateway_config" , readGateway);
router.post("/gateway_config" , writeGateway);
router.post("/slot_status_bulk_update", sensorMainData);
router.get("/sensor_data",sensorHeight);


//pm2 routes


router.post('/start_test_service' , startTestservice );