//Main file for Expir-ational Project
//Maya Johnson, Ashley Park, Jasmine Lei, Rosie Arasa

// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// import the Item, Person, and Fridge
var Item = require('./Item.js');
var User = require('./User.js');
var Fridge = require('./Fridge.js');
const { json } = require('express/lib/response');

//used to give each item added a unique ID
var itemIDCounter = 0

//dummy user - when we get to multiple users, this should change somehow
var user1 = new User ({
	name: 'Bryn Mawr',
	id: 0,
    roomNumber: 1,
    myItems: []
});

//dummy fridge
var fridge1 = new Fridge ({
	id: 0,
	users: [],
	items: []
});

app.use('/create', (req, res) => {
	// construct the Item from the form data which is in the request body
	var newItem = new Item ({
		type: req.body.type,
	    id: itemIDCounter,
        expDate: req.body.expDate,
        dateAdded: req.body.dateAdded
	    });
	console.log(newItem);
	itemIDCounter++;

	//make fridge ID a variable laterf
	var filter = { 'id' : 0 };
	var action = { '$push' : { 'items' : newItem } };

	// save the item to the database
	Fridge.findOneAndUpdate( filter, action, (err, orig) => { 
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfull created" message
		    res.send('Successfully added ' + newItem.type + ' to the database');
		}
	    } ); 
    });

//adds the item directly to the database
/*app.use('/create', (req, res) => {
	// construct the Item from the form data which is in the request body
	var newItem = new Item ({
		type: req.body.type,
		id: itemIDCounter,
		expDate: req.body.expDate,
		dateAdded: req.body.dateAdded
		});
	console.log(newItem);
	itemIDCounter++;
	
	// save the item to the database
	newItem.findOneAndUpdate( (err) => { 
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
			// display the "successfull created" message
			res.send('Successfully added ' + newItem.type + ' to the database');
		}
		} ); 
	});
*/


/* From Lab7 index.js so I can test /create */
// endpoint for accessing data via the web api
// to use this, make a request for /api to get an array of all Fridge objects and items in them
// or /api?name=[whatever] to get a single object
app.use('/api', (req, res) => {

	// construct the query object
	var queryObject = {};
	if (req.query.id) {
	    // if there's a name in the query parameter, use it here
	    queryObject = { "id" : req.query.id };
	};
    
	Fridge.find( queryObject, (err, fridges) => {
		console.log(fridges);
		if (err) {
		    console.log('uh oh' + err);
		    res.json({});
		}
		else if (fridges.length == 0) {
		    // no objects found, so send back empty json
		    res.json({});
		}
		else if (fridges.length == 1 ) {
		    var fridge = fridges[0];
		    // send back a single JSON object
		    //res.json( { "type" : item.type, "id" : item.id , "expDate" : item.expDate, "dateAdded" : item.dateAdded } );
			res.json( { "id" : fridge.id, "users" : fridge.users, "items" : fridge.items } );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    fridges.forEach( (item) => {
			    //returnArray.push( { "type" : item.type, "id" : item.id , "expDate" : item.expDate, "dateAdded" : item.dateAdded } );
				returnArray.push( { "id" : fridge.id, "users" : fridge.users, "items" : fridge.items } );
			});
		    // send it back as JSON Array
		    res.json(returnArray); 
		}
		
	    });
    });



app.use('/public', express.static('public'));

//register a fridge that items will get added to if needed and redirect to the form to add
app.use('/', (req, res) => { 
	//add a base fridge to the database if one doesn't already exist
	Fridge.find( (err, allFridges) => {
		if (err) {
			console.log(err);
		} else if (allFridges.length == 0) {
			fridge1.save( (err) => { 
				if (err) {
					//res.type('html').status(200);
					//res.write('uh oh: ' + err);
					console.log(err);
					//res.end();
				}
			}); 
		}
	});
	
	res.redirect('/public/addItemForm.html'); 
});
    
app.listen(3000,  () => {
    console.log('Listening on port 3000');
    });