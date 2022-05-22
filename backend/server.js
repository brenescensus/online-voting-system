const { graphqlHTTP } = require("express-graphql")
const app = require("express")()
const cors = require("cors")

const schema = require("./GraphQL/Schema")
const dotenv = require("dotenv")
const auth = require("./Middlewares/Auth")

dotenv.config()
require("./db")

app.use(cors())

app.use(
  "/source",
  auth,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(4000, () => {
  console.log("Server started")
})
