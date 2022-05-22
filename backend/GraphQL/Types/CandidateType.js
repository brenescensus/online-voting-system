const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} = require("graphql")
const Student = require("../../Models/Student")
const Votes = require("../../Models/Votes")
const SchoolType = require("./SchoolType")
const StudentType = require("./StudentType")

const CandidateType = new GraphQLObjectType({
  name: "Candidato",
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
    voters: {
      type: new GraphQLList(StudentType),
      async resolve(_) {
        const { reg_no } = _
        const votes = await Votes.find({ candidate: reg_no })
        let v = []
        for (let c of votes) {
          let vv = await Student.findOne({ reg_no: c.reg_no })
          v.push(vv)
        }
        return v
      },
    },
    voteCount: {
      type: GraphQLInt,
      async resolve(_) {
        const { reg_no } = _
        const votes = await Votes.find({ candidate: reg_no })
        return votes.length
      },
    },
  }),
})

module.exports = CandidateType
