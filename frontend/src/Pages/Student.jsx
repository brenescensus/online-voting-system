import React, { useState, useEffect } from "react"
import GraphQLFetch from "../Helpers/GraphQLFetch"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck, faVoteYea } from "@fortawesome/free-solid-svg-icons"

function Student(props) {
  const [voted, setVoted] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [myInfo, setMyInfo] = useState({
    name: "",
    reg_no: "",
    school: {
      name: "",
      code: "",
    },
  })
  const [candidates, setCandidates] = useState([])
  const [winners, setWinners] = useState([])

  useEffect(() => {
    if (props.reg_no) {
      fetchMyInfo()
      haveIVoted(props.reg_no)
      loadWinners()
    }
  }, [])

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

  async function haveIVoted(reg_no) {
    let { errors, data } = await GraphQLFetch(`{
      meVoted(reg_no:"${reg_no}"){
        voter{
          name
        }
        candidate{
          reg_no
          name
        }
      }
    }`)
    if (errors) setVoted(false)
    else {
      setVoted(true)
      setSelectedCandidate(data.meVoted.candidate)
    }
  }

  async function fetchMyInfo() {
    let res = await GraphQLFetch(`{
          myInfo(reg_no: "${props.reg_no}"){
            name
            reg_no
            school{
              name
              code
            }
          }
        }`)
    fetchCandidates(res.data.myInfo.school.code)
    setMyInfo(res.data.myInfo)
  }

  async function fetchCandidates(code) {
    let { data } = await GraphQLFetch(`{
      schoolCandidates(school: "${code}"){
        reg_no
        name
        voteCount
      }
    }`)
    // console.log(data)
    setCandidates(data.schoolCandidates)
  }
  return (
    <div className="student">
      <div className="title">Student's Page </div>
      <div className="my-school">
        {myInfo.school.name} ({myInfo.school.code.toUpperCase()})
      </div>
      <div
        className="my-candidates"
        style={voted ? { pointerEvents: "none", opacity: "0.6" } : {}}
      >
        {candidates.length > 0 ? (
          candidates.map((s) => (
            <div
              key={`s-cand-${s.reg_no}`}
              className={`s-candidate ${
                selectedCandidate &&
                selectedCandidate.reg_no === s.reg_no &&
                "csel"
              }`}
              onClick={(e) => {
                let cdivs = document.querySelectorAll(
                  ".my-candidates > .s-candidate"
                )
                for (let c of cdivs) {
                  c.classList.remove("csel")
                }
                e.target.classList.add("csel")
                setSelectedCandidate(s)
              }}
            >
              <span style={{ pointerEvents: "none" }}>{s.name}</span>
              <div className="c-check" style={{ pointerEvents: "none" }}>
                <FontAwesomeIcon
                  icon={faCheck}
                  size="5x"
                  style={{ pointerEvents: "none" }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="message">No Candidates Available!</div>
        )}
      </div>
      <div
        className="c-options"
        style={{ display: selectedCandidate ? "flex" : "none" }}
      >
        <button
          disabled={voted}
          className="cast"
          onClick={async () => {
            let sureVote = window.confirm(
              `Are you sure you want to vote for ${selectedCandidate.name.toUpperCase()}`
            )
            if (sureVote) {
              let { errors, data } = await GraphQLFetch(`mutation{
                castVote(reg_no: "${props.reg_no}", candidate: "${selectedCandidate.reg_no}"){
                  voter{
                    name
                    reg_no
                  }
                  candidate{
                    name
                    reg_no
                  }
                }
              }`)
              if (errors) {
                alert(`There was an error while casting your vote
                
                ERRORS
                ${errors.map((e) => ` - ${e.message}\n`)}
                `)
              } else {
                document
                  .querySelector(".c-options button")
                  .setAttribute("disabled", true)

                let cands = document.querySelectorAll(".s-candidate")
                for (let c of cands) {
                  c.style.pointerEvents = "none"
                  c.style.opacity = 0.6
                }
                alert("Vote Casted Successfully")
                haveIVoted(props.reg_no)
              }
            } else {
              alert("Please select another Candidate")
            }
          }}
        >
          <FontAwesomeIcon icon={faVoteYea} />
          Cast Vote
        </button>
      </div>
      {winners.filter((w) => w.school.code === myInfo.school.code).length >
      0 ? (
        <div
          className="s-winner"
          style={{
            display: voted ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {winners.filter((w) => w.school.code === myInfo.school.code)[0].name}
        </div>
      ) : (
        <></>
      )}
      <div className="s-winner"></div>
    </div>
  )
}

export default Student
