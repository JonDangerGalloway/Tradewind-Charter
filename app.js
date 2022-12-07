const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();



const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect('mongodb+srv://JonDangerGalloway:' + process.env.ATLASPW + '@jgcluster.nwnezq1.mongodb.net/airportDB');

const airportSchema = new mongoose.Schema({
    callSign: String,
    name: String,
    lat: Number,
    long: Number,
    region: String,
    city: String
});

const Airport = mongoose.model("Airport", airportSchema);


//Test Airports for MongoDB Atlas Connection
const Amarillo = new Airport({
    callSign: "KTDW",
    name: "Tradewind Airport",
    lat: 35.1698989868,
    long: -101.825996399,
    region: "US-TX",
    city: "Amarillo" 
});


const Dallas = new Airport({
    callSign: "KRBD",
    name: "Dallas Executive Airport",
    lat: 32.6809005737,
    long: -96.8682022095,
    region: "US-TX",
    city: "Dallas"
});

const Lubbock = new Airport({
    callSign: "KLBB",
    name: "Lubbock Preston Smith International Airport",
    lat: 33.663601,
    long: -101.822998,
    region: "US-TX",
    city: "Lubbock"
});

const Denver = new Airport({
    callSign: "KDEN",
    name: "Denver International Airport",
    lat: 39.8616981506,
    long: -104.672996521,
    region: "US-CO",
    city: "Denver"
});

const Houston = new Airport({
    callSign: "KIAH",
    name: "George Bush Intercontinental Houston Airport",
    lat: 29.9843997955,
    long: -95.3414001465,
    region: "US-TX",
    city: "Houston"
});

// Airport.insertMany([Amarillo, Dallas, Lubbock, Denver, Houston], function(err) {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(("Successfully saved to airportDB"));
//     }
// });




app.get("/", function(req, res) {
    res.render("form");
});



app.post("/estimate", function(req, res) {
    let leaving = req.body.leavingFrom;
    let going = req.body.goingTo;
    let passengers = req.body.passengers;

    res.render("estimate", {goTo: leaving, comeFrom: going, passNum: passengers});
});






app.listen(3000, function() {
    console.log("TW Charter running on Port 3000");
});


