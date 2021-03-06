/* Fridge object - represents a fridge, holds a list of users and a list of items */

var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var fridgeSchema = new Schema({
	// id: {type: Number, required: true, unique: true},
  users: [],
  items: [],
	function: {type: String},
	capacity: {type: Number}
    });

// export fridgeSchema as a class called Fridge
module.exports = mongoose.model('Fridge', fridgeSchema);
