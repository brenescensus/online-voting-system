const mongoose = require("mongoose")

const SomeModelSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    lowercase: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
})

module.exports = mongoose.model("school", SomeModelSchema)
