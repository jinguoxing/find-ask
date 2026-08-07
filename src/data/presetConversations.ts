import { ConversationTurnDemo, DatasetCatalogItem } from '../types';

export const POPULATION_CATALOG: DatasetCatalogItem[] = [
  {
    id: "t_pop_base_info",
    name: "户籍与常住人口基础库",
    category: "基础资源",
    count: 21852000,
    dept: "市公安局人口基地",
    description: "汇聚全市户籍人口与常住人口的基础身份、户籍所在地、居住行政区划、婚姻及教育状况数据。",
    security: "政务Ⅰ级 (严格脱敏)"
  },
  {
    id: "t_pop_elderly_services",
    name: "老龄人口及高龄津贴服务综合表",
    category: "民政专题",
    count: 1428000,
    dept: "市民政局 / 老龄办",
    description: "记录60岁以上老年人口分类（普通/高龄/失能）、月度补贴标准、发放状态及社区养老服务匹配情况。",
    security: "政务Ⅲ级 (脱敏)"
  },
  {
    id: "t_pop_floating",
    name: "流动人口与居留服务综合管理表",
    category: "流调专题",
    count: 5864000,
    dept: "市流动人口网格办 / 市公安局",
    description: "记录外来流动人口来源省市、来京原因、行业分布、居住证签发状态及居住时长。",
    security: "政务Ⅲ级 (脱敏)"
  },
  {
    id: "t_pop_maternal_child",
    name: "育龄妇女与妇幼健康服务表",
    category: "卫健专题",
    count: 4210000,
    dept: "市卫健委",
    description: "包含15-49岁育龄妇女基本信息、生育状况、孕产妇保健登记及儿童健康随访记录。",
    security: "政务Ⅱ级 (严格控制)"
  },
  {
    id: "t_pop_subsidy_low_income",
    name: "困难救助与低保扶贫人口表",
    category: "救助专题",
    count: 320000,
    dept: "市民政局救助处",
    description: "记录特困供养、最低生活保障、低收入家庭资金发放、动态复核与精准帮扶数据。",
    security: "政务Ⅱ级 (严格控制)"
  },
  {
    id: "t_pop_employment",
    name: "劳动年龄人口就业与失业状况表",
    category: "人社专题",
    count: 11400000,
    dept: "市人社局",
    description: "统计16-59岁劳动年龄人口的就业状态（已就业/灵活就业/失业登记/在校）、参保情况与行业分类。",
    security: "政务Ⅲ级 (脱敏)"
  }
];

