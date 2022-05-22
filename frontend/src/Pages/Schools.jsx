import {
  faSave,
  faTimesCircle,
  faUserEdit,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useEffect, useState } from "react"
import Modal from "../Components/Modal"
import GraphQLFetch from "../Helpers/GraphQLFetch"

function Schools() {
  const [{ errors, data }, setStudents] = useState([])
  const [schools, setSchools] = useState([])
  const [addStudent, setAddStudent] = useState(false)
  const [name, setName] = useState("")
  const [regno, setRegno] = useState("")
  const [school, setSchool] = useState("")

  useEffect(() => {
    fetchSchools()
  }, [])

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
      <div className="title">Schools</div>
      {schools && (
        <div className="list">
          <div className="options">
            <div className="button" onClick={(e) => setAddStudent(true)}>
              <FontAwesomeIcon icon={faUserPlus} />
              Add
            </div>
          </div>
          <table>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th></th>
            </tr>
            {schools.map(({ name, code }) => (
              <tr>
                <td>{code.toUpperCase()}</td>
                <td>{name}</td>
                <td style={{ display: "flex", flexDirection: "row" }}>
                  <div className="button small">
                    <FontAwesomeIcon icon={faUserEdit} />
                    Edit
                  </div>
                  <div
                    className="button small"
                    onClick={(e) => {
                      window.confirm("Are you sure?")
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
        title="Add School"
        shown={addStudent}
        hideMe={() => setAddStudent(false)}
      >
        <div className="input">
          <label htmlFor="">Code</label>
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
        <div className="options">
          <div
            className="button black"
            onClick={async () => {
              let { errors, data } = await GraphQLFetch(`mutation{
                addSchool(code: "${regno}", name: "${name}"){
                  code
                  name
                }
              }`)
              if (errors) {
                alert("Failed to add school\n\n" + errors.map((e) => e.message))
              } else {
                alert(`School Added`)
                setAddStudent(false)
              }
              fetchSchools()
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

export default Schools
