var mongoose = require("mongoose")

var high_score_schema = mongoose.Schema({
    name: String,
    score: Number
})

var high_score = mongoose.model("high_score", high_score_schema)

module.exports = high_score
