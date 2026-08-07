export type IntentType = '找数' | '问数';

export interface FieldItem {
  name: string;
  type: string;
  comment: string;
  desensitized: boolean;
  example?: string;
}

export interface DatasetInfo {
  tableName: string;
  tableComment: string;
  dataCount: number;
  updateFrequency: string;
  securityLevel: string;
  department: string;
  fields: FieldItem[];
}

export interface KpiCard {
  title: string;
  value: string;
  unit: string;
  trend?: string;
  trendType?: 'up' | 'down' | 'neutral';
}

export type ChartType = 'bar' | 'line' | 'pie' | 'stacked_bar' | 'radar' | 'gauge' | 'pyramid';

export interface ChartData {
  type: ChartType;
  title: string;
  xAxisKey?: string;
  dataKeys: string[];
  dataKeysLabels?: Record<string, string>;
  data: Record<string, any>[];
}

export interface TablePreview {
  columns: string[];
  rows: (string | number)[][];
}

export interface MessageResult {
  intent: IntentType;
  thoughtProcess?: string;
  summary: string;
  sql?: string;
  datasetInfo?: DatasetInfo;
  kpiCards?: KpiCard[];
  chart?: ChartData;
  tablePreview?: TablePreview;
  policySuggestions?: string[];
  followUpPrompts?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  turnIndex?: number;
  result?: MessageResult;
  isLoading?: boolean;
}

export interface ConversationTurnDemo {
  turnIndex: number;
  title: string;
  category: '找数' | '问数';
  userPrompt: string;
  assistantResult: MessageResult;
}

export interface PinnedChart {
  id: string;
  title: string;
  chart: ChartData;
  summary: string;
  timestamp: string;
}

export interface DatasetCatalogItem {
  id: string;
  name: string;
  category: string;
  count: number;
  dept: string;
  description: string;
  security: string;
}
