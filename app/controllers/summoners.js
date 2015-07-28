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
    name = name.toString("utf8");
    name = name.replace(/\s/g, '');
    var summonerData = new Summoner()
    var fellowPlayers = {}
    
    function getSummoner (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+encodeURIComponent(name)+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.nameNoWhiteSpace = Object.keys(results)[0];
            summonerData.name = results[summonerData.nameNoWhiteSpace].name;
            summonerData.id = results[summonerData.nameNoWhiteSpace].id;
            summonerData.region = 'North America'
            summonerData.profileIconId = results[summonerData.nameNoWhiteSpace].profileIconId;
            summonerData.revisionDate = results[summonerData.nameNoWhiteSpace].revisionDate;
            summonerData.summonerLevel = results[summonerData.nameNoWhiteSpace].summonerLevel;
            callback();
        }); 
    }

    function getLeague (callback) {
        request("https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.league = results[summonerData.id];
            callback();
        });
    }

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
    
    function getGames (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            results = JSON.parse(body);
            summonerData.games = results.games
            callback();
        });
    }
    
    function getNames (callback) {
        var ids = []
        var count = 0
        var n = 40
        
        // Collect summoner ids and sort into groups of n
        _.each(summonerData.games, function(game) {
            _.each(game.fellowPlayers, function(player) {
                if (count % n == 0) {
                    ids.push([]);
                }
                ids[Math.floor(count++/n)].push(player.summonerId);
            })
        })
        
        // Fetch summoner names, n at a time
        async.each(ids,
            function(idGroup, callback) {
                request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/"+idGroup+"/name?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                    results = JSON.parse(body);
                    _.extend(fellowPlayers, results);
                    callback();
                });
            },
            callback
        );
    }

    function getGamesWrapper (callback) {
        async.series([
            getGames,
            getNames
        ],
        function(err) {
            if (err) return next(err);
            callback();
        });
    }

    Summoner.search(name, function (err, summoner) {
        if (err) return next(err);

        if (summoner) {
            summonerData = summoner;
            async.series([
                getNames
            ],
            function(err) {
                if (err) return next(err);
                
                res.render('summoners/show', {
                    summoner: summoner,
                    fellowPlayers: fellowPlayers
                });
            })
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
                    getGamesWrapper
                ],
                function(err) {
                    if (err) return next(err);
                    summonerData.save(function(err, summoner) {
                      if(!err) {
                          res.render('summoners/show', {
                              summoner: summoner,
                              fellowPlayers: fellowPlayers
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
  Summoner.load(id, function (err, summoner) {
    if (err) return next(err);
    if (!summoner) return next(new Error('not found'));
    req.summoner = summoner;
    next();
  });
};

exports.show = function (req, res){
  res.render('summoners/show', {
    summoner: req.summoner
  });
};

