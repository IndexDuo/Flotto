import fs from 'fs'

const sanitizedZipcodes = []
//finding the zipcode in json
const jsonFilePath = './dataJSON/lottery-result.json'

function addToSanitizedZipCodes(zipcodes) {
  sanitizedZipcodes.push(zipcodes)
}

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err)
    return
  }

  try {
    const jsonArray = JSON.parse(data)

    if (!Array.isArray(jsonArray)) {
      console.error('JSON data is not an array.')
      return
    }

    // Loop through each JSON object
    jsonArray.forEach((jsonObj, index) => {
      const buyerAddress = jsonObj.buyerAddress

      if (typeof buyerAddress !== 'string') {
        console.error(`buyerAddress at index ${index} is not a string.`)
        return
      }

      // Sanitize the buyerAddress string by removing non-digit characters
      const sanitizedAddress = buyerAddress.replace(/[^0-9]/g, '')

      // Loop through the sanitized string to find 5 consecutive numbers
      let zipcodes = ''
      for (let i = 0; i < sanitizedAddress.length; i++) {
        zipcodes += sanitizedAddress[i]
        if (zipcodes.length === 5) {
          break // Stop when you find 5 consecutive numbers
        }
      }

      if (zipcodes.length === 5) {
        addToSanitizedZipCodes(zipcodes)
      } else {
        console.log(`No 5 consecutive numbers found at index ${index}.`)
      }
    })
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})

console.log(sanitizedZipcodes[1])

export default sanitizedZipcodes
