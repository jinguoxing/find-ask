import React, { useState } from 'react';
import {
  Sparkles,
  Database,
  FileText,
  Search,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Building2,
  FileCheck2,
  Zap,
  Tag,
  MessageSquare,
  Bot,
  Compass,
  LayoutGrid,
  TrendingUp,
  FileCode,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Lock,
  Clock,
  Cpu,
  Layers,
  Activity,
  Award,
  Filter,
  SlidersHorizontal,
  ExternalLink,
  PieChart,
  Coins,
  Briefcase
} from 'lucide-react';

export interface AssistantItem {
  id: string;
  name: string;
  type: 'data' | 'knowledge';
  category: string;
  dept: string;
  description: string;
  capabilities: string[];
  tags: string[];
  recommendedPrompts: string[];
  iconBg: string;
  iconColor: string;
  isPopular?: boolean;
  slaMetric?: string;
  securityLevel?: string;
}

export const ASSISTANT_LIST: AssistantItem[] = [
  {
    id: 'contract-knowledge',
    name: '项目合同审批知识助手',
    type: 'knowledge',
    category: '项目审批与合同合规审查',
    dept: '市司法局 / 财政局 / 机关事务局知识库',
    description: '深度对接政务采购与项目审批知识库，针对信息化项目、工程基建与服务采购合同提供一键条款审查、违约风险预警与预算合规校验。',
    capabilities: [
      '付款账期与预付款比例(≤30%)合规审查',
      '政府采购目录与财政拨款预算比对',
      '违约责任与陷阱条款智能标注及修改建议',
      '一键生成合同审批合规报告与意见书'
    ],
    tags: ['合同风险审查', '合规条款比对', '项目审批知识库', '财政预算核验'],
    recommendedPrompts: [
      '审查《智慧城市三期建设项目合同》中的付款条款与违约责任风险',
      '核对该合同预算明细与政府采购目录及财政拨款标准的合规性',
      '对《数字政务一网统管运维服务项目合同》执行一键合规预审'
    ],
    iconBg: 'bg-amber-50 border-amber-200',
    iconColor: 'text-amber-600',
    isPopular: true,
    slaMetric: '平均审查耗时 1.2s · 准确率 99.4%',
    securityLevel: '国密 SM4 加密 · 合规Ⅲ级'
  },
  {
    id: 'population-data',
    name: '智慧人口数据助手',
    type: 'data',
    category: '政务数据找数问数',
    dept: '市大数据中心 / 人口库专网',
    description: '穿透2185万常住人口库，支持自然语言SQL编译、年龄学历多维交叉下钻、自动脱敏与ECharts可视化图表渲染。',
    capabilities: [
      '自然语言转化为 ANSI SQL 深度聚合算子',
      '身份证与姓名动态 Hash 掩码与脱敏导出',
      '老龄化、流动人口、育儿津贴专题下钻',
      '分布式计算引擎 2.5 秒内高并发响应'
    ],
    tags: ['数据找数问数', '自然语言SQL', '2185万人口库', 'ECharts导出'],
    recommendedPrompts: [
      '统计近5年全市各区60岁以上老年人口数量变化趋势及高龄津贴总额',
      '查一下2024年各区高龄津贴领取人数和支出总额',
      '分析近一年全市流动人口的主要来源省份Top 10及行业分布'
    ],
    iconBg: 'bg-blue-50 border-blue-200',
    iconColor: 'text-blue-600',
    isPopular: true,
    slaMetric: '并发 500+ QPS · 2.1s 响应',
    securityLevel: 'Hash 掩码脱敏 · 等保三级'
  },
  {
    id: 'economic-data',
    name: '政务经济运行数据助手',
    type: 'data',
    category: '经济指标与规上企业透视',
    dept: '市发改委 / 统计局专网',
    description: '围绕全市 GDP 增速、固定资产投资、规上工业增加值与税收结构，提供多视角经济态势感知与决策研判。',
    capabilities: [
      '季度 GDP 与三大产业贡献率多维分析',
      '重点招商引资项目履约率与资金到位率',
      '规上企业经营指标与税收动态监测预警'
    ],
    tags: ['经济指标', '规上企业', '发改委专网'],
    recommendedPrompts: [
      '分析本季度全市规模以上工业增加值及同比增速',
      '对比各区固定资产投资完成进度与年度目标差额'
    ],
    iconBg: 'bg-indigo-50 border-indigo-200',
    iconColor: 'text-indigo-600',
    slaMetric: '实时指标更新 · 1.5s 响应',
    securityLevel: '发改委专网数据流'
  },
  {
    id: 'policy-knowledge',
    name: '政务公文与政策解读知识助手',
    type: 'knowledge',
    category: '政策法规与公文润色',
    dept: '市委办 / 市府办政策知识库',
    description: '依托全市政务政策法规知识库，提供公文格式规范核对、政策拟定条款比对、上级文件解读与决策参考摘要。',
    capabilities: [
      '标准红头公文格式排版与逻辑校验',
      '国家与省市政策文件交叉比对',
      '自动提炼政策要点与办事指南'
    ],
    tags: ['政策法规库', '公文排版润色', '决策参考'],
    recommendedPrompts: [
      '解读最新出台的《优化营商环境条例》重点扶持条款',
      '对这份拟发公文的文号格式与逻辑结构进行合规性校验'
    ],
    iconBg: 'bg-emerald-50 border-emerald-200',
    iconColor: 'text-emerald-600',
    slaMetric: '包含 14,200+ 篇政策条款',
    securityLevel: '市府办机要知识级别'
  },
  {
    id: 'investment-analysis',
    name: '招商引资与产业画像助手',
    type: 'data',
    category: '产业强链与企业画像',
    dept: '市投促局 / 工信局专网',
    description: '融合多源企业信用库与产业链全景图，针对重点招商企业开展风险画像、产业链缺口补链比对及优惠政策匹配。',
    capabilities: [
      '重点招商目标企业穿透股权与诉讼风险画像',
      '战略性新兴产业补链强链缺口精准匹配',
      '招商引资财税与用地扶持政策自动测算'
    ],
    tags: ['产业画像', '强链补链', '企业风险穿透'],
    recommendedPrompts: [
      '检索全市集成电路产业链上下游补链企业名录与营收规模',
      '评估拟招商引进企业的司法风险与实控人股权结构'
    ],
    iconBg: 'bg-purple-50 border-purple-200',
    iconColor: 'text-purple-600',
    slaMetric: '覆盖全市 38 万家规上/科技企业',
    securityLevel: '商业机密保护级'
  },
  {
    id: 'budget-performance',
    name: '财政预算与绩效评估助手',
    type: 'knowledge',
    category: '财政资金与绩效穿透',
    dept: '市财政局 / 审计局',
    description: '针对各部门年度预算执行率、专项资金使用合规性及“三公”经费支出，自动比对审计规章并生成绩效评价摘要。',
    capabilities: [
      '部门预算执行进度与预警指标实时比对',
      '专项转移支付资金使用违规风险排查',
      '一键生成年度财政绩效自评报告草案'
    ],
    tags: ['财政绩效', '审计合规', '三公经费监管'],
    recommendedPrompts: [
      '分析本年度信息化专项资金预决算偏差与执行风险',
      '比对机关事务局本季度公车运维与接待费支出趋势'
    ],
    iconBg: 'bg-rose-50 border-rose-200',
    iconColor: 'text-rose-600',
    slaMetric: '接入财政一体化平台',
    securityLevel: '财政资金机密级'
  }
];

