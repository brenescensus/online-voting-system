const { GraphQLString, GraphQLList } = require("graphql")
const Candidate = require("../../Models/Candidate")
const School = require("../../Models/School")
const Student = require("../../Models/Student")
const Votes = require("../../Models/Votes")
const CandidateType = require("../Types/CandidateType")
const StudentType = require("../Types/StudentType")

const ViewCandidates = {
  type: new GraphQLList(CandidateType),
  async resolve() {
    let c = await Candidate.find()
    let cl = []
    for (let s of c) {
      let std = await Student.findOne({ reg_no: s.reg_no })
      if (std) cl.push(std)
    }
    return cl
  },
}

const SchoolCandidates = {
  type: new GraphQLList(CandidateType),
  args: { school: { type: GraphQLString } },
  async resolve(_, args) {
    const { school } = args
    // console.log(args)
    let sch = await School.findOne({ code: school })
    if (!sch) throw new Error("School not found")
    let c = await Candidate.find()
    let cl = []
    for (let s of c) {
      let std = await Student.findOne({ reg_no: s.reg_no })
      if (std) cl.push(std)
    }
    return cl.filter((c) => c.school === school)
  },
}

const AddCandidate = {
  type: StudentType,
  args: { reg_no: { type: GraphQLString } },
  async resolve(_, args) {
    const { reg_no } = args
    const std = await Student.findOne({ reg_no })
    if (!std) throw new Error("Student Not Found")
    const cd = new Candidate({
      reg_no,
    })
    try {
      let c = await cd.save()
      return std
    } catch (e) {
      throw new Error(e)
    }
  },
}

const RemoveCandidate = {
  type: StudentType,
  args: { reg_no: { type: GraphQLString } },
  async resolve(_, args) {
    const { reg_no } = args
    let votes = await Votes.deleteMany({ candidate: reg_no }) // remove votes
    let candidate = await Candidate.findOneAndDelete({ reg_no })
    if (!candidate) throw new Error(`No candidate with Reg.No: ${reg_no}`)
    else return candidate
  },
}

module.exports = {
  AddCandidate,
  ViewCandidates,
  SchoolCandidates,
  RemoveCandidate,
}
