var mongoose = require('mongoose');
var config = require('config');
var utils = require('../../lib/utils');
var Rating = mongoose.model('Rating');

var Schema = mongoose.Schema;

/**
 * Article Schema
 */

var SummonerSchema = new Schema({
  //summoner's info	
  name: {type : String, default : '', trim : true},
  nameNoWhiteSpace: {type : String, default : '', trim : true},
  profileIconId: {type : String, default : '', trim : true},
  revisionDate: {type : String, default : '', trim : true},
  summonerLevel: {type : String, default : '', trim : true},
  id: {type : String, default : '', trim : true},
  region: {type : String, default : '', trim : true},
  isVerified: {type : Boolean, default : false , trim : true},
  ownerID: {type : String, default : '', trim : true},
  //fellowPlayerNames: {type : {}, default: {}},
  //games where it display indivisual stats.
  games: [{
  			fellowPlayers: [{
  				championId: {type : String, default : '', trim : true},
  				teamId: {type : String, default : '', trim : true},
  				summonerId: {type : String, default : '', trim : true},
  				name: {type : String, default : '', trim : true}
  			}],

  			//Game type. (Legal values: CUSTOM_GAME, MATCHED_GAME, TUTORIAL_GAME)
  			gameType: {type : String, default : '', trim : true},
  			//player stats
  			stats: {
  				//champion items with trinkets
  				item0: {type : String, default : '', trim : true},
  				item1: {type : String, default : '', trim : true},
  				item2: {type : String, default : '', trim : true},
  				item3: {type : String, default : '', trim : true},
  				item4: {type : String, default : '', trim : true},
  				item5: {type : String, default : '', trim : true},
  				item6: {type : String, default : '', trim : true},
  				//pentakills etc
  				killingSprees: {type : String, default : '', trim : true},
  				largestKillingSpree: {type : String, default : '', trim : true},
  				largestMultiKill: {type : String, default : '', trim : true},
  				//not sure if we need this, this info not found in Matches
  				playerRole: {type : String, default : '', trim : true},
  				playerPosition: {type : String, default : '', trim : true},
  				//Kill/Death/Assist
  				championsKilled: {type : String, default : '', trim : true},
  				assists: {type : String, default : '', trim : true},
  				numDeaths: {type : String, default : '', trim : true},
  				//player cs and lvl
  				minionsKilled: {type : String, default : '', trim : true},
  				level: {type : String, default : '', trim : true},
  				//player team stats 
  				team: {type : String, default : '', trim : true},
  				win: {type : String, default : '', trim : true},  				
  				timePlayed: {type : String, default : '', trim : true},
  				//warding stats
  				sightWardsBought: {type : String, default : '', trim : true},
  				wardPlaced: {type : String, default : '', trim : true},
  				wardKilled: {type : String, default : '', trim : true}
  			},
  			gameId: {type : String, default : '', trim : true},
  			ipEarned: {type : String, default : '', trim : true},
  			spell1: {type : String, default : '', trim : true},
  			teamId: {type : String, default : '', trim : true},
  			spell2: {type : String, default : '', trim : true},
  			mapId: {type : String, default : '', trim : true},
  			level: {type : String, default : '', trim : true},
  			invalid: {type : String, default : '', trim : true},
  			subType: {type : String, default : '', trim : true},
  			createDate: {type : String, default : '', trim : true},
  			championId: {type : String, default : '', trim : true},


  		}],

  	league:[{

  			queue: {type : String, default : '', trim : true},
  			name: {type : String, default : '', trim : true},
  			entries: [{
  				leaguePoints: {type : String, default : '', trim : true},
  				isFreshBlood: {type : String, default : '', trim : true},
  				isHotStreak: {type : String, default : '', trim : true},
  				division: {type : String, default : '', trim : true},
  				isInactive: {type : String, default : '', trim : true},
  				isVeteran: {type : String, default : '', trim : true},
  				losses: {type : String, default : '', trim : true},
  				playerOrTeamName: {type : String, default : '', trim : true},
  				playerOrTeamId: {type : String, default : '', trim : true},
  				wins: {type : String, default : '', trim : true}
  			}],
  			tier: {type : String, default : '', trim : true}

  	}],

  	//stats of each champion for the season
  	//this modifyDate comes with stats(ranked) from riot API
  	currentSeason: {
		  	modifyDate: {type : String, default : '', trim : true},
		  	champions:[{
		  		//champ id
		  		id: {type : String, default : '', trim : true},
		  		stats:{
		  			totalDeathsPerSession: {type : String, default : '', trim : true},
		  			totalSessionsPlayed: {type : String, default : '', trim : true},
		  			totalDamageTaken: {type : String, default : '', trim : true},
		  			totalQuadraKills: {type : String, default : '', trim : true},
		  			totalTripleKills: {type : String, default : '', trim : true},
		  			totalMinionKills: {type : String, default : '', trim : true},
		  			maxChampionsKilled: {type : String, default : '', trim : true},
		  			totalDoubleKills: {type : String, default : '', trim : true},
		  			totalPhysicalDamageDealt: {type : String, default : '', trim : true},
		  			totalChampionKills: {type : String, default : '', trim : true},
		  			totalAssists: {type : String, default : '', trim : true},
		  			mostChampionKillsPerSession: {type : String, default : '', trim : true},
		  			totalDamageDealt: {type : String, default : '', trim : true},	
		  			totalFirstBlood: {type : String, default : '', trim : true},	
		  			totalSessionsLost: {type : String, default : '', trim : true},
		  			totalSessionsWon: {type : String, default : '', trim : true},
		  			totalMagicDamageDealt: {type : String, default : '', trim : true},
		  			totalGoldEarned: {type : String, default : '', trim : true},
		  			totalPentaKills: {type : String, default : '', trim : true},
		  			totalTurretsKilled: {type : String, default : '', trim : true},
		  			mostSpellsCast: {type : String, default : '', trim : true},
		  			maxNumDeaths: {type : String, default : '', trim : true},
		  			totalUnrealKills: {type : String, default : '', trim : true}		
		  		}

		  	}]
  },


  	pastSeason: {
		  	modifyDate: {type : String, default : '', trim : true},
		  	champions:[{
		  		//champ id
		  		id: {type : String, default : '', trim : true},
		  		stats:{
		  			totalDeathsPerSession: {type : String, default : '', trim : true},
		  			totalSessionsPlayed: {type : String, default : '', trim : true},
		  			totalDamageTaken: {type : String, default : '', trim : true},
		  			totalQuadraKills: {type : String, default : '', trim : true},
		  			totalTripleKills: {type : String, default : '', trim : true},
		  			totalMinionKills: {type : String, default : '', trim : true},
		  			maxChampionsKilled: {type : String, default : '', trim : true},
		  			totalDoubleKills: {type : String, default : '', trim : true},
		  			totalPhysicalDamageDealt: {type : String, default : '', trim : true},
		  			totalChampionKills: {type : String, default : '', trim : true},
		  			totalAssists: {type : String, default : '', trim : true},
		  			mostChampionKillsPerSession: {type : String, default : '', trim : true},
		  			totalDamageDealt: {type : String, default : '', trim : true},	
		  			totalFirstBlood: {type : String, default : '', trim : true},	
		  			totalSessionsLost: {type : String, default : '', trim : true},
		  			totalSessionsWon: {type : String, default : '', trim : true},
		  			totalMagicDamageDealt: {type : String, default : '', trim : true},
		  			totalGoldEarned: {type : String, default : '', trim : true},
		  			totalPentaKills: {type : String, default : '', trim : true},
		  			totalTurretsKilled: {type : String, default : '', trim : true},
		  			mostSpellsCast: {type : String, default : '', trim : true},
		  			maxNumDeaths: {type : String, default : '', trim : true},
		  			totalUnrealKills: {type : String, default : '', trim : true}		
		  		}

		  	}]
  },

  reFreshDate: {type : Date, default : Date.now},
  createdAt  : {type : Date, default : Date.now}

});

