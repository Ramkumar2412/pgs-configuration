import pm2 from 'pm2';

export  function startTestservice (req , res) {
    try{
        const name = process.env.TEST_SERVICE;
        pm2.connect((err) => {
            if (err) {
                res.status(500).send(err);
                return;
            }
            pm2.describe(name, (err, processDescription) => {
                pm2.disconnect();
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                if (processDescription.length === 0) {
                    res.status(404).send({ error: 'Service not found' });
                    return;
                }
                else {
                    console.log("Process",processDescription[0].pm2_env.status);

                    if(processDescription[0].pm2_env.status === 'stopped'){
                        pm2.start({name : name},function(err,apps) {
                            
                        })
                    }
                    res.status(200).send({data: processDescription});
                }
               
            })
        })
    }
    catch(e){
        console.log("error" , e);
    }


}