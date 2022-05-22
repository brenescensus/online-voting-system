import React, { useState } from "react"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"

function Modal({ title, hideMe, shown, children }) {
  return (
    <motion.div
      className="modal"
      style={{ display: shown ? "inline" : "none" }}
    >
      <div className="title">{title || ""}</div>
      <div className="close" onClick={hideMe}>
        <FontAwesomeIcon icon={faTimes} />
      </div>
      {children}
    </motion.div>
  )
}

export default Modal
