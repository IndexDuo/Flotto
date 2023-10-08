// In map.js
// import { data } from 'cheerio/lib/api/attributes.js'
import { sanitizedZipcodes, processJsonArray } from './mapData.js'
// In map.js
// import { sanitizedZipcodes, processJsonArray } from './mapData.js'

var zipArray = []

// Make an API request to fetch your statistical data from the server

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

    //data is an array with all the zipcodes
    console.log(data)
    zipArray = data
    // Process the data using your processJsonArray function
    processJsonArray(data)
    // console.log(sanitizedZipcodes)
  })
  .catch((error) => {
    console.error('Error fetching data from the API:', error)
  })

const apiKey = 'AIzaSyCg8cry2Qy-Hgn9c9eEMRjoZeSqsjk4ymc'

const zipString = zipArray.join('|')

fetch(
  'https://maps.googleapis.com/maps/api/geocode/json?address=${zipString}&key=${apiKey}'
)
  .then((response) => response.json())
  .then((data) => {
    const coordinates = data.results.map((result) => ({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }))

    console.log(coordinates)

    var map = L.map('map').setView([28.241, -83.183], 7)

    //base map layer
    L.tileLayer(
      'https://%7Bs%7D.tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(map)

    const markers = L.markerClusterGroup()

    for (const index in coodinates) {
      const coord = coordinates[index]
      const marker = L.marker([coord.lat, coord.lng])
      markers.addLayer(marker)
    }

    map.addLayer(markers)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
