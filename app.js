const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));




app.get("/", function(req, res) {
    let jsTitle = "";
    res.render("form", {ejsTitle: jsTitle});
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