var express = require("express")
var mongoose = require("mongoose")
var bodyparser = require("body-parser")
var high_score = require("./schemas")
var http = require("http")

var db_username = process.env.DB_USERNAME || require('./data').db_username
var db_password = process.env.DB_PASSWORD || require('./data').db_password

var app = new express()
var port = process.env.PORT || require('./data').port

app.use(bodyparser.urlencoded({extended: true}))

mongoose.connect("mongodb://" + db_username + ":" + db_password + "@ds119969.mlab.com:19969/reach-40")
mongoose.connection.on("error", function(err) {
    console.log(err)
})

mongoose.connection.once("open", function(err) {
    if (err) console.log(err)
    else console.log("Database connected...")
})

app.get("/", function(req, res) {
    res.json({"message": "Hello there! Thano here greeting you with an easter egg!"})
})

app.post("/high_score", function(req, res) {
    var name = req.body.name
    var score = Number(req.body.score)

    if ((typeof name == "string") && (typeof score == "number")) {
        high_score.findOne({name: name}, function(err, item) {

            if (err) {
                console.log(err)
                res.json({"message": "Server error, please try later."})
            }
            else if (!item) {
                high_score.create({name: name, score: score}, function(err, item) {

                    if (err || !item) {
                        console.log(err)
                        res.json({"message": "Database error, please try later."})
                    }
                    else res.json({name: item.name,score: item.score,message: "Success, score saved."})

                })
            }
            else res.json({"message": "Sorry, username taken."})
        })
    }
    else res.json({"message": "URL error, please try again."})
})

app.get("/all", function(req, res) {
    high_score.find({}, function(err, item) {
        if (err) res.json({"message": err})
        else if (!item) res.json({"message": "empty"})
        else {
            item.sort(function(a, b){
                return parseInt(a["score"]) - parseInt(b["score"])
            })

            if (item.length > 100) {
                item = item.slice(0, 99)
            }

            res.json({"message": "success", "high_scores": item})
        }
    })
})

app.listen(port, function() {
    console.log("Listening on port: " + port)

    setInterval(function() {
        http.get("http://reach-40.herokuapp.com");
    }, 1800000);
})
