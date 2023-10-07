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

    // Determine the number of lines for buyer and seller
    let buyerLines = 1;
    let sellerLines = 1;

    // Check if there is an additional line for buyer or seller
    if (lines[2] && !lines[2].includes('$')) {
        // Additional line for buyer
        buyerLines = 2;
    } else if (lines[3] && !lines[3].includes('$')) {
        // Additional line for seller
        sellerLines = 2;
    }

    // Process buyer and seller lines based on the determined number of lines
    entryData.buyer = lines.slice(1, 1 + buyerLines).join(' ').trim(); // Buyer
    entryData.seller = lines.slice(1 + buyerLines, 1 + buyerLines + sellerLines).join(' ').trim(); // Seller

    entryData.jackpot = lines[1 + buyerLines + sellerLines].trim(); // Jackpot
    entryData.pay = lines[2 + buyerLines + sellerLines].trim(); // Pay
    entryData.prize = lines[3 + buyerLines + sellerLines].trim(); // Prize
    entryData.quickPlay = lines[4 + buyerLines + sellerLines].trim() === "Quick Pick"; // QuickPlay
    entryData.tickets = parseInt(lines[5 + buyerLines + sellerLines].trim()); // Tickets

    // Check if lines[9] exists before accessing it
    if (lines.length >= 10 + buyerLines + sellerLines) {
        entryData.buyerAddress = lines[6 + buyerLines + sellerLines].trim(); // Buyer Address
        entryData.sellerAddress = lines[7 + buyerLines + sellerLines].trim(); // Seller Address
    } else {
        entryData.buyerAddress = ''; // Set to an empty string if not available
        entryData.sellerAddress = ''; // Set to an empty string if not available
    }

    return entryData;
}