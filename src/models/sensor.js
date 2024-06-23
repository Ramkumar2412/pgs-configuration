import {sensordb } from '../utills/db.js';

export const upsertObject = (query, newObj, callback) => {
    // Find if the object exists
    sensordb.findOne(query, (err, doc) => {
        if (err) {
            return callback(err);
        }
        if (doc) {
            // Object exists, update it
            sensordb.update(query, { $set: newObj }, {}, (err, numReplaced) => {
                if (err) {
                    return callback(err);
                }
                callback(null, { updated: true, numReplaced });
            });
        } else {
            // Object does not exist, insert itdb
            sensordb.insert(newObj, (err, newDoc) => {
                if (err) {
                    return callback(err);
                }
                callback(null, { inserted: true, newDoc });
            });
        }
    });
};



// export function insertRow() {
//   const [external_slot_id, status, height] = process.argv.slice(2);
//   createDbConnection.run(
//     `INSERT INTO sharks (external_slot_id, status, height) VALUES (?, ?, ?)`,
//     [external_slot_id, status, height],
//     function (error) {
//       if (error) {
//         console.error(error.message);
//       }
//       console.log(`Inserted a row with the ID: ${this.lastID}`);
//     }
//   );
// }