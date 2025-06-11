const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j1rskl2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db("whereIsItDB");
        const itemsCollection = db.collection("items");
        const recoveredCollection = db.collection("recovered");

        //  POST add new item
        app.post("/items", async (req, res) => {
            const newItem = req.body;
            newItem.status = "available";
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        app.post("/items", async (req, res) => {
            const newItem = req.body;
            newItem.status = "available";
            const result = await itemsCollection.insertOne(newItem);
            res.send(result);
        });

        // GET all items with optional search filter by title or location
        app.get("/items", async (req, res) => {
            const search = req.query.search || "";
            const filter = search
                ? {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { location: { $regex: search, $options: "i" } },
                    ],
                }
                : {};

            const items = await itemsCollection.find(filter).toArray();
            res.send(items);
        });

        // GET single item by ID
        app.get("/items/:id", async (req, res) => {
            const id = req.params.id;
            try {
                const item = await itemsCollection.findOne({ _id: new ObjectId(id) });
                if (!item) {
                    return res.status(404).send({ error: "Item not found" });
                }
                res.send(item);
            } catch (err) {
                res.status(500).send({ error: "Invalid ID format or server error" });
            }
        });




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('WhereIsIt website running')
})

app.listen(port, () => {
    console.log(`WhereIsIt website server is running port ${port} `)
})