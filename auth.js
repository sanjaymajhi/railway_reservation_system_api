var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).redirect("/user/login/");
  }
  try {
    const decoded = jwt.verify(token, "sanjay");
    req.user_detail = decoded.user;
    next();
  } catch {
    return res.status(500).redirect("/user/login/");
  }
};
