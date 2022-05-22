import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faAt,
  faLock,
  faAngleRight,
  faExclamationCircle,
  faGraduationCap,
  faUserAlt,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons"
import { motion } from "framer-motion"
import { gql, useApolloClient } from "@apollo/client"
import GraphQLFetch from "../Helpers/GraphQLFetch"

function Login({ reloadAuth }) {
  const [loginAs, setLoginAs] = useState(0) // 0 student 1 admin
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [stdEmail, setStdEmail] = useState("")
  const [stdPassword, setStdPassword] = useState("")
  const [adminError, setAdminError] = useState(null)

  const LOGIN_STD = gql`
  {
    studentLogin(reg_no: "${stdEmail}", password:"${stdPassword}"){
    student{
      name
      reg_no
      school{
        name
        code
      }
    }
    token
  }
  }
  `

  const client = useApolloClient()

  const [std, setStd] = useState({ error: "", data: {}, loading: false })

  return (
    <div className="login">
      {loginAs ? (
        <motion.form
          key="admin"
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          //   transition={{ duration: 2 }}
          onSubmit={async (e) => {
            e.preventDefault()
            setAdminError(null)
            let { data, errors } = await GraphQLFetch(`
            {
              login(email: "${adminEmail}", password: "${adminPassword}"){
                name
                password
                email
                token
              }
            }`)
            console.log(data, errors)
            if (errors) {
              setAdminError(errors[0].message)
            } else {
              localStorage.setItem("school-token", data.login.token)
              reloadAuth()
            }
          }}
        >
          <div className="title">Admin Login</div>
          {adminError && (
            <div className="message">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{adminError}</span>
            </div>
          )}
          <div className="linput">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faAt} />
            </label>
            <input
              onChange={(e) => setAdminEmail(e.target.value)}
              value={adminEmail}
              type="email"
              placeholder="Email Address"
              name=""
              id=""
              required
            />
          </div>
          <div className="linput">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faLock} />
            </label>
            <input
              onChange={(e) => setAdminPassword(e.target.value)}
              value={adminPassword}
              type="password"
              placeholder="Password"
              name=""
              id=""
              required
            />
          </div>
          <button className="def-btn" key="adminlogin">
            <span>Log In</span>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </motion.form>
      ) : std.loading ? (
        <div style={{ padding: 20 }}>
          <FontAwesomeIcon icon={faCircleNotch} className="rotating" /> Please
          Wait...
        </div>
      ) : (
        <motion.form
          key="student"
          layout
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          //   transition={{ duration: 1 }}
          onSubmit={async (e) => {
            setStd((s) => ({ ...s, loading: true }))
            e.preventDefault()
            try {
              const austd = await client.query({
                query: LOGIN_STD,
                // variables: { reg_no: stdEmail,  },
              })
              setStd(austd.data.studentLogin)
              localStorage.setItem(
                "school-token",
                austd.data.studentLogin.token
              )
              reloadAuth()
            } catch (er) {
              setStd({ error: er })
            }
          }}
        >
          <div className="title">Student Login</div>
          {std.error && (
            <div className="message">
              <FontAwesomeIcon icon={faExclamationCircle} />
              <span>{std.error.message}</span>
            </div>
          )}
          <div className="linput">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faGraduationCap} />
            </label>
            <input
              onChange={(e) => setStdEmail(e.target.value)}
              value={stdEmail}
              type="text"
              placeholder="Registration Number"
              name=""
              id=""
              required
            />
          </div>
          <div className="linput">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faLock} />
            </label>
            <input
              onChange={(e) => setStdPassword(e.target.value)}
              value={stdPassword}
              type="password"
              placeholder="Password"
              name=""
              id=""
              required
            />
          </div>
          <button className="def-btn" key="stdlogin">
            <span>Log In</span>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </motion.form>
      )}
      <div className="toggle-login-as">
        <div
          className="option sel"
          onClick={(e) => {
            let bts = document.querySelectorAll(".toggle-login-as .option")
            for (let b of bts) b.classList.remove("sel")
            e.target.classList.add("sel")
            setAdminEmail("")
            setAdminPassword("")
            setStdEmail("")
            setStdPassword("")
            setLoginAs(0)
          }}
        >
          <FontAwesomeIcon
            style={{ pointerEvents: "none" }}
            icon={faGraduationCap}
          />
          <span style={{ pointerEvents: "none" }}>Student</span>
        </div>
        <div
          className="option"
          onClick={(e) => {
            let bts = document.querySelectorAll(".toggle-login-as .option")
            for (let b of bts) b.classList.remove("sel")
            e.target.classList.add("sel")
            setAdminEmail("")
            setAdminPassword("")
            setStdEmail("")
            setStdPassword("")
            setLoginAs(1)
          }}
        >
          <FontAwesomeIcon style={{ pointerEvents: "none" }} icon={faUserAlt} />
          <span style={{ pointerEvents: "none" }}>Admin</span>
        </div>
      </div>
    </div>
  )
}

export default Login
