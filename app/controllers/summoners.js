/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend

// exports.search = function (req, res){
//   console.log("search");
//   res.render('summoners/show');
// };

exports.search = function (req, res){
console.log("test search");
console.log(req.query.summonerName)




  Summoner.search(req.query.summonerName, function (err, summoner) {
    //console.log(summoner);
    console.log("err" + err);
    if (err) return next(err);

    if (!summoner){ 
      console.log("Api call");

       var blah = new Summoner({

          name: req.query.summonerName,
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
              console.log(userinfo);
              res.render('summoners/show', {
                  summoner: userinfo
              });              
          }
          else {
              console.log("shoot them");
          }
          
        });


      
    }else{
      console.log("Found");
      console.log(summoner);
     res.render('summoners/show', {
      summoner: summoner
    });
    }



  });

};

/**
 * Load
 */

exports.load = function (req, res, next, id){
console.log("test load");
  Summoner.load(id, function (err, summoner) {
    console.log("err" + err);
    if (err) return next(err);
    if (!summoner) return next(new Error('not found'));
    req.summoner = summoner;
    next();
  });
};

exports.show = function (req, res){
	console.log(req.summoner);
  res.render('summoners/show', {
    summoner: req.summoner
  });
};

