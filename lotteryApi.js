import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url' // Import fileURLToPath
import { MongoClient } from 'mongodb'
import { exec } from 'child_process'

const __filename = fileURLToPath(import.meta.url) // Get the current filename
const __dirname = path.dirname(__filename) // Get the directory of the current file

const compileTailwind = exec(
  'node --experimental-modules compile-tailwind.js',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Tailwind CSS compilation error: ${error}`)
      return
    }
    // console.log(`Tailwind CSS compilation success: ${stdout}`)
    // console.error(`Tailwind CSS compilation stderr: ${stderr}`)
  }
)

let client
const app = express()
const port = process.env.PORT || 3000
app.use(express.static('public'))
app.use(express.json())

// MongoDB Atlas cluster connection string
const uri =
  'mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp'

app.get('/userForm', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/userInput.html'))
})

app.get('', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/getData/winningNumber', async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB Atlas')

    const database = client.db('florida_lottery')
    const collection = database.collection('winningNumbers')

    // Query your MongoDB Atlas collection for data
    const rawData = await collection.find({}).toArray()

    // Filter the data for date, numbers, and type
    const filteredData = rawData.map((item) => ({
      date: item.date,
      numbers: item.numbers,
      type: item.type,
    }))

    // Respond with the filtered data as JSON
    res.status(200).json(filteredData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    // Close the MongoDB connection
    client.close()
  }
})

app.get('/getData/winningNumber/stats', async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const statistics = {}

  try {
    await client.connect()
    console.log('Connected to MongoDB Atlas')

    const database = client.db('florida_lottery')
    const collection = database.collection('winningNumbers')

    // Query your MongoDB Atlas collection for data
    const rawData = await collection.find({}).toArray()

    // Filter the data for date, numbers, and type
    const filteredData = rawData.map((item) => ({
      date: new Date(item.date), // Convert date to Date object
      numbers: item.numbers,
      type: item.type,
    }))

    filteredData.forEach((draw) => {
      draw.numbers.forEach((number) => {
        if (!statistics[number]) {
          statistics[number] = {
            times: 1,
            lastDrawnDate: draw.date,
          }
        } else {
          statistics[number].times += 1
          if (draw.date > statistics[number].lastDrawnDate) {
            statistics[number].lastDrawnDate = draw.date
          }
        }
      })
    })

    const totalDrawings = filteredData.length
    Object.keys(statistics).forEach((number) => {
      statistics[number].percentageOfDrawings = `${(
        (statistics[number].times / totalDrawings) *
        100
      ).toFixed(2)}%`
      statistics[number].lastDrawnDate =
        statistics[number].lastDrawnDate.toLocaleDateString() // Format date
    })

    const sortedStatistics = Object.keys(statistics)
      .sort((a, b) => statistics[b].times - statistics[a].times)
      .map((number) => ({ number, ...statistics[number] }))

    // Respond with the filtered data as JSON
    res.status(200).json(sortedStatistics)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    // Close the MongoDB connection
    client.close()
  }
})

app.get('/getData/coordinates', async (req, res) => {
  res.sendFile(path.join(__dirname, 'coordinates.json'))
})

app.get('/statistics', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'statistics.html'))
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// For CSS files
app.get('/style.css', (req, res) => {
  res.setHeader('Content-Type', 'text/css')
  res.sendFile(__dirname + '/style.css') // Add a slash before 'style.css'
})

app.get('/assets/images/cloud3.svg', (req, res) => {
  res.sendFile(__dirname + '/assets/images/cloud3.svg') // Add a slash before 'style.css'
})

app.get('/dist/output.css', (req, res) => {
  res.sendFile(__dirname + '/dist/output.css')
})

// For JavaScript files
app.get('/map.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript')
  res.sendFile(__dirname + '/map.js') // Add a slash before 'map.js'
})

app.post('/calculateWinningChance/2', async (req, res) => {
  try {
    const selectedNumbers = req.body.selectedNumbers.split(',').map(String) // Convert selectedNumbers to strings

    console.log('Selected Numbers:', selectedNumbers)

    if (selectedNumbers.length !== 6) {
      res.status(400).json({ error: 'Invalid input. Please enter 6 numbers.' })
      return
    }

    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    try {
      await client.connect()
      console.log('Connected to MongoDB Atlas')
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'Internal server error' })
    } finally {
      // Close the MongoDB connection
      client.close()
    }

    const database = client.db('florida_lottery')
    const collection = database.collection('winningNumbers') // Reference to the collection

    const chances = {
      allSix: '0.00000435587%',
      fiveOutOfSix: '0.00122835786%',
      fourOutOfSix: '0.07063044737%',
      threeOutOfSix: '1.42857142857%',
      twoOutOfSix: '0.11655011655%',
      oneOutOfSix: '11.320754717%',
    }

    res.status(200).json({ chances })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    // Close the MongoDB connection
    client.close()
  }
})

// this is the calculation provided by chatgpt - - not tested
app.post('/calculateWinningChance', async (req, res) => {
  try {
    const selectedNumbers = req.body.selectedNumbers.split(',').map(Number)

    /*   client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    await client.connect()
    console.log('Connected to MongoDB Atlas')

    const database = client.db('florida_lottery')
    const collection = database.collection('winningNumbers') // Reference to the collection

        const statistics = {}; // Store the statistics data
 */
    /*         // Query your MongoDB Atlas collection for statistics data
        const rawData = await collection.find({}).toArray();

        // Filter the data for numbers and times
        rawData.forEach((item) => {
            statistics[item.number] = {
                times: item.times,
                lastDrawnDate: item.lastDrawnDate,
                percentageOfDrawings: item.percentageOfDrawings,
            };
        });

        // Calculate the total count of matching numbers and the total drawings
        let matchingNumbersCount = 0;
        const totalDrawings = rawData.length;

        selectedNumbers.forEach((number) => {
            if (statistics[number]) {
                matchingNumbersCount += statistics[number].times;
            }
        }); */

    let allSix = 0
    let fiveOutOfSix = 0
    let fourOutOfSix = 0
    let threeOutOfSix = 0
    let twoOutOfSix = 0
    let oneOutOfSix = 0

    // Calculate the winning chance as a percentage
    const chances = {
      allSix: '0.00000435587%',
      fiveOutOfSix: '0.00122835786%',
      fourOutOfSix: '0.07063044737%',
      threeOutOfSix: '1.42857142857%',
      twoOutOfSix: '0.11655011655%',
      oneOutOfSix: '11.320754717%',
    }

    res.json({ chances })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    if (client) {
      // Close the MongoDB connection if 'client' is defined
      client.close()
    }
  }
})

app.get('/getData/winResults', async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB Atlas')

    const database = client.db('florida_lottery')
    const collection = database.collection('lotteryResult')

    // Query your MongoDB Atlas collection for data
    const rawData = await collection.find({}).toArray()
    const filteredData = rawData.map((item) => ({
      date: item.date,
      winner: item.buyer,
      winnerAddress: item.buyerAddress,
      seller: item.seller,
      sellerAddress: item.sellerAddress,
      jackpot: item.jackpot,
      prize: item.prize,
      pay: item.pay,
      quickPick: item.quickPick,
      tickets: item.tickets,
    }))

    // Respond with the retrieved data as JSON
    res.status(200).json(filteredData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    // Close the MongoDB connection
    client.close()
  }
})

app.get('/getData/winResults/zipcodes', async (req, res) => {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  try {
    await client.connect()
    console.log('Connected to MongoDB Atlas')

    const database = client.db('florida_lottery')
    const collection = database.collection('lotteryResult')

    // Query your MongoDB Atlas collection for data
    const rawData = await collection.find({}).toArray()

    // Extract zipcodes from the rawData array
    const addresses = rawData.map((item) => ({
      winnerAddress: item.buyerAddress,
    }))
    const zipcodes = addresses.map((addressObj) => {
      const winnerAddress = addressObj.winnerAddress
      // Use a regular expression to match the zip code pattern (5 digits)
      const zipCodeMatch = winnerAddress.match(/\d{5}/)
      // Check if a zip code was found and return it, or return an empty string if not found
      return zipCodeMatch ? zipCodeMatch[0] : ''
    })
    const nonEmptyZipcodes = zipcodes.filter((zipcode) => zipcode !== '')

    res.status(200).json(nonEmptyZipcodes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  } finally {
    // Close the MongoDB connection
    client.close()
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
