/* Fridge object - represents a fridge, holds a list of users and a list of items */

var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var fridgeSchema = new Schema({
	id: {type: Number, required: true, unique: true},
  users: [],
  items: []
    });

// export fridgeSchema as a class called Fridge
module.exports = mongoose.model('Fridge', fridgeSchema);
