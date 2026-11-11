import {fishOutline} from './fish-outline.mjs';
// Source-art support points, expressed in image-width coordinates (y also / width).
// The tail root / lower jaw (or two mantle support points) meet the two palms.
const fishSupports={
 aji:[[.23,.29],[.84,.34]],mebaru:[[.24,.32],[.84,.36]],
 seabass:[[.28,.20],[.79,.235]],hirame:[[.17,.32],[.77,.28]],
 kurodai:[[.24,.32],[.83,.35]],kijihata:[[.24,.33],[.84,.36]],
 madai:[[.25,.31],[.83,.34]],tachiuo:[[.23,.29],[.76,.29]],
 buri:[[.23,.325],[.84,.36]],hiramasa:[[.24,.22],[.87,.25]],
 yellowfin:[[.22,.30],[.82,.34]],gt:[[.24,.33],[.84,.365]],
 aoriika:[[.14,.32],[.89,.34]],kensakiika:[[.15,.24],[.90,.32]],
 blackbass:[[.23,.32],[.85,.36]],nijimasu:[[.25,.26],[.83,.30]]};
// Hand positions follow the common posing template. Overrides compensate visible variant differences.
const hands={male:{left:[.255,.548],right:[.745,.548],head:.34,logo:67},female:{left:[.255,.515],right:[.745,.515],head:.35,logo:65},undisclosed:{left:[.225,.603],right:[.775,.603],head:.39,logo:74}};
const overrides={ICSF_female:{left:[.248,.515],right:[.752,.515]},IESF_female:{left:[.253,.515],right:[.747,.515]},TCSF_male:{left:[.25,.54],right:[.75,.54]}};
export function getComposition(gender='male',fishId='aji',code='TCDF'){
 const h={...(hands[gender]||hands.male),...(overrides[code+'_'+gender]||{})};
 const [p,q]=fishSupports[fishId]||fishSupports.aji;const dx=q[0]-p[0],dy=q[1]-p[1],hx=h.right[0]-h.left[0],hy=h.right[1]-h.left[1];
 const den=dx*dx+dy*dy,a=(hx*dx+hy*dy)/den,b=(hy*dx-hx*dy)/den;
 const tx=h.left[0]-a*p[0]+b*p[1];let ty=h.left[1]-b*p[0]-a*p[1];
 // Test the actual opaque upper outline in the face region, not the transparent image box.
 const chin=gender==='undisclosed'?.355:gender==='female'?.305:.30;
 const outline=fishOutline[fishId]||fishOutline.aji;
 const facePoints=outline.map(([x,y])=>[a*x-b*y+tx,b*x+a*y+ty]).filter(([x])=>x>=.39&&x<=.61);
 const highest=Math.min(...facePoints.map(p=>p[1]));
 if(highest<chin)ty+=chin-highest;
 // Lower fingers are foreground; sleeves/thumbs remain behind the fish, avoiding square cutouts.
 const polygons=['left','right'].map(side=>{const [x,y]=h[side];return [[x-.058,y+.004],[x+.055,y+.004],[x+.066,y+.033],[x+.025,y+.052],[x-.04,y+.045],[x-.065,y+.023]];});
 return {a,b,tx,ty,scale:Math.hypot(a,b),angle:Math.atan2(b,a)*180/Math.PI,logo:h.logo,polygons};
}
export const supportedFish=Object.keys(fishSupports);
