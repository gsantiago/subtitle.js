test:
	./node_modules/jshint/bin/jshint subtitle.js
	./node_modules/mocha/bin/mocha
	
.PHONY: test