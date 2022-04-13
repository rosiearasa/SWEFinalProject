/* Main file for Expir-ational Project
 * Maya Johnson, Ashley Park, Jasmine Lei, Rosie Arasa
 * ---------------------------------------------------
 * List of endpoints (in order of appearance in the code)
 *   ~ /adduser (RA):
 *   ~ /removeuser (RA):
 *   ~ /edit_item_expDate_request (JL): writes an html form to get new expDate
 *   ~ /edit_item_owner_request (JL): writes an html form to get new owner
 *   ~ /edit_item_anonymity_request (JL): writes an html form to get new anon.
 *   ~ /edit_item_expDate (JL): changes expDate according to html form
 *   ~ /edit_item_owner (JL): changes owner according to html form
 *   ~ /edit_item_anonymity (JL): toggle anonymity according to html form
 *   ~ /add_item (MJ):
 *   ~ /all (AP):
 *   ~ /show_expired (MJ):
 *   ~ /delete (AP):
 *   ~ /api:
 *   ~ /all_users (JL): really quick implementation, just to see the users
 *   ~ /home (JL): links to all other web pages; other web pages may or may not link back
 */



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

//add user to the database
app.use('/adduser', (req,res)=>{
	var newUser = new User({
		name: req.body.name,
		roomNumber: req.body.roomNumber,
});
console.log(newUser)

// //save the user to the database
	newUser.save((err) => {
		if (err) {
		    res.type('html').status(200);
		    res.write('uh oh: ' + err);
		    console.log(err);
		    res.end();
		}
				if(!err) {
					res.json({'status': 'success'})
		    // display the "successfull created" message
		    res.send('successfully added ' + newUser.name + ' to the database');
		

		}
});


});

// endpoint for showing all the people
app.use('/allusers', (req, res) => {
    
	// find all the Person objects in the database
	User.find( {}, (err, users) => {
		if (err) {
		    res.type('html').status(200);
		    console.log('uh oh' + err);
		    res.write(err);
		}
		else {
		    if (users.length == 0) {
			res.type('html').status(200);
			res.write('There are no Users');
			res.end();
			return;
		    }
		
		    else {
			res.type('html').status(200);
			res.write('Here are the Users in the database:');
			res.write('<ul>');
			// show all the people
			users.forEach( (user) => {
			    res.write('<li>');
			    res.write('Name: ' + user.name + '; RoomNumber: ' + user.roomNumber);
			    // this creates a link to the /delete endpoint
			    res.write(" <a href=\"/deleteuser?name=" + user.name + "\">[Delete]</a>");
			    res.write('</li>');
					 
			});
			res.write('</ul>');
			res.end();
		    }
		
		}

	    }) 
});

//remove user
app.use('/deleteuser', (req, res) => {
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

    res.redirect('/allusers');
});

// interface to edit expDate (JL)
app.use('/edit_item_expDate_request', (req, res) => {
	Item.find( {}, (err, items) => {
		if (err) {
	    res.type('html').status(200);
	    console.log('uh oh' + err);
	    res.write(err);
		} else if (items.length == 0) {
				res.type('html').status(200);
				res.write('There are no items to edit.<br><br>');
				res.write('<a href=\"/home\">Go back to Home</a>');
				res.send();
		} else {
			// write an html form
			res.type('html').status(200);
			res.write('<form action=\"/edit_item_expDate\" method=\"post\">');

			// choose an item
			res.write('<label for=\"item\">Choose an item:</label>');
			res.write('<select name=\"id\" id=\"item\">');
			items.forEach( (item) => {
				// only display name of item, for now
				res.write('<option value=\"' + item._id + '\">' + item.type + '</option>');
			});
			res.write('</select><p>');

			// enter new expDate
			res.write('New Expiration Date: <input name=\"expDate\"><p>');

			res.write('<input type=\"submit\" value=\"Edit Item!\">');
			res.write('</form><br>');
			res.write('<a href=\"/home\">Go back to Home</a>');
			res.send();
		}
	});
});

