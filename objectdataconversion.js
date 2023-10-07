// objectdataconversion.mjs
import { exec } from 'child_process'

import fs from 'fs'

function convertDataToObject() {
  // Your data conversion logic here

  // read the pdfoutput.txt file
  fs.readFile('pdfoutput.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading pdfoutput.txt: ${err}`)
      return
    }
    // console.log(data);
    // sort the data into an object. The object should have the following structure: {
    //   "date": "8/30/2023"
    //   "buyer": "EXEMPT PURSUANT TO F.S.24.1051",
    //   "seller": "TOWN STAR #491",
    //   "jackpot": "$3,750,000",
    //   "pay": "CASH OPTION",
    //   "prize": "$2,099,143.75",
    //   "quickPlay": false,
    //   "tickets": 1,
    //   "buyerAddress": "SEBRING, FL 33871",
    //   "sellerAddress": "1865 HIGHWAY 70 WEST, OKEECHOBEE"
    // }
    //
    // write the object to a .json file (output.json)
    fs.writeFileSync('output.json', JSON.stringify(data))
    console.log('Updated output.json file.')
  })
}

// Export functions or variables as needed
export { convertDataToObject }

// Run pdf.js script to generate pdfoutput.txt
exec('node pdf.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error running pdf.mjs: ${error}`)
    return
  }
  // Continue with data conversion once pdf.mjs is done
  convertDataToObject()
})
