
const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

/* create rule detail link to its document
 * supporting:
 * eslint, eslint-plugin-react, eslint-plugin-vue, eslint-plugin-import, @typescript-eslint/eslint-plugin
 */
const getRuleLink = (rule: string) => {
  const fragments = rule.split('/');
  if (!fragments.length) {
    return '';
  } else if (fragments.length === 1) {
    return `https://eslint.org/docs/rules/${fragments[0]}`;
  }

  const prefix = fragments[0];
  const postfix = fragments[1];
  if (prefix === 'vue') {
    return `https://eslint.vuejs.org/rules/${postfix}.html`;
  } else if (prefix === 'import') {
    return `https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/${postfix}.md`;
  } else if (prefix === 'react') {
    return `https://github.com/yannickcr/eslint-plugin-react/blob/HEAD/docs/rules/${postfix}.md`;
  } else if (prefix === '@typescript-eslint') {
    return `https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/${postfix}.md`;
  }
  return '';
};

const HTML_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'report.html');
const STYLE_TEMPLATE_PATH = path.resolve(__dirname, 'templates', 'styles.css');

const sortByCount = (a: any, b: any): number => (b.count - a.count);

const calcSummary = (data: any []) => {
  const totalFileCount = data.length;
  let totalErrorCount = 0;
  let totalWarningCount = 0;
  let totalFixableErrorCount = 0;
  let totalFixableWarningCount = 0;

  const filesWithProblems = data.filter(item => item.errorCount || item.warningCount);

  const problemMap = {};

  filesWithProblems.forEach(item => {
    const {messages, errorCount, warningCount, fixableErrorCount, fixableWarningCount} = item;

    // sums
    totalErrorCount += errorCount;
    totalWarningCount += warningCount;
    totalFixableErrorCount += fixableErrorCount;
    totalFixableWarningCount += fixableWarningCount;

    messages.forEach(problem => {
      const {ruleId, severity, fix} = problem;
      if (problemMap[ruleId]) {
        problemMap[ruleId].count += 1;
      } else {
        problemMap[ruleId] = {
          ruleId,
          problemType: severity === 1 ? 'Warning' : 'Error',
          fixableClass: fix ? 'fixable-check' : '',
          count: 1,
        };
      }
    });
  });

  const originProblemDetails = Object.values(problemMap).sort(sortByCount);
  const problemDetails = originProblemDetails.map((item: any) => {
    return {
      ...item,
      ruleLink: getRuleLink(item.ruleId),
    };
  });

  const clearFileCount = totalFileCount - filesWithProblems.length;
  const totalProblemCount = totalErrorCount + totalWarningCount;
  const totalFixableProblemCount = totalFixableErrorCount + totalFixableWarningCount;

  return {
    totalFileCount,
    clearFileCount,
    totalErrorCount,
    totalWarningCount,
    totalProblemCount,
    totalFixableErrorCount,
    totalFixableWarningCount,
    totalFixableProblemCount,
    filesWithProblems,
    problemDetails,
  };
};

interface CreateReporter {
  (data: any[]): string
}

const createReporter: CreateReporter = data => {
  const summary = calcSummary(data);

  const HTML_TEMPLATE = fs.readFileSync(HTML_TEMPLATE_PATH, 'utf-8');
  const STYLE_TEMPLATE = fs.readFileSync(STYLE_TEMPLATE_PATH, 'utf-8');

  const result = Mustache.render(
    HTML_TEMPLATE,
    {
      ...summary,
      styles: STYLE_TEMPLATE,
      createTime: Date(),
      data,
    }
  );

  return result;
};

module.exports = createReporter;
