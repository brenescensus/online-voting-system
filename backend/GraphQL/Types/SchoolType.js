const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql")
const Student = require("../../Models/Student")
const StudentType = require("./StudentType")

const SchoolType = new GraphQLObjectType({
  name: "School",
  fields: () => ({
    name: { type: GraphQLString },
    code: { type: GraphQLString },
    students: {
      type: new GraphQLList(StudentType),
      async resolve(_) {
        const { code } = _
        let std = await Student.find({ school: code })
        return std
      },
    },
  }),
})

module.exports = SchoolType
