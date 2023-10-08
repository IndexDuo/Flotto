// In map.js
// import { data } from 'cheerio/lib/api/attributes.js'
import { sanitizedZipcodes, processJsonArray } from './mapData.js'
// In map.js
// import { sanitizedZipcodes, processJsonArray } from './mapData.js'

// Make an API request to fetch your statistical data from the server
var zipArray = []

fetch('http://localhost:3000/getData/winResults/zipcodes')
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
    zipArray = data

    //data is an array with all the zipcodes
    // console.log(data)
    // Process the data using your processJsonArray function
    // processJsonArray(data)
    // console.log(sanitizedZipcodes)
  })
  .catch((error) => {
    console.error('Error fetching data from the API:', error)
  })

  // it's not possible to input multiple zipcodes at once into the google maps api, so we need to loop through the array and make a request for each zipcode. for each request, we need to get the lat and lng and add it to the map.

const apiKey = 'AIzaSyCg8cry2Qy-Hgn9c9eEMRjoZeSqsjk4ymc'

fetch(
  'https://maps.googleapis.com/maps/api/geocode/json?address=${zipString}&key=${apiKey}'
)
  .then((response) => response.json())
  .then((data) => {
    const coodinates = data.results.map((result) => ({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }))

    var map = L.map('map').setView([28.241, -83.183], 7)

    //base map layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map)

    for (const index in coodinates) {
      const coord = coordinates[index]
      L.marker([coord.lat, coord.lng]).addTo(map)
    }
  })
  .catch((error) => {
    console.error('Error:', error)
  })
