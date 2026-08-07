import React from 'react';
import { X, Database, ShieldCheck, Download, Table as TableIcon, Copy, Check } from 'lucide-react';

interface Props {
  tableName: string | null;
  onClose: () => void;
}

const SAMPLE_RECORDS: Record<string, { title: string; dept: string; columns: string[]; rows: string[][] }> = {
  t_pop_elderly_services: {
    title: "老龄人口及高龄津贴服务综合表",
    dept: "市民政局 / 老龄办",
    columns: ["人员ID(脱敏)", "年龄", "老龄分级", "月度津贴(元)", "所属区县", "所属街道", "发放状态"],
    rows: [
      ["P_881021_HX", "82", "80-89岁高龄", "300.00", "朝阳区", "奥运村街道", "已发放"],
      ["P_881022_QK", "71", "60-79岁普通老龄", "0.00", "海淀区", "中关村街道", "不适用"],
      ["P_881023_AL", "91", "90岁以上高龄", "500.00", "西城区", "金融街街道", "已发放"],
      ["P_881024_WX", "85", "80-89岁失能老人", "600.00", "丰台区", "方庄街道", "已发放"],
      ["P_881025_ZZ", "78", "60-79岁普通老龄", "0.00", "昌平区", "回龙观街道", "不适用"],
      ["P_881026_YJ", "88", "80-89岁高龄", "300.00", "东城区", "建国门街道", "已发放"],
      ["P_881027_LL", "80", "80-89岁高龄", "300.00", "石景山区", "八角街道", "核验中"]
    ]
  },
  t_pop_floating: {
    title: "流动人口与居留服务综合管理表",
    dept: "市流动人口网格办 / 市公安局",
    columns: ["流动人员ID", "来源省份", "居住原因", "从业行业", "居住月数", "居住区县", "居住证办结"],
    rows: [
      ["F_992010_BJ", "河北省", "务工经商", "信息传输与软件服务", "48", "海淀区", "已办理"],
      ["F_992011_HN", "河南省", "务工经商", "居民服务与家政", "24", "朝阳区", "已办理"],
      ["F_992012_SD", "山东省", "学习培训", "教育/在校学生", "18", "海淀区", "免办(学生)"],
      ["F_992013_AH", "安徽省", "务工经商", "建筑工程/施工", "36", "昌平区", "已办理"],
      ["F_992014_SC", "四川省", "随迁家属", "自由职业", "12", "丰台区", "办理中"]
    ]
  },
  t_pop_base_info: {
    title: "户籍与常住人口基础整合库",
    dept: "市公安局人口基地 / 市大数据中心",
    columns: ["人员ID(脱敏)", "性别", "出生年份", "户籍类型", "居住区县", "受教育程度", "更新时间"],
    rows: [
      ["B_100101_AA", "男", "1988年", "本市户籍", "海淀区", "大学本科", "2026-08-07 03:00"],
      ["B_100102_BB", "女", "1995年", "外省常住", "朝阳区", "硕士研究生", "2026-08-07 03:00"],
      ["B_100103_CC", "男", "1962年", "本市户籍", "西城区", "高中/中专", "2026-08-07 03:00"],
      ["B_100104_DD", "女", "2001年", "外省常住", "昌平区", "大学专科", "2026-08-07 03:00"],
      ["B_100105_EE", "男", "1975年", "本市户籍", "丰台区", "大学本科", "2026-08-07 03:00"]
    ]
  }
};

export const DatasetPreviewModal: React.FC<Props> = ({ tableName, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!tableName) return null;

  const dataset = SAMPLE_RECORDS[tableName] || SAMPLE_RECORDS['t_pop_elderly_services'];

  const handleCopySample = () => {
    const text = JSON.stringify(dataset, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full text-slate-800 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                {dataset.title}
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {tableName}
                </span>
              </h3>
              <p className="text-xs text-slate-500">归属单位: {dataset.dept}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 custom-scrollbar bg-white">
          {/* Security Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="font-semibold text-emerald-900">数据安全合规隔离提示:</strong>
              <p className="text-slate-700 text-[11px] mt-0.5">
                当前展示为前 10 条经过动态脱敏引擎清洗后的样本数据。所有身份证及姓名已自动做掩码处理，真实数据调用需经审批授权。
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    {dataset.columns.map((col, idx) => (
                      <th key={idx} className="p-2.5 whitespace-nowrap font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dataset.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 whitespace-nowrap">
                          {cIdx === 0 ? <span className="text-blue-600 font-bold">{cell}</span> : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">Status: 200 OK · Desensitized Sample</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySample}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center space-x-1 transition shadow-2xs font-medium"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制JSON' : '复制样例JSON'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-xs"
            >
              完成预览
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
