import fs from 'fs';
import insertLine from 'insert-line';
import dotenv from 'dotenv';
dotenv.config();



export function readGateway (req , res ) {


    const filePath = process.env.GATEWAY_PATH;
    console.log(filePath)

    if (typeof filePath === 'string'){
        if (!fs.existsSync(filePath)) {
            console.log(`The file "${filePath}" does not exist.`);
            return  res.status(200).send({
                message : `The file ${filePath} does not exist.`,
            })
        }
        else
        {    
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            const lines = fileContent.split('\n');
            let obj={}
            for (const line of lines){

                const trimmedLine = line.trim();

                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }

               const [key, value] = line.split('=');

                if (key && value) {
                   obj={...obj, [key]:value};
                    // Do something with the key and valueconst             
                    console.log(`Key: ${key}, Value: ${value}`);
                 
                }

            }
            console.log('JSON',obj);
            
        res.status(200).send({
            Errcode : 200,
            message : "file is successfully read",
            result:obj
        });
        
    };
    }
    else {
        // Handle case where filePath is undefined or not a string
        console.error('FILE_PATH is not defined or not a string');
    }
}

export function writeGateway (req, res) {
    const filePath = process.env.GATEWAY_PATH;
    console.log(filePath);
    if (typeof filePath === 'string'){
        const configData = [
            '[DataSettings]',
            {
            serial_terminal:'/dev/ttyUSB0',
            ap_mode:2,
            controller_communication:'cc',
            local_print:'lp',
            webserver:'ws',
            database:'db',
            display:'dp',
            local_server:'ls',
            redis:'rd',
            upstream_subscribers:'cc,dp,ws',
            overhead_sensor:'overhead',
            ramp_sensor:'ramp',
            floor_sensor:'floor',
            display_7_segment:'7s',
            webserver_host:req.body.webserver_host,
            webserver_port:req.body.webserver_port,
            webserver_protocol:'http',
            webserver_authcode:'4559533647766c5a78694b596f663136',
            is_proxy:'no',
            is_unauthorized_at_start:'yes',
            xbtimeout:100,
            display_timeout:5,
            gateway_connections:'sensor',
            display_source:'ws',
            display_refresh_timeout:3600,
            height_refresh_timeout:3600,
            hi_timeout:60,
            conf:req.body.conf
        },
        '[Transmitters]',
        '[RaspberryPiReceivers]',
        '[Loops]',
        '[LoopSettings]',
        '[LoopPins]',
        '[FloorSensorThresholds]',
        '[SettlingTime]',
        '[ReInitialize]',
        '[Limit]',
        '[ControllerSensorRampType]',
        '[ControllerSensorRampNeighbour]',
        '[ControllerSensorHeights]',
        '[ControllerSensors]',
        '[TransmitterDisplayNumber]',
        '[DisplayReferenceNumbers]',
        '[DisplayTransmitterMap]'
            
        ];
        

    //const  configData = readGatewayFile();

    //     function configToString(config) {
    //         Object.entries(config)
    //             .map(([key, value]) => `${key}=${value}`)
    //             .join('\n');
    //     }
    
    //     // Convert the configuration data to a string
    // const confString = configToString(configData);

    function formatConfig(config) {
        let formatted = '';
    
        config.forEach(item => {
            if (typeof item === 'string') {
                formatted += item + '\n';
            } else if (typeof item === 'object') {
                for (const [key, value] of Object.entries(item)) {
                    formatted += `${key}=${value}\n`;
                }
            }
        });
    
        return formatted;
    }

    // Format the configuration data
const formattedConfig = formatConfig(configData);

    if (!fs.existsSync(filePath)) {
        console.log(`The file "${filePath}" does not exist.`);
        return  res.status(200).send({
            message : `The file ${filePath} does not exist.`,
        })
    }
    else{
        fs.writeFileSync(filePath, formattedConfig, 'utf8');
        res.status(200).send({
            ErrCode:200,
            message : "The file has been updated" 
        });
          
       
      
    }

   
    
    console.log(`Configuration file written to ${filePath}`);

    }
    else {
        // Handle case where filePath is undefined or not a string
        console.error('FILE_PATH is not defined or not a string');
    }

}


function readGatewayFile(){
    const filePath = process.env.GATEWAY_PATH;
    console.log(filePath)

    if (typeof filePath === 'string'){
        if (!fs.existsSync(filePath)) {
            console.log(`The file "${filePath}" does not exist.`);
            
        }
        else
        {    
            const fileContent = fs.readFileSync(filePath, 'utf-8');

            const lines = fileContent.split('\n');
            let obj={}
            for (const line of lines){

                const trimmedLine = line.trim();

                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }

               const [key, value] = line.split('=');

                if (key && value) {
                   obj={...obj, [key]:value};
                    // Do something with the key and valueconst             
                    console.log(`Key: ${key}, Value: ${value}`);
                 
                }

            }
            console.log('JSON',obj);

            return obj;
        
    };
    }
    else {
        // Handle case where filePath is undefined or not a string
        console.error('FILE_PATH is not defined or not a string');
    }
}