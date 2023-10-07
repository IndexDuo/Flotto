import { exec } from 'child_process';
import fs from 'fs';

// Run pdf.js using the child_process module
exec('node pdf.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running pdf.js: ${error.message}`);
        return;
    }

    // Read data from pdfoutput.txt
    fs.readFile('pdfoutput.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading pdfoutput.txt: ${err.message}`);
            return;
        }

        // Split data into entries based on the date
        const entries = data.split(/\d{1,2}\/\d{1,2}\/\d{4}/);

        // Process each entry separately
        const results = entries.map(entry => {
            try {
                return processData(entry);
            } catch (e) {
                console.error(`Error processing data: ${e.message}`);
                return null;
            }
        });

        // Filter out any null entries (entries that couldn't be processed)
        const processedData = results.filter(entry => entry !== null);

        // Write processed data to lottery-result.json
        fs.writeFile('lottery-result.json', JSON.stringify(processedData, null, 2), (err) => {
            if (err) {
                console.error(`Error writing to lottery-result.json: ${err.message}`);
                return;
            }

            console.log('Data has been converted and saved to lottery-result.json');
        });
    });
});

// Define data processing logic
function processData(entry) {
    const entryData = {};

    // Split the entry into lines
    const lines = entry.trim().split('\n');

    // Ensure that there are at least 8 lines in the entry
    if (lines.length < 8) {
        console.error(`Invalid entry format: ${entry}`);
        return null;
    }

    // Check if the entry is unclaimed or expired, and skip it
    if (lines[1].trim() === 'UNCLAIMED AT THIS TIME' || lines[1].trim() === 'EXPIRED') {
        return null; // Skip this entry and move to the next one
    }

    // Process lines and populate entryData with desired fields
    entryData.date = lines[0].trim();       // Date
    entryData.buyer = lines[1].trim();      // Buyer
    entryData.seller = lines[2].trim();     // Seller
    entryData.jackpot = lines[3].trim();    // Jackpot
    entryData.pay = lines[4].trim();        // Pay
    entryData.prize = lines[5].trim();      // Prize
    entryData.quickPlay = lines[6].trim() === "Quick Pick"; // QuickPlay
    entryData.tickets = parseInt(lines[7].trim());  // Tickets

    // Ensure that lines[9] exists before accessing it
    if (lines.length >= 10) {
        entryData.buyerAddress = lines[8].trim();  // Buyer Address
        entryData.sellerAddress = lines[9].trim();  // Seller Address
    } else {
        entryData.buyerAddress = ''; // Set to an empty string if not available
        entryData.sellerAddress = ''; // Set to an empty string if not available
    }

    return entryData;
}