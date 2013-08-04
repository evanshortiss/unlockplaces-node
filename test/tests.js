/**
 * tests.js
 * Tests using mocha
 */

var assert = require('assert');
var Unlock = require('../index.js');


describe('Test Unlock API', function() {
  this.timeout(10000);

  beforeEach(function() {
    instance = new Unlock.Class();
  });

  describe('Unlock(defaults)', function() {
    it('Should create an instance with defaults provided', function() {
      instance = new Unlock.Class({
        format: 'xml',
        gazetteer: 'os'
      });
      assert(instance);
      assert(typeof instance === 'object');
      assert(instance instanceof Unlock.Class);
    });
  });


  describe('Unlock.setResponseFormat and Unlock.getResponseFormat', function() {
    it('Should set format to what we specify and also get it as expected', function() {
      assert(instance.getResponseFormat() === 'json');
      instance.setResponseFormat('xml');
      assert(instance.getResponseFormat() === 'xml');
    });
  });


  describe('Unlock.setGazetteer and Unlock.getGazetteer', function() {
    it('Should set gazetteer to what we specify and also get it as expected', function() {
      assert(instance.getGazetteer() === 'unlock');
      instance.setGazetteer('os');
      assert(instance.getGazetteer() === 'os');
    });
  });


  describe('Unlock.setDefaults and Unlock.getDefaults', function() {
    it('Should set return defaults object', function() {
      assert(typeof instance.getDefaults() === 'object');
      assert(instance.getDefaults().format === 'json');
      assert(instance.getDefaults().gazetteer === 'unlock');

      instance.setDefaults({
        gazetteer: 'naturalearth',
        format: 'kml',
        name: 'dublin'
      });
      assert(instance.getDefaults().format === 'kml');
      assert(instance.getDefaults().gazetteer === 'naturalearth');
      assert(instance.getDefaults().name === 'dublin');
    });
  });


  describe('Unlock.buildParams', function() {
    it('Should build params object for provided params.', function() {
      assert(instance.buildParams().format === 'json');
      assert(instance.buildParams().gazetteer === 'unlock');


      assert(instance.buildParams({
        name: 'ireland'
      }).name === 'ireland');
    });
  });


  describe('Unlock.doRequest', function() {
    it('Do a request to provided url with params provided as querystring.', function(done) {
      instance.doRequest('http://unlock.edina.ac.uk/ws/search', {
        name: 'dublin'
      }, function(err, res) {
        try {
          res = JSON.parse(res);
        } catch(e) {
          console.log('Parse failed');
        }
        assert(typeof res === 'object')
        assert(!err);
        assert(res);
        done();
      });
    });
  });


  describe('Unlock.search', function() {
    it('Should return search results as JSON string', function(done) {
      instance.search({
        name: 'waterford'
      }, function(err, res) {
        assert(!err);
        assert(res);
        res = JSON.parse(res);
        assert(res.type === 'FeatureCollection')
        assert(res.features);
        done();
      });
    });
  });


  describe('Unlock.footprintLookup', function() {
    it('Should return search results as JSON string', function(done) {
      instance.footprintLookup({
        id: 9656
      }, function(err, res) {
        assert(!err);
        assert(res);
        res = JSON.parse(res);
        assert(res.type === 'FootprintCollection')
        assert(res.footprints);
        done();
      });
    });
  });


  describe('Unlock.featureLookup', function() {
    it('Should return search results as JSON string', function(done) {
      instance.featureLookup({
        id: 9656
      }, function(err, res) {
        assert(!err);
        assert(res);
        res = JSON.parse(res);
        assert(res.type === 'FeatureCollection')
        assert(res.features);
        done();
      });
    });
  });


  describe('Unlock.closestMatchSearch', function() {
    it('Should return search results as JSON string with just single result', function(done) {
      instance.closestMatchSearch({
        name: 'dublin'
      }, function(err, res) {
        assert(!err);
        assert(res);
        res = JSON.parse(res);
        assert(res.type === 'FeatureCollection')
        assert(res.features.length === 1);
        done();
      });
    });
  });


  describe('Unlock.supportedFeatureTypes', function() {
    it('Should return supported feature types', function(done) {
      instance.supportedFeatureTypes({
        
      }, function(err, res) {
        assert(!err);
        assert(res);
        res = JSON.parse(res);
        assert(res.totalResults >= 1);
        assert(res.featureTypes);
        assert(res.featureTypes.length === parseInt(res.totalResults));
        done();
      });
    });
  });


  describe('Unlock.search', function() {
    it('Should run a search', function(done) {
      Unlock.search({
        name: 'dublin'
      }, function(err, res) {
        assert(!err);
        assert(res);
        done();
      });
    });
  });
});