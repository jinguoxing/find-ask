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

export const GOV_SEMANTIC_5_TURNS: ConversationTurnDemo[] = [
  {
    turnIndex: 1,
    title: "第1轮 [口径治理]：“高龄津贴申请”与“发放人数”口径冲突治理",
    category: "问数",
    userPrompt: "治理“高龄津贴申请人数”与“高龄补贴发放人数”的统计口径冲突，梳理业务定义差异与统一指标口径。",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 挂载政务元数据标准 ISO/IEC 11179 与 GB/T 38667。\n2. 检索市民政局 `t_mz_gljt_apply`（申请库）与市财政局/人社局 `t_rs_allowance_grant`（发放库）。\n3. 诊断语义冲突根因：民政统计口径为“社区/网格审查通过时点”，财政人社口径为“当月银行实际卡位清算成功人次”。异地结算时滞与当月注销人员导致 12.8% 的口径偏差。\n4. 构建统一数据标准指标：定义衍生原子指标 `IND_POP_GLJT_APPROVED`（应发核准数）与 `IND_POP_GLJT_PAID`（实发打款数），实现业务与统计口径对齐。",
      summary: "【政务语义口径治理完成】成功对齐“高龄津贴申请”与“高龄补贴发放”两大核心指标的业务口径与计算公式。消除了市民政局与市财政局/人社局之间 12.8% 的统计误导偏差，并建立了规范化计算模版与元数据映射规约。",
      kpiCards: [
        { title: "口径歧义偏差", value: "12.8%", unit: "已消除", trend: "下降 100%", trendType: "up" },
        { title: "涉及业务部门", value: "3", unit: "部门(民政/财政/人社)", trend: "全域对齐", trendType: "up" },
        { title: "标准指标构建", value: "2", unit: "项衍生标准", trend: "GB/T 认证", trendType: "neutral" },
        { title: "元数据合规率", value: "99.8", unit: "分 (S级)", trend: "符合 ISO 11179", trendType: "up" }
      ],
      chart: {
        type: "bar",
        title: "高龄津贴【申请核准数】vs【实际发放数】各区口径偏差及治理后对齐情况 (人)",
        xAxisKey: "district",
        dataKeys: ["applied", "actualGrant", "discrepancyResolved"],
        dataKeysLabels: { applied: "民政核准申请数(人)", actualGrant: "财政/人社实发数(人)", discrepancyResolved: "语义对齐后标准差异(人)" },
        data: [
          { district: "朝阳区", applied: 14200, actualGrant: 12500, discrepancyResolved: 0 },
          { district: "海淀区", applied: 13800, actualGrant: 12200, discrepancyResolved: 0 },
          { district: "丰台区", applied: 9500, actualGrant: 8400, discrepancyResolved: 0 },
          { district: "西城区", applied: 8200, actualGrant: 7300, discrepancyResolved: 0 },
          { district: "东城区", applied: 7600, actualGrant: 6800, discrepancyResolved: 0 }
        ]
      },
      tablePreview: {
        columns: ["标准指标编码", "统一指标名称", "归口管理部门", "业务统计口径规约", "SQL 算子计算公式", "歧义消除与说明"],
        rows: [
          ["IND_POP_GLJT_01", "高龄津贴核准应发人数", "市民政局/老龄办", "满80周岁且户籍在本地并经社区/网格初审及民政终审合格的人数", "COUNT(DISTINCT person_id) WHERE audit_status=3 AND age>=80", "排除审核中及户籍已迁移人员"],
          ["IND_POP_GLJT_02", "高龄津贴当月打款实发人次", "市人社局/市财政局", "当月通过社保卡/银行卡成功打款清算的 80 周岁以上老人人次", "COUNT(DISTINCT bank_account) WHERE grant_status=1 AND month=CURRENT_MONTH", "剔除银行退单与社保卡冻结注销项"],
          ["IND_POP_GLJT_03", "高龄津贴发放延迟率", "市数据治理中心", "核准应发但当月未能打款成功的比率", "(IND_POP_GLJT_01 - IND_POP_GLJT_02) / IND_POP_GLJT_01", "用于监控银行发放时延与异常清算"]
        ]
      },
      policySuggestions: [
        "【语义标注规约】要求民政与人社数据API在对外提供服务时，必须附带 `metric_code` 与 `statistical_timeline` 标签，禁止直接使用无修饰词的‘高龄津贴人数’。",
        "【跨部门数据联动】建议将清算退单数据每日定时回流至民政系统，形成‘申请-核准-拨付-异常处理’闭环。"
      ],
      citationDocs: [
        {
          docId: "STD-GOV-META-2026-001",
          title: "国家政务数据资源目录与元数据编制指南 (GB/T 38667)",
          section: "Section 5.3 - 跨部门通用指标语义冲突治理与命名规范",
          page: "P.45-48",
          excerpt: "跨部门数据指标命名应采用“主体+业务过程+度量词”的统一结构。凡涉及“申请”、“核准”、“拨付”、“实发”不同业务环节的指标，禁止直接使用简短模糊名称，须在指标定义中明确业务统计时点与算子规则。",
          relevanceScore: 99.8,
          warningLevel: "info",
          version: "GB/T 38667-2026"
        }
      ],
      followUpPrompts: [
        "建立民政“困难群众”与医保“低保救助人员”的跨部门数据语义映射表",
        "分析数仓表 dws_pop_elderly_allowance_di 的字段级语义血缘与质量规约",
        "诊断校验政务库表中的身份证号和统一社会信用代码合规性及脱敏"
      ]
    }
  },
  {
    turnIndex: 2,
    title: "第2轮 [术语映射]：民政与医保跨部门“困难群众/低保”语义对齐",
    category: "找数",
    userPrompt: "建立民政“困难群众”与医保“低保救助人员”的跨部门数据语义映射表，消除部门间“异名同义/同名异义”问题。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 解析市民政局 `t_mz_subsidy_low_income` 表与市医保局 `t_yb_rescue_member` 表结构。\n2. 发现术语差异：民政定义为 `low_income_type` (1:特困供养 2:最低生活保障 3:低保边缘)；医保定义为 `rescue_level` (A:全额资助 B:定额资助 C:临时救助)。\n3. 构建跨部门语义本体（Ontology Mapping），建立标准对照矩阵与值域（Value Domain）转换规则。",
      summary: "【跨部门语义映射表建立完成】成功厘清民政局与医保局对“低保救助”人群的分类映射关系，构建了标准的语义映射字典，支持一键式跨部门数据清洗与实时自动穿透关联。",
      kpiCards: [
        { title: "语义映射字典", value: "100%", unit: "对齐完成", trend: "自动映射", trendType: "up" },
        { title: "涉及术语编码", value: "18", unit: "个核心值域", trend: "标准一致", trendType: "neutral" },
        { title: "跨部门关联匹配率", value: "99.4%", unit: "唯一ID对齐", trend: "身份证加密", trendType: "up" },
        { title: "清洗规则更新", value: "12", unit: "条映射规则", trend: "自动生效", trendType: "up" }
      ],
      tablePreview: {
        columns: ["政务中台标准定义", "民政局系统字段 (t_mz)", "医保局系统字段 (t_yb)", "语义关系类型", "值域映射规则 (Value Mapping)"],
        rows: [
          ["公民身份全局HASH", "person_id_hash", "citizen_id_enc", "同义不同名 (Exact Match)", "可以直接作主键 JOIN 穿透"],
          ["救助身份类别", "low_income_type", "rescue_level", "分类口径转换 (Concept Mapping)", "民政1(特困)->医保A(全额)；民政2(低保)->医保B(定额)"],
          ["救助开始年月", "effective_date", "benefit_start_time", "同义不同格式 (Format Transform)", "YYYY-MM-DD <-> YYYYMMDD hh:mm:ss"],
          ["家庭月人均收入", "per_capita_income", "household_avg_income", "语义同义 (Synonym)", "统一映射为 Decimal(10,2) 标准单位(元)"]
        ]
      },
      policySuggestions: [
        "【统一标准字典建议】在政务数据共享交换中平台引入 `DICT_GOV_RESCUE_CATEGORY_2026` 统一代码表，彻底避免各部门自行硬编码映射。",
        "【医保三重保障】对齐后可自动触发“低保人员医保免缴”与“大病二次救助自动直达”惠民政策。"
      ],
      citationDocs: [
        {
          docId: "STD-GOV-MAP-2026-002",
          title: "国家政务数据共享交换语义映射标准",
          section: "Section 4.1 - 部门数据字典转换与本体映射规则",
          page: "P.82-85",
          excerpt: "对于跨部门同义不同名或分类层次不一致的数据项，应由数据治理中心建立中心化值域映射表（Centralized Value Mapping）。数据在经过共享交换总线时，通过语义转换引擎实时进行标准化封装。",
          relevanceScore: 98.6,
          warningLevel: "info",
          version: "GB/T 38667-2026"
        }
      ],
      followUpPrompts: [
        "分析数仓表 dws_pop_elderly_allowance_di 的字段级语义血缘与质量规约",
        "诊断校验政务库表中的身份证号和统一社会信用代码合规性及脱敏",
        "生成《政务统一数据标准指标字典 (v2026.1)》目录，并导出 API"
      ]
    }
  },
  {
    turnIndex: 3,
    title: "第3轮 [数据血缘]：数仓 `dws_pop_elderly_allowance_di` 字段级血缘穿透",
    category: "问数",
    userPrompt: "分析数仓表 dws_pop_elderly_allowance_di 从源系统到指标层的字段级语义血缘链路与数据质量校验规则。",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 解析数据仓库 4 层架构：ODS 贴源层 -> DWD 明细层 -> DWS 汇总层 -> ADS 指标应用层。\n2. 追溯目标表 `dws_pop_elderly_allowance_di` 核心字段 `total_subsidy_amount` 与 `elderly_count` 的 ETL 算法与来源。\n3. 提取完整字段血缘（Field-Level Lineage）关系，建立 ETL 质量监控诊断规则。",
      summary: "【字段级数据血缘穿透完成】已梳理出数仓表 `dws_pop_elderly_allowance_di` 的 4 层数据流转链路与 15 个关键字段的源头溯源拓扑，并挂载了 8 项实时质量探针规则。",
      kpiCards: [
        { title: "血缘链路层级", value: "4", unit: "层 (ODS->ADS)", trend: "全链路透明", trendType: "up" },
        { title: "溯源来源库表", value: "5", unit: "张源表", trend: "民政/公安/人社", trendType: "neutral" },
        { title: "字段映射节点", value: "28", unit: "个映射节点", trend: "100% 解析", trendType: "up" },
        { title: "质量监控探针", value: "8", unit: "项断言规则", trend: "实时预警中", trendType: "up" }
      ],
      tablePreview: {
        columns: ["目标层字段 (DWS)", "数据类型", "源系统与源库表 (ODS)", "源字段 (Source Field)", "ETL 转换规则与清洗算法"],
        rows: [
          ["person_id_hash", "VARCHAR(64)", "市民政局 t_mz_gljt_apply", "citizen_id", "SHA256(UPPER(TRIM(citizen_id)) + SALT_2026) 动态脱敏加密"],
          ["age", "INT", "市公安局 t_pop_base_info", "birth_date", "DATEDIFF(YEAR, birth_date, CURRENT_DATE()) 自动计算精确年龄"],
          ["subsidy_standard", "DECIMAL(10,2)", "市民政局 t_mz_policy_std", "monthly_amount", "CASE WHEN age>=90 THEN 500 WHEN age>=80 THEN 300 ELSE 0 END"],
          ["grant_flag", "TINYINT", "市人社局 t_rs_allowance_grant", "grant_status", "IF(grant_status=1 AND bank_ack=200, 1, 0) 拨付成功校验"],
          ["district_code", "VARCHAR(12)", "国家行政区划代码", "admin_code", "LEFT(admin_code, 6) 归一化为标准 6 位区县代码"]
        ]
      },
      policySuggestions: [
        "【血缘防断裂预警】发现源系统 `t_mz_gljt_apply` 字段 `citizen_id` 存在 0.02% 的空格与全角字符，已在 DWD 洗线层配置自动 TRIM 和 ASCII 归一化。",
        "【实时数据探针】配置了每日 03:00 自动勾稽比对：`ADS指标层汇总值 == SUM(DWS单条记录)`，差异 > 0 时阻断发布并告警。"
      ],
      citationDocs: [
        {
          docId: "STD-GOV-LINE-2026-003",
          title: "政务数据中台数据血缘与元数据管理技术规范",
          section: "Section 6.2 - 字段级血缘自动化提取与质量探针配置",
          page: "P.112-115",
          excerpt: "数据仓库中所有面向领导决策和对外开放的 ADS/DWS 数据表，必须具备直达 ODS 贴源层字段的自动化血缘链路，且元数据变更时须支持下游影响分析（Impact Analysis）。",
          relevanceScore: 99.2,
          warningLevel: "info",
          version: "GB/T 38667-2026"
        }
      ],
      followUpPrompts: [
        "诊断校验政务库表中的身份证号和统一社会信用代码合规性及脱敏",
        "生成《政务统一数据标准指标字典 (v2026.1)》目录，并导出 API",
        "查看数据质量告警历史与阻断日志记录"
      ]
    }
  },
  {
    turnIndex: 4,
    title: "第4轮 [规范诊断]：身份证/统一社会信用代码合规诊断与 SM4 脱敏",
    category: "找数",
    userPrompt: "诊断校验政务库表中的身份证号、统一社会信用代码合规性，并检查国密 SM4 动态脱敏加密规范。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 挂载 GB 11643-1999《公民身份号码》校验和算法 (ISO 7064:1983.MOD 11-2) 与 GB 32100-2015《法人和其他组织统一社会信用代码》MOD 31 算法。\n2. 扫描 `t_pop_base_info` 与 `t_corp_master` 库表中的 125,000 条样本记录。\n3. 输出合规诊断与格式畸变报告，验证国密 SM4 脱敏遮蔽规则 (`110101********1234`)。",
      summary: "【政务标识合规诊断与 SM4 脱敏校验完成】对 12.5 万条政务主数据完成了合规性扫描，纠偏了 12 条格式异常记录，国密 SM4 动态掩码脱敏生效率达到 100%。",
      kpiCards: [
        { title: "扫描诊断记录", value: "12.5", unit: "万条数据", trend: "100% 覆盖", trendType: "up" },
        { title: "校验和合规率", value: "99.99%", unit: "符合国标", trend: "自动纠偏", trendType: "up" },
        { title: "格式异常记录", value: "12", unit: "条已修复", trend: "录入问题", trendType: "down" },
        { title: "SM4 脱敏生效", value: "100%", unit: "国密算法", trend: "安全等保三级", trendType: "up" }
      ],
      tablePreview: {
        columns: ["数据主体类型", "关键标识字段", "国标校验规则算法", "诊断结果与异常项", "国密 SM4 动态脱敏掩码效果"],
        rows: [
          ["自然人身份", "citizen_id", "GB 11643 校验和 (Mod 11-2)", "扫描 100,000 条，11 条末尾 X 未大写已自动转换，1 条长度不足 18 位被卡拦截", "110108 1985**** 3412"],
          ["法人/企业", "uscc_code", "GB 32100 统一信用码 (Mod 31)", "扫描 25,000 条，1 条存在全角英文字符已规范化归一", "91110108 ****** 9A8X"],
          ["行政区划", "admin_code", "GB/T 2260 六位行政区划码", "100% 合规，均属于最新 2026 款北京市行政区划名录", "110105 (朝阳区)"],
          ["手机号码", "mobile_phone", "GB/T 33846 移动通信网号段", "检测到 3 条 12 位多余零前缀已去除", "138 **** 8899"]
        ]
      },
      policySuggestions: [
        "【前端输入卡控】建议在政务网格录入端部署组件级 MOD11-2 与 MOD31 实时校验器，从源头杜绝非法身份证号与信用代码落库。",
        "【分级分类脱敏】对内部数据运维人员展示遮蔽掩码，对司法执法等特殊调证场景提供凭证解密审计管道。"
      ],
      citationDocs: [
        {
          docId: "STD-GOV-SEC-2026-004",
          title: "国家政务数据安全与隐私保护规约 (GB/T 35273 & 国密 SM4)",
          section: "Section 8.1 - 敏感个人信息遮蔽与国密加密传输规范",
          page: "P.150-154",
          excerpt: "政务信息系统中涉及身份证件号码、银行账号、生物特征等高度敏感字段，在非授权展示场景下必须采取动态遮蔽脱敏。存储与传输过程应优先采用国密 SM4 对称加密算法。",
          relevanceScore: 99.5,
          warningLevel: "warning",
          version: "GB/T 35273-2026"
        }
      ],
      followUpPrompts: [
        "生成《政务统一数据标准指标字典 (v2026.1)》目录，并导出 API",
        "查看国密 SM4 动态解密审批流程与安全审计日志",
        "重新开始一轮政务语义治理研讨"
      ]
    }
  },
  {
    turnIndex: 5,
    title: "第5轮 [指标字典]：导出《政务统一数据标准指标字典 (v2026.1)》及 API",
    category: "问数",
    userPrompt: "生成《政务统一数据标准指标字典 (v2026.1)》目录，并导出 API 语义标准化查询接口。",
    assistantResult: {
      intent: "问数",
      thoughtProcess: "1. 汇总前 4 轮治理成果，编排《政务统一数据标准指标字典 (v2026.1)》。\n2. 包含 5 大核心业务域：老龄人口、民政救助、社会保险、经济运行、公共卫生。\n3. 生成开放 API 标准定义（OpenAPI 3.0 / JSON）及 Python/Java SDK 接入代码范例。",
      summary: "【《政务统一数据标准指标字典 (v2026.1)》发布】已成功生成规范化指标字典，覆盖全市 3,500+ 标准政务指标，并同步导出了标准的 RESTful 语义查询 API 接口与 OpenAPI 规约文档。",
      kpiCards: [
        { title: "标准指标总数", value: "3,520", unit: "个规约指标", trend: "100% 校验", trendType: "up" },
        { title: "覆盖业务主题", value: "12", unit: "大政务主题", trend: "全域覆盖", trendType: "up" },
        { title: "RESTful API", value: "24", unit: "个标准化接口", trend: "秒级响时", trendType: "neutral" },
        { title: "导出文件格式", value: "PDF/Excel/JSON", unit: "多端兼容", trend: "即拿即用", trendType: "up" }
      ],
      tablePreview: {
        columns: ["主题分类", "标准指标编码", "标准中文名称", "数据类型与单位", "标准 API 接口 Endpoint", "安全访问等级"],
        rows: [
          ["老龄服务", "IND_POP_GLJT_01", "高龄津贴核准应发人数", "Integer (人)", "GET /api/v1/semantic/metrics/IND_POP_GLJT_01", "政务网格专网级别"],
          ["民政救助", "IND_POP_LOW_02", "最低生活保障在册户数", "Integer (户)", "GET /api/v1/semantic/metrics/IND_POP_LOW_02", "政务网格专网级别"],
          ["医疗保障", "IND_MED_RESCUE_03", "医疗救助二次报销总额", "Decimal(12,2) (元)", "GET /api/v1/semantic/metrics/IND_MED_RESCUE_03", "机密级 (签名鉴权)"],
          ["经济运行", "IND_ECO_GDP_01", "规模以上工业增加值增速", "Decimal(5,2) (%)", "GET /api/v1/semantic/metrics/IND_ECO_GDP_01", "公开级 (开放接口)"],
          ["社保就业", "IND_EMP_UNEMP_02", "城镇登记失业人员再就业数", "Integer (人)", "GET /api/v1/semantic/metrics/IND_EMP_UNEMP_02", "政务网格专网级别"]
        ]
      },
      policySuggestions: [
        "【版本迭代机制】每季度由大数据局组织开展一次指标字典评审，新增或变更指标需提前 15 天在数据中台发布 `Deprecation` 预警。",
        "【API 鉴权与审计】所有 API 调用必须携带 `X-Gov-Signature` 国密签名令牌，后台自动记录流向与数据量级日志。"
      ],
      citationDocs: [
        {
          docId: "STD-GOV-DICT-2026-005",
          title: "国家政务数据中台指标字典编制与 API 开放规范",
          section: "Section 10.4 - 统一语义 RESTful API 设计标准与服务契约",
          page: "P.202-206",
          excerpt: "指标字典是政务数据共享交换与智能分析的基础底座。对外提供的 API 应遵循 OpenAPI 3.0 规范，响应体中须包含 data, metric_metadata, data_quality_score 及 citation 三部分信息。",
          relevanceScore: 99.9,
          warningLevel: "info",
          version: "GB/T 38667-2026"
        }
      ],
      followUpPrompts: [
        "导出《政务统一数据标准指标字典 (v2026.1)》完整 PDF/Excel 文件",
        "测试调用 API 接口 `GET /api/v1/semantic/metrics/IND_POP_GLJT_01`",
        "重新开始一轮政务语义治理研讨"
      ]
    }
  }
];

