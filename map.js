// ... (fetch for zipArray)

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

    // console.log(zipArray);
    // processJsonArray(zipArray);

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
          console.log(data)
          // Extract coordinates and add them to the coordinates array
          coordinates.push(
            ...data.results.map((result) => ({
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng,
            }))
          )
        })
        .catch((error) => {
          console.error(`Error fetching data for zipcode ${zipcode}:`, error)
        })
    })

    // After all fetch requests are completed, you can work with the coordinates array here
    console.log(coordinates)

    // ... Rest of your code
  })
  .catch((error) => {
    console.error('Error fetching data from the API:', error)
  })