// interface to edit owner (JL)
app.use('/edit_item_owner_request', (req, res) => {
	Item.find( (err, items) => {
		if (err) {
	    res.type('html').status(200);
	    console.log('uh oh' + err);
			res.write('</form><br>');
			res.write('<a href=\"/home\">Go back to Home</a>');
	    res.send(err);
		} else if (items.length == 0) {
				res.type('html').status(200);
				res.write('There are no items to edit.<br><br>');
				res.write('<a href=\"/home\">Go back to Home</a>');
				res.send();
		} else {
			// write an html form
			res.type('html').status(200);
			res.write('<form action=\"/edit_item_owner\" method=\"post\">');

			// choose an item
			res.write('<label for=\"item\">Choose an item:</label>');
			res.write('<select name=\"id\" id=\"item\">');
			items.forEach( (item) => {
				// only display name of item, for now
				res.write('<option value=\"' + item._id + '\">' + item.type + '</option>');
			});
			res.write('</select><p>');

			// choose a user
			User.find( (err, users) => {
				if (err) {
			    console.log('uh oh' + err);
			    res.write(err);
					res.write('</form><br>');
					res.write('<a href=\"/home\">Go back to Home</a>');
					res.send();
				} else if (users.length == 0) {
						res.write('There are no users to edit.<br><br>');
						res.write('</form><br>');
						res.write('<a href=\"/home\">Go back to Home</a>');
						res.send();
				} else {
					res.write('<label for=\"user\">New owner:</label>');
					res.write('<select name=\"owner\" id=\"user\">');
					users.forEach( (user) => {
						// only display name of user, for now
						res.write('<option value=\"' + user._id + '\">' + user.name + '</option>');
					});
					res.write('</select><p>');
					res.write('<input type=\"submit\" value=\"Edit Item!\">');
					res.write('</form><br>');
					res.write('<a href=\"/home\">Go back to Home</a>');
					res.send();
				}
			});
		}
	});
});

// interface to edit anonymity (JL)
app.use('/edit_item_anonymity_request', (req, res) => {
	Item.find( {}, (err, items) => {
		if (err) {
			res.type('html').status(200);
			console.log('uh oh' + err);
			res.write(err);
		} else if (items.length == 0) {
				res.type('html').status(200);
				res.write('There are no items to edit.<br><br>');
				res.write('<a href=\"/home\">Go back to Home</a>');
				res.end();
				return;
		} else {
			// write an html form
			res.type('html').status(200);
			res.write('<form action=\"/edit_item_anonymity\" method=\"post\">');

			// choose an item
			res.write('<label for=\"item\">Choose an item:</label>');
			res.write('<select name=\"id\" id=\"item\">');
			items.forEach( (item) => {
				// only display name of item, for now
				res.write('<option value=\"' + item._id + '\">' + item.type + '</option>');
			});
			res.write('</select><p>');

			// enter new anonymity value
			// choose an item
			res.write('<label for=\"anonymous\">Anonymous?: </label>');
			res.write('<select name=\"anonymous\" id=\"anonymous\">');
			res.write('<option value=\"true\">yes</option>');
			res.write('<option value=\"false\">no</option>');

			res.write('</select><p>');

			res.write('<input type=\"submit\" value=\"Edit Item!\">');
			res.write('</form><br>');
			res.write('<a href=\"/home\">Go back to Home</a>');
			res.send();
		}
	});
});

// edit item expDate field (JL)
app.use('/edit_item_expDate', (req, res) => {
	var id = req.body.id;
	var expDate = req.body.expDate;
	if (id) {
		res.type('html');
		var filter = {'_id' : id};
		console.log("look for id: " + id);
		if (expDate) {
			var action = {'$set' : {'expDate' : expDate}};
			Item.findOneAndUpdate(filter, action, (err, orig) => {
				if (err) {
					res.send('error: ' + err);
				} else if (!orig) {
					// no item in database found with matching id
				 	res.send('error: item not found');
				} else {
					res.write('Successfully updated the expiration date of ' + orig.type + '<br><br>');
					res.write('<a href=\"/home\">Go back to Home</a>');
					res.send();
				}
			});
		} else {
			// no new info given
			res.send('no update to expDate');
		}
	} else {
		// no id given, cannot find item
		console.log('error: no item id given');
		res.redirect('/home');
	}
});

