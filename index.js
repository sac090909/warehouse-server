const express = require("express");
var cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 4001;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z12ej.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const itemsCollection = client.db("furnitureWarehouse").collection("items");

    //GET - all
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = itemsCollection.find(query);
      const items = await cursor.toArray();
      res.send(items);
    });

    //GET - one
    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.findOne(query);
      res.send(result);
    });

    //POST - one
    app.post("/inventory", async (req, res) => {
      const newInventory = req.body;
      console.log(newInventory);
      const inventory = await itemsCollection.insertOne(newInventory);
      res.send(inventory);
    });

    //PUT
    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const updatedQuantity = req.body;
      const filter = { _id: ObjectId(id) };
      console.log(updatedQuantity);
      const updatedDoc = {
        $set: {
          quantity: updatedQuantity.quantity,
          // about: updatedService.about,
        },
      };

      const options = { upsert: true };
      const result = await itemsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //DELETE
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await itemsCollection.deleteOne(query);
      res.send(result);
    });

    //GET - server test
    app.get("/", (req, res) => {
      res.send("furniture warehouse inventory");
    });
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("db connected at port", port);
});
