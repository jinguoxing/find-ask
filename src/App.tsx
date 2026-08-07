import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { ChatArea } from './components/ChatArea';
import { RightSidebar } from './components/RightSidebar';
import { DatasetPreviewModal } from './components/DatasetPreviewModal';
import { AIWorkbenchPage, ASSISTANT_LIST, AssistantItem } from './components/AIWorkbenchPage';
import { PRESET_7_TURNS, POPULATION_CATALOG } from './data/presetConversations';
import { ChatMessage, DatasetInfo, DatasetCatalogItem, PinnedChart, MessageResult } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'workbench' | 'execution'>('workbench');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTurn, setCurrentTurn] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Active AI Assistant State (default: Contract Knowledge Assistant)
  const [activeAssistant, setActiveAssistant] = useState<AssistantItem>(ASSISTANT_LIST[0]);

  const [activeDataset, setActiveDataset] = useState<DatasetInfo | DatasetCatalogItem | null>(POPULATION_CATALOG[1]);
  const [activeSql, setActiveSql] = useState<string>(
    `SELECT district_name, COUNT(person_id) FROM t_pop_elderly_services WHERE age >= 60 GROUP BY district_name;`
  );
  const [pinnedCharts, setPinnedCharts] = useState<PinnedChart[]>([]);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [previewModalTableName, setPreviewModalTableName] = useState<string | null>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with First Demo Turn on mount
  useEffect(() => {
    playTurn(1, false);
  }, []);

  // Cleanup timers
  useEffect(() => {
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, []);

  const playTurn = (turnIndex: number, continueAutoPlay: boolean = false) => {
    const turnData = PRESET_7_TURNS.find(t => t.turnIndex === turnIndex);
    if (!turnData) {
      setIsAutoPlaying(false);
      return;
    }

    setIsLoading(true);
    setCurrentTurn(turnIndex);

    // Create user message
    const userMsg: ChatMessage = {
      id: `msg-user-${turnIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: 'user',
      content: turnData.userPrompt,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      turnIndex
    };

    if (turnIndex === 1) {
      setMessages([userMsg]);
    } else {
      setMessages(prev => [...prev.filter(m => (m.turnIndex || 0) < turnIndex), userMsg]);
    }

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-assistant-${turnIndex}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: 'assistant',
        content: turnData.assistantResult.summary,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        turnIndex,
        result: turnData.assistantResult
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);

      if (turnData.assistantResult.datasetInfo) {
        setActiveDataset(turnData.assistantResult.datasetInfo);
      }
      if (turnData.assistantResult.sql) {
        setActiveSql(turnData.assistantResult.sql);
      }

      if (turnData.assistantResult.chart && turnIndex >= 4) {
        const newPinned: PinnedChart = {
          id: `chart-demo-${turnIndex}`,
          title: turnData.assistantResult.chart.title,
          chart: turnData.assistantResult.chart,
          summary: turnData.assistantResult.summary,
          timestamp: assistantMsg.timestamp
        };

        setPinnedCharts(prev => {
          if (prev.some(p => p.id === newPinned.id)) return prev;
          return [...prev, newPinned];
        });
      }

      if (continueAutoPlay && turnIndex < PRESET_7_TURNS.length) {
        autoPlayTimerRef.current = setTimeout(() => {
          playTurn(turnIndex + 1, true);
        }, 3000);
      } else {
        setIsAutoPlaying(false);
      }
    }, 5000);
  };

  const handleStartFullDemo = () => {
    if (isAutoPlaying) return;
    setActiveAssistant(ASSISTANT_LIST[1]); // Switch to population assistant for 7-turn demo
    setCurrentView('execution'); // Switch to execution page
    setIsAutoPlaying(true);
    playTurn(1, true);
  };

  const handleSelectTurn = (turnIndex: number) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setActiveAssistant(ASSISTANT_LIST[1]);
    setCurrentView('execution');
    playTurn(turnIndex, false);
  };

  const handleReset = () => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setMessages([]);
    setCurrentTurn(0);
    setActiveDataset(POPULATION_CATALOG[0]);
    setPinnedCharts([]);
  };

  const handleSelectAssistant = (assistant: AssistantItem) => {
    setActiveAssistant(assistant);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);

    // Switch to execution page and trigger initial scenario query
    setCurrentView('execution');

    if (assistant.id === 'contract-knowledge') {
      handleSendMessage('审查《智慧城市三期建设项目合同》中的付款条款与违约责任风险', assistant.id);
    } else if (assistant.id === 'economic-data') {
      handleSendMessage('分析本季度全市规模以上工业增加值及同比增速', assistant.id);
    } else if (assistant.id === 'policy-knowledge') {
      handleSendMessage('解读最新出台的《优化营商环境条例》重点扶持条款', assistant.id);
    } else if (assistant.id === 'investment-analysis') {
      handleSendMessage('检索全市集成电路产业链上下游补链企业名录与营收规模', assistant.id);
    } else if (assistant.id === 'budget-performance') {
      handleSendMessage('分析本年度信息化专项资金预决算偏差与执行风险', assistant.id);
    } else {
      // Population assistant
      handleReset();
    }
  };

  const handleSendMessage = async (text: string, overrideAssistantId?: string) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setCurrentView('execution'); // Auto jump to execution page

    // Smart Scene Assistant Routing
    let targetAssistant = activeAssistant;
    if (overrideAssistantId) {
      const found = ASSISTANT_LIST.find(a => a.id === overrideAssistantId);
      if (found) targetAssistant = found;
    } else {
      const lower = text.toLowerCase();
      if (lower.includes('合同') || lower.includes('审批') || lower.includes('条款') || lower.includes('合规') || lower.includes('采购') || lower.includes('违约') || lower.includes('风险')) {
        targetAssistant = ASSISTANT_LIST[0]; // Contract
      } else if (lower.includes('人口') || lower.includes('老龄') || lower.includes('高龄') || lower.includes('津贴')) {
        targetAssistant = ASSISTANT_LIST[1]; // Population
      } else if (lower.includes('经济') || lower.includes('gdp') || lower.includes('规上') || lower.includes('工业')) {
        targetAssistant = ASSISTANT_LIST[2]; // Economic
      } else if (lower.includes('政策') || lower.includes('公文') || lower.includes('营商环境')) {
        targetAssistant = ASSISTANT_LIST[3]; // Policy
      } else if (lower.includes('招商') || lower.includes('强链') || lower.includes('企业画像')) {
        targetAssistant = ASSISTANT_LIST[4]; // Investment
      } else if (lower.includes('预算') || lower.includes('财政') || lower.includes('绩效') || lower.includes('审计')) {
        targetAssistant = ASSISTANT_LIST[5]; // Budget
      }
    }

    if (targetAssistant.id !== activeAssistant.id) {
      setActiveAssistant(targetAssistant);
    }

    const userMsg: ChatMessage = {
      id: `custom-user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, history: messages.map(m => ({ role: m.role, content: m.content })) })
      });

      const data = await response.json();
      setIsLoading(false);

      if (data.success && data.result) {
        const result: MessageResult = data.result;
        const assistantMsg: ChatMessage = {
          id: `custom-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role: 'assistant',
          content: result.summary,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          result
        };

        setMessages(prev => [...prev, assistantMsg]);

        if (result.datasetInfo) {
          setActiveDataset(result.datasetInfo);
        }
        if (result.sql) {
          setActiveSql(result.sql);
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsLoading(false);
    }
  };

  const handleSelectDataset = (catalogItem: DatasetCatalogItem) => {
    setActiveDataset(catalogItem);
    setActiveSql(`SELECT * FROM ${catalogItem.id} LIMIT 100;`);
    setCurrentView('execution');
  };

  const handleInspectSql = (sql: string, dataset?: DatasetInfo) => {
    setActiveSql(sql);
    if (dataset) {
      setActiveDataset(dataset);
    }
    setRightSidebarOpen(true);
    setCurrentView('execution');
  };

  const handlePinChart = (pinnedChart: PinnedChart) => {
    setPinnedCharts(prev => {
      const exists = prev.some(p => p.id === pinnedChart.id);
      if (exists) {
        return prev.filter(p => p.id !== pinnedChart.id);
      }
      return [...prev, pinnedChart];
    });
  };

  const handleRemovePinnedChart = (id: string) => {
    setPinnedCharts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation Header */}
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        currentTurn={currentTurn}
        totalTurns={PRESET_7_TURNS.length}
        isAutoPlaying={isAutoPlaying}
        onStartDemo={handleStartFullDemo}
        onReset={handleReset}
        rightSidebarOpen={rightSidebarOpen}
        onToggleRightSidebar={() => setRightSidebarOpen(prev => !prev)}
        activeAssistant={activeAssistant}
      />

      {/* Dynamic View Container */}
      {currentView === 'workbench' ? (
        /* Google AI Studio / Apps Style Full-Page AI Workbench Hub */
        <AIWorkbenchPage
          activeAssistantId={activeAssistant.id}
          onSelectAssistant={handleSelectAssistant}
          onSubmitQuery={(prompt, targetId) => handleSendMessage(prompt, targetId)}
          onNavigateToExecution={() => setCurrentView('execution')}
        />
      ) : (
        /* Full 3-Column Execution Analysis Workspace */
        <div className="flex flex-1 overflow-hidden relative">
          {/* Left Column: Taskbar & Data Catalog */}
          <LeftSidebar
            currentTurn={currentTurn}
            activeDatasetId={
              activeDataset
                ? 'tableName' in activeDataset
                  ? activeDataset.tableName
                  : activeDataset.id
                : null
            }
            onSelectTurn={handleSelectTurn}
            onSelectDataset={handleSelectDataset}
            onNewChat={handleReset}
            onSearchQuery={handleSendMessage}
          />

          {/* Middle Column: Chat & Visual Dialog Area */}
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            currentTurn={currentTurn}
            totalTurns={PRESET_7_TURNS.length}
            isAutoPlaying={isAutoPlaying}
            onSendMessage={handleSendMessage}
            onSelectTurn={handleSelectTurn}
            onInspectSql={handleInspectSql}
            onPinChart={handlePinChart}
            onOpenDatasetModal={tableName => setPreviewModalTableName(tableName)}
            pinnedChartIds={pinnedCharts.map(p => p.id)}
          />

          {/* Right Column: Dataset Inspector / Lineage / SQL / Dashboard */}
          {rightSidebarOpen && (
            <RightSidebar
              activeDataset={activeDataset}
              activeSql={activeSql}
              pinnedCharts={pinnedCharts}
              onRemovePinnedChart={handleRemovePinnedChart}
              onOpenPreviewModal={tableName => setPreviewModalTableName(tableName)}
            />
          )}
        </div>
      )}

      {/* Dataset Desensitized Sample Modal */}
      {previewModalTableName && (
        <DatasetPreviewModal
          tableName={previewModalTableName}
          onClose={() => setPreviewModalTableName(null)}
        />
      )}
    </div>
  );
}


