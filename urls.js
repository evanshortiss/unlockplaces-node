/**
 * urls.js
 * File containing urls for the service.
 */

var BASE_URL = "http://unlock.edina.ac.uk/ws";

module.exports = {
  SEARCH_URL: BASE_URL + "/search",
  CLOSEST_MATCH: BASE_URL + "/closestMatchSearch",
  FEATURE_LOOKUP: BASE_URL + "/featureLookup",
  FEATURE_TYPES: BASE_URL + "/supportedFeatureTypes",
  FOOTPRINT_LOOKUP: BASE_URL + "/footprintLookup"
};