const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {
    MongoClient
} = require('mongodb');
const { json } = require('body-parser');
require('dotenv').config();
const app = express();
const client = new MongoClient(process.env.MONGO_CONNECTION);
client.connect().then(() => console.log("Connected to db"));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
//comment out cors after its working to see if app breaks.
app.use(cors());
app.use(express.json());

//Comment this out after its working to see if app breaks.
app.use(express.urlencoded({
    extended: true
}))

//UNCOMMENT TO ADD TO DB

// mongoose.connect('mongodb+srv://' + MONGO_CREDENTIALS + '@jgcluster.nwnezq1.mongodb.net/airportDB');

// const airportSchema = new mongoose.Schema({
//     callSign: String,
//     name: String,
//     lat: Number,
//     long: Number,
//     region: String,
//     city: String
// });

// const Airport = mongoose.model("Airport", airportSchema);

// Airport.insertMany([riverFalls, rickHusband, love, dfw, hobby, ny, ohare], function(err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Sucessfully saved to the airportDB");
//     }
// });


app.get("/", (req, res) => {
    res.render("form");
});



app.get("/searchtwo", async (req, res) => {
    try {
        if (req.query.name) {
            let results;
        if (req.query.name.includes(",") || req.query.name.includes(" ")) {
            results = await client
                .db("airportDB")
                .collection("airports")
                .aggregate([

                    {
                        $search: {
                            index: "airportSearch",
                            compound: {
                                must: [{
                                    text: {
                                        query: req.query.name,
                                        path: "name",
                                        fuzzy: {
                                            maxEdits: 1,
                                        },
                                    },
                                }, ],
                            },
                        },
                    },
                    {
                        $limit: 10,
                    },
                    {
                        $project: {
                            _id: 1,
                            callSign: 1,
                            name: 1,
                            lat: 1,
                            long: 1,
                            region: 1,
                            city: 1,
                            score: {
                                $meta: "searchScore"
                            },
                        },
                    },

                ])
                .toArray();
            return res.send(results);

        }

        
            results = await client
                .db("airportDB")
                .collection("airports")
                .aggregate([

                    {
                        $search: {
                            index: "airportSearch",
                            compound: {
                                must: [{
                                    text: {
                                        query: req.query.name,
                                        path: "callSign",
                                        fuzzy: {
                                            maxEdits: 1,
                                        },
                                    },
                                }, ],
                            },
                        },
                    },
                    {
                        $limit: 10,
                    },
                    {
                        $project: {
                            _id: 1,
                            callSign: 1,
                            name: 1,
                            lat: 1,
                            long: 1,
                            region: 1,
                            city: 1,
                            score: {
                                $meta: "searchScore"
                            },
                        },
                    },

                ])
                .toArray();
                
            return res.send(results);
            

        

    }
    res.send([]);
    } catch (error) {
        console.error(error);
        res.send([]);
    }

});

app.get("/", async (req, res) => {
    let result = await client.db("airportDB").collection("airports").findOne({
        city: "Amarillo"
    })
    res.send(result);

});



app.post("/estimate", (req, res) => {
    let leaving = req.body.leavingFrom;
    let going = req.body.goingTo;
    let passengers = req.body.passengers;

    res.render("estimate", {
        goTo: leaving,
        comeFrom: going,
        passNum: passengers
    });
});






app.listen(3000, () => {
    console.log("TW Charter running on Port 3000");
});