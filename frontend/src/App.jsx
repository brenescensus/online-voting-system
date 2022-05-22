import "./App.scss"
import { useState, useEffect } from "react"
import Login from "./Pages/Login"
import GraphQLFetch from "./Helpers/GraphQLFetch"
import Admin from "./Admin"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Students from "./Pages/Students"
import Schools from "./Pages/Schools"
import Candidates from "./Pages/Candidates"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSignOut, faUser } from "@fortawesome/free-solid-svg-icons"
import Student from "./Pages/Student"
import Sidebar from "./Pages/Sidebar"

function App() {
  const [auth, setAuth] = useState({ error: null, data: {}, loading: false })

  useEffect(() => {
    loadAuth()
  }, [])

  async function loadAuth() {
    setAuth({ error: null, data: {}, loading: false })
    let { errors, data } = await GraphQLFetch(`{loggedIn{
      name
      email
      type
    }}`)
    if (errors) {
      setAuth({ error: errors[0].message, data: {}, loading: false })
    } else {
      setAuth({ error: null, data: data.loggedIn, loading: true })
      setTimeout(() => {
        setAuth({ error: null, data: data.loggedIn, loading: false })
      }, 500)
    }
  }

  return auth.loading ? (
    <>Loading...</>
  ) : (
    <>
      {auth.error ? (
        <Login reloadAuth={() => loadAuth()} />
      ) : auth.data.type === "admin" ? (
        <>
          <div className="auth_user">
            <FontAwesomeIcon icon={faUser} />
            <div className="name">{auth.data.name}</div>
            <div
              className="logout"
              onClick={(e) => {
                localStorage.removeItem("school-token")
                loadAuth()
              }}
            >
              <FontAwesomeIcon icon={faSignOut} />
              Sign Out
            </div>
          </div>
          <BrowserRouter>
            <Sidebar />
            <Routes>
              <Route path="/" element={<Admin />} />
              <Route path="/students" element={<Students />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/candidates" element={<Candidates />} />
            </Routes>
          </BrowserRouter>
        </>
      ) : (
        <>
          <div className="auth_user">
            <FontAwesomeIcon icon={faUser} />
            <div className="name">{auth.data.name}</div>
            <div
              className="logout"
              onClick={(e) => {
                localStorage.removeItem("school-token")
                loadAuth()
              }}
            >
              <FontAwesomeIcon icon={faSignOut} />
              Sign Out
            </div>
          </div>
          <Student reg_no={auth.data.email} />
        </>
      )}
    </>
  )
}

export default App
