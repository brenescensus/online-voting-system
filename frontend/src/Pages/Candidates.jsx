import {
  faSave,
  faSchool,
  faTimesCircle,
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import Modal from "../Components/Modal"
import GraphQLFetch from "../Helpers/GraphQLFetch"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

import { Doughnut } from "react-chartjs-2"
ChartJS.register(ArcElement, Tooltip, Legend)

function Candidates() {
  const [schools, setSchools] = useState([])
  const [addStudent, setAddStudent] = useState(false)
  const [regno, setRegno] = useState("")
  const [candidates, setCandidates] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)

  useEffect(() => {
    fetchCandidates()
  }, [])

  async function fetchStudent(reg_no) {
    let { errors, data } = await GraphQLFetch(`{
      student(reg_no: "${reg_no}"){
        name
        isCandidate
        school{
          name
          code
        }
      }
    }`)
    if (errors) setSelectedStudent(null)
    else setSelectedStudent(data.student)
  }

  async function fetchCandidates() {
    let sch = await fetchSchools()

    for (let s of sch) {
      let candidates = await GraphQLFetch(`{
        schoolCandidates(school: "${s.code}"){
          name
          reg_no
          voteCount
        }
      }`)
      // console.log(candidates.data.schoolCandidates)
      s.candidates = candidates.data.schoolCandidates
    }
    setSchools(sch)
  }

  async function fetchSchools() {
    let res = await GraphQLFetch(`{
      schools{
        name
        code
      }
    }`)
    return res.data.schools
  }

  return (
    <div className="students">
      <div className="title">Candidates</div>
      <div className="options">
        <div className="button" onClick={(e) => setAddStudent(true)}>
          <FontAwesomeIcon icon={faUserPlus} />
          Add
        </div>
      </div>
      {schools.map((s) => (
        <div className="can-school">
          <div className="school-name">
            <FontAwesomeIcon
              icon={faSchool}
              style={{ marginRight: 5, transform: "translateY(-1px)" }}
            />
            {s.name}
          </div>
          {s.candidates.length > 0 ? (
            <div className="can-details">
              <div className="can-chart">
                <Doughnut
                  data={{
                    labels: s.candidates.map((c) => c.name),
                    datasets: [
                      {
                        label: "# of Votes",
                        data: s.candidates.map((c) => parseInt(c.voteCount)),
                        backgroundColor: [
                          "rgba(255, 99, 132, 0.2)",
                          "rgba(54, 162, 235, 0.2)",
                          "rgba(255, 206, 86, 0.2)",
                          "rgba(75, 192, 192, 0.2)",
                          "rgba(153, 102, 255, 0.2)",
                          "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                          "rgba(255, 99, 132, 1)",
                          "rgba(54, 162, 235, 1)",
                          "rgba(255, 206, 86, 1)",
                          "rgba(75, 192, 192, 1)",
                          "rgba(153, 102, 255, 1)",
                          "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </div>
              <ul className="can-list">
                {s.candidates.map((c) => (
                  <li className="candidate">
                    {c.name}{" "}
                    <b>
                      <i>({c.voteCount.toLocaleString()} Votes)</i>
                    </b>
                    <div
                      className="remove-candidate"
                      onClick={async () => {
                        let sure = window.confirm(
                          `You are about to remove ${c.name.toUpperCase()} from being a candidate. This will also delete his/her votes. Please be certain.`
                        )
                        if (sure) {
                          let { errors, data } = await GraphQLFetch(`mutation{
                            removeCandidate(reg_no: "${c.reg_no}"){
                              name
                            }
                          }`)
                          if (errors) {
                            console.log(errors)
                            alert(`Candidate not removed\n${errors[0].message}`)
                          } else {
                            await fetchCandidates()
                          }
                        }
                      }}
                    >
                      Delete
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="message">No Candidate Found!</div>
          )}
        </div>
      ))}

      <Modal
        title="Add Candidate"
        shown={addStudent}
        hideMe={() => setAddStudent(false)}
      >
        {selectedStudent && (
          <>
            <div
              style={{
                backgroundColor: selectedStudent.isCandidate ? "red" : "green",
                width: 350,
                padding: 5,
                borderRadius: 5,
                color: "white",
                fontWeight: "bolder",
                margin: 5,
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {selectedStudent.name} - {selectedStudent.school.name} (
              {selectedStudent.school.code.toUpperCase()})
            </div>
            {selectedStudent.isCandidate && (
              <div
                style={{
                  color: "red",
                  fontWeight: "bolder",
                  fontSize: "small",
                  margin: "0 5px",
                  textTransform: "capitalize",
                }}
              >
                {selectedStudent.name} is a candidate already!!
              </div>
            )}
          </>
        )}
        <div className="input">
          <label htmlFor="">Registration Number</label>
          <input
            onChange={async (e) => {
              setRegno(e.target.value)
              await fetchStudent(e.target.value)
            }}
            style={{ width: 300 }}
            type="text"
          />
        </div>

        <div className="options">
          {selectedStudent && !selectedStudent.isCandidate && (
            <div
              className="button black"
              onClick={async () => {
                let { errors, data } = await GraphQLFetch(`mutation{
                addCandidate(reg_no: "${regno}"){
                  reg_no
                  name
                  school{
                    name
                    code
                  }
                }
              }`)
                if (errors) {
                  alert(
                    "Failed to add Candidate\n\n" + errors.map((e) => e.message)
                  )
                } else {
                  alert(`Candidate Added`)
                  setAddStudent(false)
                }
                fetchCandidates()
              }}
            >
              <FontAwesomeIcon icon={faSave} />
              &nbsp; Save
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Candidates
