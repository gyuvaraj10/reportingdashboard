const express = require('express');
var db = express.Router();
var dbClient = require('./db/dynamodb');

db.get('/', function(req, res) {
    dbClient.getBusinessUnits()
    .then(function(data) {
        console.log(data)
        res.send(data);
    }).catch((error)=> {
        // res.status(500).send(error);
        next(error)
    })
})

db.post('/', (req, res)=> {
    var name = req.body.name
    dbClient.createBusinessUnit(name)
    .then(function(data) {
        res.sendStatus(201)
    }).catch((error)=> {
        res.status(500).send(error);
    })
})

db.post('/:businessunit/:squad', (req, res)=> {
    var businessunit = req.params.businessunit;
    var squad = req.params.squad;
    dbClient.createSquad(businessunit, squad)
    .then(function(data) {
        res.sendStatus(201)
    }).catch((error)=> {
        res.status(500).send(error);
    })
});

db.post('/:businessunit/:squad/:buildNumber/reports', (req, res, next) => {
    var businessunit = req.params.businessunit;
    var squad = req.params.squad;
    var buildNumber = req.params.buildNumber;
    var reports = req.body;
    dbClient.postReports(businessunit, squad, buildNumber, reports)
    .then(function(data) {
        res.sendStatus(201)
    }).catch((error)=> {
        next(error)
        // res.status(500).send(error);
    })
});
module.exports = db;