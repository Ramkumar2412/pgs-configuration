import { Router } from 'express';
import {readModbus ,writeModbus } from '../controller/configuration.js';
import { readGateway ,writeGateway} from '../controller/gatewyConfiguration.js';
import { pgsLogin } from '../controller/login.js';
import { sensorConfigutation ,editsensorConfigutation} from '../controller/senesorConfiguration.js';

export const router = Router();


router.get("/modbus_config",readModbus);
router.post("/login",pgsLogin);
router.post("/modbus_config",writeModbus);
router.post("/sensor_config",editsensorConfigutation);
router.get('/sensor',sensorConfigutation)
router.get("/gateway_config" , readGateway);
router.post("/gateway_config" , writeGateway);