export const PRESET_7_TURNS: ConversationTurnDemo[] = [
  {
    turnIndex: 1,
    title: "第1轮 [找数]：检索老龄人口与补贴数据资源",
    category: "找数",
    userPrompt: "帮我找一下全市60岁以上老人及高龄津贴发放相关的库表和字段",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 提取关键词：【60岁以上老人】、【高龄津贴】。\n2. 检索政务数据目录与语义索引库，定位市民政局与市老龄办联合治理的《t_pop_elderly_services》数据资产表。\n3. 解析核心结构，匹配人口身份加密主键、年龄分类、补贴发放状态与行政区划字段。",
      summary: "已找到符合需求的政务人口专题库资产：民政局《老龄人口及高龄津贴服务综合表》（t_pop_elderly_services）。该表当前纳管全市 142.8 万名 60 岁以上老人的基础数据与高龄津贴发放明细。",
      sql: `SELECT 
  column_name, data_type, column_comment, is_desensitized 
FROM information_schema.columns 
WHERE table_name = 't_pop_elderly_services';`,
      datasetInfo: {
        tableName: "t_pop_elderly_services",
        tableComment: "老龄人口及高龄津贴服务综合表",
        dataCount: 1428000,
        updateFrequency: "每日夜间增量更新",
        securityLevel: "政务Ⅲ级 (身份哈希脱敏)",
        department: "市民政局 / 市老龄办 / 市公安局",
        fields: [
          { name: "person_id", type: "VARCHAR(64)", comment: "人口全局加密唯一标识", desensitized: true, example: "HASH_9A8B7C***" },
          { name: "age", type: "INT", comment: "实际年龄(岁)", desensitized: false, example: "82" },
          { name: "elderly_grade", type: "VARCHAR(32)", comment: "老龄分类(60-79岁/80-89岁/90岁+)", desensitized: false, example: "80-89岁高龄" },
          { name: "subsidy_amount", type: "DECIMAL(10,2)", comment: "月度高龄津贴标准(元)", desensitized: false, example: "300.00" },
          { name: "district_name", type: "VARCHAR(64)", comment: "所属行政区划", desensitized: false, example: "朝阳区" },
          { name: "street_name", type: "VARCHAR(64)", comment: "所属街道办", desensitized: false, example: "奥运村街道" },
          { name: "grant_status", type: "VARCHAR(16)", comment: "津贴发放状态(已发放/核验中/暂停)", desensitized: false, example: "已发放" }
        ]
      },
      kpiCards: [
        { title: "相关数据资产", value: "1", unit: "张核心表", trend: "已认证", trendType: "up" },
        { title: "纳管老龄人口", value: "142.8", unit: "万人", trend: "+4.1%", trendType: "up" },
        { title: "数据更新频率", value: "24", unit: "小时/次", trend: "运行正常", trendType: "neutral" }
      ],
      followUpPrompts: [
        "检索并比对‘常住人口’与‘户籍人口’数据资源的库表结构",
        "统计近5年全市各区60岁以上老年人口数量变化趋势及津贴总额",
        "申请《老龄人口及高龄津贴服务综合表》数据共享API"
      ]
    }
  },
  {
    turnIndex: 2,
    title: "第2轮 [找数]：常住人口 vs 户籍人口 资源比对",
    category: "找数",
    userPrompt: "检索并比对‘常住人口’与‘户籍人口’数据资源的库表结构及更新时效",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 识别比对目标：【常住人口】与【户籍人口】的数据资产区别。\n2. 在政务数据共享总库中匹配《t_pop_base_info》（全量基础库）与《t_pop_huji_detail》（公安户籍专库）。\n3. 从字段差异、来源部门、更新频率与脱敏规则四个维度生成对比分析阵列。",
      summary: "已完成‘常住人口’与‘户籍人口’两大核心数据资源的库表结构与时效对比。《户籍与常住人口基础库》（t_pop_base_info）融合了公安户籍与社区网格人口，包含 2,185.2 万常住记录，具备更全的居住地与流动特征字段。",
      sql: `-- 常住人口与户籍人口表结构对比查询
SELECT 
  t1.table_name, t1.table_comment, t1.row_count, t1.update_freq, t1.department
FROM sys_data_asset_catalog t1
WHERE t1.table_name IN ('t_pop_base_info', 't_pop_huji_detail');`,
      datasetInfo: {
        tableName: "t_pop_base_info",
        tableComment: "户籍与常住人口基础整合库",
        dataCount: 21852000,
        updateFrequency: "实时增量同步 (多源协同)",
        securityLevel: "政务Ⅰ级 (分类分级管控)",
        department: "市公安局 / 市大数据中心",
        fields: [
          { name: "person_id", type: "VARCHAR(64)", comment: "加密唯一主键", desensitized: true, example: "P_8832910" },
          { name: "huji_type", type: "VARCHAR(32)", comment: "户籍类型(本市户籍/外地常住)", desensitized: false, example: "本市户籍" },
          { name: "huji_address", type: "VARCHAR(256)", comment: "户籍登记地址(脱敏到社区)", desensitized: true, example: "北京市海淀区***小区" },
          { name: "residence_district", type: "VARCHAR(64)", comment: "实际常住行政区", desensitized: false, example: "朝阳区" },
          { name: "education_level", type: "VARCHAR(32)", comment: "最高学历", desensitized: false, example: "大学本科" },
          { name: "update_time", type: "DATETIME", comment: "最近一次数据更新时间", desensitized: false, example: "2026-08-07 03:00:00" }
        ]
      },
      kpiCards: [
        { title: "全量常住人口", value: "2185.2", unit: "万人", trend: "+0.4%", trendType: "up" },
        { title: "本市户籍人口", value: "1403.5", unit: "万人", trend: "+0.2%", trendType: "up" },
        { title: "外地常住人口", value: "781.7", unit: "万人", trend: "+0.8%", trendType: "up" },
        { title: "跨部门数据对齐率", value: "99.2", unit: "%", trend: "极高", trendType: "neutral" }
      ],
      tablePreview: {
        columns: ["对比维度", "常住人口综合库 (t_pop_base_info)", "户籍人口专项库 (t_pop_huji_detail)"],
        rows: [
          ["数据规模", "2,185.2 万条", "1,403.5 万条"],
          ["数据来源", "公安局 + 网格办 + 卫健委多源融合", "市公安局户籍管理系统中心库"],
          ["更新频率", "实时增量 (24h同步)", "每日定时全量更新 (02:00)"],
          ["特有字段", "居住行政区、居住时长、网格编号", "迁入迁出时间、户主关系、原籍地址"],
          ["安全级别", "政务Ⅰ级 (严格脱敏权限审批)", "政务Ⅰ级 (涉敏公安专线)"]
        ]
      },
      followUpPrompts: [
        "查询并预览《流动人口与居住证综合管理表》的数据血缘",
        "分析全市常住人口的年龄结构分布与受教育程度交叉对比",
        "按行政区划统计常住人口与户籍人口比例"
      ]
    }
  },
  {
    turnIndex: 3,
    title: "第3轮 [找数]：预览流动人口脱敏数据与血缘",
    category: "找数",
    userPrompt: "查询并预览《流动人口与居住证综合管理表》的前5条脱敏数据与数据血缘",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 定位目标资产: 《t_pop_floating》（流动人口与居留服务综合管理表）。\n2. 动态读取脱敏引擎设置: 姓名采用 `张*` 掩码，身份证采用哈希加密，地址保留至区县与街道。\n3. 溯源数据血缘链条: 市公安局居住证系统/网格通APP -> 基层治理数据池 -> 人口主题治理引擎 -> t_pop_floating。",
      summary: "已成功调取《流动人口与居住证综合管理表》（t_pop_floating）的脱敏预览数据。该表融合了社区网格员巡查、居住证申领与社会保险缴纳数据，已完成自动化数据脱敏合规审计。",
      sql: `SELECT 
  person_id,
  LEFT(source_province, 4) AS 来源省份,
  residence_reason AS 来京原因,
  industry AS 从业行业,
  dwell_duration_months AS 居住时长_月,
  district_name AS 居住区县,
  is_registered_residence_permit AS 居住证办理
FROM t_pop_floating
LIMIT 5;`,
      datasetInfo: {
        tableName: "t_pop_floating",
        tableComment: "流动人口与居留服务综合管理表",
        dataCount: 5864000,
        updateFrequency: "实时同步 (网格员采集/居住证办理)",
        securityLevel: "政务Ⅲ级 (自动动态脱敏)",
        department: "市流动人口网格办 / 市公安局人口基层支队",
        fields: [
          { name: "person_id", type: "VARCHAR(64)", comment: "人员加密唯一哈希", desensitized: true, example: "M_992104" },
          { name: "source_province", type: "VARCHAR(32)", comment: "来源省份", desensitized: false, example: "河北省" },
          { name: "residence_reason", type: "VARCHAR(32)", comment: "来京主要原因", desensitized: false, example: "务工经商" },
          { name: "industry", type: "VARCHAR(64)", comment: "主要从业行业", desensitized: false, example: "信息传输与软件服务" },
          { name: "dwell_duration_months", type: "INT", comment: "在京居住时长(月)", desensitized: false, example: "36" },
          { name: "is_registered_residence_permit", type: "TINYINT", comment: "是否办理居住证(1/0)", desensitized: false, example: "1" }
        ]
      },
      tablePreview: {
        columns: ["人员ID(脱敏)", "来源省份", "来京原因", "从业行业", "居住时长(月)", "居住区县", "居住证状态"],
        rows: [
          ["M_992101_FX", "河北省", "务工经商", "信息传输与软件服务", "48", "海淀区", "已办理"],
          ["M_992102_QK", "河南省", "务工经商", "居民服务/家政", "24", "朝阳区", "已办理"],
          ["M_992103_AL", "山东省", "学习培训", "教育/在校学生", "18", "海淀区", "免办(学生)"],
          ["M_992104_WX", "安徽省", "务工经商", "建筑工程/施工", "36", "昌平区", "已办理"],
          ["M_992105_ZZ", "四川省", "随迁家属", "自由职业/未就业", "12", "丰台区", "办理中"]
        ]
      },
      kpiCards: [
        { title: "脱敏审核状态", value: "已通过", unit: "ISO27001", trend: "安全合规", trendType: "neutral" },
        { title: "血缘链路节点", value: "4", unit: "级溯源", trend: "完整", trendType: "up" },
        { title: "敏感字段掩码率", value: "100", unit: "%", trend: "自动防护", trendType: "neutral" }
      ],
      followUpPrompts: [
        "统计近5年全市各区60岁以上老年人口数量变化趋势及高龄津贴发放总额",
        "分析当前全市常住人口的年龄结构分布与受教育程度交叉对比",
        "查询近一年全市流动人口的主要来源省份Top 10及行业分布特征"
      ]
    }
  },
  {
    turnIndex: 4,
    title: "第4轮 [问数]：老龄人口趋势与津贴总额分析",
    category: "问数",
    userPrompt: "统计近5年全市各区（县）60岁以上老年人口数量变化趋势及高龄津贴发放总额",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 解析计算需求: 统计2022-2026年全市老龄人口规模演变与财政津贴支出总量。\n2. 构建多维 SQL: 结合 `t_pop_elderly_services` 进行按年度与区县双重 GROUP BY 聚合。\n3. 拟合计算趋势线，生成复合折线图与各区高龄津贴分布对比表。",
      summary: "近5年全市 60 岁以上老龄人口呈现持续上升趋势，从 2022 年的 121.2 万人增长至 2026 年的 142.8 万人（增幅达 17.8%）。年度高龄津贴财政支出由 4.12 亿元增加至 5.82 亿元。朝阳区、海淀区和西城区的老龄人口总量及补贴发放量位居前三。",
      sql: `SELECT 
  calendar_year AS 年份,
  COUNT(DISTINCT person_id) / 10000.0 AS 60岁以上老人数_万人,
  SUM(subsidy_amount * 12) / 100000000.0 AS 年高龄津贴总额_亿元
FROM t_pop_elderly_services
WHERE calendar_year BETWEEN 2022 AND 2026
GROUP BY calendar_year
ORDER BY calendar_year ASC;`,
      kpiCards: [
        { title: "2026老龄人口总量", value: "142.8", unit: "万人", trend: "+17.8% (较2022)", trendType: "up" },
        { title: "年津贴财政支出", value: "5.82", unit: "亿元", trend: "+41.2%", trendType: "up" },
        { title: "高龄老人(80岁+)占比", value: "15.7", unit: "%", trend: "+1.9%", trendType: "up" },
        { title: "人均补贴标准", value: "340", unit: "元/月", trend: "+8.5%", trendType: "up" }
      ],
      chart: {
        type: "line",
        title: "2022-2026年全市60岁以上老龄人口(万人)与高龄津贴支出(亿元)演变趋势",
        xAxisKey: "year",
        dataKeys: ["population", "subsidy"],
        dataKeysLabels: { population: "60岁以上老龄人口(万人)", subsidy: "高龄津贴支出(亿元)" },
        data: [
          { year: "2022年", population: 121.2, subsidy: 4.12 },
          { year: "2023年", population: 126.8, subsidy: 4.38 },
          { year: "2024年", population: 132.5, subsidy: 4.71 },
          { year: "2025年", population: 137.9, subsidy: 5.10 },
          { year: "2026年", population: 142.8, subsidy: 5.82 }
        ]
      },
      tablePreview: {
        columns: ["行政区划", "2026老龄人口(万)", "80岁以上高龄(万)", "月发放津贴(万元)", "近3年年均增速"],
        rows: [
          ["朝阳区", "23.8", "4.2", "910.2", "+4.2%"],
          ["海淀区", "21.4", "3.8", "820.5", "+3.8%"],
          ["丰台区", "18.2", "2.8", "580.4", "+4.5%"],
          ["西城区", "14.5", "2.9", "610.0", "+2.9%"],
          ["东城区", "12.8", "2.5", "530.8", "+2.7%"],
          ["石景山区", "8.6", "1.4", "290.1", "+3.1%"]
        ]
      },
      policySuggestions: [
        "老龄人口增幅高于公共服务设施建设增速，建议强化老龄公共财政预决算动态调适机制。",
        "推行‘高龄津贴全流程直达快享’，利用银发经济数据赋能社区养老餐桌与居家护理。"
      ],
      followUpPrompts: [
        "分析当前全市常住人口的年龄结构分布与受教育程度交叉对比",
        "查询近一年全市流动人口的主要来源省份Top 10及行业分布特征",
        "评估全市各区老龄化程度与养老设施床位匹配度"
      ]
    }
  },
  {
    turnIndex: 5,
    title: "第5轮 [问数]：年龄结构与学历交叉对比",
    category: "问数",
    userPrompt: "分析当前全市常住人口的年龄结构分布与受教育程度交叉对比",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 关联数据库: 提取《t_pop_base_info》中的 `age_group` (0-14岁, 15-35岁, 36-59岁, 60岁+) 与 `education_level` (初中及以下/高中/大专/本科/硕士及以上)。\n2. 计算交叉交叉列联表 (Cross-tabulation)，生成堆叠柱状图与学历金字塔结构。",
      summary: "全市常住人口呈现出高学历化与成熟化并存的特征。15-35岁青年群体中，大学本科及以上学历占比高达 58.4%；36-59岁劳动主力群体中，大专及以上学历占 42.1%。高等教育资源在核心城区（海淀、朝阳）高度富集。",
      sql: `SELECT 
  CASE 
    WHEN age < 15 THEN '0-14岁(少儿)'
    WHEN age BETWEEN 15 AND 35 THEN '15-35岁(青年)'
    WHEN age BETWEEN 36 AND 59 THEN '36-59岁(中年)'
    ELSE '60岁以上(老龄)'
  END AS 年龄段,
  SUM(CASE WHEN education_level IN ('硕士', '博士') THEN 1 ELSE 0 END) AS 硕士及以上_万人,
  SUM(CASE WHEN education_level = '本科' THEN 1 ELSE 0 END) AS 本科学历_万人,
  SUM(CASE WHEN education_level = '大专' THEN 1 ELSE 0 END) AS 大专学历_万人,
  SUM(CASE WHEN education_level = '高中/中专' THEN 1 ELSE 0 END) AS 高中中专_万人
FROM t_pop_base_info
GROUP BY 年龄段;`,
      kpiCards: [
        { title: "大专及以上受教育人口", value: "982.4", unit: "万人", trend: "占比 44.9%", trendType: "up" },
        { title: "青年高学历人才占比", value: "58.4", unit: "%", trend: "+3.1%", trendType: "up" },
        { title: "平均受教育年限", value: "12.8", unit: "年", trend: "全国领先", trendType: "neutral" }
      ],
      chart: {
        type: "stacked_bar",
        title: "全市常住人口各年龄段受教育程度分布 (单位: 万人)",
        xAxisKey: "ageGroup",
        dataKeys: ["masterPlus", "bachelor", "college", "highSchool"],
        dataKeysLabels: {
          masterPlus: "硕士及以上(万)",
          bachelor: "本科(万)",
          college: "大专(万)",
          highSchool: "高中及以下(万)"
        },
        data: [
          { ageGroup: "0-14岁(少儿)", masterPlus: 0, bachelor: 0, college: 0, highSchool: 242.1 },
          { ageGroup: "15-35岁(青年)", masterPlus: 82.4, bachelor: 284.1, college: 142.0, highSchool: 121.5 },
          { ageGroup: "36-59岁(中壮年)", masterPlus: 45.2, bachelor: 198.6, college: 182.4, highSchool: 320.1 },
          { ageGroup: "60岁+(老龄)", masterPlus: 8.2, bachelor: 32.1, college: 28.5, highSchool: 74.0 }
        ]
      },
      tablePreview: {
        columns: ["年龄段划分", "总人口(万)", "硕士及以上(万)", "本科(万)", "大专(万)", "高学历占比"],
        rows: [
          ["0-14岁 (少儿人口)", "242.1", "0.0", "0.0", "0.0", "0.0%"],
          ["15-35岁 (青年群体)", "630.0", "82.4", "284.1", "142.0", "80.7%"],
          ["36-59岁 (中年群体)", "746.3", "45.2", "198.6", "182.4", "57.1%"],
          ["60岁以上 (老龄人口)", "142.8", "8.2", "32.1", "28.5", "48.2%"]
        ]
      },
      policySuggestions: [
        "发挥青年高素质人才集聚优势，优化科技创新创业环境与高品质青年人才公寓供给。"
      ],
      followUpPrompts: [
        "查询近一年全市流动人口的主要来源省份Top 10及行业分布特征",
        "评估全市各区老龄化程度与养老设施床位匹配度",
        "按区县导出全市常住人口受教育程度可视化透视表"
      ]
    }
  },
  {
    turnIndex: 6,
    title: "第6轮 [问数]：流动人口来源省份与行业特征",
    category: "问数",
    userPrompt: "查询近一年全市流动人口的主要来源省份Top 10及行业分布特征",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 读取表 `t_pop_floating` 中最近一年的动态更新记录。\n2. 聚类分析来源省份 Top 10 (河北、河南、山东、安徽、黑龙江等) 以及主导就业行业 (信息软件、建筑工程、居民服务、批发零售、交通运输)。\n3. 生成横向条形图与行业构成饼图。",
      summary: "近一年全市新增登记流动人口中，环京及周边省份占比超 47.4%，其中河北省（131.3万）和河南省（83.2万）为最大来源地。在行业分布上，信息技术与数字经济占比 28.5%，建筑工程与城市运维占 24.2%，居民生活服务业占 22.1%。",
      sql: `SELECT 
  source_province AS 来源省份,
  industry AS 主导行业,
  COUNT(person_id) AS 登记流动人口数,
  ROUND(AVG(dwell_duration_months), 1) AS 平均居住月数
FROM t_pop_floating
GROUP BY source_province, industry
ORDER BY 登记流动人口数 DESC
LIMIT 10;`,
      kpiCards: [
        { title: "流动人口登记总数", value: "586.4", unit: "万人", trend: "+1.8%", trendType: "up" },
        { title: "周边省份集中度", value: "47.4", unit: "%", trend: "地缘紧密", trendType: "neutral" },
        { title: "新质生产力从业人员", value: "167.1", unit: "万人", trend: "+6.4%", trendType: "up" },
        { title: "平均在京居住时长", value: "41.2", unit: "个月", trend: "+2.8%", trendType: "up" }
      ],
      chart: {
        type: "bar",
        title: "全市流动人口主要来源省份 Top 8 及居住证办理人数 (单位: 万人)",
        xAxisKey: "province",
        dataKeys: ["count", "permits"],
        dataKeysLabels: { count: "流动人口总数(万)", permits: "已办居住证(万)" },
        data: [
          { province: "河北省", count: 131.3, permits: 118.2 },
          { province: "河南省", count: 83.2, permits: 72.8 },
          { province: "山东省", count: 63.3, permits: 56.4 },
          { province: "安徽省", count: 48.1, permits: 42.0 },
          { province: "黑龙江省", count: 39.5, permits: 34.8 },
          { province: "山西省", count: 35.2, permits: 31.0 },
          { province: "湖北省", count: 29.8, permits: 26.1 },
          { province: "四川省", count: 27.4, permits: 23.9 }
        ]
      },
      tablePreview: {
        columns: ["来源省份", "登记人数(万)", "占比", "主导行业分布", "平均年龄(岁)"],
        rows: [
          ["河北省", "131.3", "22.4%", "软件信息 / 建筑工程", "36.2"],
          ["河南省", "83.2", "14.2%", "居民服务 / 交通快递", "37.5"],
          ["山东省", "63.3", "10.8%", "批发零售 / 餐饮住宿", "35.8"],
          ["安徽省", "48.1", "8.2%", "智能制造 / 租赁商务", "38.1"],
          ["黑龙江省", "39.5", "6.7%", "家政养老 / 医疗健康", "41.0"],
          ["山西省", "35.2", "6.0%", "能源物业 / 建筑施工", "39.4"]
        ]
      },
      policySuggestions: [
        "针对信息科技与居民服务业流动人才，推进‘京津冀区域政务服务一网通办’与居住证积分无缝衔接。"
      ],
      followUpPrompts: [
        "评估全市各区老龄化程度与养老设施床位匹配度，并生成决策建议",
        "计算流动人口子女在京义务教育需求与学校学位缺口",
        "导出《流动人口来源地与就业行业专题分析报告.docx》"
      ]
    }
  },
  {
    turnIndex: 7,
    title: "第7轮 [问数]：老龄化与养老设施床位匹配度",
    category: "问数",
    userPrompt: "评估全市各区老龄化程度与养老设施床位匹配度，并生成决策建议与综合图表",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 跨库关联计算: 提取 `t_pop_elderly_services` (老龄人口) 与 `t_pop_infrastructure` (养老院/日间照料中心床位数)。\n2. 综合评估模型: 计算每千名老人拥有的养老床位数、高龄补贴保障覆盖率、日间照料中心覆盖半径。\n3. 生成多维雷达图与区县配比评价榜。",
      summary: "全市老龄人口与养老设施床位匹配度得分为 84.5 分。中心城区（西城、东城）养老服务基础设施完善，千人床位数达 38.5 张；而近郊区（丰台、昌平、大兴）因老龄人口快速集聚，千人床位数缺口约为 12.4 张，需重点加大规划投入。",
      sql: `SELECT 
  district_name AS 行政区划,
  elderly_pop_k AS 60岁以上老人_万人,
  bed_count AS 养老床位总数,
  ROUND(bed_count / (elderly_pop_k * 10), 2) AS 每千名老人床位数,
  match_score AS 匹配度评分_分
FROM view_elderly_infrastructure_match
ORDER BY match_score ASC;`,
      kpiCards: [
        { title: "综合匹配度评分", value: "84.5", unit: "分", trend: "良好", trendType: "up" },
        { title: "全市养老床位总量", value: "4.82", unit: "万张", trend: "+5.1%", trendType: "up" },
        { title: "每千名老人床位数", value: "33.8", unit: "张", trend: "达标85%", trendType: "neutral" },
        { title: "日间照料站点覆盖率", value: "91.2", unit: "%", trend: "+3.8%", trendType: "up" }
      ],
      chart: {
        type: "radar",
        title: "全市老龄化养老服务供给 5 维能力综合诊断评估 (Radar Radar)",
        xAxisKey: "dimension",
        dataKeys: ["score", "benchmark"],
        dataKeysLabels: { score: "当前实际得分", benchmark: "政务基准目标" },
        data: [
          { dimension: "千人床位储备", score: 78, benchmark: 90 },
          { dimension: "高龄津贴覆盖", score: 98, benchmark: 95 },
          { dimension: "日间照料半径", score: 88, benchmark: 85 },
          { dimension: "失能护理保障", score: 72, benchmark: 85 },
          { dimension: "智慧养老数字化", score: 86, benchmark: 80 }
        ]
      },
      tablePreview: {
        columns: ["行政区划", "老龄人口(万)", "养老床位数", "千人床位(张)", "匹配评分", "建设优化建议"],
        rows: [
          ["西城区", "14.5", "5,580", "38.5", "95.1", "保持高品质，推广社区嵌入式养老"],
          ["东城区", "12.8", "4,810", "37.5", "94.2", "鼓励社会力量盘活存量公房养老"],
          ["海淀区", "21.4", "7,810", "36.4", "92.4", "依托医产研优势建立智慧医养试点"],
          ["朝阳区", "23.8", "7,920", "33.2", "88.6", "补齐东南部新城养老床位缺口"],
          ["丰台区", "18.2", "5,110", "28.0", "82.1", "加大财政补贴，新建2个综合养老院"],
          ["昌平区", "11.2", "2,980", "26.6", "79.5", "紧密结合回天地区配建社区照料中心"]
        ]
      },
      policySuggestions: [
        "强化‘按人划拨养老专项转移支付’机制，引导社会资本向丰台、昌平、大兴等床位偏紧区县倾斜。",
        "全面推广‘互联网+社区养老’，依托人口库失能诊断数据，实现全天候紧急呼叫与居家上门护理服务。"
      ],
      followUpPrompts: [
        "生成并导出《全市老龄化趋势与养老设施匹配度决策报告》",
        "钉选本次问数所有图表至政务决策大屏看板",
        "重新开始一轮人口数据找数问数对话"
      ]
    }
  }
];
