// pages/partners/partners.js
const app = getApp();

Page({
  data: {
    audienceSide: 'provider', // 'provider' | 'company'
    curDir: 0,
    showDirCheck: false,
    directions: [
      {
        tab: '01 知识库与智能体',
        code: 'DIRECTION 01 / KNOWLEDGE & AGENTS',
        title: '让知识被找到，让助手真正用起来。',
        desc: '从企业非结构化文档整理、检索评估，到业务助手部署与使用交接，关注真实使用中的准确率。',
        scope: '知识库搭建、检索增强（RAG）、智能体配置、效果评估',
        checklist: '对接前需共同确认：资料授权范围、所基于的产品或模型版本、私有/云端部署环境、实际业务使用者角色，以及量化验收方式。'
      },
      {
        tab: '02 业务工作流',
        code: 'DIRECTION 02 / WORKFLOWS & AUTOMATION',
        title: '把反复做的事，变成能运行的流程。',
        desc: '围绕一个具体业务环节，连接工具与人工确认，保留异常处理和维护方式。',
        scope: '内容生产、客服辅助、运营自动化、人工复核节点',
        checklist: '对接前需共同确认：标准输入输出格式、第三方工具账号权限、报错时的异常人工接管机制，以及对接的业务负责人。'
      },
      {
        tab: '03 AI 应用集成',
        code: 'DIRECTION 03 / INTEGRATION & ADOPTION',
        title: '接进现有系统，也接进日常工作。',
        desc: '协助 AI 产品与现有业务系统（企微/飞书/ERP等）连接，完成测试、使用说明和必要的实施交接。',
        scope: 'API 连接、私有化/云端部署、数据流程、使用培训与交接',
        checklist: '对接前需共同确认：现有系统接口文档完整性、独立测试环境、安全访问权限审批，以及产品方二线技术支持响应机制。'
      }
    ],
    curProc: 0,
    procSteps: [
      {
        num: 'STEP 01',
        short: '认识彼此',
        badge: 'STEP 01 / 04 · 建立连接',
        title: '先认识彼此：复制提纲添加运营',
        desc: '在下方选择身份并一键复制沟通提纲，添加上下闻运营微信，介绍你的实际经验、擅长方向、所在城市和近期可用档期。'
      },
      {
        num: 'STEP 02',
        short: '双向核实',
        badge: 'STEP 02 / 04 · 双向核实',
        title: '核实具体情况：梳理任务与实施边界',
        desc: '与上游需求方梳理任务目标、环境条件与验收标准；同时与下游 FDE/实施伙伴沟通脱敏案例、能力适配度与参与意愿。'
      },
      {
        num: 'STEP 03',
        short: '定向引荐',
        badge: 'STEP 03 / 04 · 尊重边界',
        title: '双方同意再介绍：定向引荐会谈',
        desc: '绝不群发简历或盲目派单。在向具体合作方介绍前，先确认可分享的信息范围，双方均认可后再安排会谈。'
      },
      {
        num: 'STEP 04',
        short: '启动合作',
        badge: 'STEP 04 / 04 · 明确交付',
        title: '确认后启动合作：明确分工与验收',
        desc: '在项目正式启动前，明确实施范围、各方分工、费用标准、付款节点与验收清单，再按约推进。'
      }
    ],
    contactRole: 'individual',
    outlines: {
      individual: '你好，我想了解上下闻的交付伙伴计划（个人伙伴 / FDE）。\n我的称呼：\n擅长的产品 / 实施方向：\n可参与城市 / 远程：\n近期可用档期：\n可选脱敏案例：\n希望先沟通具体任务，再确认参与及资料分享范围。',
      team: '你好，我们想了解上下闻的团队交付合作（实施团队 / OPC）。\n团队称呼 / 联系人：\n实际执行人与擅长方向：\n相关产品 / 可选脱敏案例：\n可参与城市 / 远程：\n近期团队档期：\n希望先沟通范围、分工与协作方式。',
      company: '你好，我们为客户交付 AI 产品或解决方案，想沟通实施合作（产品 / 渠道商）。\n团队 / 产品或方案称呼：\n当前客户项目要解决的问题：\n实施范围 / 预期结果：\n城市 / 远程及期望时间：\n可沟通预算 / 产品方支持：\n希望先共同梳理任务，再确定合适的合作方式。'
    }
  },

  onShow() {
    if (app.globalData && app.globalData.targetRole) {
      const side = app.globalData.targetRole;
      this.setData({
        audienceSide: side,
        contactRole: side === 'company' ? 'company' : 'individual'
      });
    }
  },

  switchSide(e) {
    const side = e.currentTarget.dataset.side;
    this.setData({
      audienceSide: side,
      contactRole: side === 'company' ? 'company' : 'individual'
    });
  },

  selectDir(e) {
    this.setData({ curDir: Number(e.currentTarget.dataset.idx), showDirCheck: false });
  },

  toggleDirCheck() {
    this.setData({ showDirCheck: !this.data.showDirCheck });
  },

  selectProc(e) {
    this.setData({ curProc: Number(e.currentTarget.dataset.idx) });
  },

  nextProc() {
    this.setData({ curProc: (this.data.curProc + 1) % this.data.procSteps.length });
  },

  setContactRole(e) {
    this.setData({ contactRole: e.currentTarget.dataset.role });
  },

  scrollToContact(e) {
    const role = e.currentTarget.dataset.role;
    if (role) this.setData({ contactRole: role });
    wx.pageScrollTo({ selector: '#contact-section', duration: 300 });
  },

  copyOutline() {
    const text = this.data.outlines[this.data.contactRole];
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '提纲已复制，可去微信粘贴', icon: 'success' });
      }
    });
  },

  previewOpsQR() {
    wx.previewImage({
      urls: ['/assets/operations-wechat.jpg'],
      current: '/assets/operations-wechat.jpg'
    });
  },

  onShareAppMessage() {
    return {
      title: '上下闻 · AI 交付伙伴计划（企业分包与 FDE 对接）',
      path: '/pages/partners/partners'
    };
  }
});