var loadData = function(summoner, cb) {

  summoner.getAvgRating(function(err, rating) {
    if(!rating) return cb(err, summoner);
    if(rating[0] != null) {
      summoner.average = rating[0].average;
      summoner.count = rating[0].count;
    }
    cb(err, summoner);
  });
}

//Method is instance

SummonerSchema.methods = {

  getAvgRating: function(callback) {
      Rating.aggregate([
          { $match: { summoner: this._id } },
          { $group: { _id: '$summoner', average: { $avg: '$value' }, count: { $sum: 1 } } }
      ], function(err, result) {
          callback(err, result);
      })
  }

}


//Static is class

SummonerSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  search: function (summonerName, reg, cb) {

    this.findOne({ $and: [
        {nameNoWhiteSpace : summonerName},  
        {region : reg}
        ]}, function(err, summoner) {
      if (!summoner || err) return cb(err, null);
      loadData(summoner, cb);
    })   
  },

  load: function (id, reg, cb) {

    this.findOne({  
      $and: [
        {id : id },  
        {region : reg}
        ]}, function(err, summoner) {
      if (!summoner || err) return cb(err, null);
      loadData(summoner, cb);
    })
  },

  hasUser: function(userId, cb){

    this.findOne({ownerID: userId})
    .exec(cb);
  },
  
  searchSummByID: function (summonerID, reg, cb) {

      this.findOne({
         $and: [
        {id : summonerID },  
        {region : reg}
        ]
      })
      .exec(cb);   
  },

  searchSummByIDFind: function (summonerID, reg, cb) {

      this.find({
         $and: [
        {id : summonerID },  
        {region : reg}
        ]
      })
      .exec(cb);   
  },

  nameChange: function (summonerData, cb) {

    this.findOneAndUpdate(
      { $and: [
        {id : summonerData.id },  
        {region : summonerData.region}
        ]}, //query
      { $set: { name: summonerData.name, nameNoWhiteSpace: summonerData.nameNoWhiteSpace }},
      {upsert: false}
    ).exec(cb); 

  },
