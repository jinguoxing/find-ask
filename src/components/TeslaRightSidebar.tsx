import React, { useState } from 'react';
import {
  BookOpen,
  BookmarkCheck,
  Zap,
  Gauge,
  AlertTriangle,
  Info,
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  FileText,
  Sliders
} from 'lucide-react';
import { CitationDoc } from '../types';

interface Props {
  activeCitations?: CitationDoc[];
  onSearchTopic?: (topic: string) => void;
}

export const TeslaRightSidebar: React.FC<Props> = ({
  activeCitations,
  onSearchTopic
}) => {
  const [activeTab, setActiveTab] = useState<'citation' | 'specs' | 'index'>('citation');
  const [searchFilter, setSearchFilter] = useState('');

  const defaultCitation: CitationDoc = {
    docId: 'DOC-TESLA-MY-4.12',
    title: '特斯拉 Model Y 车主手册 - 车门与解锁机构',
    section: 'Section 4.12 - 无电状态下的车门机械打开',
    page: 'P.142-143',
    excerpt: '如果 Model Y 失去 16V/12V 低压电源，请按以下步骤手动打开车门：前排车门：向上拉动位于车窗开关前面的手动车门释放装置。后排车门： Model Y 的后车门配有手动车门释放装置，位于后车门储物槽底部。抬起储物槽底部的垫片，移除橡胶盖，然后向车尾方向拉动紧急释放拉索即可解脱门锁。',
    relevanceScore: 99.4,
    warningLevel: 'warning',
    version: '2026.4 CN v2 Edition'
  };

  const citationsToRender = (activeCitations && activeCitations.length > 0) ? activeCitations : [defaultCitation];

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 text-slate-200 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Header Tabs */}
      <div className="p-2.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs w-full">
          <button
            onClick={() => setActiveTab('citation')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'citation'
                ? 'bg-red-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>依据文档</span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'specs'
                ? 'bg-red-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>技术指标</span>
          </button>

          <button
            onClick={() => setActiveTab('index')}
            className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold transition flex items-center justify-center gap-1 ${
              activeTab === 'index'
                ? 'bg-red-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>目录检索</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4 custom-scrollbar">
        {activeTab === 'citation' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookmarkCheck className="w-4 h-4 text-red-400" />
                当前问答出处依据 (Manual Citations)
              </span>
              <span className="text-[10px] text-red-300 bg-red-950 px-2 py-0.5 rounded border border-red-800/80 font-mono">
                向量比对 99.4%
              </span>
            </div>

            {citationsToRender.map((doc, idx) => (
              <div key={idx} className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs text-red-300 leading-snug">{doc.title}</h4>
                    <span className="text-[10px] text-amber-300 font-mono block">
                      {doc.section}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700 shrink-0">
                    {doc.page}
                  </span>
                </div>

                {doc.warningLevel === 'danger' && (
                  <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-2 rounded-lg text-[11px] flex items-center gap-1.5 font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>⚠️ 官方极度危险警告：操作可能导致硬件损毁或失效！</span>
                  </div>
                )}

                {doc.warningLevel === 'warning' && (
                  <div className="bg-amber-950/80 border border-amber-800 text-amber-200 p-2 rounded-lg text-[11px] flex items-center gap-1.5 font-semibold">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>安全注意事项：非紧急状态下切勿随意拉动。</span>
                  </div>
                )}

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] text-slate-200 font-mono leading-relaxed relative pl-3 border-l-2 border-l-red-500">
                  <div className="text-[10px] text-slate-400 font-sans mb-1 font-semibold flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-red-400" />
                    <span>[手册原文逐字句引用]:</span>
                  </div>
                  <p className="whitespace-pre-wrap">{doc.excerpt}</p>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>手册版本: {doc.version || 'v2026.4 CN'}</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    官方认证依据
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                Model Y / 3 核心技术参数卡片
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">冷胎推荐气压</span>
                <span className="text-base font-bold text-amber-300 font-mono">2.9 bar</span>
                <span className="text-[10px] text-slate-500 block">42 psi 冷态测量</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">低压辅助供电</span>
                <span className="text-base font-bold text-emerald-300 font-mono">16V / 12V</span>
                <span className="text-[10px] text-slate-500 block">锂离子低压电池</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">V3/V4超充峰值</span>
                <span className="text-base font-bold text-red-400 font-mono">250 kW</span>
                <span className="text-[10px] text-slate-500 block">预热后 15min 满功</span>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-400 block">哨兵电量保护关停</span>
                <span className="text-base font-bold text-rose-400 font-mono">20%</span>
                <span className="text-[10px] text-slate-500 block">低电量防放电机制</span>
              </div>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 space-y-2">
              <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                电池热管理与冬季保温策略
              </h5>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
                <li>前往超级充电站必须使用车机地图导航激活提前预热。</li>
                <li>磷酸铁锂电池版本建议每周满充至 100% 以校准 BMS。</li>
                <li>使用 Tesla App 设定‘按时出发’利用市电预热座舱。</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'index' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="搜索全本 1850+ 节点条款..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            <div className="space-y-2">
              {[
                { title: 'Section 4 - 车门与锁闭机构', code: '14 条子目', query: 'Model Y 车门无电紧急解锁' },
                { title: 'Section 7 - Autopilot 辅助驾驶与视角', code: '28 条子目', query: 'Autopilot 摄像头与监视' },
                { title: 'Section 9 - 高压电池与超级充电', code: '19 条子目', query: '电池超级充电预热' },
                { title: 'Section 11 - 安全防盗与哨兵模式', code: '12 条子目', query: '哨兵模式 U盘配置' },
                { title: 'Section 13 - 轮胎、TPMS 与道路救援', code: '22 条子目', query: 'TPMS 胎压与拖车模式' },
              ].map((sec, i) => (
                <div
                  key={i}
                  onClick={() => onSearchTopic && onSearchTopic(sec.query)}
                  className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 p-2.5 rounded-xl text-xs cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <h5 className="font-semibold text-slate-200">{sec.title}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{sec.code}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Badge */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-red-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Tesla AI Owner Grounding
        </span>
        <span className="text-[10px] font-mono text-slate-500">Official v2026.4</span>
      </div>
    </aside>
  );
};
