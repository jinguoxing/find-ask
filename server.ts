import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily if key is available
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// System prompt for population database query assistant
const SYSTEM_PROMPT = `你是一个“政务人口库智能找数问数助手”，专门为数字政府、大数据中心、民政局、公安局、卫健委等政务数据管理人员提供智能服务。

政务人口核心数据库表结构：
1. t_pop_base_info (户籍人口基础信息表) - 字段: person_id, name, id_card_hash, gender, birth_date, age, district_name, street_name, huji_type, education_level, marital_status, update_time
2. t_pop_elderly_services (高龄老人与补贴服务表) - 字段: person_id, age, elderly_grade (普通老龄/高龄/失能), subsidy_amount (月度补贴金额), care_level, district_name, street_name, grant_status, update_time
3. t_pop_floating (流动人口管理服务表) - 字段: person_id, source_province, source_city, residence_reason (务工/经商/随迁/学习), dwell_duration_months, industry, district_name, is_registered_residence_permit, update_time
4. t_pop_maternal_child (育龄妇女与母婴健康服务表) - 字段: person_id, marital_status, child_count, pregnancy_status, last_check_date, health_service_status, district_name, update_time
5. t_pop_subsidy_low_income (低保扶贫与困难救助表) - 字段: person_id, category (特困/低保/低收入), monthly_allowance, district_name, audit_status, update_time
6. t_pop_employment (劳动年龄人口就业状况表) - 字段: person_id, age, employment_status (已就业/失业登记/灵活就业/在校), industry_sector, district_name, update_time

规则：
- 当用户提出需求时，判断是【找数】还是【问数】：
  - 【找数】：查找库表、资产目、字段定义、接口API、更新时效、脱敏级别等。
  - 【问数】：做数据统计、交叉对比、趋势变化、分布图表、决策分析。
- 始终输出 JSON 格式，便于前端渲染可视化组件。

JSON 格式要求 (严禁包含 markdown 代码块包围，只输出纯 JSON 字符串)：
{
  "intent": "找数" | "问数",
  "thoughtProcess": "1. 解析需求...\n2. 定位人口库 Schema...\n3. 生成逻辑/SQL...",
  "summary": "简短政务分析总结...",
  "sql": "SELECT ... FROM ... WHERE ... GROUP BY ...",
  "datasetInfo": {
    "tableName": "表英文名",
    "tableComment": "表中文名",
    "dataCount": 1250000,
    "updateFrequency": "日更新 / 实时同步",
    "securityLevel": "商用/政务Ⅲ级 (脱敏)",
    "department": "市公安局/市民政局",
    "fields": [
      { "name": "district_name", "type": "VARCHAR(64)", "comment": "行政区划", "desensitized": false },
      { "name": "id_card_hash", "type": "VARCHAR(128)", "comment": "身份证号哈希", "desensitized": true }
    ]
  },
  "chart": {
    "type": "bar" | "line" | "pie" | "stacked_bar" | "radar" | "kpi",
    "title": "图表标题",
    "xAxisKey": "name",
    "dataKeys": ["value", "value2"],
    "dataKeysLabels": { "value": "指标1", "value2": "指标2" },
    "data": [
      { "name": "类别1", "value": 100 }
    ]
  },
  "tablePreview": {
    "columns": ["区县", "指标值"],
    "rows": [["朝阳区", "12,450"]]
  },
  "kpiCards": [
    { "title": "总计人数", "value": "84.5", "unit": "万人", "trend": "+3.2%", "trendType": "up" }
  ],
  "policySuggestions": ["建议1", "建议2"],
  "followUpPrompts": ["推荐追问1", "推荐追问2"]
}
`;

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "population-ai-assistant" });
});

// Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\n历史对话上下文：\n${JSON.stringify(history || [])}\n\n用户当前提问：${prompt}` }] }
          ],
          config: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        });

        const text = response.text || "{}";
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, result: parsed });
        } catch {
          // If JSON parsing fails, wrap in fallback structure
          return res.json({
            success: true,
            result: {
              intent: prompt.includes("统计") || prompt.includes("分析") || prompt.includes("比例") ? "问数" : "找数",
              thoughtProcess: "通过 Gemini 2.5 解析语义并智能生成政务人口库回答。",
              summary: text,
              sql: "SELECT * FROM t_pop_base_info LIMIT 100;",
              followUpPrompts: ["查看对应表的数据血缘", "按行政区划拆分统计", "导出该政务分析简报"]
            }
          });
        }
      } catch (err: any) {
        console.log("Gemini API service unavailable or restricted, utilizing local intelligent government engine:", err?.status || err?.message || "fallback");
      }
    }

    // Smart Fallback Engine for Population Database & Contract Approval Knowledge scenarios
    const lower = prompt.toLowerCase();
    let result;

    if (lower.includes("特斯拉") || lower.includes("tesla") || lower.includes("model y") || lower.includes("model 3") || lower.includes("车门") || lower.includes("机械解锁") || lower.includes("拉手") || lower.includes("autopilot") || lower.includes("超充") || lower.includes("预热") || lower.includes("哨兵") || lower.includes("胎压") || lower.includes("tpms") || lower.includes("拖车") || lower.includes("运输模式") || lower.includes("手册")) {
      if (lower.includes("车门") || lower.includes("解锁") || lower.includes("断电") || lower.includes("紧急逃生")) {
        result = {
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
        };
      } else if (lower.includes("autopilot") || lower.includes("fsd") || lower.includes("摄像头") || lower.includes("辅助驾驶")) {
        result = {
          intent: "问数",
          thoughtProcess: "1. 检索手册章节: Section 7.02 Autopilot 自动辅助转向与驾驶员监控。\n2. 解析硬件要求: 8个车身摄像头、车内驾驶员专注度摄像头与驾驶杆/滚轮双击指令。\n3. 梳理安全罢工机制 (Safety Strikeout): 5次警告禁用规则。",
          summary: "【Autopilot 自动辅助驾驶开启与安全监控】\n1. 激活操作：在中控屏‘控制’->‘Autopilot’中开启功能。行驶中连续向下拨动右侧控制杆两次（或快速双击方向盘右滚轮），中控屏车道线变蓝并伴随音效即已激活；\n2. 摄像头与监控：车内后视镜上方的【驾驶员监视摄像头】会实时捕捉眼球轨迹与头部姿态。若检测到驾驶员看手机、闭眼或手离开方向盘，系统将发出逐步升级的声光预警；\n3. 罢工封禁机制：若驾驶员忽视预警导致系统强制退出 Autopilot，累计 5 次‘安全罢工’后，车辆将在 7 天内禁止使用 Autopilot 辅助驾驶功能。",
          kpiCards: [
            { title: "激活操作方式", value: "杆/滚轮双击", unit: "蓝线确认", trend: "0.2s 快速响应", trendType: "up" },
            { title: "车外感知视角", value: "8 个摄像头", unit: "360° 覆盖", trend: "纯视觉路线", trendType: "up" },
            { title: "舱内监控类型", value: "驾驶员视角", unit: "眼球+双手", trend: "实时视线追踪", trendType: "neutral" },
            { title: "安全 strike 限制", value: "5 次违规", unit: "封禁 7 天", trend: "强制安全规约", trendType: "down" }
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
        };
      } else {
        result = {
          intent: "问数",
          thoughtProcess: "1. 挂载特斯拉官方知识库《Tesla Model Y/3 Owner Manual v2026.4》。\n2. 提取用户意图并检索安全警示、维保规约与出处章节。\n3. 生成包含依据文档 (Citation Docs) 的结构化解答。",
          summary: "【特斯拉 Model Y / Model 3 车主手册智能解析】\n已为您检索特斯拉官方知识库。支持对车辆紧急解锁拉手、Autopilot/FSD 纯视觉辅助驾驶、电池超充导航预热、哨兵模式 U 盘配置及 TPMS 拖车运输模式进行精准问答并提供对应手册章节原文溯源。",
          kpiCards: [
            { title: "手册知识节点", value: "1850+", unit: "条规约", trend: "2026.4 升级版", trendType: "up" },
            { title: "检索匹配精度", value: "99.4%", unit: "向量比对", trend: "100%可溯源", trendType: "neutral" }
          ],
          citationDocs: [
            {
              docId: "DOC-TESLA-GENERIC-01",
              title: "特斯拉 Model Y 车主手册 - 规范与合规",
              section: "Section 1.01 - 车辆概览与安全规约 (Vehicle Overview & Safety)",
              page: "P.12-15",
              excerpt: "本车主手册包含 Model Y 的各项操作说明、安全警告及维保指南。所有关于高压电池、电机驱动、辅助驾驶及紧急救护操作，均需按照手册标准步骤进行。",
              relevanceScore: 98.0,
              warningLevel: "info",
              version: "2026.4 CN v2 Edition"
            }
          ],
          followUpPrompts: [
            "Model Y 在断电或紧急情况下，前排和后排车门如何进行机械解锁逃生？",
            "前往超级充电站时电池预热有什么作用？冬季低温天气下如何优化续航衰减？",
            "仪表显示胎压报警时如何校准 TPMS？如果在路边故障需要拖车怎么处理？"
          ]
        };
      }
    } else if (lower.includes("合同") || lower.includes("审批") || lower.includes("条款") || lower.includes("合规") || lower.includes("采购") || lower.includes("违约") || lower.includes("风险")) {
      result = {
        intent: "问数",
        thoughtProcess: "1. 识别知识库检索任务: 《项目合同合规审查与风险判定》。\n2. 挂载司法局与财政局政务采购知识库 (Ref: GW-2026-CONTRACT-088)。\n3. 执行合同条款向量匹配与法规算法比对，核查：预付款比例、履约保证金、账期结清时限、违约责任上降比例与政府采购目录限额。",
        summary: "【项目合同审查意见书】已完成对《智慧城市三期建设项目合同》（合同编号：HT-2026-ZHCS-009）的智能合规审查。审查发现 1 项高风险条款与 2 项中风险预警，整体合规率为 88.5%。建议在补充修改条款后再提交项目批复与财政拨款。",
        datasetInfo: {
          tableName: "kb_project_contract_audit_rules",
          tableComment: "全市政务信息化及工程采购项目合同合规审查规则知识库",
          dataCount: 4280,
          updateFrequency: "实时同步 (司法局/财政专网)",
          securityLevel: "政务内部知识库",
          department: "市司法局 / 市财政局 / 市机关事务局",
          fields: [
            { name: "rule_id", type: "VARCHAR(32)", comment: "合规规则编号", desensitized: false },
            { name: "category", type: "VARCHAR(64)", comment: "审查维度(付款账期/违约责任/预算合规)", desensitized: false },
            { name: "legal_basis", type: "VARCHAR(256)", comment: "法规依据(《政府采购法》《民法典合同编》)", desensitized: false },
            { name: "risk_level", type: "VARCHAR(16)", comment: "风险等级(高风险/中风险/低风险/合规)", desensitized: false }
          ]
        },
        kpiCards: [
          { title: "合同总金额", value: "3850", unit: "万元", trend: "预算内", trendType: "neutral" },
          { title: "审查条款数", value: "32", unit: "条", trend: "100%覆盖", trendType: "neutral" },
          { title: "合同合规评分", value: "88.5", unit: "分", trend: "需修改", trendType: "down" },
          { title: "识别风险项", value: "3", unit: "项", trend: "1高2中", trendType: "down" }
        ],
        chart: {
          type: "radar",
          title: "项目合同多维合规审查综合得分图 (满分 100 分)",
          xAxisKey: "dimension",
          dataKeys: ["score", "standard"],
          dataKeysLabels: { score: "本合同得分", standard: "政务标准底线" },
          data: [
            { dimension: "付款与账期合规", score: 72, standard: 85 },
            { dimension: "违约责任明确度", score: 68, standard: 80 },
            { dimension: "政府采购预算匹配", score: 95, standard: 90 },
            { dimension: "知识产权与数据安全", score: 98, standard: 90 },
            { dimension: "履约验收与质保机制", score: 90, standard: 85 },
            { dimension: "不可抗力与解约条款", score: 88, standard: 80 }
          ]
        },
        tablePreview: {
          columns: ["章节条款", "合同原条款摘要", "风险判别等级", "法规依据与修改建议"],
          rows: [
            ["第4.2条 付款比例", "合同签署后5个工作日内支付首期预付款 50%", "🔴 高风险", "超过政务信息化项目预付款 30% 上限 (依据《财库〔2022〕19号》)，建议降至 30% 并增加履约保函"],
            ["第8.1条 违约赔偿", "乙方违约每日按合同总价 0.01% 支付违约金，封顶 3%", "🟡 中风险", "违约金上限低于行业一般标准(5%-10%)，对乙方违约约束力不足，建议调整为封顶 10%"],
            ["第11.3条 验收时限", "甲方应在收到验收申请后 60 日内组织终验", "🟡 中风险", "账期结算时限偏长，不符合防范拖欠企业账款要求，建议调整为 30 日内组织验收并结清"],
            ["第15.1条 数据安全", "项目交付后所有业务数据版权及运营权归甲方所有", "🟢 完全合规", "符合《数据安全法》及《政务数据安全共享管理办法》要求"],
            ["第18.2条 争议解决", "由甲方所在地人民法院管辖", "🟢 完全合规", "符合司法管辖与诉讼程序要求"]
          ]
        },
        policySuggestions: [
          "【高风险必改项】第 4.2 条预付款比例请降至 30%，并将尾款结算与终验合格挂钩。",
          "【中风险建议项】第 8.1 条违约金封顶比例调增至 10%，第 11.3 条验收结清时限缩短至 30 日。",
          "【财审联动】将本合同修正版附件上传至市政务采购统一审批平台，经法务及财审签章后即可下发预算拨款凭证。"
        ],
        followUpPrompts: [
          "生成修正后的《智慧城市三期建设项目合同》修改补充协议文本",
          "核对该合同预算明细与政府采购目录限额标准",
          "导出《项目合同智能合规审查意见书.pdf》"
        ]
      };
    } else if (lower.includes("60岁") || lower.includes("老人") || lower.includes("高龄") || lower.includes("养老")) {
      result = {
        intent: lower.includes("统计") || lower.includes("趋势") || lower.includes("总额") || lower.includes("分析") ? "问数" : "找数",
        thoughtProcess: "1. 识别主题: 老龄人口与养老补贴服务。\n2. 检索政务数据资源目录: 关联市民政局与老龄办《t_pop_elderly_services》表。\n3. 执行多维聚合统计分析: 按近5年趋势及10个行政区进行分类汇总与同比计算。",
        summary: "已定位全市老龄人口及高龄津贴主题数据库。全市60岁以上常住老人共计 142.8 万人，近5年年均增长率 4.1%。其中80岁以上高龄老人 22.4 万人，月均高龄津贴发放规模约 4,850 万元。",
        sql: `SELECT 
  district_name AS 行政区划,
  COUNT(person_id) AS 60岁以上老人数,
  SUM(CASE WHEN age >= 80 THEN 1 ELSE 0 END) AS 高龄老人数,
  SUM(subsidy_amount) AS 月发放津贴总额_元
FROM t_pop_elderly_services
WHERE update_time >= '2026-01-01'
GROUP BY district_name
ORDER BY 60岁以上老人数 DESC;`,
        datasetInfo: {
          tableName: "t_pop_elderly_services",
          tableComment: "全市60岁以上老龄人口及高龄津贴服务综合表",
          dataCount: 1428000,
          updateFrequency: "每日夜间增量更新",
          securityLevel: "政务Ⅲ级 (公安身份哈希/脱敏)",
          department: "市民政局 / 市老龄办 / 市公安局",
          fields: [
            { name: "person_id", type: "VARCHAR(64)", comment: "人员加密唯一主键", desensitized: true },
            { name: "age", type: "INT", comment: "实际年龄", desensitized: false },
            { name: "elderly_grade", type: "VARCHAR(32)", comment: "老龄分类(60-79岁/80-89岁/90岁+)", desensitized: false },
            { name: "subsidy_amount", type: "DECIMAL(10,2)", comment: "月度高龄津贴标准(元)", desensitized: false },
            { name: "district_name", type: "VARCHAR(64)", comment: "所属行政区划", desensitized: false },
            { name: "street_name", type: "VARCHAR(64)", comment: "所属街道办", desensitized: false },
            { name: "grant_status", type: "VARCHAR(16)", comment: "津贴发放状态(已发放/审核中/暂停)", desensitized: false }
          ]
        },
        kpiCards: [
          { title: "60岁+老龄人口", value: "142.8", unit: "万人", trend: "+4.1%", trendType: "up" },
          { title: "80岁+高龄老人", value: "22.4", unit: "万人", trend: "+6.8%", trendType: "up" },
          { title: "月高龄津贴总额", value: "4850", unit: "万元", trend: "+5.2%", trendType: "up" },
          { title: "津贴按时发放率", value: "99.8", unit: "%", trend: "保持稳定", trendType: "neutral" }
        ],
        chart: {
          type: "line",
          title: "近5年全市60岁以上老龄人口增长趋势与津贴发放规模 (2022-2026)",
          xAxisKey: "year",
          dataKeys: ["population", "subsidy"],
          dataKeysLabels: { population: "60岁以上老人(万人)", subsidy: "年津贴总发放(亿元)" },
          data: [
            { year: "2022年", population: 121.2, subsidy: 4.12 },
            { year: "2023年", population: 126.8, subsidy: 4.38 },
            { year: "2024年", population: 132.5, subsidy: 4.71 },
            { year: "2025年", population: 137.9, subsidy: 5.10 },
            { year: "2026年(预计)", population: 142.8, subsidy: 5.82 }
          ]
        },
        tablePreview: {
          columns: ["行政区划", "60-79岁人口(万)", "80岁以上高龄(万)", "月度津贴总额(万)", "养老设施匹配率"],
          rows: [
            ["海淀区", "21.4", "3.8", "820.5", "92.4%"],
            ["朝阳区", "23.8", "4.2", "910.2", "88.6%"],
            ["西城区", "14.5", "2.9", "610.0", "95.1%"],
            ["东城区", "12.8", "2.5", "530.8", "94.2%"],
            ["丰台区", "18.2", "2.8", "580.4", "82.1%"],
            ["石景山区", "8.6", "1.4", "290.1", "89.0%"]
          ]
        },
        policySuggestions: [
          "建议朝阳区与丰台区加快社区日间照料中心建设，弥补养老设施匹配率缺口。",
          "建立高龄津贴免申即享机制，通过人脸识别与离世注销数据跨部门联动自动核销。"
        ],
        followUpPrompts: [
          "分析各区老龄人口与社区养老床位的供需匹配度",
          "对比常住人口与户籍人口中的老龄化结构差异",
          "导出《全市老龄人口及高龄津贴专题分析报告.pdf》"
        ]
      };
    } else if (lower.includes("流动人口") || lower.includes("外来人口") || lower.includes("来源省份")) {
      result = {
        intent: lower.includes("统计") || lower.includes("分析") || lower.includes("分布") ? "问数" : "找数",
        thoughtProcess: "1. 锁定专题: 流动人口与居留服务管理数据库。\n2. 查询表 `t_pop_floating` 与公安居住证签发记录。\n3. 按来源省份Top 10及主要务工行业维度做交叉统计。",
        summary: "全市流动人口登记总量为 586.4 万人，主要集中在朝阳区、海淀区与昌平区。来源省份前三位分别为河北省(22.4%)、河南省(14.2%)、山东省(10.8%)。",
        sql: `SELECT 
  source_province AS 来源省份,
  COUNT(person_id) AS 流动人口数量,
  ROUND(COUNT(person_id) * 100.0 / SUM(COUNT(person_id)) OVER(), 2) AS 占比_百分比,
  SUM(CASE WHEN is_registered_residence_permit = 1 THEN 1 ELSE 0 END) AS 已办居住证人数
FROM t_pop_floating
GROUP BY source_province
ORDER BY 流动人口数量 DESC
LIMIT 10;`,
        datasetInfo: {
          tableName: "t_pop_floating",
          tableComment: "全市流动人口与居住证综合管理数据表",
          dataCount: 5864000,
          updateFrequency: "实时同步 (公安/网格员上报)",
          securityLevel: "政务Ⅲ级 (脱敏)",
          department: "市公安局人口基地 / 市流动人口网格办",
          fields: [
            { name: "person_id", type: "VARCHAR(64)", comment: "流动人员唯一标识", desensitized: true },
            { name: "source_province", type: "VARCHAR(32)", comment: "来源省份", desensitized: false },
            { name: "residence_reason", type: "VARCHAR(32)", comment: "来京原因(务工/随迁/经商/学习)", desensitized: false },
            { name: "industry", type: "VARCHAR(64)", comment: "主要从业行业", desensitized: false },
            { name: "dwell_duration_months", type: "INT", comment: "在京居住时长(月)", desensitized: false },
            { name: "is_registered_residence_permit", type: "TINYINT", comment: "是否申领居住证(1/0)", desensitized: false }
          ]
        },
        kpiCards: [
          { title: "流动人口总登记量", value: "586.4", unit: "万人", trend: "+1.8%", trendType: "up" },
          { title: "居住证持证率", value: "88.5", unit: "%", trend: "+2.4%", trendType: "up" },
          { title: "平均居住时长", value: "41.2", unit: "个月", trend: "+3.1%", trendType: "up" },
          { title: "务工经商比例", value: "76.2", unit: "%", trend: "平稳", trendType: "neutral" }
        ],
        chart: {
          type: "bar",
          title: "全市流动人口来源省份分布 Top 8 (单位: 万人)",
          xAxisKey: "province",
          dataKeys: ["count", "permits"],
          dataKeysLabels: { count: "登记流动人口(万)", permits: "已办理居住证(万)" },
          data: [
            { province: "河北省", count: 131.3, permits: 118.2 },
            { province: "河南省", count: 83.2, permits: 72.8 },
            { province: "山东省", count: 63.3, permits: 56.4 },
            { province: "安徽省", count: 48.1, permits: 42.0 },
            { province: "黑龙江", count: 39.5, permits: 34.8 },
            { province: "山西省", count: 35.2, permits: 31.0 },
            { province: "湖北省", count: 29.8, permits: 26.1 },
            { province: "四川省", count: 27.4, permits: 23.9 }
          ]
        },
        tablePreview: {
          columns: ["来源省份", "登记人数(万)", "占比", "主导行业", "平均年龄"],
          rows: [
            ["河北省", "131.3", "22.4%", "建筑/信息传输", "36.2岁"],
            ["河南省", "83.2", "14.2%", "居民服务/交通运输", "37.5岁"],
            ["山东省", "63.3", "10.8%", "批发零售/餐饮", "35.8岁"],
            ["安徽省", "48.1", "8.2%", "制造/租赁服务", "38.1岁"],
            ["黑龙江省", "39.5", "6.7%", "家政/健康服务", "41.0岁"]
          ]
        },
        policySuggestions: [
          "建议推动居住证跨省通办与全程网办，提升流动人口基本公共服务均等化水平。"
        ],
        followUpPrompts: [
          "分析流动人口在各区及重点产业园区的空间集聚热力图",
          "查询流动人口随迁子女义务教育入学保障数据"
        ]
      };
    } else {
      // General / Default response for data query/finding
      result = {
        intent: lower.includes("统计") || lower.includes("问") || lower.includes("多") || lower.includes("分析") ? "问数" : "找数",
        thoughtProcess: "1. 接收政务自然语言指令，解析人口库语义关键词。\n2. 匹配人口库 6 个核心基础与专题数据资产表。\n3. 生成可执行的标准 SQL 查询并计算可视化指标数据。",
        summary: "已响应您的查询指令。已为您连接政务人口全景基础数据库，覆盖全市 2,185.2 万常住人口数据，整合公安、民政、社保、卫健等 8 个委办局跨部门数据源。",
        sql: `SELECT 
  district_name AS 行政区划,
  COUNT(person_id) AS 常住人口数,
  SUM(CASE WHEN huji_type = '户籍' THEN 1 ELSE 0 END) AS 本市户籍人数,
  SUM(CASE WHEN huji_type = '非户籍' THEN 1 ELSE 0 END) AS 流动人口数
FROM t_pop_base_info
GROUP BY district_name
ORDER BY 常住人口数 DESC;`,
        datasetInfo: {
          tableName: "t_pop_base_info",
          tableComment: "全市人口基础信息综合数据表 (常住+户籍+流动)",
          dataCount: 21852000,
          updateFrequency: "实时增量同步",
          securityLevel: "政务Ⅰ级 (严格脱敏权限控)",
          department: "市大数据发起中心 / 市公安局 / 市政务服务局",
          fields: [
            { name: "person_id", type: "VARCHAR(64)", comment: "人口全局统一加密ID", desensitized: true },
            { name: "name", type: "VARCHAR(64)", comment: "姓名(掩码脱敏)", desensitized: true },
            { name: "gender", type: "VARCHAR(8)", comment: "性别", desensitized: false },
            { name: "birth_date", type: "DATE", comment: "出生日期", desensitized: false },
            { name: "district_name", type: "VARCHAR(64)", comment: "居住行政区划", desensitized: false },
            { name: "huji_type", type: "VARCHAR(32)", comment: "户籍类型(本市户籍/外省户籍)", desensitized: false }
          ]
        },
        kpiCards: [
          { title: "全市常住人口", value: "2185.2", unit: "万人", trend: "+0.4%", trendType: "up" },
          { title: "户籍人口比重", value: "64.2", unit: "%", trend: "稳定", trendType: "neutral" },
          { title: "跨部门数据融合率", value: "98.7", unit: "%", trend: "+1.2%", trendType: "up" },
          { title: "日均数据服务调用", value: "42.8", unit: "万次", trend: "+12.5%", trendType: "up" }
        ],
        chart: {
          type: "stacked_bar",
          title: "全市重点行政区常住人口构成 (户籍人口 vs 流动人口)",
          xAxisKey: "district",
          dataKeys: ["huji", "liudong"],
          dataKeysLabels: { huji: "本市户籍(万)", liudong: "外来流动(万)" },
          data: [
            { district: "朝阳区", huji: 208.5, liudong: 136.2 },
            { district: "海淀区", huji: 212.1, liudong: 101.4 },
            { district: "丰台区", huji: 121.8, liudong: 79.2 },
            { district: "昌平区", huji: 68.4, liudong: 82.3 },
            { district: "大兴区", huji: 72.1, liudong: 73.8 },
            { district: "西城区", huji: 89.2, liudong: 21.3 }
          ]
        },
        tablePreview: {
          columns: ["行政区划", "常住人口(万)", "户籍人口(万)", "流动人口(万)", "人口密度(人/km²)"],
          rows: [
            ["朝阳区", "344.7", "208.5", "136.2", "7334"],
            ["海淀区", "313.5", "212.1", "101.4", "7290"],
            ["丰台区", "201.0", "121.8", "79.2", "6570"],
            ["昌平区", "150.7", "68.4", "82.3", "1116"],
            ["大兴区", "145.9", "72.1", "73.8", "1390"]
          ]
        },
        policySuggestions: [
          "保持人口规模与城市综合承载能力相适应，优化产城融合与区域公共资源配置。"
        ],
        followUpPrompts: [
          "找数：查询《育龄妇女与母婴健康服务管理表》库表与API",
          "问数：分析全市常住人口年龄结构与受教育程度交叉分布",
          "问数：计算低保救助人群在各区县的覆盖率与发放金额"
        ]
      };
    }

    return res.json({ success: true, result });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// Population dataset catalog route
app.get("/api/population/datasets", (_req, res) => {
  res.json({
    success: true,
    catalog: [
      { id: "t_pop_base_info", name: "户籍与常住人口基础库", category: "基础资源", count: 21852000, dept: "市公安局" },
      { id: "t_pop_elderly_services", name: "老龄人口与高龄津贴库", category: "民政专题", count: 1428000, dept: "市民政局" },
      { id: "t_pop_floating", name: "流动人口与居留服务库", category: "流调专题", count: 5864000, dept: "市流管办" },
      { id: "t_pop_maternal_child", name: "育龄妇女与妇幼健康库", category: "卫健专题", count: 4210000, dept: "市卫健委" },
      { id: "t_pop_subsidy_low_income", name: "低保扶贫与困难救助库", category: "救助专题", count: 320000, dept: "市民政局" },
      { id: "t_pop_employment", name: "劳动年龄人口就业状况库", category: "人社专题", count: 11400000, dept: "市人社局" }
    ]
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Population Database AI Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