export const POPULATION_FIND_DATA_5_SCENARIOS: ConversationTurnDemo[] = [
  {
    turnIndex: 101,
    title: "场景1 [找数]：查找新生儿 / 儿童数据",
    category: "找数",
    userPrompt: "想分析闵行区近三年新生儿情况，有哪些数据？",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 解析自然语言需求：【闵行区】+【近三年新生儿/儿童情况】。\n2. 在政务数据共享总库与卫健/公安专网目录中检索新生儿及母婴相关数据资产。\n3. 定位核心表源：出生人口表、新生儿户籍申报表、母婴关系表及年龄分段指标表。\n4. 构建实体链路：产妇/自然人(Person) ➔ 出生医学证明(BirthCert) ➔ 新生儿登记(Newborn) ➔ 母婴关系(MaternalChild) ➔ 年龄分段(AgeSegment)。",
      summary: "已为您在政务数据资产共享平台中检索到闵行区近三年新生儿及儿童分析所需的 4 核心数据资产，涵盖出生登记、户籍申报、母婴健康与学龄前年龄段分配指标。",
      dataRelationshipFlow: [
        "自然人/产妇 (Person)",
        "出生医学证明 (BirthCert)",
        "新生儿户籍登记 (Newborn)",
        "母婴相关人口关系 (MaternalChild)",
        "年龄分段人口指标 (AgeSegment)"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_birth_info",
          tableComment: "出生人口与出生医学证明表",
          category: "卫健专题",
          dept: "市卫健委 / 闵行区妇幼保健所",
          reason: "记录新生儿出生日期、性别、出生体重、分娩机构及父母加密身份，用于精准统计近三年新生儿出生总量。",
          relationChain: "产妇 ➔ 出生医学证明 ➔ 新生儿",
          keyFields: ["birth_cert_no_hash", "mother_id", "father_id", "birth_date", "birth_hospital", "gender"]
        },
        {
          tableName: "t_pop_newborn_registration",
          tableComment: "新生儿户籍申报与登记明细表",
          category: "公安人口",
          dept: "市公安局闵行分局人口办",
          reason: "包含新生儿报户口登记时间、户籍落口街镇（莘庄/七宝/虹桥等）、户主关系与地址编号，反映实际入户人口。",
          relationChain: "出生证明 ➔ 新生儿户籍申报 ➔ 街镇落户",
          keyFields: ["newborn_id", "huji_street_code", "huji_type", "register_date", "household_id"]
        },
        {
          tableName: "t_pop_maternal_child_rel",
          tableComment: "母婴相关人口关系与健康随访表",
          category: "卫健/妇幼",
          dept: "闵行区卫健委 / 社区卫生服务中心",
          reason: "绑定母子/母女亲缘关系网络，记录0-3岁婴幼儿建卡随访、疫苗接种与产后访视记录。",
          relationChain: "新生儿 ➔ 母婴亲缘网络 ➔ 社区健康管理",
          keyFields: ["mother_id", "child_id", "kinship_type", "vaccine_status", "health_card_no"]
        },
        {
          tableName: "t_pop_age_segment_index",
          tableComment: "年龄分段人口指标汇总表 (0-3岁/0-6岁)",
          category: "大数据综合",
          dept: "闵行区大数据中心 / 统计局",
          reason: "按街镇/居村委维度的0-3岁托育期与0-6岁学龄前期人口统计快照，便于宏观动态趋势分析。",
          relationChain: "街镇/社区 ➔ 0-3岁托育/0-6岁学龄前 ➔ 指标聚合",
          keyFields: ["district_code", "street_name", "age_0_3_count", "age_4_6_count", "stat_year"]
        }
      ],
      datasetInfo: {
        tableName: "t_pop_birth_info",
        tableComment: "出生人口与出生医学证明表",
        dataCount: 42850,
        updateFrequency: "每日实时推送 (医院连线)",
        securityLevel: "政务Ⅱ级 (身份加密脱敏)",
        department: "闵行区卫健委 / 妇幼保健所",
        fields: [
          { name: "birth_cert_hash", type: "VARCHAR(64)", comment: "出生医学证明哈希", desensitized: true, example: "BC_2024_M8910" },
          { name: "mother_id_hash", type: "VARCHAR(64)", comment: "母亲加密身份证号", desensitized: true, example: "M_3101121992***" },
          { name: "gender", type: "VARCHAR(8)", comment: "新生儿性别", desensitized: false, example: "男" },
          { name: "birth_date", type: "DATE", comment: "出生年月日", desensitized: false, example: "2025-06-12" },
          { name: "hospital_name", type: "VARCHAR(128)", comment: "分娩医疗机构", desensitized: false, example: "复旦大学附属妇产科医院闵行分院" },
          { name: "residence_street", type: "VARCHAR(64)", comment: "母亲居住街镇", desensitized: false, example: "莘庄镇" }
        ]
      },
      kpiCards: [
        { title: "推荐数据资产", value: "4", unit: "张核心表", trend: "语义已对齐", trendType: "up" },
        { title: "近三年闵行新生儿", value: "3.24", unit: "万人", trend: "2023-2025合集", trendType: "neutral" },
        { title: "建卡随访覆盖率", value: "99.1", unit: "%", trend: "质量优良", trendType: "up" }
      ],
      tablePreview: {
        columns: ["推荐资产表名", "资产名称", "提供部门", "核心作用与推荐理由", "包含核心字段"],
        rows: [
          ["t_pop_birth_info", "出生人口信息表", "闵行区卫健委", "记录出生时间、性别、医院与母亲户籍，精准计算出生率", "birth_date, mother_id, gender"],
          ["t_pop_newborn_registration", "新生儿登记信息表", "闵行公安分局", "记录报户口时间与街镇落户分布，测算常住留存率", "newborn_id, huji_street_code"],
          ["t_pop_maternal_child_rel", "母婴相关人口关系表", "社区卫生服务中心", "绑定母子代际亲属链，用于妇幼保健与幼托资源匹配", "mother_id, child_id, kinship"],
          ["t_pop_age_segment_index", "年龄分段人口指标表", "闵行区大数据中心", "提供0-3岁托育与0-6岁学龄前人口聚合指标", "age_0_3_count, street_name"]
        ]
      },
      sql: `-- 闵行区近三年新生儿按街镇聚合查询示例
SELECT 
  residence_street AS 街镇名称,
  COUNT(birth_cert_hash) AS 近三年新生儿总量,
  SUM(CASE WHEN gender='男' THEN 1 ELSE 0 END) AS 男婴数,
  SUM(CASE WHEN gender='女' THEN 1 ELSE 0 END) AS 女婴数
FROM t_pop_birth_info
WHERE birth_date >= '2023-01-01' AND district_name = '闵行区'
GROUP BY residence_street
ORDER BY 近三年新生儿总量 DESC;`,
      policySuggestions: [
        "针对莘庄镇、七宝镇等新生儿高密度区域，建议联合教委与卫健委预研0-3岁托育机构学位布局。",
        "利用母婴关系链表与公安落户表实时对比，排查未及时报户口的新生儿，提升儿童保健服务主动触达率。"
      ],
      followUpPrompts: [
        "分析闵行区各街镇近三年新生儿男女比例与月度变化趋势",
        "预测未来三年闵行区幼升小学龄儿童分布与学校学位供需",
        "申请导出《闵行区新生儿与妇幼健康数据资产清单.xlsx》"
      ]
    }
  },
  {
    turnIndex: 102,
    title: "场景2 [找数]：老龄化服务分析",
    category: "找数",
    userPrompt: "我要分析闵行区老龄化情况，需要哪些数据？",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 识别分析场景：【闵行区老龄化情况与服务分析】。\n2. 根据用户要求的四级下钻图谱（自然人对象 ➔ 老年人口标签 ➔ 街镇人口分布 ➔ 养老服务资源）开展元数据编排。\n3. 输出完整的资产清单、推荐理由与数据流转拓扑关系。",
      summary: "已为您构建闵行区老龄化分析数据资产推荐阵列。通过“自然人基础对象 ➔ 老年人口多维标签 ➔ 街镇空间分布 ➔ 养老服务资源”4 级链路，全方位覆盖老龄化态势评估与养老服务供给决策。",
      dataRelationshipFlow: [
        "自然人对象 (Person)",
        "老年人口标签 (ElderlyTags)",
        "街镇人口分布 (StreetDist)",
        "养老服务资源 (ServiceResources)"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_base_info",
          tableComment: "自然人基础库 (常住与户籍人口)",
          category: "基础人口",
          dept: "市公安局 / 闵行大数据中心",
          reason: "作为最底层【自然人对象】，提供身份证哈希、出生年月、户籍地与常住地，用于精准判定 60 岁以上及 80 岁以上人口基数。",
          relationChain: "自然人唯一标识 ➔ 基础属性",
          keyFields: ["person_id", "birth_date", "huji_district", "residence_district", "residence_street"]
        },
        {
          tableName: "t_pop_elderly_tags",
          tableComment: "老年人口多维画像与标签明细表",
          category: "民政/画像",
          dept: "闵行区民政局 / 老龄办",
          reason: "打上【老年人口标签】，包含高龄、独居、失能失智、特困救助、健康慢病与退休状态，用于精准人群分类。",
          relationChain: "自然人对象 ➔ 动态画像标签",
          keyFields: ["person_id", "is_60_plus", "is_80_high_age", "disability_level", "is_living_alone"]
        },
        {
          tableName: "t_pop_street_district_dist",
          tableComment: "街镇与社区人口空间分布及结构表",
          category: "网格治理",
          dept: "闵行区网格化综合管理中心",
          reason: "汇总【街镇人口分布】，计算闵行区 14 个街镇/莘庄/七宝/虹桥的老龄化率、高龄比例与人口密度。",
          relationChain: "老年标签 ➔ 街镇/社区空间聚合",
          keyFields: ["street_code", "street_name", "total_pop", "elderly_pop", "aging_rate"]
        },
        {
          tableName: "t_pop_elderly_services",
          tableComment: "养老服务资源与高龄津贴发放综合表",
          category: "民政资源",
          dept: "市民政局 / 闵行区养老服务中心",
          reason: "匹配【养老服务资源】，包含养老院床位数、日间照料中心、社区长者食堂分布及高龄津贴打卡发放记录。",
          relationChain: "街镇分布 ➔ 养老设施与服务供给匹配",
          keyFields: ["institution_id", "street_name", "bed_capacity", "canteen_count", "monthly_subsidy_total"]
        }
      ],
      datasetInfo: {
        tableName: "t_pop_elderly_tags",
        tableComment: "老年人口多维画像与标签明细表",
        dataCount: 312000,
        updateFrequency: "每周动态更新",
        securityLevel: "政务Ⅲ级 (脱敏级)",
        department: "闵行区民政局老龄办",
        fields: [
          { name: "person_id", type: "VARCHAR(64)", comment: "人口唯一脱敏主键", desensitized: true, example: "P_MH_992101" },
          { name: "age", type: "INT", comment: "周岁年龄", desensitized: false, example: "83" },
          { name: "aging_category", type: "VARCHAR(32)", comment: "老龄分段(60-79岁/80岁+)", desensitized: false, example: "80岁以上高龄" },
          { name: "is_living_alone", type: "TINYINT", comment: "是否独居空巢(1/0)", desensitized: false, example: "1" },
          { name: "health_status", type: "VARCHAR(32)", comment: "健康与失能状况", desensitized: false, example: "轻度失能" },
          { name: "residence_street", type: "VARCHAR(64)", comment: "常住街镇", desensitized: false, example: "七宝镇" }
        ]
      },
      kpiCards: [
        { title: "推荐数据资产", value: "4", unit: "大核心表", trend: "4级拓扑对齐", trendType: "up" },
        { title: "闵行60岁+人口", value: "31.2", unit: "万人", trend: "老龄化率24.5%", trendType: "up" },
        { title: "养老床位总数", value: "1.42", unit: "万张", trend: "每千人45.5张", trendType: "neutral" }
      ],
      tablePreview: {
        columns: ["链路层级", "推荐资产表", "数据对象", "推荐理由与业务价值"],
        rows: [
          ["1. 自然人对象", "t_pop_base_info", "人口基础身份库", "提供全量人口基础底座，确定年龄与常住居住地"],
          ["2. 老年人口标签", "t_pop_elderly_tags", "高龄/失能/独居标签", "打上高龄、失能、独居、低保等多维标签，精准刻画画像"],
          ["3. 街镇人口分布", "t_pop_street_district_dist", "街镇/社区空间聚合", "按闵行 14 个街镇计算老龄化率分布，识别高龄热点区域"],
          ["4. 养老服务资源", "t_pop_elderly_services", "养老设施与津贴表", "匹配养老床位、长者食堂与补贴，计算公共资源供需缺口"]
        ]
      },
      sql: `-- 闵行区各街镇老龄化率与养老设施资源匹配度查询
SELECT 
  s.street_name AS 街镇名称,
  s.total_pop AS 常住总人口,
  s.elderly_pop AS 60岁以上老人,
  ROUND(s.elderly_pop * 100.0 / s.total_pop, 2) AS 老龄化率_百分比,
  COALESCE(r.bed_capacity, 0) AS 养老床位数
FROM t_pop_street_district_dist s
LEFT JOIN (
  SELECT street_name, SUM(bed_capacity) AS bed_capacity 
  FROM t_pop_elderly_services GROUP BY street_name
) r ON s.street_name = r.street_name
WHERE s.district_name = '闵行区'
ORDER BY 老龄化率_百分比 DESC;`,
      policySuggestions: [
        "针对七宝镇、古美路街道等老龄化率突破 28% 的区域，建议结合人口标签优先布局社区嵌入式长者照护之家。",
        "利用独居空巢与高龄标签表，与水电气感知数据联动，建立高龄独居老人居家安全智能关爱预警系统。"
      ],
      followUpPrompts: [
        "计算闵行区各街镇每千名老年人拥有的养老床位与长者食堂供给缺口",
        "导出闵行区 14 个街镇老龄化程度与高龄津贴发放对比透视图",
        "检索闵行区困难救助与低保残疾老年人数据资产"
      ]
    }
  },
  {
    turnIndex: 103,
    title: "场景3 [找数]：人口 + 教育",
    category: "找数",
    userPrompt: "预测未来三年学龄儿童分布。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 解析业务场景：【人口 + 教育】跨部门协同找数场景。\n2. 人口端：获取 0-6 岁儿童年龄分段、出生推算及幼升小预测人口。\n3. 教育端：调取幼儿园/小学学校资源、校舍学位承载力与师资配置。\n4. 空间端：关联学区划片与居住小区人口映射，构建未来 3 年学龄人口供需预测模型。",
      summary: "已成功跨卫健、公安、教委和规资 4 大部门，为您匹配“预测未来三年学龄儿童分布”所需的【人口 + 教育】融合数据资产。可支持 2026-2028 年幼升小、小升初学龄人口规模演变与学位缺口精准预警。",
      dataRelationshipFlow: [
        "人口: 儿童年龄分段/幼升小预测",
        "教育: 幼儿园/小学学校学位资源",
        "空间: 学区划片与小区居住映射",
        "融合: 未来三年学龄供给匹配模型"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_child_age_distribution",
          tableComment: "0-12岁儿童年龄结构与幼升小预测人口表",
          category: "人口预测",
          dept: "市公安局人口办 / 市大数据中心",
          reason: "包含 0-3 岁托班期、4-6 岁幼升小期及 7-12 岁小学期儿童精确推算人数，是预测学龄分布的核心人口底座。",
          relationChain: "出生与户籍数据 ➔ 儿童年龄单岁演算 ➔ 未来3年学龄人口",
          keyFields: ["child_id", "birth_year_month", "exact_age", "forecast_school_year", "residence_community"]
        },
        {
          tableName: "t_edu_school_resources",
          tableComment: "中小学与幼儿园学校资源及学位承载表",
          category: "教育资源",
          dept: "市教委 / 区教育局基教科",
          reason: "提供学校名称、办学性质（公办/民办）、现有在校生数、设计最大学位承载力及年招生计划数。",
          relationChain: "学校地理标识 ➔ 设计学位容量 ➔ 动态在校生数",
          keyFields: ["school_id", "school_name", "school_type", "max_degree_capacity", "current_enrolled_count"]
        },
        {
          tableName: "t_pop_school_district_mapping",
          tableComment: "学区划片网格与社区人口空间映射表",
          category: "规资/空间",
          dept: "区规划资源局 / 区教育局",
          reason: "绑定住宅小区、社区网格与对口公办小学/幼儿园划片边界，将人口预测精准下沉至具体学区。",
          relationChain: "社区居民网格 ➔ 学区对口边界 ➔ 空间学龄人口映射",
          keyFields: ["community_id", "community_name", "school_id", "primary_school_district", "street_code"]
        }
      ],
      datasetInfo: {
        tableName: "t_pop_child_age_distribution",
        tableComment: "0-12岁儿童年龄结构与幼升小预测人口表",
        dataCount: 185000,
        updateFrequency: "每月滚动推算",
        securityLevel: "政务Ⅱ级 (分类管控)",
        department: "市大数据中心 / 区教育局",
        fields: [
          { name: "community_id", type: "VARCHAR(64)", comment: "居住小区编码", desensitized: false, example: "COMM_310112_008" },
          { name: "age_6_next_year", type: "INT", comment: "明年满6岁幼升小预测人数", desensitized: false, example: "142" },
          { name: "age_6_in_2_years", type: "INT", comment: "后年满6岁幼升小预测人数", desensitized: false, example: "138" },
          { name: "age_6_in_3_years", type: "INT", comment: "大后年满6岁预测人数", desensitized: false, example: "125" },
          { name: "street_name", type: "VARCHAR(64)", comment: "所属街镇", desensitized: false, example: "虹桥镇" }
        ]
      },
      kpiCards: [
        { title: "人口+教育融合表", value: "3", unit: "张关键表", trend: "跨部门协同", trendType: "up" },
        { title: "预测学龄儿童", value: "18.5", unit: "万人", trend: "2026-2028周期", trendType: "neutral" },
        { title: "学位对齐精准度", value: "96.8", unit: "%", trend: "基于社区网格", trendType: "up" }
      ],
      tablePreview: {
        columns: ["推荐维度", "数据资产表名", "归属部门", "推荐理由与核心作用"],
        rows: [
          ["人口维度", "t_pop_child_age_distribution", "市公安局/大数据中心", "提供单岁儿童增长及未来 1-3 年幼升小预测基数"],
          ["教育维度", "t_edu_school_resources", "区教育局基教科", "汇总学校最大学位容量、在校生数与师资班额"],
          ["空间维度", "t_pop_school_district_mapping", "区规资局/教育局", "实现小区楼栋到对口学区的划片映射，算清局部缺口"]
        ]
      },
      sql: `-- 未来三年各街镇幼升小适龄儿童与现有学校学位预测对比
SELECT 
  p.street_name AS 街镇,
  SUM(p.age_6_next_year) AS 明年幼升小预测人数,
  SUM(p.age_6_in_2_years) AS 后年幼升小预测人数,
  SUM(p.age_6_in_3_years) AS 大后年幼升小预测人数,
  SUM(s.max_degree_capacity - s.current_enrolled_count) AS 现有可承载剩余学位
FROM t_pop_child_age_distribution p
LEFT JOIN t_pop_school_district_mapping m ON p.community_id = m.community_id
LEFT JOIN t_edu_school_resources s ON m.school_id = s.school_id
GROUP BY p.street_name
ORDER BY 明年幼升小预测人数 DESC;`,
      policySuggestions: [
        "对未来 2 年幼升小人口增幅超过 15% 的热点板块，建议教育局提早规划“借场地增班”或扩建校舍方案。",
        "将人口推算结果与新建住宅小区竣工交付时间表联动，动态调整公办学校学区划片预警。"
      ],
      followUpPrompts: [
        "预测未来三年各区公办小学学位缺口与扩建需求清单",
        "按学区划片导出儿童人口密度与对口学校分布地图",
        "查询全市 0-3 岁托育机构资源与托位满足率"
      ]
    }
  },
  {
    turnIndex: 104,
    title: "场景4 [找数]：找家庭成员关系",
    category: "找数",
    userPrompt: "我要分析家庭结构。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 识别图谱分析目标：【家庭结构与户籍代际关系】。\n2. 确定逻辑模型对象：主实体为 `Family`（家庭户），关系实体为 `Person | FamilyRelation | Person` 三代代际网络。\n3. 在政务人口专库中检索公安户籍户室表、亲属关系图谱表及同住常住人口表。",
      summary: "已为您检索到用于分析家庭结构（单身户/核心家庭/三代同堂/空巢老人家户）的 3 张核心关联资产表，支持以 `Family` 为核心对象构建 `Person | FamilyRelation | Person` 亲属关系图谱。",
      dataRelationshipFlow: [
        "家庭户对象 (Family)",
        "代际关系 (Person | FamilyRelation | Person)",
        "数据流: 家庭成员 / 户籍关系 / 同住亲属"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_family_master",
          tableComment: "家庭户对象主表 (Family)",
          category: "户籍主表",
          dept: "市公安局人口基地",
          reason: "定义【Family 对象】，包含户号加密 ID、户别（家庭户/集体户）、户主姓名哈希、户籍地址及家庭常住人口总数。",
          relationChain: "家庭户唯一标识 ➔ 户结构类型",
          keyFields: ["family_id_hash", "household_type", "head_person_id", "member_count", "district_code"]
        },
        {
          tableName: "t_pop_family_relation_net",
          tableComment: "家庭成员与代际亲属关系网络表 (FamilyRelation)",
          category: "图谱关系",
          dept: "市公安局 / 市民政局",
          reason: "构建【Person | FamilyRelation | Person】关系网，记录户主与成员关系（配偶/父子/母女/祖孙/兄弟姊妹）。",
          relationChain: "主体人(Person A) ➔ 关系类型 ➔ 客体人(Person B)",
          keyFields: ["from_person_id", "to_person_id", "relation_type", "is_direct_kinship", "valid_status"]
        },
        {
          tableName: "t_pop_huji_kinship",
          tableComment: "户籍与居住地址同住亲属表",
          category: "居住关系",
          dept: "市公安局 / 网格治理中心",
          reason: "补充常住同住关系，即使户籍未在同一户口簿，只要同住一处即纳入同住家庭结构分析。",
          relationChain: "同一居住地址 ➔ 实际同住关系判定",
          keyFields: ["family_id_hash", "person_id", "relation_to_head", "is_cohabiting"]
        }
      ],
      datasetInfo: {
        tableName: "t_pop_family_relation_net",
        tableComment: "家庭成员与代际亲属关系网络表",
        dataCount: 4580000,
        updateFrequency: "实时更新 (户籍变动/结婚登记)",
        securityLevel: "政务Ⅰ级 (高敏感加密)",
        department: "市公安局 / 市民政局",
        fields: [
          { name: "from_person_id", type: "VARCHAR(64)", comment: "主体人员哈希", desensitized: true, example: "P_HEAD_8820" },
          { name: "to_person_id", type: "VARCHAR(64)", comment: "关联人员哈希", desensitized: true, example: "P_MEMBER_9102" },
          { name: "relation_type", type: "VARCHAR(32)", comment: "亲属关系", desensitized: false, example: "配偶 / 父子 / 祖孙" },
          { name: "generation_gap", type: "INT", comment: "代际差(0:同代/1:父子/2:祖孙)", desensitized: false, example: "1" }
        ]
      },
      kpiCards: [
        { title: "家庭结构核心表", value: "3", unit: "张图谱表", trend: "图数据库结构", trendType: "up" },
        { title: "登记家庭户总量", value: "720.4", unit: "万户", trend: "平均每户2.3人", trendType: "neutral" },
        { title: "三代同堂占比", value: "14.2", unit: "%", trend: "持续小型化", trendType: "down" }
      ],
      tablePreview: {
        columns: ["关系节点/对象", "推荐数据资产", "关系拓扑表达", "分析应用场景"],
        rows: [
          ["Family 对象", "t_pop_family_master", "Family 主体属性", "分析单身户、二人户、多代同堂户规模与分布"],
          ["Person-Relation-Person", "t_pop_family_relation_net", "Person A ➔ 关系 ➔ Person B", "穿透三代直系亲属与旁系亲属网，构建抚养比图谱"],
          ["同住居住关系", "t_pop_huji_kinship", "地址 ➔ 实际同住人", "识别“户不离人/人在户不在”的实际家庭生活结构"]
        ]
      },
      sql: `-- 家庭结构分类统计 (单身户、两代核心家庭、三代同堂等)
SELECT 
  CASE 
    WHEN member_count = 1 THEN '1. 单身独居户'
    WHEN member_count = 2 THEN '2. 两人户(夫妻/单亲)'
    WHEN member_count = 3 THEN '3. 三人核心家庭'
    WHEN member_count >= 4 AND has_grandparent = 1 THEN '4. 三代同堂多代户'
    ELSE '5. 其他多成员家户'
  END AS 家庭结构类型,
  COUNT(family_id_hash) AS 户数,
  ROUND(COUNT(family_id_hash) * 100.0 / SUM(COUNT(family_id_hash)) OVER(), 2) AS 占比_百分比
FROM t_pop_family_master
GROUP BY 家庭结构类型
ORDER BY 户数 DESC;`,
      policySuggestions: [
        "家庭户小型化趋势显著（平均 2.3 人/户），建议住房保障部门增加一居室与小户型保障性租赁住房供给。",
        "利用三代同堂与纯老年家户图谱，为老龄抚养负担沉重的多代同堂家庭提供税收抵扣与长护险倾斜。"
      ],
      followUpPrompts: [
        "生成全市单身青年户与独居老人户的空间热力分布图",
        "分析二孩及三孩家庭的居住面积与学区资源匹配状况",
        "导出家庭关系网络 JSON 拓扑格式用于 Graph 图数据库"
      ]
    }
  },
  {
    turnIndex: 105,
    title: "场景5 [找数]：找重点区域人口压力数据",
    category: "找数",
    userPrompt: "哪些区域人口增长快，需要增加公共服务？",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "1. 解析复合问答场景：寻找【人口增长快（数量/增长率）】+【公共服务压力（学校/医疗/养老）】的热点区域。\n2. 在政务数据共享库中融合人口动态变动表与公共设施资源库。\n3. 生成 AI 导出的专题衍生数据集：《人口增长与公共服务压力热点分析数据集》（ds_pop_growth_service_pressure_hotspot）。",
      summary: "已为您在数据中台自动聚类并生成【人口增长与公共服务压力热点分析数据集】（ds_pop_growth_service_pressure_hotspot）。该数据集融合了街镇/社区人口增长率与学校、医疗、养老设施的供给承载数据，直观定位公共服务补短板重点区域。",
      dataRelationshipFlow: [
        "人口: 数量 & 年均增长率",
        "区域: 街镇 & 社区网格",
        "服务: 学校 & 医疗 & 养老设施",
        "形成: 人口增长与服务压力热点分析数据集"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_growth_rate_stats",
          tableComment: "街镇与社区人口数量及年均增长率统计表",
          category: "人口动态",
          dept: "市统计局 / 网格治理中心",
          reason: "提供各街镇近 3 年常住人口基数、年均增长率、净流入人口比例及人口净增总量。",
          relationChain: "街镇网格 ➔ 年均增长率 ➔ 人口快速集聚判定",
          keyFields: ["street_code", "street_name", "pop_current", "pop_3yr_ago", "annual_growth_rate", "net_inflow_ratio"]
        },
        {
          tableName: "t_infra_public_services",
          tableComment: "街镇公共服务设施资源 (学校/医疗/养老/文体)",
          category: "公共设施",
          dept: "市规资局 / 区发改委",
          reason: "汇总各街镇现有的中小学学位数、三甲及社区卫生服务中心床位数、养老床位数与日间照料点。",
          relationChain: "街镇坐标 ➔ 公共服务容量 ➔ 人均服务资源水平",
          keyFields: ["street_code", "school_capacity", "hospital_beds", "elderly_beds", "park_area_per_capita"]
        },
        {
          tableName: "ds_pop_growth_service_pressure_hotspot",
          tableComment: "人口增长与公共服务压力热点分析数据集 (AI 聚合数据集)",
          category: "AI 衍生数据",
          dept: "市大数据中心 AI 治理平台",
          reason: "自动计算人口增速与公共服务容量的比值，生成“高增长-低服务”红黄绿压力等级，直接服务公共服务规划决策。",
          relationChain: "人口增速 ✖ 公共服务缺口 ➔ 压力热点矩阵",
          keyFields: ["street_name", "growth_rank", "school_shortfall", "medical_shortfall", "pressure_level"]
        }
      ],
      datasetInfo: {
        tableName: "ds_pop_growth_service_pressure_hotspot",
        tableComment: "人口增长与公共服务压力热点分析数据集",
        dataCount: 340,
        updateFrequency: "每季度滚动计算",
        securityLevel: "政务Ⅲ级 (分析级)",
        department: "市发改委 / 市大数据中心",
        fields: [
          { name: "street_name", type: "VARCHAR(64)", comment: "街镇名称", desensitized: false, example: "南桥镇" },
          { name: "annual_growth_rate", type: "DECIMAL(5,2)", comment: "近三年人口年均增长率(%)", desensitized: false, example: "8.42" },
          { name: "pressure_level", type: "VARCHAR(16)", comment: "公共服务综合压力等级", desensitized: false, example: "红色极高预警" },
          { name: "school_degree_gap", type: "INT", comment: "中小学学位预测缺口(个)", desensitized: false, example: "1200" },
          { name: "medical_bed_gap", type: "INT", comment: "医疗千人床位缺口(张)", desensitized: false, example: "450" }
        ]
      },
      kpiCards: [
        { title: "压力预警街镇", value: "12", unit: "个红色预警", trend: "急需补充服务", trendType: "down" },
        { title: "平均年人口增速", value: "+6.8", unit: "%", trend: "热点板块", trendType: "up" },
        { title: "学位与医疗总缺口", value: "2.4", unit: "万单位", trend: "优先划拨用地", trendType: "neutral" }
      ],
      tablePreview: {
        columns: ["街镇/区域", "近3年年均人口增速", "压力等级", "教育学位缺口", "医疗床位缺口", "建议新增服务设施"],
        rows: [
          ["南桥镇 (奉贤区)", "+8.42%", "红色极高预警", "缺 1,200 学位", "缺 450 床位", "建议新建 1 所九年一贯制学校 & 社区医院"],
          ["九亭镇 (松江区)", "+7.85%", "红色极高预警", "缺 1,500 学位", "缺 380 床位", "建议加快九亭第三小学扩建工程"],
          ["华漕镇 (闵行区)", "+6.91%", "红色极高预警", "缺 980 学位", "缺 290 床位", "建议对接虹桥国际开放枢纽配建医疗点"],
          ["徐泾镇 (青浦区)", "+6.34%", "橙色较高预警", "缺 750 学位", "缺 210 床位", "建议增设 2 个社区长者食堂与托幼所"],
          ["康桥镇 (浦东新区)", "+5.98%", "黄色中度预警", "缺 600 学位", "缺 180 床位", "建议按规划补齐公办幼儿园托班"]
        ]
      },
      sql: `-- 筛选人口增长率 Top 10 且公共服务压力等级为“红色”或“橙色”的街镇
SELECT 
  street_name AS 街镇名称,
  annual_growth_rate AS 年均人口增长率_PCT,
  pressure_level AS 压力等级,
  school_degree_gap AS 预测学位缺口,
  medical_bed_gap AS 医疗床位缺口
FROM ds_pop_growth_service_pressure_hotspot
WHERE pressure_level IN ('红色极高预警', '橙色较高预警')
ORDER BY annual_growth_rate DESC
LIMIT 10;`,
      policySuggestions: [
        "【规划资源倾斜】建议市规资局与发改委将红色预警街镇列入‘公共服务设施配建优先保障清单’，在土地出让中强制配建学校与医疗设施。",
        "【转移支付与编制】对人口快速净流入街镇，增加教师与基层医护人员编制划拨，防止因人口快速增长导致公共服务质量下降。"
      ],
      followUpPrompts: [
        "导出全市公共服务压力红色预警街镇空间地理分布热力图",
        "分析松江区九亭镇与奉贤区南桥镇的人口年龄结构与教育需求",
        "生成《全市人口增长热点与公共服务设施补短板投资规划建议》"
      ]
    }
  }
];

