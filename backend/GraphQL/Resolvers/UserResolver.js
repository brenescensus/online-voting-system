const { GraphQLString, GraphQLObjectType } = require("graphql")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserType = require("../Types/UserType")
const User = require("../../Models/User")

const AuthUser = new GraphQLObjectType({
  name: "AuthUser",
  fields: () => ({
    name: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    type: {
      type: GraphQLString,
      resolve() {
        return "admin"
      },
    },
  }),
})

const LoginQuery = {
  type: AuthUser,
  args: { email: { type: GraphQLString }, password: { type: GraphQLString } },
  async resolve(_, args) {
    var { email, password } = args
    const user = await User.findOne({ email })
    if (!user) throw new Error("User not found")
    let comp = await bcrypt.compare(password, user.password)
    if (!comp) throw new Error("Wrong Password")
    let token = await jwt.sign(
      {
        email,
        name: user.name,
        type: "admin",
      },
      process.env.secretcode,
      { expiresIn: "2h" }
    )
    var { name, email } = user
    return { name, email, token }
  },
}

const CreateUser = {
  type: UserType,
  args: {
    email: { type: GraphQLString },
    name: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { email, name, password } = args
    const ps = await bcrypt.hash(password, 10)
    const user = new User({
      email,
      name,
      password: ps,
    })
    try {
      const u = await user.save()
      return { name, email, password: "*** HIDDEN ***" }
    } catch (e) {
      throw new Error(e)
    }
  },
}

const LoggedInUser = {
  type: AuthUser,
  args: {
    token: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { token } = args
    const user = await jwt.decode(token, process.env.secretcode)
    if (!user) {
      throw new Error("An Error Occured. Please try again...")
    }
    const au = await User.findOne({ email: user.email })
    if (!au) throw new Error("Sorry User not in our System!")
    return {
      name: au.name,
      password: "**HIDDEN**",
      email: au.email,
      token: au.token,
    }
  },
}

module.exports = { LoginQuery, CreateUser, LoggedInUser }
