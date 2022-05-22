const { GraphQLString, GraphQLList, GraphQLObjectType } = require("graphql")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Student = require("../../Models/Student")
const StudentType = require("../Types/StudentType")
const School = require("../../Models/School")
const Candidate = require("../../Models/Candidate")

const AuthStd = new GraphQLObjectType({
  name: "AuthStd",
  fields: () => ({
    student: {
      type: StudentType,
      async resolve(_) {
        const { reg_no } = _
        const std = await Student.findOne({ reg_no })
        return std
      },
    },
    email: { type: GraphQLString },
    token: { type: GraphQLString },
    type: {
      type: GraphQLString,
      resolve() {
        return "student"
      },
    },
  }),
})

const AllStudents = {
  type: new GraphQLList(StudentType),
  async resolve() {
    var std = await Student.find({})
    return std
  },
}

const SingleStudent = {
  type: StudentType,
  args: {
    reg_no: { type: GraphQLString },
  },
  async resolve(_, args) {
    let { reg_no } = args
    var std = await Student.findOne({ reg_no })
    if (!std) throw new Error(`Student of Reg.No: ${reg_no} was not found`)
    else return std
  },
}

const removeStudent = {
  type: StudentType,
  args: {
    reg_no: { type: GraphQLString },
  },
  async resolve(_, args) {
    let { reg_no } = args
    var candidate = await Candidate.findOne({ reg_no })
    if (candidate)
      throw new Error(
        `${reg_no} is a candidate. Please remove his candidacy before deleting`
      )
    var std = await Student.findOneAndDelete({ reg_no })
    if (!std) throw new Error(`Student of Reg.No: ${reg_no} was not found`)
    else return std
  },
}

const EditStudent = {
  type: StudentType,
  args: {
    reg_no: { type: GraphQLString },
    name: { type: GraphQLString },
    school: { type: GraphQLString },
  },
  async resolve(_, args) {
    let { reg_no, school, name } = args
    var candidate = await Candidate.findOne({ reg_no })
    if (candidate)
      throw new Error(
        `${reg_no} is a candidate. Please remove his candidacy before changing any info`
      )
    var std = await Student.findOneAndUpdate({ reg_no }, { name, school })
    if (!std) throw new Error(`Student of Reg.No: ${reg_no} was not found`)
    else return std
  },
}

const StudentLogin = {
  type: AuthStd,
  args: { reg_no: { type: GraphQLString }, password: { type: GraphQLString } },
  async resolve(_, args) {
    const { reg_no, password } = args
    var std = await Student.findOne({ reg_no })
    if (!std) throw new Error("Student Not Found")
    let cc = await bcrypt.compare(password, std.password)
    if (!cc) throw new Error("Wrong Password!")
    let token = await jwt.sign(
      {
        reg_no,
        name: std.name,
        email: std.reg_no,
        type: "student",
      },
      process.env.secretcode,
      { expiresIn: "1h" }
    )
    return {
      reg_no,
      name: std.name,
      token,
    }
  },
}

const LoggedStudent = {
  type: AuthStd,
  args: {
    token: { type: GraphQLString },
  },
  async resolve(_, args) {
    const { token } = args
    const user = await jwt.decode(token, process.env.secretcode)
    if (!user) {
      throw new Error("An Error Occured. Please try again...")
    }
    const au = await Student.findOne({ reg_no: user.reg_no })
    if (!au) throw new Error("Sorry Student not in our System!")
    return {
      reg_no: au.reg_no,
    }
  },
}

const AddStudentMutation = {
  type: StudentType,
  args: {
    name: { type: GraphQLString },
    reg_no: { type: GraphQLString },
    school: { type: GraphQLString },
  },
  async resolve(_, args) {
    var { name, reg_no, school } = args

    const sch = await School.findOne({ code: school })
    if (!sch) throw new Error("School not found!")

    var password = await bcrypt.hash(reg_no, 10)
    const std = new Student({
      name,
      reg_no,
      school,
      password,
    })
    try {
      const s = await std.save()
      var { name, reg_no, school, password } = s
      return { name, reg_no, school, password: "*** HIDDEN ***" }
    } catch (e) {
      throw new Error(e)
    }
  },
}

const MyInfo = {
  type: StudentType,
  args: { reg_no: { type: GraphQLString } },
  async resolve(_, args) {
    let std = await Student.findOne({ reg_no: args.reg_no })
    return std
  },
}

module.exports = {
  AddStudentMutation,
  AllStudents,
  StudentLogin,
  LoggedStudent,
  MyInfo,
  SingleStudent,
  EditStudent,
  removeStudent,
}