export const DECISION_FIND_DATA_3_SCENARIOS: ConversationTurnDemo[] = [
  {
    turnIndex: 201,
    title: "场景一：老龄化与养老资源规划 [决策型找数]",
    category: "找数",
    userPrompt: "帮我分析闵行区老龄化情况，看看未来养老服务资源应该优先布局哪些区域。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "【Semovix 决策型数据发现】\n1. 目标理解：超越简单的静态数据检索，将用户业务意图提炼为“评估老龄人口空间分布与养老设施服务供给匹配度，识别资金与床位资源短缺的高风险区域”。\n2. 业务问题拆解：分析对象(60岁/80岁+老年人口) ➔ 分析维度(年龄/空间/增长/床位) ➔ 决策目标(优先新增养老设施街镇)。\n3. 构建数据方案：自然人底座 ➔ 老年人多维画像 ➔ 街镇社区划分 ➔ 养老床位/日照中心资源。\n4. 推荐资产组合：《老龄化服务规划分析数据方案 ⭐⭐⭐⭐⭐》(全覆盖分析链路)。\n5. 进入计算分析：执行“老年人口数 ÷ 养老床位数”，输出风险等级矩阵与缺口排名。\n6. 生成决策报告：《闵行区养老服务资源布局分析报告 (2026-2030)》。",
      summary: "已为您启动【决策型数据发现】引擎。针对“闵行区养老服务资源优先布局”业务决策目标，系统已完成目标拆解、构建跨部门数据方案、推荐 4 大核心数据资产组合，并自动执行了资源供需缺口计算与决策报告生成。",
      decisionDiscovery: {
        businessGoal: "评估老龄人口分布与养老服务供给匹配情况，识别养老资源不足区域",
        targetObject: "Person（自然人 / 老年人口对象）",
        analysisDimensions: [
          "年龄结构 (60-79岁 / 80岁+高龄)",
          "街镇与社区空间分布",
          "老龄人口动态增长趋势",
          "养老设施与床位服务覆盖率"
        ],
        decisionTarget: "明确未来 3-5 年闵行区新增养老机构、社区日间照料中心及床位资金优先倾斜街镇",
        planSteps: [
          "分析1：各街镇老年人口规模 (60岁与80岁+)",
          "分析2：高龄与失能独居老人空间分布",
          "分析3：老龄人口增长趋势推算",
          "分析4：养老设施与床位覆盖情况盘点",
          "分析5：识别资源供需风险与重点布局区域"
        ],
        dataObjects: [
          { name: "Person (自然人)", type: "基础人口对象", rulesOrFields: "人员ID, 出生日期, 年龄, 居住街镇, 户籍属性" },
          { name: "Elderly Population", type: "派生人群对象", rulesOrFields: "Age >= 60, 高龄/失能/独居标签" },
          { name: "Elderly Services", type: "公共服务资源", rulesOrFields: "机构ID, 街镇, 床位数, 社区食堂, 覆盖范围" }
        ],
        solutionTitle: "老龄化服务规划分析数据方案 ⭐⭐⭐⭐⭐",
        solutionCoverageReason: "当前方案覆盖“老人识别 ➔ 空间分布 ➔ 服务资源匹配 ➔ 风险缺口预警”的完整分析链路，精准支撑养老资源规划。",
        executionQuestion: "哪些街镇老年人口集中，但养老资源（床位/设施）严重不足？",
        reportTitle: "《闵行区养老服务资源布局分析报告 (2026-2030)》",
        reportSummary: "基于数据方案交叉计算，莘庄镇与浦江镇老龄人口基数大且千人床位保有量偏低，属于高风险缺口区域，建议列入一期资源优先建设清单。"
      },
      dataRelationshipFlow: [
        "自然人底座 (Person)",
        "年龄计算 & 60岁+标签 (Elderly)",
        "街镇/社区空间分布 (StreetGrid)",
        "养老设施与床位供给 (ServiceBeds)",
        "供需缺口与决策风险评估 (DecisionRisk)"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_base_info",
          tableComment: "人口基本信息视图 (Person底座)",
          category: "基础人口",
          dept: "市公安局 / 闵行大数据中心",
          reason: "作为最底层自然人对象，提供人员主键、精准年龄、性别及居住街镇，确定老龄基数。",
          relationChain: "自然人唯一标识 ➔ 基础属性",
          keyFields: ["person_id", "birth_date", "age", "residence_street", "district_name"]
        },
        {
          tableName: "t_pop_elderly_tags",
          tableComment: "老年人口专题数据集 (Elderly)",
          category: "民政/画像",
          dept: "闵行区民政局 / 老龄办",
          reason: "派生 60 岁以上及 80 岁以上高龄标签、失能失智评级、独居空巢与低保状态。",
          relationChain: "自然人 ➔ 动态老龄化标签",
          keyFields: ["person_id", "is_60_plus", "is_80_high_age", "disability_level", "is_living_alone"]
        },
        {
          tableName: "t_sys_street_dict",
          tableComment: "行政区划与空间维表 (Grid)",
          category: "空间维表",
          dept: "区规划资源局 / 大数据中心",
          reason: "提供闵行区 14 个街镇/莘庄/七宝/浦江的物理空间边界、社区层级与网格编码。",
          relationChain: "街镇编码 ➔ 空间地理映射",
          keyFields: ["street_code", "street_name", "total_pop", "area_sqkm"]
        },
        {
          tableName: "t_pop_elderly_services",
          tableComment: "养老服务资源数据 (Services)",
          category: "民政资源",
          dept: "市民政局 / 闵行区养老服务中心",
          reason: "提供养老院机构数、日间照料中心、核定床位数、长者食堂及服务半径。",
          relationChain: "街镇分布 ➔ 养老设施与服务能力匹配",
          keyFields: ["institution_id", "street_code", "bed_capacity", "canteen_count", "service_radius"]
        }
      ],
      kpiCards: [
        { title: "全区60岁+老人", value: "31.2", unit: "万人", trend: "老龄化率24.5%", trendType: "up" },
        { title: "高风险缺口街镇", value: "3", unit: "个街镇", trend: "莘庄/浦江/七宝", trendType: "down" },
        { title: "现有养老床位", value: "1.42", unit: "万张", trend: "每千人45.5张", trendType: "neutral" },
        { title: "预计需新增床位", value: "3,800", unit: "张", trend: "未来3年规划", trendType: "up" }
      ],
      chart: {
        type: "bar",
        title: "闵行区重点街镇老年人口数与养老床位供需对比",
        dataKeys: ["elderlyPop", "bedCapacity", "bedShortfall"],
        dataKeysLabels: { elderlyPop: "老年人口(百人)", bedCapacity: "养老床位(张)", bedShortfall: "预测床位缺口(张)" },
        data: [
          { street: "莘庄镇", elderlyPop: 380, bedCapacity: 1200, bedShortfall: 1500 },
          { street: "浦江镇", elderlyPop: 290, bedCapacity: 850, bedShortfall: 1100 },
          { street: "七宝镇", elderlyPop: 320, bedCapacity: 1500, bedShortfall: 700 },
          { street: "梅陇镇", elderlyPop: 270, bedCapacity: 1350, bedShortfall: 500 },
          { street: "古美路", elderlyPop: 210, bedCapacity: 1100, bedShortfall: 150 }
        ]
      },
      tablePreview: {
        columns: ["街镇名称", "60岁+老年人口", "现有养老床位", "每千老人床位数", "供需风险等级", "优先投入与布局决策建议"],
        rows: [
          ["莘庄镇", "38,000 人", "1,200 张", "31.5 张", "🔴 红色高风险", "建议在莘庄北板块新增 1 所区级综合养老院及 2 个社区长者食堂"],
          ["浦江镇", "29,000 人", "850 张", "29.3 张", "🔴 红色高风险", "建议加快大型居住区配建养老设施交付，新增床位 1,000 张"],
          ["七宝镇", "32,000 人", "1,500 张", "46.8 张", "🟠 橙色中风险", "建议整合社区卫生服务资源，重点发展嵌入式日间照料中心"],
          ["梅陇镇", "27,000 人", "1,350 张", "50.0 张", "🟡 黄色低风险", "维持现有供需平衡，提升失能护理型床位占比至 65%"]
        ]
      },
      sql: `-- 闵行区养老服务资源布局与供需缺口决策计算 SQL
SELECT 
  s.street_name AS 街镇,
  COUNT(p.person_id) AS 老年人口总量,
  SUM(CASE WHEN p.age >= 80 THEN 1 ELSE 0 END) AS 八十岁以上高龄老人,
  COALESCE(b.bed_capacity, 0) AS 现有养老床位,
  ROUND(COALESCE(b.bed_capacity, 0) * 1000.0 / COUNT(p.person_id), 1) AS 每千名老人床位数,
  CASE 
    WHEN COALESCE(b.bed_capacity, 0) * 1000.0 / COUNT(p.person_id) < 35 THEN '红色高风险(需优先布局)'
    WHEN COALESCE(b.bed_capacity, 0) * 1000.0 / COUNT(p.person_id) < 48 THEN '橙色中风险(适度补充)'
    ELSE '绿色低风险(维持现状)'
  END AS 决策风险等级
FROM t_pop_base_info p
JOIN t_sys_street_dict s ON p.residence_street = s.street_code
LEFT JOIN (
  SELECT street_code, SUM(bed_capacity) AS bed_capacity 
  FROM t_pop_elderly_services GROUP BY street_code
) b ON s.street_code = b.street_code
WHERE p.age >= 60 AND p.district_name = '闵行区'
GROUP BY s.street_name, b.bed_capacity
ORDER BY 老年人口总量 DESC;`,
      policySuggestions: [
        "【空间布局建议】优先将莘庄镇北板块与浦江镇大居板块列入 2026 年闵行区民生实事‘新建养老服务基础设施’第一序列。",
        "【护理结构调整】针对全区高龄老人（80岁+）占比提升的趋势，建议将新建床位中的护理型床位比例提高至 70% 以上。",
        "【资金精准划拨】根据数据计算出的风险等级矩阵，转移支付养老服务补贴资金，向红色高风险街镇倾斜 25% 预算。"
      ],
      followUpPrompts: [
        "导出《闵行区养老服务资源布局与红黄预警分析报告.pdf》",
        "切换至“学龄人口预测与教育资源规划”决策场景",
        "查看莘庄镇与浦江镇高龄独居老年人口精准地理网格图"
      ]
    }
  },
  {
    turnIndex: 202,
    title: "场景二：学龄人口预测与教育资源规划 [决策型找数]",
    category: "找数",
    userPrompt: "帮我分析未来几年闵行哪些区域可能出现入学压力，需要提前规划学校资源。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "【Semovix 决策型数据发现】\n1. 目标理解：突破静态查询，围绕“预测未来 3 年学龄人口变化趋势，精准识别学位供需缺口，为新增学校与扩建规划提供量化依据”。\n2. 业务问题拆解：分析对象(0-6岁儿童/幼升小) ➔ 分析维度(单岁演变/学区划片/学校容量) ➔ 决策目标(优先规划学校区域)。\n3. 构建数据方案：儿童人口对象 ➔ 单岁推算 ➔ 街镇学区划片 ➔ 学校学位容量匹配。\n4. 推荐资产组合：《学龄人口发展与教育资源规划分析方案 ⭐⭐⭐⭐⭐》。\n5. 进入计算分析：自动执行 2026-2028 年幼升小学位预测与压力排名。\n6. 生成决策报告：《闵行区未来教育资源需求与学位布局分析报告 (2026-2028)》。",
      summary: "已为您启动【决策型数据发现】引擎。针对“预测未来几年闵行入学压力与学校资源提前规划”的决策需求，系统已完成学龄人口推算模型建构、融合卫健/公安/教委数据方案，并完成了 2026-2028 年学位供需预测与决策报告输出。",
      decisionDiscovery: {
        businessGoal: "预测未来 3 年学龄人口动态演变，评估各街镇小学学位承载压力，为学校新建与扩建规划提供支撑",
        targetObject: "Person (0-6岁儿童及幼升小适龄人群)",
        analysisDimensions: [
          "年龄单岁结构演变 (0-3岁/4-6岁)",
          "居住社区与学区划片空间映射",
          "学校最大承载力与现有班额",
          "未来 1-3 年学位供需预测缺口"
        ],
        decisionTarget: "精准识别未来 3 年幼升小学位极度紧张的街镇与学区，确定 2026-2028 年学校建设计划优先顺序",
        planSteps: [
          "分析1：全区 0-6 岁儿童单岁年龄结构及出生趋势",
          "分析2：推算 2026、2027、2028 年进入 6 岁幼升小的人口基数",
          "分析3：结合社区划片将适龄儿童精准映射至对口学区与街镇",
          "分析4：盘点公办小学现有剩余学位容量",
          "分析5：交叉计算学位预测缺口，生成教育资源建设建议"
        ],
        dataObjects: [
          { name: "Child Person", type: "基础人口对象", rulesOrFields: "儿童ID, 出生年月, 精确年龄, 居住社区, 户籍属性" },
          { name: "School Age Forecast", type: "预测模型衍生对象", rulesOrFields: "2026/2027/2028幼升小预测人数, 变动率" },
          { name: "School Capacity", type: "教育资源对象", rulesOrFields: "学校ID, 最大学位容量, 在校生数, 剩余班额" }
        ],
        solutionTitle: "学龄人口发展与教育资源规划分析方案 ⭐⭐⭐⭐⭐",
        solutionCoverageReason: "该方案融通人口预测与教育资源空间划片，能够精准算清未来 3 年各街镇学位供需底数，直接支撑教育资源规划决策。",
        executionQuestion: "未来三年（2026-2028年）哪些街镇公办小学入学压力最大，存在学位缺口？",
        reportTitle: "《闵行区未来教育资源需求与学位布局分析报告 (2026-2028)》",
        reportSummary: "预测结果显示，虹桥镇、梅陇镇与华漕镇受新楼盘交付与人口净流入双重影响，未来 2 年幼升小学位缺口超 2,300 个，需提早规划校舍新建与场地扩容。"
      },
      dataRelationshipFlow: [
        "儿童人口底座 (ChildPerson)",
        "单岁年龄推算 (AgeForecast)",
        "学区划片映射 (DistrictMapping)",
        "学校学位容量 (SchoolCapacity)",
        "学位供需预测与建设决策 (DegreeDecision)"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_base_info",
          tableComment: "人口基本信息视图 (Person底座)",
          category: "基础人口",
          dept: "市公安局 / 闵行大数据中心",
          reason: "提取全区 0-6 岁常住与户籍儿童底数及其出生年月。",
          relationChain: "自然人唯一标识 ➔ 儿童年龄衍生",
          keyFields: ["person_id", "birth_date", "age", "residence_community"]
        },
        {
          tableName: "t_pop_child_age_distribution",
          tableComment: "儿童人口专题与年龄推算表 (AgeForecast)",
          category: "人口预测",
          dept: "市大数据中心 / 区教育局",
          reason: "单岁推算 2026、2027、2028 年满 6 岁幼升小预测人口数量。",
          relationChain: "儿童年龄单岁演算 ➔ 未来3年学龄人口",
          keyFields: ["community_id", "age_6_next_year", "age_6_in_2_years", "age_6_in_3_years"]
        },
        {
          tableName: "t_sys_street_dict",
          tableComment: "行政区划与空间维表 (Grid)",
          category: "空间维表",
          dept: "区规划资源局 / 大数据中心",
          reason: "绑定社区与街镇地理坐标，用于教育资源按地理网格聚合。",
          relationChain: "社区编码 ➔ 街镇空间映射",
          keyFields: ["street_code", "street_name", "community_code"]
        },
        {
          tableName: "t_edu_school_resources",
          tableComment: "学校资源与学位承载表 (SchoolCapacity)",
          category: "教育资源",
          dept: "区教育局基教科",
          reason: "提供公办小学设计最大学位容量、现有在校生数及年招生班额。",
          relationChain: "学校 ID ➔ 现有剩余学位承载力",
          keyFields: ["school_id", "school_name", "max_degree_capacity", "current_enrolled_count"]
        }
      ],
      kpiCards: [
        { title: "预测适龄儿童总量", value: "18.5", unit: "万人", trend: "2026-2028累计", trendType: "neutral" },
        { title: "预测学位缺口总量", value: "3,250", unit: "个学位", trend: "涉及5个街镇", trendType: "down" },
        { title: "最高压力街镇", value: "虹桥镇", unit: "缺口-820", trend: "需优先建校", trendType: "down" },
        { title: "预测精准度", value: "96.8", unit: "%", trend: "社区网格级", trendType: "up" }
      ],
      chart: {
        type: "stacked_bar",
        title: "闵行区重点街镇未来三年(2026-2028)幼升小学位供需预测",
        dataKeys: ["year2026", "year2027", "year2028", "schoolCapacity"],
        dataKeysLabels: { year2026: "2026幼升小预测(人)", year2027: "2027幼升小预测(人)", year2028: "2028幼升小预测(人)", schoolCapacity: "现有公办学位承载力(个)" },
        data: [
          { street: "虹桥镇", year2026: 1850, year2027: 1920, year2028: 1780, schoolCapacity: 1100 },
          { street: "梅陇镇", year2026: 2100, year2027: 2250, year2028: 2050, schoolCapacity: 1450 },
          { street: "华漕镇", year2026: 1420, year2027: 1580, year2028: 1650, schoolCapacity: 950 },
          { street: "莘庄镇", year2026: 2500, year2027: 2420, year2028: 2350, schoolCapacity: 2300 },
          { street: "七宝镇", year2026: 2200, year2027: 2150, year2028: 2100, schoolCapacity: 2100 }
        ]
      },
      tablePreview: {
        columns: ["街镇名称", "2026预测数", "2027预测数", "2028预测数", "现有学位容量", "最大学位缺口", "决策预警与新建工程建议"],
        rows: [
          ["虹桥镇", "1,850 人", "1,920 人", "1,780 人", "1,100 个", "-820 个", "🔴 极高预警：建议加快虹桥第三小学新建项目并借场地增设 8 个班"],
          ["梅陇镇", "2,100 人", "2,250 人", "2,050 人", "1,450 个", "-800 个", "🔴 极高预警：启动梅陇镇南部教育园区二期校舍扩建工程"],
          ["华漕镇", "1,420 人", "1,580 人", "1,650 人", "950 个", "-700 个", "🔴 极高预警：对接前湾地区规划，提前启动 1 所 36 班公办小学建设"],
          ["莘庄镇", "2,500 人", "2,420 人", "2,350 人", "2,300 个", "-200 个", "🟡 黄色预警：通过学区内“强校带弱校”弹性调配班额"]
        ]
      },
      sql: `-- 未来三年各街镇幼升小学位供需预测与压力排名 SQL
SELECT 
  p.street_name AS 街镇,
  SUM(p.age_6_next_year) AS 预测2026年幼升小人数,
  SUM(p.age_6_in_2_years) AS 预测2027年幼升小人数,
  SUM(p.age_6_in_3_years) AS 预测2028年幼升小人数,
  SUM(s.max_degree_capacity) AS 现有公办最大学位容量,
  (SUM(s.max_degree_capacity) - GREATEST(SUM(p.age_6_next_year), SUM(p.age_6_in_2_years), SUM(p.age_6_in_3_years))) AS 预测最大缺口数,
  CASE 
    WHEN (SUM(s.max_degree_capacity) - GREATEST(SUM(p.age_6_next_year), SUM(p.age_6_in_2_years), SUM(p.age_6_in_3_years))) < -500 THEN '🔴 极高入学压力(优先建校)'
    WHEN (SUM(s.max_degree_capacity) - GREATEST(SUM(p.age_6_next_year), SUM(p.age_6_in_2_years), SUM(p.age_6_in_3_years))) < 0 THEN '🟠 中度入学压力(弹性扩班)'
    ELSE '🟢 供给充足'
  END AS 决策预警等级
FROM t_pop_child_age_distribution p
LEFT JOIN t_pop_school_district_mapping m ON p.community_id = m.community_id
LEFT JOIN t_edu_school_resources s ON m.school_id = s.school_id
WHERE p.district_name = '闵行区'
GROUP BY p.street_name
ORDER BY 预测最大缺口数 ASC;`,
      policySuggestions: [
        "【提前土地划拨】针对虹桥镇与华漕镇（前湾地区），规资局应优先划拨教育设施用地，保障 2027 年前新增 2 所标准化小学。",
        "【弹性扩班机制】对莘庄镇等轻度缺口区域，教委可采取‘小班化向标准班转化’及‘统筹邻近学区多余学位’的弹性过渡方案。",
        "【预警动态发布】每年 11 月向社会发布学龄人口预警地图，引导家长理性落户与择校。"
      ],
      followUpPrompts: [
        "导出《闵行区未来三年学龄人口预测与学校建设规划报告.docx》",
        "切换至“重点人口精准服务”决策场景",
        "查看虹桥镇对口学区划片与社区适龄儿童热力分布图"
      ]
    }
  },
  {
    turnIndex: 203,
    title: "场景三：重点人口精准服务 [决策型找数]",
    category: "找数",
    userPrompt: "帮我识别闵行区需要重点关注的人群，并分析服务资源投入方向。",
    assistantResult: {
      intent: "找数",
      thoughtProcess: "【Semovix 决策型数据发现】\n1. 目标理解：建立“重点关注人群多维识别 ➔ 家庭结构关照 ➔ 已有民政服务覆盖比对 ➔ 社区服务盲区打靶”的决策闭环。\n2. 业务问题拆解：分析对象(高龄/独居/失能/困难人群) ➔ 分析维度(标签/家庭/救助/社区) ➔ 决策目标(公共服务倾斜社区与领域)。\n3. 构建数据方案：自然人 ➔ 家庭关系 ➔ 救助与服务记录 ➔ 社区网格。\n4. 推荐资产组合：《重点人群识别与服务需求精准分析方案 ⭐⭐⭐⭐⭐》。\n5. 进入计算分析：计算“需求人群数 - 已覆盖服务数”，诊断服务盲区社区。\n6. 生成决策报告：《闵行区重点人群服务需求与资源精准投入决策报告》。",
      summary: "已为您启动【决策型数据发现】引擎。针对“识别闵行区重点关注人群与确定服务资源投入方向”的决策需求，系统已完成人群识别算法模型搭建，融合人口/家庭/民政/网格数据方案，并完成了社区级服务盲区诊断与决策报告输出。",
      decisionDiscovery: {
        businessGoal: "精准识别高龄独居、失能特困及困难家庭等重点关注人群，发现公共服务覆盖盲区，为财政扶持与社区服务倾斜提供依据",
        targetObject: "Person & Family (重点人群与家庭户对象)",
        analysisDimensions: [
          "重点人群多维复合标签 (高龄/独居/失能/低保)",
          "家庭抚养比与代际结构",
          "民政救助与社会服务现有覆盖率",
          "社区网格服务缺口比对"
        ],
        decisionTarget: "定位重点服务需求密集但当前服务覆盖不足的社区，确定基层帮扶与社区长者服务资金的最佳投放方向",
        planSteps: [
          "分析1：交叉识别高龄（80岁+）、独居、失能及低保困难人群",
          "分析2：关联家庭关系表，排除有同住子女照料的群体，锁定纯极度需要帮扶对象",
          "分析3：调取民政救助与社区助餐/助洁/长护险服务履约记录",
          "分析4：计算‘需求人群数 - 已覆盖服务数’得出社区服务盲区缺口",
          "分析5：生成重点人群服务资源优先投入建议列表"
        ],
        dataObjects: [
          { name: "Person Base", type: "基础人口对象", rulesOrFields: "人员ID, 年龄, 居住社区, 身体健康状况" },
          { name: "Family Relation", type: "代际关系图谱", rulesOrFields: "同住状态, 独居/空巢标记, 直系亲属联系" },
          { name: "Service History", type: "民政服务履约", rulesOrFields: "救助卡号, 长护险履约, 社区助餐记录" },
          { name: "Community Grid", type: "空间网格对象", rulesOrFields: "社区编码, 网格员数量, 综合服务设施" }
        ],
        solutionTitle: "重点人群识别与服务需求精准分析方案 ⭐⭐⭐⭐⭐",
        solutionCoverageReason: "该方案贯通“人口画像 ➔ 家庭结构 ➔ 履约服务 ➔ 社区打靶”的全链路，可精准剔除重复服务，精准发现帮扶盲区。",
        executionQuestion: "哪些社区存在大量重点服务需求人群，但当前公共服务覆盖率最低？",
        reportTitle: "《闵行区重点人群服务需求与资源精准投入决策报告》",
        reportSummary: "诊断发现，颛桥镇鑫都社区与塘湾镇工业区社区重点帮扶人群超 2,200 人，但现有助餐与长护险覆盖率不足 45%，建议列为第一批‘精准服务提升试点社区’。"
      },
      dataRelationshipFlow: [
        "人口底座与复合标签 (PersonTags)",
        "家庭关系与独居排查 (FamilyKinship)",
        "民政服务履约记录 (ServiceHistory)",
        "社区网格服务比对 (GridCoverage)",
        "服务盲区打靶与资源投入决策 (TargetingDecision)"
      ],
      recommendationAssets: [
        {
          tableName: "t_pop_base_info",
          tableComment: "人口基础视图 (Person底座)",
          category: "基础人口",
          dept: "市公安局 / 闵行大数据中心",
          reason: "提取主体年龄、居住地及健康状况。",
          relationChain: "自然人唯一标识 ➔ 重点属性识别",
          keyFields: ["person_id", "age", "residence_community", "health_status"]
        },
        {
          tableName: "t_pop_family_relation_net",
          tableComment: "家庭关系数据 (FamilyKinship)",
          category: "图谱关系",
          dept: "市公安局 / 市民政局",
          reason: "识别纯独居、无子女同住空巢家庭，排除风险干预盲区。",
          relationChain: "代际图谱 ➔ 独居与空巢判定",
          keyFields: ["from_person_id", "to_person_id", "relation_type", "is_cohabiting"]
        },
        {
          tableName: "t_pop_elderly_services",
          tableComment: "服务记录与补贴打卡数据 (ServiceHistory)",
          category: "民政履约",
          dept: "市民政局 / 社区卫生服务中心",
          reason: "统计上门护理、社区助餐与困难救助津贴领用记录。",
          relationChain: "服务领用 ➔ 判断已有服务覆盖状态",
          keyFields: ["person_id", "service_type", "service_status", "monthly_subsidy"]
        },
        {
          tableName: "t_sys_community_grid",
          tableComment: "社区网格维度数据 (GridCoverage)",
          category: "网格治理",
          dept: "区网格化管理中心",
          reason: "聚合社区居委维度，计算服务覆盖率与服务盲区占比。",
          relationChain: "社区网格 ➔ 服务资源缺口打靶",
          keyFields: ["community_code", "community_name", "street_name", "grid_officer_count"]
        }
      ],
      kpiCards: [
        { title: "全区重点帮扶人群", value: "4.85", unit: "万人", trend: "包含独居/失能/低保", trendType: "neutral" },
        { title: "服务覆盖率盲区", value: "32.4", unit: "%", trend: "需精准填补", trendType: "down" },
        { title: "一级优先投入社区", value: "8", unit: "个社区", trend: "集中在颛桥/塘湾", trendType: "down" },
        { title: "建议倾斜资金", value: "1,250", unit: "万元", trend: "专项帮扶预算", trendType: "up" }
      ],
      chart: {
        type: "radar",
        title: "重点帮扶人群多维需求结构分布 (全区 vs 试点社区)",
        dataKeys: ["overallDistrict", "pilotCommunity"],
        dataKeysLabels: { overallDistrict: "全区平均需求(%)", pilotCommunity: "试点社区需求(%)" },
        data: [
          { dimension: "高龄独居护理", overallDistrict: 65, pilotCommunity: 88 },
          { dimension: "社区助餐配送", overallDistrict: 58, pilotCommunity: 82 },
          { dimension: "慢病用药帮扶", overallDistrict: 72, pilotCommunity: 79 },
          { dimension: "紧急呼叫安装", overallDistrict: 45, pilotCommunity: 91 },
          { dimension: "日间照料看护", overallDistrict: 50, pilotCommunity: 74 }
        ]
      },
      tablePreview: {
        columns: ["所属街镇", "社区/网格", "重点帮扶人口", "服务已覆盖率", "帮扶盲区人数", "主要缺失服务", "优先投入与帮扶决策建议"],
        rows: [
          ["颛桥镇", "鑫都社区", "1,280 人", "42.5%", "736 人", "社区助餐 / 紧急呼叫系统", "🔴 一级优先：拨付 180 万元新增 1 个社区长者食堂，并免费安装智能安防硬件"],
          ["塘湾镇", "工业区社区", "950 人", "48.0%", "494 人", "上门护理 / 慢病配送", "🔴 一级优先：增加 12 名社区专职网格护理员，开通药房上门送药通道"],
          ["诸翟镇", "诸翟社区", "1,120 人", "55.2%", "501 人", "日间照料看护", "🟠 二级优先：利用闲置社区用房改建嵌入式照料中心"],
          ["马桥镇", "旗忠社区", "860 人", "61.0%", "335 人", "心理慰藉 / 助洁服务", "🟡 三级优先：引入社会组织志愿服务团队对口结对"]
        ]
      },
      sql: `-- 重点帮扶人群服务覆盖率盲区诊断与精准投入决策 SQL
SELECT 
  c.street_name AS 街镇,
  c.community_name AS 社区,
  COUNT(DISTINCT p.person_id) AS 重点帮扶人口数,
  ROUND(SUM(CASE WHEN s.service_status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT p.person_id), 1) AS 已有服务覆盖率_PCT,
  (COUNT(DISTINCT p.person_id) - SUM(CASE WHEN s.service_status = 'ACTIVE' THEN 1 ELSE 0 END)) AS 服务帮扶盲区人数,
  CASE 
    WHEN SUM(CASE WHEN s.service_status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT p.person_id) < 50 THEN '🔴 一级优先倾斜(重大盲区)'
    WHEN SUM(CASE WHEN s.service_status = 'ACTIVE' THEN 1 ELSE 0 END) * 100.0 / COUNT(DISTINCT p.person_id) < 65 THEN '🟠 二级适度扶持'
    ELSE '🟢 覆盖良好'
  END AS 决策投入优先级
FROM t_pop_base_info p
JOIN t_pop_elderly_tags t ON p.person_id = t.person_id
JOIN t_sys_community_grid c ON p.residence_community = c.community_code
LEFT JOIN t_pop_elderly_services s ON p.person_id = s.person_id
WHERE (t.is_80_high_age = 1 OR t.is_living_alone = 1 OR t.disability_level != 'NONE')
  AND p.district_name = '闵行区'
GROUP BY c.street_name, c.community_name
ORDER BY 服务帮扶盲区人数 DESC;`,
      policySuggestions: [
        "【资金靶向投入】重点向覆盖率低于 50% 的颛桥鑫都社区与塘湾工业区社区倾斜民政帮扶资金，优先解决食堂助餐与安防防摔硬件。",
        "【数字预警赋能】将重点人群数据与网格化管理系统实时打通，对连续 30 天无服务履约记录的高龄独居老人自动触发线下网格员探访关爱任务。",
        "【社会化服务引入】通过政府购买服务方式，引入具备资质的第三方养老护理机构承接基层服务缺口。"
      ],
      followUpPrompts: [
        "导出《闵行区重点帮扶人群精准服务资金分配方案.xlsx》",
        "切换至“老龄化与养老资源规划”决策场景",
        "查看颛桥镇鑫都社区困难家庭与高龄独居老人的详细分布明细"
      ]
    }
  }
];

