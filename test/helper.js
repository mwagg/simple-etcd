"use strict";

var expect = require("chai").expect;
var Etcd = require("node-etcd");
var Q = require("q");
var Etcd = require("node-etcd");

var etcd = new Etcd();

exports.setValue = function setValue(key, value) {
  return Q.ninvoke(etcd, "set", key, value)
  .fail(function (e) {
    throw e;
  })
  .thenResolve();
};

exports.recursivelyDelete = function recursivelyDelete(key) {
  return Q.ninvoke(etcd, "delete", key, { recursive: true })
  .fail(function (err) {
    // key not found
    if (err.errorCode === 100) {
      return;
    }
    throw err;
  })
  .thenResolve();
};

exports.verifyResultIs = function verifyResultIs(expected) {
  return function (value) {
    expect(value).to.deep.equal(expected);
  };
};

exports.verifyKeyHasValue = function verifyKeyHasValue(key, value) {
  return function () {
    return Q.ninvoke(etcd, "get", key)
    .then(function (result) {
      expect(result[0].node.value).to.equal(value);
    }).fail(function (e) {
      throw new Error(JSON.stringify(e, undefined, 2));
    });
  };
};

exports.waitUntilArrayHasItems = function (array, expectedCount) {
  var deferred = Q.defer();

  function check() {
    if (array.length >= expectedCount) {
      deferred.resolve();
      return;
    }

    setTimeout(check, 100);
  }

  check();

  return deferred.promise;
};
