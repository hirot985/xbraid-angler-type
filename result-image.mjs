import {getComposition} from './composition.mjs';
export async function renderResultImage({profile,resultData,assetMap,fishId,displayFishId,description,fishLabel,tags}){
 await document.fonts?.ready;
 const c=document.createElement('canvas');c.width=1080;const x=c.getContext('2d');
 const wrap=(text,font,max=940)=>{x.font=font;let line='',rows=[];for(const char of Array.from(text)){if(char==='\n'){rows.push(line);line='';continue;}if(line&&x.measureText(line+char).width>max){rows.push(line);line=char;}else line+=char;}if(line)rows.push(line);return rows;};
 const nick=wrap(profile.nickname+'さんの釣りスタイル','36px sans-serif');
 const title=wrap(resultData.name,'bold 60px sans-serif');
 const desc=wrap(description,'40px sans-serif',920);
 const tagRows=wrap(tags.join('  /  '),'bold 30px sans-serif',940);
 const portraitY=160+nick.length*48+30+title.length*78+65;
 const detailY=portraitY+660;
 c.height=detailY+tagRows.length*44+45+desc.length*62+240;
 x.fillStyle='#087c82';x.fillRect(0,0,c.width,c.height);
 const lines=(rows,y,font,color,leading)=>{x.font=font;x.fillStyle=color;rows.forEach((line,i)=>x.fillText(line,70,y+i*leading));};
 lines(['XBRAID / ANGLER TYPE 16'],95,'bold 44px sans-serif','#eafa55',50);
 lines(nick,160,'36px sans-serif','white',48);
 lines(title,160+nick.length*48+30,'bold 60px sans-serif','white',78);
 lines([resultData.code],portraitY-20,'30px sans-serif','#eafa55',40);
const draw=async(src,l,t,w,h)=>{if(!src)return false;const im=new Image();im.src=src;await im.decode();const scale=Math.min(w/im.width,h/im.height);x.drawImage(im,l+(w-im.width*scale)/2,t+(h-im.height*scale)/2,im.width*scale,im.height*scale);return true;};const char=assetMap.characters[resultData.code+'_'+profile.gender];const cm=getComposition(profile.gender,displayFishId||fishId,resultData.code);const box={x:225,y:portraitY,size:630};if(char)await draw(char,box.x,box.y,box.size,box.size);else{x.font='190px sans-serif';x.fillText(profile.gender==='undisclosed'?'🐼':profile.gender==='female'?'👩‍🎣':'👨‍🎣',420,730);}x.fillStyle='#073b44';x.fillRect(box.x+box.size*.41,box.y+box.size*cm.logo/100,box.size*.18,box.size*.052);await draw('assets--logo.svg',box.x+box.size*.425,box.y+box.size*cm.logo/100+4,box.size*.15,box.size*.04);if(assetMap.fish[displayFishId||fishId]){const im=new Image();im.src=assetMap.fish[displayFishId||fishId];await im.decode();x.save();x.translate(box.x,box.y);x.transform(cm.a,cm.b,-cm.b,cm.a,box.size*cm.tx,box.size*cm.ty);x.drawImage(im,0,0,box.size,box.size*im.height/im.width);x.restore();}if(char){const im=new Image();im.src=char;await im.decode();for(const polygon of cm.polygons){x.save();x.beginPath();polygon.forEach(([px,py],i)=>{const xx=box.x+box.size*px,yy=box.y+box.size*py;i?x.lineTo(xx,yy):x.moveTo(xx,yy)});x.closePath();x.clip();x.drawImage(im,box.x,box.y,box.size,box.size);x.restore();}}
 lines(tagRows,detailY,'bold 30px sans-serif','#eafa55',44);
 lines(desc,detailY+tagRows.length*44+40,'40px sans-serif','white',62);
 const footerY=detailY+tagRows.length*44+45+desc.length*62;
 lines(['釣りバカ度 '+resultData.crazy+'%'],footerY+45,'bold 48px sans-serif','#eafa55',55);
 lines([(fishId==='other'?'表示の魚（ランダム）：':'好きな魚：')+fishLabel],footerY+105,'30px sans-serif','white',40);
 lines(['好みを楽しむオリジナル診断・サンプル'],footerY+180,'25px sans-serif','white',35);
 return new Promise((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(new Error('image export failed')),'image/png'));
}
