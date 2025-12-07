const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@b12a10-server-cluster.hig91a4.mongodb.net/?appName=B12A10-Server-Cluster`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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

    app.get("/pet-supplies/:id", async (req, res) => {
      const id = req.params.id;

      try {
        const result = await petSuppliesCollection.findOne({
          _id: new ObjectId(id),
        });

        if (!result) {
          return res.status(404).send({ message: "No listing found" });
        }
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post("/pet-supplies", async (req, res) => {
      const petSupply = req.body;

      try {
        const result = await petSuppliesCollection.insertOne(petSupply);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.post("/orders", async (req, res) => {
      const order = req.body;

      try {
        const result = await ordersCollection.insertOne(order);

        res.send({
          success: true,
          message: "Your Order placed successfully!",
          data: result,
        });
      } catch (error) {
        res.status(500).send({ success: false, error: error.message });
      }
    });

    app.get("/orders", async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.status(400).send({ message: "Email query is required" });
      }

      try {
        const result = await ordersCollection
          .find({ buyerEmail: email })
          .toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    app.put("/update/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const data = req.body;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid ID format" });
        }

        if (!data || Object.keys(data).length === 0) {
          return res.status(400).send({ error: "No update data provided" });
        }

        const query = { _id: new ObjectId(id) };
        const updateListing = { $set: data };

        const result = await petSuppliesCollection.updateOne(
          query,
          updateListing
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "No item found to update" });
        }

        res.send({
          success: true,
          message: "Listing updated successfully",
          result,
        });
      } catch (error) {
        console.error("Update error:", error);
        res.status(500).send({
          success: false,
          message: "Server error while updating listing",
          error: error.message,
        });
      }
    });

    app.delete("/delete/:id", async (req, res) => {
      try {
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ error: "Invalid ID format" });
        }

        const query = { _id: new ObjectId(id) };
        const result = await petSuppliesCollection.deleteOne(query);

        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "No item found to delete" });
        }

        res.send({
          success: true,
          message: "Listing deleted successfully",
          result,
        });
      } catch (error) {
        console.error("Delete error:", error);
        res.status(500).send({
          success: false,
          message: "Server error while deleting listing",
          error: error.message,
        });
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
