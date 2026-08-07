import React from 'react';
import {
  PlusCircle,
  Play,
  Database,
  Search,
  CheckCircle2,
  ListFilter,
  Users,
  HeartHandshake,
  Baby,
  Briefcase,
  History,
  FileCode2,
  ChevronRight
} from 'lucide-react';
import { PRESET_7_TURNS, POPULATION_CATALOG } from '../data/presetConversations';
import { DatasetCatalogItem } from '../types';

interface Props {
  currentTurn: number;
  activeDatasetId: string | null;
  onSelectTurn: (turnIndex: number) => void;
  onSelectDataset: (item: DatasetCatalogItem) => void;
  onNewChat: () => void;
  onSearchQuery: (query: string) => void;
}

export const LeftSidebar: React.FC<Props> = ({
  currentTurn,
  activeDatasetId,
  onSelectTurn,
  onSelectDataset,
  onNewChat,
  onSearchQuery
}) => {
  const [searchFilter, setSearchFilter] = React.useState('');

  const filteredCatalog = POPULATION_CATALOG.filter(
    item =>
      item.name.includes(searchFilter) ||
      item.category.includes(searchFilter) ||
      item.dept.includes(searchFilter)
  );

  const getDatasetIcon = (category: string) => {
    switch (category) {
      case '民政专题':
        return <HeartHandshake className="w-4 h-4 text-amber-400" />;
      case '流调专题':
        return <Users className="w-4 h-4 text-emerald-400" />;
      case '卫健专题':
        return <Baby className="w-4 h-4 text-pink-400" />;
      case '人社专题':
        return <Briefcase className="w-4 h-4 text-cyan-400" />;
      default:
        return <Database className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Action */}
      <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
        <button
          onClick={onNewChat}
          className="w-full py-2 px-3 rounded-md bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 text-xs font-medium flex items-center justify-center space-x-2 transition-colors shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-blue-600" />
          <span>+ 新建找数问数任务</span>
        </button>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="搜索人口资产、表名或指标..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5 custom-scrollbar bg-white">
        {/* Section 1: Predefined 7-Turn Demonstration Sequence */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-blue-600" />
              演示剧本任务
            </span>
            <span className="text-[10px] text-slate-400 font-mono">7 步场景</span>
          </div>

          <div className="space-y-1.5">
            {PRESET_7_TURNS.map(turn => {
              const isActive = currentTurn === turn.turnIndex;
              const isPast = currentTurn >= turn.turnIndex;
              const isZhao = turn.category === '找数';

              return (
                <div
                  key={turn.turnIndex}
                  onClick={() => onSelectTurn(turn.turnIndex)}
                  className={`group p-2.5 rounded-md border text-xs cursor-pointer transition-all flex items-start space-x-2.5 ${
                    isActive
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm font-medium'
                      : isPast
                      ? 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-emerald-600'}`} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                        {turn.turnIndex}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-xs truncate text-slate-900">
                        第{turn.turnIndex}轮 · {turn.title.split('：')[1] || turn.title}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-medium shrink-0 ml-1 ${
                          isZhao
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {turn.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate group-hover:text-slate-700">
                      {turn.userPrompt}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Core Population Data Assets Catalog */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              政务人口库资产 (6大专题)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{filteredCatalog.length} 表</span>
          </div>

          <div className="space-y-1.5">
            {filteredCatalog.map(item => {
              const isSelected = activeDatasetId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectDataset(item)}
                  className={`p-2 rounded-md border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm font-medium'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-medium truncate">
                      {getDatasetIcon(item.category)}
                      <span className="truncate text-slate-800">{item.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{item.id}</span>
                    <span className="text-slate-500">{(item.count / 10000).toFixed(1)}万条</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Preset Query Shortcuts */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1 flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
            政务常用问数场景
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              onClick={() => onSearchQuery('分析近一年全市流动人口的主要来源省份Top 10及行业分布特征')}
              className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded text-[11px] text-slate-600 transition truncate shadow-xs"
            >
              🔹 流动人口来源地与行业分布
            </button>
            <button
              onClick={() => onSearchQuery('统计近5年全市各区60岁以上老年人口数量变化趋势及高龄津贴总额')}
              className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded text-[11px] text-slate-600 transition truncate shadow-xs"
            >
              🔹 60岁+老龄人口及津贴支出趋势
            </button>
            <button
              onClick={() => onSearchQuery('分析当前全市常住人口的年龄结构分布与受教育程度交叉对比')}
              className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded text-[11px] text-slate-600 transition truncate shadow-xs"
            >
              🔹 年龄结构与学历高低交叉分析
            </button>
            <button
              onClick={() => onSearchQuery('评估全市各区老龄化程度与养老设施床位匹配度')}
              className="text-left px-2.5 py-1.5 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded text-[11px] text-slate-600 transition truncate shadow-xs"
            >
              🔹 各区老龄化与养老床位匹配度
            </button>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
          <span>政务共享平台</span>
        </div>
        <span className="font-mono text-emerald-600 font-medium">● 联通中</span>
      </div>
    </aside>
  );
};
