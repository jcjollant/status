#!/usr/bin/node
//const express = require('express')
const app = require('express')()
const mysql = require('mysql')
const port = 3000

app.enable('trust proxy')

var cnx

function dbConnect() {
	cnx = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: 'rootpw',
	  database: 'status'
	});
	cnx.connect( (err) => {
		if( err) throw err;
		console.log( 'DB Connection up');
		// keep the connection alive
		setInterval( () => {
			cnx.query('SELECT 1')
		}, 5000)
	})
}

function createNewStatus( ipAddress, res) {
	post = {creatorIP:ipAddress}
	cnx.query('INSERT INTO status SET ?', post, (err, result) => {
		if( err) throw err
		insertId = result.insertId
		cnx.query('SELECT shortId FROM mapping WHERE id=?', insertId, (err, result) => {
			if( err) throw err;
			shortId = result[0].shortId
			res.status(201).json({id:shortId})
			console.log( 'Status ' + shortId + ' created by ' + ipAddress)
		})
	})
}

// generic ping
app.get("/ping", (req,res) => {
	res.status(200).json({timestamp:Date.now()})
	console.log( 'Ping served to ' + req.ip)
})

app.get("/:id", (req,res) => {
	cnx.query( 'SELECT mapping.shortId, status.status FROM mapping RIGHT JOIN status ON mapping.id=status.id WHERE mapping.shortId=?', req.params.id, (err, result) => {
		if( result.length == 0){
			res.status(404).json({id:req.params.id});
			console.log( 'Status ' + req.params.id + ' not found')
		} else {
			res.status(200).json({'id':req.params.id,status:result[0].status})
			console.log( 'Status ' + req.params.id + ' returned to ' + res.ip)
		}
	})
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

// initiate DB connection
dbConnect();
app.listen(port, () => console.log('Listening on ' + port))
