/* Modified from Person.js from Lab 7 --- not sure if it's right*/
/* Item object - holds an item in the fridge */

var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
    type: {type: String, required: true}, //changed from 'name'
    id: {type: Number, required: true, unique: true},
    expDate: {type: Date, required: true},
    dateAdded: Date,
    });

// export itemSchema as a class called Item
module.exports = mongoose.model('Item', itemSchema);

itemSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
