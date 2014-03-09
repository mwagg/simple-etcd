"use strict";

var expect = require("chai").expect;
var SimpleEtcd = require("../");
var Q = require("q");
var helper = require("./helper");

describe("setting values", function () {
  var simpleEtcd;

  before(function (done) {
    helper.recursivelyDelete("test-key")
    .then(done, done);

    simpleEtcd = new SimpleEtcd();
  });

  describe("simple values", function () {
    it("can set simple values", function (done) {
      simpleEtcd.set("test-key/setting-simpe-value", "a value")
      .then(helper.verifyKeyHasValue("test-key/setting-simpe-value", JSON.stringify("a value")))
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

    it("can set single level deep objects", function (done) {
      simpleEtcd.set("test-key/setting-single-level-object", single)
      .then(helper.verifyKeyHasValue("test-key/setting-single-level-object", JSON.stringify(single)))
      .then(done, done);
    });

    it("can set multiple level deep objects", function (done) {
      simpleEtcd.set("test-key/setting-multiple-level-object", multiple)
      .then(helper.verifyKeyHasValue("test-key/setting-multiple-level-object", JSON.stringify(multiple)))
      .then(done, done);
    });
  });
});
