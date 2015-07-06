
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Summoner = mongoose.model('Summoner')
  , agent = request.agent(app)

describe('Summoner', function () {

    describe('#create()', function () {
     it('should create a new Summoner', function (done) {
       // Create a User object to pass to User.create()
    var summoner = new Summoner({

          name: "1",
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





        })

       Summoner.create(summoner, function (err, createdSummoner) {
         // Confirm that that an error does not exist
         should.not.exist(err);
         // verify that the returned user is what we expect
         createdSummoner.name.should.equal('1');
         createdSummoner.games[0].fellowPlayers[0].teamId.should.equal('3');
         // Call done to tell mocha that we are done with this test
         done();
       });
     });
    });

});