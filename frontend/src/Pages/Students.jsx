import {
  faSave,
  faSearch,
  faTimesCircle,
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import Modal from "../Components/Modal"
import GraphQLFetch from "../Helpers/GraphQLFetch"

function Students() {
  const [{ errors, data }, setStudents] = useState([])
  const [schools, setSchools] = useState([])
  const [addStudent, setAddStudent] = useState(false)
  const [name, setName] = useState("")
  const [regno, setRegno] = useState("")
  const [school, setSchool] = useState("")
  const [search, setSearch] = useState("")
  const [editStudent, setEditStudent] = useState(false)
  const [editName, setEditName] = useState("")
  const [editRegNo, setEditRegNo] = useState("")
  const [editSchool, setEditSchool] = useState("")

  useEffect(() => {
    fetchStudents()
    fetchSchools()
  }, [])

  async function fetchStudents() {
    let res = await GraphQLFetch(`{
      students{
        reg_no
        name
        school{
          name
          code
        }
      }
    }`)
    setStudents(res)
  }

  async function fetchSchools() {
    let res = await GraphQLFetch(`{
      schools{
        code
        name
      }
    }`)
    setSchools(res.data.schools)
  }

  return (
    <div className="students">
      <div className="title">Students</div>
      {errors && errors.map((e) => <div>Error</div>)}
      <Modal
        title="Edit Student"
        hideMe={() => setEditStudent(false)}
        shown={editStudent}
      >
        <div className="input">
          <label htmlFor="editName">Name</label>
          <input
            style={{ textTransform: "capitalize" }}
            type="text"
            value={editName}
            onInput={(e) => setEditName(e.target.value)}
          />
        </div>
        <div className="input">
          <label htmlFor="editSchool">School</label>
          <select
            style={{ textTransform: "capitalize" }}
            name=""
            id="editSchool"
            value={editSchool}
            onChange={(e) => setEditSchool(e.target.value)}
          >
            <option value="">Select a School...</option>
            {schools.map(({ name, code }) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="options">
          <div
            className="button black"
            onClick={async () => {
              // alert(editRegNo)
              let { errors, data } = await GraphQLFetch(`mutation{
              editStudent(reg_no: "${editRegNo}", name: "${editName}", school: "${editSchool}"){
                name
              }
            }`)
              if (errors) alert(errors[0].message)
              else {
                await fetchStudents()
                setEditStudent(false)
                alert("Information Updated")
              }
            }}
          >
            Update
          </div>
        </div>
      </Modal>
      {data && (
        <div className="list">
          <div className="options">
            <div className="search">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Find a Student"
                onInput={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>
            <div className="button" onClick={(e) => setAddStudent(true)}>
              <FontAwesomeIcon icon={faUserPlus} />
              Add
            </div>
          </div>
          <table>
            <tr>
              <th>Registration Number</th>
              <th>Name</th>
              <th>School</th>
              <th></th>
            </tr>
            {data.students
              .filter(
                ({ name, reg_no, school }) =>
                  name.toLowerCase().includes(search) ||
                  reg_no.toLowerCase().includes(search) ||
                  school.code.toLowerCase().includes(search) ||
                  school.name.toLowerCase().includes(search)
              )
              .map(({ name, reg_no, school }) => (
                <tr>
                  <td>{reg_no}</td>
                  <td>{name}</td>
                  <td>
                    {school.name} ({school.code.toUpperCase()})
                  </td>
                  <td style={{ display: "flex", flexDirection: "row" }}>
                    <div
                      className="button small"
                      onClick={async () => {
                        await fetchSchools()
                        let { errors, data } = await GraphQLFetch(`{
                          student(reg_no: "${reg_no}"){
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
                            `Failed to Load Student Info\n${errors[0].message}`
                          )
                          await fetchStudents()
                        } else {
                          setEditName(data.student.name)
                          setEditRegNo(data.student.reg_no)
                          setEditSchool(data.student.school.code)
                          setEditStudent(true)
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faUserEdit} />
                      Edit
                    </div>
                    <div
                      className="button small"
                      onClick={async (e) => {
                        let sure = window.confirm("Are you sure?")
                        if (sure) {
                          let { errors, data } = await GraphQLFetch(`mutation{
                            deleteStudent(reg_no: "${reg_no}"){
                              name
                            }
                          }`)
                          if (errors)
                            alert(
                              `Failed to delete student\n${errors[0].message}`
                            )
                          else {
                            await fetchStudents()
                            alert("Student Deleted!")
                          }
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
          </table>
        </div>
      )}
      <Modal
        title="Add Student"
        shown={addStudent}
        hideMe={() => setAddStudent(false)}
      >
        <div className="input">
          <label htmlFor="">Registration Number</label>
          <input
            onChange={(e) => setRegno(e.target.value)}
            style={{ width: 300 }}
            type="text"
          />
        </div>
        <div className="input">
          <label htmlFor="">Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            style={{ width: 300 }}
            type="text"
          />
        </div>
        <div className="input">
          <label htmlFor="">School</label>
          <select onChange={(e) => setSchool(e.target.value)} name="" id="">
            {schools.map((s) => (
              <option style={{ textTransform: "capitalize" }} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div className="options">
          <div
            className="button black"
            onClick={async () => {
              let { errors, data } = await GraphQLFetch(`mutation{
                addStudent(reg_no: "${regno}", name: "${name}", school: "${school}"){
                  name
                  reg_no
                  school{
                    name
                    code
                  }
                }
              }`)
              await fetchStudents()
              if (errors) {
                alert(
                  "Failed to add student\n\n" + errors.map((e) => e.message)
                )
              } else {
                alert(`Student Added`)
                setAddStudent(false)
              }
            }}
          >
            <FontAwesomeIcon icon={faSave} />
            &nbsp; Save
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Students
