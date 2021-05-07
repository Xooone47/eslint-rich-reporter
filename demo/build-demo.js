const fs = require('fs');
const path = require('path');
const createReporter = require('./reporter.js');

const DATA_PATH = path.resolve(__dirname, 'mock-data.json');
const OUTPUT_PATH = path.resolve(__dirname, 'report-demo.html');

const data = fs.readFileSync(DATA_PATH, 'utf-8');

const report = createReporter(JSON.parse(data));

fs.writeFileSync(OUTPUT_PATH, report);
