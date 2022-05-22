const { GraphQLObjectType, GraphQLString } = require("graphql")

const loggedIn = new GraphQLObjectType({
  name: "lg",
  fields: () => ({
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    type: { type: GraphQLString },
  }),
})

const LoggedIn = {
  type: loggedIn,
  async resolve(_, args, req) {
    const { isAuth } = req.user
    if (isAuth) return req.user.details
    else throw new Error("You are not logged In")
  },
}

module.exports = { LoggedIn }
