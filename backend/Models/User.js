const mongoose = require("mongoose")

var SomeModelSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  password: { type: String },
  email: { type: String, required: true, unique: true, lowercase: true },
})

module.exports = mongoose.model("user", SomeModelSchema)
