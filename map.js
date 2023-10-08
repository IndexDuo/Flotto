import fs from 'fs'

//finding the zipcode in json
const jsonFilePath = '/dataJSON/lottery-rresult.json'

fs.readFile(jsonFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err)
    return
  }

  try {
    const jsonData = JSON.parse(data)

    if (typeof buyerAddress !== 'string') {
      console.error('buyerAddress is not a string.')
      return
    }

    let zipcode = ''
    for (let i = 0; i < buyerAddress.length; i++) {
      if (/[0-9]/.test(buyerAddress[i])) {
        zipcode += buyerAddress[i]
        if (zipcode.length === 5) {
          break
        }
      } else {
        zipcode = ''
      }
    }

    if (zipcode.length === 5) {
      console.log('Found 5 consecutive numbers:', zipcode)
    } else {
      console.log('No 5 consecutive numbers found.')
    }
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})

var map = L.map('map').setView([28.241, -83.183], 7)

// base map layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)
