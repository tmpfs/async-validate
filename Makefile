test:
	./node_modules/.bin/mocha -u tdd \
   		--reporter list

.PHONY: test
