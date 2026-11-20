const $ = selector => document.querySelector(selector);
// 兼容已经分享的社区名片与活动锚点。
if (['#gathering', '#past-events', '#card-studio'].includes(location.hash)) location.replace(`./index.html${location.hash}`);
const directions = [...document.querySelectorAll('[data-direction]')];
function selectDirection(button, focus = false) {
  for (const tab of directions) {
    const active = tab === button;
    tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
  }
  if (focus) button.focus();
}
for (const button of directions) {
  button.addEventListener('click', () => selectDirection(button));
  button.addEventListener('keydown', event => {
    const index = directions.indexOf(button);
    const next = ['ArrowRight','ArrowDown'].includes(event.key) ? (index + 1) % directions.length
      : ['ArrowLeft','ArrowUp'].includes(event.key) ? (index + directions.length - 1) % directions.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? directions.length - 1 : -1;
    if (next < 0) return;
    event.preventDefault(); selectDirection(directions[next], true);
  });
}
const outlines = {
  individual: '你好，我想了解上下闻的交付伙伴计划。\n我的称呼：\n擅长的产品 / 实施方向：\n可参与城市 / 远程：\n近期可用档期：\n可选脱敏案例：\n希望先沟通具体任务，再确认参与及资料分享范围。',
  team: '你好，我们想了解上下闻的团队交付合作。\n团队称呼 / 联系人：\n实际执行人与擅长方向：\n相关产品 / 可选脱敏案例：\n可参与城市 / 远程：\n近期团队档期：\n希望先沟通范围、分工与协作方式。',
  company: '你好，我们为客户交付 AI 产品或解决方案，想沟通实施合作。\n团队 / 产品或方案称呼：\n当前客户项目要解决的问题：\n实施范围 / 预期结果：\n城市 / 远程及期望时间：\n可沟通预算 / 产品方支持：\n希望先共同梳理任务，再确定合适的合作方式。'
};
function selectRole(role) {
  if (!Object.hasOwn(outlines, role)) return;
  for (const button of document.querySelectorAll('[data-role]')) button.setAttribute('aria-pressed', String(button.dataset.role === role));
  $('#contact-outline').textContent = outlines[role]; $('#copy-status').textContent = '';
}
for (const button of document.querySelectorAll('[data-role]')) button.addEventListener('click', () => selectRole(button.dataset.role));
for (const link of document.querySelectorAll('[data-contact-role]')) link.addEventListener('click', () => selectRole(link.dataset.contactRole));
selectRole('individual');
async function copyText(value) {
  try { if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(value); return true; } } catch { /* 回退本地复制。 */ }
  const area = document.createElement('textarea'); area.value = value; area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.append(area); area.select(); let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* 由界面提示手动复制。 */ }
  area.remove(); return copied;
}
$('#copy-outline').addEventListener('click', async () => {
  const copied = await copyText($('#contact-outline').textContent);
  $('#copy-status').textContent = copied ? '已复制。可粘贴到微信，补充后自行发送。' : '暂时无法自动复制，请选中或长按上方提纲手动复制。';
});
$('#copy-wechat').addEventListener('click', async () => {
  const copied = await copyText($('#contact-wechat').textContent);
  $('#contact-status').textContent = copied ? '微信号已复制，请在微信中添加运营。' : '暂时无法自动复制，请手动复制微信号。';
});
const contactPanel = $('#contact-panel');
let contactRevision = 0;
function clearContact() {
  for (const id of ['contact-qr-wrap','contact-wechat-wrap','contact-email','response-note','retry-contact']) $(`#${id}`).hidden = true;
  $('#contact-qr').onerror = null; $('#contact-qr').removeAttribute('src');
  for (const id of ['contact-qr-open','contact-qr-save','contact-email']) $(`#${id}`).removeAttribute('href');
  $('#contact-wechat').textContent = '';
}
async function loadContact() {
  const revision = ++contactRevision;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  contactPanel.setAttribute('aria-busy','true'); clearContact(); $('#contact-status').textContent = '正在加载运营联系方式…';
  try {
    const endpoint = document.documentElement.dataset.page === 'static-preview' ? './preview-site-config.json' : '/api/site';
    const response = await fetch(endpoint,{credentials:'omit',cache:'no-store',signal:controller.signal});
    if (!response.ok) throw new Error('contact unavailable');
    const {contact} = await response.json();
    if (revision !== contactRevision) return;
    if (!contact || typeof contact.enabled !== 'boolean') throw new Error('invalid contact');
    $('#contact-name').textContent = contact.name || '上下闻运营';
    const qrValid = /^(?:\.\/)?assets\/[A-Za-z0-9][A-Za-z0-9._-]{0,119}\.(?:png|jpe?g|webp)$/i.test(contact.qrUrl || '') && !contact.qrUrl.includes('..');
    const wechatValid = /^[A-Za-z][A-Za-z0-9_-]{5,29}$/.test(contact.wechat || '');
    const email = typeof contact.email === 'string' ? contact.email : '';
    const emailValid = email.length <= 254 && /^[A-Za-z0-9](?:[A-Za-z0-9._+-]*[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(email) && !email.includes('..') && email.split('@')[0].length <= 64;
    if (!contact.enabled || !(qrValid || wechatValid || emailValid)) { $('#contact-status').textContent = '运营联系渠道暂未开放，请稍后再来查看。'; return; }
    $('#contact-status').textContent = '先交流意向，再由运营私下对接。';
    if (qrValid) {
      const image = $('#contact-qr');
      image.onerror = () => { if (revision !== contactRevision) return; $('#contact-qr-wrap').hidden = true; $('#contact-status').textContent = wechatValid || emailValid ? '二维码暂时无法加载，请重新加载或使用下方联系渠道。' : '二维码暂时无法加载，请重新加载联系方式。'; $('#retry-contact').hidden = false; };
      $('#contact-qr-open').href = contact.qrUrl; $('#contact-qr-save').href = contact.qrUrl; image.src = contact.qrUrl; $('#contact-qr-wrap').hidden = false;
    }
    if (wechatValid) { $('#contact-wechat').textContent = contact.wechat; $('#contact-wechat-wrap').hidden = false; }
    if (emailValid) { $('#contact-email').textContent = `邮件联系：${email}`; $('#contact-email').href = `mailto:${email}`; $('#contact-email').hidden = false; }
    if (contact.responseNote) { $('#response-note').textContent = contact.responseNote; $('#response-note').hidden = false; }
  } catch { if (revision === contactRevision) { $('#contact-status').textContent = '暂时无法读取运营联系方式，请重新加载。'; $('#retry-contact').hidden = false; } }
  finally { clearTimeout(timeout); if (revision === contactRevision) contactPanel.setAttribute('aria-busy','false'); }
}
$('#retry-contact').addEventListener('click',loadContact); loadContact();
