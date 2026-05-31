(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function s(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=s(r);fetch(r.href,n)}})();/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=([a,e,s])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",a);return Object.keys(e).forEach(r=>{i.setAttribute(r,String(e[r]))}),s!=null&&s.length&&s.forEach(r=>{const n=te(r);i.appendChild(n)}),i},ie=(a,e={})=>{const i={...ee,...e};return te(["svg",i,a])};/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const de=a=>{for(const e in a)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1};/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=(...a)=>a.filter((e,s,i)=>!!e&&e.trim()!==""&&i.indexOf(e)===s).join(" ").trim();/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,s,i)=>i?i.toUpperCase():s.toLowerCase());/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=a=>{const e=le(a);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=a=>Array.from(a.attributes).reduce((e,s)=>(e[s.name]=s.value,e),{}),X=a=>typeof a=="string"?a:!a||!a.class?"":a.class&&typeof a.class=="string"?a.class.split(" "):a.class&&Array.isArray(a.class)?a.class:"",Y=(a,{nameAttr:e,icons:s,attrs:i})=>{var E;const r=a.getAttribute(e);if(r==null)return;const n=ce(r),d=s[n];if(!d)return console.warn(`${a.outerHTML} icon name was not found in the provided icons object.`);const h=he(a),g=de(h)?{}:{"aria-hidden":"true"},u={...ee,"data-lucide":r,...g,...i,...h},f=X(h),R=X(i),A=oe("lucide",`lucide-${r}`,...f,...R);A&&Object.assign(u,{class:A});const $=ie(d,u);return(E=a.parentNode)==null?void 0:E.replaceChild($,a)};/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pe=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const me=[["path",{d:"M8 2v4"}],["path",{d:"M16 2v4"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2"}],["path",{d:"M3 10h18"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ge=[["path",{d:"m15 18-6-6 6-6"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=[["path",{d:"m9 18 6-6-6-6"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=[["path",{d:"M13.744 17.736a6 6 0 1 1-7.48-7.48"}],["path",{d:"M15 6h1v4"}],["path",{d:"m6.134 14.768.866-.5 2 3.464"}],["circle",{cx:"16",cy:"8",r:"6"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=[["path",{d:"m10 16 1.5 1.5"}],["path",{d:"m14 8-1.5-1.5"}],["path",{d:"M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"}],["path",{d:"m16.5 10.5 1 1"}],["path",{d:"m17 6-2.891-2.891"}],["path",{d:"M2 15c6.667-6 13.333 0 20-6"}],["path",{d:"m20 9 .891.891"}],["path",{d:"M3.109 14.109 4 15"}],["path",{d:"m6.5 12.5 1 1"}],["path",{d:"m7 18 2.891 2.891"}],["path",{d:"M9 22c1.798-1.998 2.518-3.995 2.807-5.993"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=[["path",{d:"M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const be=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}],["path",{d:"M3 3v5h5"}],["path",{d:"M12 7v5l4 2"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ye=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Me=[["path",{d:"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ke=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fe=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{d:"m21.854 2.147-10.94 10.939"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"}],["path",{d:"M20 2v4"}],["path",{d:"M22 4h-4"}],["circle",{cx:"4",cy:"20",r:"2"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Se=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ge=[["path",{d:"M16 7h6v6"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ae=[["path",{d:"M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"}],["path",{d:"M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"}],["path",{d:"M18 9h1.5a1 1 0 0 0 0-5H18"}],["path",{d:"M4 22h16"}],["path",{d:"M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"}],["path",{d:"M6 9H4.5a1 1 0 0 1 0-5H6"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=[["path",{d:"M12.8 19.6A2 2 0 1 0 14 16H2"}],["path",{d:"M17.5 8a2.5 2.5 0 1 1 2 4H2"}],["path",{d:"M9.8 4.4A2 2 0 1 1 11 8H2"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ee=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"}]];/**
 * @license lucide v1.16.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=({icons:a={},nameAttr:e="data-lucide",attrs:s={},root:i=document,inTemplates:r}={})=>{if(!Object.values(a).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof i>"u")throw new Error("`createIcons()` only works in a browser environment.");if(Array.from(i.querySelectorAll(`[${e}]`)).forEach(d=>Y(d,{nameAttr:e,icons:a,attrs:s})),r&&Array.from(i.querySelectorAll("template")).forEach(h=>ae({icons:a,nameAttr:e,attrs:s,root:h.content,inTemplates:r})),e==="data-lucide"){const d=i.querySelectorAll("[icon-name]");d.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(d).forEach(h=>Y(h,{nameAttr:"icon-name",icons:a,attrs:s})))}},K=[{id:"s1",name:"シリウスオーブ",lineageId:"speed",price:5e6,stats:{speed:850,stamina:600,guts:700,temperament:650,health:700,luck:600,explosiveness:750},explosivePower:80,distanceAptitude:[1200,1600],growthType:"early",strategy:"escape",pedigree:{father:"サンダーノヴァ",mother:"スターライト",grandFathers:["ボルト","ルナ"],grandMothers:["フラッシュ","ステラ"],greatGrandFathers:["ライトニング","サンダー","ムーン","サン"]}},{id:"s2",name:"ベテルギウスキング",lineageId:"stamina",price:8e6,stats:{speed:700,stamina:900,guts:800,temperament:750,health:600,luck:700,explosiveness:450},explosivePower:50,distanceAptitude:[2e3,3200],growthType:"late",strategy:"stay",pedigree:{father:"オリオン",mother:"アース",grandFathers:["マーズ","ヴィーナス"],grandMothers:["ジュピター","サターン"],greatGrandFathers:["ネプチューン","プルート","ウラヌス","マーキュリー"]}},{id:"s3",name:"リゲルブレイブ",lineageId:"guts",price:3e6,stats:{speed:750,stamina:750,guts:900,temperament:500,health:800,luck:500,explosiveness:650},explosivePower:60,distanceAptitude:[1600,2400],growthType:"normal",strategy:"insert",pedigree:{father:"レオ",mother:"ライラ",grandFathers:["ドラコ","シグナス"],grandMothers:["ベガ","カペラ"],greatGrandFathers:["アンタレス","ポルックス","カストル","プロキオン"]}},{id:"s4",name:"アルタイルダッシュ",lineageId:"speed",price:12e6,stats:{speed:950,stamina:550,guts:650,temperament:600,health:500,luck:850,explosiveness:980},explosivePower:120,distanceAptitude:[1e3,1400],growthType:"early",strategy:"escape",pedigree:{father:"ライトニング",mother:"ソニック",grandFathers:["ボルト","フラッシュ"],grandMothers:["サンダー","ストーム"],greatGrandFathers:["ゼウス","ヘラ","ポセイドン","アテナ"]}},{id:"s5",name:"デネブロード",lineageId:"balance",price:6e6,stats:{speed:800,stamina:800,guts:800,temperament:850,health:750,luck:750,explosiveness:700},explosivePower:70,distanceAptitude:[1600,2400],growthType:"normal",strategy:"lead",pedigree:{father:"コスモス",mother:"ユニバース",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","コメット"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"s6",name:"アンタレスフレイム",lineageId:"guts",price:15e6,stats:{speed:850,stamina:850,guts:980,temperament:400,health:650,luck:900,explosiveness:800},explosivePower:150,distanceAptitude:[1800,2600],growthType:"late",strategy:"stay",pedigree:{father:"スコーピオン",mother:"マグマ",grandFathers:["マーズ","ドラコ"],grandMothers:["ベガ","ルナ"],greatGrandFathers:["アンタレス","ポルックス","カストル","プロキオン"]}},{id:"s7",name:"プロキオンエース",lineageId:"speed",price:45e5,stats:{speed:820,stamina:650,guts:720,temperament:700,health:850,luck:550,explosiveness:720},explosivePower:65,distanceAptitude:[1200,1800],growthType:"normal",strategy:"lead",pedigree:{father:"シリウス",mother:"カペラ",grandFathers:["ボルト","シグナス"],grandMothers:["ステラ","ベガ"],greatGrandFathers:["ライトニング","サンダー","ムーン","サン"]}},{id:"s8",name:"カノープススピリット",lineageId:"stamina",price:2e7,stats:{speed:750,stamina:980,guts:900,temperament:900,health:700,luck:950,explosiveness:550},explosivePower:130,distanceAptitude:[2400,3600],growthType:"late",strategy:"stay",pedigree:{father:"ガイア",mother:"テラ",grandFathers:["オリオン","ジュピター"],grandMothers:["アース","サターン"],greatGrandFathers:["ネプチューン","プルート","ウラヌス","マーキュリー"]}},{id:"s9",name:"スピカハート",lineageId:"balance",price:25e5,stats:{speed:720,stamina:720,guts:720,temperament:950,health:900,luck:800,explosiveness:620},explosivePower:40,distanceAptitude:[1400,2200],growthType:"normal",strategy:"insert",pedigree:{father:"ヴィーナス",mother:"マーキュリー",grandFathers:["サン","ムーン"],grandMothers:["ステラ","ルナ"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"s10",name:"レグルスソウル",lineageId:"guts",price:9e6,stats:{speed:780,stamina:820,guts:920,temperament:600,health:750,luck:700,explosiveness:780},explosivePower:90,distanceAptitude:[2e3,3e3],growthType:"normal",strategy:"insert",pedigree:{father:"レオ",mother:"ライオン",grandFathers:["ドラコ","マーズ"],grandMothers:["ベガ","サターン"],greatGrandFathers:["アンタレス","ポルックス","カストル","プロキオン"]}},{id:"s11",name:"カペラライト",lineageId:"speed",price:35e5,stats:{speed:880,stamina:550,guts:650,temperament:700,health:600,luck:650,explosiveness:920},explosivePower:110,distanceAptitude:[1e3,1400],growthType:"early",strategy:"escape",pedigree:{father:"ライトニング",mother:"スター",grandFathers:["ボルト","ルナ"],grandMothers:["フラッシュ","ステラ"],greatGrandFathers:["ゼウス","ヘラ","ポセイドン","アテナ"]}},{id:"s12",name:"アルデバランレッド",lineageId:"guts",price:75e5,stats:{speed:750,stamina:850,guts:950,temperament:550,health:700,luck:600,explosiveness:850},explosivePower:85,distanceAptitude:[1800,2400],growthType:"normal",strategy:"lead",pedigree:{father:"マーズ",mother:"フレイム",grandFathers:["ドラコ","レオ"],grandMothers:["ベガ","ライラ"],greatGrandFathers:["アンタレス","ポルックス","カストル","プロキオン"]}},{id:"s13",name:"ポルックスブルー",lineageId:"balance",price:4e6,stats:{speed:780,stamina:780,guts:780,temperament:800,health:800,luck:780,explosiveness:780},explosivePower:75,distanceAptitude:[1600,2200],growthType:"normal",strategy:"insert",pedigree:{father:"カストル",mother:"ジェミニ",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","コメット"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"s14",name:"アークトゥルス",lineageId:"stamina",price:15e6,stats:{speed:720,stamina:950,guts:850,temperament:850,health:650,luck:800,explosiveness:520},explosivePower:140,distanceAptitude:[2400,3200],growthType:"late",strategy:"stay",pedigree:{father:"オリオン",mother:"ベガ",grandFathers:["マーズ","ヴィーナス"],grandMothers:["ジュピター","サターン"],greatGrandFathers:["ネプチューン","プルート","ウラヌス","マーキュリー"]}},{id:"s15",name:"フォーマルハウト",lineageId:"speed",price:11e6,stats:{speed:920,stamina:600,guts:700,temperament:650,health:550,luck:900,explosiveness:950},explosivePower:125,distanceAptitude:[1200,1600],growthType:"early",strategy:"escape",pedigree:{father:"シリウス",mother:"アクア",grandFathers:["ボルト","ネプチューン"],grandMothers:["ステラ","マーメイド"],greatGrandFathers:["ライトニング","サンダー","ムーン","サン"]}},{id:"s16",name:"流星王",lineageId:"speed",price:3e7,stats:{speed:980,stamina:700,guts:850,temperament:600,health:600,luck:950,explosiveness:1e3},explosivePower:200,distanceAptitude:[1e3,2e3],growthType:"early",strategy:"escape",traits:["大逃げ","流星の速さ"],pedigree:{father:"メテオ",mother:"スター",grandFathers:["サンダー","ルナ"],grandMothers:["ノヴァ","オーロラ"],greatGrandFathers:["シリウス","ベガ","アルタイル","リゲル"]}},{id:"s17",name:"神龍帝",lineageId:"guts",price:5e7,stats:{speed:850,stamina:950,guts:1e3,temperament:400,health:800,luck:990,explosiveness:900},explosivePower:250,distanceAptitude:[2e3,3600],growthType:"late",strategy:"stay",traits:["神のオーラ","不屈"],pedigree:{father:"ドラゴン",mother:"エンプレス",grandFathers:["ゴッド","キング"],grandMothers:["クイーン","プリンセス"],greatGrandFathers:["カイザー","レジェンド","ミシック","アーク"]}},{id:"s18",name:"ベガスター",lineageId:"speed",price:18e6,stats:{speed:940,stamina:650,guts:750,temperament:700,health:600,luck:850,explosiveness:940},explosivePower:115,distanceAptitude:[1200,1800],growthType:"early",strategy:"escape",pedigree:{father:"リラ",mother:"スターライト",grandFathers:["ボルト","ルナ"],grandMothers:["フラッシュ","ステラ"],greatGrandFathers:["ライトニング","サンダー","ムーン","サン"]}},{id:"s19",name:"ポラリスノース",lineageId:"stamina",price:12e6,stats:{speed:700,stamina:960,guts:850,temperament:800,health:900,luck:750,explosiveness:480},explosivePower:135,distanceAptitude:[2400,3600],growthType:"late",strategy:"stay",pedigree:{father:"ベア",mother:"オーロラ",grandFathers:["マーズ","ジュピター"],grandMothers:["サターン","ネプチューン"],greatGrandFathers:["プルート","ウラヌス","マーキュリー","アース"]}},{id:"s20",name:"カストルツイン",lineageId:"balance",price:85e5,stats:{speed:820,stamina:820,guts:820,temperament:820,health:820,luck:820,explosiveness:820},explosivePower:82,distanceAptitude:[1600,2400],growthType:"normal",strategy:"lead",pedigree:{father:"ジェミニ",mother:"ポルックス",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","コメット"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"s21",name:"カノープスロード",lineageId:"stamina",price:1e7,stats:{speed:720,stamina:950,guts:800,temperament:800,health:750,luck:700,explosiveness:500},explosivePower:95,distanceAptitude:[2200,3600],growthType:"late",strategy:"stay",pedigree:{father:"カノープス",mother:"ロード",grandFathers:["スター","ムーン"],grandMothers:["サン","アース"],greatGrandFathers:["ライトニング","サンダー","ボルト","フラッシュ"]}},{id:"s22",name:"アケルナルダッシュ",lineageId:"speed",price:65e5,stats:{speed:900,stamina:600,guts:650,temperament:700,health:600,luck:750,explosiveness:900},explosivePower:105,distanceAptitude:[1e3,1600],growthType:"early",strategy:"escape",pedigree:{father:"アケルナル",mother:"ダッシュ",grandFathers:["ソニック","ライト"],grandMothers:["スピード","クイック"],greatGrandFathers:["ファスト","ラピッド","ハリケーン","ストーム"]}},{id:"s23",name:"ハダルブレイブ",lineageId:"guts",price:55e5,stats:{speed:780,stamina:780,guts:920,temperament:600,health:850,luck:600,explosiveness:720},explosivePower:88,distanceAptitude:[1600,2400],growthType:"normal",strategy:"insert",pedigree:{father:"ハダル",mother:"ブレイブ",grandFathers:["アイアン","スチール"],grandMothers:["ロック","ストーン"],greatGrandFathers:["マウンテン","ヒル","バレー","リバー"]}},{id:"s24",name:"アクルックスキング",lineageId:"balance",price:12e6,stats:{speed:850,stamina:850,guts:850,temperament:850,health:800,luck:800,explosiveness:850},explosivePower:112,distanceAptitude:[1800,2800],growthType:"normal",strategy:"lead",pedigree:{father:"アクルックス",mother:"キング",grandFathers:["ロイヤル","ノーブル"],grandMothers:["クイーン","プリンセス"],greatGrandFathers:["エンペラー","カイザー","デューク","バロン"]}},{id:"s25",name:"ミモザハート",lineageId:"balance",price:35e5,stats:{speed:750,stamina:750,guts:750,temperament:900,health:700,luck:850,explosiveness:680},explosivePower:78,distanceAptitude:[1400,2e3],growthType:"normal",strategy:"insert",pedigree:{father:"ミモザ",mother:"ハート",grandFathers:["ラブ","ピース"],grandMothers:["ジョイ","ハッピー"],greatGrandFathers:["スマイル","ラフ","ドリーム","ホープ"]}},{id:"s26",name:"アルデバランボルト",lineageId:"speed",price:9e6,stats:{speed:920,stamina:600,guts:650,temperament:600,health:600,luck:800,explosiveness:920},explosivePower:118,distanceAptitude:[1e3,1600],growthType:"early",strategy:"escape",pedigree:{father:"ライトニング",mother:"フラッシュ",grandFathers:["サンダー","ボルト"],grandMothers:["ストーム","ウィンド"],greatGrandFathers:["ゼウス","ポセイドン","ハデス","アポロン"]}},{id:"s27",name:"ポルックスインパクト",lineageId:"guts",price:11e6,stats:{speed:800,stamina:800,guts:950,temperament:500,health:700,luck:700,explosiveness:800},explosivePower:122,distanceAptitude:[1600,2400],growthType:"normal",strategy:"stay",pedigree:{father:"カストル",mother:"ジェミニ",grandFathers:["ポルックス","ヘラクレス"],grandMothers:["レダ","ヘレネ"],greatGrandFathers:["アトラス","プロメテウス","エピメテウス","パンドラ"]}},{id:"s28",name:"オリオンベルト",lineageId:"stamina",price:13e6,stats:{speed:720,stamina:940,guts:880,temperament:820,health:750,luck:700,explosiveness:550},explosivePower:100,distanceAptitude:[2400,3200],growthType:"late",strategy:"stay",pedigree:{father:"リゲル",mother:"ベテルギウス",grandFathers:["ベラトリックス","サイフ"],grandMothers:["アルニラム","ミンタカ"],greatGrandFathers:["アルニタク","メイサ","ハチサ","エンシス"]}},{id:"s29",name:"カシオペアキング",lineageId:"balance",price:95e5,stats:{speed:840,stamina:840,guts:840,temperament:840,health:840,luck:840,explosiveness:840},explosivePower:90,distanceAptitude:[1600,2400],growthType:"normal",strategy:"lead",pedigree:{father:"シェダル",mother:"カフ",grandFathers:["ツィー","ルクバー"],grandMothers:["セギン","アキルド"],greatGrandFathers:["カシオペア","ケフェウス","アンドロメダ","ペルセウス"]}},{id:"s30",name:"ペルセウスブレイド",lineageId:"speed",price:16e6,stats:{speed:960,stamina:620,guts:720,temperament:680,health:580,luck:880,explosiveness:960},explosivePower:145,distanceAptitude:[1200,1800],growthType:"early",strategy:"escape",pedigree:{father:"ミルファク",mother:"アルゴル",grandFathers:["アティク","メンキブ"],grandMothers:["ミラム","ミサマ"],greatGrandFathers:["ゴルゴネア","メドゥーサ","ペガサス","アンドロメダ"]}}],H=[{id:"m1",name:"コスモクイーン",lineageId:"balance",stats:{speed:650,stamina:650,guts:600,temperament:800,health:700,luck:650,explosiveness:600},pedigree:{father:"ギャラクシー",mother:"ネビュラ",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","コメット"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"m2",name:"ステラミューズ",lineageId:"speed",stats:{speed:750,stamina:500,guts:550,temperament:700,health:600,luck:750,explosiveness:850},pedigree:{father:"ボルト",mother:"フラッシュ",grandFathers:["ライトニング","サンダー"],grandMothers:["ムーン","サン"],greatGrandFathers:["ゼウス","ヘラ","ポセイドン","アテナ"]}},{id:"m3",name:"ルナセレニティ",lineageId:"stamina",stats:{speed:550,stamina:780,guts:700,temperament:850,health:800,luck:600,explosiveness:450},pedigree:{father:"マーズ",mother:"ヴィーナス",grandFathers:["ジュピター","サターン"],grandMothers:["ネプチューン","プルート"],greatGrandFathers:["ウラヌス","マーキュリー","アース","ガイア"]}},{id:"m4",name:"ネビュラミスト",lineageId:"guts",stats:{speed:600,stamina:600,guts:820,temperament:550,health:750,luck:500,explosiveness:700},pedigree:{father:"ドラコ",mother:"シグナス",grandFathers:["ベガ","カペラ"],grandMothers:["アンタレス","ポルックス"],greatGrandFathers:["カストル","プロキオン","レオ","ライラ"]}},{id:"m5",name:"オーロラベール",lineageId:"balance",stats:{speed:680,stamina:680,guts:680,temperament:900,health:850,luck:850,explosiveness:650},pedigree:{father:"パルサー",mother:"オーロラ",grandFathers:["クエーサー","コメット"],grandMothers:["ノヴァ","スーパーノヴァ"],greatGrandFathers:["ブラックホール","ビッグバン","コスモス","ユニバース"]}},{id:"m6",name:"ヴィーナスハート",lineageId:"speed",stats:{speed:800,stamina:550,guts:600,temperament:750,health:650,luck:800,explosiveness:900},pedigree:{father:"サン",mother:"ラブ",grandFathers:["ボルト","ステラ"],grandMothers:["フラッシュ","ルナ"],greatGrandFathers:["ゼウス","ヘラ","ポセイドン","アテナ"]}},{id:"m7",name:"マーキュリーミスト",lineageId:"balance",stats:{speed:720,stamina:720,guts:720,temperament:800,health:800,luck:750,explosiveness:720},pedigree:{father:"コメット",mother:"シルバー",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","ステラ"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"m8",name:"ジュピターベル",lineageId:"stamina",stats:{speed:600,stamina:850,guts:750,temperament:850,health:700,luck:700,explosiveness:550},pedigree:{father:"サターン",mother:"リング",grandFathers:["マーズ","オリオン"],grandMothers:["ヴィーナス","アース"],greatGrandFathers:["ネプチューン","プルート","ウラヌス","マーキュリー"]}},{id:"m9",name:"サターンリング",lineageId:"guts",stats:{speed:650,stamina:700,guts:880,temperament:600,health:750,luck:650,explosiveness:780},pedigree:{father:"プルート",mother:"ダーク",grandFathers:["ドラコ","レオ"],grandMothers:["ベガ","ライラ"],greatGrandFathers:["アンタレス","ポルックス","カストル","プロキオン"]}},{id:"m10",name:"ネプチューンパール",lineageId:"stamina",stats:{speed:620,stamina:920,guts:800,temperament:900,health:650,luck:850,explosiveness:500},pedigree:{father:"ウラヌス",mother:"オーシャン",grandFathers:["オリオン","ジュピター"],grandMothers:["アース","サターン"],greatGrandFathers:["ネプチューン","プルート","ウラヌス","マーキュリー"]}},{id:"m11",name:"流星姫",lineageId:"speed",stats:{speed:900,stamina:600,guts:700,temperament:800,health:700,luck:900,explosiveness:950},traits:["流星の速さ"],pedigree:{father:"スター",mother:"メテオ",grandFathers:["ルナ","サンダー"],grandMothers:["オーロラ","ノヴァ"],greatGrandFathers:["ベガ","シリウス","リゲル","アルタイル"]}},{id:"m12",name:"神龍后",lineageId:"guts",stats:{speed:700,stamina:850,guts:950,temperament:500,health:750,luck:850,explosiveness:800},traits:["神のオーラ"],pedigree:{father:"エンペラー",mother:"ドラゴン",grandFathers:["キング","ゴッド"],grandMothers:["プリンセス","クイーン"],greatGrandFathers:["レジェンド","カイザー","アーク","ミシック"]}},{id:"m13",name:"シリウスミスト",lineageId:"speed",stats:{speed:820,stamina:600,guts:650,temperament:700,health:700,luck:800,explosiveness:820},pedigree:{father:"シリウス",mother:"ミスト",grandFathers:["ボルト","ルナ"],grandMothers:["フラッシュ","ステラ"],greatGrandFathers:["ライトニング","サンダー","ムーン","サン"]}},{id:"m14",name:"カペラローズ",lineageId:"balance",stats:{speed:750,stamina:750,guts:750,temperament:850,health:800,luck:700,explosiveness:750},pedigree:{father:"カペラ",mother:"ローズ",grandFathers:["パルサー","クエーサー"],grandMothers:["オーロラ","コメット"],greatGrandFathers:["ノヴァ","スーパーノヴァ","ブラックホール","ビッグバン"]}},{id:"m15",name:"アルタイルスター",lineageId:"speed",stats:{speed:850,stamina:550,guts:600,temperament:700,health:650,luck:850,explosiveness:880},pedigree:{father:"アルタイル",mother:"スター",grandFathers:["スカイ","クラウド"],grandMothers:["レイン","スノー"],greatGrandFathers:["サン","ムーン","アース","マーズ"]}},{id:"m16",name:"ベガライト",lineageId:"balance",stats:{speed:780,stamina:780,guts:780,temperament:850,health:800,luck:750,explosiveness:780},pedigree:{father:"ベガ",mother:"ライト",grandFathers:["シャイン","ブライト"],grandMothers:["グロウ","スパークル"],greatGrandFathers:["フラッシュ","ボルト","サンダー","ライトニング"]}},{id:"m17",name:"ルナエクリプス",lineageId:"stamina",stats:{speed:600,stamina:850,guts:750,temperament:800,health:800,luck:700,explosiveness:520},pedigree:{father:"ムーン",mother:"シャドウ",grandFathers:["ナイト","ダーク"],grandMothers:["ライト","ブライト"],greatGrandFathers:["サン","スター","スカイ","アース"]}},{id:"m18",name:"ヴィーナスチャーム",lineageId:"balance",stats:{speed:720,stamina:720,guts:720,temperament:950,health:850,luck:900,explosiveness:720},pedigree:{father:"アフロディーテ",mother:"ビューティー",grandFathers:["ラブ","ハート"],grandMothers:["ローズ","リリー"],greatGrandFathers:["キューピッド","エロス","アポロン","ヘルメス"]}},{id:"m19",name:"アテナウィズダム",lineageId:"guts",stats:{speed:700,stamina:700,guts:900,temperament:900,health:800,luck:800,explosiveness:700},pedigree:{father:"ゼウス",mother:"メティス",grandFathers:["クロノス","オーケアノス"],grandMothers:["レアー","テーテュース"],greatGrandFathers:["ウラヌス","ガイア","ポントス","タラッサ"]}},{id:"m20",name:"フローラガーデン",lineageId:"balance",stats:{speed:680,stamina:680,guts:680,temperament:850,health:950,luck:850,explosiveness:700},pedigree:{father:"ゼピュロス",mother:"クロリス",grandFathers:["アストライオス","オーケアノス"],grandMothers:["エーオース","テーテュース"],greatGrandFathers:["クリオス","エウリュビアー","ヒュペリーオーン","テイアー"]}},{id:"m21",name:"アイリスレインボー",lineageId:"speed",stats:{speed:880,stamina:450,guts:500,temperament:650,health:600,luck:900,explosiveness:950},pedigree:{father:"プリズム",mother:"カラー",grandFathers:["ライト","ダーク"],grandMothers:["レッド","ブルー"],greatGrandFathers:["イエロー","グリーン","オレンジ","パープル"]}},{id:"m22",name:"セレーネナイト",lineageId:"stamina",stats:{speed:500,stamina:950,guts:800,temperament:750,health:850,luck:650,explosiveness:400},pedigree:{father:"ムーン",mother:"ナイト",grandFathers:["スター","スカイ"],grandMothers:["クラウド","レイン"],greatGrandFathers:["サン","アース","マーズ","ジュピター"]}},{id:"m23",name:"ダイアナハンター",lineageId:"guts",stats:{speed:720,stamina:720,guts:980,temperament:500,health:900,luck:600,explosiveness:750},pedigree:{father:"アポロン",mother:"アルテミス",grandFathers:["ゼウス","レト"],grandMothers:["ヘラ","デメテル"],greatGrandFathers:["クロノス","レアー","オーケアノス","テーテュース"]}},{id:"m24",name:"ミネルヴァシールド",lineageId:"balance",stats:{speed:780,stamina:780,guts:780,temperament:980,health:950,luck:800,explosiveness:600},pedigree:{father:"ジュピター",mother:"メティス",grandFathers:["サターン","オプス"],grandMothers:["ヤヌス","ヴェスタ"],greatGrandFathers:["カエルス","テラ","ピクス","ファウヌス"]}},{id:"m25",name:"フレイヤビューティー",lineageId:"speed",stats:{speed:820,stamina:600,guts:650,temperament:900,health:700,luck:980,explosiveness:880},pedigree:{father:"ニョルズ",mother:"スカジ",grandFathers:["フレイ","ゲルズ"],grandMothers:["オーディン","フリッグ"],greatGrandFathers:["トール","ロキ","バルドル","ヘイムダル"]}},{id:"m26",name:"イシスミラクル",lineageId:"stamina",stats:{speed:650,stamina:920,guts:850,temperament:950,health:800,luck:900,explosiveness:550},pedigree:{father:"オシリス",mother:"ホルス",grandFathers:["ゲブ","ヌト"],grandMothers:["シュー","テフヌト"],greatGrandFathers:["アトゥム","ラー","アメン","プタハ"]}},{id:"m27",name:"ブリュンヒルデ",lineageId:"guts",stats:{speed:750,stamina:800,guts:990,temperament:400,health:950,luck:700,explosiveness:800},pedigree:{father:"ヴォータン",mother:"エルダ",grandFathers:["ジークフリート","ジークリンデ"],grandMothers:["グンター","グートルーネ"],greatGrandFathers:["ハーゲン","アルベリヒ","ファフナー","ファーゾルト"]}},{id:"m28",name:"アマテラスサン",lineageId:"balance",stats:{speed:850,stamina:850,guts:850,temperament:1e3,health:1e3,luck:1e3,explosiveness:900},pedigree:{father:"イザナギ",mother:"イザナミ",grandFathers:["スサノオ","ツクヨミ"],grandMothers:["オオクニヌシ","コノハナサクヤ"],greatGrandFathers:["ニニギ","ホオリ","ウガヤフキアエズ","ジム"]}},{id:"m29",name:"クレオパトラ",lineageId:"speed",stats:{speed:920,stamina:500,guts:600,temperament:850,health:650,luck:950,explosiveness:980},pedigree:{father:"プトレマイオス",mother:"カエサル",grandFathers:["アントニウス","オクタウィアヌス"],grandMothers:["ポンペイウス","クラッスス"],greatGrandFathers:["スッラ","マリウス","グラックス","スキピオ"]}},{id:"m30",name:"ジャンヌダルク",lineageId:"guts",stats:{speed:700,stamina:850,guts:1e3,temperament:1e3,health:900,luck:800,explosiveness:850},pedigree:{father:"フランス",mother:"オルレアン",grandFathers:["シャルル","フィリップ"],grandMothers:["ルイ","アンリ"],greatGrandFathers:["フランソワ","ナポレオン","ラファイエット","ドゴール"]}},{id:"m31",name:"メデューサ",lineageId:"guts",stats:{speed:600,stamina:600,guts:950,temperament:400,health:800,luck:700,explosiveness:750},pedigree:{father:"ポセイドン",mother:"メデューサ",grandFathers:["フォルキュス","ケト"],grandMothers:["ガイア","ポントス"],greatGrandFathers:["カオス","タルタロス","エロス","エレボス"]}},{id:"m32",name:"パンドラ",lineageId:"balance",stats:{speed:700,stamina:700,guts:700,temperament:600,health:700,luck:300,explosiveness:700},pedigree:{father:"ヘパイストス",mother:"パンドラ",grandFathers:["ゼウス","ヘラ"],grandMothers:["プロメテウス","エピメテウス"],greatGrandFathers:["イアペトス","クリュメネ","オーケアノス","テーテュース"]}},{id:"m33",name:"ヘレネ",lineageId:"speed",stats:{speed:850,stamina:500,guts:500,temperament:800,health:600,luck:900,explosiveness:900},pedigree:{father:"ゼウス",mother:"レダ",grandFathers:["テュンダレオス","カストル"],grandMothers:["ポリュデウケス","クリュタイムネストラ"],greatGrandFathers:["オイバロス","バテイア","ペリエレス","ゴルゴポネ"]}},{id:"m34",name:"カサンドラ",lineageId:"stamina",stats:{speed:500,stamina:850,guts:800,temperament:300,health:700,luck:200,explosiveness:400},pedigree:{father:"プリアモス",mother:"ヘカベ",grandFathers:["ヘクトール","パリス"],grandMothers:["デイポボス","ヘレノス"],greatGrandFathers:["ラオメドン","ストリュモ","ディマース","エウノエ"]}},{id:"m35",name:"エレクトラ",lineageId:"guts",stats:{speed:650,stamina:750,guts:920,temperament:500,health:850,luck:600,explosiveness:720},pedigree:{father:"アガメムノン",mother:"クリュタイムネストラ",grandFathers:["アトレウス","アエロペ"],grandMothers:["テュンダレオス","レダ"],greatGrandFathers:["ペロプス","ヒッポダメイア","カトレウス","クレタ"]}},{id:"m36",name:"アンティゴネ",lineageId:"balance",stats:{speed:720,stamina:720,guts:850,temperament:900,health:900,luck:500,explosiveness:680},pedigree:{father:"オイディプス",mother:"イオカステ",grandFathers:["ライオス","メノイケウス"],grandMothers:["エピカステ","クレオン"],greatGrandFathers:["ラブダコス","カドモス","ハルモニアー","アゲノル"]}},{id:"m37",name:"メデイア",lineageId:"speed",stats:{speed:800,stamina:600,guts:700,temperament:200,health:750,luck:400,explosiveness:850},pedigree:{father:"アイエテス",mother:"イドゥイア",grandFathers:["ヘリオス","ペルセ"],grandMothers:["オーケアノス","テーテュース"],greatGrandFathers:["ヒュペリーオーン","テイアー","ガイア","ウラヌス"]}},{id:"m38",name:"キルケ",lineageId:"balance",stats:{speed:750,stamina:750,guts:750,temperament:700,health:800,luck:800,explosiveness:750},pedigree:{father:"ヘリオス",mother:"ペルセ",grandFathers:["オーケアノス","テーテュース"],grandMothers:["ヒュペリーオーン","テイアー"],greatGrandFathers:["ガイア","ウラヌス","カオス","タルタロス"]}},{id:"m39",name:"カリュプソ",lineageId:"stamina",stats:{speed:550,stamina:900,guts:700,temperament:850,health:950,luck:750,explosiveness:450},pedigree:{father:"アトラス",mother:"プレイオネ",grandFathers:["イアペトス","クリュメネ"],grandMothers:["オーケアノス","テーテュース"],greatGrandFathers:["ウラヌス","ガイア","カオス","タルタロス"]}},{id:"m40",name:"ナウシカア",lineageId:"balance",stats:{speed:780,stamina:780,guts:780,temperament:950,health:900,luck:900,explosiveness:780},pedigree:{father:"アルキノオス",mother:"アレテ",grandFathers:["ナウシトオス","レクセノル"],grandMothers:["ポセイドン","ペリボイア"],greatGrandFathers:["カオス","タルタロス","エロス","エレボス"]}},{id:"m41",name:"アンドロメダスター",lineageId:"balance",stats:{speed:700,stamina:700,guts:700,temperament:850,health:800,luck:800,explosiveness:700},pedigree:{father:"ケフェウス",mother:"カシオペア",grandFathers:["ポセイドン","ゼウス"],grandMothers:["アテナ","ヘラ"],greatGrandFathers:["クロノス","レアー","ウラヌス","ガイア"]}},{id:"m42",name:"カシオペアクイーン",lineageId:"guts",stats:{speed:650,stamina:650,guts:920,temperament:600,health:750,luck:700,explosiveness:800},pedigree:{father:"エちおぴあ",mother:"ロイヤル",grandFathers:["キング","プリンス"],grandMothers:["クイーン","プリンセス"],greatGrandFathers:["エンペラー","カイザー","デューク","バロン"]}},{id:"m43",name:"ペガサスウィング",lineageId:"speed",stats:{speed:920,stamina:500,guts:600,temperament:700,health:650,luck:850,explosiveness:980},pedigree:{father:"ポセイドン",mother:"メドゥーサ",grandFathers:["フォルキュス","ケートー"],grandMothers:["ガイア","ポントス"],greatGrandFathers:["ウラヌス","エーテル","ヘーメラー","カオス"]}},{id:"m44",name:"ライラハープ",lineageId:"balance",stats:{speed:750,stamina:750,guts:750,temperament:980,health:800,luck:900,explosiveness:720},pedigree:{father:"オルフェウス",mother:"アポロン",grandFathers:["ヘルメス","ゼウス"],grandMothers:["マイア","レト"],greatGrandFathers:["アトラス","プレイオネ","コイオス","ポイベー"]}},{id:"m45",name:"シグナススワン",lineageId:"stamina",stats:{speed:600,stamina:900,guts:800,temperament:850,health:900,luck:750,explosiveness:550},pedigree:{father:"ゼウス",mother:"レダ",grandFathers:["テュンダレオース","オケアノス"],grandMothers:["ネメシス","テテュス"],greatGrandFathers:["クロノス","レアー","ウラヌス","ガイア"]}},{id:"m46",name:"アクィラスカイ",lineageId:"speed",stats:{speed:880,stamina:600,guts:700,temperament:750,health:700,luck:800,explosiveness:920},pedigree:{father:"ゼウス",mother:"イーグル",grandFathers:["スカイ","ストーム"],grandMothers:["クラウド","ウィンド"],greatGrandFathers:["ライトニング","サンダー","ボルト","フラッシュ"]}},{id:"m47",name:"ドラコフレイム",lineageId:"guts",stats:{speed:720,stamina:850,guts:980,temperament:500,health:800,luck:650,explosiveness:850},pedigree:{father:"ラドン",mother:"ヘスペリス",grandFathers:["アトラス","フォルキュス"],grandMothers:["ヘスペリス","ケートー"],greatGrandFathers:["イアペトス","アジア","ポントス","ガイア"]}},{id:"m48",name:"アンドロメダパール",lineageId:"balance",stats:{speed:750,stamina:750,guts:750,temperament:850,health:800,luck:800,explosiveness:750},pedigree:{father:"ケフェウス",mother:"カシオペア",grandFathers:["ポセイドン","ゼウス"],grandMothers:["アテナ","ヘラ"],greatGrandFathers:["クロノス","レアー","ウラヌス","ガイア"]}},{id:"m49",name:"カシオペアローズ",lineageId:"guts",stats:{speed:680,stamina:680,guts:900,temperament:650,health:750,luck:750,explosiveness:820},pedigree:{father:"エチオピア",mother:"ロイヤル",grandFathers:["キング","プリンス"],grandMothers:["クイーン","プリンセス"],greatGrandFathers:["エンペラー","カイザー","デューク","バロン"]}},{id:"m50",name:"ペガサススター",lineageId:"speed",stats:{speed:900,stamina:550,guts:650,temperament:750,health:600,luck:900,explosiveness:950},pedigree:{father:"ポセイドン",mother:"メドゥーサ",grandFathers:["フォルキュス","ケートー"],grandMothers:["ガイア","ポントス"],greatGrandFathers:["ウラヌス","エーテル","ヘーメラー","カオス"]}},{id:"m51",name:"セレスティアルブルー",lineageId:"balance",stats:{speed:740,stamina:740,guts:740,temperament:880,health:850,luck:820,explosiveness:740},pedigree:{father:"スカイ",mother:"オーシャン",grandFathers:["アズール","サファイア"],grandMothers:["マリン","コーラル"],greatGrandFathers:["ディープ","ブルー","シー","ウェーブ"]}},{id:"m52",name:"ルナティックティア",lineageId:"speed",stats:{speed:910,stamina:520,guts:630,temperament:720,health:680,luck:880,explosiveness:960},pedigree:{father:"ムーン",mother:"ティア",grandFathers:["ナイト","シャドウ"],grandMothers:["ライト","シルバー"],greatGrandFathers:["ダーク","フル","クレセント","ニュー"]}},{id:"m53",name:"ソーラーフレア",lineageId:"guts",stats:{speed:690,stamina:710,guts:960,temperament:580,health:820,luck:640,explosiveness:880},pedigree:{father:"サン",mother:"フレア",grandFathers:["ヒート","バーン"],grandMothers:["プロミネンス","コロナ"],greatGrandFathers:["コア","マグマ","ファイア","ブレイズ"]}},{id:"m54",name:"スターダストメモリー",lineageId:"stamina",stats:{speed:580,stamina:920,guts:840,temperament:820,health:930,luck:780,explosiveness:520},pedigree:{father:"ダスト",mother:"メモリー",grandFathers:["パスト","フューチャー"],grandMothers:["プレゼント","タイム"],greatGrandFathers:["エターナル","インフィニティ","ゼロ","ワン"]}},{id:"m55",name:"オーロラヴェール",lineageId:"balance",stats:{speed:760,stamina:760,guts:760,temperament:940,health:880,luck:920,explosiveness:760},pedigree:{father:"オーロラ",mother:"ヴェール",grandFathers:["カーテン","ライト"],grandMothers:["カラー","プリズム"],greatGrandFathers:["レインボー","スペクトル","ビーム","レイ"]}},{id:"m56",name:"コメットテイル",lineageId:"speed",stats:{speed:930,stamina:540,guts:610,temperament:680,health:620,luck:860,explosiveness:970},pedigree:{father:"コメット",mother:"テイル",grandFathers:["ハレー","エンケ"],grandMothers:["百武","ヘール"],greatGrandFathers:["ボップ","シューメーカー","レヴィ","ウエスト"]}},{id:"m57",name:"プラネットリング",lineageId:"stamina",stats:{speed:620,stamina:940,guts:820,temperament:860,health:910,luck:740,explosiveness:580},pedigree:{father:"サターン",mother:"リング",grandFathers:["ジュピター","ウラヌス"],grandMothers:["ネプチューン","プルート"],greatGrandFathers:["マーズ","ヴィーナス","マーキュリー","アース"]}},{id:"m58",name:"ギャラクシーロード",lineageId:"guts",stats:{speed:710,stamina:690,guts:980,temperament:540,health:840,luck:680,explosiveness:910},pedigree:{father:"ロード",mother:"ギャラクシー",grandFathers:["ウェイ","パス"],grandMothers:["ルート","トラック"],greatGrandFathers:["ハイウェイ","レーン","ストリート","アベニュー"]}},{id:"m59",name:"ミルキーウェイ",lineageId:"balance",stats:{speed:770,stamina:770,guts:770,temperament:920,health:860,luck:890,explosiveness:770},pedigree:{father:"ミルク",mother:"ウェイ",grandFathers:["ホワイト","クリーム"],grandMothers:["シルク","スノー"],greatGrandFathers:["パール","アイボリー","バニラ","リリー"]}},{id:"m60",name:"ノヴァノヴァ",lineageId:"speed",stats:{speed:950,stamina:510,guts:590,temperament:740,health:640,luck:820,explosiveness:990},pedigree:{father:"ノヴァ",mother:"ノヴァ",grandFathers:["スーパー","ハイパー"],grandMothers:["ウルトラ","メガ"],greatGrandFathers:["ギガ","テラ","ペタ","エクサ"]}}];function Te(){const a=["サンダー","ギャラクシー","ミルキー","スター","コスモ","ルナ","ソーラー","ノヴァ","メテオ","コメット","アストロ","プラネット","オーロラ","スカイ","シリウス","ベガ","アルタイル","リゲル","カノープス","スピカ","アンタレス"],e=["ノヴァ","ブレイド","ロード","キング","クイーン","オーブ","ブレイブ","ダッシュ","ランナー","ハート","ソウル","スピリット","エース","ジョーカー","インパクト","オーロラ","ギャラクシー","スター","コスモス","ヘヴン"];return a[Math.floor(Math.random()*a.length)]+e[Math.floor(Math.random()*e.length)]}function Ne(a){const e={a:/[あかさたなはまやらわがざだばぱ]/,i:/[いきしちにひみりぎじぢびぴ]/,u:/[うくすつぬふむゆるぐずづぶぷ]/,e:/[えけせてねへめれげぜでべぺ]/,o:/[おこそとのほもよろをごぞどぼぽ]/,dash:/[ー]/};return e.a.test(a)?"speed":e.i.test(a)?"stamina":e.u.test(a)?"guts":e.e.test(a)?"temperament":e.o.test(a)?"luck":e.dash.test(a)?"health":null}function Re(a,e){const s=Math.random().toString(36).substr(2,9),i=Te(),r=[a.name,a.pedigree.father,a.pedigree.mother,...a.pedigree.grandFathers,...a.pedigree.grandMothers],n=[e.name,e.pedigree.father,e.pedigree.mother,...e.pedigree.grandFathers,...e.pedigree.grandMothers],d=new Set(r.join("").split("")),h=new Set(n.join("").split("")),g=[],u=[];d.forEach(m=>{if(m!=="?"&&h.has(m)){g.push(m);const M=Ne(m);M&&u.push(M)}});const f=new Set(a.name.split("")),R=new Set(e.name.split(""));let A=0;f.forEach(m=>{R.has(m)||A++}),R.forEach(m=>{f.has(m)||A++});const $=A>=3;let E=.05;$&&(E+=.15),g.length>0&&(E+=g.length*.03);const C=Math.random()<E,v=C?25:0,S=[],P=a.growthType,t=[{char:"流",trait:"流星の速さ"},{char:"星",trait:"流星の速さ"},{char:"龍",trait:"神のオーラ"},{char:"神",trait:"神のオーラ"},{char:"王",trait:"大逃げ"},{char:"帝",trait:"大逃げ"},{char:"威",trait:"威圧感"},{char:"圧",trait:"威圧感"},{char:"風",trait:"一陣の風"},{char:"嵐",trait:"一陣の風"},{char:"鋼",trait:"鋼の心臓"},{char:"鉄",trait:"鋼の心臓"},{char:"奇",trait:"奇跡の末脚"},{char:"跡",trait:"奇跡の末脚"}];g.forEach(m=>{const M=t.find(k=>k.char===m);M&&Math.random()<.3&&(S.includes(M.trait)||S.push(M.trait))}),[...a.traits||[],...e.traits||[]].forEach(m=>{Math.random()<.2&&(S.includes(m)||S.push(m))});const l=(m,M,k,F,V)=>{const j=V||100,_=m*.15+M*.25,B=100+Math.random()*600;let D=_+B;P==="early"&&(D-=50),P==="late"&&(D+=50);let O=150+j*1.5;const T=u.filter(L=>L===F).length;T>0&&(O+=T*120);let z=(Math.random()-.5)*O,G=D+z+(k||0);if(T>0&&(G+=T*40),$&&(G+=60),G>950){const L=.03+j/800;Math.random()>L&&(G=950+(G-950)*.05)}const U=1050+(j>120?(j-120)*8:-0);return Math.max(50,Math.min(U,Math.round(G)))},c={speed:l(a.stats.speed||500,e.stats.speed||500,v*4,"speed",a.explosivePower),stamina:l(a.stats.stamina||500,e.stats.stamina||500,v*4,"stamina",a.explosivePower),guts:l(a.stats.guts||500,e.stats.guts||500,v*4,"guts",a.explosivePower),temperament:l(a.stats.temperament||500,e.stats.temperament||500,u.filter(m=>m==="temperament").length*30,"temperament",a.explosivePower),health:l(a.stats.health||700,e.stats.health||700,v*2,"health",a.explosivePower),luck:l(a.stats.luck||700,e.stats.luck||700,v*2,"luck",a.explosivePower),explosiveness:l(a.stats.explosiveness||500,e.stats.explosiveness||500,v*5,"explosiveness",(a.explosivePower||100)*1.5)};g.length>2&&(c.temperament=Math.max(50,c.temperament-g.length*60));const x=Math.random()>.5?a.lineageId:e.lineageId,p=S.includes("大逃げ")?"escape":a.strategy,y={father:a.name,mother:e.name,grandFathers:[a.pedigree.father,e.pedigree.father],grandMothers:[a.pedigree.mother,e.pedigree.mother],greatGrandFathers:[a.pedigree.grandFathers[0],a.pedigree.grandFathers[1],e.pedigree.grandFathers[0],e.pedigree.grandFathers[1]]};return{horse:{id:s,name:i,age:0,gender:Math.random()>.5?"colt":"filly",color:["#3e2723","#5d4037","#795548","#a1887f","#212121","#424242","#9e9e9e","#eeeeee","#ffccbc"][Math.floor(Math.random()*9)],stats:{speed:Math.max(20,Math.round(c.speed*.3)),stamina:Math.max(20,Math.round(c.stamina*.3)),guts:Math.max(20,Math.round(c.guts*.3)),temperament:Math.max(20,Math.round(c.temperament*.3)),health:Math.max(20,Math.round(c.health*.3)),luck:Math.max(20,Math.round(c.luck*.3)),explosiveness:Math.max(20,Math.round(c.explosiveness*.3))},maxStats:c,lineageId:x,pedigree:y,distanceAptitude:a.distanceAptitude,growthType:P,strategy:p,trainingFocus:"speed",isRetired:!1,isGelding:!1,hasShadowRoll:!1,isInjured:!1,winCount:0,totalRaces:0,currentCondition:80,fatigue:0,gradedWins:[],isAutoMode:!1,traits:S,explosivePower:Math.max(50,(a.explosivePower||100)+Math.floor((Math.random()-.5)*40))},inbreeding:g,inbreedingCount:g.length,nicks:$,explosion:C}}function Ce(a){const{age:e,growthType:s,stats:i,maxStats:r}=a,n={...i};let d=0;const g={early:[2,3],normal:[3,4,5],late:[5,6,7,8]}[s].includes(e);if(s==="early"?e<=3?d=.08:e===4?d=.02:e>=6&&(d=-.05):s==="normal"?e<=2?d=.03:e<=5?d=.06:e>=8&&(d=-.03):s==="late"&&(e<=4?d=.02:e<=8?d=.05:e>=11&&(d=-.02)),g&&(d*=1.2),d!==0){const u=r||i;n.speed=Math.max(50,Math.min(u.speed||500,Math.floor((n.speed||300)+(u.speed||500)*d))),n.stamina=Math.max(50,Math.min(u.stamina||500,Math.floor((n.stamina||300)+(u.stamina||500)*d))),n.guts=Math.max(50,Math.min(u.guts||500,Math.floor((n.guts||300)+(u.guts||500)*d)))}return n}function Pe(a){const{age:e,growthType:s}=a;return s==="early"?e<=1?"幼駒":e<=3?"成長期 (早熟)":e===4?"全盛期 (早熟)":"衰退期 (早熟)":s==="normal"?e<=1?"幼駒":e<=2?"成長期 (普通)":e<=5?"全盛期 (普通)":"衰退期 (普通)":e<=1?"幼駒":e<=4?"成長期 (晩成)":e<=8?"全盛期 (晩成)":"衰退期 (晩成)"}function je(a){const e={a:/[あかさたなはまやらわがざだばぱ]/,i:/[いきしちにひみりぎじぢびぴ]/,u:/[うくすつぬふむゆるぐずづぶぷ]/,e:/[えけせてねへめれげぜでべぺ]/,o:/[おこそとのほもよろをごぞどぼぽ]/,dash:/[ー]/},s={speed:0,stamina:0,guts:0,temperament:0,luck:0,health:0};for(const i of a)e.a.test(i)&&(s.speed=(s.speed||0)+5),e.i.test(i)&&(s.stamina=(s.stamina||0)+5),e.u.test(i)&&(s.guts=(s.guts||0)+5),e.e.test(i)&&(s.temperament=(s.temperament||0)+5),e.o.test(i)&&(s.luck=(s.luck||0)+5),e.dash.test(i)&&(s.health=(s.health||0)+5);return s}function De(a,e,s){var S,P;const i=[a,...e],r=i.map(t=>{const o=t.stats,l=(Number(o.speed)+Number(o.stamina)+Number(o.guts)+Number(o.explosiveness))/4,c=Number(o.luck)/10;return Math.floor(l+c)}),n=[...r].sort((t,o)=>o-t),d=r.map(t=>t===n[0]?"◎":t===n[1]?"◯":t===n[2]?"▲":t===n[3]?"△":t>=n[7]?"×":""),h=i.map((t,o)=>{let l={speed:Number(t.stats.speed)||500,stamina:Number(t.stats.stamina)||500,guts:Number(t.stats.guts)||500,temperament:Number(t.stats.temperament)||500,luck:Number(t.stats.luck)||500,health:Number(t.stats.health)||500,explosiveness:Number(t.stats.explosiveness)||500};const c=[],x=[],p=je(t.name);l.speed+=p.speed||0,l.stamina+=p.stamina||0,l.guts+=p.guts||0,l.temperament+=p.temperament||0,l.luck+=p.luck||0,l.health+=p.health||0,s.trackCondition==="Heavy"&&t.lineageId==="stamina"&&(l.speed*=1.1,c.push("重馬場巧者"));const[y,b]=t.distanceAptitude;if((s.distance<y||s.distance>b)&&(l.stamina*=.8,x.push(`${t.name}は距離適性に苦しんでいる...`)),l.temperament<400&&!t.hasShadowRoll){const m=.9+l.temperament/4e3;l.speed*=m,l.stamina*=m,c.push("イレ込み"),x.push(`${t.name}はイレ込んでいる...`)}else l.temperament>800&&(l.speed*=1.02,c.push("落ち着き"));return t.hasShadowRoll&&(c.push("シャドーロール"),l.temperament<600&&(l.temperament+=200)),t.strategy===s.strategy&&(l.speed*=1.05,l.stamina*=1.05,c.push("作戦一致")),{horse:t,effectiveStats:l,activeBuffs:c,logs:x,lane:o,currentDistance:0,currentTime:0,currentSpeed:0,isInjuredInRace:!1,stamina:Math.max(100,l.stamina*1.5+l.guts*.5),maxStamina:Math.max(100,l.stamina*1.5+l.guts*.5),progress:[],finished:!1,finishTime:0,debuffBuffer:1}}),g=.1;let u=0;const f=.05,R=(t,o)=>{const c=(1e3-t.health)/2e6,x=o/1e6,p=t.luck/5e6;return Math.max(0,1e-5+c+x-p)},A=(t,o,l,c)=>{const x=c>0?l/c:0,p=x>0?.92+x*.08:.5;switch(t){case"escape":return o<.4?1.15*p:o<.8?1*p:.98*p;case"lead":return o<.3?1.05*p:o<.7?1.02*p:1.05*p;case"insert":return o<.4?.98*p:o<.7?1.02*p:1.15*p;case"stay":return o<.5?.92*p:o<.8?1*p:1.35*p;default:return 1*p}};let $=0;const E=1e4;for(h.forEach(t=>{t.progress.push({distance:0,speed:0,staminaLeft:t.maxStamina,x:0,y:100+t.lane*40,lane:t.lane})});h.some(t=>!t.finished)&&$<E;)$++,u+=f,h.forEach(t=>{t.debuffBuffer=1}),h.forEach(t=>{var B,D,O,T,z,G,U,L,Z;if(t.finished)return;(B=t.horse.traits)!=null&&B.includes("威圧感")&&h.forEach(I=>{I.horse.id!==t.horse.id&&!I.finished&&Math.abs(I.currentDistance-t.currentDistance)<20&&(I.debuffBuffer*=.98)});const o=Math.min(1,Math.max(0,t.currentDistance/s.distance));let l=1;h.filter(N=>N.horse.id!==t.horse.id&&!N.finished&&Math.abs(N.currentDistance-t.currentDistance)<5).length>0&&(l=1+(t.effectiveStats.guts||0)/1e4,t.horse.strategy==="stay"&&(l+=.02),(D=t.horse.traits)!=null&&D.includes("神のオーラ")&&(l+=.02));const x=A(t.horse.strategy,o,t.stamina,t.maxStamina),p=.98+Math.random()*.04,y=32+Math.pow((t.effectiveStats.speed||500)/100,1.3)*1.4;let b=1;(O=t.horse.traits)!=null&&O.includes("大逃げ")&&o<.7&&(b=1.3),(T=t.horse.traits)!=null&&T.includes("流星の速さ")&&o>.8&&(b*=1.12),(z=t.horse.traits)!=null&&z.includes("一陣の風")&&o>.75&&o<.85&&(b*=1.15),(G=t.horse.traits)!=null&&G.includes("奇跡の末脚")&&o>.95&&(b*=1.35);const m=y*x*p*l*b*t.debuffBuffer,M=.8+Math.random()*.4;let k=((t.effectiveStats.explosiveness||500)/80+5)*M;t.horse.strategy==="stay"&&o>.8&&(k*=1.8+Math.random()*.4),t.currentSpeed<m?t.currentSpeed=Math.min(m,t.currentSpeed+k*f):t.currentSpeed=Math.max(m,t.currentSpeed-k*.4*f);const F=isNaN(t.currentSpeed)||t.currentSpeed<0?0:t.currentSpeed;!t.finished&&!t.isInjuredInRace&&Math.random()<R(t.effectiveStats,t.horse.fatigue)&&(t.isInjuredInRace=!0,t.finished=!0,t.finishTime=999,t.logs.push(`${t.horse.name}が故障を発生！競争を中止しました。`),t.progress.push({distance:t.currentDistance,speed:0,staminaLeft:Math.max(0,t.stamina),x:t.currentDistance/s.distance*1e3,y:100+t.lane*40,lane:t.lane})),t.isInjuredInRace||(t.currentDistance+=F*f,isNaN(t.currentDistance)&&(t.currentDistance=0),t.currentTime=u);const V=Math.pow(F/45,2.8),j={escape:1.35,lead:1.15,insert:.9,stay:.7}[t.horse.strategy]||1;let _=1;if((U=t.horse.traits)!=null&&U.includes("大逃げ")&&(_*=1.8),(L=t.horse.traits)!=null&&L.includes("鋼の心臓")&&(_*=.65),t.stamina-=V*j*_*f*1.2,(Z=t.horse.traits)!=null&&Z.includes("威圧感")&&h.forEach(I=>{I.horse.id!==t.horse.id&&!I.finished&&Math.abs(I.currentDistance-t.currentDistance)<15&&(I.currentSpeed*=.98)}),t.currentDistance>=s.distance||isNaN(t.currentDistance)){const N=t.currentDistance-F*f,J=(s.distance-N)/(F*f||1);t.finishTime=u-f+J*f,t.currentDistance=s.distance,t.finished=!0,t.progress.push({distance:t.currentDistance,speed:0,staminaLeft:Math.max(0,t.stamina),x:1e3,y:100+t.lane*40,lane:t.lane})}u>=t.progress.length*g&&t.progress.push({distance:t.currentDistance,speed:F,staminaLeft:Math.max(0,t.stamina),x:t.currentDistance/s.distance*1e3,y:100+t.lane*40,lane:t.lane})});h.forEach(t=>{t.finished||(t.finished=!0,t.finishTime=u,t.currentDistance=s.distance)});const C=h.map((t,o)=>({horseId:t.horse.id,name:t.horse.name,strategy:t.horse.strategy,time:t.finishTime,position:0,logs:t.logs,buffs:t.activeBuffs,progress:t.progress,rating:r[o],prediction:d[o]}));C.sort((t,o)=>t.time-o.time),C.forEach((t,o)=>{t.position=o+1});const v=Math.max(...h.map(t=>t.progress.length));for(let t=0;t<v;t++){let o="";const l=[...h].sort((y,b)=>{var k,F;const m=((k=y.progress[t])==null?void 0:k.distance)||y.currentDistance;return(((F=b.progress[t])==null?void 0:F.distance)||b.currentDistance)-m}),c=l[0],x=l[1],p=l[2];if(t===0)o=s.grade==="G-ultra"?"全宇宙が注目する伝説のレース、宇宙創世杯が今、幕を開けます！":"各馬、一斉にスタートしました！きれいなスタートです。";else if(t===Math.floor(v*.1))(S=c.horse.traits)!=null&&S.includes("大逃げ")?o=`${c.horse.name}が猛烈な勢いでハナを切る！大逃げの構えだ！`:o=`${c.horse.name}がハナを切りました。${x.horse.name}がそれに続きます。`;else if(t===Math.floor(v*.25))(P=c.horse.traits)!=null&&P.includes("大逃げ")?o=`${c.horse.name}が後続を大きく引き離す！これはとんでもない大逃げだ！`:o="第2コーナーを回って向こう正面。隊列は縦長になってきました。";else if(t===Math.floor(v*.4))o=`依然として${c.horse.name}が先頭。2番手には${x.horse.name}。`;else if(t===Math.floor(v*.55))o="さあ、第3コーナー！後方の各馬も一気に差を詰めてくる！";else if(t===Math.floor(v*.7))o="第4コーナーをカーブして直線！さあ、ここからが勝負だ！";else if(t===Math.floor(v*.8)){const y=l.find(b=>b.horse.strategy==="stay");y&&l.indexOf(y)<5?o=`外から一気に${y.horse.name}が飛んできた！凄まじい追い込みだ！`:o=`残り400m！${c.horse.name}がまだ粘っている！外から${x.horse.name}！`}else t===Math.floor(v*.9)?o=`残り200m！${c.horse.name}か！？${x.horse.name}か！？${p?p.horse.name+"も突っ込んできた！":""}`:t===v-5&&(o="最後の叩き合い！栄冠は誰の手に！？");o&&c.progress[t]&&(c.progress[t].commentary=o)}return C}function Le(a,e){const s=[],i={Newcomer:250,Maiden:300,Condition:400,G3:500,G2:600,G1:700,G0:820,"G-ultra":920}[e]||500;for(let r=0;r<a;r++){const n=e==="G-ultra"&&r<5,d=n?100:0,h={speed:i+d+Math.random()*150,stamina:i+d+Math.random()*150,guts:i+d+Math.random()*150,temperament:i+d+Math.random()*150,health:i+d+Math.random()*150,luck:i+d+Math.random()*150,explosiveness:i+d+Math.random()*150},g=["escape","lead","insert","stay"],u=n?r%4===0?"escape":r%4===1?"stay":g[Math.floor(Math.random()*g.length)]:g[Math.floor(Math.random()*g.length)],f=[];n&&(u==="escape"&&f.push("大逃げ"),u==="stay"&&f.push("流星の速さ"),f.push("神のオーラ")),s.push({id:`enemy-${r}`,name:n?_e(r):Oe(),age:3,gender:"colt",color:n?"#FFD700":"#424242",stats:h,maxStats:h,lineageId:"balance",pedigree:{father:"?",mother:"?",grandFathers:[],grandMothers:[],greatGrandFathers:[]},distanceAptitude:[1e3,4e3],growthType:"normal",strategy:u,trainingFocus:"speed",isRetired:!1,isGelding:!1,hasShadowRoll:n||Math.random()>.8,isInjured:!1,winCount:0,totalRaces:0,currentCondition:100,fatigue:0,gradedWins:[],explosivePower:n?200:100,traits:f})}return s}function _e(a){const e=["ジ・アルティメット","ギャラクシー・エンド","創世神","ビッグバン・ゼロ","エターナル・スター"];return e[a%e.length]}function Oe(){const a=["サンダー","ギャラクシー","ミルキー","スター","コスモ","ルナ","ソーラー","ノヴァ","メテオ","シリウス","ベガ"],e=["ノヴァ","ブレイド","ロード","キング","クイーン","オーブ","ブレイブ","インパクト","エース","ハート"];return a[Math.floor(Math.random()*a.length)]+e[Math.floor(Math.random()*e.length)]}const W="stellar_breeder_save_v1";window.state={screen:"title",horses:[],mares:[...H],money:1e7,week:1,month:1,year:1,selectedHorseId:null,selectedMareId:null,selectedStallionId:null,breedingResult:null,currentRace:null,raceResult:null,raceStep:0,history:[],showSaveModal:!1};function se(){try{const a={horses:window.state.horses,mares:window.state.mares,money:window.state.money,week:window.state.week,month:window.state.month,year:window.state.year,history:window.state.history};localStorage.setItem(W,JSON.stringify(a))}catch(a){console.error("Failed to auto-save:",a)}}function re(){try{const a=localStorage.getItem(W);if(a){const e=JSON.parse(a);return window.state.horses=e.horses||[],window.state.mares=e.mares||[...H],window.state.money=typeof e.money=="number"?e.money:1e7,window.state.week=e.week||1,window.state.month=e.month||1,window.state.year=e.year||1,window.state.history=e.history||[],!0}}catch(a){console.error("Failed to load game:",a)}return!1}window.exportSaveData=()=>{try{const a={horses:window.state.horses,mares:window.state.mares,money:window.state.money,week:window.state.week,month:window.state.month,year:window.state.year,history:window.state.history},e=JSON.stringify(a,null,2),s=new Blob([e],{type:"application/json"}),i=URL.createObjectURL(s),r=document.createElement("a");r.href=i,r.download=`stellar_breeder_save_y${window.state.year}_m${window.state.month}.json`,document.body.appendChild(r),r.click(),document.body.removeChild(r),URL.revokeObjectURL(i)}catch(a){alert("エラーが発生しました: "+a.message)}};window.importSaveData=a=>{const e=a.target.files[0];if(!e)return;const s=new FileReader;s.onload=i=>{try{const r=JSON.parse(i.target.result);if(typeof r.money>"u"||!Array.isArray(r.horses))throw new Error("無効なセーブデータファイル形式です。");window.setState({horses:r.horses||[],mares:r.mares||[...H],money:r.money,week:r.week||1,month:r.month||1,year:r.year||1,history:r.history||[],screen:"stable",showSaveModal:!1}),se(),alert("セーブデータを正常にインポートしました！ゲームを再開します。")}catch(r){alert("セーブデータの読込に失敗しました: "+r.message)}},s.readAsText(e)};window.setState=a=>{window.state={...window.state,...a},["stable","title","breeding_mare","breeding_stallion","breeding_confirm","race_select"].includes(window.state.screen)&&se(),ne()};window.handleAction=(a,e)=>{switch(a){case"START_RACE":const s=window.state.horses.find(g=>g.id===window.state.selectedHorseId),i=Le(11,e.grade),r=De(s,i,e);window.setState({screen:"race_sim",currentRace:e,raceResult:r,raceStep:0});break;case"CONFIRM_BREEDING":const n=window.state.mares.find(g=>g.id===window.state.selectedMareId),d=K.find(g=>g.id===window.state.selectedStallionId);if(window.state.money<d.fee){alert("資金が足りません");return}const h=Re(d,n);window.setState({money:window.state.money-d.fee,breedingResult:h,screen:"stable",horses:[...window.state.horses,h.horse]}),alert(`${h.horse.name}が誕生しました！`);break;case"NEXT_WEEK":He();break;default:console.warn("Unknown action",a)}};function He(){let{week:a,month:e,year:s,horses:i}=window.state;a++,a>4&&(a=1,e++),e>12&&(e=1,s++);const r=i.map(n=>n.isRetired?n:a===1?{...n,stats:Ce(n)}:n);window.setState({week:a,month:e,year:s,horses:r})}function w({children:a,onClick:e,className:s="",variant:i="primary"}){const r="px-4 py-2 rounded-lg font-bold transition-all active:scale-95 cursor-pointer",n={primary:"bg-indigo-600 text-white hover:bg-indigo-700",secondary:"bg-slate-700 text-white hover:bg-slate-600",outline:"border border-slate-600 text-white hover:bg-slate-800",danger:"bg-red-600 text-white hover:bg-red-700"};let d="";if(typeof e=="string")d=`onclick="${e}"`;else{const h=`cb-${Math.random().toString(36).substr(2,9)}`;window[h]=e,d=`onclick="window['${h}'](event)"`}return`<button ${d} class="${r} ${n[i]} ${s}">${a}</button>`}const q=a=>`¥${(a/1e4).toLocaleString()}万`;function Q(){const a=localStorage.getItem(W)!==null;return`
    <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-4">
      <div class="text-center space-y-8 max-w-2xl">
        <h1 class="text-7xl font-black italic tracking-tighter uppercase">
          <span class="block text-indigo-500">Stellar</span>
          <span class="block">Breeder</span>
        </h1>
        <p class="text-slate-400 font-medium tracking-widest uppercase text-sm">異次元のスピード、伝説の血統をその手に。</p>
        <div class="pt-8 flex flex-col sm:flex-row justify-center gap-4">
          ${w({children:"最初から始める",onClick:()=>{a&&!confirm("保存されているデータを上書きして最初から始めますか？")||window.setState({screen:"stable",horses:[],mares:[...H],money:1e7,week:1,month:1,year:1,history:[]})},className:"text-lg px-8 py-4",variant:"primary"})}
          ${a?w({children:"続きから始める",onClick:()=>{re(),window.setState({screen:"stable"})},className:"text-lg px-8 py-4",variant:"outline"}):""}
        </div>
      </div>
    </div>
  `}function Be(){const{horses:a,money:e,year:s,month:i,week:r}=window.state;return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col">
      <!-- Header -->
      <header class="p-6 border-b border-indigo-500/20 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div class="flex items-center gap-6">
          <h2 class="text-2xl font-black italic tracking-tighter uppercase">MY STABLE</h2>
          <div class="flex items-center gap-4 text-xs font-bold tracking-widest text-slate-400">
             <span>YEAR ${s} / MON ${i} / WEEK ${r}</span>
             <span class="text-emerald-400">${q(e)}</span>
          </div>
        </div>
        <div class="flex gap-2">
          ${w({children:"データ管理",onClick:()=>window.setState({showSaveModal:!0}),variant:"outline",className:"px-4"})}
          ${w({children:"配合",onClick:()=>window.setState({screen:"breeding_mare"}),variant:"secondary",className:"px-6"})}
          ${w({children:"次週へ",onClick:()=>window.handleAction("NEXT_WEEK"),variant:"primary",className:"px-6"})}
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 p-6 max-w-7xl mx-auto w-full">
        ${a.length===0?`
          <div class="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 gap-4">
            <p class="font-bold">所有馬がいません</p>
            ${w({children:"最初の配合を行う",onClick:()=>window.setState({screen:"breeding_mare"}),variant:"outline"})}
          </div>
        `:`
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${a.map(n=>`
              <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all group overflow-hidden relative">
                <div class="relative z-10 h-full flex flex-col">
                   <div class="flex justify-between items-start mb-4">
                      <div class="space-y-1">
                        <h3 class="text-xl font-black italic tracking-tight uppercase">${n.name}</h3>
                        <div class="flex gap-2 text-[10px] font-bold text-slate-500">
                          <span>${n.age}歳 ${n.gender==="colt"?"牡":"牝"}</span>
                          <span>${Pe(n)}</span>
                        </div>
                      </div>
                      <div class="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/50 backdrop-blur-sm border border-white/10 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 transition-all">
                         <div class="w-2/3 h-2/3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style="background-color: ${n.color}"></div>
                      </div>
                   </div>

                   <!-- Stats -->
                   <div class="grid grid-cols-2 gap-4 my-4 flex-1">
                      <div class="space-y-1">
                        <div class="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>SPEED</span><span>${n.stats.speed}</span></div>
                        <div class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div class="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style="width: ${n.stats.speed/1e3*100}%"></div>
                        </div>
                      </div>
                      <div class="space-y-1">
                        <div class="flex justify-between text-[8px] font-bold text-slate-500 uppercase"><span>STAMINA</span><span>${n.stats.stamina}</span></div>
                        <div class="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div class="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style="width: ${n.stats.stamina/1e3*100}%"></div>
                        </div>
                      </div>
                   </div>

                   <div class="pt-4 border-t border-white/5 flex gap-2">
                     ${w({children:"レース登録",onClick:()=>window.setState({screen:"race_select",selectedHorseId:n.id}),className:"flex-1 text-xs py-2"})}
                   </div>
                </div>
              </div>
            `).join("")}
          </div>
        `}
      </main>
    </div>
  `}function ze(){const{mares:a}=window.state;return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT MARE</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">配合相手となる繁殖牝馬を選んでください</p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${a.map(e=>`
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer" onclick="window.setState({ screen: 'breeding_stallion', selectedMareId: '${e.id}' })">
            <h3 class="text-xl font-black italic tracking-tight uppercase mb-4">${e.name}</h3>
            <div class="grid grid-cols-2 gap-4">
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-indigo-500" style="width: ${e.stats.speed/1e3*100}%"></div></div>
               </div>
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">STAMINA</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-blue-500" style="width: ${e.stats.stamina/1e3*100}%"></div></div>
               </div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="mt-8">
        ${w({children:"戻る",onClick:()=>window.setState({screen:"stable"}),variant:"outline"})}
      </div>
    </div>
  `}function Ue(){return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">SELECT STALLION</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
          ${window.state.mares.find(e=>e.id===window.state.selectedMareId).name} に配合する種牡馬を選んでください
        </p>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        ${K.map(e=>`
          <div class="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer" 
               onclick="window.setState({ screen: 'breeding_confirm', selectedStallionId: '${e.id}' })">
            <div class="flex justify-between items-start mb-4">
              <h3 class="text-xl font-black italic tracking-tight uppercase">${e.name}</h3>
              <span class="text-emerald-400 font-bold text-xs">${q(e.fee)}</span>
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">SPEED</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-indigo-500" style="width: ${e.stats.speed/1e3*100}%"></div></div>
               </div>
               <div>
                 <span class="block text-[8px] font-bold text-slate-500 uppercase mb-1">EXPLOSIVE POWER</span>
                 <div class="h-1 bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-amber-500" style="width: ${e.explosivePower/200*100}%"></div></div>
               </div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="fixed bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-md border-t border-white/5 mt-8">
        ${w({children:"戻る",onClick:()=>window.setState({screen:"breeding_mare"}),variant:"outline"})}
      </div>
    </div>
  `}function We(){const a=window.state.mares.find(s=>s.id===window.state.selectedMareId),e=K.find(s=>s.id===window.state.selectedStallionId);return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div class="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center space-y-8">
        <h2 class="text-4xl font-black italic tracking-tighter uppercase">BREEDING CONFIRM</h2>
        <div class="flex items-center justify-center gap-8">
          <div class="text-center">
            <div class="text-[10px] text-slate-500 font-bold uppercase mb-2">MARE</div>
            <div class="text-xl font-black uppercase">${a.name}</div>
          </div>
          <div class="text-2xl text-indigo-500">×</div>
          <div class="text-center">
            <div class="text-[10px] text-slate-500 font-bold uppercase mb-2">STALLION</div>
            <div class="text-xl font-black uppercase">${e.name}</div>
          </div>
        </div>
        <div class="text-2xl font-black text-emerald-400">FEES: ${q(e.fee)}</div>
        <div class="flex gap-4">
          ${w({children:"配合を行う",onClick:()=>window.handleAction("CONFIRM_BREEDING"),className:"flex-1 py-4 text-lg"})}
          ${w({children:"キャンセル",onClick:()=>window.setState({screen:"breeding_stallion"}),variant:"outline",className:"px-8"})}
        </div>
      </div>
    </div>
  `}function qe(){const a=window.state.horses.find(s=>s.id===window.state.selectedHorseId),e=[{id:"r1",name:"シリウス新馬戦",distance:1600,grade:"Newcomer",fee:0,prize:5e6},{id:"r2",name:"ベテルギウスS",distance:2e3,grade:"G3",fee:1e5,prize:2e7},{id:"r3",name:"銀河大賞 (G1)",distance:2400,grade:"G1",fee:5e5,prize:1e8}];return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col p-6">
      <header class="mb-8">
        <h2 class="text-3xl font-black italic uppercase tracking-tighter">RACE SELECTION</h2>
        <p class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">${a.name} を出走させるレースを選んでください</p>
      </header>
      <div class="space-y-4 max-w-3xl">
        ${e.map(s=>`
          <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex justify-between items-center hover:border-indigo-500/50 transition-all cursor-pointer"
               onclick="window.handleAction('START_RACE', ${JSON.stringify(s).replace(/"/g,"&quot;")})">
            <div class="flex items-center gap-4">
              <span class="px-2 py-1 bg-slate-800 rounded text-[10px] font-black">${s.grade}</span>
              <h3 class="text-xl font-black uppercase italic">${s.name}</h3>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-slate-500 uppercase">PRIZE</div>
              <div class="text-lg font-black text-amber-500">${q(s.prize)}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div class="mt-8">
        ${w({children:"戻る",onClick:()=>window.setState({screen:"stable"}),variant:"outline"})}
      </div>
    </div>
  `}function Ve(){var n;const{raceResult:a,raceStep:e,currentRace:s}=window.state,i=Math.max(...a.map(d=>d.progress.length));window.state.screen==="race_sim"&&e<i-1?setTimeout(()=>{window.setState({raceStep:e+1})},100):e>=i-1&&setTimeout(()=>{window.setState({screen:"race_result"})},2e3);const r=a.map(d=>{const h=d.progress[e]||d.progress.at(-1);return{...d,...h}});return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div class="w-full max-w-5xl space-y-8">
        <div>
          <h2 class="text-4xl font-black italic tracking-tighter uppercase">${s.name}</h2>
          <div class="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-2">${s.distance}M / LIVE SIMULATION</div>
        </div>

        <div class="relative h-[400px] bg-slate-900 rounded-[3rem] border border-white/5 overflow-hidden p-8 flex flex-col justify-between">
           ${r.map(d=>`
             <div class="relative h-6 w-full flex items-center">
               <div class="absolute inset-0 border-b border-white/5"></div>
               <div class="absolute transition-all duration-100 ease-linear" style="left: ${d.distance/s.distance*95}%">
                  <div class="w-6 h-6 rounded-full shadow-lg flex items-center justify-center text-[8px] font-bold" 
                       style="background-color: ${d.horseId===window.state.selectedHorseId?"#6366f1":"#424242"}">
                    ${d.position||""}
                  </div>
                  <div class="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-tighter ${d.horseId===window.state.selectedHorseId?"text-indigo-400":"text-slate-500"}">
                    ${d.name}
                  </div>
               </div>
             </div>
           `).join("")}
           <div class="absolute top-0 bottom-0 right-[5%] w-1 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>

        <div class="h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center px-6">
          <p class="text-sm font-bold italic tracking-tight text-indigo-400">
            ${((n=r.find(d=>d.commentary))==null?void 0:n.commentary)||"各馬、激しい競り合いが続いています！"}
          </p>
        </div>
      </div>
    </div>
  `}function Je(){const a=[...window.state.raceResult].sort((s,i)=>s.position-i.position),e=a.find(s=>s.horseId===window.state.selectedHorseId);return`
    <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div class="max-w-3xl w-full space-y-8">
        <header class="text-center space-y-2">
          <h2 class="text-5xl font-black italic tracking-tighter uppercase">RACE RESULT</h2>
          <p class="text-indigo-400 font-bold text-xl uppercase tracking-widest">${e.position}着 / ${e.name}</p>
        </header>

        <div class="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden">
          <table class="w-full text-left">
            <thead class="bg-slate-800/50 text-[10px] font-black tracking-widest uppercase text-slate-500">
              <tr>
                <th class="px-8 py-4">POS</th>
                <th class="px-8 py-4">HORSE</th>
                <th class="px-8 py-4">TIME</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${a.slice(0,5).map(s=>`
                <tr class="${s.horseId===window.state.selectedHorseId?"bg-indigo-500/10":""}">
                  <td class="px-8 py-4 font-black italic text-2xl">${s.position}</td>
                  <td class="px-8 py-4 font-black uppercase tracking-tight">${s.name}</td>
                  <td class="px-8 py-4 font-mono text-sm">${(s.time/1).toFixed(1)}s</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="flex justify-center">
           ${w({children:"牧場に戻る",onClick:()=>window.setState({screen:"stable",currentRace:null,raceResult:null,raceStep:0}),className:"px-12 py-4 text-lg"})}
        </div>
      </div>
    </div>
  `}function Ke(){return window.state.showSaveModal?`
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] max-w-lg w-full p-8 space-y-6 relative">
        <button class="absolute top-6 right-6 text-slate-400 hover:text-white font-bold cursor-pointer text-xl" onclick="window.setState({ showSaveModal: false })">✕</button>
        
        <h3 class="text-2xl font-black italic tracking-tighter uppercase text-indigo-400">DATA MANAGEMENT</h3>
        <p class="text-slate-400 text-xs font-semibold">現在プレイ中のゲームデータを、ファイル出力してデバイスへ保存したり、お持ちのセーブデータファイルを読み込むことができます。</p>
        
        <div class="space-y-4 pt-4 border-t border-white/5 text-left text-white">
          <!-- Local Auto Save State -->
          <div class="bg-slate-800/40 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <div class="font-bold text-sm">ブラウザ自動保存</div>
              <div class="text-[10px] text-slate-500 mt-0.5">プレイ状況はブラウザへ自動的に適時セーブされています。</div>
            </div>
            <div class="text-emerald-400 font-bold text-xs flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> オートセーブON
            </div>
          </div>
          
          <!-- File Export -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">💾 セーブデータのファイル保存 (ダウンロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">ゲーム進捗データをJSONファイルとしてデバイスにダウンロードします。スマホ等他の端末への引き継ぎやバックアップとして利用可能です。</p>
            </div>
            ${w({children:"セーブデータをダウンロード",onClick:"window.exportSaveData()",variant:"primary",className:"w-full text-xs py-2.5"})}
          </div>

          <!-- File Import -->
          <div class="border border-white/5 bg-slate-950 p-5 rounded-2xl flex flex-col gap-3">
            <div class="space-y-1">
              <div class="font-bold text-sm">📂 セーブデータの読込 (アップロード)</div>
              <p class="text-[10px] text-slate-400 leading-relaxed">過去にエクスポートしたセーブデータを読み込み、プレイを再開します。<br><span class="text-amber-500 font-semibold">※現在プレイ中のデータは上書きしてロードされます。</span></p>
            </div>
            <label class="block w-full">
              <input type="file" accept=".json" onchange="window.importSaveData(event)" class="hidden" id="save-file-input">
              <div class="bg-slate-800 text-center hover:bg-slate-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg cursor-pointer transition-all active:scale-95 border border-white/5">
                セーブデータファイルを選択する
              </div>
            </label>
          </div>
          
          <!-- Danger Zone: Reset -->
          <div class="pt-4 border-t border-white/5 flex gap-3">
            ${w({children:"閉じる",onClick:()=>window.setState({showSaveModal:!1}),variant:"secondary",className:"flex-1 text-xs py-2.5"})}
            ${w({children:"データを完全初期化",onClick:()=>{confirm("本当に保存されているすべてのゲームデータをリセットしますか？この操作は取り消せません。")&&(localStorage.removeItem(W),window.setState({screen:"title",horses:[],mares:[...H],money:1e7,week:1,month:1,year:1,history:[],showSaveModal:!1}),alert("すべてのセーブデータを完全に初期化しました。"))},variant:"danger",className:"text-xs py-2.5"})}
          </div>
        </div>
      </div>
    </div>
  `:""}function ne(){const a=document.getElementById("app");if(!a)return;let e="";switch(window.state.screen){case"title":e=Q();break;case"stable":e=Be();break;case"breeding_mare":e=ze();break;case"breeding_stallion":e=Ue();break;case"breeding_confirm":e=We();break;case"race_select":e=qe();break;case"race_sim":e=Ve();break;case"race_result":e=Je();break;default:e=Q()}a.innerHTML=e+Ke(),ae({icons:{Trophy:Ae,Calendar:me,Coins:fe,Dna:xe,Zap:Ee,Activity:pe,ChevronRight:ue,ChevronLeft:ge,Play:ke,Heart:we,TrendingUp:Ge,History:be,Star:Se,Home:ye,Sparkles:Ie,Flame:ve,Wind:$e,MessageSquare:Me,Send:Fe}})}document.addEventListener("DOMContentLoaded",()=>{re(),ne()});
