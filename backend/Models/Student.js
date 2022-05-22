const mongoose = require("mongoose")

const SomeModelSchema = mongoose.Schema({
  reg_no: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  school: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("students", SomeModelSchema)
