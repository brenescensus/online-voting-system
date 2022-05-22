const { GraphQLObjectType } = require("graphql")
const Student = require("../../Models/Student")
const StudentType = require("./StudentType")

const VoteType = new GraphQLObjectType({
  name: "Vote",
  fields: () => ({
    voter: {
      type: StudentType,
      async resolve(_) {
        const { voter } = _
        let std = await Student.findOne({ reg_no: voter })
        return std
      },
    },
    candidate: {
      type: StudentType,
      async resolve(_) {
        const { candidate } = _
        let std = await Student.findOne({ reg_no: candidate })
        return std
      },
    },
  }),
})

module.exports = VoteType
