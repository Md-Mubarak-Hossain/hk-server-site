const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5003;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("user server!");
});
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@hkcluster.kwmicca.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const database = client.db("HK");
        const userCollection = database.collection("users");

        app.get("/user", async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });
        app.get("/user/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });
        app.post("/user", async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });
        app.patch('/user/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const users = req.body;
            const updateDoc = {
                $set: {
                    email: users.email,
                    name: users.name,
                    sector: users.sector,
                    terms: users.terms,
                }
            }
            const result = await userCollection.updateOne(filter, updateDoc)
            res.send(result)
        })
        app.delete("/user/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });
    } finally {
        // await client.close();
    }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
    console.log(`HK app listening on port ${port}`);
});