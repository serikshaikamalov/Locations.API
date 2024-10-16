wrainstall:
	npm install
run:	
	npx wrangler pages dev ./public -b ENV=dev -b IS_LOCAL=true --d1 DB=locations-dev

pushdev:
	git push origin --force `git symbolic-ref --short HEAD`:dev

deploy:
	npx wrangler pages deploy ./public

kill:
	pkill -9 -f workerd

# Used to drop a local SQLite DB
drop-local:
	sudo rm -rf .wrangler/state/v3/d1
db-restore:
	npx wrangler d1 execute locations-dev --local --file=./sqlite/cities.sql

db-restore-prod:
	npx wrangler d1 execute locations-prod --remote --file=./sqlite/cities.sql