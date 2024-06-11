import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const filePath =  path.join(__dirname, 'default.json');

export function updateConfig(key, value) {
    // Read the JSON configuration file
 
  // Read the JSON configuration file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    // Parse the JSON data
    let config;
    try {
        config = JSON.parse(data);
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
        return;
    }

    // Update the key with the new value
    config[key] = value;

    // Convert the updated object back to a JSON string
    const updatedConfig = JSON.stringify(config, null, 2);

    // Write the updated JSON back to the file
    fs.writeFile(filePath, updatedConfig, 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing to the file:', writeErr);
            return;
        }

        console.log(`Successfully updated ${key} in the configuration file.`);
    });
});
    
}