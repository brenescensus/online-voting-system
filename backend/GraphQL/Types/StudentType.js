const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
} = require("graphql")
const Candidate = require("../../Models/Candidate")
const School = require("../../Models/School")
// const SchoolType = require("./SchoolType")

const SchoolType = new GraphQLObjectType({
  name: "SchoolT",
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

const StudentType = new GraphQLObjectType({
  name: "Student",
  fields: () => ({
    reg_no: { type: GraphQLString },
    name: { type: GraphQLString },
    school: {
      type: SchoolType,
      async resolve(_) {
        const { school } = _
        const sch = await School.findOne({ code: school })
        return sch
      },
    },
    code: { type: GraphQLString },
    isCandidate: {
      type: GraphQLBoolean,
      async resolve(_) {
        const { reg_no } = _
        const candidate = await Candidate.findOne({ reg_no })
        return !!candidate
      },
    },
  }),
})

module.exports = StudentType
