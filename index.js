const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oiiyhkk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const carsColletction = client.db("carsDB").collection("cars");
    const cartColletction = client.db("carsDB").collection("cart");
    const brandColletction = client.db("carsDB").collection("brand");

    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      console.log(newCar);
      const result = await carsColletction.insertOne(newCar);
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const car = req.body;
      console.log(car);
      const result = await cartColletction.insertOne(car);
      res.send(result);
    });

    app.get("/cars", async (req, res) => {
      const cursor = carsColletction.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brand", async (req, res) => {
      const cursor = brandColletction.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carsColletction.findOne(query);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = cartColletction.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartColletction.deleteOne(query);
      res.send(result);
    });

    app.put("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateCar = req.body;
      const options = { upsert: true };
      const updatedCar = {
        $set: {
          brand_name: updateCar.brand_name,
          car_name: updateCar.car_name,
          car_image: updateCar.car_image,
          body_type: updateCar.body_type,
          price: updateCar.price,
          short_description: updateCar.short_description,
          rating: updateCar.rating,
        },
      };
      const result = await carsColletction.updateOne(filter, updatedCar, options);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
