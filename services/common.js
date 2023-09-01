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

  return token;
};

export { isAuth, sanitizeUser, cookieExtractor };
