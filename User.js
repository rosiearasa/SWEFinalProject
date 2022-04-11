/* User object - represents a user of the fridge, does not store items */

var mongoose = require('mongoose');

// the host:port must match the location where you are running MongoDB
// the "myDatabase" part can be anything you like
mongoose.connect('mongodb://127.0.0.1:27017/myDatabase');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true},
    id: {type: Number, required: false, unique: true},
    roomNumber: {type: Number, required: true},
    // myItems: []
    });

// export userSchema as a class called User
module.exports = mongoose.model('User', userSchema);

userSchema.methods.standardizeName = function() {
    this.name = this.name.toLowerCase();
    return this.name;
}
