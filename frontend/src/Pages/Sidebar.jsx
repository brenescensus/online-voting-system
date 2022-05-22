import React from "react"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faBars } from "@fortawesome/free-solid-svg-icons"
// import { useState } from "react"
import { NavLink } from "react-router-dom"

function Sidebar() {
  // const [sidebar, setSidebar] = useState(false)
  // function showSidebar() {
  //   setSidebar(!sidebar)
  // }
  return (
    <>
      {/* <div className="dropdown">
        <Link to="#" className="menu-bars">
          <FontAwesomeIcon
            className="icon"
            icon={faBars}
            onClick={showSidebar}
          />
        </Link>
      </div> */}
      <nav>
        <NavLink exact to="/">
          Home
        </NavLink>
        <NavLink exact to="/candidates">
          candidates
        </NavLink>
        <NavLink exact to="/students">
          students
        </NavLink>
        <NavLink exact to="/Schools">
          schools
        </NavLink>
      </nav>
    </>
  )
}

export default Sidebar
