import { exec } from 'child_process';
import fs from 'fs';

// Run pdf.js using child_process module
exec('node pdf.js', (error, stdout, stderr) => {
    if (error) {
        console.error('Error running pdf.js: ${error.message}');
        return;
    }

    // read data from pdfoutput.txt
    fs.readFile('pdfoutput.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading pdfoutput.txt: ${err.message}');
            return;
        }

        // process data (parse it, convert it to object)
        try {
            const processedData = processData(data);

            // write processed data to lottery-result.json
            fs.writeFile('lottery-result.json', JSON.stringify(processedData, null, 2), (err) => {
                if (err) {
                    console.error('Error writing to lottery-result.json: ${err.message}');
                    return;
                }

                console.log('Data has been converted and saved to lottery-result.json');
            })
        } catch (e) {
            console.error('Error processing data: ${e.message}');
        }
    });
}); 

// define data processing logic
function processData(data) {
    const result = [];

    // split the data into individual entries
    const entries = data.split("Entry:");

    // interate through each entry and process it
    for (const entry of entries) {
        const entryData = {};

        // extract info from the entry
        const lines = entry.trim().split('\n');

        // Check if the entry is unclaimed or expired, and skip it
        if (lines[1].trim() === 'UNCLAIMED AT THIS TIME' || lines[1].trim() === 'EXPIRED') {
            console.log("in if statement");
            continue; // Skip this entry and move to the next one
        }

        // process lines and populate entryData with desired fields
        entryData.date = lines[0].trim();       // Date
        entryData.buyer = lines[1].trim();      // Buyer
        entryData.seller = lines[2].trim();     // Seller
        entryData.jackpot = lines[3].trim();    // Jackpot
        entryData.pay = lines[4].trim();        // Pay
        entryData.prize = lines[5].trim();      // Prize
        entryData.quickPlay = lines[6].trim() === "Quick Pick"; //QuickPlay
        entryData.tickets = parseInt(lines[7].trim());  // Tickets
        entryData.buyerAddress = lines[8].trim();  // Buyer Address
        entryData.sellerAddress = lines[9].trim();  // Seller Address

        // Add the processed entryData to the result array
        result.push(entryData);
    }

    return result;
}