import React, { useState } from 'react';
import {
  Layers,
  Play,
  BookOpen,
  Search,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
  FileSpreadsheet,
  Database,
  Sparkles,
  ChevronRight,
  Workflow,
  HelpCircle,
  FileCheck2,
  Code2
} from 'lucide-react';
import { GOV_SEMANTIC_5_TURNS } from '../data/presetConversations';

interface Props {
  currentTurn: number;
  onSelectGovSemanticTurn: (turnIndex: number) => void;
  onNewChat: () => void;
  onSearchQuery: (query: string) => void;
}

export const GOV_SEMANTIC_CHAPTERS = [
  { id: 'SEC-1', code: 'ISO/IEC 11179', title: '指标口径歧义治理与定义对齐', icon: Layers, color: 'text-teal-400' },
  { id: 'SEC-2', code: 'GB/T 38667', title: '跨部门“同名异义”语义映射表', icon: GitBranch, color: 'text-cyan-400' },
  { id: 'SEC-3', code: 'Lineage v4.2', title: '字段级数据血缘与流转拓扑', icon: Workflow, color: 'text-indigo-400' },
  { id: 'SEC-4', code: 'GB 11643 / MOD11', title: '身份标识合规诊断与 SM4 脱敏', icon: ShieldCheck, color: 'text-emerald-400' },
  { id: 'SEC-5', code: 'API OpenSpec', title: '政务统一指标字典与 API 导出', icon: FileSpreadsheet, color: 'text-amber-400' },
];

export const GovSemanticLeftSidebar: React.FC<Props> = ({
  currentTurn,
  onSelectGovSemanticTurn,
  onNewChat,
  onSearchQuery
}) => {
  const [filterText, setFilterText] = useState('');

  const filteredChapters = GOV_SEMANTIC_CHAPTERS.filter(ch =>
    ch.title.includes(filterText) || ch.code.includes(filterText)
  );

  return (
    <aside className="w-68 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Branding Banner */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-xs text-white">政务语义治理 Agent</h2>
              <span className="text-[9px] bg-teal-950 text-teal-300 border border-teal-800 px-1 py-0.2 rounded font-mono font-semibold">
                v2026.1
              </span>
            </div>
            <p className="text-[11px] text-slate-400">数据中台 · 语义标准与指标字典</p>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full py-1.5 px-3 rounded-lg bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>+ 新建语义治理会话</span>
        </button>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="搜索语义标准、同名异义、血缘..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar bg-slate-900">
        {/* Section 1: 5-Turn Gov Semantic Demo Script */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            <span className="flex items-center gap-1.5 text-teal-400">
              <Play className="w-3.5 h-3.5 fill-current text-teal-400" />
              5轮语义治理流程
            </span>
            <span className="text-[10px] text-slate-500 font-mono">5 步场景</span>
          </div>

          <div className="space-y-1.5">
            {GOV_SEMANTIC_5_TURNS.map(turn => {
              const isActive = currentTurn === turn.turnIndex;
              const isPast = currentTurn >= turn.turnIndex;

              return (
                <div
                  key={turn.turnIndex}
                  onClick={() => onSelectGovSemanticTurn(turn.turnIndex)}
                  className={`group p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    isActive
                      ? 'bg-teal-950/60 border-teal-500/60 text-white shadow-md font-medium'
                      : isPast
                      ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-emerald-400'}`} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        {turn.turnIndex}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs truncate text-slate-100">
                        {turn.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate group-hover:text-slate-300">
                      {turn.userPrompt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Core Semantic Governance Modules */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              语义治理规范模块
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{filteredChapters.length} 规约</span>
          </div>

          <div className="space-y-1.5">
            {filteredChapters.map(ch => {
              const IconComponent = ch.icon;
              return (
                <div
                  key={ch.id}
                  onClick={() => onSearchQuery(`查看 ${ch.title} 的国家标准规范与元数据对齐规则`)}
                  className="p-2 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-xs cursor-pointer transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-medium truncate">
                      <IconComponent className={`w-3.5 h-3.5 ${ch.color} shrink-0`} />
                      <span className="truncate text-slate-200">{ch.title}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span className="bg-slate-900 text-teal-300 px-1.5 py-0.2 rounded border border-slate-800">
                      {ch.code}
                    </span>
                    <span>可穿透溯源</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: High Frequency Governance Scenarios */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            政务高频语义治理指令
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onSearchQuery('治理“高龄津贴申请人数”与“高龄补贴发放人数”的统计口径冲突，梳理业务定义差异与统一指标口径。')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-teal-950/40 hover:text-teal-300 border border-slate-800 hover:border-teal-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              📐 高龄津贴“申请 vs 发放”口径消除
            </button>
            <button
              onClick={() => onSearchQuery('建立民政“困难群众”与医保“低保救助人员”的跨部门数据语义映射表，消除部门间“异名同义/同名异义”问题。')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-cyan-950/40 hover:text-cyan-300 border border-slate-800 hover:border-cyan-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🔗 民政/医保低保困难人群语义对齐
            </button>
            <button
              onClick={() => onSearchQuery('分析数仓表 dws_pop_elderly_allowance_di 从源系统到指标层的字段级语义血缘链路与数据质量校验规则。')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-indigo-950/40 hover:text-indigo-300 border border-slate-800 hover:border-indigo-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🌳 字段级语义血缘与数据探针
            </button>
            <button
              onClick={() => onSearchQuery('诊断校验政务库表中的身份证号、统一社会信用代码合规性，并检查国密 SM4 动态脱敏加密规范。')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-emerald-950/40 hover:text-emerald-300 border border-slate-800 hover:border-emerald-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🛡️ 身份证/统一信用码 MOD11 诊断
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <Code2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Semantic Governance Engine</span>
        </div>
        <span className="font-mono text-emerald-400 font-medium text-[10px]">● ISO 11179 认证</span>
      </div>
    </aside>
  );
};
