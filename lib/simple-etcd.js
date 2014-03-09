"use strict";

var Q = require("q");
var Etcd = require("node-etcd");
var util = require("./util");

function SimpleEtcd() {
  this.etcd = new Etcd();
}

SimpleEtcd.prototype.get = function (key) {
  return Q.ninvoke(this.etcd, "get", key, { recursive: true })
  .then(function (result) {
    return util.unwrapResponse(key, result[0].node);
  })
  .fail(checkForKeyNotFound);
};

SimpleEtcd.prototype.set = function (key, value) {
  return setValue(this.etcd, key, value).thenResolve();
};

function setValue(etcd, key, value) {
  if (value !== Object(value)) {
    return Q.ninvoke(etcd, "set", key, value);
  }

  var setters = util.pairs(value).map(function (pair) {
    return setValue(etcd, [key, pair[0]].join("/"), pair[1]);
  });
  return Q.all(setters);
}

function checkForKeyNotFound(e) {
  if (e.errorCode === 100) {
    return null;
  }
  return wrapError(e);
}

function wrapError(e) {
  var error = new Error(e.message);
  error.errorCode = e.errorCode;
  error.cause = e.cause;
  error.index = e.index;

  throw error;
}

module.exports = SimpleEtcd;
