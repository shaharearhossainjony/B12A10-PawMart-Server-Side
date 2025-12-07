const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@b12a10-server-cluster.hig91a4.mongodb.net/?appName=B12A10-Server-Cluster`;

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();

    const database = client.db("pawMart");
    const petSuppliesCollection = database.collection("petSupplies");
    const ordersCollection = database.collection("orders");

    app.get("/pet-supplies", async (req, res) => {
      const email = req.query.email;

      let filter = {};
      if (email) {
        filter = { email: email };
      }

      try {
        const result = await petSuppliesCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });



  
app.get('/pet-supplies', async (req, res) => {
  const email = req.query.email;

  let filter = {};
  if (email) {
    filter = { email: email };
  }

  try {
    const result = await petSuppliesCollection.find(filter).toArray();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});





app.get('/pet-supplies/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const result = await petSuppliesCollection.findOne({ _id: new ObjectId(id) });

    if (!result) {
      return res.status(404).send({ message: "No listing found" });
    }
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});



app.post('/pet-supplies', async (req, res) => {
  const petSupply = req.body;

  try {
    const result = await petSuppliesCollection.insertOne(petSupply);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});






    console.log("Connected to MongoDB successfully!");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("PawMart Server is Running");
});

app.listen(PORT, () => {
  console.log(`PawMart Server running on port: ${PORT}`);
});
