var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var FriendSchema = new Schema({

friendId: {type : String, default : '', trim : true, ref: 'User'},
createdAt: {type : Date, default : '', trim : true},
ownerId: {type : String, default : '', trim : true, ref: 'User'},
isFriend: {type : Boolean, default : false , trim : true},
privacy: {type : Boolean, default : false , trim : true}

});

FriendSchema.statics = {

  checkFriend: function (ownerId,friendId, cb) {
    //console.log("cb = " + cb)
    //console.log("name = " + summonerName)
    this.find({
    	$and: [
    	{ownerId : ownerId },  
        {friendId: friendId}
        ]})


      // .populate('user', 'name email username')
      // .populate('comments.user')
      .exec(cb);
  },
  deleteFriend: function (ownerId,friendId, cb) {
    //console.log("cb = " + cb)
    //console.log("name = " + summonerName)
    this.find({
      $or: [
        {$and: [{ownerId : ownerId },  
        {friendId: friendId}]},
        {$and: [{ownerId : friendId },  
        {friendId: ownerId}]},

        ]})
      // .populate('user', 'name email username')
      // .populate('comments.user')
      .remove().exec(cb);
  },  
  checkIsFriend: function (ownerId,friendId, cb) {
    //console.log("cb = " + cb)
    //console.log("name = " + summonerName)
    this.find({
      $or: [
        {$and: [{ownerId : ownerId },  
        {friendId: friendId}]},
        {$and: [{ownerId : friendId },  
        {friendId: ownerId}]},

        ]})


      // .populate('user', 'name email username')
      // .populate('comments.user')
      .exec(cb);
  },    
  updateIsFriendBoolean: function (ids, cb) {
    //console.log("cb = " + cb)
    //console.log("name = " + summonerName)
    this.update( {_id : {"$in":ids}}, {isFriend:true} , {multi: true})


      // .populate('user', 'name email username')
      // .populate('comments.user')
      .exec(cb);
  },
  getAllFriends: function (ownerId, cb) {

    this.find({
      $and: [
        {ownerId : ownerId },  
        {isFriend: true}
        ]})
      .populate('friendId')
      .exec(cb);
  },        

}

mongoose.model('Friend', FriendSchema);