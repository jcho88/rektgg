/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Friend = mongoose.model('Friend')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var request = require('request')
var async = require('async')
var MyFriend = mongoose.model('User')

exports.add = function (req, res){

	if(req.user){
		var userID = req.user._id;
		MyFriend.search("123", function (err, myFriend) {
			if(myFriend){

				Friend.checkFriend(userID, myFriend._id, function (err, myFriend){

					//console.log(myFriend);

					if(myFriend){
						console.log("U already added him/her as friend")
					}else{ // creating a new doc for user's friend

						console.log(myFriend)
						var date = new Date();
						var newFriend = new Friend({

							friendsId: myFriend._id,
							createdAt: date,
							ownerId: userID,
							privacy: false
						});//newFriend

						newFriend.save(function(err, userinfo) {
						if(!err) {
						    console.log("Friend Added");
			      
						}
						else {
						    console.log("Friend Not added");

						}
						});//save

					}//else

				});//checkfriend

			}
			else{
				console.log("Cannot find myFriend")

			}//else
		});//search

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else

}