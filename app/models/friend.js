var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var FriendSchema = new Schema({


friends: [{
	friendsId: {type : String, default : '', trim : true},
	username: {type : String, default : '', trim : true},
	addedAt: {type : String, default : '', trim : true}
}],
createdAt: {type : String, default : '', trim : true},
ownerId: {type : String, default : '', trim : true},
privacy: {type : Boolean, default : true , trim : true}

});

mongoose.model('Friend', FriendSchema);