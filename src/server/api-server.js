const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
// const { resolve } = require("path");

// require("dotenv").config({
//   path: resolve(process.cwd(), "src", "server", ".env"),
// });
require("dotenv").config();

const app = express();

const audience = process.env.AUTH0_AUDIENCE;
const port = process.env.SERVER_PORT;
const appOrigin = process.env.CLIENT_ORIGIN_URL;
const issuer = process.env.AUTH0_DOMAIN;
console.log(issuer, 'issuer')
console.log(appOrigin, 'issuer')


if (!issuer || !audience) {
  throw new Error("Please make sure that .env is in place and populated");
}

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
app.get('/test', (req,res)=>{
  res.json({msg:'test'})
})
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

app.get("/profile/:email", (req, res)=>{
  const email=req.params.email
  console.log('get request on route profile the email: ', email)
  res.json({'client email': email})

})
app.listen(port, () => console.log(`API Server listening on port ${port}`));
