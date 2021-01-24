const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cookieSession = require("cookie-session");
const dotenv = require('dotenv');
dotenv.config()
const projectRouter = require("./routes/project");
const usersRouter = require("./routes/users");
const contentRouter = require("./routes/content");
const collectionRouter = require("./routes/collection");
const app = express();

app.use(cors());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// PG database client/connection setup
// const { Pool } = require("pg");
// const dbParams = require("../lib/db.js");
// const db = new Pool({
//   host: dbParams.host,
//   port: dbParams.port,
//   user: dbParams.user,
//   password: dbParams.password,
//   database: dbParams.database,
// });
// db.connect();

//HEROKU -- comment for local deploy
const pg = require("pg");
pg.defaults.ssl = true;
const connectionString = 'postgres://lrlddljhohuvcl:5d021e95c405ac97486a7037e7ecd23e938f814d40a8385b3d60daa1ecd36826@ec2-52-54-174-5.compute-1.amazonaws.com:5432/de6cts8lnm086b';

const db = new pg.Pool({
  connectionString: connectionString
})
db.connect().then(() => console.log('db connected')).catch(error => console.log(error));

app.use(logger("dev"));
app.use(express.json());
// came as originally false below
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/project", projectRouter(db));
app.use("/api/users", usersRouter(db));
app.use("/api/content", contentRouter(db));
app.use("/api/collection", collectionRouter(db));

module.exports = app;
