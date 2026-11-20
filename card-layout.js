export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const types={explore:'兴趣探索',project:'项目展示',connect:'寻找合作'};
export const themes={
  navy:{bg:'#f5f6f5',fg:'#14272d',accent:'#185d73',deep:'#003747',soft:'#b6c5cb',muted:'#77878d'},
  paper:{bg:'#f8f5ef',fg:'#373830',accent:'#9b805a',deep:'#554c3b',soft:'#ded3bf',muted:'#8c8475'},
  forest:{bg:'#f4f6f1',fg:'#203a30',accent:'#497e68',deep:'#1b493e',soft:'#b8cabe',muted:'#7d8d80'}
};
export function cardExtraRows(card){const f=card.fields||{},rows=[];if(f.offer)rows.push([{explore:'可以聊聊',project:'正在做的事',connect:'我可以分享'}[card.type]||'我可以分享',f.offer]);if(f.seek)rows.push([{explore:'正在寻找',project:'期待共创',connect:'希望连接'}[card.type]||'希望连接',f.seek]);return card.type==='connect'?rows.reverse():rows;}
export function textWidth(text,size){return Array.from(text).reduce((width,char)=>width+size*(/\s/.test(char)?.3:char.codePointAt(0)>0x2e7f?1:/[MWmw@#%&]/.test(char)?.98:/[A-Z0-9]/.test(char)?.74:.61),0);}
export function wrapCardText(text,maxWidth,size){const lines=[];let line='';for(const char of Array.from(String(text||''))){if(char==='\n'){lines.push(line);line='';continue;}if(line&&textWidth(line+char,size)>maxWidth){lines.push(line);line=char;}else line+=char;}if(line)lines.push(line);return lines;}
export function createCardLayout(card,{preview=false}={}){
  const f=card.fields||{},color=themes[card.theme]||themes.navy,variant=card.variant==='personal'?'personal':'community';
  const right=1170,maxWidth=740,rows=[];let y=140;
  function add(text,size,tone=color.fg,gap=14,weight=400){if(!text)return;const lines=wrapCardText(text,maxWidth,size);for(const line of lines){rows.push({text:line,x:right,y,size,color:tone,weight});y+=size*1.45;}y+=gap;}
  const name=String(f.nickname||'');let nameSize=60;while(nameSize>34&&textWidth(name,nameSize)>maxWidth)nameSize-=2;
  add(name,nameSize,color.fg,0,600);const underline=(rows.at(-1)?.y||140)+22;y=underline+48;
  add(f.role,31,color.fg,7);add(f.industry,19,color.muted,9);add(f.bio,23,color.muted,25);
  if(f.interests?.length)add(f.interests.map(i=>`#${i}`).join('   '),25,color.fg,13,500);
  for(const[label,text]of cardExtraRows(card))add(`${label} / ${text}`,23,color.fg,7);
  add(f.contact?`联系我 / ${f.contact}`:'',19,color.muted,6);
  const qrY=Math.max(490,y+12),qrSize=150,qrSlots=[];
  if(card.personalQR||(preview&&card.showPersonalQR!==false))qrSlots.push({kind:'personal',x:variant==='community'?790:1005,y:qrY,size:qrSize,label:card.personalQRLabel||'扫码联系我',image:card.personalQR||''});
  if(variant==='community')qrSlots.push({kind:'community',x:1005,y:qrY,size:qrSize,label:'上下闻 · 活动入口'});
  return{width:1260,height:Math.max(720,qrY+qrSize+65),variant,color,rows,underline,qrSlots,bodyBottom:y};
}
function safeImage(value,fallback=''){if(typeof value!=='string')return fallback;if(/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))return value;if(['./assets/shangxiawen-logo.png','./assets/community-qr.png'].includes(value))return value;return fallback;}
export function cardSVG(card,{preview=false,logo='./assets/shangxiawen-logo.png',communityQR='./assets/community-qr.png'}={}){
  const layout=createCardLayout(card,{preview}),{width:w,height:h,color:c,variant,rows,underline,qrSlots}=layout;
  const text=rows.map(r=>`<text x="${r.x}" y="${r.y}" font-size="${r.size}" fill="${r.color}" font-weight="${r.weight}" text-anchor="end">${esc(r.text)}</text>`).join('');
  const logoBlock=variant==='community'?`<image href="${esc(safeImage(logo,'./assets/shangxiawen-logo.png'))}" x="48" y="62" width="272" height="113" preserveAspectRatio="xMidYMid meet" aria-label="上下闻 Logo"/><text x="61" y="192" fill="#bbd0d3" font-size="14">在交流中生长，让灵感上下相闻。</text>`:`<text x="60" y="108" fill="#d1e1e1" font-size="17" letter-spacing="4">AI / IDENTITY</text><text x="60" y="157" fill="#f3f5ef" font-size="29">${esc(types[card.type]||'AI 名片')}</text>`;
  const qrs=qrSlots.map(q=>{
    const image=safeImage(q.kind==='community'?communityQR:q.image);
    return `<g aria-label="${q.kind==='community'?'社区活动二维码':'个人二维码'}"><rect x="${q.x-7}" y="${q.y-7}" width="${q.size+14}" height="${q.size+14}" rx="8" fill="#ffffff"/>${image?`<image href="${esc(image)}" x="${q.x}" y="${q.y}" width="${q.size}" height="${q.size}" preserveAspectRatio="xMidYMid meet"/>`:`<rect x="${q.x}" y="${q.y}" width="${q.size}" height="${q.size}" rx="5" fill="#e1e7e8"/><path d="M${q.x+56} ${q.y+75}h38m-19-19v38" stroke="#879ca4" stroke-width="2"/><text x="${q.x+q.size/2}" y="${q.y+119}" text-anchor="middle" font-size="14" fill="#7d8c91">上传个人二维码</text>`}<text x="${q.x+q.size/2}" y="${q.y+q.size+31}" fill="${c.muted}" font-size="17" text-anchor="middle">${esc(q.label)}</text></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc((card.fields?.nickname||'我的')+' · '+(variant==='personal'?'纯个人名片':'上下闻社区名片'))}" font-family="PingFang SC, Microsoft YaHei, sans-serif"><rect width="${w}" height="${h}" fill="${c.bg}"/><path d="M180 0H635L180 455H0V260Z" fill="${c.soft}"/><path d="M0 270L406 660Q424 677 405 696L380 ${h}H0Z" fill="${c.accent}"/><path d="M0 0H190L310 120Q332 143 311 164L0 478Z" fill="${c.deep}"/><path d="M0 323Q11 312 27 329L130 432Q151 452 131 474L38 570Q0 607 0 565Z" fill="${c.deep}"/><path d="M445 ${h-280}L700 ${h}H445Z" fill="#000000" opacity=".055"/><path d="M${w-250} 0H${w}V270L${w-360} 650L${w-440} 570L${w-100} 210Z" fill="#000000" opacity=".022"/><path d="M${w-6} 155L${w-370} 520M460 236L770 546" stroke="#000000" stroke-width="2" opacity=".035"/>${logoBlock}<line x1="${Math.max(705,1170-textWidth(String(card.fields?.nickname||''),rows[0]?.size||60)-20)}" y1="${underline}" x2="1172" y2="${underline}" stroke="${c.fg}" stroke-width="2"/><line x1="1196" y1="${Math.min(325,qrSlots[0]?.y||325)}" x2="1196" y2="${h-55}" stroke="${c.fg}" stroke-width="3" stroke-linecap="round"/>${text}${qrs}</svg>`;
}
export function cardText(card){const f=card.fields||{},personal=card.variant==='personal';return[`${f.nickname}｜${personal?'AI 名片':'上下闻 AI 名片'}`,[f.industry,f.role].filter(Boolean).join(' · '),f.interests?.length?`AI 兴趣：${f.interests.join(' / ')}`:'',f.bio,...cardExtraRows(card).map(([label,value])=>`${label}：${value}`),f.contact?`联系我：${f.contact}`:'',personal?'':'在交流中生长，让灵感上下相闻。'].filter(Boolean).join('\n');}
