import React, { useState } from 'react';
import {
  BookmarkCheck,
  GitBranch,
  ShieldCheck,
  Sliders,
  Search,
  ChevronRight,
  Sparkles,
  FileText,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Workflow
} from 'lucide-react';
import { CitationDoc } from '../types';

interface Props {
  activeCitations?: CitationDoc[];
  onSearchTopic?: (topic: string) => void;
}

export const GovSemanticRightSidebar: React.FC<Props> = ({
  activeCitations,
  onSearchTopic
}) => {
  const [activeTab, setActiveTab] = useState<'standard' | 'lineage' | 'quality'>('standard');
  const [searchFilter, setSearchFilter] = useState('');

  const defaultCitation: CitationDoc = {
    docId: 'STD-GOV-META-2026-001',
    title: '国家政务数据资源目录与元数据编制指南 (GB/T 38667)',
    section: 'Section 5.3 - 跨部门通用指标语义冲突治理与命名规范',
    page: 'P.45-48',
    excerpt: '跨部门数据指标命名应采用“主体+业务过程+度量词”的统一结构。凡涉及“申请”、“核准”、“拨付”、“实发”不同业务环节的指标，禁止直接使用简短模糊名称，须在指标定义中明确业务统计时点与算子规则。',
    relevanceScore: 99.8,
    warningLevel: 'info',
    version: 'GB/T 38667-2026'
  };

  const citationsToRender = (activeCitations && activeCitations.length > 0) ? activeCitations : [defaultCitation];

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 text-slate-200 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Header Tabs */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs w-full">
          <button
            onClick={() => setActiveTab('standard')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'standard'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>依据标准</span>
          </button>

          <button
            onClick={() => setActiveTab('lineage')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'lineage'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>数据血缘</span>
          </button>

          <button
            onClick={() => setActiveTab('quality')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'quality'
                ? 'bg-teal-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>质量诊断</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        {activeTab === 'standard' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-teal-400" />
                语义治理引用标准 (Semantic Citation)
              </span>
              <span className="text-[10px] text-teal-300 bg-teal-950 px-2 py-0.5 rounded border border-teal-800/80 font-mono">
                GB/T 38667
              </span>
            </div>

            {citationsToRender.map((doc, idx) => (
              <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-teal-300 leading-snug">{doc.title}</h4>
                    <span className="text-[10px] text-amber-300 font-mono block">
                      {doc.section}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                    {doc.page}
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-200 font-mono leading-relaxed relative pl-3 border-l-2 border-l-teal-500">
                  <div className="text-[10px] text-slate-400 font-sans mb-1 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-teal-400" />
                    <span>[标准规范原文]:</span>
                  </div>
                  <p className="whitespace-pre-wrap">{doc.excerpt}</p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>版本: {doc.version || 'GB/T 38667-2026'}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    国家政务元数据认证
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'lineage' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Workflow className="w-4 h-4 text-indigo-400" />
                字段级数据血缘拓扑 (Lineage Graph)
              </span>
            </div>

            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-3">
              <h5 className="font-bold text-xs text-teal-300">dws_pop_elderly_allowance_di 核心链路</h5>
              
              <div className="space-y-2 text-[11px]">
                {/* Step 1: ODS */}
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded border border-blue-800">1. ODS 贴源层</span>
                    <span>市民政局 / 公安局</span>
                  </div>
                  <div className="font-mono text-white font-semibold">t_mz_gljt_apply.citizen_id</div>
                  <div className="text-[10px] text-slate-400">公民身份证原始字段（明文格式）</div>
                </div>

                <div className="text-center text-teal-400 text-xs">↓ SHA256 脱敏 + 空格裁切</div>

                {/* Step 2: DWD */}
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="bg-indigo-950 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800">2. DWD 明细层</span>
                    <span>清洗过滤与脱敏</span>
                  </div>
                  <div className="font-mono text-white font-semibold">dwd_mz_apply_di.person_id_hash</div>
                  <div className="text-[10px] text-slate-400">HASH 加密全局唯一人口主键</div>
                </div>

                <div className="text-center text-indigo-400 text-xs">↓ 跨部门关联与算子聚合</div>

                {/* Step 3: DWS */}
                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="bg-teal-950 text-teal-300 px-1.5 py-0.2 rounded border border-teal-800">3. DWS 汇总层</span>
                    <span>政务统一数据标准</span>
                  </div>
                  <div className="font-mono text-white font-semibold">dws_pop_elderly_allowance_di</div>
                  <div className="text-[10px] text-slate-400">包含人均补贴、核准状态与打款标志</div>
                </div>

                <div className="text-center text-emerald-400 text-xs">↓ 统一 RESTful API 导出</div>

                {/* Step 4: ADS */}
                <div className="p-2.5 bg-slate-900 border border-emerald-800/80 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-800">4. ADS 应用层</span>
                    <span>全域治理看板 / API</span>
                  </div>
                  <div className="font-mono text-emerald-300 font-semibold">IND_POP_GLJT_01 (标准指标)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                数据质量诊断探针 (Quality Probes)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">空值非空率</span>
                <span className="text-base font-bold text-emerald-300 font-mono">99.98%</span>
                <span className="text-[10px] text-slate-500 block">探针运行中</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">主键唯一性断言</span>
                <span className="text-base font-bold text-teal-300 font-mono">100% PASS</span>
                <span className="text-[10px] text-slate-500 block">无重复人口记录</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">国密 SM4 脱敏</span>
                <span className="text-base font-bold text-blue-400 font-mono">100% 生效</span>
                <span className="text-[10px] text-slate-500 block">动态掩码防御</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">MOD11/31 校验</span>
                <span className="text-base font-bold text-amber-300 font-mono">99.99%</span>
                <span className="text-[10px] text-slate-500 block">纠偏 12 条畸变项</span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 space-y-2">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                实时质量诊断告警策略
              </h5>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li>当来源表空值率高于 0.1% 时触发即时 SMS 与钉钉告警。</li>
                <li>每日定时核查“应发人次”与“打款人次”的对账一致性。</li>
                <li>数据清洗日志全面接入 Hash 区块链审计存证。</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer Badge */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-teal-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Gov Semantic Governance Engine
        </span>
        <span className="text-[10px] font-mono text-slate-500">Official v2026.1</span>
      </div>
    </aside>
  );
};
