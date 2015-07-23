/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Summoner = mongoose.model('Summoner')
var utils = require('../../lib/utils')
var extend = require('util')._extend
var request = require('request')
var async = require('async')

var _ = require('underscore')

exports.search = function (req, res){
    var name = req.query.summonerName.toLowerCase();
    var summonerData = {}
    
    // Get summoner
    function getSummoner (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+name+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.name = results[name].name;
            summonerData.id = results[name].id;
            summonerData.region = 'North America'
            summonerData.profileIconId = results[name].profileIconId;
            summonerData.revisionDate = results[name].revisionDate;
            summonerData.summonerLevel = results[name].summonerLevel;
            callback();
        }); 
    }

    // Get league stats
    function getLeague (callback) {
        request("https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.league = results[summonerData.id];
            callback();
        });
    }

    // Get current season stats
    function getCurrentSeason(callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            results.champions.sort(function(a,b){
              return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
            });
            summonerData.currentSeason = results;
            callback();
      }); 
    }
    
    // Get past season stats
    function getPastSeason (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            results.champions.sort(function(a,b){
              return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
            });
            summonerData.pastSeason = results;
            callback();
      }); 
    }

    // Get games
    function getGames (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.games = results.games
            callback();
        });
    }
    
    Summoner.search(name, function (err, summoner) {
        if (err) return next(err);

        if (summoner) { 
            res.render('summoners/show', {
                summoner: summoner
            });
        }
        else {
            // We need to call the Summoner API first since the other calls depend on this
            async.series([
                getSummoner
            ],
            function(err) {
                // We can call these in any order
                async.parallel([
                    getLeague,
                    getCurrentSeason,
                    getPastSeason,
                    getGames
                ],
                function(err) {
                    newSummoner = new Summoner(summonerData)
                    newSummoner.save(function(err, summoner) {
                      if(!err) {
                          res.render('summoners/show', {
                              summoner: summoner
                          });              
                      }
                      else {
                          // Redirect with error
                      }
                    });   
                })
            });
        }
    });
}


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

