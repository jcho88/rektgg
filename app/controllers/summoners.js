/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var request = require('request')
var async = require('async')

// exports.search = function (req, res){
//   console.log("search");
//   res.render('summoners/show');
// };

exports.search = function (req, res){
console.log("test search");
console.log(req.query.summonerName)




  Summoner.search(req.query.summonerName, function (err, summoner) {
    //console.log(summoner);
    var summonerBasicInfo;
    var summonerRiotID;
    var leagueSummoner;
    var statsRankChamp;
    var statsRankChampPast;
    var summonerGames;
    var summonerName = req.query.summonerName;
    summonerName = summonerName.toLowerCase()

   // console.log("err" + err);
    if (err) return next(err);
/*
  If summoner not in Database, we call the API here
*/
    if (!summoner){ 
      console.log("Api call");
      async.series([
            //Load user to get userId first
            //Load posts (won't be called before task 1's "task callback" has been called)
            function(callback) {
              request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+summonerName+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                //do error massage later

                summonerBasicInfo = JSON.parse(body);
                summonerBasicInfo = summonerBasicInfo[summonerName];
                //console.log(summonerBasicInfo);
                summonerRiotID = summonerBasicInfo.id;
                callback();
              }); 
            }
        ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
            if (err) return next(err);
                async.parallel([
                            //Load user
                    function(callback) {

                        request("https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/"+summonerRiotID+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                        //do error massage later

                        leagueSummoner = JSON.parse(body);
                        leagueSummoner = leagueSummoner[summonerRiotID];
                        //console.log(leagueSummoner);
                        callback();
                      }); 
                    },
                    //Stats of champ, present, API call
                    function(callback) {
                        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerRiotID+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                        /*TODO: error massage later*/

                        statsRankChamp = JSON.parse(body);
                        //console.log(statsRankChamp);
                        statsRankChamp.champions.sort(function(a,b){
                          return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                        });

                        callback();
                      }); 
                    },
                    //Stats of champ, past, API call
                    function(callback) {
                        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerRiotID+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                        //do error massage later

                        statsRankChampPast = JSON.parse(body);
                        statsRankChampPast.champions.sort(function(a,b){
                          return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                        });

                        //console.log(statsRankChampPast);
                        callback();
                      }); 
                    },
                    //Games API call
                    function(callback) {
                        request("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+summonerRiotID+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                        //do error massage later

                        summonerGames = JSON.parse(body);
                        //console.log(summonerGames);
                        callback();
                      }); 
                    }
                ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
                    if (err) return next(err); //If an error occured, we let express/connect handle it by calling the "next" function
                    //Here locals will be populated with 'user' and 'posts'
                      var newSummoner = new Summoner({

                        name: summonerBasicInfo.name,
                        id: summonerBasicInfo.id,
                        profileIconId: summonerBasicInfo.profileIconId,
                        revisionDate: summonerBasicInfo.revisionDate,
                        summonerLevel: summonerBasicInfo.summonerLevel, 
                        region: "North America",
                        games: summonerGames.games,
                        league: leagueSummoner,
                        currentSeason: statsRankChamp,
                        pastSeason: statsRankChampPast

                      });


                      newSummoner.save(function(err, userinfo) {
                        if(!err) {
                            console.log("shoot me");
                            //console.log(userinfo);
                            res.render('summoners/show', {
                                summoner: userinfo
                            });              
                        }
                        else {
                            console.log("shoot them");
                            res.render('/', {
                                summoner: userinfo
                            });  
                        }
                       

                      });


                    console.log("done");




                });//parelle
        });//series        

      
    }else{
      console.log("Found");
      //console.log(summoner);
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
//console.log("test load");
  Summoner.load(id, function (err, summoner) {
    console.log("err" + err);
    if (err) return next(err);
    if (!summoner) return next(new Error('not found'));
    req.summoner = summoner;
    next();
  });
};

exports.show = function (req, res){

	console.log("test show");

  res.render('summoners/show', {
    summoner: req.summoner
  });
};

