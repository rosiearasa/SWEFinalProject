/* User object - represents a user of the fridge and the items they have in it */

var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://localhost:27017/myDatabase');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    id: {type: Number, required: true, unique: true},
    roomNumber: {type: Number, required: true},
    myItems: []
    });

// export itemSchema as a class called Item
module.exports = mongoose.model('User', userSchema);

userSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