// edit item's user field (JL)
app.use('/edit_item_owner', (req, res) => {
	var id = req.body.id;
	var owner = req.body.owner;  // an ID, not a name, currently
	if (id) {
		res.type('html');
		var filter = {'_id' : id};
		console.log("look for id: " + id);
		if (owner) {
			var action = {'$set' : {'user' : owner}};
			Item.findOneAndUpdate(filter, action, (err, orig) => {
				if (err) {
					res.send('error: ' + err);
				} else if (!orig) {
					// no item in database found with matching id
					res.send('error: item not found');
				} else {
					res.write('Successfully updated the owner of ' + orig.type + '<br>');
					res.write('<a href=\"/home\">Go back to Home</a>');
					res.send();
				}
			});
		} else {
			// no new info given
			res.send('no update to owner');
		}
	} else {
		// no id given, cannot find item
		console.log('error: no item id given');
		res.redirect('/home');
	}
});

// edit item anonymous field (JL
// even if anonymous is undefined, the field will still be set (undefined == false)
app.use('/edit_item_anonymity', (req, res) => {
	var id = req.body.id;
	var anonymous = req.body.anonymous;
	if (id) {
		res.type('html');
		var filter = {'_id' : id};
		console.log("look for id: " + id);
		var action = {'$set' : {'anonymous' : anonymous}};
		Item.findOneAndUpdate(filter, action, (err, orig) => {
			if (err) {
				res.send('error: ' + err);
			} else if (!orig) {
				// no item in database found with matching id
			 	res.send('error: item not found');
			} else {
				res.write('Successfully updated the anonymity of ' + orig.type + '<br><br>');
				res.write('<a href=\"/home\">Go back to Home</a>');
				res.send();
			}
		});
	} else {
		// no id given, cannot find item
		console.log('error: no item id given');
		res.redirect('/home');
	}
});

//reads the info from the form and passes it to /add_item
app.use('/read_add_item_form', (req, res) => {

	type = req.body.type,				//the type/name of the food item
	expDate = new Date(req.body.expDate),//the expiration date
	//the date the item was added - current date if 'today' was checked, otherwise the specified date
	dateAdded =((req.body.today=='yes') ? Date.now() : req.body.dateAdded),
	user = null,							//the user associated with it - null if added from the web
	inFridge = 0,						//the fridge the item is in - all in fridge 0 right now
	// id: Date.now()/60,					//the ID of the item
	anonymous = false,      // default not anonymous
	//any note associated with the item, true if it's public and false if private
	note = req.body.note
	//public = req.body.public=='yes'

	let url = `/add_item?type=${type}&expDate=${expDate}&dateAdded=${dateAdded}&user=${user}&inFridge=${inFridge}&anonymous=${anonymous}&note=${note}&public=${req.body.public}`
	res.redirect(url)
});

