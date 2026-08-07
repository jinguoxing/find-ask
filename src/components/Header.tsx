import React from 'react';
import { Database, ShieldCheck, Cpu, Play, RotateCcw, PanelRightOpen, PanelRightClose, Sparkles, LayoutGrid, FileCheck2, MessageSquare } from 'lucide-react';
import { AssistantItem } from './AIWorkbenchPage';

interface Props {
  currentView: 'workbench' | 'execution';
  onChangeView: (view: 'workbench' | 'execution') => void;
  currentTurn: number;
  totalTurns: number;
  isAutoPlaying: boolean;
  onStartDemo: () => void;
  onReset: () => void;
  rightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  activeAssistant: AssistantItem;
}

export const Header: React.FC<Props> = ({
  currentView,
  onChangeView,
  currentTurn,
  totalTurns,
  isAutoPlaying,
  onStartDemo,
  onReset,
  rightSidebarOpen,
  onToggleRightSidebar,
  activeAssistant
}) => {
  const isKnowledge = activeAssistant.type === 'knowledge';

  return (
    <header className="h-14 bg-white border-b border-slate-200 text-slate-800 px-6 flex items-center justify-between shrink-0 z-20">
      {/* Left: Branding & Active Assistant Badge */}
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded ${isKnowledge ? 'bg-amber-600' : 'bg-blue-600'} flex items-center justify-center text-white shrink-0 shadow-sm transition-colors`}>
          {isKnowledge ? <FileCheck2 className="w-4 h-4 text-white" /> : <Database className="w-4 h-4 text-white" />}
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              {activeAssistant.name}
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${isKnowledge ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                {isKnowledge ? '知识型助手' : '数据型助手'}
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span>{activeAssistant.dept}</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-medium text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              政务专网鉴权通过
            </span>
          </p>
        </div>
      </div>

      {/* Middle Navigation Segment Switcher (AI Workbench vs Execution Page) */}
      <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
        <button
          onClick={() => onChangeView('workbench')}
          className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            currentView === 'workbench'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>AI 工作台</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-mono font-normal">入口页</span>
        </button>

        <button
          onClick={() => onChangeView('execution')}
          className={`px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition ${
            currentView === 'execution'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>对话执行分析页</span>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onStartDemo}
          disabled={isAutoPlaying}
          className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 transition-all shadow-sm ${
            isAutoPlaying
              ? 'bg-amber-50 text-amber-700 border border-amber-300 cursor-wait'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-95 font-semibold'
          }`}
          title="自动演示典型人口找数问数7轮对话流程"
        >
          {isAutoPlaying ? (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span>演示进行中 ({currentTurn}/{totalTurns})</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-blue-600" />
              <span>7轮人口演示</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="p-1.5 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md text-xs transition shadow-sm"
          title="重置对话"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {currentView === 'execution' && (
          <button
            onClick={onToggleRightSidebar}
            className={`p-1.5 rounded-md text-xs border transition shadow-sm ${
              rightSidebarOpen
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
            title={rightSidebarOpen ? '收起工作区右栏' : '展开工作区右栏'}
          >
            {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        )}
      </div>
    </header>
  );
};


