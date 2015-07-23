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


var changeIsFriendValue = function (req, res, friendDocument) {

		if(req.user){
		var userID = req.user._id;
		var myIsFriend
		var friendIsFriend

		MyFriend.search("123", function (err, myFriend) {// change the username. Need frontend to pass
			if(myFriend){

				Friend.checkIsFriend(myFriend._id, userID, function (err, checkFriend){
					console.log(checkFriend[0]);
					console.log(checkFriend[1]);
					console.log(checkFriend.length);
					if(checkFriend.length == 2){//update isFriend to true

						var ids= [];
						for (var i=0; i<checkFriend.length; ++i) {
						    ids.push(checkFriend[i].id);
						}

						Friend.updateIsFriendBoolean(ids, function (err, numofDocChnaged){

							if(numofDocChnaged != 2){
								console.log("Didnt update isFriend Boolean")
							}
						});//updateIsFriendBoolean

					}else{ // creating a new doc for user's friend

						console.log("update to false")

					}//else
				});//checkIsFriend						
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

var getFriendList = function (req, res) {

	if(req.user){
		var userID = req.user._id;
		console.log("hi")
		Friend.getAllFriends(userID, function (err, listOfFriends){
			console.log(listOfFriends.length)
			for (var i=0; i<listOfFriends.length; ++i) {
			    console.log(listOfFriends[i]);
			}			

			if(listOfFriends.length > 1){
				return listOfFriends;
			}else{

			}		


		});


	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


	
}


exports.addFriend = function (req, res){
	//isFriend(req,res)
	if(req.user){
		var userID = req.user._id;
		MyFriend.search("123", function (err, myFriend) { // change the username. Need frontend to pass
			if(myFriend){

				Friend.checkFriend(userID, myFriend._id, function (err, checkFriend){

					//console.log(checkFriend[0]);

					if(checkFriend[0]){
						console.log("U already added him/her as friend")
					}else{ // creating a new doc for user's friend

						//console.log(myFriend)
						var date = new Date();
						var newFriend = new Friend({

							friendId: myFriend._id,
							createdAt: date,
							ownerId: userID,
							privacy: false
						});//newFriend

						newFriend.save(function(err, userinfo) {
						if(!err) {
							changeIsFriendValue(req, res, userinfo)
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

exports.deleteFriend = function (req, res){

	if(req.user){
		var userID = req.user._id;
		MyFriend.search("w", function (err, myFriend) {// change the username. Need frontend to pass
			if(myFriend){

				Friend.deleteFriend(userID, myFriend._id, function (err, numOfDocRemoved){

					//console.log(numOfDocRemoved);

					if(numOfDocRemoved == 2){
						console.log("Friend deleted")						

					}else{ // creating a new doc for user's friend
						console.log("Friend not deleted")

					}//else

				});//deleteFriend

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

exports.isFriend = getFriendList