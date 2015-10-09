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

    var statusCode = {};
    
    function getSummoner (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/"+encodeURIComponent(name)+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            console.log(response.statusCode)

            if(response.statusCode == 404){

                console.log("no such user")
                statusCode.noSummoner = true;
                callback();

            }else if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503){

                statusCode.summonerError = true;

            }else{
                results = JSON.parse(body);
                summonerData.nameNoWhiteSpace = Object.keys(results)[0];
                summonerData.name = results[summonerData.nameNoWhiteSpace].name;
                summonerData.id = results[summonerData.nameNoWhiteSpace].id;
                summonerData.region = 'North America'
                summonerData.profileIconId = results[summonerData.nameNoWhiteSpace].profileIconId;
                summonerData.revisionDate = results[summonerData.nameNoWhiteSpace].revisionDate;
                summonerData.summonerLevel = results[summonerData.nameNoWhiteSpace].summonerLevel;
                callback();
            }
        }); 
    }

    function getLeague (callback) {

       
            request("https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                 if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                    statusCode.getLeagueErr = true;
                    callback();
                }else{
                    results = JSON.parse(body);
                    summonerData.league = results[summonerData.id];
                    callback();
                }
            });
        
    }

    function getCurrentSeason(callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {

            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getCurrentSeasonErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                results.champions.sort(function(a,b){
                  return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                });
                summonerData.currentSeason = results;
                callback();
            }
      }); 
    }
    
    function getPastSeason (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getPastSeasonErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                results.champions.sort(function(a,b){
                  return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                });
                summonerData.pastSeason = results;
                callback();
            }
      }); 
    }
    
    function getGames (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getGamesErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                summonerData.games = results.games
                callback();
            }
        });
    }
    
    function getFellowPlayerNames (callback) {
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
                  if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                                statusCode.getFellowPlayerNamesErr = true;
                                callback();
                            }else{                    
                                results = JSON.parse(body);
                                
                                // TODO: Don't store fellow player names inside the Summoner model
                                _.extend(summonerData.fellowPlayerNames, results);
                                callback();
                            }
                });
            },
            function(err) {
                if (err) return next(err);
                callback();
            }
        );
    }

    function getGamesWrapper (callback) {
        async.series([
            getGames,
            getFellowPlayerNames
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
                if(statusCode.noSummoner == true || statusCode.summonerError == true){
                    res.redirect('/')
                }else{
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
                                  summoner: summoner
                              });              
                          }
                          else {
                              // Redirect with error
                          }
                        });   
                    })
                }//else
            });
        }
    });
}


/**
 * Load
 */

