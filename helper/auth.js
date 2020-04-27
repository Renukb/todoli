module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Not authorized");
    res.redirect("/users/login");
  },
};

//To help protect after logout , no data can be accessed after logout
