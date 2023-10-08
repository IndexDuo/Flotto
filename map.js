// In map.js
import { sanitizedZipcodes, processJsonArray } from './mapData.js'

// Make a GET request to a relative URL on the same domain as your site
fetch('/getData/winResults/zipcodes')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    // Check if the response data is an array
    if (!Array.isArray(data)) {
      console.error('API response data is not an array.')
      return
    }

    // Process the data using your processJsonArray function
    processJsonArray(data)
    console.log(sanitizedZipcodes)
  })
  .catch((error) => {
    console.error('Error fetching data from the API:', error)
  })

//var map = L.map('map').setView([28.241, -83.183], 7)

// base map layer
//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//  attribution:
//    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//}).addTo(map)
