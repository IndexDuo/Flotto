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

    // Use regular expression to match each entry
    const entryRegex = /Date:(.*?)Buyer:(.*?)Seller:(.*?)Jackpot:(.*?)Pay:(.*?)Prize:(.*?)Quick Pick:(.*?)Tickets:(.*?)Buyer Address:(.*?)Seller Address:(.*?)\n/g;

    let match;
    while ((match = entryRegex.exec(data)) !== null) {
        console.log('Match found:');
        console.log(match);

        const entryData = {
            date: match[1].trim(),
            buyer: match[2].trim(),
            seller: match[3].trim(),
            jackpot: match[4].trim(),
            pay: match[5].trim(),
            prize: match[6].trim(),
            quickPlay: match[7].trim() === "Quick Pick",
            tickets: parseInt(match[8].trim()),
            buyerAddress: match[9].trim(),
            sellerAddress: match[10].trim(),
        };

        processedData.push(entryData);
    }

    return processedData;
}