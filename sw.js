if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let d={};const o=e=>i(e,t),l={module:{uri:t},exports:d,require:o};s[t]=Promise.all(n.map((e=>l[e]||o(e)))).then((e=>(r(...e),d)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-BLmwB-cG.css",revision:null},{url:"assets/index-C4VduO7t.js",revision:null},{url:"index.html",revision:"c8e8b5f17f93d92936f9b4136a0b0d13"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"wine-glass.svg",revision:"922f3a45dda8297806e9df82a8d203ec"},{url:"manifest.webmanifest",revision:"6efc65f58c4d565d6d021bd49f9f027f"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));