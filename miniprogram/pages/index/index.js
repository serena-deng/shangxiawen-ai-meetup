// pages/index/index.js
const app = getApp();

Page({
  data: {
    isWaving: false,
    pathwayIndex: 0,
    pathways: [
      { label: '查阅 FDE 6 大能力模块与考核标准', action: 'fde' },
      { label: '在线制作并保存我的横版 AI 名片', action: 'card' },
      { label: '我是企业/渠道方，寻求 AI 项目交付合作', action: 'company' },
      { label: '我是 FDE/开发者，希望加入交付伙伴池', action: 'provider' },
      { label: '回看深圳线下 AI 沙龙与近期活动日程', action: 'hub' }
    ],
    hubTab: 'second', // 'second' | 'first' | 'calendar'
    expanded: {
      secondProgram: false,
      secondGallery: false,
      firstProgram: false,
      firstGallery: false,
      aboutOrigin: false
    },
    secondPrograms: [
      { title: '01｜AIGC 实战分享', detail: '来自 TikTok 的 AI 生图与视频专家，从一张商品图和 Prompt 生成不同风格电商广告，拆解 AI 短剧故事、分镜与踩坑经验。' },
      { title: '02｜跨行业交流', detail: '聊 AI Agent、AIGC 与产品落地，连接电商、制造、教育与内容创作场景。' },
      { title: '03｜AI 创意挑战赛', detail: '4–5 人组成创意小队，现场用 AI 工具完成海报、短剧或行业创新作品并展示。' },
      { title: '04｜自由交流', detail: '让懂技术的人遇见真实场景，让有想法的人找到同频伙伴。' }
    ],
    secondEventPhotos: [
      '/assets/events/aigc-2026-11-08-1.webp',
      '/assets/events/aigc-2026-11-08-2.webp',
      '/assets/events/aigc-2026-11-08-3.webp'
    ],
    firstPrograms: [
      { title: '01｜思维投票', detail: '从好玩实用的 AI 点子开始头脑风暴，现场匿名投票选出最有价值的创意。' },
      { title: '02｜开发分享', detail: '有 AI 落地和商业化经验的嘉宾分享从构思、避坑到做成项目的真实历程。' },
      { title: '03｜免费学习', detail: '和刚接触 AI 的朋友一起完成工具使用的 0–1 入门。' },
      { title: '04｜自由交流', detail: '结识极客、设计师和创业者，交流业务、合作与资源。' }
    ],
    firstEventPhotos: [
      '/assets/events/ai-meetup-2026-10-25-1.webp',
      '/assets/events/ai-meetup-2026-10-25-2.webp',
      '/assets/events/ai-meetup-2026-10-25-3.webp'
    ],
    calendarEvents: [
      {
        month: 'DEC',
        day: '待定',
        upcoming: true,
        status: '筹备中 · 铁律一锁需求',
        title: '企业 AI 交付闭门会（20 人定向邀约）',
        desc: '面向咨询公司、培训机构与有具体 AI 落地需求的企业负责人，现场梳理意向分包项目。',
        goPartner: true
      },
      {
        month: 'JAN',
        day: '待定',
        upcoming: true,
        status: '报名待开放',
        title: '深圳城市沙龙 & 首期 FDE 启航营开放日',
        desc: '50–100 人跨行业线下交流，发布《FDE 能力模型 v1.0》实战解读。'
      },
      {
        month: 'NOV',
        day: '08',
        upcoming: false,
        status: '已圆满结束',
        title: '第二期 · 深圳 AI 沙龙：AIGC 共创局',
        desc: '深圳华侨城晓宇宙咖啡馆 · TikTok 专家实战分享与小组挑战赛。',
        actionTab: 'second'
      },
      {
        month: 'OCT',
        day: '25',
        upcoming: false,
        status: '已圆满结束',
        title: '第一期 · 上下闻交流会：AI 怎么玩儿起来',
        desc: '深圳华侨城晓宇宙咖啡 · 思维投票、00 后硬件创业分享。',
        actionTab: 'first'
      }
    ],
    faqs: [
      { q: '没有技术基础，可以参加社区活动吗？', a: '可以。带上好奇心和你感兴趣的问题就好。欢迎初学者、创作者、开发者、业务顾问，以及想把 AI 用进工作的人。', open: false },
      { q: '什么是上下闻的「FDE」与「AI 交付伙伴计划」？', a: 'FDE（前线部署工程师）是深入企业业务现场、把 AI 方案真正落地交付的复合型伙伴。我们通过 FDE 6 大模块培养与三级认证体系，连接上游企业需求与下游实操人才。', open: false },
      { q: 'AI 名片和沟通提纲会上传个人隐私吗？', a: '不会。名片绘制与提纲生成全部在你的手机本地完成，由你自己选择保存相册或复制到微信发送。', open: false }
    ]
  },

  tapMascot() {
    this.setData({ isWaving: true });
    wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '闻闻向你挥手问好 ✳', icon: 'none' });
    setTimeout(() => this.setData({ isWaving: false }), 1200);
  },

  onPathwayChange(e) {
    this.setData({ pathwayIndex: Number(e.detail.value) });
  },

  execPathway() {
    const act = this.data.pathways[this.data.pathwayIndex].action;
    if (act === 'fde') this.goFde();
    else if (act === 'card') this.goCard();
    else if (act === 'company') {
      app.globalData.targetRole = 'company';
      wx.switchTab({ url: '/pages/partners/partners' });
    } else if (act === 'provider') {
      app.globalData.targetRole = 'provider';
      wx.switchTab({ url: '/pages/partners/partners' });
    } else {
      this.scrollToHub();
    }
  },

  scrollToHub() {
    wx.pageScrollTo({ selector: '#hub-section', duration: 300 });
  },

  switchHubTab(e) {
    this.setData({ hubTab: e.currentTarget.dataset.tab });
  },

  toggleExpand(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ [`expanded.${key}`]: !this.data.expanded[key] });
  },

  previewEventImage(e) {
    const { urls, current } = e.currentTarget.dataset;
    wx.previewImage({ urls, current });
  },

  toggleFaq(e) {
    const idx = e.currentTarget.dataset.idx;
    const key = `faqs[${idx}].open`;
    this.setData({ [key]: !this.data.faqs[idx].open });
  },

  goFde() {
    wx.switchTab({ url: '/pages/fde/fde' });
  },

  goCard() {
    wx.switchTab({ url: '/pages/card/card' });
  },

  goPartners(e) {
    const side = e.currentTarget.dataset.side || 'provider';
    app.globalData.targetRole = side;
    wx.switchTab({ url: '/pages/partners/partners' });
  },

  onShareAppMessage() {
    return {
      title: '上下闻 · AI 交付人才供应链与玩家社区',
      path: '/pages/index/index'
    };
  }
});
