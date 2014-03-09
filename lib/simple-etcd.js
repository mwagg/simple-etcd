"use strict";

var Q = require("q");
var Etcd = require("node-etcd");

function SimpleEtcd() {
  this.etcd = new Etcd();
}

SimpleEtcd.prototype.get = function (key) {
  return Q.ninvoke(this.etcd, "get", key)
  .then(function (result) {
    return JSON.parse(result[0].node.value);
  })
  .fail(checkForKeyNotFound);
};

SimpleEtcd.prototype.set = function (key, value) {
  return Q.ninvoke(this.etcd, "set", key, JSON.stringify(value)).thenResolve();
};

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
