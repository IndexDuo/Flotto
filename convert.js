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

        // Split the data into lines
        const lines = data.split('\n');
        let currentEntry = []; // Store lines for the current entry
        const entries = [];

        for (const line of lines) {
            // Check if the line matches the date format MM/DD/YYYY
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(line)) {
                // If a new date is encountered, process the previous entry
                if (currentEntry.length > 0) {
                    const entry = processData(currentEntry);
                    if (entry) {
                        entries.push(entry);
                    }
                }
                // Start a new entry with the current line as the date
                currentEntry = [line];
            } else {
                // Add the line to the current entry
                currentEntry.push(line);
            }
        }

        // Process the last entry if it exists
        if (currentEntry.length > 0) {
            const entry = processData(currentEntry);
            if (entry) {
                entries.push(entry);
            }
        }

        // Write processed data to lottery-result.json
        fs.writeFile('lottery-result.json', JSON.stringify(entries, null, 2), (err) => {
            if (err) {
                console.error(`Error writing to lottery-result.json: ${err.message}`);
                return;
            }

            console.log('Data has been converted and saved to lottery-result.json');
        });
    });
});

// define data processing logic
function processData(entryLines) {
    const entryData = {};

    // Process lines and populate entryData with desired fields
    entryData.date = entryLines[0].trim();       // Date
    entryData.buyer = entryLines[1].trim();      // Buyer
    entryData.seller = entryLines[2].trim();     // Seller
    entryData.jackpot = entryLines[3].trim();    // Jackpot
    entryData.pay = entryLines[4].trim();        // Pay
    entryData.prize = entryLines[5].trim();      // Prize
    entryData.quickPlay = entryLines[6].trim() === "Quick Pick"; //QuickPlay
    entryData.tickets = parseInt(entryLines[7].trim());  // Tickets
    entryData.buyerAddress = entryLines[8].trim();  // Buyer Address
    entryData.sellerAddress = entryLines[9].trim();

    return entryData;
}
