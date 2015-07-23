var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');

var Schema = mongoose.Schema;

var FriendSchema = new Schema({

friendsId: {type : String, default : '', trim : true, ref: 'User'},
createdAt: {type : Date, default : '', trim : true},
ownerId: {type : String, default : '', trim : true, ref: 'User'},
privacy: {type : Boolean, default : false , trim : true}

});

FriendSchema.statics = {

  checkFriend: function (ownerId,friendId, cb) {
    //console.log("cb = " + cb)
    //console.log("name = " + summonerName)
    this.find({
    	$and: [
    	{ownerId : ownerId },  
        {friendsId: friendId}
        ]})


      // .populate('user', 'name email username')
      // .populate('comments.user')
      .exec(cb);
  },

}

mongoose.model('Friend', FriendSchema);