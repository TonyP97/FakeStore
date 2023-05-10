const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index.js');
const cors = require("cors");

require('./db.js');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(routes)

module.exports = app;
