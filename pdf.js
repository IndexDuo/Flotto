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

    // Write the processed text to a .txt file (output.txt)
    fs.writeFileSync('output.txt', pdfText);

    console.log('Text with content between "10/06/2023 as of" and "Tickets" removed, blank lines removed, and ZIP code formatted.');
    console.log('Updated output.txt file.');
  })
  .catch(error => {
    console.error('An error occurred while parsing the PDF:', error);
  });
