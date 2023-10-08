import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the directory of the current file


const app = express();
const port = 3000;
app.use(express.static('public'));

// MongoDB Atlas cluster connection string
const uri = 'mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

app.get('/getData/winningNumber', async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const database = client.db('florida_lottery');
        const collection = database.collection('winningNumbers');

        // Query your MongoDB Atlas collection for data
        const rawData = await collection.find({}).toArray();

        // Filter the data for date, numbers, and type
        const filteredData = rawData.map(item => ({
            date: item.date,
            numbers: item.numbers,
            type: item.type
        }));

        // Respond with the filtered data as JSON
        res.status(200).json(filteredData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        client.close();
    }
});

app.get('/getData/winningNumber/stats', async (req, res) => {
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const statistics = {};

    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');

        const database = client.db('florida_lottery');
        const collection = database.collection('winningNumbers');

        // Query your MongoDB Atlas collection for data
        const rawData = await collection.find({}).toArray();

        // Filter the data for date, numbers, and type
        const filteredData = rawData.map(item => ({
            date: new Date(item.date), // Convert date to Date object
            numbers: item.numbers,
            type: item.type
        }));

        filteredData.forEach((draw) => {
            draw.numbers.forEach((number) => {
                if (!statistics[number]) {
                    statistics[number] = {
                        times: 1,
                        lastDrawnDate: draw.date,
                    };
                } else {
                    statistics[number].times += 1;
                    if (draw.date > statistics[number].lastDrawnDate) {
                        statistics[number].lastDrawnDate = draw.date;
                    }
                }
            });
        });

        const totalDrawings = filteredData.length;
        Object.keys(statistics).forEach((number) => {
            statistics[number].percentageOfDrawings = `${((statistics[number].times / totalDrawings) * 100).toFixed(2)}%`;
            statistics[number].lastDrawnDate = statistics[number].lastDrawnDate.toLocaleDateString(); // Format date
        });

        const sortedStatistics = Object.keys(statistics).sort((a, b) => statistics[b].times - statistics[a].times).map((number) => ({ number, ...statistics[number] }));

        // Respond with the filtered data as JSON
        res.status(200).json(sortedStatistics);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Close the MongoDB connection
        client.close();
    }
});


app.get('/statistics', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'statistics.html'));
  });
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

// For CSS files
app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(__dirname + '/style.css'); // Add a slash before 'style.css'
});

app.get('/assets/images/cloud3.svg', (req, res) => {
    res.sendFile(__dirname + '/assets/images/cloud3.svg'); // Add a slash before 'style.css'
});


app.get('/dist/output.css', (req, res) => {
    res.sendFile(__dirname + '/dist/output.css'); 
});

// For JavaScript files
app.get('/map.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/map.js'); // Add a slash before 'map.js'
});

// this is the calculation provided by chatgpt - - not tested 
// app.post('/calculateWinningChance', async (req, res) => {
//     try {
//         const selectedNumbers = req.body.selectedNumbers.split(',').map(Number);

//         // Retrieve the count of past winning numbers that match the user's input
//         const matchingNumbersCount = await LotteryNumber.countDocuments({ numbers: { $all: selectedNumbers } });

//         // Calculate the winning chance as a percentage
//         const totalDrawings = await LotteryNumber.countDocuments();
//         const chance = (matchingNumbersCount / totalDrawings) * 100;

//         res.json({ chance });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.get('/getData/winResults', async (req, res) => {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    try {
      await client.connect();
      console.log('Connected to MongoDB Atlas');
  
      const database = client.db('florida_lottery');
      const collection = database.collection('lotteryResult');
  
      // Query your MongoDB Atlas collection for data
      const rawData = await collection.find({}).toArray();
      const filteredData = rawData.map(item => ({
        date: item.date,
        winner: item.buyer,
        winnerAddress: item.buyerAddress,
        seller: item.seller,
        sellerAddress: item.sellerAddress,
        jackpot: item.jackpot,
        prize: item.prize,
        pay: item.pay,
        quickPick: item.quickPick,
        tickets: item.tickets
    }));
  
      // Respond with the retrieved data as JSON
      res.status(200).json(filteredData);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      // Close the MongoDB connection
      client.close();
    }
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
