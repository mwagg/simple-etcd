"use strict";

function has(o, key) {
  return {}.hasOwnProperty.call(o, key);
}

function pairs(o) {
  var objectPairs = [];
  for (var k in o) {
    if (has(o, k)) {
      objectPairs.push([k, o[k]]);
    }
  }

  return objectPairs;
}

function unwrapResponse(prefix, node) {
  if (has(node, "value")) {
    return node.value;
  }
  var result = {};

  function keyWithoutPrefix(key) {
    return key.replace(new RegExp("/?" + prefix + "/?"), "");
  }

  node.nodes.forEach(function (n) {
    result[keyWithoutPrefix(n.key)] = unwrapResponse(n.key, n);
  });

  return result;
}

exports.has = has;
exports.unwrapResponse = unwrapResponse;
exports.pairs = pairs;
