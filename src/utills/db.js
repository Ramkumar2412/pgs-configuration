import Datastore from 'nedb';
  
export const sensordb = new Datastore({
    filename : process.env.LIVE_DATA,
    autoload: true
})