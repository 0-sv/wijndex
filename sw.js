if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let o={};const d=e=>i(e,t),l={module:{uri:t},exports:o,require:d};s[t]=Promise.all(n.map((e=>l[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-CWnpvlk6.css",revision:null},{url:"assets/index-CxbtyEXg.js",revision:null},{url:"index.html",revision:"84d5a2b7ec1a12959efc8200e6dac83d"},{url:"registerSW.js",revision:"bc2b00198f4616f452a116ba524c5564"},{url:"wine-glass.svg",revision:"922f3a45dda8297806e9df82a8d203ec"},{url:"manifest.webmanifest",revision:"4410d4c77d3f6fc4c1c4d0fb84e7346d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
