const sanitizedZipcodes = []
//finding the zipcode in json

function addToSanitizedZipCodes(zipcodes) {
  sanitizedZipcodes.push(zipcodes)
}

function processJsonArray(jsonArray) {
  for (const index in jsonArray) {
    const jsonObj = jsonArray[index]
    const buyerAddress = jsonObj.buyerAddress

    if (buyerAddress && typeof buyerAddress === 'string') {
      console.error(`buyerAddress at index ${index} is not a string.`)
      //this is where it messes up
      const buyerAddress = jsonData[0].buyerAddress

      if (typeof buyerAddress !== 'string') {
        console.error('buyerAddress is not a string.')
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
      }
    }
  }
}

export { sanitizedZipcodes, processJsonArray }
