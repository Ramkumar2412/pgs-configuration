import fs from 'fs';
import * as bcrypt from 'bcrypt';
import {isImageRunning} from './docker.js';
//const {FIRST_NAME , SECOND_NAME}= require('../../config').user;
import config from 'config'; 
  
const configuration = config;
console.log("config" , configuration);
export async function pgsLogin(req , res) {
    const saltRounds = 10;
    const username = req.body.username;
    const password = req.body.password;

    

    if (!username || !password){
        return res.json({
            message : "please enter username and password"
        })
    }
    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const myPassword = 'MY-r98q+!'
        console.log(hashedPassword);
        bcrypt.compare(myPassword,hashedPassword)
        .then(result => {
            if(result == true){
                (async () => {
                    const imageName = process.env.DOCKER_CONTAINER;
                    const isRunning = await isImageRunning(imageName);
                    console.log("isRunning",isRunning);
                    if (isRunning) {
                        res.status(200).json({
                            ErrCode:200,
                            message : "password matches",
                            result : result,
                            firstname:config.get('FIRST_NAME'),
                            lastname:config.get('SECOND_NAME'),
                            sensor:config.get('SENSOR'),
                            docker : isRunning
                        })
                      console.log(`Container "${imageName}" is running.`);
                    } else {
                        res.status(200).json({
                            ErrCode:200,
                            message : "password matches",
                            result : result,
                            firstname:config.get('FIRST_NAME'),
                            lastname:config.get('SECOND_NAME'),
                            sensor:config.get('SENSOR'),
                            docker : isRunning
                        })
                      console.log(`Container "${imageName}" is not running.`);
                    }
                  })();
            }
            else{
                res.status(401).json({
                    ErrCode:401,
                    message : "incorrect password",
                    result : result
                })
            }
        })       
        .catch(err => {
            console.log(err);
            res.status(401).json({
                ErrCode :401,
                message : "incorrect username or password",
                err : err
            })
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}