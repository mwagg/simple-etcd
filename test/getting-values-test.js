"use strict";

var expect = require("chai").expect;
var SimpleEtcd = require("../");
var Q = require("q");
var helper = require("./helper");

describe("getting values", function () {
  var simpleEtcd;

  before(function (done) {
    helper.recursivelyDelete("test-key")
    .then(done, done);

    simpleEtcd = new SimpleEtcd();
  });

  describe("when there is no value for the key", function () {
    it("returns null", function (done) {
      simpleEtcd.get("test-key/i-dont-exist")
      .then(helper.verifyResultIs(null))
      .then(done, done);
    });
  });

  describe("simple values", function () {
    before(function (done) {
      helper.setValue("test-key/getting-simple-value", JSON.stringify("a value"))
      .then(done, done);
    });

    it("can get simple values", function (done) {
      simpleEtcd.get("test-key/getting-simple-value")
      .then(helper.verifyResultIs("a value"))
      .then(done, done);
    });
  });

  describe("objects", function () {
    var single = {
      foo: "bar",
      bar: "foo"
    };
    var multiple = {
      foo: "bar",
      bar: {
        hey: "ho"
      }
    };

    before(function (done) {
      Q.all([
        helper.setValue("test-key/getting-single-level-objects", JSON.stringify(single)),
        helper.setValue("test-key/getting-multiple-level-objects", JSON.stringify(multiple))
      ])
      .thenResolve()
      .then(done, done);
    });

    it("can get single level deep objects", function (done) {
      simpleEtcd.get("test-key/getting-single-level-objects")
      .then(helper.verifyResultIs(single))
      .then(done, done);
    });

    it("can get multiple level deep objects", function (done) {
      simpleEtcd.get("test-key/getting-multiple-level-objects")
      .then(helper.verifyResultIs(multiple))
      .then(done, done);
    });
  });
});
