const express = require('express');
const db = require('./db');
const app = express();
app.use('/businessunit', db);

app.use((req, res, next) => {
    next(req, res);
})

module.exports = app;