exports.load = function (req, res, next, id){
  Summoner.load(id, function (err, summoner) {
    // if (err) return next(err);
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
/*REFRESH
*
*
*
*
*
*
*/
exports.refresh = function (req, res){
    console.log("in refresh")
    var summonerID = req.body.summonerId;

    var summonerData = new Summoner();
    var summonerDataUpdate = {};
    var summonerCurrentData = {};
    var statusCode = {};
    var test = {};


        function getSummoner (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.4/summoner/"+summonerID+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            console.log(response.statusCode)

            if(response.statusCode == 404){

                console.log("no such user")
                statusCode.noSummoner = true;
                callback();

            }else if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503){

                statusCode.summonerError = true;

            }else{
                results = JSON.parse(body);
                summonerData.nameNoWhiteSpace = Object.keys(results)[0];
                summonerData.name = results[summonerData.nameNoWhiteSpace].name;
                summonerData.id = results[summonerData.nameNoWhiteSpace].id;
                summonerData.region = 'North America'
                summonerData.profileIconId = results[summonerData.nameNoWhiteSpace].profileIconId;
                summonerData.revisionDate = results[summonerData.nameNoWhiteSpace].revisionDate;
                summonerData.summonerLevel = results[summonerData.nameNoWhiteSpace].summonerLevel;
                callback();
            }
        }); 
    }

    function getLeague (callback) {

       
            request("https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                 if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                    statusCode.getLeagueErr = true;
                    callback();
                }else{
                    results = JSON.parse(body);
                    summonerData.league = results[summonerData.id];
                    callback();
                }
            });
        
    }

    function getCurrentSeason(callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {

            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getCurrentSeasonErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                results.champions.sort(function(a,b){
                  return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                });
                summonerData.currentSeason = results;
                callback();
            }
      }); 
    }
    
    function getPastSeason (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getPastSeasonErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                results.champions.sort(function(a,b){
                  return parseFloat(b.stats.totalSessionsPlayed) - parseFloat(a.stats.totalSessionsPlayed);
                });
                summonerData.pastSeason = results;
                callback();
            }
      }); 
    }
    
    function getGames (callback) {
        request("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                statusCode.getGamesErr = true;
                callback();
            }else{
                results = JSON.parse(body);
                summonerData.games = results.games
                callback();
            }
        });
    }
    
    function getFellowPlayerNames (callback) {
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
                  if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                                statusCode.getFellowPlayerNamesErr = true;
                                callback();
                            }else{                    
                                results = JSON.parse(body);
                                
                                // TODO: Don't store fellow player names inside the Summoner model
                                _.extend(summonerData.fellowPlayerNames, results);
                                callback();
                            }
                });
            },
            function(err) {
                if (err) return next(err);
                callback();
            }
        );
    }

    function getGamesWrapper (callback) {
        async.series([
            getGames,
            getFellowPlayerNames
        ],
        function(err) {
            if (err) return next(err);
            callback();
        });
    }


    var index = -1;
    //get document of the summoner to upsert/update the data.
    Summoner.searchSummByID(summonerID,  function (err, summoner) {

        if(err){
            res.redirect('/')
        }else{

            summonerCurrentData = summoner

             async.series([
                getSummoner
            ],
            function(err) {
                // We can call these in any order
                if(statusCode.noSummoner == true || statusCode.summonerError == true){ //error searching summoners
                    res.redirect('/')
                }else{
                    async.parallel([
                        getLeague,
                        getCurrentSeason,
                        getPastSeason,                                    

                        getGamesWrapper
                    ],
                    function(err) {
                        if (err) return next(err);

                        if(statusCode.getGamesErr != true){
                            //console.log(summonerData.games[0])
                            console.log(summonerCurrentData.games[0].createDate)

                            summonerCurrentData.games.sort(function(a, b) {
                                return parseFloat(b.createDate) - parseFloat(a.createDate);
                                });

                            console.log(summonerCurrentData.games[0].createDate)

                            if(summonerCurrentData.games[0].createDate == summonerData.games[0].createDate){
                                //same data, no need to update
                            }else{ 
                                // has new data to update.
                                for(i=0; i < summonerData.games.length; i++){
                                    if(summonerData.games[i].createDate == summonerCurrentData.games[i].createDate){
                                        index = i;
                                        break;
                                    }

                                }
                                //test = summonerData.games.slice(0,4)
                                //console.log(test)
                                if(index == -1){

                                    summonerDataUpdate.games = summonerData.games;
                                    console.log(summonerDataUpdate)
                                    console.log("at index = -1")
                                }else{
                                    summonerDataUpdate.games = summonerData.games.slice(0,index)
                                }

                                Summoner.refresh(summonerData,summonerDataUpdate, function (err, numOfDocRemoved){



                                });
                            }//else


                            // console.log(summonerData.games.length)
                            // var d2 = new Date();
                            // console.log("d2 time " + d2.getTime())
                            // var d = d2-1443835593473;
                            // d = d / (60 * 1000); //get time to mins
                            // console.log(summonerCurrentData.createdAt)
                            // console.log(d)
                            // console.log(d2)
                        }
                        

                    })//async parallel
                }//else
            });       


     }//else

    });//searchSummByID





    
}
