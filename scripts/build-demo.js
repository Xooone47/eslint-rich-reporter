const fs = require('fs');
const path = require('path');
const mockdata = require('../mock/mock-result.json');
const reporter = require('../build/reporter.js');

const report = reporter(mockdata);

const HTML_OUTPUT_PATH = path.resolve(__dirname, '..', 'report-demo.html');

fs.writeFileSync(HTML_OUTPUT_PATH, report);
