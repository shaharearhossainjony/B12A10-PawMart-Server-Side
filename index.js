const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@b12a10-server-cluster.hig91a4.mongodb.net/?appName=B12A10-Server-Cluster`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");
  } finally {
    
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('PawMart Server is Running');
});


app.listen(PORT, () => {
  console.log(`PawMart Server running on port: ${PORT}`);
});
