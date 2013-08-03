/**
 * unlock.js
 * The main unlock API class.
 */


var qs = require('querystring');
var URLS = require('./urls.js');
var request = require('request');


/**
 * Constructor for the places interface.
 * @param {Object} defaults   Default params to use on each request.
 */

function Unlock(defaults) {
  defaults = defaults || {
    format: 'json'
  };

  // Apply all defaults if provided
  for (var key in this.defaults) {
    this[key] = this.defaults[key];
  }
}

Unlock.prototype = {

  /**
   * Set the data format we want returned, JSON is default.
   * Supported types: 'kml', 'json', 'xml', 'txt'
   * @param {String}   mode
   */
  setResponseFormat: function(format) {
    this.format = format.toLowerCase();
  },


  /**
   * Returns the format used by this instance.
   * @return {String}
   */
  getResponseFormat: function() {
    return this.format;
  },


  setGazetteer: function(gz) {
    this.gazetteer = gz;
  },

  getGazetteer: function() {
    return this.gazetteer;
  },


  setFeatureType: function(ft) {
    this.featureType = ft;
  },

  getFeatureType: function() {
    return this.featureType;
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
      if (!params[key]) {
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
    params = params || {};

    request({
      url: url,
      qs: buildParams(params),
    }, function(err, res, body) {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, body);
      }
    });
  },


  arrayToString: function(arr, callback) {
    var str = '';
    async.forEach(arr, function(item, cb) {
      str += item + ',';
      cb();
    }, function(err) {
      if (err) {
        return callback(err, null);
      }

      return callback(null, str)
    });
  },


  /**
   * Search for places by name.
   * @param {Mixed}     names     String/Array of names
   * @param {Object}    [params]  Optional extra query parameters
   * @param {Function}  callback
   */
  searchByName: function(names, params, callback) {
    // Check has user specified limit
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    // Parse in names as comma seperated if not already provided in this format
    if (typeof names !== 'string') {
      this.arrayToString(names, function(err, items) {
        if (err) {
          return callback(err);
        }

        params.name = items;
        doRequest(URLS.SEARCH_URL, params, callback);
      });
    } else {
      params.name = names;
      doRequest(URLS.SEARCH_URL, params, callback);
    }
  },

  searchByCountryAndName: function(name, country, params, callback) {
    var self = this;

    if (typeof params === 'function') {
      callback = params;
      params = {};
    }

    // Parse in names as comma seperated if not already provided in this format
    if (typeof name !== 'string') {
      this.arrayToString(name, function(err, items) {
        if (err) {
          return callback(err);
        }

        self.searchByCountryAndName(items, country, params, callback);
      });
    } else if (typeof country !== 'string') {
      this.arrayToString(country, function(err, items) {
        if (err) {
          return callback(err);
        }

        self.searchByCountryAndName(name, items, params, callback);
      });
    } else {
      params.country = country;
      params.country = name;
      doRequest(URLS.SEARCH_URL, params, callback);
    }
  },

  /**
   * Returns a list of all supported feature types from the API
   * @params {Function} callback
   */
  getSupportedFeatureTypes: function(callback) {
    this.doRequest(URLS.FEATURE_TYPES, callback);
  },
};