const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`${process.env.USER_NAME} hello world`)
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.mmutbdd.mongodb.net/?appName=Cluster0`;

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
        const database = client.db('Travel_Agency').collection('Travel_Info')
        const countryData = client.db('Travel_Agency').collection('Country')

        app.post('/travel_info', async (req, res) => {
            const data = req.body;
            const result = await database.insertOne(data);
            res.send(result);
        })
         
        app.delete('/travel_info/:id', async (req, res) => {
            const id = req.params.id;
           const query = {_id: new ObjectId(id)}
            const result = await database.deleteOne(query);
            res.send(result);
        })

        app.put('/travel_info/:id',async (req,res)=>{
            const id = req.params.id;
            const data = req.body;
            const query = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updateTour = {
                $set: {
                    imageUrl: data.imageUrl,
                    touristSpotName: data.touristSpotName,
                    countryName: data.countryName,
                    location: data.location,
                    shortDescription: data.shortDescription,
                    averageCost: data.averageCost,
                    seasonality: data.seasonality,
                    travelTime: data.travelTime,
                    totalVisitorsPerYear: data.totalVisitorsPerYear
                }
            }
            const result = await database.updateOne(query, updateTour, options);
            res.send(result);
        })


        app.get('/', (req, res) => {
            res.send(`${process.env.USER_NAME} hello world`)
        })

        app.get('/travel_info',async (req,res)=>{
            const result = await database.find().toArray();
            res.send(result);
        })
        app.get('/travel_info/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await database.findOne(query);
            res.send(result);
        })

        app.get('/country_info/:country', async (req, res) => {
            const result = await database.find({countryName:req.params.country}).toArray();
            res.send(result);
        })
        app.get('/my_tour/:email', async (req, res) => {
            const result = await database.find({userEmail:req.params.email}).toArray();
            res.send(result);
        })
         
       app.get('/country',async (req,res)=>{
        const result = await countryData.find().toArray();
        res.send(result);
       })

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})
