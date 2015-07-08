/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
console.log("test load");
console.log(req.query.summonerId)




  Summoner.load(req.query.summonerId, function (err, summoner) {
    //console.log(summoner);
    console.log("err" + err);
    if (err) return next(err);

    if (!summoner){ 
      console.log("Api call");

       var blah = new Summoner({

          name: req.query.summonerId,
          id: "1",
          profileIconId: "1",
          revisionDate: "1",
          summonerLevel: "1",

          games: [{
            fellowPlayers: [{
                championId: "2",
                teamId: "3",
                summonerId: "4"
              }]
          }]





        });

      
        blah.save(function(err, userinfo) {
          if(!err) {
              console.log("shoot me");
          }
          else {
              console.log("shoot them");
          }
          
        });





      return next(new Error('not found'));
    }else{
      console.log(summoner);
      req.summoner = summoner;
    }
    next();
  });

};


exports.show = function (req, res){
	console.log("test show");
  res.render('summoners/show', {
    summoner: req.summoner
  });
};
