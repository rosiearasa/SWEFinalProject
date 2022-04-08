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
//var Fridge = require('./Fridge.js');
const { json } = require('express/lib/response');

//give user an id based
var userID = Date.now()

//redirects to the add user form
app.use('/add_user', (req,res)=> {
	res.redirect('/public/addUserForm.html');
});

//add user to the database
app.use('/adduser', (req,res)=>{
	var newUser = new User({
		name: req.body.name,
		roomNumber: req.body.roomNumber,
});
console.log(newUser)
// //save the person to the database
	newUser.save((err) => { 
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
// res.redirect('/addUserForm.html');

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

//adds the item to the database (MJ)
app.use('/add_item', (req, res) => {
	// construct the Item from the form data which is in the request body
	var newItem = new Item ({
		type: req.body.type,				//the type/name of the food item
		expDate: new Date(req.body.expDate),//the expiration date
		//the date the item was added - current date if 'today' was checked, otherwise the specified date
		dateAdded:((req.body.today=='yes') ? Date.now() : req.body.dateAdded),
		user: null,							//the user associated with it - null if added from the web
		inFridge: 0,						//the fridge the item is in - all in fridge 0 right now
		id: Date.now()/60,					//the ID of the item
		//any note associated with the item, true if it's public and false if private
		note: [req.body.note, req.body.public=='yes']	
		});
	console.log(newItem);

	// save the item to the database
	newItem.save( (err) => {
		if (err) {
			res.type('html').status(200);
			res.write('uh oh: ' + err);
			console.log(err);
			res.end();
		}
		else {
			// display the "successfull created" message
			res.type('html').status(200);
			res.write('Successfully added ' + newItem.type + ' to the database');
			res.write("<br><a href=\"/public/addItemForm.html\">Click here to add another item</a>");
			res.end()
		}
		} );
	});

// endpoint for showing all the items
app.use('/all', (req, res) => {

	// find all the item objects in the database
		//can later expand to fridges/users

	Fridge.find({}, (err, fridges) => {

		if (err)
		{
			res.type('html').status(200);
			console.log('uh oh: ' + err);
			res.write(err);
		}else
		{
			if (fridges.length == 0)
			{
				res.type('html').status(200);
				res.write('There are no items');
				res.end();
				return;
			}
			else{
				
				res.type('html').status(200);
				res.write('Here are the items in the database:<br>');
				res.write(" <a href=\"/show_expired\">[Expired Items]</a>");
				// show all the items
				
				fridges.forEach( (fridge) => {
					res.write('<br><br>')
					res.write('Fridge #' + fridge.id + ':');

					var length = fridge.items.length;
					var count = 0;
					res.write('<ul>');
					res.write('<li>Items:</li>')
					res.write('<ul>');
					while (count < length)
					{
						res.write('<li>');
						res.write('Type: ' + fridge.items[count].type + '; Id: ' + fridge.items[count].id + '; Expiration Date: ' + fridge.items[count].expDate);
	
						// this creates a link to the /delete endpoint
						res.write(" <a href=\"/delete?id=" + fridge.items[0].id + "\">[Delete]</a>");
						res.write('</li>');
						count = count + 1;

					}
					res.write('</ul>');
					res.write('</ul>');
				});
				
				
				res.end();
			}
		}

	}).sort({ "id": 'asc'});//sorts by id
});

//Shows all the expired items in the fridges and some info about them (MJ)
app.use('/show_expired', (req, res) => {

	//gets all Item objects in the datebase
	Item.find({}, (err, items) => {

		if (err) {
			res.type('html').status(200);
			console.log('uh oh: ' + err);
			res.write(err);
		} else {
			if (items.length == 0) {
				//no items
				res.type('html').status(200);
				res.write('There are no items');
				res.end();
				return;
			} else{
				
				res.type('html').status(200);
				res.write('Expired items in your fridges:<br>');
				
				res.write('<ul>');
				//for each item, check if the expiration date is after the current date
				items.forEach( (item) => {
					if(item.expDate < Date.now()) {
						res.write('<li>');
						res.write(item.type + ' expired on ' + (item.expDate).toDateString());
						res.write('<br>&emsp;Belongs to: ' + item.user);
						//if there's a note, display it; otherwise, say 'No note'
						res.write(';&emsp;' + ((item.note[0]!=undefined && item.note[0]!='') ? 'Note: ' + item.note[0] : 'No note'));
						res.write('</li>');
					}
				});
				res.write('</ul>');
				
				res.end();
			}
		}

	}).sort({'expDate': 'asc'}); //sort by the expiration date in ascending order

});

app.use('/delete', (req, res) => {

	if (!req.query.id)
	{
		console.log('error: id does not exist in url');
	}

	var filter = {'id': 0};
	var action = {'$pull': {id: req.query.id }}

	Fridge.findOneAndUpdate( filter, action, (err, orig) => {
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
		else {
		    // display the "successfull created" message
			res.redirect('/all');
		}
	    } );

	});




//unformatted print of Items to test functions
app.use('/api', (req, res) => {

	// construct the query object
	var queryObject = {};

	Item.find( queryObject, (err, items) => {
		console.log(items);
		if (err) {
		    console.log('uh oh' + err);
		    res.json({});
		}
		else if (items.length == 0) {
		    // no objects found, so send back empty json
		    res.json({});
		}
		else if (items.length == 1 ) {
		    var item = items[0];
		    // send back a single JSON object
		    //res.json( { "type" : item.type, "id" : item.id , "expDate" : item.expDate, "dateAdded" : item.dateAdded } );
			res.json( { 'type' : item.type, 'expDate' : (item.expDate).toDateString(), 'date Added' : (item.dateAdded).toDateString() } );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    items.forEach( (item) => {
			    //returnArray.push( { "type" : item.type, "id" : item.id , "expDate" : item.expDate, "dateAdded" : item.dateAdded } );
				returnArray.push( { 'type' : item.type, 'expDate' : (item.expDate).toDateString(), 'date Added' : (item.dateAdded).toDateString() } );
			});
		    // send it back as JSON Array
		    res.json(returnArray);
		}

	    });
    });



app.use('/public', express.static('public'));

//Redirect to the form to add
app.use('/', (req, res) => {
	//CHANGE TO REDIRECTING TO HOME PAGE
	res.redirect('/public/addItemForm.html');
});

app.listen(3000,  () => {
    console.log('Listening on port 3000');
    });
