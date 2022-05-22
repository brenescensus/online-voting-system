const mongo = require("mongoose")

mongo
  .connect("mongodb://localhost:27017/censusval")
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Failed to connect"))

module.exports = mongo
