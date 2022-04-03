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

//give user an id based
var userID = Date.now()

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

//add user
app.use('/adduser', (req,res)=>{
	var newUser = new User({
		name: req.body.name,
		id: userID,
		roomNumber: req.body.roomNumber,
		myItems: req.body.item

});
console.log(newUser)
userID++
//save the person to the database
	newUser.save( (err) => {
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
				else {
		    // display the "successfull created" message
		    res.send('successfully added ' + newUser + ' to the database');
		}


});
    res.redirect('/all');
});


//remove user
app.use('/removeuser', (req, res) => {
	var filter = {'name': req.query.name}
	User.findOneAndDelete(filter, (err,user)=>{
		if (err){
			console.log("error")
		}
		else if(!user){
			console.log("No User")
		}
		else{
			console.log("deleted successfully")
		}
	})

    res.redirect('/all');
});

// edit item expDate field (JL)
app.use('/edit_item_expDate', (req, res) => {
	var id = req.query.id;
	var expDate = req.query.expDate;
	if (id) {
		var filter = {'_id' : id};
		console.log("look for id: " + id);
		if (expDate) {
			var action = {'$set' : {'expDate' : expDate}};
			Item.findOneAndUpdate(filter, action, (err, orig) => {
				if (err) {
					console.log('error: ' + err);
					res.json({'status' : err});
				} else if (!orig) {
					// no item in database found with matching id
					console.log('error: item not found');
				 	res.json({'status' : 'item not found'});
				}
			});
		} else {
			// no new info given
			res.json({'status' : 'no update to expDate'});
		}
	} else {
		// no id given, cannot find item
		console.log('error: no item id given');
		res.redirect('/all');
	}
});

// edit item's owner (JL)
// owner currently must be an id, not a name
app.use('/edit_item_owner', (req, res) => {
	var id = req.query.id;
	var owner = req.query.owner;  // an ID, not a name, currently
	if (id) {
		if (owner) {
			// find item first
			var filter = {'_id' : id};
			var item;
			Item.findOne(filter, (err, it) => {
				if (err) {
					console.log('error: '  + err);
					res.json({'status' : err});
				} else if (!it) {
					console.log('error: item not found');
					res.json({'status' : 'item not found'});
				} else {
					item = it;
				}
			});
			// delete item from old user's list
			filter = {'myItems' : {'_id' : id}};
			var action = {'$pull' : {'myItems' : {'_id' : id}}};
			User.findOneAndUpdate(filter, action, (err, orig) => {
				if (err) {
					console.log('error: '  + err);
					res.json({'status' : err});
				} else if (!orig) {
					// no user with item found
					console.log('error: old user not found');
					res.json({'status' : 'old user not found'});
				}
			});
			// add item to new user's list
			filter = {'_id' : owner};
			action = {'$push' : {'myItems' : item}};
			User.findOneAndUpdate(filter, action, (err, orig) => {
				if (err) {
					console.log('error: '  + err);
					res.json({'status' : err});
				} else if (!orig) {
					// no item in database found with matching id
					console.log('error: new user not found');
					res.json({'status' : 'new user not found'});
				}
			});
		} else {
			// no new info given
			res.json({'status' : 'no update to owner'});
		}
	} else {
		// no id given, cannot find item
		console.log('error: no item id given');
		res.redirect('/all');
	}
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

// endpoint for showing all the items
app.use('/all', (req, res) => {

	// find all the item objects in the database
		//can later expand to fridges/users

	Item.find({}, (err, items) => {
		if (err)
		{
			res.type('html').status(200);
			console.log('uh oh' + err);
			res.write(err);
		}else
		{
			if (items.length == 0)
			{
				res.type('html').status(200);
				res.write('There are no items');
				res.end();
				return;
			}
			else{
				res.type('html').status(200);
				res.write('Here are the items in the database:');
				res.write('<ul>');
				// show all the people
				persons.forEach( (item) => {
			    	res.write('<li>');
					res.write('Name: ' + item.name + '; Id: ' + item.id + '; Expiration Date: ' + item.expDate);

			    	// this creates a link to the /delete endpoint
			    	res.write(" <a href=\"/delete?id=" + item.id + "\">[Delete]</a>");
			    	res.write('</li>');

				});
				res.write('</ul>');
				res.end();
			}
		}

	}).sort({ "id": 'asc'});//sorts by id
});


app.use('/delete', (req, res) => {

	if (!req.query.id)
	{
		console.log('error id does not exist in url');
	}

	var filter = {'id':req.query.id};

	Person.findOneAndDelete(filter, (err, item) => {
		if (err){
			console.log('person does not exist in database');
		}else if (!person)
		{
			console.log('no person');
		}else
		{
			console.log({'status': 'success'});
		}
	})

    res.redirect('/all');
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
