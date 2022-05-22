const mongoose = require("mongoose")

const SomeModelSchema = mongoose.Schema({
  reg_no: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
})

module.exports = mongoose.model("candidate", SomeModelSchema)
