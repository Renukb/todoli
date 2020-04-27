if (process.env.NODE_ENV === "production") {
  module.exports = {
    mongoURI:
      "mongodb+srv://<username>:<password>@todoli-learnpro-ppbve.mongodb.net/test?retryWrites=true&w=majority",
  };
} else {
  module.exports = { mongoURI: "mongodb://localhost/todolist-dev" };
}
