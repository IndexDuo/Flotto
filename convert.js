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
        let currentEntry = [];
        const entries = [];

        for (const line of lines) {
            // Use a regular expression to match the date format MM/DD/YYYY
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(line.trim())) {
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

    // Check if the buyer is "EXPIRED" or "UNCLAIMED AT THIS TIME"
    if (entryLines[1].trim() === "EXPIRED" || entryLines[1].trim() === "UNCLAIMED AT THIS TIME") {
        entryData.date = entryLines[0].trim(); // Date
        entryData.buyer = entryLines[1].trim(); // Buyer
        entryData.seller = entryLines[2].trim(); // Seller
        entryData.jackpot = entryLines[3].trim(); // Jackpot
        entryData.pay = ""; // Set pay to empty string
        entryData.prize = ""; // Set prize to empty string
        entryData.quickPick = ""; // Set quickPick to empty string
        entryData.tickets = 0; // Set tickets to 0
        entryData.buyerAddress = ""; // Set buyerAddress to empty string
        
        // Check if the prize is present and set it accordingly
        for (let i = 4; i < entryLines.length; i++) {
            const trimmedLine = entryLines[i].trim();
            if (trimmedLine.includes('$')) {
                entryData.prize = trimmedLine;
                // Increment line number for sellerAddress
                entryData.sellerAddress = entryLines[i + 1].trim(); // Assuming sellerAddress is the line after prize
                break; // Break the loop when prize is found
            }
        }
    } else {
        // Dynamically assign values based on line numbers and check line format
        entryLines.forEach((line, index) => {
            const trimmedLine = line.trim();
            switch (index) {
                case 0:
                    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmedLine)) {
                        entryData.date = trimmedLine; // Date
                    }
                    break;
                case 1:
                    entryData.buyer = trimmedLine; // Buyer
                    break;
                case 2:
                    entryData.seller = trimmedLine; // Seller
                    break;
                case 3:
                    entryData.jackpot = trimmedLine; // Jackpot
                    break;
                case 4:
                    entryData.pay = trimmedLine; // Pay
                    break;
                case 5:
                    entryData.prize = trimmedLine; // Prize
                    break;
                case 6:
                    if (trimmedLine === "Y" || trimmedLine === "N" || trimmedLine === "Y-Free") {
                        entryData.quickPick = trimmedLine; // QuickPick
                    }
                    break;
                case 7:
                    if (/^\d+$/.test(trimmedLine)) {
                        entryData.tickets = parseInt(trimmedLine); // Tickets
                    }
                    break;
                case 8:
                    entryData.buyerAddress = trimmedLine; // Buyer Address
                    break;
                case 9:
                    entryData.sellerAddress = trimmedLine; // Seller Address
                    break;
                default:
                    // Handle additional lines if needed
                    break;
            }
        });
    }

    // Check if all required fields are present, otherwise return null
    if (
        entryData.date &&
        entryData.buyer &&
        entryData.seller &&
        entryData.jackpot &&
        entryData.sellerAddress
    ) {
        return entryData;
    } else {
        return null; // Skip incomplete entries
    }
}
