import passport from "passport";

const isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjA4N2E5MzAzNjYxODM3MTZjNDBiOSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjkzNDg1MDkwfQ.5zZqVoYwd1t5-94s81pI6Ol2gloDMupu2FvFn3kFg0c";
  return token;
};

export { isAuth, sanitizeUser, cookieExtractor };