//adds the item to the database (MJ)
app.use('/add_item', (req, res) => {
	// construct the Item from the form data which is in the request body
	console.log("got here");
	var newItem = new Item ({
		type: req.query.type,				//the type/name of the food item
		expDate: new Date(req.query.expDate),//the expiration date
		//the date the item was added - current date if 'today' was checked, otherwise the specified date
		dateAdded:((req.query.today=='yes') ? Date.now() : req.query.dateAdded),
		user: null,							//the user associated with it - null if added from the web
		inFridge: 0,						//the fridge the item is in - all in fridge 0 right now
		// id: Date.now()/60,					//the ID of the item
		anonymous: false,      // default not anonymous
		//any note associated with the item, true if it's public and false if private
		note: [req.query.note, req.query.public=='yes']
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

	Item.find({}, (err, items) => {

		if (err)
		{
			res.type('html').status(200);
			console.log('uh oh: ' + err);
			res.write(err);
		}else
		{
			if (items.length == 0)
			{
				res.type('html').status(200);
				res.write('There are no items');
				res.write('</form><br>');
				res.write('<a href=\"/home\">Go back to Home</a>');
				res.end();
				return;
			}
			else{

				res.type('html').status(200);
				res.write('Here are the items in the database:<br>');
				res.write(" <a href=\"/show_expired\">[Expired Items]</a>");
				// show all the items

				res.write('<br><br>')
					res.write('<ul>');
					res.write('<li>Items:</li>')
					res.write('<ul>');



				items.forEach((item) => {

					var owner = "HIDDEN";  // default private

					var anonymous = 'True';

					if (item.anonymous == false)
					{
						anonymous = 'False';
						owner = item.user;
					}

					res.write('<li>');
						res.write('Type: ' + item.type + '; Expiration Date: ' + item.expDate + '; Date Added: ' + item.dateAdded + '; Owner: ' + owner + '; Anonymity: ' + anonymous);

						// this creates a link to the /delete endpoint
						res.write(" <a href=\"/delete?id=" + item._id + "\">[Delete]</a>");
						res.write('</li>');
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
		res.end();
	}



	Item.findOneAndDelete( {'_id' : req.query.id }, (err, iem) => {
		if (err) {
		   res.json( { 'status' : err } );
		}
		else if (!iem) {
		   res.json( { 'status' : 'no person' } );
		}
		else {
		   res.redirect('/all');
		}
	});

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
			res.json( { 'type' : item.type, 'expDate' : (item.expDate).toDateString(), 'date Added' : (item.dateAdded).toDateString(), 'owner' : item.user, 'anonymous' : item.anonymous } );
		}
		else {
		    // construct an array out of the result
		    var returnArray = [];
		    items.forEach( (item) => {
			    //returnArray.push( { "type" : item.type, "id" : item.id , "expDate" : item.expDate, "dateAdded" : item.dateAdded } );
				returnArray.push( { 'type' : item.type, 'expDate' : (item.expDate).toDateString(), 'date Added' : (item.dateAdded).toDateString(), 'owner' : item.user, 'anonymous' : item.anonymous } );
			});
		    // send it back as JSON Array
		    res.json(returnArray);
		}

	    });
    });

// list all users, formatted like /api (JL)
app.use('/all_users', (req, res) => {
	User.find( (err, users) => {
		if (err) {
			console.log('error: ' + err);
		} else {
			console.log(users);
			res.json(users);
		}
	});
});

// home page with links to other pages
app.use('/home', (req, res) => {
	res.type('html');
	res.write('Welcome to the Fridge!');
	res.write('<ul>');

	res.write('Manage Users:')
	res.write('<ul>');
	// add user form
  res.write('<li>');
  res.write(" <a href=\"/public/addUserForm.html" + "\">Add User</a>");
  res.write('</li>');
	// remove user ===========
	res.write('<li>');
	res.write(" <a href=\"/allusers" + "\">Remove User</a>");
	res.write('</li>');
	res.write('</ul>');

	res.write('Manage Items:')
	res.write('<ul>');
	// add item form
	res.write('<li>');
	res.write(" <a href=\"/public/addItemForm.html" + "\">Add Item</a>");
	res.write('</li>');
	// remove item (from /all)
	res.write('<li>');
	res.write(" <a href=\"/all" + "\">Delete Item</a>");
	res.write('</li>');
	// edit item expDate
	res.write('<li>');
	res.write(" <a href=\"/edit_item_expDate_request" + "\">Edit Item Expiration Date</a>");
	res.write('</li>');
	// edit item owner
	res.write('<li>');
	res.write(" <a href=\"/edit_item_owner_request" + "\">Edit Item Owner</a>");
	res.write('</li>');
	// edit item anonymity
	res.write('<li>');
	res.write(" <a href=\"/edit_item_anonymity_request" + "\">Edit Item Anonymity</a>");
	res.write('</li>');

	res.write('</ul>');

	res.write('View Data:')
	res.write('<ul>');
	// all items
	res.write('<li>');
	res.write(" <a href=\"/all" + "\">All Items</a>");
	res.write('</li>');
	// expired items
	res.write('<li>');
	res.write(" <a href=\"/show_expired" + "\">Expired Items</a>");
	res.write('</li>');
	// all users
	res.write('<li>');
	res.write(" <a href=\"/all_users" + "\">All Users (API version)</a>");
	res.write('</li>');
	// api
	res.write('<li>');
	res.write(" <a href=\"/api" + "\">All Items (API version)</a>");
	res.write('</li>');

	res.write('</ul>');

	res.write('</ul>');
	res.send();
});



app.use('/public', express.static('public'));

//Redirect to the form to add
app.use('/', (req, res) => {
	res.redirect('/home');
});

app.listen(3000,  () => {
    console.log('Listening on port 3000');
    });
