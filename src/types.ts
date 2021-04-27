interface Message {
  ruleId: string;
  severity:number;
  message: string;
  line: number;
  column: number;
  nodeType: string;
  messageId: string;
  endLine: number;
  endColumn: number;
}

interface UsedDeprecatedRule {
  ruleId: string;
  replacedBy: any[]; // TODO
}
interface EslintResultItem {
  filePath: string;
  messages: Message[];
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  source: string;
  usedDeprecatedRules: UsedDeprecatedRule[];
}

export type EslintResult = EslintResultItem[];


