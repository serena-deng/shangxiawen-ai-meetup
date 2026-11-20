// pages/card/card.js
const THEMES = {
  navy: { bg: '#f5f6f5', fg: '#14272d', accent: '#185d73', deep: '#003747', soft: '#b6c5cb', muted: '#687a80' },
  paper: { bg: '#f8f5ef', fg: '#373830', accent: '#9b805a', deep: '#554c3b', soft: '#ded3bf', muted: '#7e7768' },
  forest: { bg: '#f4f6f1', fg: '#203a30', accent: '#497e68', deep: '#1b493e', soft: '#b8cabe', muted: '#6c7d70' }
};

Page({
  data: {
    steps: ['基础身份', '兴趣标签', '供需连接', '二维码'],
    curStep: 0,
    showStyleDrawer: false,
    theme: 'navy',
    themeLabels: { navy: '海湾蓝', paper: '暖纸棕', forest: '森林绿' },
    cardType: 'explore',
    typeLabels: { explore: '兴趣探索', project: '项目展示', connect: '寻找合作' },
    nickname: '',
    role: '',
    industry: '',
    industries: ['互联网 / 科技', '设计 / 创意', '教育 / 培训', '金融 / 投资', '制造 / 工程', '零售 / 消费', '医疗 / 健康', '文化 / 传媒', '学生 / 研究', '其他领域'],
    bio: '',
    offer: '',
    seek: '',
    contact: '',
    showContact: false,
    personalQR: '',
    personalQRLabel: '扫码联系我',
    interestOptions: [
      { name: '图像生成', checked: true },
      { name: '视频创作', checked: false },
      { name: '内容写作', checked: false },
      { name: 'AI 编程', checked: false },
      { name: '智能体 / Agent', checked: true },
      { name: '工作流自动化', checked: true },
      { name: '知识管理', checked: false },
      { name: '产品与创业', checked: false },
      { name: '行业应用', checked: false },
      { name: 'AI 学习入门', checked: false }
    ],
    selectedInterests: ['图像生成', '智能体 / Agent', '工作流自动化']
  },

  toggleStyleDrawer() {
    this.setData({ showStyleDrawer: !this.data.showStyleDrawer });
  },

  setTheme(e) {
    this.setData({ theme: e.currentTarget.dataset.theme });
  },

  setCardType(e) {
    this.setData({ cardType: e.currentTarget.dataset.type });
  },

  goStep(e) {
    this.setData({ curStep: Number(e.currentTarget.dataset.step) });
  },

  prevStep() {
    if (this.data.curStep > 0) this.setData({ curStep: this.data.curStep - 1 });
  },

  nextStep() {
    if (this.data.curStep < 3) this.setData({ curStep: this.data.curStep + 1 });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [field]: e.detail.value });
  },

  onIndustryChange(e) {
    this.setData({ industry: this.data.industries[Number(e.detail.value)] });
  },

  toggleShowContact(e) {
    this.setData({ showContact: e.detail.value });
  },

  toggleInterest(e) {
    const idx = Number(e.currentTarget.dataset.idx);
    const list = this.data.interestOptions;
    const currentlyChecked = list.filter(i => i.checked).length;
    if (!list[idx].checked && currentlyChecked >= 5) {
      wx.showToast({ title: '最多选择 5 个兴趣标签', icon: 'none' });
      return;
    }
    list[idx].checked = !list[idx].checked;
    const selectedInterests = list.filter(i => i.checked).map(i => i.name);
    this.setData({ interestOptions: list, selectedInterests });
  },

  choosePersonalQR() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ personalQR: tempFilePath });
        wx.showToast({ title: '二维码已添加', icon: 'success' });
      }
    });
  },

  removePersonalQR() {
    this.setData({ personalQR: '' });
  },

  copyCardIntro() {
    const name = this.data.nickname.trim() || '好奇的 AI 探索者';
    const lines = [
      `${name}｜上下闻 AI 名片（${this.data.typeLabels[this.data.cardType]}）`,
      [this.data.industry, this.data.role].filter(Boolean).join(' · '),
      this.data.selectedInterests.length ? `AI 兴趣：${this.data.selectedInterests.join(' / ')}` : '',
      this.data.bio || '想把好玩的 AI，带进真实的工作与生活。',
      this.data.offer ? `可以分享：${this.data.offer}` : '',
      this.data.seek ? `希望连接：${this.data.seek}` : '',
      this.data.showContact && this.data.contact ? `联系我：${this.data.contact}` : '',
      '在交流中生长，让灵感上下相闻。'
    ].filter(Boolean).join('\n');

    wx.setClipboardData({
      data: lines,
      success: () => wx.showToast({ title: '名片介绍已复制', icon: 'success' })
    });
  },

  // 使用微信小程序 Canvas 2D 绘制 1260x720 高清横版名片并保存到相册
  exportCardToAlbum() {
    const name = this.data.nickname.trim() || '好奇的 AI 探索者';
    wx.showLoading({ title: '正在生成高清名片…' });

    const query = wx.createSelectorQuery();
    query.select('#cardCanvas')
      .fields({ node: true, size: true })
      .exec(async res => {
        try {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const W = 1260;
          const H = 720;
          canvas.width = W;
          canvas.height = H;

          const c = THEMES[this.data.theme] || THEMES.navy;

          // 1. 背景与几何色块
          ctx.fillStyle = c.bg;
          ctx.fillRect(0, 0, W, H);

          ctx.fillStyle = c.soft;
          ctx.beginPath();
          ctx.moveTo(180, 0);
          ctx.lineTo(620, 0);
          ctx.lineTo(180, 440);
          ctx.lineTo(0, 440);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = c.accent;
          ctx.beginPath();
          ctx.moveTo(0, 270);
          ctx.lineTo(410, 670);
          ctx.lineTo(380, H);
          ctx.lineTo(0, H);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = c.deep;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(190, 0);
          ctx.lineTo(320, 140);
          ctx.lineTo(0, 470);
          ctx.closePath();
          ctx.fill();

          // 2. 绘制左上角品牌文字
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 42px sans-serif';
          ctx.textAlign = 'left';
          ctx.fillText('上下闻', 56, 110);
          ctx.fillStyle = '#bbd0d3';
          ctx.font = '18px sans-serif';
          ctx.fillText('在交流中生长，让灵感上下相闻。', 56, 150);

          // 3. 右侧个人信息（右对齐）
          const rightX = 1170;
          ctx.textAlign = 'right';
          ctx.fillStyle = c.fg;
          ctx.font = 'bold 56px sans-serif';
          ctx.fillText(name, rightX, 135);

          // 名字下划线与右侧竖线
          ctx.strokeStyle = c.fg;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(760, 160);
          ctx.lineTo(rightX, 160);
          ctx.stroke();

          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(1198, 100);
          ctx.lineTo(1198, H - 60);
          ctx.stroke();

          let y = 215;
          const roleLine = [this.data.role || 'AI 实践者', this.data.industry].filter(Boolean).join(' · ');
          ctx.font = '28px sans-serif';
          ctx.fillStyle = c.fg;
          ctx.fillText(roleLine, rightX, y);
          y += 46;

          ctx.font = '23px sans-serif';
          ctx.fillStyle = c.muted;
          ctx.fillText(this.data.bio || '想把好玩的 AI，带进真实的工作与生活。', rightX, y);
          y += 52;

          const tags = (this.data.selectedInterests.length ? this.data.selectedInterests : ['图像生成', '工作流自动化']).map(t => `#${t}`).join('   ');
          ctx.font = 'bold 24px sans-serif';
          ctx.fillStyle = c.accent;
          ctx.fillText(tags, rightX, y);
          y += 50;

          ctx.font = '23px sans-serif';
          ctx.fillStyle = c.fg;
          if (this.data.offer) {
            ctx.fillText(`可以分享 / ${this.data.offer.slice(0, 28)}`, rightX, y);
            y += 40;
          }
          if (this.data.seek) {
            ctx.fillText(`希望连接 / ${this.data.seek.slice(0, 28)}`, rightX, y);
            y += 40;
          }
          if (this.data.showContact && this.data.contact) {
            ctx.font = '20px sans-serif';
            ctx.fillStyle = c.muted;
            ctx.fillText(`联系我 / ${this.data.contact}`, rightX, y);
          }

          // 4. 绘制底部二维码
          const loadImg = src => new Promise((resolve, reject) => {
            const img = canvas.createImage();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
          });

          const qrY = 490;
          const qrSize = 146;
          try {
            const commQR = await loadImg('/assets/community-qr.png');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(1000, qrY - 8, qrSize + 16, qrSize + 16);
            ctx.drawImage(commQR, 1008, qrY, qrSize, qrSize);
            ctx.fillStyle = c.muted;
            ctx.font = '17px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('上下闻 · 社区', 1008 + qrSize / 2, qrY + qrSize + 30);
          } catch (e) {}

          if (this.data.personalQR) {
            try {
              const pQR = await loadImg(this.data.personalQR);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(790, qrY - 8, qrSize + 16, qrSize + 16);
              ctx.drawImage(pQR, 798, qrY, qrSize, qrSize);
              ctx.fillStyle = c.muted;
              ctx.font = '17px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(this.data.personalQRLabel || '扫码联系我', 798 + qrSize / 2, qrY + qrSize + 30);
            } catch (e) {}
          }

          wx.canvasToTempFilePath({
            canvas,
            width: W,
            height: H,
            destWidth: W * 2,
            destHeight: H * 2,
            success: tmp => {
              wx.hideLoading();
              wx.saveImageToPhotosAlbum({
                filePath: tmp.tempFilePath,
                success: () => {
                  wx.showToast({ title: '已保存到手机相册', icon: 'success' });
                },
                fail: () => {
                  // 若相册权限未开启，直接弹出大图供用户长按保存
                  wx.previewImage({ urls: [tmp.tempFilePath], current: tmp.tempFilePath });
                }
              });
            },
            fail: () => {
              wx.hideLoading();
              wx.showToast({ title: '导出失败，请重试', icon: 'none' });
            }
          });
        } catch (err) {
          wx.hideLoading();
          wx.showToast({ title: '绘制失败', icon: 'none' });
        }
      });
  }
});
