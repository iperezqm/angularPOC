build:
	@npm prune
	@npm install
	@./node_modules/grunt-bower-task/node_modules/bower/bin/bower prune
	@./node_modules/grunt-protractor-runner/scripts/webdriver-manager-update
	@./node_modules/.bin/grunt bower:install --no-time --no-color
	@./node_modules/.bin/grunt build --no-time --no-color
	@./node_modules/.bin/grunt test_ci --no-time --no-color
	@wait
