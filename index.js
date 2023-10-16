const express = require('express');
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ghkhwep.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const coffeeCollections = client.db('coffeDB').collection('coffee');

        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollections.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollections.findOne(query)
            res.send(result)
        })

        app.post('/coffee', async (req, res) => {
            const addedCoffee = req.body
            console.log(addedCoffee)
            const result = await coffeeCollections.insertOne(addedCoffee)
            res.send(result)
        })

        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedCoffee = req.body;
            const coffee = {
                $set: {
                    name: updatedCoffee.name,
                    chef: updatedCoffee.chef,
                    category: updatedCoffee.category,
                    price: updatedCoffee.price,
                    quantity: updatedCoffee.quantity,
                    details: updatedCoffee.details,
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeeCollections.updateOne(filter,coffee,option)
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await coffeeCollections.deleteOne(query)
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Your server is running on port: ${port}`)
})