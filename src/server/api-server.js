const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const mongoose = require("mongoose");
const bp = require('body-parser')


// const { resolve } = require("path");

// require("dotenv").config({
//   path: resolve(process.cwd(), "src", "server", ".env"),
// });
require("dotenv").config();

const app = express();
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
const audience = process.env.AUTH0_AUDIENCE;
const port = process.env.SERVER_PORT;
const appOrigin = process.env.CLIENT_ORIGIN_URL;
const issuer = process.env.AUTH0_DOMAIN;
console.log(issuer, 'issuer')
console.log(appOrigin, 'issuer')


if (!issuer || !audience) {
  throw new Error("Please make sure that .env is in place and populated");
}

mongoose.connect("mongodb://localhost/Auth0FullStack", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${issuer}.well-known/jwks.json`,
  }),

  audience: audience,
  issuer: issuer,
  algorithms: ["RS256"],
});


app.get(`/api/messages/public-message`, (req, res) => {
  console.log('reached here')
  res.send({
    msg: "The API doesn't require an access token to share this message.",
  });
});

app.get("/api/messages/private-message", checkJwt, (req, res) => {
  console.log('reached private route')
  res.send({
    msg: "The API successfully validated your access token.",
  });
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model("User", userSchema);

const todosSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  todos: [
    {
      checked: Boolean,
      text: String,
      id: String,
    },
  ],
});
const Todos = mongoose.model("Todos", todosSchema);

app.get("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  console.log(username, ': username')
  console.log(password, ': password')
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
  }
  const { todos } = await Todos.findOne({ userId: user._id }).exec();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { authorization } = req.headers;
  const [, token] = authorization.split(" ");
  const [username, password] = token.split(":");
  const todosItems = req.body;
  const user = await User.findOne({ username }).exec();
  if (!user || user.password !== password) {
    res.status(403);
    res.json({
      message: "invalid access",
    });
    return;
  }
  const todos = await Todos.findOne({ userId: user._id }).exec();
  if (!todos) {
    await Todos.create({
      userId: user._id,
      todos: todosItems,
    });
  } else {
    todos.todos = todosItems;
    await todos.save();
  }
  res.json(todosItems);
});

app.post("/register", async (req, res) => {
  console.log(req.body, 'req body')
  const { username, password } = req.body;
  let user = await User.findOne({ username }).exec();
  if (user) {
    console.log('your here')
    console.log(user, 'user')
    // res.status(500);
    res.json({
      message: "user already exists", user: user
    });
    return;
  }
  user=await User.create({ username, password });
  let todos=await Todos.create({
    userId: user._id,
    todos: []
  })
  await 
  res.json({
    message: "success message", user: user, todos
  });
});


// app.get("/profile/:email", (req, res)=>{
//   const email=req.params.email
//   console.log('get request on route profile the email: ', email)
//   res.json({'client email': email})
// })


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
});