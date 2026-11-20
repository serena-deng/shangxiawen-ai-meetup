const supported=new Set(['image/png','image/jpeg','image/webp']);
export function validateQRFile(file){
  if(!file||!supported.has(file.type))throw new Error('请选择 PNG、JPEG 或 WebP 图片，不支持 SVG 和 GIF。');
  if(file.size===0||file.size>4*1024*1024)throw new Error('二维码图片需小于 4 MB，且不能是空文件。');
}
export async function normalizeQRFile(file){
  validateQRFile(file);
  const url=URL.createObjectURL(file);
  try{
    const image=new Image();image.src=url;await image.decode();
    if(image.naturalWidth<64||image.naturalHeight<64||image.naturalWidth>8192||image.naturalHeight>8192)throw new Error('图片尺寸需在 64–8192 像素之间，请选择清晰的二维码。');
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;const context=canvas.getContext('2d');
    context.fillStyle='#fff';context.fillRect(0,0,512,512);const scale=Math.min(480/image.naturalWidth,480/image.naturalHeight);
    const width=Math.round(image.naturalWidth*scale),height=Math.round(image.naturalHeight*scale);
    context.imageSmoothingEnabled=false;context.drawImage(image,(512-width)/2,(512-height)/2,width,height);
    const result=canvas.toDataURL('image/png');
    if(result.length>700000)throw new Error('图片内容过多，请选择只包含清晰二维码的图片。');
    return result;
  }catch(e){if(e.message&&/尺寸|内容过多/.test(e.message))throw e;throw new Error('这张图片无法读取，请更换有效的二维码图片。');}
  finally{URL.revokeObjectURL(url);}
}
