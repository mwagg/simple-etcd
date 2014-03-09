export PATH := ./node_modules/.bin:$(PATH)

.PHONY: test

all: lint test

test:
	mocha -R spec test

lint:
	jshint lib
	jshint --config test/.jshintrc test
