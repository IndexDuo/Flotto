import { exec } from 'child_process';
import fs from 'fs';

// Run pdf.js using child_process module
exec('node pdf.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error running pdf.js: ${error.message}`);
        return;
    }

    // read data from pdfoutput.txt
    fs.readFile('pdfoutput.txt', 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading pdfoutput.txt: ${err.message}`);
            return;
        }

        // Split the data into entries based on the date
        const entries = data.split(/\d{2}\/\d{2}\/\d{4}/); // Assumes date format MM/DD/YYYY

        // Filter out any empty entries
        const validEntries = entries.filter(entry => entry.trim().length > 0);

        // Process each entry
        const results = validEntries.map(processData);

        // Flatten the array of results if needed
        const flattenedResults = [].concat(...results);

        // Write processed data to lottery-result.json
        fs.writeFile('lottery-result.json', JSON.stringify(flattenedResults, null, 2), (err) => {
            if (err) {
                console.error(`Error writing to lottery-result.json: ${err.message}`);
                return;
            }

            console.log('Data has been converted and saved to lottery-result.json');
        });
    });
});

// define data processing logic
function processData(entry) {
    const entryData = {};

    // Split the entry into lines
    const lines = entry.trim().split('\n');

    // Check if the entry is unclaimed or expired, and skip it
    if (lines[1].trim() === 'UNCLAIMED AT THIS TIME' || lines[1].trim() === 'EXPIRED') {
        return null; // Skip this entry and move to the next one
    }

    // Process lines and populate entryData with desired fields
    entryData.date = lines[0].trim(); // Date
    entryData.buyer = lines[1].trim(); // Buyer

    // Determine the number of lines for the seller information
    let sellerLines = 1;
    if (lines[2] && !lines[2].includes('$')) {
        sellerLines = 2;
    }

    // Process seller information based on the determined number of lines
    entryData.seller = lines.slice(1, 1 + sellerLines).join(' ').trim(); // Seller
    entryData.jackpot = lines[1 + sellerLines].trim(); // Jackpot
    entryData.pay = lines[2 + sellerLines].trim(); // Pay
    entryData.prize = lines[3 + sellerLines].trim(); // Prize
    entryData.quickPlay = lines[4 + sellerLines].trim() === "Quick Pick"; // QuickPlay
    entryData.tickets = parseInt(lines[5 + sellerLines].trim()); // Tickets

    // Check if lines[7 + sellerLines] exists before accessing it
    if (lines.length >= 8 + sellerLines) {
        entryData.buyerAddress = lines[6 + sellerLines].trim(); // Buyer Address
        entryData.sellerAddress = lines[7 + sellerLines].trim(); // Seller Address
    } else {
        entryData.buyerAddress = ''; // Set to an empty string if not available
        entryData.sellerAddress = ''; // Set to an empty string if not available
    }

    return entryData;
}