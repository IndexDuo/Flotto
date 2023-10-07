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

    // Create an array to store the reformatted sections
    const reformattedSections = [];

    let currentSection = '';

    // Iterate through the lines to reformat the sections
    for (let i = 0; i < filteredLines.length; i++) {
      const line = filteredLines[i];
      const currentDateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (currentDateRegex.test(line)) {
        // If it's a date, add the current section to the array
        if (currentSection !== '') {
          reformattedSections.push(currentSection.trim());
        }

        // Start a new section with the date
        currentSection = line;
      } else {
        // Append the current line to the current section
        currentSection += `\n${line}`;
      }
    }

    // Add the last section
    reformattedSections.push(currentSection.trim());

    // Join the reformatted sections to form the final text
    const formattedText = reformattedSections.map(section => {
      return section
        .replace(/(\$\d+(?:\.\d{2})?)([A-Z]\d+)/g, '$1\n$2')
        .replace(/(\d{5})(?=\d)/g, '$1\n')
        .replace(/(\d{5})\s+/g, '$1 ')
        .replace(/(?<=\d)\s+/g, '\n');
    }).join('\n\n');

    // Write the processed text to a .txt file (output.txt)
    fs.writeFileSync('output.txt', formattedText);

    console.log('Text with content between "10/06/2023 as of" and "Tickets" removed, blank lines removed, and reorganized as per your specified structure.');
    console.log('Updated output.txt file.');
  })
  .catch(error => {
    console.error('An error occurred while parsing the PDF:', error);
  });
