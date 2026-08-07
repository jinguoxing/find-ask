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

export const TESLA_MANUAL_5_TURNS: ConversationTurnDemo[] = [
  {
    turnIndex: 1,
    title: "第1轮 [车门紧急解锁]：后排机械车门释放与逃生拉手",
    category: "问数",
    userPrompt: "Model Y 在断电或紧急情况下，前排和后排车门如何进行机械解锁逃生？",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 挂载知识库: 《特斯拉 Model Y 官方车主手册 v2026.4》- 章节 4.12 车辆无电状态下的车门打开。\n2. 匹配物理机械结构: 前排机械开关 vs 后排储物槽底盖应急拉索。\n3. 提取安全警告标识 (Warning) 与依据文档出处。",
      summary: "【Model Y 车门紧急机械解锁操作指南】\n1. 前排车门：拉动位于车窗控制开关按钮正前方的【机械车门释放装置】（向上提起即可直接解锁弹开门锁）；\n2. 后排车门：需抬起后车门储物槽底部的软垫片，拔下内部的塑料密封橡胶盖，拉出其中的【紧急释放拉索】即可解锁后车门。\n重要提示：紧急机械拉手仅限 16V 低压供电断开或紧急故障时使用，正常状态下强行拉动可能磨损车门饰板或窗框密封条。",
      kpiCards: [
        { title: "前排解脱装置", value: "车窗按钮前", unit: "直接上提", trend: "100%物理结构", trendType: "neutral" },
        { title: "后排解脱装置", value: "门槽底部盖", unit: "拉索解脱", trend: "需移除垫片", trendType: "neutral" },
        { title: "适配低压电压", value: "16V / 12V", unit: "无电响应", trend: "纯机械连杆", trendType: "up" },
        { title: "检索出处依据", value: "Sec 4.12", unit: "P.142-143", trend: "特斯拉官方认证", trendType: "neutral" }
      ],
      tablePreview: {
        columns: ["车门位置", "解脱机构位置", "操作步骤与触发机制", "注意事项与安全级别"],
        rows: [
          ["前排左/右车门", "车窗按键正前方", "直接向上拉起机械拉手，释放门锁车勾", "🟢 简单直观，无电状态下 0.5s 快速弹门"],
          ["后排左/右车门", "门板下储物槽底部", "1. 取出底部植绒垫片\n2. 移除橡胶盖\n3. 沿车尾方向拉动金属拉索", "🟡 需提前了解位置，建议车主为家庭成员演示"],
          ["后备箱 (掀背门)", "尾门内饰板中央圆孔", "移除密封盖，用手指按下内部锁扣杠杆", "🔴 需从车内爬入后备箱，仅限车辆被淹等极度险情"]
        ]
      },
      policySuggestions: [
        "【安全建议】建议车主交车后熟悉后排门槽拉索位置，并在后排备有安全锤或急救应急工具。",
        "【维护提醒】若非无电紧急情况，请勿频繁拉动前排机械拉手，以免中控屏提示‘车门未关紧’警告。"
      ],
      citationDocs: [
        {
          docId: "DOC-TESLA-MY-4.12",
          title: "特斯拉 Model Y 车主手册 - 开启和关闭车门",
          section: "Section 4.12 - 在无电情况下打开车门 (Opening Doors with No Power)",
          page: "P.142-143",
          excerpt: "如果 Model Y 失去电源，请按以下步骤手动打开车门：前排车门：向上拉动位于车窗开关前面的手动车门释放装置。后排车门： Model Y 的后车门配有手动车门释放装置，位于后车门储物槽底部。抬起储物槽底部的垫片，移除橡胶盖，然后向车尾方向拉动紧急释放拉索即可解脱门锁。",
          relevanceScore: 99.4,
          warningLevel: "warning",
          version: "2026.4 CN v2 Edition"
        }
      ],
      followUpPrompts: [
        "如何开启 Autopilot 自动辅助驾驶，需要满足哪些摄像头条件？",
        "前往超级充电站时电池预热有什么作用？冬季如何提升续航？",
        "哨兵模式和行车记录仪如何配置 U 盘存储？提示速度过慢怎么处理？"
      ]
    }
  },
  {
    turnIndex: 2,
    title: "第2轮 [Autopilot/FSD]：辅助驾驶开启与舱内摄像头监视",
    category: "问数",
    userPrompt: "如何开启 Autopilot 自动辅助驾驶？驾驶员监视摄像头和前视摄像头有哪些触发限制？",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 检索手册章节: Section 7.02 Autopilot 自动辅助转向与驾驶员监控。\n2. 解析硬件要求: 8个车身摄像头、车内驾驶员专注度摄像头与驾驶杆/滚轮双击指令。\n3. 梳理安全罢工机制 (Safety Strikeout): 5次警告禁用规则。",
      summary: "【Autopilot 自动辅助驾驶开启与安全监控】\n1. 激活操作：在中控屏‘控制’->‘Autopilot’中开启功能。行驶中连续向下拨动右侧控制杆两次（或快速双击方向盘右滚轮），中控屏车道线变蓝并伴随音效即已激活；\n2. 摄像头与监控：车内后视镜上方的【驾驶员监视摄像头】会实时捕捉眼球轨迹与头部姿态。若检测到驾驶员看手机、闭眼或手离开方向盘，系统将发出逐步升级的声光预警；\n3. 罢工封禁机制：若驾驶员忽视预警导致系统强制退出 Autopilot，累计 5 次‘安全罢工’后，车辆将在 7 天内禁止使用 Autopilot 辅助驾驶功能。",
      kpiCards: [
        { title: "激活操作方式", value: "杆/滚轮双击", unit: "蓝线确认", trend: "0.2s 快速响应", trendType: "up" },
        { title: "车外感知视角", value: "8 个摄像头", unit: "360° 覆盖", trend: "纯视觉路线", trendType: "up" },
        { title: "舱内监控类型", value: "驾驶员视角", unit: "眼球+双手", trend: "实时视线追踪", trendType: "neutral" },
        { title: "安全 strike 限制", value: "5 次违规", unit: "封禁 7 天", trend: "强制安全规约", trendType: "down" }
      ],
      chart: {
        type: "bar",
        title: "Autopilot 辅助驾驶摄像头感知工作状态与清障要求",
        xAxisKey: "camera",
        dataKeys: ["visionRange", "frameRate"],
        dataKeysLabels: { visionRange: "有效感知距离(米)", frameRate: "采样帧率(FPS)" },
        data: [
          { camera: "前视三目摄像头", visionRange: 250, frameRate: 60 },
          { camera: "侧后视摄像头(B柱)", visionRange: 100, frameRate: 30 },
          { camera: "侧前视摄像头(翼子板)", visionRange: 80, frameRate: 30 },
          { camera: "后视摄像头(尾门)", visionRange: 50, frameRate: 30 },
          { camera: "舱内驾驶员监视器", visionRange: 2, frameRate: 60 }
        ]
      },
      tablePreview: {
        columns: ["警告阶段", "系统触发表现", "驾驶员应采取措施", "解除警告方法"],
        rows: [
          ["1 级提醒 (轻微)", "屏幕顶部出现白色闪烁提示框", "轻轻抖动方向盘或微调音量滚轮", "双手施加轻微转动扭矩"],
          ["2 级警告 (中度)", "屏幕蓝光剧烈闪烁并伴随持续蜂鸣音", "立即目视前方并紧握方向盘", "纠正视线并保持注意力聚焦"],
          ["3 级强退 (严重)", "发出警示音并强制退出 Autopilot", "靠边停车并切换至 P 挡重置", "记录 1 次 Strike（累积5次封禁）"]
        ]
      },
      policySuggestions: [
        "【安全须知】Autopilot 属于 Level 2 辅助驾驶，切勿使用遮挡贴纸或重力环欺骗系统，否则将极大增加事故风险。",
        "【镜头清洁】雨雪天若提示‘摄像头受阻’，请使用麂皮布清洁前挡风玻璃及 B 柱摄像头镜片。"
      ],
      citationDocs: [
        {
          docId: "DOC-TESLA-AP-7.02",
          title: "特斯拉车主手册 - 自动辅助驾驶",
          section: "Section 7.02 - 自动辅助转向与驾驶员监视摄像头 (Autosteer & Cabin Camera)",
          page: "P.210-212",
          excerpt: "自动辅助转向通过纯视觉神经网络评估车道线与周围车辆。舱内摄像头位于后视镜上方，用于监测驾驶员注意力。切勿遮挡舱内摄像头。如果系统多次检测到注意力不集中并向驾驶员发出强退警告，Autopilot 权限将被挂起，需累计 5 次强制退出后停用 7 天。",
          relevanceScore: 98.8,
          warningLevel: "info",
          version: "2026.4 CN v2 Edition"
        }
      ],
      followUpPrompts: [
        "前往超级充电站时电池预热有什么作用？冬季如何提升续航？",
        "哨兵模式和行车记录仪如何配置 U 盘存储？提示速度过慢怎么处理？",
        "仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车怎么处理？"
      ]
    }
  },
  {
    turnIndex: 3,
    title: "第3轮 [电池与超充]：电池预热原理与冬季续航管理",
    category: "问数",
    userPrompt: "前往超级充电站时电池预热有什么作用？冬季低温天气下如何优化续航衰减？",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 挂载手册章节: Section 9.05 高压电池与热管理系统。\n2. 解析热泵/PTC回路与电机余热预热机制。\n3. 生成充放电效率曲线与冬季行车节能策略矩阵。",
      summary: "【电池超级充电预热与冬季续航优化】\n1. 超充预热作用：当使用车机导航设定超级充电站为目的地时，热管理系统会提前 15-30 分钟利用电机电磁余热将高压电池加热至最佳吸电温度（35°C~45°C），可使峰值充电功率提升 40%~60%，节省约 15 分钟超充时间；\n2. 冬季续航优化三招：\n   ① 预设气候出发：插着充电枪时通过 Tesla App 设定‘按时出发’，直接消耗市电预热电池和座舱，避免消耗电池电量；\n   ② 善用座椅加热：优先开启座椅加热与方向盘加热，适当降低空调风扇挡位（空调热泵能耗远高于座椅加热）；\n   ③ 保持能量回收：设置能量回收制动为‘标准’，车机显示‘蓝色雪花’图标时表示电池过冷，行驶一段时间后恢复全额回收。",
      kpiCards: [
        { title: "超充预热提速", value: "+45%", unit: "峰值功率", trend: "缩短 15min", trendType: "up" },
        { title: "预热目标温度", value: "35~45", unit: "℃理想区", trend: "电机余热供能", trendType: "up" },
        { title: "市电预热节能", value: "12-18", unit: "km续航", trend: "App按时出发", trendType: "neutral" },
        { title: "热泵空调效能", value: "3.5 COP", unit: "高效制热", trend: "集成热管理", trendType: "up" }
      ],
      chart: {
        type: "line",
        title: "未预热 vs 预热后电池超级充电功率 (kW) 随时间变化对比",
        xAxisKey: "timeMin",
        dataKeys: ["preheated", "coldBattery"],
        dataKeysLabels: { preheated: "导航预热后超充功率(kW)", coldBattery: "未预热冷电池超充功率(kW)" },
        data: [
          { timeMin: "0 min", preheated: 250, coldBattery: 45 },
          { timeMin: "5 min", preheated: 210, coldBattery: 65 },
          { timeMin: "10 min", preheated: 170, coldBattery: 95 },
          { timeMin: "15 min", preheated: 130, coldBattery: 110 },
          { timeMin: "20 min", preheated: 95, coldBattery: 90 },
          { timeMin: "25 min", preheated: 65, coldBattery: 60 }
        ]
      },
      tablePreview: {
        columns: ["冬季用车场景", "常见误区/痛点", "手册推荐最佳实践", "续航改善效果"],
        rows: [
          ["晨间露天冷启动", "直接上车开启 28℃ 大风量空调", "插枪状态在 App 开启‘按时出发/预热座舱’", "提升 10%~15% 初始续航"],
          ["前往 V3/V4 超充站", "使用第三方手机导航前往超充站", "必须使用车机自带地图导航至超充站", "触发电池预热，充电峰值达 250kW"],
          ["高速长途行驶", "频繁急加速与车速维持 130km/h+", "开启 AP 巡航维持 100-110km/h 经济时速", "减少 20% 风阻与高能耗开支"]
        ]
      },
      policySuggestions: [
        "【磷酸铁锂版本提醒】Model Y 后驱版（磷酸铁锂电池）建议每周至少充至 100% 一次，以校准 BMS 电池管理系统电量精度。",
        "【长途规划】冬季跨省出行请在车机导航设置中开启‘自动包含充电停靠点’，车机会根据实时气温与海拔自动计算到达电量。"
      ],
      citationDocs: [
        {
          docId: "DOC-TESLA-BAT-9.05",
          title: "特斯拉车主手册 - 高压电池管理",
          section: "Section 9.05 - 低温气候作业与超级充电预热 (Cold Weather Best Practices)",
          page: "P.285-287",
          excerpt: "当您使用车载导航导航至特斯拉超级充电站时，Model Y 会分配能量来预加热电池，使其达到最佳充电温度。这可以显著缩短充电所需的时间。在寒冷天气下，由于电池过冷，可能会出现蓝色雪花图标，能量回收制动可能会受限，随着行驶中电池温度升高将自动恢复。",
          relevanceScore: 99.1,
          warningLevel: "info",
          version: "2026.4 CN v2 Edition"
        }
      ],
      followUpPrompts: [
        "哨兵模式和行车记录仪如何配置 U 盘存储？提示速度过慢怎么处理？",
        "仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车怎么处理？",
        "查看车主手册关于保修条款与电池衰减合规规定"
      ]
    }
  },
  {
    turnIndex: 4,
    title: "第4轮 [哨兵模式与记录仪]：U 盘格式化与安全视频存证",
    category: "问数",
    userPrompt: "哨兵模式和行车记录仪如何配置 U 盘存储？如果提示 U 盘速度过慢或未格式化怎么处理？",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 挂载手册章节: Section 11.03 哨兵模式与 Dashcam 存储。\n2. 分析接口位置: 副驾手套箱内部 USB 专口与 exFAT 格式化规约。\n3. 厘清视频写入速度与 20% 电池低电量关停保护。",
      summary: "【哨兵模式与行车记录仪 U 盘存储配置指南】\n1. 物理位置与规格：请将存储 U 盘插在【副驾驶手套箱内部】的 USB 接口（具有防盗锁闭保护）。推荐使用容量 ≥ 64GB、持续随机写入速度 ≥ 4MB/s 的固态 U 盘或高耐久闪存盘；\n2. 格式化方法：在车机屏幕点击‘控制’ -> ‘安全’ -> 【格式化 USB 闪存盘】，系统会自动将其格式化为 exFAT 文件系统并新建 `TeslaCam` 根目录文件夹；\n3. 速度过慢/报错排查：若提示‘写入速度过慢’，通常是因为使用了普通劣质 U 盘或采用了 HUB 分接线。请更换支持 USB 3.1 协议的硬质固态闪存盘；\n4. 哨兵触发与电量保护：哨兵模式开启后，当车身传感器检测到有人靠近或碰撞时，会自动剪辑保存前 10 分钟视频。当动力电池电量降至 20% 以下时，哨兵模式将自动关停以防止电池耗尽。",
      kpiCards: [
        { title: "U 盘推荐容量", value: "≥ 64GB", unit: "exFAT 格式", trend: "手套箱专口", trendType: "up" },
        { title: "写入速度门槛", value: "≥ 4 MB/s", unit: "持续写入", trend: "USB 3.1 规约", trendType: "neutral" },
        { title: "哨兵保护底线", value: "20%", unit: "低电量关停", trend: "防止电池过放", trendType: "down" },
        { title: "视频循环切片", value: "10 分钟", unit: "触发保存", trend: "四向视角同录", trendType: "up" }
      ],
      tablePreview: {
        columns: ["常见报错提示", "可能原因分析", "官方手册解决步骤", "预防措施"],
        rows: [
          ["‘请插入包含 TeslaCam 的 U 盘’", "U 盘未格式化或缺少根目录", "车机中控 -> 控制 -> 安全 -> 格式化 USB 闪存盘", "切勿手动删除 U 盘内的文件夹"],
          ["‘存储设备写入速度过慢’", "U 盘为 USB 2.0 或闪存颗粒衰减", "更换固态移动硬盘或特斯拉原厂 128GB 闪存盘", "避免使用无牌照劣质 U 盘"],
          ["‘哨兵模式已关停’", "动力电池剩余电量 ≤ 20%", "连接充电枪补充电量至 20% 以上后重新启用", "可在 App 设置‘在家中停用哨兵’节能"]
        ]
      },
      policySuggestions: [
        "【隐私与合规】哨兵模式保存的视频仅存储在车内 U 盘中，不会上传至特斯拉云端服务器，保障隐私安全。",
        "【手套箱 PIN 码】建议设置手套箱 PIN 码（控制->安全->手套箱 PIN 码），防止他人盗取 U 盘中的监控视频。"
      ],
      citationDocs: [
        {
          docId: "DOC-TESLA-SEC-11.03",
          title: "特斯拉车主手册 - 安全与防盗",
          section: "Section 11.03 - 哨兵模式 (Sentry Mode) 与 Dashcam 视频存储",
          page: "P.330-332",
          excerpt: "哨兵模式在车辆锁闭且处于 P 挡时监控周围环境。需要将格式化好的 USB 闪存盘插入手套箱中的 USB 端口。选择‘格式化 USB 闪存盘’后，车机会将其格式化为 exFAT 并创建 TeslaCam 文件夹。当电池电量降至或低于 20% 时，哨兵模式停用并弹出提示。",
          relevanceScore: 97.9,
          warningLevel: "warning",
          version: "2026.4 CN v2 Edition"
        }
      ],
      followUpPrompts: [
        "仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车怎么处理？",
        "如何通过手机 App 远程查看哨兵模式实时监控画面？",
        "Model Y 的车机系统更新 (OTA) 失败如何强制重启重试？"
      ]
    }
  },
  {
    turnIndex: 5,
    title: "第5轮 [胎压与拖车救援]：TPMS 复位校准与平板拖车模式",
    category: "问数",
    userPrompt: "仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车，如何正确开启‘运输模式’？",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 挂载手册章节: Section 13.08 轮胎维护与紧急道路救援。\n2. 分析 TPMS 蓝牙胎压传感器自动校准条件 (25km/h 行驶10分钟)。\n3. 严禁四轮着地拖拽警告 (Danger Warning) 与运输模式解锁操作步骤。",
      summary: "【TPMS 胎压校准与紧急拖车运输模式指南】\n1. TPMS 胎压报警复位：\n   ① 检查气压：在冷胎状态下，将四个轮胎充气至标准标准值（Model Y 推荐 2.9 bar / 42 psi）；\n   ② 重置校准：在车机点击‘控制’ -> ‘服务’ -> ‘胎压/轮毂配置’，选择对应的轮毂尺寸；\n   ③ 自动学习：以 25 km/h 以上车速持续行驶约 10 分钟，TPMS 蓝牙传感器将自动完成学习与报警复位；\n2. 拖车救援 - ‘运输模式’开启：\n   ⚠️ 极度危险警告：特斯拉切勿采用四轮着地的方式拖拽！牵引电机旋转会产生强大反向感应电动势，可能引发电控烧毁或火灾事故。救援必须使用平板拖车！\n   操作步骤：车辆在 P 挡且踩下刹车，在车机点击‘控制’ -> ‘服务’ -> 【拖车/运输模式】，按住屏幕上的‘进入运输模式’按钮直至图标变绿。此时驻车制动解除，车辆处于自由滚动状态，可安全拉上平板拖车板。",
      kpiCards: [
        { title: "推荐冷胎气压", value: "2.9 bar", unit: "42 psi", trend: "冷胎状态测定", trendType: "neutral" },
        { title: "TPMS 学习车速", value: "≥ 25 km/h", unit: "行驶 10 分钟", trend: "BLE 蓝牙传输", trendType: "up" },
        { title: "拖车方式要求", value: "平板拖车", unit: "严禁地拖", trend: "防止电机倒灌", trendType: "down" },
        { title: "运输模式解脱", value: "控制->服务", unit: "手刹解脱", trend: "确保 12V 供电", trendType: "neutral" }
      ],
      tablePreview: {
        columns: ["道路救援场景", "禁止操作项", "官方手册合规流程", "应急小技巧"],
        rows: [
          ["轮胎扎钉/亏气", "在低胎压下高档高速行驶", "充气至 2.9 bar 后，在车机重新选择轮毂尺寸并行驶 10 分钟", "可通过车载充气泵补气后行驶至最近轮胎店"],
          ["底盘电机故障/无法行驶", "使用绳索地拖拉行车辆", "联系 Tesla 官方救援或保险公司安排平板拖车", "进入‘运输模式’解除驻车手刹"],
          ["低压 12V 电池断电无法开机", "强行推车或搭线错误", "打开前备箱盖板，用外部 12V 电源搭线激活车机后开启运输模式", "前挡风玻璃保险丝盒内有前备箱应急搭线端子"]
        ]
      },
      policySuggestions: [
        "【强力警告】任何因四轮着地拖拽导致电机或高压逆变器损坏的事故，均不在特斯拉官方保修覆盖范围内！",
        "【气压受温度影响】外界气温每下降 6°C，胎压约下降 0.1 bar。冬季气温骤降时出现胎压报警属正常物理现象，补气后校准即可。"
      ],
      citationDocs: [
        {
          docId: "DOC-TESLA-TOW-13.08",
          title: "特斯拉车主手册 - 道路救援与维护",
          section: "Section 13.08 - 胎压监控系统 (TPMS) 与运输模式 (Transport Mode Instructions)",
          page: "P.402-405",
          excerpt: "警告：切勿在车轮接触地面的情况下拖拉 Model Y。否则可能会导致严重损坏和过热。这种损坏不在保修范围内。运输 Model Y 的唯一批准方法是使用平板拖车。如需开启运输模式，车辆必须处于 P 挡，点击控制 > 服务 > 拖车，按住‘进入运输模式’。轮胎气压调整后需在 25 km/h 以上行驶 10 分钟完成传感器自适应校准。",
          relevanceScore: 99.8,
          warningLevel: "danger",
          version: "2026.4 CN v2 Edition"
        }
      ],
      followUpPrompts: [
        "导出本次《特斯拉 Model Y 车主手册智能问答》5轮完整研讨报告",
        "查看车主手册关于三电系统 (电池/电机/电控) 8年保修条款",
        "重新开始一轮车主手册问答"
      ]
    }
  }
];

