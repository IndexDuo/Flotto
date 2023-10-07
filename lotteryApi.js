import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 3000;

// MongoDB Atlas cluster connection string
const uri = 'mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

app.get('/getData', async (req, res) => {
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
    const data = await collection.find({ /* Your query criteria here */ }).toArray();

    // Respond with the retrieved data as JSON
    res.status(200).json(data);
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
