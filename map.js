import fs from 'fs'
import sanitizedZipcodes, { processJsonArray } from './mapData.js'

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
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
})

processJsonArray(jsonArray)
console.log(sanitizedZipcodes)
//var map = L.map('map').setView([28.241, -83.183], 7)

// base map layer
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//  attribution:
//    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//}).addTo(map)
