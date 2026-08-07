import React, { useState } from 'react';
import {
  Database,
  GitBranch,
  Code2,
  LayoutDashboard,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  Copy,
  Check,
  Zap,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
  Trash2
} from 'lucide-react';
import { DatasetInfo, PinnedChart, DatasetCatalogItem } from '../types';
import { CustomChart } from './Charts/CustomChart';

interface Props {
  activeDataset: DatasetInfo | DatasetCatalogItem | null;
  activeSql: string;
  pinnedCharts: PinnedChart[];
  onRemovePinnedChart: (id: string) => void;
  onOpenPreviewModal: (tableName: string) => void;
}

export const RightSidebar: React.FC<Props> = ({
  activeDataset,
  activeSql,
  pinnedCharts,
  onRemovePinnedChart,
  onOpenPreviewModal
}) => {
  const [activeTab, setActiveTab] = useState<'asset' | 'lineage' | 'sql' | 'dashboard'>('asset');
  const [copiedSql, setCopiedSql] = useState(false);

  const handleCopySql = () => {
    if (!activeSql) return;
    navigator.clipboard.writeText(activeSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <aside className="w-80 bg-slate-50 border-l border-slate-200 text-slate-800 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Right Sidebar Tab Bar */}
      <div className="flex items-center border-b border-slate-200 bg-slate-100 p-1 text-xs">
        <button
          onClick={() => setActiveTab('asset')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition flex items-center justify-center gap-1 ${
            activeTab === 'asset'
              ? 'bg-white text-blue-600 font-semibold shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="表元数据与字段明细"
        >
          <Database className="w-3.5 h-3.5" />
          <span>表资产</span>
        </button>

        <button
          onClick={() => setActiveTab('lineage')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition flex items-center justify-center gap-1 ${
            activeTab === 'lineage'
              ? 'bg-white text-blue-600 font-semibold shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="数据血缘与安全脱敏"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>血缘</span>
        </button>

        <button
          onClick={() => setActiveTab('sql')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition flex items-center justify-center gap-1 ${
            activeTab === 'sql'
              ? 'bg-white text-blue-600 font-semibold shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="生成的底层 SQL 语句与算子"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>SQL</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-1.5 text-center font-medium rounded-md transition flex items-center justify-center gap-1 relative ${
            activeTab === 'dashboard'
              ? 'bg-white text-blue-600 font-semibold shadow-xs border border-slate-200'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          title="钉选的大屏图表看板"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>看板</span>
          {pinnedCharts.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-mono ml-0.5">
              {pinnedCharts.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-4 bg-slate-50">
        {/* Tab 1: Data Asset Details */}
        {activeTab === 'asset' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5" />
                  当前查询关联表
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  {('tableName' in (activeDataset || {}) ? (activeDataset as DatasetInfo).tableName : (activeDataset as DatasetCatalogItem)?.id) || 't_pop_elderly_services'}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {('tableComment' in (activeDataset || {}) ? (activeDataset as DatasetInfo).tableComment : (activeDataset as DatasetCatalogItem)?.name) || '老龄人口及高龄津贴服务综合表'}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {('description' in (activeDataset || {}) ? (activeDataset as DatasetCatalogItem).description : '纳管全市60岁以上常住老人户籍、居住地、高龄津贴标准与发放状态信息。')}
              </p>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">归属部门: </span>
                  <span className="text-slate-800 font-medium">{('department' in (activeDataset || {}) ? (activeDataset as DatasetInfo).department : (activeDataset as DatasetCatalogItem)?.dept) || '市民政局'}</span>
                </div>
                <div>
                  <span className="text-slate-400">数据量: </span>
                  <span className="text-slate-800 font-mono font-medium">1,428,000 条</span>
                </div>
                <div>
                  <span className="text-slate-400">更新粒度: </span>
                  <span className="text-slate-800">24小时同步</span>
                </div>
                <div>
                  <span className="text-slate-400">安全防护: </span>
                  <span className="text-emerald-700 font-medium">Ⅲ级哈希脱敏</span>
                </div>
              </div>

              <button
                onClick={() =>
                  onOpenPreviewModal(
                    ('tableName' in (activeDataset || {})
                      ? (activeDataset as DatasetInfo).tableName
                      : (activeDataset as DatasetCatalogItem)?.id) || 't_pop_elderly_services'
                  )
                }
                className="w-full mt-2 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>预览10条脱敏真实样例数据</span>
              </button>
            </div>

            {/* Quick API Export Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs shadow-2xs">
              <div className="font-semibold text-slate-800 flex items-center justify-between">
                <span>开放数据接口 (API)</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono">RESTful JSON</span>
              </div>
              <div className="p-2 bg-slate-50 border border-slate-200 rounded font-mono text-[11px] text-slate-700 truncate">
                GET /api/v1/population/query?table=t_pop_elderly_services
              </div>
              <div className="text-[11px] text-slate-500">
                支持跨委办局审批后调用，已自动集成 JWT Token 签名认证。
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Lineage & Security */}
        {activeTab === 'lineage' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5" />
                  人口数据跨部门流转血缘图
                </span>
                <span className="text-[10px] text-slate-400 font-mono">4 级节点溯源</span>
              </div>

              {/* Node graph flow */}
              <div className="space-y-2 text-xs font-mono">
                {/* Node 1 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div>
                      <div className="font-semibold text-slate-800">源头系统: 市公安局户籍中心</div>
                      <div className="text-[10px] text-slate-500">协议: 数据库 CDC 增量日志</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">L1</span>
                </div>

                <div className="text-center text-slate-400">↓</div>

                {/* Node 2 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                    <div>
                      <div className="font-semibold text-slate-800">汇聚节点: 数据集中治理平台</div>
                      <div className="text-[10px] text-slate-500">清洗、去重、地址打标</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">L2</span>
                </div>

                <div className="text-center text-slate-400">↓</div>

                {/* Node 3 */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div>
                      <div className="font-semibold text-slate-800">主题引擎: 人口专题主题库</div>
                      <div className="text-[10px] text-slate-500">动态哈希脱敏 + 分级访问</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">L3</span>
                </div>

                <div className="text-center text-slate-400">↓</div>

                {/* Node 4 */}
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                    <div>
                      <div className="font-semibold text-blue-900">应用端: AI智能找数问数</div>
                      <div className="text-[10px] text-blue-700">SQL 自动适配 & 图表生成</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-blue-700 font-bold">L4</span>
                </div>
              </div>
            </div>

            {/* Security Audit Badge Box */}
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 text-xs shadow-2xs">
              <div className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>数据安全脱敏合规声明</span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                本页面涉及的所有身份证号码均采用 SHA-256 加盐哈希值存储；姓名采用掩码处理；精准居住地址已泛化脱敏至街道/网格级别，严格符合《数据安全法》与政务数据共享规范。
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: SQL Inspector */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  大模型自动生成的 SQL 指令
                </span>

                <button
                  onClick={handleCopySql}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-700 flex items-center gap-1 transition"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? '已复制' : '复制SQL'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed custom-scrollbar max-h-64 shadow-inner">
                {activeSql ||
                  `SELECT 
  district_name,
  COUNT(person_id) AS total_elderly,
  SUM(subsidy_amount) AS total_subsidy
FROM t_pop_elderly_services
WHERE age >= 60
GROUP BY district_name;`}
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <div>查询耗时: <span className="font-mono text-slate-800">24 ms</span></div>
                <div>扫描行数: <span className="font-mono text-slate-800">1,428,000 行</span></div>
                <div>目标引擎: <span className="text-slate-800">PostgreSQL / Hive</span></div>
                <div>缓存状态: <span className="text-emerald-600 font-medium">Hit (已缓存)</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Dashboard Pinboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
                政务决策看板图表库 ({pinnedCharts.length})
              </span>

              {pinnedCharts.length > 0 && (
                <button
                  onClick={() => alert('已自动生成《2026年政务人口综合分析简报.docx》并准备下载！')}
                  className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] flex items-center gap-1 font-medium transition shadow-xs"
                >
                  <Download className="w-3 h-3" />
                  <span>导出简报</span>
                </button>
              )}
            </div>

            {pinnedCharts.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400 space-y-2 shadow-2xs">
                <LayoutDashboard className="w-8 h-8 text-slate-300 mx-auto" />
                <p>暂无钉选的图表。</p>
                <p className="text-[11px] text-slate-400">在问数对话中点击图表下方的“钉选到看板”，即可将多维度分析图表集中固定在此处。</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pinnedCharts.map(item => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-2.5 relative group shadow-2xs">
                    <button
                      onClick={() => onRemovePinnedChart(item.id)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-slate-100 rounded transition opacity-60 group-hover:opacity-100 z-10"
                      title="从看板移除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <CustomChart chart={item.chart} />

                    <div className="text-[11px] text-slate-600 mt-1 px-1 line-clamp-2">
                      {item.summary}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
