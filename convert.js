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
    
    // Define a regular expression to match the start of each entry
    const entryRegex = /Entry:\s+/g;

    // Use the regular expression to find all matches of "Entry:" followed by whitespace
    const entryMatches = [...data.matchAll(entryRegex)];

    // Iterate through each entry match and process it
    for (let i = 0; i < entryMatches.length; i++) {
        const entryStartIndex = entryMatches[i].index;
        const entryEndIndex = i + 1 < entryMatches.length
            ? entryMatches[i + 1].index
            : data.length;
        
        // Extract the text of the current entry
        const entryText = data.slice(entryStartIndex, entryEndIndex).trim();
        
        const entryData = {};
        
        // Split the entry text into lines
        const lines = entryText.split('\n');
        
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