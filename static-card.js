import {esc,types,renderCard,cardText,cardPNG,downloadCanvas,prepareCommunityAssets} from './card-renderer.js';
import {normalizeQRFile} from './qr-upload.js';

const $=selector=>document.querySelector(selector),form=$('#profile-form');
const interests=['图像生成','视频创作','内容写作','AI 编程','智能体 / Agent','工作流自动化','知识管理','产品与创业','行业应用','AI 学习入门'];
const labels={industry:'行业',role:'角色',interests:'AI 兴趣',bio:'一句话介绍',offer:'我可以分享',seek:'我希望连接',contact:'联系方式'};
const visibility={industry:true,role:true,interests:true,bio:true,offer:true,seek:true,contact:false};
let type='explore',theme='navy',personalQR='',uploading=false,uploadRevision=0;
const notice=message=>{$('#qr-upload-status').textContent=message;};
$('#interest-options').innerHTML=interests.map(value=>`<label class="interest-option"><input type="checkbox" name="interests" value="${esc(value)}"><span>${esc(value)}</span></label>`).join('');
$('#visibility-options').innerHTML=Object.entries(labels).map(([key,label])=>`<label><input type="checkbox" data-field="${key}" ${visibility[key]?'checked':''}>${label}${key==='contact'?'（默认隐藏）':''}</label>`).join('');
function card(example=false){
  const data=new FormData(form),nickname=String(data.get('nickname')||'').trim();
  const fields={nickname:nickname||(example?'好奇的 AI 探索者':'')};
  for(const key of Object.keys(visibility))fields[key]=visibility[key]?(key==='interests'?data.getAll('interests'):String(data.get(key)||'').trim()):(key==='interests'?[]:'');
  if(example&&!nickname&&!fields.interests.length){fields.interests=['图像生成','内容写作','行业应用'];fields.bio='想把好玩的 AI，带进真实的工作与生活。';}
  return{variant:'community',type,theme,fields,personalQR:$('#show-personal-qr').checked?personalQR:'',personalQRLabel:$('#personal-qr-label').value.trim()||'扫码联系我',showPersonalQR:$('#show-personal-qr').checked};
}
function update(){renderCard($('#card-preview'),card(true));}
function select(group,key,value,event){const button=event.target.closest(`[data-${key}]`);if(!button)return value;for(const item of group.children){const active=item===button;item.classList.toggle('active',active);item.setAttribute('aria-pressed',String(active));}return button.dataset[key];}
$('#card-types').addEventListener('click',event=>{type=select($('#card-types'),'type',type,event);update();});
$('#card-themes').addEventListener('click',event=>{theme=select($('#card-themes'),'theme',theme,event);update();});
$('#visibility-options').addEventListener('change',event=>{const key=event.target.dataset.field;if(key){visibility[key]=event.target.checked;update();}});
form.addEventListener('submit',event=>event.preventDefault());
form.addEventListener('input',update);
form.addEventListener('change',event=>{if(event.target.name==='interests'&&form.querySelectorAll('[name=interests]:checked').length>5){event.target.checked=false;notice('最多选择 5 个 AI 兴趣方向。');}update();});
$('#personal-qr-file').addEventListener('change',async event=>{const file=event.target.files?.[0];if(!file)return;const revision=++uploadRevision;uploading=true;notice('正在处理二维码图片…');try{const image=await normalizeQRFile(file);if(revision!==uploadRevision)return;personalQR=image;$('#show-personal-qr').checked=true;$('#personal-qr-thumbnail').src=image;$('#qr-upload-preview').hidden=false;$('#qr-file-name').textContent=file.name;$('#upload-prompt').textContent='替换个人二维码';notice('二维码已放入名片，仅在当前浏览器页面处理。');update();}catch(error){if(revision===uploadRevision)notice(error.message);}finally{if(revision===uploadRevision)uploading=false;}});
$('#remove-personal-qr').addEventListener('click',()=>{uploadRevision++;uploading=false;personalQR='';$('#personal-qr-file').value='';$('#personal-qr-thumbnail').removeAttribute('src');$('#qr-upload-preview').hidden=true;$('#upload-prompt').textContent='上传个人二维码';notice('个人二维码已移除。');update();});
function valid(){if(uploading)throw new Error('请等待二维码处理完成。');const current=card();if(!current.fields.nickname)throw new Error('请先填写名片称呼。');if(!current.fields.interests.length)throw new Error('请至少选择一个 AI 兴趣方向。');return current;}
async function action(button,fn){button.disabled=true;try{await fn();}catch(error){notice(error.message);}finally{button.disabled=false;}}
$('#enlarge-card').addEventListener('click',()=>action($('#enlarge-card'),async()=>{const current=card(true);await downloadCanvas(await cardPNG(current),`上下闻-${current.fields.nickname}-预览.png`);}));
$('#save-image').addEventListener('click',()=>action($('#save-image'),async()=>{const current=valid();await downloadCanvas(await cardPNG(current),`上下闻-${current.fields.nickname}-${types[type]}.png`);}));
$('#copy-card').addEventListener('click',()=>action($('#copy-card'),async()=>{const text=cardText(valid());await navigator.clipboard.writeText(text);notice('介绍已复制，可自行发送。');}));
update();prepareCommunityAssets().then(update).catch(()=>notice('社区二维码暂时无法加载，请稍后刷新。'));
