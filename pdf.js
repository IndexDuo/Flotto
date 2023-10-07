import fs from 'fs';
import pdf from 'pdf-parse';

// Read the PDF file
const pdfDataBuffer = fs.readFileSync("dataPDF/lottowinners_floridalotto.pdf");

// Parse the PDF content
pdf(pdfDataBuffer)
  .then(data => {
    // Extracted text from the PDF
    let pdfText = data.text;

    // Define the start and end markers
    const startMarker = 'Last Queried:';
    const endMarker = 'Tickets';

    // Regular expression to find all occurrences of content between start and end markers
    const contentBetweenMarkersRegex = new RegExp(`${startMarker}(.*?)${endMarker}`, 'gs');

    // Find and remove content between all occurrences of the start and end markers
    pdfText = pdfText.replace(contentBetweenMarkersRegex, '');

    // Define a regular expression to match page numbers (e.g., Page 1 of 10)
    const pagePattern = /Page \d+ of \d+/g;

    // Remove page numbers from the extracted text
    pdfText = pdfText.replace(pagePattern, '');

    // Split the text into lines
    const lines = pdfText.split('\n');

    // Filter out blank lines
    const filteredLines = lines.filter(line => line.trim() !== '');

    // Join the filtered lines to form the final text
    pdfText = filteredLines.join('\n');

    // Add a newline after the 5th digit of the ZIP code
    pdfText = pdfText.replace(/(\d{5})(\d+)/g, '$1\n$2');

    //if the line equals "EXEMPT PURSUANT TO F.S." then check if the the next line is "24.1051", if so combine the two lines into one line by adding the next line to the current line after removing the new line character
    for (let i = 0; i < filteredLines.length; i++) {
        if (filteredLines[i].includes("EXEMPT PURSUANT TO F.S.")) {
            if (filteredLines[i + 1] === "24.1051") {
                filteredLines[i] = filteredLines[i].replace(/\n/g, '') + filteredLines[i + 1];
                filteredLines.splice(i + 1, 1);
                console.log(`Line after "EXEMPT PURSUANT TO F.S." is "24.1051". New line removed and combined with previous line.`);
            } else {
                console.log(`Error: Line after "EXEMPT PURSUANT TO F.S." is not blank.`);
            }
        }
    }

    // if the line starts with a dollar sign, then check if the next character is a number until there's a letter. If so, add a new line character after the number and before the letter. If the character after the letter is a number, then add a new line character after the letter and before the number.
for (let i = 0; i < filteredLines.length; i++) {
    if (filteredLines[i].startsWith('$')) {
        let j = 1;
        console.log(`Line ${i + 1} starts with a dollar sign.`);
        while (j < filteredLines[i].length && !isNaN(filteredLines[i][j])) {
            j++;
        }
        if (j < filteredLines[i].length && /[a-zA-Z]/.test(filteredLines[i][j])) {
            filteredLines[i] = filteredLines[i].substring(0, j) + '\n' + filteredLines[i].substring(j);
            if (j + 1 < filteredLines[i].length && !isNaN(filteredLines[i][j + 1])) {
                let k = j + 1;
                while (k < filteredLines[i].length && !isNaN(filteredLines[i][k])) {
                    k++;
                }
                if (k < filteredLines[i].length && /[a-zA-Z]/.test(filteredLines[i][k])) {
                    filteredLines[i] = filteredLines[i].substring(0, k) + '\n' + filteredLines[i].substring(k);
                }
            }
        }
    }
}
    pdfText = filteredLines.join('\n');

    // Write the processed text to a .txt file (output.txt)
    fs.writeFileSync('output.txt', pdfText);

    console.log('Text with content between "10/06/2023 as of" and "Tickets" removed, blank lines removed, and ZIP code formatted.');
    console.log('Updated output.txt file.');
  })
  .catch(error => {
    console.error('An error occurred while parsing the PDF:', error);
  });
