const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// mongodb://localhost:27017

// const uri = `mongodb://localhost:27017`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qwxmj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client.db("furnitureItem").collection("item");

    // Item API
    app.get("/item", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const items = await cursor.limit(6).toArray();
      res.send(items);
    });

    app.get("/itemAll", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    app.get("/item/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const item = await serviceCollection.findOne(query);
      res.send(item);
    });

    // user item
    app.get("/items/:email", async (req, res) => {
      const email = req.params.email;
      console.log(email);
      const query = { email: email };
      const cursor = await serviceCollection.find(query);
      const items = await cursor.toArray();
      console.log(items);
      res.send(items);
    });

    // POST
    app.post("/item", async (req, res) => {
      const newItem = req.body;
      const result = await serviceCollection.insertOne(newItem);
      res.send(result);
    });

    // update Quantity
    app.put("/item/:id", async (req, res) => {
      const id = req.params.id;
      const updateQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          quantity: updateQuantity.quantity,
        },
      };
      const result = await serviceCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    // DELETE
    app.delete("/itemAll/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await serviceCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Furniture warehouse server");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
