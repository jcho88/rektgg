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
    console.log("in search")
    console.log(req.body)
    var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;   //if param('page') > 0, then param('page') or 1
    var perPage = 10; 
    var name = req.body.summonerName.toLowerCase();
    var region = req.body.region.toLowerCase();
    name = name.toString("utf8");
    name = name.replace(/\s/g, '');
    var summonerData = new Summoner()
    var fellowPlayersNames = {};

    var statusCode = {};
    
    function getSummoner (callback) {
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.4/summoner/by-name/"+encodeURIComponent(name)+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            //console.log(response.statusCode)

            if(response.statusCode == 404){

                console.log("no such user")
                statusCode.noSummoner = true;
                callback();

            }else if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 403){

                statusCode.summonerError = true;

            }else{
                results = JSON.parse(body);
                console.log(response.statusCode)
                console.log(body)
                console.log("Object.keys(results)[0] " + Object.keys(results)[0])
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

       
            request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                 if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                    statusCode.getLeagueErr = true;
                    callback();
                }else{
                    results = JSON.parse(body);
                    summonerData.league = results[summonerData.id];
                   // console.log("in getLeague" + summonerData.league[0])
                    callback();
                }
            });
        
    }

    function getCurrentSeason(callback) {
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {

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
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
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
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
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
                request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.4/summoner/"+idGroup+"/name?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                  if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                                statusCode.getFellowPlayerNamesErr = true;
                                callback();
                            }else{                    
                                results = JSON.parse(body);
                                
                                // TODO: Don't store fellow player names inside the Summoner model
                                _.extend(fellowPlayersNames, results);
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
    console.log("name in search" + name)
    Summoner.search(name, function (err, summoner) {
        //console.log("summoner " + summoner)
        if (err) return next(err);

        if (summoner) {
            
            summoner.games.sort(function(a, b) {
                return parseFloat(b.createDate) - parseFloat(a.createDate);
                });


            summonerData = summoner;
            summoner.games.sort(function(a, b) {
                return parseFloat(b.createDate) - parseFloat(a.createDate);
                });  

            res.redirect('/summoners/'+summoner.region+'/'+summoner.id);  

            // res.render('summoners/show', {
            //     page: page + 1,
            //     pages: Math.ceil(summoner.games.length / perPage),
            //     summoner: summoner
            // });
        }
        else {
            console.log("api call in search")
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

                    /*set games.fellowPlayers.name */    
                    _.each(summonerData.games, function(game) {
                        _.each(game.fellowPlayers, function(player) {
                            player.name = fellowPlayersNames[player.summonerId]
                        })
                    })                        
                        summonerData.save(function(err, summoner) {
                          if(!err) {
                            summoner.games.sort(function(a, b) {
                                return parseFloat(b.createDate) - parseFloat(a.createDate);
                                });            

                              res.redirect('/summoners/'+summoner.region+'/'+summoner.id);              
                          }
                          else {
                            res.redirect('/')
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
    console.log("in load " + req.params.reg)
    Summoner.load(id, req.params.reg, function (err, summoner) {
    // if (err) return next(err);
    if (!summoner) return next(new Error('not found'));
    req.summoner = summoner;
    next();
  });
};

exports.show = function (req, res){

  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;   //if param('page') > 0, then param('page') or 1
  var perPage = 10; 
  req.summoner.games.sort(function(a, b) {
      return parseFloat(b.createDate) - parseFloat(a.createDate);
      });            

  res.render('summoners/show', {
    page: page + 1,
    pages: Math.ceil(req.summoner.games.length / perPage),
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
    var region = req.body.summonerReg;
    var summonerData = new Summoner();
    var fellowPlayersNames = {};
    var summonerDataUpdate = {};
    var summonerCurrentData = {};
    var statusCode = {};
    var test = {};


        function getSummoner (callback) {
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.4/summoner/"+summonerID+"?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
            //console.log(response.statusCode)

            if(response.statusCode == 404){

                console.log("no such user")
                statusCode.noSummoner = true;
                callback();

            }else if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 403){

                statusCode.summonerError = true;
                 callback();

            }else{
                results = JSON.parse(body);
                summonerData.nameNoWhiteSpace = Object.keys(results)[0];
                //console.log("Object.keys(results)[0] " + Object.keys(results)[0])
                summonerData.name = results[summonerData.nameNoWhiteSpace].name;
                summonerData.id = results[summonerData.nameNoWhiteSpace].id;
                summonerData.region = 'North America'
                summonerData.profileIconId = results[summonerData.nameNoWhiteSpace].profileIconId;
                summonerData.revisionDate = results[summonerData.nameNoWhiteSpace].revisionDate;
                summonerData.summonerLevel = results[summonerData.nameNoWhiteSpace].summonerLevel;
                summonerData.nameNoWhiteSpace = results[summonerData.nameNoWhiteSpace].name.toLowerCase();
                summonerData.nameNoWhiteSpace = summonerData.nameNoWhiteSpace.replace(/\s/g, '');

                callback();
            }
        }); 
    }

    function getLeague (callback) {

       
            request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v2.5/league/by-summoner/"+summonerData.id+"/entry?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                 if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                    statusCode.getLeagueErr = true;
                    callback();
                }else{
                    results = JSON.parse(body);
                    summonerData.league = results[summonerData.id];
                    console.log("in getLeague" + summonerData.league[0])
                    callback();
                }
            });
        
    }

    function getCurrentSeason(callback) {
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2015&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {

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
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/stats/by-summoner/"+summonerData.id+"/ranked?season=SEASON2014&api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
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
        request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.3/game/by-summoner/"+summonerData.id+"/recent?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
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
                request("https://"+ region +".api.pvp.net/api/lol/"+ region +"/v1.4/summoner/"+idGroup+"/name?api_key=cdb86ca1-a94c-47fe-bed8-359de39eb421", function(error, response, body) {
                  if(response.statusCode == 401 || response.statusCode == 400 || response.statusCode == 429
                                    || response.statusCode == 500 || response.statusCode == 503 || response.statusCode == 404){
                                statusCode.getFellowPlayerNamesErr = true;
                                callback();
                            }else{                    
                                results = JSON.parse(body);
                                
                                // TODO: Don't store fellow player names inside the Summoner model
                                _.extend(fellowPlayersNames, results);
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

    // -1 indicate that the summoner has no match history in our database
    var index = -1;
    console.log("in refresh pat 2")
    //get document of the summoner to upsert/update the data.
    Summoner.searchSummByID(summonerID,  function (err, summoner) {
        //console.log("summonerData.nameNoWhiteSpace " + summonerData.nameNoWhiteSpace ) 
        if(err){
            res.redirect('/')
        }else{

            summonerCurrentData = summoner

             async.series([
                getSummoner
            ],
            function(err) {
                // We can call these in any order
                if(statusCode.noSummoner == true || statusCode.summonerError == true || statusCode.getFellowPlayerNamesErr == true || statusCode.getGamesErr == true || statusCode.getCurrentSeasonErr == true
                    ||  statusCode.getLeagueErr == true){ //error searching summoners
                    console.log("error")
                    req.flash('Riot API Error')
                    res.redirect('/')
                }else{
                    console.log("no error")
                    async.parallel([
                        getLeague,
                        getCurrentSeason,                                 
                        getGamesWrapper
                    ],
                    function(err) {
                        if (err) return next(err);
                        //console.log(summonerData.fellowPlayerNames)
                    /*set games.fellowPlayers.name */    
                        _.each(summonerData.games, function(game) {
                            _.each(game.fellowPlayers, function(player) {
                                player.name = fellowPlayersNames[player.summonerId]
                            })
                        }) 

                        if(statusCode.getGamesErr != true){
                            //console.log(summonerData.games[0])
                            //console.log(summonerCurrentData.games[0].createDate)

                            summonerCurrentData.games.sort(function(a, b) {
                                return parseFloat(b.createDate) - parseFloat(a.createDate);
                                });

                            //console.log(summonerCurrentData.games[0].createDate)
                            if(summonerCurrentData.games[0]){ //make sure there is data in the database if not take the data from api
                                if(summonerCurrentData.games[0].createDate == summonerData.games[0].createDate){
                                    summonerDataUpdate.games = {}
                                }else{ 
                                    // has new data to update.
                                    var tempCurrentData = 0;
                                    if(summonerCurrentData.games.length < 10){
                                        tempCurrentData = summonerCurrentData.games.length
                                    }else{
                                        tempCurrentData = 10;
                                    }

                                    for(i=0; i < tempCurrentData; i++){
                                        for(j =0; j<summonerData.games.length; j++){
                                            if(summonerData.games[j].createDate == summonerCurrentData.games[i].createDate){
                                                index = j;
                                                break;
                                            }
                                        }
                                      if(index != -1){
                                            break;
                                        }                                    
                                    }
                                    //test = summonerData.games.slice(0,4)
                                    //console.log(test)
                                    if(index == -1){ //if the last 10 games were not in database.
                                        summonerDataUpdate.games = summonerData.games;
                                        //console.log(summonerDataUpdate)
                                        //console.log("at index = -1")
                                    }else{
                                        console.log("index in != -1 " + index)
                                        summonerDataUpdate.games = summonerData.games.slice(0,index)
                                        //console.log("at index != -1")
                                    }

                                }//else
                           }else{
                                summonerDataUpdate.games = summonerData.games;
                           }



                            Summoner.refresh(summonerID, summonerData ,summonerDataUpdate, function (err, numOfDocRemoved){

                                if(err){
                                    req.flash('Error refreshing')
                                    return res.redirect('back')
                                }

                                
                                return res.redirect('back')


                            });


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
