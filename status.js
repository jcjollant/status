#!/usr/bin/env nodejs
//const express = require('express')
const app = require('express')()
const mysql = require('mysql')
const port = 3000

app.enable('trust proxy')

function dbConnect() {
	return mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: 'rootpw',
	  database: 'status'
	});
}

function createNewStatus( ipAddress, res) {
	cnx = dbConnect();
	cnx.connect((err) => {
		if (err) throw err;
		post = {creatorIP:ipAddress}
		cnx.query('INSERT INTO status SET ?', post, (err, result) => {
			if( err) throw err
			insertId = result.insertId
			cnx.query('SELECT shortId FROM mapping WHERE id=?', insertId, (err, result) => {
				cnx.end()
				if( err) throw err;
				shortId = result[0].shortId
				res.status(201).json({id:shortId})
				console.log( 'Status ' + shortId + ' created by ' + ipAddress)
			})
		})
	});
}

// generic ping
app.get("/ping", (req,res) => {
	res.status(200).json({timestamp:Date.now()})
	console.log( 'Ping served to ' + req.ip)
})

// new status creation
app.post("/", (req, res) => {
	console.log( 'POST received from ' + req.ip)
	try {
		createNewStatus(req.ip, res);
	} catch( err) {
		res.status(500).json({failed:err});
		console.log( 'Creation failed ' + err)
	}
})

app.put("/:id/:status", (req, res) => {
	console.log( 'PUT received from ' + req.ip + ' id=' + req.params.id + ' status=' + req.params.status)
	res.status(304).json({status:"not implemented"})
})

app.listen(port, () => console.log('Listening on ' + port))
