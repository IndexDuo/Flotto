import { exec } from 'child_process';
import fs from 'fs';

// Initialize an empty array to store all processed entries
const result = [];

// Run pdf.js using child_process module
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

        console.log('Raw data from pdfoutput.txt:');
        console.log(data);

        // Process data (parse it, convert it to object)
        try {
            const processedData = processData(data);

            console.log('Processed data:');
            console.log(processedData);

            // Append the processedData to the result array
            result.push(...processedData);

            // Write the entire result array to lottery-result.json
            fs.writeFile('lottery-result.json', JSON.stringify(result, null, 2), (err) => {
                if (err) {
                    console.error(`Error writing to lottery-result.json: ${err.message}`);
                    return;
                }

                console.log('Data has been converted and saved to lottery-result.json');
            });
        } catch (e) {
            console.error(`Error processing data: ${e.message}`);
        }
    });
});

function processData(data) {
    const processedData = [];
    
    // Split the data into individual entries based on "Date:"
    const entries = data.split("Date:");
    
    console.log('Split entries:');
    console.log(entries); // Add this line to check the split data

    // Iterate through each entry and process it (start from index 1 to skip the first empty entry)
    for (let i = 1; i < entries.length; i++) {
        const entryData = {};
        
        // Extract lines from the entry
        const lines = entries[i].trim().split('\n');
        
        // Process lines and populate entryData with desired fields (same as before)
        entryData.date = lines[0].trim();
        entryData.buyer = lines[1].trim();
        entryData.seller = lines[2].trim();
        entryData.jackpot = lines[3].trim();
        entryData.pay = lines[4].trim();
        entryData.prize = lines[5].trim();
        entryData.quickPlay = lines[6].trim() === "Quick Pick";
        entryData.tickets = parseInt(lines[7].trim());
        entryData.buyerAddress = lines[8].trim();
        entryData.sellerAddress = lines[9].trim();
        
        // Add the processed entryData to the processedData array
        processedData.push(entryData);
    }
    
    return processedData;
}