'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

var Mustache = require('mustache');

var fs = require('fs');

var path = require('path');
/* create rule detail link to its document
 * supporting:
 * eslint, eslint-plugin-react, eslint-plugin-vue, eslint-plugin-import, @typescript-eslint/eslint-plugin
 */


var getRuleLink = function getRuleLink(rule) {
  var fragments = rule.split('/');

  if (!fragments.length) {
    return '';
  } else if (fragments.length === 1) {
    return "https://eslint.org/docs/rules/".concat(fragments[0]);
  }

  var prefix = fragments[0];
  var postfix = fragments[1];

  if (prefix === 'vue') {
    return "https://eslint.vuejs.org/rules/".concat(postfix, ".html");
  } else if (prefix === 'import') {
    return "https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/".concat(postfix, ".md");
  } else if (prefix === 'react') {
    return "https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/".concat(postfix, ".md");
  } else if (prefix === '@typescript-eslint') {
    return "https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/".concat(postfix, ".md");
  }

  return '';
};

var HTML_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'report.html');
var STYLE_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'styles.css');

var sortByCount = function sortByCount(a, b) {
  return b.count - a.count;
};

var calcSummary = function calcSummary(data) {
  var totalFileCount = data.length;
  var totalErrorCount = 0;
  var totalWarningCount = 0;
  var totalFixableErrorCount = 0;
  var totalFixableWarningCount = 0;
  var filesWithProblems = data.filter(function (item) {
    return item.errorCount || item.warningCount;
  });
  var problemMap = {};
  filesWithProblems.forEach(function (item) {
    var messages = item.messages,
        errorCount = item.errorCount,
        warningCount = item.warningCount,
        fixableErrorCount = item.fixableErrorCount,
        fixableWarningCount = item.fixableWarningCount; // sums

    totalErrorCount += errorCount;
    totalWarningCount += warningCount;
    totalFixableErrorCount += fixableErrorCount;
    totalFixableWarningCount += fixableWarningCount;
    messages.forEach(function (problem) {
      var ruleId = problem.ruleId,
          severity = problem.severity,
          fix = problem.fix;

      if (problemMap[ruleId]) {
        problemMap[ruleId].count += 1;
      } else {
        problemMap[ruleId] = {
          ruleId: ruleId,
          problemType: severity === 1 ? 'Warning' : 'Error',
          fixableClass: fix ? 'fixable-check' : '',
          count: 1
        };
      }
    });
  });
  var originProblemDetails = Object.values(problemMap).sort(sortByCount);
  var problemDetails = originProblemDetails.map(function (item) {
    return _objectSpread2(_objectSpread2({}, item), {}, {
      ruleLink: getRuleLink(item.ruleId)
    });
  });
  var clearFileCount = totalFileCount - filesWithProblems.length;
  var totalProblemCount = totalErrorCount + totalWarningCount;
  var totalFixableProblemCount = totalFixableErrorCount + totalFixableWarningCount;
  return {
    totalFileCount: totalFileCount,
    clearFileCount: clearFileCount,
    totalErrorCount: totalErrorCount,
    totalWarningCount: totalWarningCount,
    totalProblemCount: totalProblemCount,
    totalFixableErrorCount: totalFixableErrorCount,
    totalFixableWarningCount: totalFixableWarningCount,
    totalFixableProblemCount: totalFixableProblemCount,
    filesWithProblems: filesWithProblems,
    problemDetails: problemDetails
  };
};

var createReporter = function createReporter(data) {
  var summary = calcSummary(data);
  var HTML_TEMPLATE = fs.readFileSync(HTML_TEMPLATE_PATH, 'utf-8');
  var STYLE_TEMPLATE = fs.readFileSync(STYLE_TEMPLATE_PATH, 'utf-8');
  var result = Mustache.render(HTML_TEMPLATE, _objectSpread2(_objectSpread2({}, summary), {}, {
    styles: STYLE_TEMPLATE,
    createTime: Date(),
    data: data
  }));
  return result;
};

module.exports = createReporter;
