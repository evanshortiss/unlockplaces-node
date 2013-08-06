// Copyright (c) 2013 Evan Shortiss
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

module.exports = Unlock;

var request = require('request');

// URLS for the API
var BASE_URL = "http://unlock.edina.ac.uk/ws";
var URLS = {
  SEARCH_URL: BASE_URL + "/search",
  CLOSEST_MATCH: BASE_URL + "/closestMatchSearch",
  FEATURE_LOOKUP: BASE_URL + "/featureLookup",
  FEATURE_TYPES: BASE_URL + "/supportedFeatureTypes",
  FOOTPRINT_LOOKUP: BASE_URL + "/footprintLookup"
};


/**
 * Constructor for the places interface.
 * @param {Object} defaults   Default params to use on each request.
 */

function Unlock(defaults) {
  this.defaults = defaults || {};

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

    // Ensure we always have format
    if (!this.defaults.format) {
      this.defaults.format = 'json';
    }

    // Ensure we always have gazettteer
    if (!this.defaults.gazetteer) {
      this.defaults.gazetteer = 'unlock';
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
    var self = this;
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    request({
      url: url,
      qs: this.buildParams(params),
    }, function(err, res, body) {
      // Return error
      if (err) {
        return callback(err, null);
      }
      
      // Invalid response/error
      else if (res.statusCode !== 200) {
        return callback({
          err: 'Request error, status code: ' + res.statusCode
        }, null);
      }

      // If user is using JSON return an object
      else if (self.getResponseFormat() === 'json') {
        try {
          body = JSON.parse(body);
        } catch (e) {
          return callback(e, null);
        }

        return callback(null, body);
      }

      // Just return the response if we get here
      else {
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