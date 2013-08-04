/**
 * unlock.js
 * The main unlock API class.
 */


var qs = require('querystring');
var URLS = require('./urls.js');
var request = require('request');

module.exports = Unlock;

/**
 * Constructor for the places interface.
 * @param {Object} defaults   Default params to use on each request.
 */

function Unlock(defaults) {
  this.setDefaults(defaults);
}

Unlock.prototype = {

  /**
   * Set the data format we want returned, JSON is default.
   * Supported types: 'kml', 'json', 'xml', 'txt'
   * @param {String}   mode
   */
  setResponseFormat: function(format) {
    this.defaults.format = format.toLowerCase();
  },


  /**
   * Returns the format used by this instance.
   * @return {String}
   */
  getResponseFormat: function() {
    return this.defaults.format;
  },


  /**
   * Set the default gazatteer to use.
   * @params {String} gz
   */
  setGazetteer: function(gz) {
    this.defaults.gazetteer = gz;
  },


  /**
   * Get the default gazatteer being used
   * @return {String}
   */
  getGazetteer: function() {
    return this.defaults.gazetteer;
  },


  /**
   * Set defaults to use.
   * @param {Object} defaults
   */
  setDefaults: function(defaults) {
    this.defaults = defaults || {
      format: 'json',
      gazetteer: 'unlock'
    };

    // Always use JSON as default data format
    if (!this.defaults.format) {
      this.defaults.format = 'json';
    }

    // Always use 'unlock' as default gazetteer
    if (!this.defaults.gazetteer) {
      this.defaults.gazetteer = 'gazetteer';
    }
  },


  /**
   * Get the defaults being used.
   * @return {Object}
   */
  getDefaults: function() {
    return this.defaults;
  },


  /**
   * Builds the querystring with given params object
   * @param {Object}    params
   * @param {Function}  callback
   */
  buildParams: function(params) {
    params = params || {};

    // Add in the defaults provided
    for (var key in this.defaults) {
      if (!params[key] && this.defaults[key] !== null) {
        params[key] = this.defaults[key];
      }
    }

    return params;
  },


  /**
   * Send an API request to the provided url with params.
   * @params {String}   url
   * @params {Object}   params
   * @params {Function} callback
   */
  doRequest: function(url, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    request({
      url: url,
      qs: this.buildParams(params),
    }, function(err, res, body) {
      if (err) {
        return callback(err, null);
      } else if (res.statusCode !== 200) {
        return callback({
          err: 'Request error, status code: ' + res.statusCode
        }, null);
      } else {
        return callback(null, body);
      }
    });
  },


  /**
   * Search for places by provided params.
   * @param {Object}    params
   * @param {Function}  callback
   */
  search: function(params, callback) {
    this.doRequest(URLS.SEARCH_URL, params, callback);
  },


  /**
   * Get footprint for a provided area
   * @param {Object}    params
   * @param {Function}  callback
   */
  footprintLookup: function(params, callback) {
    if (!params.id) {
      return callback({
        msg: 'footprintLookup requires an "identifier" in parameters.'
      }, null);
    }

    this.doRequest(URLS.FOOTPRINT_LOOKUP, params, callback);
  },


  /**
   * Search for a feature by ID
   * @param {Object}    params
   * @param {Function}  callback
   */
  featureLookup: function(params, callback) {
    if (!params.id) {
      return callback({
        msg: 'featureLookup requires an "identifier" in parameters.'
      }, null);
    }

    this.doRequest(URLS.FEATURE_LOOKUP, params, callback);
  },


  /**
   * Search for closest match for params, returns just one result.
   * @param {Object}    params
   * @param {Function}  callback
   */
  closestMatchSearch: function(params, callback) {
    this.doRequest(URLS.CLOSEST_MATCH, params, callback);
  },


  /**
   * Returns a list of all supported feature types from the API
   * @params {Function} callback
   */
  supportedFeatureTypes: function(params, callback) {
    this.doRequest(URLS.FEATURE_TYPES, params, callback);
  },
};