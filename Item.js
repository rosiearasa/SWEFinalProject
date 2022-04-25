/* Item object - holds an item in the fridge */

var mongoose = require('mongoose');
const User = require('./User');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    type: {type: String, required: true},
    expDate: {type: Date, required: true},
    dateAdded: Date,
    user: {type: Schema.ObjectId, ref: 'User'},
    userName: String,
    inFridge: {type: Number, required: true},
    anonymous: Boolean,
    note: [] //[note, public? (true for public, false for private)]
    });

// export itemSchema as a class called Item
module.exports = mongoose.model('Item', ItemSchema);

ItemSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
