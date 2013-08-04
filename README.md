unlockplaces-node
==============

## About
A node.js module to make interfacing with the Unlock Places API by <a href="http://edina.ac.uk/">EDINA</a> easy. The API documentation is available <a href="http://unlock.edina.ac.uk/places/introduction" target="_blank">here</a>.

## Install
Install as a standard npm module.

```
  $ npm install unlock-places
```

## Usage
The most straight forward use case is to require the module and simply call methods that are exposed by the API as explained in the <a href="http://unlock.edina.ac.uk/places/queries/" target="_blank">docs</a>.

Each request to the API will by default use the 'unlock' gazetteer and 'json' as the format option. These can be overridden by using [setResponseFormat](#setResponseFormat), [setGazetteer](#setGazetteer), [setDefaults](#setDefaults) or by creating a new Unlock object and providing defaults to the constructor. 

```javascript
  var unlock = require('unlock-places');

  // Do a loaction search
  unlock.search({
    name: 'dublin',
    country: 'ireland'
  }, function(err, res) {
    // Assuming we're using json as format
    res = JSON.parse(res);
  });
```

An alternative use case might be to create multiple Unlock Places objects and use them for different purposes. This will allow you to apply defualts to each request without applying them as defaults to the originally required Unlock Places object.

```javascript
  var unlock = require('unlock-places');

  // Each request using this object will include the 'country' parameter
  var useIreland = new unlock.Class({
    country: 'ireland'
  });

  // Do a search for places named 'Dublin' in ireland and use the 'os' gazetteer
  useIreland.search({
    name: 'dublin',
    gazetteer: 'os'
  }, function(err, res) {
    // Assuming we're using json as format
    res = JSON.parse(res);
  });
```

## Documentation

* [setResponseFormat](#setResponseFormat)
* [getResponseFormat](#getResponseFormat)
* [setGazetteer](#setGazetteer)
* [getGazetteer](#getGazetteer)
* [setDefaults](#setDefaults)
* [getDefaults](#getDefaults)
* [search](#search)
* [footprintLookup](#footprintLookup)
* [featureLookup](#featureLookup)
* [closestMatchSearch](#closestMatchSearch)
* [supportedFeatureTypes](#supportedFeatureTypes)


---------------------------------------

<a name="setResponseFormat" />
### setResponseFormat(format)

Set the default response format for each API request. Can be 'json', 'xml', 'kml' or 'txt'.

---------------------------------------

<a name="getResponseFormat" />
### getResponseFormat()

Returns the default response format to use.

---------------------------------------

<a name="setGazetteer" />
### setGazetteer(gazetteer)

Set the default gazetteer for each API request. Can be 'unlock', 'os' or 'naturalearth'

---------------------------------------

<a name="getGazetteer" />
### getGazetteer()

Returns the default gazetteer to use for each request.

---------------------------------------

<a name="setDefaults" />
### setDefaults(defaults)

Set default parameters to add to each request. For example:
```javascript
  var places = require('unlock-places');

  // All of these are optional. Old defaults will be erased.
  places.setDefaults({
    format: 'xml',
    name: 'london',
    gazetteer: 'naturalearth'
  });
```

---------------------------------------

<a name="getDefaults" />
### getDefaults()

Return the defaults being used in each request.

---------------------------------------

<a name="search" />
### search(params, callback)

Run a locations search against the API. Params is an object that contains any items to add to the request querystring. Any params included that conflict those in defaults will override the default setting.

```javascript
  var places = require('unlock-places');

  // All of these are optional. Old defaults will be erased.
  places.setDefaults({
    format: 'xml',
    name: 'london',
    gazetteer: 'naturalearth'
  });

  // Do a request but override the xml response format default.
  places.search({
    name: 'paris',
    format: 'txt'
  });
```

---------------------------------------

<a name="footprintLookup" />
### footprintLookup(params, callback)

Run a footprintLookup against the API. The params object must contain an 'id' parameter.

---------------------------------------

<a name="featureLookup" />
### featureLookup(params, callback)

Run a featureLookup against the API. The params object must contain an 'id' parameter.

---------------------------------------

<a name="closestMatchSearch" />
### closestMatchSearch(params, callback)

Run a search against the API and returns a single result only.

---------------------------------------

<a name="supportedFeatureTypes" />
### supportedFeatureTypes(params, callback)

Returns the supported feature types for the given params.