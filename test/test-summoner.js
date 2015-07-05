
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
       var s = {
         name: 'steve'
       };
       Summoner.create(s, function (err, createdSummoner) {
         // Confirm that that an error does not exist
         should.not.exist(err);
         // verify that the returned user is what we expect
         createdSummoner.name.should.equal('steve');
         // Call done to tell mocha that we are done with this test
         done();
       });
     });
    });

});