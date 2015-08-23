var mongoose = require('mongoose')
var Post = mongoose.model('Post')
var User = mongoose.model('User')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var request = require('request')
var async = require('async')


exports.createPost = function (req, res){

	var wallId =req.body.wallId; //self post
	if(req.user){

		if(req.body.mypost == null){ //when message body is empty
			console.log("nothing")
		}

		var userID = req.user._id;
		console.log(req.body.mypost)

		var date = Date.now;
		var newPost = new Post({

			message: req.body.mypost,
			ownerId: userID,
			userWallId: wallId
		});//newPost

		newPost.save(function(err, postinfo) {
		if(!err) {
		    console.log("post created");
  			res.redirect('back')
		}
		else {
		    console.log("error creating post");
		}
		});//save	


	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


}

exports.deletePost = function (req, res){

	if(req.user){
		var postID = req.body.postId
		var userID = req.user._id;	
		console.log(req.body.postId)
		Post.deletePost(userID, postID, function (err, numOfDocRemoved){

			//console.log(numOfDocRemoved);

			if(numOfDocRemoved == 1){
				console.log("Post deleted")
				res.redirect('back')						

			}else{ // creating a new doc for user's friend
				console.log("Post not deleted")
			}//else
		});//deleteFriend

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else	

}

exports.getAllPost = function (req, res){

	var userID = req.user._id;
	console.log("in get All Post")
	Post.getAllPost(userID, function (err, listOfPost){
		console.log(listOfPost.length)
		console.log(err)	
		for (var i=0; i<listOfPost.length; ++i) {
		    console.log(listOfPost[i]);
		}			

		if(listOfPost.length > 0){
			return listOfPost;
		}else{

		}		


	});	
	//check the privacy of the user
	//look for the wall ID
	//check database with wallID and sort by time
	//return the all the post
}


var getAllPostLocal   = function (userId, res){

	var userID = userId;
	console.log("in get All Post")
	Post.getAllPost(userID, function (err, listOfPost){
		
		if(err){
			res.redirect('/')
		}

		res.render("activity/index",{ 
			listOfPost: listOfPost,
			wallId: userID}
			);		


	});	
	//check the privacy of the user
	//look for the wall ID
	//check database with wallID and sort by time
	//return the all the post
}

exports.index = function (req, res){


	 async.series([
	 	function(callback) {	//check if user verified
	        Summoner.hasUser(req.params.userid, function (err, summonerId){

	        	if(err){
	        		//flash
	        	}else{
	        		console.log("summonerId");
	        		console.log(summonerId);
	        		callback();
	        	}

			});
	    }
        ],
        function(err) {
            if (err) return next(err);

			User.searchById(req.params.userid, function (err, userInfo){

				//console.log(userInfo)		

				if(err){
					res.redirect('/')
				}else{

					getAllPostLocal(req.params.userid, res);

				}		


			});
        });

}

exports.getPost = function (req, res){

	var summoner_ID_info;

	 async.series([
	 	function(callback) {	
	 		console.log(req.params.userid)
	        Summoner.hasUser(req.params.userid, function (err, summonerId){

	        	if(err){
	        		//flash
	        		console.log("poop");
	        	}else{
	        		//console.log("summonerId");
	        		console.log(summonerId);
	        		summoner_ID_info = summonerId;
	        		callback();
	        	}

			});
	    }
        ],
        function(err) {
            if (err) return next(err);

			Post.getPost(req.params.postId, function (err, postInfo){

				console.log(postInfo)		

				if(err){
					res.redirect('/')
				}else{

					if(summoner_ID_info == null || postInfo == null){
						res.redirect('/')
					}else{
						res.render("activity/comment",{ 
						postInfo: postInfo}
						);	
					}

					
				}		


			});
        });

}

exports.editPost = function (req, res){

	if(req.user){

		if(req.user._id.toString().localeCompare(req.body.authorId.toString()) == 0){
			Post.editPost(req.body.message, req.body.postId, function (err, numofDocChnaged){

				if(err){ 
					console.log("do error call")
				}

				if(numofDocChnaged == 1){
					console.log("Post editied")
				}else{
					console.log("Didnt edit post")
				}

			});//editPostComment
		}else{

			console.log("You are not allow to edit this post")
		}	

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


	

}

exports.createPostComment = function (req, res){

	var commentData = {};
	
	 commentData.authorId = req.user._id;
	 commentData.created_at = new Date();
	 commentData.message = req.body.message;

	if(req.user){
	
		Post.createPostComment(commentData, req.body.postId, function (err, numofDocChnaged){

			if(err){ 
				console.log("do error call")
			}			
			
			if(numofDocChnaged == 1){	
				console.log("comment created")
			}else{
				console.log("Didnt create comment")
			}

		});//createPostComment

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else



}

exports.editPostComment = function (req, res){

	if(req.user){
		
		if(req.user._id.toString().localeCompare(req.body.authorId.toString()) == 0){
			Post.editPostComment(req.body.message, req.body.commentId, function (err, numofDocChnaged){

				if(err){ 
					console.log("do error call")
				}

				if(numofDocChnaged == 1){
					console.log("comment editied")
				}else{
					console.log("Didnt edit comment")
				}

			});//editPostComment
		}else{

			console.log("You are not allow to delete this comment")
		}	

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


}

exports.deletePostComment = function (req, res){

	if(req.user){
		
		if(req.user._id.toString().localeCompare(req.body.authorId.toString()) == 0){
			Post.deletePostComment(req.body.commentId, req.body.postId, function (err, numofDocChnaged){

				if(err){ 
					console.log("do error call")
				}

				if(numofDocChnaged == 1){
					console.log("comment deleted")
				}else{
					console.log("Didnt create delete")
				}

			});//deletePostComment
		}else{

			console.log("You are not allow to delete this comment")
		}	

	}//if
	else{
		//route to somewhere
		console.log("user not login (coner case)")
	}//else


}

