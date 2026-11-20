import {esc,types,themes,cardSVG,cardText,createCardLayout} from './card-layout.js';
export {esc,types,themes,cardText,cardSVG,createCardLayout};
let communityAssets={logo:'./assets/shangxiawen-logo.png',communityQR:'./assets/community-qr.png'},assetPromise;
function blobData(blob){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});}
export async function prepareCommunityAssets(){
  if(!assetPromise)assetPromise=Promise.all(['./assets/shangxiawen-logo.png','./assets/community-qr.png'].map(async url=>{const response=await fetch(url);if(!response.ok)throw new Error('社区标志或二维码暂时无法读取，请稍后重试。');return blobData(await response.blob());})).then(([logo,communityQR])=>communityAssets={logo,communityQR}).catch(error=>{assetPromise=null;throw error;});
  return assetPromise;
}
export function renderCard(element,card,{preview=true}={}){element.className='ai-card landscape-card';element.innerHTML=cardSVG(card,{preview,...communityAssets});}
export async function loadImage(src){return new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(new Error('图片未能读取，请重试。'));image.src=src;});}
export function canvasLines(ctx,text,maxWidth){const output=[];let current='';for(const char of Array.from(text||'')){if(char==='\n'){output.push(current);current='';continue;}if(ctx.measureText(current+char).width>maxWidth&&current){output.push(current);current=char;}else current+=char;}if(current)output.push(current);return output;}
export async function cardPNG(card){
  const assets=card.variant==='personal'?{}:await prepareCommunityAssets();
  const svg=cardSVG(card,assets),image=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));
  const layout=createCardLayout(card),canvas=document.createElement('canvas');canvas.width=layout.width*2;canvas.height=layout.height*2;
  const context=canvas.getContext('2d');context.drawImage(image,0,0,canvas.width,canvas.height);return canvas;
}
export async function downloadCanvas(canvas,filename){
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw new Error('图片生成失败，请重试。');
  const url=canvas.toDataURL('image/png'),dialog=document.createElement('dialog');
  dialog.className='image-export';dialog.setAttribute('aria-label','保存与分享图片');
  dialog.innerHTML='<button class="dialog-close" aria-label="关闭图片预览">×</button><p class="eyebrow brass">READY TO SHARE</p><h2>这张图片，准备好了。</h2><p class="fine-print">手机可长按图片保存，再发到微信群或其他地方。</p><img class="export-image" alt="可保存的高清图片"><div class="export-actions"><a class="button navy" download>下载图片 ↓</a><button class="button outline" data-share-image>分享图片 ↗</button></div>';
  const img=dialog.querySelector('img');img.src=url;
  const a=dialog.querySelector('a');a.href=url;a.download=filename;
  const share=dialog.querySelector('[data-share-image]'),file=new File([blob],filename,{type:'image/png'});
  share.hidden=!navigator.canShare?.({files:[file]});
  share.onclick=async()=>{try{await navigator.share({files:[file],title:'AI 名片与活动凭证'});}catch(e){if(e.name!=='AbortError'){const hint=dialog.querySelector('.fine-print');hint.textContent='当前浏览器未完成分享，可长按图片或点击下载图片。';}}};
  dialog.querySelector('.dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>dialog.remove(),{once:true});
  document.body.append(dialog);dialog.showModal();
}
export async function api(path,options={}) {const response=await fetch(path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers}});const data=await response.json();if(!response.ok)throw new Error(data.error||'请求暂时未完成，请重试。');return data;}
