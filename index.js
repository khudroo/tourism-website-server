// import modules
const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();
const cors = require("cors");
require("dotenv").config();

// DB_USER=travelBossUser
// DB_PASS=g0oQV7NUbyKtnGHY

// port
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

//  connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zfgw9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// connection function
async function run() {
  try {
    // Api call 
    await client.connect();
    const database = client.db("skyTraveler");
    const packagesCollection = database.collection("packages");

    // GET API
    app.get("/packages", async (req, res) => {
      const cursor = packagesCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    // GET SINGLE API
    app.get("/packages/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: ObjectId(id) };
      // console.log('hit specific package', id);

      const package = await packagesCollection.findOne(query);
      res.json(package);
    });

    // POST API
    app.post("/packages", async (req, res) => {
      const package = req.body;
      const result = await packagesCollection.insertOne(package);
      // console.log(result);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// initial get
app.get("/", (req, res) => {
  res.send("Sky-Traveler Server Running");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
