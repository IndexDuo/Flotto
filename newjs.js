#!/usr/bin/env node

const express = require('express');
const path = require('path');
const { fileURLToPath } = require('url');
const { MongoClient } = require('mongodb');
const { exec } = require('child_process');
const http = require('http');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const compileTailwind = exec(
  'node --experimental-modules compile-tailwind.js',
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Tailwind CSS compilation error: ${error}`);
      return;
    }
  }
);

let client;

// Your routes and middleware go here

// Define your MongoDB Atlas cluster connection string
const uri = 'mongodb+srv://indexduo:index2012512@flottery.c5klhwf.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp';

app.get('/your_route', async (req, res) => {
  try {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Perform database operations here

    // Close the MongoDB connection when done
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// More routes and middleware...

// Create an HTTP server
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}