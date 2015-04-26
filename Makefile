test:
	./node_modules/jshint/bin/jshint subtitle.js
	./node_modules/mocha/bin/mocha
	
coverage:
	./node_modules/.bin/istanbul cover ./node_modules/mocha/bin/_mocha
	
.PHONY: test coverage