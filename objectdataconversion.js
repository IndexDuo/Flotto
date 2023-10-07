// objectdataconversion.mjs
import { exec } from 'child_process';

import fs from 'fs';

function convertDataToObject() {
    // Your data conversion logic here
    
    // read the pdfoutput.txt file
    fs.readFile('pdfoutput.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading pdfoutput.txt: ${err}`);
            return;
        }
        console.log(data);
    });
}

// Export functions or variables as needed
export { convertDataToObject };

// Run pdf.js script to generate pdfoutput.txt
exec('node pdf.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running pdf.mjs: ${error}`);
    return;
  }
  // Continue with data conversion once pdf.mjs is done
  convertDataToObject();
});

//hi