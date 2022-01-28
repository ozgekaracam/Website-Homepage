// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.


// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'phones.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();

// We need some middleware to parse JSON data in the body of our HTTP requests:
var bodyParser = require("body-parser");
app.use(bodyParser.json());


// ###############################################################################
// Routes
// ###############################################################################

//GET request - http://localhost:3000/get
app.get('/get', function(req, res) {
    console.log(req.body);
    var item = req.body;
    var queryCond = "";
    if (item.id != null){
      queryCond += " and id=" + [item.id];
    }
    if (item.brand != null){
      queryCond += ` and brand= "${[item.brand]}"`;
    }
    if (item.model != null){
      queryCond += ` and model= "${[item.model]}"`;
    }
    if (item.os != null){
      queryCond += ` and os= "${[item.os]}"`;
    }
    if (item.screensize != null){
      queryCond += " and screensize=" + [item.screensize];
    }
    var query = "SELECT * FROM phones WHERE 1=1" + queryCond;
    console.log(query);
    db.all(query, function(err, rows) {
      if (err) {
         res.status(400).send(err);
      }
      else {
         res.status(201).json(rows);
      }
    });
});
//PUT request  - http://localhost:3000/put
app.put('/put', function(req, res) {
  var item = req.body;
  var error = "";
  if (item.brand == null || item.model == null || item.os == null || item.image == null || item.screensize == null){
     error = "Ops! You are missing some fields!";
     return res.json(error);
  }
  else if (item.brand == "" || item.model == "" || item.os == "" || item.image == "" || item.screensize == ""){
     error = "Please fill in all mandatory fields.";
     return res.json(error);
  }
  else {
    var query = `UPDATE phones SET brand= "${[item.brand]}", model= "${[item.model]}", os= "${[item.os]}", image= "${[item.image]}", screensize= ${[item.screensize]} WHERE id= ${[item.id]}`;
    console.log(query);
    db.run(query, function(err, rows) {
      if (err) {
         res.status(400).send(err);
      }
      else {
         res.status(201).json(req.body);
      }
    });
  }
});
//POST request - http://localhost:3000/post
app.post('/post', function(req, res) {
  var item = req.body;
  var error = "";
  if (item.brand == null || item.model == null || item.os == null || item.image == null || item.screensize == null){
     error = "Ops! You are missing some fields!";
     return res.json(error);
  }
  else if (item.brand == "" || item.model == "" || item.os == "" || item.image == "" || item.screensize == ""){
     error = "Please fill in all mandatory fields.";
     return res.json(error);
  }
  else {
    //var currentItems = db.all(`SELECT * FROM phones WHERE brand=?, model=?, os=?, image=?, screensize=?`,[item.brand, item.model, item.os, item.image,  item.screensize]);
    db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, [item.brand, item.model, item.os, item.image,  item.screensize], function(err, rows) {
      if (err) {
         res.status(400).send(err);
      }
      else {
         res.status(201).json(req.body);
      }
    });
  }
});

//DELETE request - http://localhost:3000/delete
app.delete('/delete', function(req, res) {
  var item = req.body;
  if (!(item.id)){
     var error = "Ops! You are missing the id to delete!";
     return res.json(error);
  }
  else {
    db.run("DELETE FROM phones WHERE id= " + [item.id], function(err, rows) {
      if (err) {
         res.status(400).send(err);
      }
      else {
         res.status(201).json("Item is deleted succesfully.");
      }
   });
  }
});
// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);
console.log("Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello");

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
				["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
				console.log('Inserted dummy phone entry into empty database');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}
