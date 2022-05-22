const { GraphQLString, GraphQLList } = require("graphql")
const Student = require("../../Models/Student")
const Candidate = require("../../Models/Candidate")
const Votes = require("../../Models/Votes")
const VoteType = require("../Types/VoteType")
const StudentType = require("../Types/StudentType")
const School = require("../../Models/School")
const { max } = require("moment")

const CastVote = {
  type: VoteType,
  args: { reg_no: { type: GraphQLString }, candidate: { type: GraphQLString } },
  async resolve(_, args) {
    const { reg_no, candidate } = args
    const std = await Student.findOne({ reg_no })
    if (!std) throw new Error("Student not found!")

    // check candidates
    const cds = await Candidate.find({})
    let cdss = []
    for (let c of cds) {
      let cc = await Student.findOne({ reg_no: c.reg_no })
      if (cc && cc.school === std.school) {
        cdss.push(cc)
      }
    }

    // selected candidate
    let sd = cdss.filter((c) => c.reg_no === candidate)
    if (sd.length < 1) throw new Error("Candidate not available for you")

    // proceed with the vote
    let v = new Votes({
      reg_no,
      candidate,
    })
    try {
      let vv = await v.save()

      return {
        voter: reg_no,
        candidate,
      }
    } catch (e) {
      throw new Error(e)
    }
  },
}

const meVoted = {
  type: VoteType,
  args: { reg_no: { type: GraphQLString } },
  async resolve(_, args) {
    let vot = await Votes.findOne({ reg_no: args.reg_no })
    if (!vot) throw new Error("You have not voted")
    return {
      voter: vot.reg_no,
      candidate: vot.candidate,
    }
  },
}

const Winners = {
  type: new GraphQLList(StudentType),
  async resolve() {
    let winners = []
    let schools = await School.find({})
    for (let s of schools) {
      let mc = []
      let cand = await Candidate.find({})
      // console.log(cand)
      let cds = await Student.find({
        school: s.code,
        reg_no: { $in: cand.map((c) => c.reg_no) },
      })

      for (let c of cds) {
        mc.push({ ...c._doc })
      }

      for (let c of mc) {
        let votes = await Votes.find({ candidate: c.reg_no })
        c.voteCount = votes.length
      }

      let mx = Math.max(...mc.map((c) => c.voteCount))

      let w = mc.filter((c) => c.voteCount === mx)
      winners.push(w.length === 1 ? w[0] : "tie")
    }
    return winners.filter((w) => w !== "tie")
  },
}

module.exports = { CastVote, Winners, meVoted }
