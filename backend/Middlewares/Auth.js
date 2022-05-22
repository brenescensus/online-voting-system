const jwt = require("jsonwebtoken")
module.exports = async function (req, res, next) {
  const { token } = req.headers
  req.user = { isAuth: false }
  try {
    const payload = await jwt.verify(token, process.env.secretcode)
    // console.log(payload)
    req.user = {
      isAuth: true,
      details: payload,
    }
  } catch (er) {
    req.user = {
      isAuth: false,
    }
  }
  next()
}
