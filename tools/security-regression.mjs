// Offline checks of the actual homepage helpers. No requests or production writes.
// Run: node tools/security-regression.mjs
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const source=file=>fs.readFileSync(new URL(file,root),'utf8');
let passed=0,failed=0;
function test(name,fn){try{fn();passed++;console.log('PASS '+name);}catch(e){failed++;console.error('FAIL '+name+': '+e.message);process.exitCode=1;}}
const main=source('assets/js/main.js');
const helper=main.slice(0,main.indexOf('// ================= GÄSTEBUCH SPEICHERN'));
const context=vm.createContext({URL,window:{supabase:{createClient:()=>({})}},document:{body:{classList:{contains:()=>false}}}});
vm.runInContext(helper,context);
const url='https://yawadxzeyyrozmlrokun.supabase.co/storage/v1/object/public/gallery/';
test('HTML payload escaped as text',()=>assert.equal(context.escapeHtml('<img src=x onerror="x">&\''),'&lt;img src=x onerror=&quot;x&quot;&gt;&amp;&#039;'));
for(const value of ['javascript:alert(1)','data:image/svg+xml,<svg onload=alert(1)>','https://example.invalid/a.png',url+'a.svg',url+'a.png" onerror="x',url+'a.png?tracking=1',url+'a.png#x',url+'../a.png','https://yawadxzeyyrozmlrokun.supabase.co.evil.invalid/a.png'])
 test('gallery rejects '+value.slice(0,60),()=>assert.equal(context.safeGalleryImageUrl(value),''));
for(const file of ['01234567-89ab-4cde-8fab-0123456789ab.png','legacy-screenshot_1.jpg','image.jpeg','image.webp'])
 test('gallery retains '+file,()=>assert.equal(context.safeGalleryImageUrl(url+file),url+file));
const account=source('assets/js/account.js');
const next=account.slice(account.indexOf('    const allowed ='),account.indexOf('    function authUrl'));
const nextContext=vm.createContext({URL,root:new URL('https://www.zhserver.de/'),site:path=>new URL(path,'https://www.zhserver.de/').href});
vm.runInContext(next,nextContext);
for(const value of ['https://evil.invalid/','//evil.invalid/','javascript:alert(1)','https://www.zhserver.de@evil.invalid/','/profile/?access_token=secret','/profile/#refresh_token=secret','/profile/#%ZZ','/admin/../../evil'])
 test('return URL rejects '+value,()=>assert.equal(nextContext.safeNext(value),'https://www.zhserver.de/profile/'));
test('legitimate forum return retained',()=>assert.equal(nextContext.safeNext('/forum/#category/general'),'https://www.zhserver.de/forum/#category/general'));
// Exercise the actual handoff runtime with dummy tokens and no network.
const handlers={},notifications=[],responses=[];
const child={location:{origin:'https://www.zhserver.de'},postMessage:(data,origin)=>responses.push({data,origin})};
const frame={src:'https://www.zhserver.de/game/survival-v118.html',contentWindow:child,getAttribute:()=>frame.src,addEventListener:()=>{}};
let session={access_token:'offline.fixture.token',expires_at:Math.floor(Date.now()/1000)+600,user:{is_anonymous:false}},authChanged;
const bridgeWindow={location:new URL('https://www.zhserver.de/game.html'),zhSupabaseClient:{auth:{getSession:async()=>({data:{session}}),onAuthStateChange:fn=>{authChanged=fn;}}},addEventListener:(name,fn)=>handlers[name]=fn,dispatchEvent:e=>notifications.push(e.detail)};
vm.runInNewContext(source('assets/js/game-auth-bridge.js'),{window:bridgeWindow,document:{getElementById:()=>frame,addEventListener:()=>{}},navigator:{},URL,CustomEvent:class{constructor(type,options){this.detail=options.detail;}},setTimeout:()=>1,clearTimeout:()=>{}});
await bridgeWindow.ZHGameAuth.getSession();responses.length=0;
const request={type:'zhserver.game.auth.request',version:1,request_id:'a'.repeat(32)};
await handlers.message({origin:'https://evil.invalid',source:child,data:request});
test('cross-origin handoff request receives no token',()=>assert.equal(responses.length,0));
await handlers.message({origin:'https://www.zhserver.de',source:{},data:request});
test('same-origin wrong window receives no token',()=>assert.equal(responses.length,0));
await handlers.message({origin:'https://www.zhserver.de',source:child,data:{...request,request_id:'<script>'}});
test('invalid handoff request id rejected',()=>assert.equal(responses.length,0));
await handlers.message({origin:'https://www.zhserver.de',source:child,data:request});
test('trusted child receives access candidate only',()=>{assert.equal(responses.length,1);assert.equal(responses[0].origin,'https://www.zhserver.de');assert.equal(responses[0].data.session.access_token,'offline.fixture.token');assert.equal(responses[0].data.session.refresh_token,undefined);});
test('change notifications contain no credentials',()=>assert.ok(notifications.every(n=>!JSON.stringify(n).includes('offline.fixture.token'))));
authChanged('SIGNED_OUT',null);
test('logout invalidates cached handoff',()=>assert.equal(bridgeWindow.ZHGameAuth.getSnapshot().session,null));
authChanged('TOKEN_REFRESHED',{...session,expires_at:Math.floor(Date.now()/1000)-1});
test('expired SDK session never handed out',()=>assert.equal(bridgeWindow.ZHGameAuth.getSnapshot().session,null));
authChanged('TOKEN_REFRESHED',{...session,access_token:'malformed'});
test('malformed SDK session rejected',()=>assert.equal(bridgeWindow.ZHGameAuth.getSnapshot().session,null));
console.log(JSON.stringify({passed,failed,root:fileURLToPath(root)}));
