const burl = require("./URL")
module.exports = async function (query) {
  let token = localStorage.getItem("school-token") || "Not Available"
  let resp = await fetch(burl, {
    method: "POST",
    headers: {
      token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
    }),
  })
  if (resp.ok) {
    let result = await resp.json()
    return result
  } else {
    return { errors: [{ message: "Network Error" }] }
  }
}
