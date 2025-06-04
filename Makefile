build_public:
	npx tsc public/**/*.ts

clean_public:
	rm -f public/**/*.js

run_main:
	npx tsx index
