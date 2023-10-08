import fs from 'fs'

//finding the zipcode in json
const jsonFilePath = './dataJSON/lottery-result.json'

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

    // 4. Loop through each JSON object
    jsonArray.forEach((jsonObj, index) => {
      const buyerAddress = jsonObj.buyerAddress

      if (typeof buyerAddress !== 'string') {
        console.error(`buyerAddress at index ${index} is not a string.`)
        return
      }

      // 5. Sanitize the buyerAddress string by removing non-digit characters
      const sanitizedAddress = buyerAddress.replace(/[^0-9]/g, '')

      // 6. Loop through the sanitized string to find 5 consecutive numbers
      let zipcodes = ''
      for (let i = 0; i < sanitizedAddress.length; i++) {
        zipcodes += sanitizedAddress[i]
        if (zipcodes.length === 5) {
          break // Stop when you find 5 consecutive numbers
        }
      }

      if (consecutiveNumbers.length === 5) {
        console.log(
          `Found 5 consecutive numbers at index ${index}:`,
          consecutiveNumbers
        )
      } else {
        console.log(`No 5 consecutive numbers found at index ${index}.`)
      }
    })
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})
