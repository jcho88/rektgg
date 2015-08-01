var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var ProfileSchema = new Schema({

ownerID: {type : String, default : '', trim : true},
aboutMe: {type : String, default : '', trim : true},
profileImage: {type : String, default : '', trim : true},
profileCoverImage: {type : String, default : '', trim : true},
privacy: {type : String, default : 'P' , trim : true}

});

mongoose.model('Profile', ProfileSchema);