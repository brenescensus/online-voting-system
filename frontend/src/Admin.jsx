import React, { useState, useEffect } from "react"
import GraphQLFetch from "./Helpers/GraphQLFetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBars,
  faGraduationCap,
  faSchool,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons"
import { Link, NavLink } from "react-router-dom"

function Admin() {
  const [candidates, setCandidates] = useState([])
  const [schools, setSchools] = useState([])
  const [students, setStudents] = useState([])
  const [winners, setWinners] = useState([])

  useEffect(() => {
    loadCandidates()
    loadSchools()
    loadStudents()
    loadWinners()
  }, [])

  async function loadCandidates() {
    let { data, errors } = await GraphQLFetch(`{
      candidates{
        name
        reg_no
      }
    }`)
    if (data) {
      setCandidates(data.candidates)
      // console.log(data.candidates)
    }
  }

  async function loadSchools() {
    let { data, errors } = await GraphQLFetch(`{
      schools{
        name
        code
      }
    }`)
    if (data) {
      setSchools(data.schools)
    }
  }

  async function loadWinners() {
    let { data, errors } = await GraphQLFetch(`{
      winners{
        name,
        reg_no,
        school{
          name
          code
        }
      }
    }`)
    if (data) {
      setWinners(data.winners)
    }
  }

  async function loadStudents() {
    let { data, errors } = await GraphQLFetch(`{
      students{
        name
        reg_no
      }
    }`)
    if (data) {
      setStudents(data.students)
    }
  }

  return (
    <div className="admin">
      <div className="title">Admin's Interface</div>
      <div className="top-dash">
        <NavLink
          exact
          to="/candidates"
          className="dash-item"
          title={candidates && candidates.map((c) => c.name || "")}
        >
          Candidates
          <div className="count">{candidates.length}</div>
          <FontAwesomeIcon className="icon" size="3x" icon={faVoteYea} />
        </NavLink>
        <NavLink
          exact
          to="/students"
          className="dash-item"
          title={students.map((s) => `${s.name} (${s.reg_no})`)}
        >
          Students
          <div className="count">{students.length}</div>
          <FontAwesomeIcon className="icon" size="3x" icon={faGraduationCap} />
        </NavLink>
        <NavLink
          exact
          to="/Schools"
          className="dash-item"
          title={schools.map((s) => `${s.name} (${s.code})`)}
        >
          Schools
          <div className="count">{schools.length}</div>
          <FontAwesomeIcon className="icon" size="3x" icon={faSchool} />
        </NavLink>
      </div>
      <div className="title">Provisional Winners</div>
      <ul className="prov-winners">
        {winners.map((w) => (
          <li className="winner">
            {w.name} ({w.reg_no}) - {w.school.name} ({w.school.code})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Admin