/*
 AsknameChange: function (summonerData, cb) {
    var randomName = "pleaseRefresh" + Math.floor((Math.random() * 100) + 1)
    this.findOneAndUpdate(
      { $and: [
        {id : summonerData.name },  
        {region : summonerData.region}
        ]}, //query
      { $set: { name: randomName, nameNoWhiteSpace: randomName }},
      {upsert: false}
    ).exec(cb); 

  },  
  
*/

 refresh: function (summonerID,summonerData,summonerDataUpdate, cb) {

    var emptyObj = {};
    if (!summonerDataUpdate.games[0] ) {
      console.log("if")
      //console.log(summonerDataUpdate.games.length)
      
      this.update({$and: [
        {id : summonerID },  
        {region : summonerData.region}
        ]},
                { 
                  $set: { name: summonerData.name, nameNoWhiteSpace: summonerData.nameNoWhiteSpace,
                 profileIconId: summonerData.profileIconId , revisionDate: summonerData.revisionDate, summonerLevel: summonerData.summonerLevel,
                 league: summonerData.league, 'currentSeason.modifyDate': summonerData.currentSeason.modifyDate, 'currentSeason.champions': summonerData.currentSeason.champions
                  } 
                },
                {safe: true, upsert: false})

      .exec(cb);      
    }
    else {
      console.log("else")
      this.update({$and: [
        {id : summonerID },  
        {region : summonerData.region}
        ] },
                { 
                  $pushAll: { 'games': summonerDataUpdate.games },  $set: { name: summonerData.name, nameNoWhiteSpace: summonerData.nameNoWhiteSpace,
                 profileIconId: summonerData.profileIconId , revisionDate: summonerData.revisionDate, summonerLevel: summonerData.summonerLevel,
                 league: summonerData.league, 'currentSeason.modifyDate': summonerData.currentSeason.modifyDate, 'currentSeason.champions': summonerData.currentSeason.champions
                }},

                {safe: true, upsert: false})
      
      .exec(cb);


    }
  }

  


  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  // list: function (options, cb) {
  //   var criteria = options.criteria || {}

  //   this.find(criteria)
  //     .populate('user', 'name username')
  //     .sort({'createdAt': -1}) // sort by date
  //     .limit(options.perPage)
  //     .skip(options.perPage * options.page)
  //     .exec(cb);
  // }
/*
    createSummoner: function(summonerName, cb){
      console.log("I am in here");

      .exec(cb);


  }
*/
}

mongoose.model('Summoner', SummonerSchema);