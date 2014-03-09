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
      .then(helper.verifyKeyHasValue("test-key/setting-simpe-value", "a value"))
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
      .then(helper.verifyKeyHasValue("test-key/setting-single-level-object/foo", single.foo))
      .then(helper.verifyKeyHasValue("test-key/setting-single-level-object/bar", single.bar))
      .then(done, done);
    });

    it("can set multiple level deep objects", function (done) {
      simpleEtcd.set("test-key/setting-multiple-level-object", multiple)
      .then(helper.verifyKeyHasValue("test-key/setting-multiple-level-object/foo", multiple.foo))
      .then(helper.verifyKeyHasValue("test-key/setting-multiple-level-object/bar/hey", multiple.bar.hey))
      .then(done, done);
    });
  });
});
