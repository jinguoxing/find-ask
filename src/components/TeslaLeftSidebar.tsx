import React from 'react';
import {
  Car,
  Play,
  BookOpen,
  Search,
  CheckCircle2,
  ShieldAlert,
  Zap,
  Key,
  Shield,
  Gauge,
  HelpCircle,
  Sparkles,
  ChevronRight,
  FileText
} from 'lucide-react';
import { TESLA_MANUAL_5_TURNS } from '../data/presetConversations';

interface Props {
  currentTurn: number;
  onSelectTeslaTurn: (turnIndex: number) => void;
  onNewChat: () => void;
  onSearchQuery: (query: string) => void;
}

export const TESLA_CHAPTERS = [
  { id: 'SEC-4', code: 'Sec 4.12', title: '车门锁与无电机械解锁拉手', icon: Key, color: 'text-red-500' },
  { id: 'SEC-7', code: 'Sec 7.02', title: 'Autopilot 与驾驶员视线监控', icon: Zap, color: 'text-amber-500' },
  { id: 'SEC-9', code: 'Sec 9.05', title: '高压电池与超级充电预热', icon: Gauge, color: 'text-emerald-500' },
  { id: 'SEC-11', code: 'Sec 11.03', title: '哨兵模式与 U 盘格式化', icon: Shield, color: 'text-blue-500' },
  { id: 'SEC-13', code: 'Sec 13.08', title: 'TPMS 胎压校准与拖车运输模式', icon: ShieldAlert, color: 'text-rose-500' },
];

export const TeslaLeftSidebar: React.FC<Props> = ({
  currentTurn,
  onSelectTeslaTurn,
  onNewChat,
  onSearchQuery
}) => {
  const [filterText, setFilterText] = React.useState('');

  const filteredChapters = TESLA_CHAPTERS.filter(ch =>
    ch.title.includes(filterText) || ch.code.includes(filterText)
  );

  return (
    <aside className="w-68 bg-slate-900 border-r border-slate-800 text-slate-200 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Branding Banner */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/80 space-y-2.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shrink-0 shadow-md">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-bold text-xs text-white">Tesla Owner's Manual</h2>
              <span className="text-[9px] bg-red-950 text-red-300 border border-red-800 px-1 py-0.2 rounded font-mono font-semibold">
                v2026.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400">官方手册智能问答 · 依据可考</p>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="w-full py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-red-400" />
          <span>+ 新建特斯拉手册问答</span>
        </button>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="搜索手册章节、紧急拉索、TPMS..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar bg-slate-900">
        {/* Section 1: 5-Turn Tesla Manual Demo Script */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            <span className="flex items-center gap-1.5 text-red-400">
              <Play className="w-3.5 h-3.5 fill-current text-red-500" />
              5轮典型车主手册问答
            </span>
            <span className="text-[10px] text-slate-500 font-mono">5 步场景</span>
          </div>

          <div className="space-y-1.5">
            {TESLA_MANUAL_5_TURNS.map(turn => {
              const isActive = currentTurn === turn.turnIndex;
              const isPast = currentTurn >= turn.turnIndex;

              return (
                <div
                  key={turn.turnIndex}
                  onClick={() => onSelectTeslaTurn(turn.turnIndex)}
                  className={`group p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    isActive
                      ? 'bg-red-950/60 border-red-500/60 text-white shadow-md font-medium'
                      : isPast
                      ? 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-emerald-400'}`} />
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

        {/* Section 2: Core Tesla Owner Manual Chapters */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
            <span className="flex items-center gap-1.5 text-slate-300">
              <BookOpen className="w-3.5 h-3.5 text-red-400" />
              官方手册重点章节 (v2026.4)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{filteredChapters.length} 节</span>
          </div>

          <div className="space-y-1.5">
            {filteredChapters.map(ch => {
              const IconComponent = ch.icon;
              return (
                <div
                  key={ch.id}
                  onClick={() => onSearchQuery(`查看 ${ch.title} 的官方手册原文条款与操作要求`)}
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
                    <span className="bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                      {ch.code}
                    </span>
                    <span>检索依据可查</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: High Frequency Owner Scenarios */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            车主高频应急场景
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onSearchQuery('Model Y 在断电或紧急情况下，前排和后排车门如何进行机械解锁逃生？')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-red-950/40 hover:text-red-300 border border-slate-800 hover:border-red-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🚗 Model Y 后排门槽拉索位置
            </button>
            <button
              onClick={() => onSearchQuery('前往超级充电站时电池预热有什么作用？冬季低温天气下如何优化续航衰减？')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-amber-950/40 hover:text-amber-300 border border-slate-800 hover:border-amber-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              ⚡ 超级充电预热与冬季续航
            </button>
            <button
              onClick={() => onSearchQuery('哨兵模式和行车记录仪如何配置 U 盘存储？如果提示 U 盘速度过慢或未格式化怎么处理？')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-blue-950/40 hover:text-blue-300 border border-slate-800 hover:border-blue-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🛡️ 哨兵模式 U盘格式化与低电量
            </button>
            <button
              onClick={() => onSearchQuery('仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车，如何正确开启‘运输模式’？')}
              className="text-left px-2.5 py-1.5 bg-slate-800/40 hover:bg-rose-950/40 hover:text-rose-300 border border-slate-800 hover:border-rose-800 rounded-lg text-[11px] text-slate-300 transition truncate"
            >
              🛞 TPMS 胎压校准与拖车模式
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-red-400" />
          <span>Tesla Manual Engine</span>
        </div>
        <span className="font-mono text-emerald-400 font-medium text-[10px]">● 官方校验通畅</span>
      </div>
    </aside>
  );
};
