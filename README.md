# simple-etcd

An opinionated wrapper around [node-etcd](https://www.npmjs.org/package/node-etcd) providing a less powerful but
simpler way to read and write values in etcd which also makes use of Q.js to provide a promise rather than
callback baed API.

[![Build Status](https://travis-ci.org/mwagg/simple-etcd.png?branch=master)](https://travis-ci.org/mwagg/simple-etcd)

## Install

```
$ npm install simple-etcd
```

## Basic usage

```
var SimpleEtcd = require("simple-etcd");
var simpleEtcd = new SimpleEtcd(); // defaults to localhost:4001
simpleEtcd.set("some-key", { bar: "foo", foo: "bar" }).
.then(function () {
  simpleEtcd.get("some-key", function (value) {
    // value has properies 'bar' and 'foo' with values 'foo' and 'bar'
  });
})
```

### Creating an instance of SimpleEtcd

The SimpleEtcd constructor matches that of node-etcd. With no parameters it defaults to connecting
to Etcd via localhost and port 4001.

### Setting values

```
simpleEtcd.set("some-key", { bar: "foo", foo: "bar" });
```

The set method returns a promise which you can use to wait until the value has been set.

For simple values the behaviour is exactly the same as node-etcd.

So for example the following code will set the key "/foo" to the value "bar".

```
simpleEtcd.set("foo", "bar");
```

However if the value being set is an object them SimpleEtcd unwraps each property and creates keys
within Etcd which match the structure of the object.

So for example this code,

```
simpleEtcd.set("foo", { bar: "foo", who: { har: 42 } });
```

will write the following keys:

```
"/foo/bar" -> "foo"
"/foo/who/har" -> 42
```


This behaviour of spreading the properties of an object over multiple keys differs from the
default behvaiour of node-etcd.

### Getting values

```
simpleEtcd.get("some-key")
```

This code returns a promise that will eventually resolve to the value of that key in Etcd. As with the set functionality, for
simple values this will behave as node-etcd.

So for example given the key "/some-key" with a value of "foo" the previous code would resolve to "foo".

For keys under which there are child keys present, SimpleEtcd will recursively fetch the child values and construct an object representing
all the keys below the specified key.

So given the following keys:

```
"/some-key/foo" -> "bar"
"/some-key/bar" -> "foo"
"/some-key/hey/ho" -> "let's go!"
```

Then the following code,

```
simpleEtcd.get("some-key")
```

would eventually resolve to the following value:

```
{
  "foo": "bar",
  "bar": "foo":
  "hey": {
    "ho": "let's go!"
  }
}
```
