import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { TeslaLeftSidebar } from './components/TeslaLeftSidebar';
import { ChatArea } from './components/ChatArea';
import { RightSidebar } from './components/RightSidebar';
import { TeslaRightSidebar } from './components/TeslaRightSidebar';
import { DatasetPreviewModal } from './components/DatasetPreviewModal';
import { AIWorkbenchPage, ASSISTANT_LIST, AssistantItem } from './components/AIWorkbenchPage';
import { PRESET_7_TURNS, TESLA_MANUAL_5_TURNS, POPULATION_CATALOG } from './data/presetConversations';
import { ChatMessage, DatasetInfo, DatasetCatalogItem, PinnedChart, MessageResult } from './types';

const formatTimestamp = (): string => {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const generateFallbackResult = (text: string): MessageResult => {
  const lower = text.toLowerCase();
  
  if (lower.includes('特斯拉') || lower.includes('tesla') || lower.includes('model y') || lower.includes('model 3') || lower.includes('车门') || lower.includes('机械解锁') || lower.includes('拉手') || lower.includes('autopilot') || lower.includes('超充') || lower.includes('预热') || lower.includes('哨兵') || lower.includes('胎压') || lower.includes('tpms') || lower.includes('拖车') || lower.includes('运输模式') || lower.includes('车主手册')) {
    if (lower.includes('车门') || lower.includes('解锁') || lower.includes('断电') || lower.includes('逃生') || lower.includes('救援')) {
      return TESLA_MANUAL_5_TURNS[0].assistantResult;
    } else if (lower.includes('autopilot') || lower.includes('fsd') || lower.includes('摄像头') || lower.includes('辅助驾驶')) {
      return TESLA_MANUAL_5_TURNS[1].assistantResult;
    } else if (lower.includes('预热') || lower.includes('超充') || lower.includes('电池') || lower.includes('冬季') || lower.includes('续航')) {
      return TESLA_MANUAL_5_TURNS[2].assistantResult;
    } else if (lower.includes('哨兵') || lower.includes('u盘') || lower.includes('格式化') || lower.includes('记录仪') || lower.includes('低电量')) {
      return TESLA_MANUAL_5_TURNS[3].assistantResult;
    } else if (lower.includes('胎压') || lower.includes('tpms') || lower.includes('拖车') || lower.includes('运输模式')) {
      return TESLA_MANUAL_5_TURNS[4].assistantResult;
    }
    return TESLA_MANUAL_5_TURNS[0].assistantResult;
  }

  if (lower.includes('合同') || lower.includes('审批') || lower.includes('条款') || lower.includes('合规') || lower.includes('采购') || lower.includes('违约') || lower.includes('风险')) {
    return {
      intent: '问数',
      thoughtProcess: '1. 识别知识库检索任务: 《项目合同合规审查与风险判定》。\n2. 挂载司法局与财政局政务采购知识库 (Ref: GW-2026-CONTRACT-088)。\n3. 执行合同条款向量匹配与法规算法比对。',
      summary: '【项目合同审查意见书】已完成对《智慧城市三期建设项目合同》的智能合规审查。审查发现 1 项高风险条款与 2 项中风险预警，整体合规率为 88.5%。建议在补充修改条款后再提交项目批复与财政拨款。',
      kpiCards: [
        { title: '审查条款总数', value: '48', unit: '条', trend: '100%覆盖', trendType: 'neutral' },
        { title: '合规通过率', value: '88.5', unit: '%', trend: '需修正3项', trendType: 'up' },
        { title: '高风险预警', value: '1', unit: '项', trend: '付款比例过高', trendType: 'down' }
      ],
      policySuggestions: [
        '建议降低预付款比例至 30% 以下，并增加违约金上限条款。'
      ],
      followUpPrompts: [
        '查看合同审查依据的法规目录',
        '生成合同修改文本对照表'
      ]
    };
  }

  return {
    intent: '问数',
    thoughtProcess: '1. 接收自然语言指令，智能解析政务/数据库语义。\n2. 匹配知识库与全景基础数据库，生成结构化响应。',
    summary: `已智能分析您的查询请求：「${text}」。已为您匹配对应知识库与数据库资产，提供全方位的精准解答与可视化分析。`,
    kpiCards: [
      { title: '数据融合率', value: '98.7', unit: '%', trend: '+1.2%', trendType: 'up' },
      { title: '检索时延', value: '0.12', unit: 's', trend: '极速响应', trendType: 'up' }
    ],
    followUpPrompts: [
      '继续深入分析该场景的细节数据',
      '导出完整分析报告与可视化图表'
    ]
  };
};

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

  const playTurn = (turnIndex: number, continueAutoPlay: boolean = false, targetAssistantId?: string) => {
    const isTesla = (targetAssistantId || activeAssistant.id) === 'tesla-manual';
    const turnsArray = isTesla ? TESLA_MANUAL_5_TURNS : PRESET_7_TURNS;
    const turnData = turnsArray.find(t => t.turnIndex === turnIndex);
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
      timestamp: formatTimestamp(),
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
        timestamp: formatTimestamp(),
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

      if (continueAutoPlay && turnIndex < turnsArray.length) {
        autoPlayTimerRef.current = setTimeout(() => {
          playTurn(turnIndex + 1, true, targetAssistantId || activeAssistant.id);
        }, 3000);
      } else {
        setIsAutoPlaying(false);
      }
    }, 1500);
  };

  const handleStartFullDemo = () => {
    if (isAutoPlaying) return;
    if (activeAssistant.id === 'tesla-manual') {
      setCurrentView('execution');
      setIsAutoPlaying(true);
      playTurn(1, true, 'tesla-manual');
    } else {
      setActiveAssistant(ASSISTANT_LIST[1]); // Switch to population assistant for 7-turn demo
      setCurrentView('execution'); // Switch to execution page
      setIsAutoPlaying(true);
      playTurn(1, true, ASSISTANT_LIST[1].id);
    }
  };

  const handleSelectTurn = (turnIndex: number) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    setActiveAssistant(ASSISTANT_LIST[1]);
    setCurrentView('execution');
    playTurn(turnIndex, false, ASSISTANT_LIST[1].id);
  };

  const handleSelectTeslaTurn = (turnIndex: number) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setIsAutoPlaying(false);
    const teslaAssistant = ASSISTANT_LIST.find(a => a.id === 'tesla-manual') || ASSISTANT_LIST[0];
    setActiveAssistant(teslaAssistant);
    setCurrentView('execution');
    playTurn(turnIndex, false, 'tesla-manual');
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
    } else if (assistant.id === 'tesla-manual') {
      handleSendMessage('Model Y 在断电或紧急情况下，前排和后排车门如何进行机械解锁逃生？', assistant.id);
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
      if (lower.includes('特斯拉') || lower.includes('tesla') || lower.includes('model y') || lower.includes('model 3') || lower.includes('车门') || lower.includes('机械解锁') || lower.includes('拉手') || lower.includes('autopilot') || lower.includes('超充') || lower.includes('电池预热') || lower.includes('哨兵') || lower.includes('胎压') || lower.includes('tpms') || lower.includes('拖车') || lower.includes('运输模式') || lower.includes('车主手册')) {
        targetAssistant = ASSISTANT_LIST.find(a => a.id === 'tesla-manual') || ASSISTANT_LIST[0];
      } else if (lower.includes('合同') || lower.includes('审批') || lower.includes('条款') || lower.includes('合规') || lower.includes('采购') || lower.includes('违约') || lower.includes('风险')) {
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
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let result: MessageResult | null = null;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, history: messages.map(m => ({ role: m.role, content: m.content })) })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.result) {
          result = data.result;
        }
      }
    } catch (e) {
      console.warn('API route call fallback:', e);
    }

    if (!result) {
      result = generateFallbackResult(text);
    }

    setIsLoading(false);

    const assistantMsg: ChatMessage = {
      id: `custom-assistant-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: 'assistant',
      content: result.summary,
      timestamp: formatTimestamp(),
      result
    };

    setMessages(prev => [...prev, assistantMsg]);

    if (result.datasetInfo) {
      setActiveDataset(result.datasetInfo);
    }
    if (result.sql) {
      setActiveSql(result.sql);
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

  const isTeslaMode = activeAssistant.id === 'tesla-manual';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Top Navigation Header */}
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        currentTurn={currentTurn}
        totalTurns={isTeslaMode ? TESLA_MANUAL_5_TURNS.length : PRESET_7_TURNS.length}
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
      ) : isTeslaMode ? (
        /* Standalone Tesla Owner's Manual Execution Workspace */
        <div className="flex flex-1 overflow-hidden relative bg-slate-950">
          {/* Left Column: Tesla Manual Chapters & 5-Turn Demo */}
          <TeslaLeftSidebar
            currentTurn={currentTurn}
            onSelectTeslaTurn={handleSelectTeslaTurn}
            onNewChat={handleReset}
            onSearchQuery={handleSendMessage}
          />

          {/* Middle Column: Tesla Interactive Chat Area */}
          <ChatArea
            messages={messages}
            isLoading={isLoading}
            currentTurn={currentTurn}
            totalTurns={TESLA_MANUAL_5_TURNS.length}
            isAutoPlaying={isAutoPlaying}
            onSendMessage={handleSendMessage}
            onSelectTurn={handleSelectTeslaTurn}
            onInspectSql={handleInspectSql}
            onPinChart={handlePinChart}
            onOpenDatasetModal={tableName => setPreviewModalTableName(tableName)}
            pinnedChartIds={pinnedCharts.map(p => p.id)}
          />

          {/* Right Column: Tesla Grounding Citation & Tech Specs Inspector */}
          {rightSidebarOpen && (
            <TeslaRightSidebar
              activeCitations={
                messages.length > 0 && messages[messages.length - 1].result?.citationDocs
                  ? messages[messages.length - 1].result?.citationDocs
                  : undefined
              }
              onSearchTopic={handleSendMessage}
            />
          )}
        </div>
      ) : (
        /* Standard Government/Enterprise Data Execution Workspace */
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


