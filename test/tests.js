/**
 * tests.js
 * Tests using mocha
 */

var assert = require('assert');
var Unlock = require('../index.js');

describe('Test Unlock API', function() {
  beforeEach(function() {
    instance = new Unlock();
  });

  describe('Unlock(defaults)', function() {
    it('Should create an instance with defaults provided', function() {
      instance = new Unlock({
        format: 'xml',
        gazetteer: 'os'
      });
      assert(instance);
      assert(typeof instance === 'object');
      assert(instance instanceof Unlock);
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
    it('Should set format to what we specify and also get it as expected', function() {
      assert(instance.getGazetteer() === 'unlock');
      instance.setGazetteer('os');
      assert(instance.getGazetteer() === 'os');
    });
  });


  describe('Unlock.setDefaults and Unlock.getDefaults', function() {
    it('Should set format to what we specify and also get it as expected', function() {
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
});