#!/usr/bin/env nodejs
const mysql = require('mysql')

const charString = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
charSet = charString.split('');

function dbConnect() {
	const connection = mysql.createConnection({
	  host: 'localhost',
	  user: 'root',
	  password: 'rootpw',
	  database: 'status'
	});
	connection.connect((err) => {
	  if (err) throw err;
	  console.log('Connected!');
	});

	return connection
}

function shuffleArray(d) {
  for (var c = d.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = d[c];
    d[c] = d[b];
    d[b] = a;
  }
  return d
};

// dbConnect();

idList = [];
charSet.forEach( (c1) => charSet.forEach( (c2) => charSet.forEach( (c3) => {
	idList.push( c1+c2+c3);
})));
console.log( "Count = " + idList.length);

shuffleArray( idList);

cnx = dbConnect()
idList.forEach( (id) => {
	var post = {'shortId': id}
	cnx.query( 'INSERT INTO mapping SET ?', post, () => {});
})
