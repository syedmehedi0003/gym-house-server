const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//database start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nrzme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('gym-service').collection('product');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        //Post
        app.post('/service', async (req, res) => {
            const newProduct = req.body;
            const result = await serviceCollection.insertOne(newProduct);
            res.send(result);
        });

        //Update
        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // quantity: updatedData.quantity,
                    quantity: updatedData.newQuantity,


                }
            };

            const result = await serviceCollection.updateOne(filter, updateDoc, options);
            res.send(result);

        })

        //Delivered
        app.put('/deliver/:id', async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const product = await serviceCollection.findOne(filter)
            const updatedDoc = {
                $set: {
                    quantity: parseInt(product.quantity) - 1
                }
            };
            const result = await serviceCollection.updateOne(filter, updatedDoc);
            res.send(result)
        })



        //Delete
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);

        })



    }

    finally { }
}
run().catch(console.dir);

//end

app.get('/', (req, res) => {
    res.send('Runing.................');
});

app.listen(port, () => {
    console.log('Listening............', port);
})


//the end

