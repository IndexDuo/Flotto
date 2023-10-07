import { MongoClient } from 'mongodb';
import fs from 'fs/promises'; // Use fs/promises for async file operations

// MongoDB Atlas cluster connection string
const uri = "mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

// JSON file containing winningNumbers data
const winningNumberjsonFilePath = './dataJSON/winningNumbers.json';
const lotteryResultjsonFilePath = './dataJSON/lottery-result.json';

async function importData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('florida_lottery');
    const collectionWin = database.collection('winningNumbers');
    const collectionLottery = database.collection('lotteryResult');

    // Read JSON data from file
    const rawDataWin = await fs.readFile(winningNumberjsonFilePath, 'utf8');
    const dataWin = JSON.parse(rawDataWin);

    const rawDataResult = await fs.readFile(lotteryResultjsonFilePath, 'utf8');
    const dataResult = JSON.parse(rawDataResult);

    // Delete all existing documents in the collection
    await collectionWin.deleteMany({});
    await collectionLottery.deleteMany({});

    // Insert new data into MongoDB
    const result = await collectionWin.insertMany(dataWin);
    console.log(`${result.insertedCount} documents inserted into winningNumbers collection`);

    const result2 = await collectionLottery.insertMany(dataResult);
    console.log(`${result2.insertedCount} documents inserted into lotteryResult collection`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

// Call the importData function to start the import
importData();

