var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var FriendSchema = new Schema({

friendId: {type : String, default : '', trim : true, ref: 'User'},
createdAt: {type : Date, default : '', trim : true},
ownerId: {type : String, default : '', trim : true, ref: 'User'}, 
// if IsFriend is true, means the user of ownerId and friendID are friend
isFriend: {type : Boolean, default : false , trim : true},
privacy: {type : String, default : '' , trim : true}

});

FriendSchema.statics = {
/*
Created by: Steve Chen
Description: This is a query function that look for a particular
docuement in the Friend database.
Return: It should only return ONE document.
*/
  checkFriend: function (ownerId,friendId, cb) {
    this.find({
    	$and: [
    	{ownerId : ownerId },  
        {friendId: friendId}
        ]})

      .exec(cb);
  },

/*
Created by: Steve Chen
Description: This function will delete 2 document in the Friend
database. It will delete the "link" for the user to it friend
and the friend to the user. Thus 2 document is deleted
Return: Number of document it deletes. Should always
return 2.
*/  
  deleteFriend: function (ownerId,friendId, cb) {
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
/*
Created by: Steve Chen
Description: This function is to check if there exist two
document. User connection to the friend and vice versa.  
Return: If return 1 document, it means friend is in pending stage. 
If return 2 document, it means both are friends. If return 0 
document, it means both are not friend.
*/  

  checkIsFriend: function (ownerId,friendId, cb) {
    this.find({
      $or: [
        {$and: [{ownerId : ownerId },  
        {friendId: friendId}]},
        {$and: [{ownerId : friendId },  
        {friendId: ownerId}]},

        ]})
      .exec(cb);
  },
/*
Created by: Steve Chen
Description: This function is change the boolean of the isFriend
in the friend Schema.
Return: Number of document changed.
*/        
  updateIsFriendBoolean: function (ids, cb) {

    this.update( {_id : {"$in":ids}}, {isFriend:true} , {multi: true})

      .exec(cb);
  },
/*
Created by: Steve Chen
Description: This function is to get the list of friend, of the user, from the
Friend database.
Return: an Array of friends 
*/     
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