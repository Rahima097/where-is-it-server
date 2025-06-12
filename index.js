const express = require('express')
const cors = require('cors')
const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // PATCH: Update item status to 'recovered'
        app.patch("/items/:id/status", async (req, res) => {
            const id = req.params.id;
            const item = await itemsCollection.findOne({ _id: new ObjectId(id) });

            if (!item) {
                return res.status(404).send({ error: "Item not found" });
            }

            if (item.status === "recovered") {
                return res.status(400).send({ error: "Item already recovered" });
            }

            const result = await itemsCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { status: "recovered" } }
            );

            res.send(result);
        });

        // POST: Add recovery details
        app.post("/recovered", async (req, res) => {
            try {
                const recoveryData = req.body;
                const { itemId, recoveredDate, recoveredLocation } = recoveryData;

                if (!itemId || !recoveredLocation || !recoveredDate) {
                    return res.status(400).send({ error: "Missing required recovery fields" });
                }

                const item = await itemsCollection.findOne({ _id: new ObjectId(itemId) });

                if (!item) return res.status(404).send({ error: "Item not found" });
                if (item.status === "recovered") return res.status(400).send({ error: "Item already recovered" });

                const recoveryResult = await recoveredCollection.insertOne(recoveryData);

                const updateResult = await itemsCollection.updateOne(
                    { _id: new ObjectId(itemId) },
                    { $set: { status: "recovered" } }
                );

                res.send({ message: "Item marked as recovered", result: recoveryResult, updated: updateResult });
            } catch (error) {
                console.error(error);
                res.status(500).send({ error: "Server error during recovery" });
            }
        });

        // GET items created by a specific user (filter by user email)
        app.get('/myItems', async (req, res) => {
            let userEmail = req.query.email;
            if (!userEmail) {
                return res.status(400).send({ error: 'User email is required' });
            }
            // Normalize email to lowercase
            userEmail = userEmail.toLowerCase();
            try {
                const userItems = await itemsCollection.find({ contactEmail: userEmail }).toArray();
                res.send(userItems);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch user items' });
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