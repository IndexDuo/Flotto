import { MongoClient } from 'mongodb';
import fs from 'fs/promises'; // Use fs/promises for async file operations

// MongoDB Atlas cluster connection string
const uri = "mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";

// JSON file containing winningNumbers data
const jsonFilePath = 'winningNumbers.json';

async function importData() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const database = client.db('florida_lottery');
    const collection = database.collection('winningNumbers');

    // Read JSON data from file
    const rawData = await fs.readFile(jsonFilePath, 'utf8');
    const data = JSON.parse(rawData);

    // Insert data into MongoDB
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents inserted`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Close the MongoDB connection
    client.close();
  }
}

// Call the importData function to start the import
importData();
