// Declare zipArray in a higher scope
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

    // Push the zipcodes into zipArray
    zipArray = zipArray.concat(data)

    // Call a function or perform operations that depend on zipArray here
    // For example, you can call processJsonArray or do something else

    // Continue with your other code here
    const apiKey = 'AIzaSyCg8cry2Qy-Hgn9c9eEMRjoZeSqsjk4ymc'

    // Initialize an array to store coordinates
    var coordinates = []

    // Loop through zipArray and make requests for each zipcode
    zipArray.forEach((zipcode) => {
      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=${apiKey}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'OK' && data.results.length > 0) {
            const result = data.results[0] // Assuming you want the first result

            if (result.geometry && result.geometry.bounds) {
              const northeast = result.geometry.bounds.northeast
              if (northeast) {
                const { lat, lng } = northeast
                coordinates.push({ lat, lng })
              }
            }
            console.log(coordinates)
          }
        })
        .catch((error) => {
          console.error(`Error fetching data for zipcode ${zipcode}:`, error)
        })
        .finally(() => {
          // Check if all fetch requests are completed
          if (coordinates.length === zipArray.length) {
            // console.log(coordinates)
            // Continue with your code that depends on the coordinates array
          }
        })
    })
  })
