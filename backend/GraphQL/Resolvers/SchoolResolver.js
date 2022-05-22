const { GraphQLString, GraphQLList } = require("graphql")
const School = require("../../Models/School")
const SchoolType = require("../Types/SchoolType")

const SchoolQuery = {
  type: new GraphQLList(SchoolType),
  async resolve(_, args, req) {
    const { isAuth } = req.user
    // if (!isAuth) throw new Error("You are not authorized")
    const schools = await School.find({})
    return schools
  },
}

const AddSchoolMutation = {
  type: SchoolType,
  args: {
    code: { type: GraphQLString },
    name: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { code, name } = args
    const us = await School({
      code,
      name,
    })
    try {
      const u = await us.save()
      return u
    } catch (e) {
      throw new Error(e)
    }
  },
}

module.exports = { SchoolQuery, AddSchoolMutation }