interface Props {
  activeAssistantId: string;
  onSelectAssistant: (assistant: AssistantItem) => void;
  onSubmitQuery: (prompt: string, targetAssistantId?: string) => void;
  onNavigateToExecution: () => void;
}

export const AIWorkbenchPage: React.FC<Props> = ({
  activeAssistantId,
  onSelectAssistant,
  onSubmitQuery,
  onNavigateToExecution
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'data' | 'knowledge'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [workbenchInput, setWorkbenchInput] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [selectedMentionAssistant, setSelectedMentionAssistant] = useState<AssistantItem | null>(null);

  const filteredAssistants = ASSISTANT_LIST.filter(item => {
    const matchTab = activeTab === 'all' || item.type === activeTab;
    const matchDept = selectedDept === 'all' || item.dept.includes(selectedDept);
    const matchSearch =
      item.name.includes(searchQuery) ||
      item.description.includes(searchQuery) ||
      item.tags.some(t => t.includes(searchQuery)) ||
      item.dept.includes(searchQuery);
    return matchTab && matchDept && matchSearch;
  });

  // Smart Assistant Routing Helper
  const detectAssistantId = (text: string): string => {
    if (selectedMentionAssistant) return selectedMentionAssistant.id;
    const lower = text.toLowerCase();
    if (
      lower.includes('合同') ||
      lower.includes('审批') ||
      lower.includes('条款') ||
      lower.includes('合规') ||
      lower.includes('采购') ||
      lower.includes('违约') ||
      lower.includes('风险')
    ) {
      return 'contract-knowledge';
    }
    if (
      lower.includes('人口') ||
      lower.includes('老龄') ||
      lower.includes('高龄') ||
      lower.includes('津贴') ||
      lower.includes('流动人口')
    ) {
      return 'population-data';
    }
    if (
      lower.includes('经济') ||
      lower.includes('gdp') ||
      lower.includes('规上') ||
      lower.includes('投资') ||
      lower.includes('工业')
    ) {
      return 'economic-data';
    }
    if (
      lower.includes('政策') ||
      lower.includes('公文') ||
      lower.includes('营商环境') ||
      lower.includes('解读')
    ) {
      return 'policy-knowledge';
    }
    if (lower.includes('招商') || lower.includes('产业') || lower.includes('企业画像')) {
      return 'investment-analysis';
    }
    if (lower.includes('预算') || lower.includes('财政') || lower.includes('绩效') || lower.includes('审计')) {
      return 'budget-performance';
    }
    return activeAssistantId || 'contract-knowledge';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWorkbenchInput(val);

    if (val.endsWith('@') || (val.includes('@') && !val.includes(' '))) {
      setShowMentionMenu(true);
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectMention = (assistant: AssistantItem) => {
    setSelectedMentionAssistant(assistant);
    setWorkbenchInput(`[@${assistant.name}] `);
    setShowMentionMenu(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workbenchInput.trim()) return;

    const targetId = detectAssistantId(workbenchInput);
    const cleanedPrompt = workbenchInput.replace(/\[@.*?\]\s*/, '');
    onSubmitQuery(cleanedPrompt || workbenchInput, targetId);
  };

  return (
    <div className="flex-1 bg-slate-50 overflow-y-auto custom-scrollbar flex flex-col justify-between">
      <div>
        {/* Top Hero Section: Enterprise Header & Unified Smart Search */}
        <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900 text-white pt-8 pb-12 px-6 relative overflow-hidden border-b border-slate-800">
          {/* Subtle Ambient Lighting */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto space-y-6 relative z-10">
            {/* Enterprise Security Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-4">
              <div className="flex items-center space-x-3">
                <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-400/30 text-blue-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>国家政务专网双向加密</span>
                </span>
                <span className="flex items-center space-x-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>国密 SM4 算法防护生效</span>
                </span>
              </div>

              <div className="flex items-center space-x-4 text-slate-400 text-[11px] font-mono">
                <span>引擎状态: <strong className="text-emerald-400">NORMAL (99.99%)</strong></span>
                <span>平均响时: <strong className="text-blue-300">1.8s</strong></span>
                <span>审计存证: <strong className="text-amber-300">已开启 (Hash区块链)</strong></span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>企业与政务级 AI Agent 智能工作台 · 统一中枢</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                全域数据找数问数 & 合规知识协同中枢
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
                直接输入政务或企业指令，或键入 <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 font-mono font-bold">@</code> 调出专属场景助手（如合同审查、人口问数、经济指标分析），自动感知语义并精确定位。
              </p>
            </div>

            {/* Primary Enterprise Command Dialog Box */}
            <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-slate-200/90 hover:border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all flex items-center gap-2">
                <div className="pl-3 text-slate-400 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>

                <input
                  type="text"
                  value={workbenchInput}
                  onChange={handleInputChange}
                  placeholder="请输入您的政务指令或键入 @ 选择特定场景助手（如：@项目合同审批知识助手 审查预付款风险）..."
                  className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-normal"
                />

                <div className="hidden sm:flex items-center gap-1 pr-1 text-[10px] text-slate-400 font-mono">
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-500">K</kbd>
                </div>

                <button
                  type="submit"
                  disabled={!workbenchInput.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl flex items-center space-x-2 transition shadow-xs shrink-0 active:scale-95"
                >
                  <span>发送指令</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown Mention Suggestions */}
                {showMentionMenu && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden p-2.5 text-slate-800 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded-lg flex items-center justify-between">
                      <span>请选择企业级场景助手 (@)</span>
                      <span className="text-[10px] font-normal text-slate-400">按回车确认选择</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1.5">
                      {ASSISTANT_LIST.map(ast => (
                        <button
                          key={ast.id}
                          type="button"
                          onClick={() => handleSelectMention(ast)}
                          className="p-2.5 hover:bg-blue-50/80 rounded-xl flex items-start space-x-2.5 text-left transition group border border-transparent hover:border-blue-200"
                        >
                          <div
                            className={`w-8 h-8 rounded-lg ${ast.iconBg} border flex items-center justify-center shrink-0 mt-0.5`}
                          >
                            {ast.type === 'knowledge' ? (
                              <FileCheck2 className={`w-4 h-4 ${ast.iconColor}`} />
                            ) : (
                              <Database className={`w-4 h-4 ${ast.iconColor}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 flex items-center justify-between">
                              <span className="truncate">{ast.name}</span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 shrink-0">
                                {ast.type === 'knowledge' ? '知识型' : '数据型'}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {ast.category}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Chips */}
              <div className="flex items-center justify-center flex-wrap gap-2 mt-3 text-xs">
                <span className="text-slate-400 text-[11px] font-medium">高频推荐指令:</span>
                <button
                  type="button"
                  onClick={() => {
                    setWorkbenchInput('[@项目合同审批知识助手] 审查《智慧城市三期建设项目合同》中的付款条款与违约责任风险');
                    setSelectedMentionAssistant(ASSISTANT_LIST[0]);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-400/30 rounded-lg transition text-[11px] font-medium flex items-center gap-1"
                >
                  <FileCheck2 className="w-3 h-3 text-amber-400" />
                  <span>@合同审批审查预付款风险</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkbenchInput('[@智慧人口数据助手] 统计近5年全市各区60岁以上老年人口数量变化趋势及高龄津贴总额');
                    setSelectedMentionAssistant(ASSISTANT_LIST[1]);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-blue-200 border border-blue-400/30 rounded-lg transition text-[11px] font-medium flex items-center gap-1"
                >
                  <Database className="w-3 h-3 text-blue-400" />
                  <span>@人口找数问数5年老龄化趋势</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWorkbenchInput('[@政务经济运行数据助手] 分析本季度全市规模以上工业增加值及同比增速');
                    setSelectedMentionAssistant(ASSISTANT_LIST[2]);
                  }}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-indigo-200 border border-indigo-400/30 rounded-lg transition text-[11px] font-medium flex items-center gap-1"
                >
                  <TrendingUp className="w-3 h-3 text-indigo-400" />
                  <span>@经济运行规上工业GDP分析</span>
                </button>
              </div>
            </form>

            {/* Enterprise Key Metric Counters Card Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 backdrop-blur-xs flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white font-mono">2,850+</div>
                  <div className="text-[11px] text-slate-400">已接入政务库表</div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 backdrop-blur-xs flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white font-mono">14,200+</div>
                  <div className="text-[11px] text-slate-400">法规合规条款数</div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 backdrop-blur-xs flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white font-mono">&lt; 1.8s</div>
                  <div className="text-[11px] text-slate-400">平均智能审答耗时</div>
                </div>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 backdrop-blur-xs flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-white font-mono">100%</div>
                  <div className="text-[11px] text-slate-400">安全脱敏合规率</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Assistants Grid Section */}
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
          {/* Filtering and Toolbar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-xl text-xs font-medium w-full lg:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                全部场景 ({ASSISTANT_LIST.length})
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'knowledge'
                    ? 'bg-white text-amber-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>知识审查型 (合同/公文/预算)</span>
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'data'
                    ? 'bg-white text-blue-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>数据问数型 (找数问数/产业)</span>
              </button>
            </div>

            {/* Department Dropdown & Search */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedDept}
                  onChange={e => setSelectedDept(e.target.value)}
                  className="bg-transparent focus:outline-none text-slate-800 font-medium cursor-pointer"
                >
                  <option value="all">全域部门知识库</option>
                  <option value="司法局">市司法局</option>
                  <option value="大数据中心">市大数据中心</option>
                  <option value="发改委">市发改委</option>
                  <option value="市委办">市委办/市府办</option>
                  <option value="投促局">市投促局</option>
                  <option value="财政局">市财政局</option>
                </select>
              </div>

              <div className="relative flex-1 lg:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="搜索场景名称、标签或知识库..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Grid Title & Direct Execution Jump */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">企业级 AI 业务场景矩阵</h2>
              <span className="text-xs text-slate-500 hidden sm:inline">
                (已加载国家政务专网 & 商用密码加密)
              </span>
            </div>

            <button
              onClick={onNavigateToExecution}
              className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition flex items-center space-x-1"
            >
              <span>前往全屏对话执行页</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Rich Enterprise Assistant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssistants.map(assistant => {
              const isActive = activeAssistantId === assistant.id;
              const isKnowledge = assistant.type === 'knowledge';

              return (
                <div
                  key={assistant.id}
                  onClick={() => onSelectAssistant(assistant)}
                  className={`group bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    isActive
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-xl'
                      : 'border-slate-200 hover:border-blue-400 hover:shadow-lg'
                  }`}
                >
                  {/* Popular / Recommended Badge */}
                  {assistant.isPopular && (
                    <div className="absolute top-4 right-4 flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shadow-2xs">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      <span>高频推荐</span>
                    </div>
                  )}

                  <div>
                    {/* Header: Icon, Name & Dept */}
                    <div className="flex items-start space-x-3.5 mb-3">
                      <div
                        className={`w-11 h-11 rounded-2xl ${assistant.iconBg} border flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}
                      >
                        {isKnowledge ? (
                          <FileCheck2 className={`w-5 h-5 ${assistant.iconColor}`} />
                        ) : (
                          <Database className={`w-5 h-5 ${assistant.iconColor}`} />
                        )}
                      </div>

                      <div className="pr-12">
                        <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition leading-snug">
                          {assistant.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{assistant.dept}</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mb-3.5">
                      {assistant.description}
                    </p>

                    {/* SLA & Security Metadata Badge Box */}
                    <div className="flex items-center justify-between text-[10px] bg-slate-50 p-2 rounded-xl border border-slate-100 mb-3 text-slate-500">
                      <span className="flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-600" />
                        <span>{assistant.slaMetric || '高并发 SLA 保障'}</span>
                      </span>
                      <span className="flex items-center gap-1 font-mono text-slate-600">
                        <Lock className="w-3 h-3 text-blue-600" />
                        <span>{assistant.securityLevel || '安全等级Ⅲ级'}</span>
                      </span>
                    </div>

                    {/* Core Capabilities */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        核心能力与技术规约:
                      </div>
                      {assistant.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="font-medium leading-tight">{cap}</span>
                        </div>
                      ))}
                    </div>

                    {/* Recommended Prompts Buttons */}
                    <div className="space-y-1.5 mb-4">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        点击一键提问:
                      </div>
                      {assistant.recommendedPrompts.slice(0, 2).map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            onSubmitQuery(p, assistant.id);
                          }}
                          className="w-full text-left p-2 rounded-lg bg-slate-100/70 hover:bg-blue-50 border border-slate-200/60 text-slate-700 hover:text-blue-700 text-[11px] transition flex items-center justify-between group/btn"
                        >
                          <span className="truncate pr-2">“{p}”</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover/btn:text-blue-600 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-1 overflow-hidden">
                      {assistant.tags.slice(0, 2).map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium truncate"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onSelectAssistant(assistant);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{isActive ? '当前使用中' : '进入执行页'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enterprise Platform Footer Assurance Banner */}
      <div className="bg-slate-900 text-slate-400 border-t border-slate-800 py-6 px-6 text-xs mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-slate-200 font-bold">政务与企业级 AI 智能一体化基础设施</div>
              <div className="text-[11px] text-slate-500">
                符合《信息安全技术 网络安全等级保护基本要求》等保三级与商用密码 SM2/SM4 规范
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>数据不出专网</span>
            </span>
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>智能路由 & 全过程存证</span>
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>分布式数据湖仓连接</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
