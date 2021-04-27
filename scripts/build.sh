yarn clear

node rollup.js

cp src/index.d.ts .

cp src/mock-result.json cjs/mock-result.json
cp -r src/templates cjs/templates

node cjs/reporter.js
