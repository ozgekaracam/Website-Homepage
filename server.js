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
//
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
// ###############################################################################

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.

app.get("/hello", function(req, res) {
    response_body = {'Hello': 'World'} ;

    // This example returns valid JSON in the response, but does not yet set the
    // associated HTTP response header.  This you should do yourself in your
    // own routes!
    res.json(response_body) ;
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
//GET request
app.get('/get', function(req, res) {
    // Example SQL statement to select the name of all products from a specific brand
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
    //console.log(res.json(req.body));
    var query = "SELECT * FROM phones WHERE 1=1" + queryCond;
    console.log(query);
    db.all(query, function(err, rows) {
      /* http request
      if (err) {
         res.status(400).send(err);
      }
      else {
         res.status(201).json(rows);
      }
      */
    	// TODO: add code that checks for errors so you know what went wrong if anything went wrong
    	// TODO: set the appropriate HTTP response headers and HTTP response codes here.
    	// # Return db response as JSON
    	return res.json(rows);

    });
});
//PUT request
app.put('/put', function(req, res) {

});
//POST request
app.post('/post', function(req, res) {
  var item = req.body;
  var error;
  if (item.brand == null || item.model == null || item.os == null || item.image == null || item.screensize == null){
     error = "Ops! You are missing some fields!";
     return res.json(error);
  }
  else if (item.brand == "" || item.model == "" || item.os == "" || item.image == "" || item.screensize == ""){
     error = "Please fill in all mandatory fields.";
     return res.json(error);
  }
  else {
    db.run(`INSERT INTO phones (brand, model, os, image, screensize)
                  VALUES (?, ?, ?, ?, ?)`,
                  [item.brand, item.model, item.os, item.image,  item.screensize], function(err, rows) {
    	return res.json(req.body);
    });
  }
});

//DELETE request
app.delete('/delete', function(req, res) {
  var resTxt;
  var item = req.body;
  db.run("DELETE FROM phones WHERE id= " + [item.id], function(err, rows) {
     return res.json("Item is deleted.");
 });

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
