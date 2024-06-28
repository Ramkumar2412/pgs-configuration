import Datastore from '@seald-io/nedb';
import fs from 'fs';
//import sqlite3 from 'sqlite3'
//sqlite3.verbose()


// export const sensordb = new Datastore({
//     filename : process.env.LIVE_DATA,
//     autoload: true
// });


export const sensordb = new Datastore();

export const testdb = new Datastore();

// const fs = require("fs");
// const sqlite3 = require("sqlite3").verbose();
const filepath = process.env.LIVE_DATA;

// export function createDbConnection() {
//   if (fs.existsSync(filepath)) {
//     return new sqlite3.Database(filepath);
//   } else {
//     const db = new sqlite3.Database(filepath, (error) => {
//       if (error) {
//         return console.error(error.message);
//       }
//       createTable(db);
//     });
//     console.log("Connection with SQLite has been established");
//     return db;
//   }
// }

// function createTable(db) {
//   db.exec(`
//   CREATE TABLE sensor
//   (
//     ID INTEGER PRIMARY KEY AUTOINCREMENT,
//     external_slot_id   VARCHAR(50) NOT NULL UNIQUE,
//     height  INTEGER NOT NULL,
//     status INTEGER NOT NULL
//   );
// `);
// }

//module.exports = createDbConnection();