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

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool({
  host: dbParams.host,
  port: dbParams.port,
  user: dbParams.user,
  password: dbParams.password,
  database: dbParams.database,
});
db.connect();

app.use(logger("dev"));
app.use(cors());
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
