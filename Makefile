test:
	./node_modules/.bin/mocha -C -u tdd \
   		--reporter list

.PHONY: test
