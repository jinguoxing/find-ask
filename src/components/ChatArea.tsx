import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Database,
  Table as TableIcon,
  Code2,
  FileSpreadsheet,
  Pin,
  Check,
  Zap,
  ArrowRight,
  ShieldAlert,
  BarChart3,
  Lightbulb,
  ExternalLink,
  BookOpen,
  BookmarkCheck,
  Mic,
  Paperclip,
  RotateCw,
  Copy,
  Download,
  Layers,
  Network,
  CheckCircle2,
  Target,
  FileText,
  Compass
} from 'lucide-react';
import { ChatMessage, MessageResult, DatasetInfo, ChartData, PinnedChart } from '../types';
import { CustomChart } from './Charts/CustomChart';

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  currentTurn: number;
  totalTurns: number;
  isAutoPlaying: boolean;
  onSendMessage: (text: string) => void;
  onSelectTurn: (turnIndex: number) => void;
  onInspectSql: (sql: string, dataset?: DatasetInfo) => void;
  onPinChart: (chart: PinnedChart) => void;
  onOpenDatasetModal: (tableName: string) => void;
  pinnedChartIds: string[];
}

// Typewriter Text Component
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    if (!text) return;

    let index = 0;
    const interval = setInterval(() => {
      index += 2;
      if (index >= text.length) {
        setDisplayedText(text);
        setIsFinished(true);
        clearInterval(interval);
      } else {
        setDisplayedText(text.slice(0, index));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative group">
      <p className="text-slate-800 font-normal leading-relaxed text-sm whitespace-pre-wrap">
        {displayedText}
        {!isFinished && <span className="inline-block w-1.5 h-4 ml-0.5 bg-blue-600 animate-pulse align-middle" />}
      </p>
      {!isFinished && (
        <button
          onClick={() => {
            setDisplayedText(text);
            setIsFinished(true);
          }}
          className="mt-1 text-[10px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 transition"
        >
          <Zap className="w-3 h-3" />
          <span>跳过动画·直接显示全部</span>
        </button>
      )}
    </div>
  );
};

// 5-Second Simulated AI Thinking Progress Card
const ThinkingProgressCard: React.FC = () => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const ms = Date.now() - startTime;
      if (ms >= 5000) {
        setElapsed(5000);
        clearInterval(interval);
      } else {
        setElapsed(ms);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const seconds = (elapsed / 1000).toFixed(1);
  const percent = Math.min(Math.round((elapsed / 5000) * 100), 100);

  const steps = [
    {
      timeRange: [0, 1200],
      title: '1. 自然语言意图与安全鉴权',
      desc: '识别政务找数/问数指令，校验数据三级共享权限与敏感字段访问策略'
    },
    {
      timeRange: [1200, 2500],
      title: '2. Schema 路由与元数据定位',
      desc: '穿透人口主题库 Catalog，匹配常住人口、户籍管理与津贴发放关联表'
    },
    {
      timeRange: [2500, 3800],
      title: '3. SQL 智能编译与加盐脱敏',
      desc: '生成多表 Join 与 Group By 算子，配置身份证/姓名 Hash 掩码逻辑'
    },
    {
      timeRange: [3800, 5000],
      title: '4. 多维指标计算与图表渲染',
      desc: '执行分布式计算引擎，聚合 KPI 指标、构建透视数据阵列与 ECharts 视图'
    }
  ];

  return (
    <div className="my-4 max-w-2xl bg-white border border-blue-200 rounded-2xl p-4 shadow-sm space-y-3.5 relative overflow-hidden">
      {/* Top Header & Stopwatch */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>政务 population 大模型 AI 协同推演中</span>
              <span className="px-1.5 py-0.2 bg-blue-50 text-blue-700 text-[10px] rounded border border-blue-200 font-mono">
                5.0s 深入思考模式
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              数据源: 市大数据中心人口基础数据库 · 引擎: Spark / ClickHouse
            </div>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-sm font-bold text-blue-600">{seconds}s / 5.0s</div>
          <div className="text-[10px] text-slate-400">{percent}% 完成度</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 h-2 rounded-full transition-all duration-75 ease-linear shadow-xs"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 4-Step Process Vertical Timeline */}
      <div className="space-y-2 pt-1">
        {steps.map((step, idx) => {
          const [startMs, endMs] = step.timeRange;
          const isDone = elapsed >= endMs;
          const isActive = elapsed >= startMs && elapsed < endMs;

          return (
            <div
              key={idx}
              className={`flex items-start space-x-2.5 p-2 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-blue-50/80 border border-blue-200 shadow-2xs'
                  : isDone
                  ? 'bg-slate-50/60 text-slate-700'
                  : 'text-slate-400 opacity-60'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                ) : isActive ? (
                  <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center animate-pulse">
                    <RotateCw className="w-2.5 h-2.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 bg-white text-slate-400 flex items-center justify-center text-[10px] font-mono">
                    {idx + 1}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between font-semibold">
                  <span className={isActive ? 'text-blue-900 font-bold' : isDone ? 'text-slate-800' : 'text-slate-500'}>
                    {step.title}
                  </span>
                  {isActive && (
                    <span className="text-[10px] font-mono text-blue-600 animate-pulse">推演计算中...</span>
                  )}
                  {isDone && <span className="text-[10px] font-mono text-emerald-600">已就绪</span>}
                </div>
                <div className={`text-[11px] leading-tight mt-0.5 ${isActive ? 'text-blue-800' : 'text-slate-500'}`}>
                  {step.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const ChatArea: React.FC<Props> = ({
  messages,
  isLoading,
  currentTurn,
  totalTurns,
  isAutoPlaying,
  onSendMessage,
  onSelectTurn,
  onInspectSql,
  onPinChart,
  onOpenDatasetModal,
  pinnedChartIds
}) => {
  const [inputText, setInputText] = useState('');
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [expandedThoughtMap, setExpandedThoughtMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const toggleThought = (msgId: string) => {
    setExpandedThoughtMap(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    if (val.endsWith('@') || (val.includes('@') && !val.includes(' '))) {
      setShowMentionDropdown(true);
    } else {
      setShowMentionDropdown(false);
    }
  };

  const handleSelectMentionScene = (sceneName: string) => {
    setInputText(`[@${sceneName}] `);
    setShowMentionDropdown(false);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickPromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <main className="flex-1 bg-white text-slate-800 flex flex-col h-[calc(100vh-3.5rem)] relative overflow-hidden">
      {/* Auto-Play Scenario Stepper Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-slate-800">政务对话演练模式:</span>
          <span className="text-slate-500">【找数】资产定位 ➔ 【问数】分析与图表</span>
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto py-0.5 max-w-xl">
          {Array.from({ length: totalTurns }).map((_, idx) => {
            const turnNum = idx + 1;
            const isCompleted = currentTurn >= turnNum;
            const isCurrent = currentTurn === turnNum;
            return (
              <button
                key={turnNum}
                onClick={() => onSelectTurn(turnNum)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-blue-600 text-white font-bold shadow-sm ring-2 ring-blue-200'
                    : isCompleted
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-white text-slate-400 border border-slate-200 hover:text-slate-600'
                }`}
              >
                <span>T{turnNum}</span>
                <span className="text-[10px]">
                  {turnNum <= 3 ? '找数' : '问数'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-white">
        {messages.length === 0 && (
          <div className="max-w-3xl mx-auto my-12 p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center mb-4 shadow-md">
              <Bot className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              欢迎使用【智慧人口 · 政务大数据找数问数平台】
            </h2>
            <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6 leading-relaxed">
              支持自然语言精准检索政务人口数据资产表、字段词典与血缘（找数），并支持动态执行多维SQL计算与图表可视化（问数）。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
              <div
                onClick={() => onSelectTurn(1)}
                className="p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer transition group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-amber-700">第一阶段：智能【找数】演示</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-600">"找一下全市60岁以上老人及高龄津贴相关库表和字段"</p>
              </div>

              <div
                onClick={() => onSelectTurn(4)}
                className="p-3.5 bg-white hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer transition group shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-blue-700">第二阶段：智能【问数】演示</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-xs text-slate-600">"统计近5年全市各区老龄人口变化趋势及津贴发放总额"</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          const isThoughtExpanded = expandedThoughtMap[msg.id] ?? false;
          const result = msg.result;

          return (
            <div
              key={`${msg.id || 'msg'}-${index}`}
              className={`flex items-start space-x-3 max-w-4xl ${
                isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-600 border border-blue-200 font-bold text-xs'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}>
                {/* Header info */}
                <div className="flex items-center space-x-2 mb-1.5 text-xs text-slate-400">
                  <span className="font-semibold text-slate-700">
                    {isUser ? '政务决策分析员' : '人口库AI智能助手'}
                  </span>
                  <span>·</span>
                  <span className="font-mono text-[10px] text-slate-400">{msg.timestamp}</span>

                  {!isUser && result && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        result.intent === '找数'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {result.intent === '找数' ? '🔍 智能找数模式' : '📊 智能问数可视化'}
                    </span>
                  )}
                </div>

                {/* Bubble Container */}
                <div
                  className={`rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div className="space-y-4">
                      {/* Summary text (Conclusion First with Typewriter Effect) */}
                      <TypewriterText text={result?.summary || msg.content} />

                      {/* Thought Process Accordion (Subtle audit details) */}
                      {result?.thoughtProcess && (
                        <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden text-xs shadow-2xs">
                          <button
                            onClick={() => toggleThought(msg.id)}
                            className="w-full px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-slate-600 font-mono transition text-[11px]"
                          >
                            <span className="flex items-center gap-1.5 text-blue-600 font-medium">
                              <Sparkles className="w-3.5 h-3.5" />
                              查看 AI 思考推理与 Schema 路由逻辑
                            </span>
                            {isThoughtExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            )}
                          </button>

                          {isThoughtExpanded && (
                            <div className="p-3 bg-white text-slate-600 font-mono whitespace-pre-wrap border-t border-slate-200/80 text-[11px] leading-relaxed">
                              {result.thoughtProcess}
                            </div>
                          )}
                        </div>
                      )}

                      {/* KPI Cards (if present) */}
                      {result?.kpiCards && result.kpiCards.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
                          {result.kpiCards.map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs hover:border-slate-300 transition"
                            >
                              <div className="text-[11px] text-slate-500 truncate">{kpi.title}</div>
                              <div className="flex items-baseline space-x-1 mt-1">
                                <span className="text-lg font-bold text-slate-900 font-mono">{kpi.value}</span>
                                <span className="text-xs text-slate-500">{kpi.unit}</span>
                              </div>
                              {kpi.trend && (
                                <div
                                  className={`text-[10px] mt-1 font-mono font-medium ${
                                    kpi.trendType === 'up'
                                      ? 'text-emerald-600'
                                      : kpi.trendType === 'down'
                                      ? 'text-rose-600'
                                      : 'text-slate-500'
                                  }`}
                                >
                                  {kpi.trend}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 【决策型数据发现】 Decision-oriented Data Discovery Panel */}
                      {result?.decisionDiscovery && (
                        <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/30 border border-amber-200/80 rounded-2xl p-4 space-y-3.5 shadow-sm">
                          {/* Header */}
                          <div className="flex items-center justify-between border-b border-amber-200/60 pb-2.5">
                            <div className="flex items-center space-x-2">
                              <span className="p-1.5 bg-amber-500 text-white rounded-lg shadow-2xs">
                                <Target className="w-4 h-4" />
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                                  <span>决策型数据发现 (Decision-oriented Data Discovery)</span>
                                  <span className="text-[10px] px-2 py-0.5 bg-amber-200 text-amber-900 rounded font-mono font-semibold">Semovix AI Data Advisor</span>
                                </h4>
                                <p className="text-[10px] text-amber-800/80 mt-0.5">从业务决策目标倒推 ➔ 分析问题拆解 ➔ 抽象数据方案 ➔ 资产精选 ➔ 计算与报告生成</p>
                              </div>
                            </div>
                            <span className="text-[10px] px-2 py-1 bg-white text-amber-800 border border-amber-300 rounded-lg shadow-2xs font-mono font-medium">
                              全链路决策支撑
                            </span>
                          </div>

                          {/* Step 1: Goal & Decomposition */}
                          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 space-y-2 shadow-2xs">
                            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                              <Compass className="w-4 h-4 text-amber-600" />
                              <span>Step 1：理解业务目标与问题拆解</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                              <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                                <span className="text-amber-800 font-semibold">真实业务目标: </span>
                                <span className="text-slate-800 font-medium">{result.decisionDiscovery.businessGoal}</span>
                              </div>
                              <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100">
                                <span className="text-amber-800 font-semibold">核心分析对象: </span>
                                <span className="text-slate-800 font-mono font-medium">{result.decisionDiscovery.targetObject}</span>
                              </div>
                            </div>
                            
                            <div className="text-[11px] text-slate-700 space-y-1 pt-1">
                              <div className="font-semibold text-amber-900 flex items-center gap-1">
                                <span>分析维度 & 决策目标:</span>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {result.decisionDiscovery.analysisDimensions.map((dim, dIdx) => (
                                  <span key={dIdx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-medium">
                                    {dim}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px]">
                              <span className="font-bold text-amber-800">决策路线图: </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mt-1 text-[10px] text-slate-700">
                                {result.decisionDiscovery.planSteps.map((step, stIdx) => (
                                  <div key={stIdx} className="flex items-center gap-1 bg-white p-1 rounded border border-slate-100">
                                    <span className="text-amber-600 font-mono font-bold">0{stIdx + 1}.</span>
                                    <span className="truncate">{step}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Step 2: Data Solution & Abstract Objects */}
                          <div className="bg-white/90 rounded-xl p-3 border border-amber-100 space-y-2 shadow-2xs">
                            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Layers className="w-4 h-4 text-orange-500" />
                                <span>Step 2 & 3：构建数据方案与推荐资产组合</span>
                              </span>
                              <span className="text-[10px] text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {result.decisionDiscovery.solutionTitle}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600 bg-amber-50/50 p-2 rounded-lg border border-amber-100/60 leading-relaxed">
                              <strong className="text-amber-900">推荐方案说明: </strong>
                              {result.decisionDiscovery.solutionCoverageReason}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                              {result.decisionDiscovery.dataObjects.map((obj, oIdx) => (
                                <div key={oIdx} className="bg-slate-50 p-2 rounded-lg border border-slate-200 space-y-1">
                                  <div className="text-[11px] font-bold text-slate-900 flex items-center justify-between">
                                    <span>{obj.name}</span>
                                    <span className="text-[9px] text-amber-700 bg-amber-100 px-1 rounded font-mono">{obj.type}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono leading-tight truncate">
                                    {obj.rulesOrFields}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Step 4 & 5: Decision Report Preview */}
                          <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2 shadow-xs border border-slate-800">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                                <FileText className="w-4 h-4 text-amber-400" />
                                <span>Step 4 & 5：自动计算问数 & 决策报告生成</span>
                              </div>
                              <span className="text-[10px] text-cyan-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">
                                {result.decisionDiscovery.reportTitle}
                              </span>
                            </div>
                            <div className="text-xs text-slate-300 leading-relaxed pt-0.5">
                              <span className="text-amber-400 font-semibold">分析计算问题: </span>
                              <span className="font-mono text-cyan-200">“{result.decisionDiscovery.executionQuestion}”</span>
                            </div>
                            <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                              <span className="text-emerald-400 font-bold">决策报告核心摘要: </span>
                              {result.decisionDiscovery.reportSummary}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 【找数】 Entity Lineage / Data Relationship Flow */}
                      {result?.dataRelationshipFlow && result.dataRelationshipFlow.length > 0 && (
                        <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 space-y-2 shadow-sm">
                          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                            <Network className="w-4 h-4 text-cyan-400" />
                            <span>AI 数据关系与实体下钻链路 (Entity Lineage & Topology):</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                            {result.dataRelationshipFlow.map((step, sIdx) => (
                              <React.Fragment key={sIdx}>
                                <span className="px-2.5 py-1 bg-slate-800 text-cyan-200 border border-slate-700/80 rounded-lg shadow-2xs font-medium">
                                  {step}
                                </span>
                                {sIdx < result.dataRelationshipFlow!.length - 1 && (
                                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 【找数】 Recommended Data Assets Cards */}
                      {result?.recommendationAssets && result.recommendationAssets.length > 0 && (
                        <div className="space-y-2.5">
                          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-amber-500" />
                              AI 精准推荐的政务数据资产 ({result.recommendationAssets.length} 张库表):
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {result.recommendationAssets.map((asset, aIdx) => (
                              <div
                                key={aIdx}
                                className="bg-white border border-slate-200 hover:border-blue-300 rounded-xl p-3 space-y-2 shadow-2xs transition"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                      <span className="text-blue-600 font-mono">[{asset.tableName}]</span>
                                      <span>{asset.tableComment}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-0.5">
                                      归属: <strong className="text-slate-700">{asset.dept}</strong> · 分类: <span className="text-indigo-600">{asset.category}</span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => onOpenDatasetModal(asset.tableName)}
                                    className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 font-medium transition shrink-0"
                                  >
                                    预览表结构
                                  </button>
                                </div>

                                <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
                                  <span className="font-semibold text-amber-700">推荐理由: </span>
                                  {asset.reason}
                                </div>

                                {asset.keyFields && asset.keyFields.length > 0 && (
                                  <div className="flex flex-wrap gap-1 text-[10px] font-mono text-slate-500">
                                    <span className="text-slate-400">核心字段:</span>
                                    {asset.keyFields.map((field, fIdx) => (
                                      <span key={fIdx} className="bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200 text-slate-700">
                                        {field}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 【找数】 Display Block: Primary Dataset Details & Fields */}
                      {result?.datasetInfo && (
                        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-xs">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                            <div className="flex items-center space-x-2">
                              <Database className="w-4 h-4 text-blue-600" />
                              <span className="font-bold text-slate-900">{result.datasetInfo.tableComment}</span>
                              <span className="font-mono text-xs text-slate-500">({result.datasetInfo.tableName})</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-mono">
                              {result.datasetInfo.securityLevel}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                            <div>数据总量: <strong className="text-slate-800 font-mono">{result.datasetInfo.dataCount.toLocaleString()} 条</strong></div>
                            <div>更新频率: <strong className="text-slate-800">{result.datasetInfo.updateFrequency}</strong></div>
                            <div>归属部门: <strong className="text-slate-800">{result.datasetInfo.department}</strong></div>
                          </div>

                          {/* Fields table */}
                          <div>
                            <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                              <span>核心库表结构与字段脱敏说明:</span>
                              <button
                                onClick={() => onOpenDatasetModal(result.datasetInfo!.tableName)}
                                className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1 transition font-medium"
                              >
                                <ExternalLink className="w-3 h-3" />
                                预览10条脱敏数据
                              </button>
                            </div>

                            <div className="overflow-x-auto border border-slate-200 rounded-lg">
                              <table className="w-full text-left text-xs text-slate-700 font-mono">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px]">
                                  <tr>
                                    <th className="p-2">字段名</th>
                                    <th className="p-2">类型</th>
                                    <th className="p-2">含义说明</th>
                                    <th className="p-2">脱敏防护</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {result.datasetInfo.fields.map((field, fIdx) => (
                                    <tr key={fIdx} className="border-b border-slate-100 hover:bg-slate-50">
                                      <td className="p-2 font-bold text-blue-600">{field.name}</td>
                                      <td className="p-2 text-slate-500">{field.type}</td>
                                      <td className="p-2 text-slate-800">{field.comment}</td>
                                      <td className="p-2">
                                        {field.desensitized ? (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                            脱敏 (Hash)
                                          </span>
                                        ) : (
                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            明文/可统计
                                          </span>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 【问数】 Display Block: Interactive Recharts Visualization */}
                      {result?.chart && (
                        <div>
                          <CustomChart chart={result.chart} />
                          {/* Pin Chart Action */}
                          <div className="flex items-center justify-end space-x-2 text-xs mt-1">
                            <button
                              onClick={() =>
                                onPinChart({
                                  id: `chart-${msg.id}`,
                                  title: result.chart!.title,
                                  chart: result.chart!,
                                  summary: result.summary,
                                  timestamp: msg.timestamp
                                })
                              }
                              className={`px-2.5 py-1 rounded-md border flex items-center space-x-1 transition shadow-2xs ${
                                pinnedChartIds.includes(`chart-${msg.id}`)
                                  ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                              }`}
                            >
                              <Pin className="w-3 h-3" />
                              <span>
                                {pinnedChartIds.includes(`chart-${msg.id}`) ? '已钉选至右侧看板' : '钉选到看板'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Data Table Preview */}
                      {result?.tablePreview && (
                        <div className="bg-white border border-slate-200 rounded-xl p-3 my-2 space-y-2 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                              <TableIcon className="w-3.5 h-3.5 text-blue-600" />
                              透视汇总数据集 Preview
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              共 {result.tablePreview.rows.length} 行记录
                            </span>
                          </div>

                          <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-56 custom-scrollbar">
                            <table className="w-full text-left text-xs text-slate-700 font-mono">
                              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                  {result.tablePreview.columns.map((col, cIdx) => (
                                    <th key={cIdx} className="p-2 whitespace-nowrap">
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {result.tablePreview.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50">
                                    {row.map((cell, cellIdx) => (
                                      <td key={cellIdx} className="p-2 whitespace-nowrap">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SQL Block Inspector Button */}
                      {result?.sql && (
                        <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs shadow-2xs">
                          <div className="flex items-center space-x-2 truncate font-mono text-slate-600">
                            <Code2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{result.sql.replace(/\n/g, ' ')}</span>
                          </div>

                          <button
                            onClick={() => onInspectSql(result.sql!, result.datasetInfo)}
                            className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 text-blue-600 rounded text-xs flex items-center gap-1 shrink-0 ml-2 transition font-medium"
                          >
                            <span>在右栏分析SQL</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* Policy & Decision Suggestions */}
                      {result?.policySuggestions && result.policySuggestions.length > 0 && (
                        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 space-y-1.5 text-xs text-blue-900">
                          <div className="font-semibold flex items-center gap-1.5 text-blue-800">
                            <Lightbulb className="w-4 h-4 text-amber-500" />
                            政务/安全数据洞察与专家建议:
                          </div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {result.policySuggestions.map((sug, sIdx) => (
                              <li key={sIdx}>{sug}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Official Owner Manual / Source Citation Documents Block (依据文档内容) */}
                      {result?.citationDocs && result.citationDocs.length > 0 && (
                        <div className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-md">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-red-400" />
                              <span className="font-bold text-white text-xs">依据官方文档内容 (Source Document Grounding)</span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80 font-mono">
                              匹配度 99.4% · 官方可追溯
                            </span>
                          </div>

                          <div className="space-y-2.5">
                            {result.citationDocs.map((doc, dIdx) => (
                              <div key={dIdx} className="bg-slate-800/90 border border-slate-700/80 rounded-lg p-3 text-xs space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="font-semibold text-red-300 flex items-center gap-1.5">
                                    <BookmarkCheck className="w-3.5 h-3.5 text-red-400" />
                                    <span>{doc.title}</span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                                    {doc.page} · {doc.version || '2026.4 CN'}
                                  </span>
                                </div>

                                <div className="text-[11px] text-slate-300 font-mono flex items-center gap-2">
                                  <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded border border-slate-700 font-bold">
                                    {doc.section}
                                  </span>
                                  {doc.warningLevel === 'danger' && (
                                    <span className="bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      🔴 极度危险/禁止操作
                                    </span>
                                  )}
                                  {doc.warningLevel === 'warning' && (
                                    <span className="bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                      🟡 安全提示警告
                                    </span>
                                  )}
                                </div>

                                <div className="bg-slate-950/90 border border-slate-800 rounded p-2.5 text-[11px] leading-relaxed text-slate-200 font-mono relative pl-3 border-l-2 border-l-red-500">
                                  <div className="text-[10px] text-slate-400 font-sans mb-1 font-semibold flex items-center gap-1">
                                    <span>[依据手册原文摘录 Citation Snippet]:</span>
                                  </div>
                                  <p className="whitespace-pre-wrap">{doc.excerpt}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Smart Follow-up Recommendation Chips */}
                      {result?.followUpPrompts && result.followUpPrompts.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 space-y-1.5">
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                            <Sparkles className="w-3 h-3 text-blue-600" />
                            智能推荐下一轮问数与探索方向:
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {result.followUpPrompts.map((prompt, pIdx) => (
                              <button
                                key={pIdx}
                                onClick={() => handleQuickPromptClick(prompt)}
                                className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-300 rounded-full text-xs transition text-left shadow-2xs"
                              >
                                ↳ {prompt}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* 5-Second Simulated AI Thinking Process Card */}
        {isLoading && <ThinkingProgressCard />}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
          {/* Quick Filter Tags */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-[11px] text-slate-500 py-0.5 custom-scrollbar">
            <span className="text-slate-400 font-medium shrink-0">快捷入口:</span>

            {/* @ Mention Scene Quick Button */}
            <button
              type="button"
              onClick={() => setShowMentionDropdown(prev => !prev)}
              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-blue-700 font-bold whitespace-nowrap shrink-0 transition flex items-center gap-1"
            >
              <span>@切换AI助手场景</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickPromptClick('Model Y 在断电或紧急情况下，前排和后排车门如何进行机械解锁逃生？')}
              className="px-2 py-0.5 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded text-red-800 font-semibold whitespace-nowrap shrink-0 transition"
            >
              🚗 Model Y 车门无电紧急解锁
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick('前往超级充电站时电池预热有什么作用？冬季低温天气下如何优化续航衰减？')}
              className="px-2 py-0.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded text-amber-800 font-semibold whitespace-nowrap shrink-0 transition"
            >
              ⚡ 超充电池预热与冬季续航
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick('审查《智慧城市三期建设项目合同》中的付款条款与违约责任风险')}
              className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded text-blue-800 font-semibold whitespace-nowrap shrink-0 transition"
            >
              📜 审查项目合同预付款与违约风险
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick('找数：查找全市60岁以上老人及高龄津贴发放相关的库表和字段')}
              className="px-2 py-0.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 rounded text-amber-800 whitespace-nowrap shrink-0 transition"
            >
              🔍 找老龄库表
            </button>
            <button
              type="button"
              onClick={() => handleQuickPromptClick('问数：统计近5年全市各区60岁以上老年人口数量变化趋势及高龄津贴总额')}
              className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded text-blue-800 whitespace-nowrap shrink-0 transition"
            >
              📊 5年老龄人口趋势
            </button>
          </div>

          {/* Input text field bar */}
          <div className="relative flex items-center bg-slate-50 rounded-2xl border border-slate-200/90 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 p-2 transition shadow-xs">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
              title="语音输入"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition"
              title="上传/关联外部政务表数据"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="输入政务指令或键入 @ 选择场景助手（如‘@项目合同审批知识助手 审查预付款风险’）..."
              className="flex-1 bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-normal"
            />

            {/* Mention Dropdown Menu in Chat Area */}
            {showMentionDropdown && (
              <div className="absolute left-2 bottom-full mb-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden p-1 space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded">
                  选择企业级场景助手 (@)
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('项目合同审批知识助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-amber-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-amber-700 truncate">📜 项目合同审批知识助手</span>
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded border border-amber-200 shrink-0">知识型</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('智慧人口数据助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-blue-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-blue-700 truncate">👥 智慧人口数据助手</span>
                  <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded border border-blue-200 shrink-0">数据型</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('政务经济运行数据助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-indigo-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-indigo-700 truncate">📈 政务经济运行数据助手</span>
                  <span className="text-[10px] text-indigo-600 bg-indigo-50 px-1 rounded border border-indigo-200 shrink-0">数据型</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('政务公文与政策解读知识助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-emerald-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-emerald-700 truncate">📑 政务公文与政策解读助手</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-200 shrink-0">知识型</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('招商引资与产业画像助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-purple-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-purple-700 truncate">🏢 招商引资与产业画像助手</span>
                  <span className="text-[10px] text-purple-600 bg-purple-50 px-1 rounded border border-purple-200 shrink-0">数据型</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectMentionScene('财政预算与绩效评估助手')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 rounded-lg text-xs font-semibold text-slate-800 flex items-center justify-between group"
                >
                  <span className="group-hover:text-rose-700 truncate">💰 财政预算与绩效评估助手</span>
                  <span className="text-[10px] text-rose-600 bg-rose-50 px-1 rounded border border-rose-200 shrink-0">知识型</span>
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition shadow-xs"
            >
              <span>发送</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};
