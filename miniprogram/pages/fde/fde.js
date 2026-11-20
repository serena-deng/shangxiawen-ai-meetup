// pages/fde/fde.js
const app = getApp();

const DEMO_CERTS = {
  'SXW-FDE-2026001': {
    name: '林*（示例持证人）',
    level: 'L2 · 独立交付 FDE',
    modules: 'M01–M06 全模块通过',
    city: '深圳 / 远程',
    status: '有效（至 2027-11）'
  },
  'SXW-FDE-2026002': {
    name: '陈*（示例持证人）',
    level: 'L3 · 架构与带队 FDE + AI 销售',
    modules: 'M01–M06 全模块优秀',
    city: '深圳 / 广州',
    status: '有效（至 2027-11）'
  }
};

Page({
  data: {
    showCompare: false,
    showCompliance: false,
    curMod: 0,
    modules: [
      {
        short: 'M01 业务诊断',
        code: 'MODULE 01 / 06 · 需求侧起点',
        name: '业务诊断与需求边界',
        desc: '走进企业业务现场，识别哪些环节适合用 AI 改造、哪些应当保留人工规则，拦截伪需求并制定清晰的验收指标。',
        output: '业务场景诊断书、ROI 测算与验收清单',
        exam: '真实企业案例需求拆解与防坑答辩',
        role: 'FDE 工程师、AI 销售顾问、方案负责人（必修）'
      },
      {
        short: 'M02 知识库RAG',
        code: 'MODULE 02 / 06 · 数据与知识层',
        name: '知识库治理与 RAG 检索',
        desc: '清洗企业非结构化文档（PDF、表格、手册），设计切片策略、元数据标签与检索增强管线，解决幻觉与答非所问。',
        output: '高准确率企业知识库、QA 测试集（≥50 题）',
        exam: '召回率与回答准确率盲测达标',
        role: 'FDE 工程师、知识工程实施伙伴'
      },
      {
        short: 'M03 工作流编排',
        code: 'MODULE 03 / 06 · 流程编排层',
        name: '业务工作流与 Agent 编排',
        desc: '使用主流编排工具（Dify / Coze / n8n / LangGraph 等）把多步业务动作串成稳定流程，设计人工复核与异常兜底节点。',
        output: '可稳定运行的自动化工作流与异常处理手册',
        exam: '给定边界条件下的压力测试与容错验收',
        role: 'FDE 工程师、独立开发者、工作流专家'
      },
      {
        short: 'M04 系统集成',
        code: 'MODULE 04 / 06 · 系统工程层',
        name: '应用集成与环境部署',
        desc: '将 AI 能力接入企微、飞书、钉钉或现有业务系统 API，处理私有化/云端环境配置、权限隔离与数据安全合规。',
        output: '端到端集成系统、接口文档与安全检查表',
        exam: '跨平台联调演示与权限安全审查',
        role: 'FDE 工程师、全栈开发与系统集成团队'
      },
      {
        short: 'M05 价值销售',
        code: 'MODULE 05 / 06 · 商业转化层',
        name: 'AI 方案沟通与价值销售',
        desc: '面向企业决策者与业务负责人，用听得懂的业务语言讲清 AI 方案价值、边界与报价逻辑，现场演示 POC 打消顾虑。',
        output: 'POC 现场演示方案、立项建议书与报价单',
        exam: '模拟客户老板与业务主管现场高压问答',
        role: 'AI 销售顾问、FDE 双栖伙伴、咨询顾问'
      },
      {
        short: 'M06 交付验收',
        code: 'MODULE 06 / 06 · 闭环沉淀层',
        name: '交付验收、赋能与复盘',
        desc: '编写一线员工看得懂的操作 SOP，完成客户团队培训交接、二期需求挖掘，并将项目脱敏沉淀为可复用的行业模板。',
        output: '客户交接 SOP、培训课件与脱敏交付复盘报告',
        exam: '交付物完整性评审与客户满意度模拟验收',
        role: '全体认证 FDE 与项目交付负责人'
      }
    ],
    curTier: 1,
    tiers: [
      {
        badge: 'TIER 01 · 入门实战',
        price: '¥999 / 期',
        title: 'AI 交付启航营',
        desc: '适合希望掌握 FDE 六大模块基础方法、跑通从需求诊断到工作流搭建全流程的学习者。',
        featured: false,
        points: [
          'FDE 能力模型 6 大模块核心方法精讲',
          '真实企业脱敏场景沙盘演练',
          '上下闻校友社群与线下城市沙龙优先席位',
          '结业颁发启航营完课证明（暂不进派单池）'
        ]
      },
      {
        badge: 'TIER 02 · 核心主力（推荐）',
        price: '¥1,999 / 期',
        title: '认证 FDE 工程师',
        desc: '适合程序员、产品经理、技术转型者与超级个体。师徒制带队实战，考核通过后进入官方 FDE 交付人才池。',
        featured: true,
        points: [
          '包含启航营全部课程与 6 模块实战考核',
          '导师带队参与真实或高仿真企业交付项目',
          '通过考核授予「上下闻认证 FDE（L1–L3）」编号',
          '进入官方 FDE 人才池对接项目（平台服务抽成参考 20%）'
        ]
      },
      {
        badge: 'TIER 03 · 复合伙伴',
        price: '¥2,999 / 期',
        title: 'FDE + AI 销售双栖班',
        desc: '适合咨询顾问、ToB 销售、运营主理人及 OPC 团队负责人。既懂技术交付边界，又能独立谈单与带队交付。',
        featured: false,
        points: [
          '涵盖 FDE 交付能力 + AI 销售谈单与陪跑方法论',
          '进入 FDE 人才池 + AI 销售池双重对接网络',
          '具备带人交付与渠道分销资格（平台服务抽成参考 15%）',
          '优秀者可申请成为上下闻城市合伙人'
        ]
      }
    ],
    certCode: '',
    verifyMsg: '',
    verifyPass: false,
    curAnat: 0,
    anatomy: [
      {
        short: '01 · 精灵耳与收音灯',
        title: '01 · 精灵耳 & 收音灯 (ELF EARS)',
        desc: '「闻」字里的那只耳。耳廓内画着三道声波，擅长倾听真实业务痛点；头顶珊瑚色收音灯亮起，代表正在认真听你说话。'
      },
      {
        short: '02 · 门形脑袋与夜蓝屏',
        title: '02 · 门形脑袋 & 夜蓝屏 (DOOR HEAD)',
        desc: '「闻」字的外框是「门」。拱门里的深蓝屏幕与星光大眼，是它与每位伙伴眼神互动的窗口。'
      },
      {
        short: '03 · 字块 Tokens 与连线',
        title: '03 · 字块 Tokens & 注意力连线',
        desc: '放射状细线连接着「上、下、闻、听、聊」字块与对话气泡，象征把分散的灵感与需求连成网络。'
      },
      {
        short: '04 · 上下双轨与银身',
        title: '04 · 上下双轨 & 扭转液态银身',
        desc: '上轨记住已说过的「上文」，下轨承载未说出口的「下文」；液态金属旋尾扎根线下真实场景。'
      }
    ]
  },

  toggleCompare() {
    this.setData({ showCompare: !this.data.showCompare });
  },

  toggleCompliance() {
    this.setData({ showCompliance: !this.data.showCompliance });
  },

  selectMod(e) {
    this.setData({ curMod: Number(e.currentTarget.dataset.idx) });
  },

  nextMod() {
    this.setData({ curMod: (this.data.curMod + 1) % this.data.modules.length });
  },

  selectTier(e) {
    this.setData({ curTier: Number(e.currentTarget.dataset.idx) });
  },

  onCertInput(e) {
    this.setData({ certCode: e.detail.value });
  },

  fillSampleCert(e) {
    const code = e.currentTarget.dataset.code;
    this.setData({ certCode: code }, () => this.verifyCert());
  },

  verifyCert() {
    const code = (this.data.certCode || '').trim().toUpperCase();
    if (!code) {
      this.setData({ verifyPass: false, verifyMsg: '请输入证书编号（可点击上方示例编号体验）。' });
      return;
    }
    const match = DEMO_CERTS[code];
    if (match) {
      this.setData({
        verifyPass: true,
        verifyMsg: `✓ 核验通过 · ${code}\n持证人：${match.name}\n认证级别：${match.level}\n考核模块：${match.modules}\n常驻地：${match.city} ｜ 状态：${match.status}`
      });
    } else {
      this.setData({
        verifyPass: false,
        verifyMsg: `未查询到编号 ${code} 的公开记录。\n首批认证班正在筹备中；如需人工核实候选人经验，请前往「交付合作」页联系运营。`
      });
    }
  },

  selectAnat(e) {
    this.setData({ curAnat: Number(e.currentTarget.dataset.idx) });
  },

  previewWenwen() {
    wx.previewImage({
      urls: ['/assets/wenwen-design.png'],
      current: '/assets/wenwen-design.png'
    });
  },

  goApply() {
    app.globalData.targetRole = 'provider';
    wx.switchTab({ url: '/pages/partners/partners' });
  },

  onShareAppMessage() {
    return {
      title: '上下闻 FDE 能力模型 v1.0 与认证核验',
      path: '/pages/fde/fde'
    };
  }
});
