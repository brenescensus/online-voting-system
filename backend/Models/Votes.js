const mongoose = require("mongoose")

var SomeModelSchema = new mongoose.Schema({
  reg_no: { type: String, required: true, lowercase: true, unique: true },
  candidate: { type: String },
})

module.exports = mongoose.model("votes", SomeModelSchema)
