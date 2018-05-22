//run with nodemon to monitor files so you do not have to restart server
//npm init creates package.json
const express = require("express");
// const is the same as var but you can't change it once it is set
const body_parser = require("body-parser");
const app = express();
const pgp = require("pg-promise")({});

const db = pgp({ database: "restaurant", user: "postgres" });

// the templating part
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  //keep this on, keeps you safe from injections
  autoescape: true,
  // tells you where the express app is
  express: app,
  //good for development, set to false when deploying
  noCache: true
});

//middleware, called public instead of static
//if something is added to the url it will check your public folder
app.use(express.static("public"));
app.use(body_parser.urlencoded({ extended: false }));

// handler and function that handles it
app.get("/", function(request, response) {
  //request = input response = output
  //sends information to browser same as self.write in tornado
  response.send("Hello World Again!");
});
//What port to listen on
app.listen(8008, function() {
  console.log("Listening on port 8008");
});

app.get("/about", function(request, response) {
  response.send("About Me");
});

app.get("/projects", function(request, response) {
  response.send("Projects");
});
//url parameters
app.get("/post/:id", function(request, response, next) {
  var id = request.params.id;

  db
    .query("SELECT * FROM restaurant WHERE id=$1", [id])
    //gives you one results .one("SELECT * FROM restaurant WHERE id=$1", [id])
    .then(function(results) {
      response.send(results);
    })
    //not giving error message
    .catch(next);
});
//query parameters
// app.get("/hello", function(request, response) {
//   //|| means or if undefined put default given
//   var name = request.query.name || "World";
//   response.send("Hello " + name);
// });
//often use this syntax
app.get("/form", function(req, resp) {
  resp.render("form.html");
});

// should include some form validation to make sure things are filled out
app.post("/submit", function(req, resp) {
  console.log(req.body);
  // resp.send("OK"); would send back the message OK
  //resp.render("index.html"); sends you to index page after submit
  resp.redirect("/some-where-else");
});

app.get("/hello", function(request, response) {
  var name = request.query.name || "World";
  // context is variables you want in your template
  var context = {
    title: "Hello",
    name: name,
    friends: [{ name: "Joan" }]
  };

  response.render("index.html", context);
});
