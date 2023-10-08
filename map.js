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
    // console.log(data)
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
  'https://maps.googleapis.com/maps/api/geocode/json?address=${zipArray}&key=AIzaSyCg8cry2Qy-Hgn9c9eEMRjoZeSqsjk4ymc'
)
  .then((response) => response.json())
  .then((data) => {
    const coordinates = data.results.map((result) => ({
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }))

    console.log(coordinates)

    // Check if there are results
    if (coordinates.length > 0) {
      const firstResult = coordinates[0] // Assuming you want the first result
      const northeastLatLng = {
        lat: data.results[0].geometry.bounds.northeast.lat,
        lng: data.results[0].geometry.bounds.northeast.lng,
      }

      console.log('Northeast Coordinates:', northeastLatLng)
    } else {
      console.error('No coordinates found in the response.')
    }

    console.log('hello')
  })
  .catch((error) => {
    console.error('Error:', error)
  })