// 多文档依据【企业开办/注册与行政许可】智能问答场景
export const REGISTER_MULTI_DOC_SCENARIO: ConversationTurnDemo = {
  turnIndex: 1,
  title: "多文档依据: 特殊餐饮企业开办注册与许可办理",
  category: "问数",
  userPrompt: "申请开办一家特殊餐饮企业（涉及连锁经营、现场制售与冷食类许可），办理注册登记需要满足哪些条件？请依据市场监管、食品安全及消防等相关规范文档进行综合解答。",
  assistantResult: {
    intent: "问数",
    thoughtProcess: `[多文档深度检索与交叉比对分析链 (Cross-Document Knowledge Grounding)]:
1. 并发检索定位到 4 份现行生效的法律法规与行政许可技术规范：
   • Document 1: 《市场主体登记管理条例实施细则》（国市监注规〔2022〕3号）
   • Document 2: 《食品经营许可与备案管理办法》（国家市场监督管理总局令第78号）
   • Document 3: 《公众聚集场所投入使用、营业前消防安全检查法律文书规范》及《建筑防火通用规范》（GB 55037-2022）
   • Document 4: 《政务服务“一网通办”跨部门电子证照免提交规范（2025版）》

2. 跨文档逻辑关联与合规性比对：
   • 证照关系比对 (Doc 1 & Doc 2)：全面实行“先照后证”。登记注册取得营业执照后，方可向市场监管部门申请《食品经营许可证》。
   • 冷食专间硬件与消防交叉比对 (Doc 2 & Doc 3)：Doc 2 强制要求设立独立冷食间（≥6㎡、二次更衣、紫外线消毒）；Doc 3 则追加要求冷食间装修材料需达到 A 级不燃标准，且专间内严禁设置明火。
   • 免提交材料比对 (Doc 4)：营业执照、法定代表人身份证、不动产权证等 6 项材料已被电子证照库覆盖，线上办理时自动调用核验，免于重复提交纸质复印件。

3. 综合归纳提取 4 大审查维度，构建一站式注册与许可办理流程及溯源凭证。`,
    summary: `### 跨部门多文档综合解答：特殊餐饮企业一站式注册与许可办理指引

依据**《市场主体登记管理条例》**、**《食品经营许可与备案管理办法》**、**《建筑防火通用规范》**以及**《一网通办证照免提交规范》** 4 份官方权威文档的比对提炼，开办特殊餐饮企业（含现场制售/冷食）在企业注册与许可申请环节的核心要求如下：

#### 1. 跨文档核心要求与审查比对表
| 审查维度 | 涉及法规/规范文档 | 核心标准与要求 | 审查风险点与注意事项 |
| :--- | :--- | :--- | :--- |
| **企业登记注册** | 《市场主体登记管理条例实施细则》第18条 | 实行“先照后证”与住所登记承诺制，注册无须前置审批 | 经营范围须规范表述为“餐饮服务；食品销售；冷食类食品制售” |
| **食品安全许可** | 《食品经营许可与备案管理办法》第21条 | 必须设立独立冷食专间（≥6㎡），配备二次更衣与紫外线消毒 | 专间内不得设置明火，须配置独立冷藏与专用的清洗消毒水池 |
| **消防安全审查** | 《建筑防火通用规范》GB 55037-2022 | 建筑面积 > 50㎡ 须通过消防安全检查告知承诺制备案 | 装修材料达到 A 级不燃标准，厨房排风管道穿墙处须设 150℃ 防火阀 |
| **证照免提交** | 《一网通办证照免提交规范》第5条 | 营业执照、身份证、不动产权证等 6 项材料共享核验 | 申请人免于提交纸质复印件，系统通过政务数据共享接口实时比对 |

#### 2. 一站式注册流程与办理时间线
1. **第一步（0.5 工作日）：企业注册登记**  
   在一网通办平台填报企业设立信息，签署住所承诺书，系统即时核发电子《营业执照》（依据《市场主体登记管理条例》）。
2. **第二步（1.0 工作日）：许可同步申请**  
   凭借电子营业执照在线申请《食品经营许可证》，上传冷食专间平面图与设备清单（依据《食品经营许可管理办法》）。
3. **第三步（告知承诺）：消防安全备案**  
   建筑面积超出 50㎡ 的场所，通过消防系统在线提交告知承诺书并上传消防设施布置图（依据《建筑防火通用规范》）。
4. **第四步（发证与联办）：电子证照归集**  
   审批通过后，《食品经营许可证》与消防备案凭证自动归集至企业电子证照包，全程实现“一次不跑、双证联发”。`,
    kpiCards: [
      { title: "依据权威文档", value: "4", unit: "份国家及省市规范", trend: "100% 官方可追溯", trendType: "up" },
      { title: "承诺办理时限", value: "1.5", unit: "工作日 (提速 70%)", trend: "并联审批", trendType: "up" },
      { title: "免提交纸质材料", value: "6", unit: "项电子证照自动读取", trend: "零纸质件", trendType: "neutral" },
      { title: "重点审查预警", value: "2", unit: "项风险提示 (冷食专间/消防)", trend: "需现场核验", trendType: "down" }
    ],
    citationDocs: [
      {
        docId: "doc-reg-001",
        title: "《市场主体登记管理条例实施细则》",
        section: "第18条·住所登记与经营范围规范",
        page: "第12页",
        version: "国市监注规〔2022〕3号",
        relevanceScore: 0.99,
        warningLevel: "info",
        excerpt: "申请人办理餐饮类市场主体设立登记的，实行住所（经营场所）自主申报承诺制。登记机关核发营业执照后，经营者凭营业执照向市场监管部门申请办理食品经营许可，登记机关不得将相关许可证件作为企业注册登记的前置条件。"
      },
      {
        docId: "doc-food-002",
        title: "《食品经营许可与备案管理办法》",
        section: "第21条·冷食类及生食类食品制售专间规范",
        page: "第35页",
        version: "总局令第78号",
        relevanceScore: 0.98,
        warningLevel: "warning",
        excerpt: "从事冷食类食品（如凉菜、冷加工糕点、冷菜拼盘）现场制售的，应当设立不少于 6 平方米的独立专间。专间内须配备二次更衣设施、独立冷藏设备、空气消毒装置（如紫外线杀菌灯）及专用的清洗消毒设施。专间内严禁设置明火或非专间操作人员穿行。"
      },
      {
        docId: "doc-fire-003",
        title: "《公众聚集场所投入使用、营业前消防安全检查法律文书规范》及《建筑防火通用规范》",
        section: "第8.2.1条·餐饮场所消防安全检查与装修防护",
        page: "第88页",
        version: "GB 55037-2022",
        relevanceScore: 0.96,
        warningLevel: "danger",
        excerpt: "建筑面积在 50 平方米以上的餐饮场所属于公众聚集场所，投入使用、营业前应当向消防救援机构申请消防安全检查告知承诺。厨房排风管道穿过防火墙处须安装动作温度为 150℃ 的防火阀，室内吊顶与隔墙装修材料必须达到 A 级不燃标准。"
      },
      {
        docId: "doc-license-004",
        title: "《政务服务“一网通办”跨部门电子证照免提交规范（2025版）》",
        section: "第5条·市场监管与消防证照跨部门共享核验",
        page: "第6页",
        version: "沪府办发〔2025〕12号",
        relevanceScore: 0.97,
        warningLevel: "info",
        excerpt: "申请人在办理食品经营许可及消防告知承诺备案时，凡已取得电子营业执照、法定代表人电子身份证及不动产登记电子证照的，行政审批系统应当通过全市政务数据共享交换平台自动调用核验，不得要求申请人提供纸质证照或复印件。"
      }
    ],
    policySuggestions: [
      "【冷食专间预先审查】建议在装修阶段提前提交冷食专间平面图（≥6㎡）与紫外线灯配置方案，避免因专间硬件不合规导致许可证核发延误。",
      "【电子证照零材料办理】充分利用一网通办电子证照自动读取功能，无需打印纸质营业执照与产权证，全程线上签名即可归集。",
      "【跨部门并联审批】将企业注册登记、食品经营许可与消防告知承诺并联申请，可将整体办证周期从传统 10 个工作日压缩至 1.5 个工作日。"
    ],
    followUpPrompts: [
      "查看《特殊餐饮冷食专间布局与设施标准规范图纸》",
      "查询企业变更法定代表人所需的跨部门多文档核验清单",
      "在一网通办申请‘证照联办’综合许可证操作指引"
    ]
  }
};



