// Grabora — single-file Cloudflare Pages Worker
// Authorized direct-media URLs only. No DRM/access-control bypass.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#070b10">
<title>Grabora — Save authorized media</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<header class="topbar"><div class="brand"><span class="brand-mark">G</span><span>grabora</span></div><span class="pill">AUTHORIZED MEDIA</span></header>
<main class="shell">
<section class="hero">
<p class="eyebrow">MEDIA SAVER</p>
<h1>Grab it. Keep it.</h1>
<p class="sub">Use a direct media URL you own or are authorized to download. Grabora checks what the source actually provides instead of inventing quality options.</p>
<form id="mediaForm" class="card">
<label for="url">Media URL</label>
<div class="input-row"><input id="url" type="url" placeholder="https://example.com/video.mp4" required><button id="inspectBtn" type="submit">Get Media <span>→</span></button></div>
<p class="hint">Direct video, audio, image, or subtitle URLs are supported in this first backend.</p>
</form>

<section id="result" class="card result hidden" aria-live="polite">
<div class="result-head"><div><p class="eyebrow">MEDIA READY</p><h2 id="sourceName">Source</h2></div><span id="sourceType" class="type-badge">—</span></div>
<div class="meta" id="meta"></div>
<div class="options">
<button class="option active" data-kind="video"><b>Video</b><small>Original source</small></button>
<button class="option" data-kind="audio"><b>Audio only</b><small>Only when source is audio</small></button>
<button class="option" data-kind="thumbnail"><b>Thumbnail</b><small>Direct image source</small></button>
<button class="option" data-kind="captions"><b>Captions</b><small>Direct .vtt/.srt source</small></button>
</div>
<div id="availability" class="availability"></div>
<a id="downloadBtn" class="download" href="#" rel="noopener">Download <span>↓</span></a>
</section>

<section id="error" class="card error hidden"><b id="errorTitle">Couldn’t process that link</b><p id="errorText"></p><button id="retryBtn" type="button">Try again</button></section>
<p class="legal">Only download media you own or have permission to download. Grabora does not bypass access controls, DRM, or platform restrictions.</p>
</section>
<section class="steps">
<article><span>01</span><h3>Paste</h3><p>Enter an authorized direct media URL.</p></article>
<article><span>02</span><h3>Check</h3><p>Grabora reads the source type and available file information.</p></article>
<article><span>03</span><h3>Save</h3><p>Download the original source without fake quality choices.</p></article>
</section>
</main>
<footer><div>Save. Simple. Fast.</div><small>Crafted by Anubhav Verma</small></footer>
<script src="/app.js"></script>
</body>
</html>`;
const CSS = `*{box-sizing:border-box}html{background:#070b10}body{margin:0;background:radial-gradient(circle at 50% 0,#111923 0,#070b10 48%);color:#f3f5f7;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;min-height:100vh}.topbar{height:76px;border-bottom:1px solid #202833;display:flex;align-items:center;justify-content:space-between;padding:0 24px;max-width:1100px;margin:auto}.brand{display:flex;align-items:center;gap:11px;font-size:21px;font-weight:750}.brand-mark{width:35px;height:35px;border-radius:10px;background:#f2f4f6;color:#111820;display:grid;place-items:center;font-weight:900}.pill{font-size:10px;letter-spacing:1.5px;color:#99a5b4;border:1px solid #303946;border-radius:999px;padding:7px 10px}.shell{max-width:900px;margin:auto;padding:76px 22px 50px}.hero{text-align:center}.eyebrow{margin:0 0 10px;color:#8e9aaa;font-size:11px;font-weight:800;letter-spacing:2px}.hero h1{font-size:clamp(42px,8vw,72px);line-height:.98;letter-spacing:-3px;margin:0 0 18px}.sub{max-width:650px;margin:0 auto 34px;color:#9da8b6;line-height:1.6;font-size:16px}.card{background:rgba(13,18,25,.9);border:1px solid #293340;border-radius:18px;padding:22px;box-shadow:0 18px 60px rgba(0,0,0,.2);text-align:left}.card label{display:block;font-size:12px;color:#a7b1bf;font-weight:700;margin-bottom:9px}.input-row{display:flex;gap:10px}.input-row input{flex:1;min-width:0;background:#080d13;color:#fff;border:1px solid #394453;border-radius:12px;padding:16px;font-size:15px;outline:none}.input-row button,.download{border:0;border-radius:12px;padding:0 19px;background:#f1f3f5;color:#0a0e13;font-weight:800;white-space:nowrap;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;gap:10px}.input-row button{cursor:pointer}.hint,.legal{color:#778392;font-size:12px;line-height:1.5;margin:11px 2px 0}.result{margin-top:18px}.hidden{display:none}.result-head{display:flex;justify-content:space-between;align-items:flex-start;gap:15px}.result h2{margin:0;font-size:22px}.type-badge{border:1px solid #364151;border-radius:999px;padding:7px 10px;color:#b9c3cf;font-size:11px}.meta{margin:15px 0;color:#8e9aaa;font-size:13px;word-break:break-all}.options{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}.option{background:#0a1017;border:1px solid #293340;color:#c7ced7;border-radius:12px;padding:14px 10px;text-align:left;cursor:pointer}.option.active{border-color:#8e99a7;background:#151c25;color:#fff}.option b,.option small{display:block}.option b{font-size:13px}.option small{font-size:10px;color:#7d8998;margin-top:5px;line-height:1.3}.availability{font-size:12px;color:#8f9bab;min-height:30px;padding:15px 2px}.download{height:48px;width:100%}.error{margin-top:18px;border-color:#4a3131}.error b{font-size:16px}.error p{color:#9da8b6;font-size:13px;line-height:1.5}.error button{background:#161d26;color:#fff;border:1px solid #384453;border-radius:10px;padding:10px 15px;font-weight:700}.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:70px;text-align:left}.steps article{border-top:1px solid #27313d;padding:18px 5px}.steps span{font-size:10px;color:#7f8b9a;letter-spacing:1px}.steps h3{margin:8px 0 5px}.steps p{margin:0;color:#7e8997;font-size:13px;line-height:1.5}footer{max-width:900px;margin:auto;padding:30px 22px 55px;color:#9ba6b3;display:flex;justify-content:space-between;border-top:1px solid #202833;font-size:13px}footer small{color:#667281}@media(max-width:650px){.topbar{height:66px;padding:0 17px}.shell{padding:52px 16px 30px}.hero h1{letter-spacing:-2px}.input-row{display:block}.input-row input{width:100%}.input-row button{width:100%;height:48px;margin-top:9px}.options{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:1fr;margin-top:48px}footer{display:block;text-align:center}footer small{display:block;margin-top:8px}}`;
const JS = `const form=document.querySelector("#mediaForm"),urlInput=document.querySelector("#url"),result=document.querySelector("#result"),errorBox=document.querySelector("#error"),errorText=document.querySelector("#errorText"),errorTitle=document.querySelector("#errorTitle"),inspectBtn=document.querySelector("#inspectBtn"),retryBtn=document.querySelector("#retryBtn"),sourceName=document.querySelector("#sourceName"),sourceType=document.querySelector("#sourceType"),meta=document.querySelector("#meta"),availability=document.querySelector("#availability"),downloadBtn=document.querySelector("#downloadBtn"),options=[...document.querySelectorAll(".option")];let currentUrl="",currentInfo=null,currentKind="video";
function showError(t,m){result.classList.add("hidden");errorBox.classList.remove("hidden");errorTitle.textContent=t;errorText.textContent=m}function hideError(){errorBox.classList.add("hidden")}function filenameFromUrl(raw){try{const u=new URL(raw),p=u.pathname.split("/").filter(Boolean).pop();return p||"grabora-media"}catch{return"grabora-media"}}
function setKind(kind){currentKind=kind;options.forEach(b=>b.classList.toggle("active",b.dataset.kind===kind));if(!currentInfo)return;const allowed={video:["video/"],audio:["audio/"],thumbnail:["image/"],captions:["text/vtt","application/x-subrip","text/plain"]}[kind]||[];const ok=allowed.some(t=>currentInfo.contentType.startsWith(t));availability.textContent=ok?\`\${kind[0].toUpperCase()+kind.slice(1)} is available from this source.\`:\`\${kind[0].toUpperCase()+kind.slice(1)} is not detected at this URL. Grabora will not invent or convert a format.\`;downloadBtn.style.opacity=ok?"1":".45";downloadBtn.style.pointerEvents=ok?"auto":"none";downloadBtn.href=ok?\`/api/download?url=\${encodeURIComponent(currentUrl)}\`:"#"}
options.forEach(b=>b.addEventListener("click",()=>setKind(b.dataset.kind)));retryBtn.addEventListener("click",()=>form.requestSubmit());
form.addEventListener("submit",async e=>{e.preventDefault();hideError();result.classList.add("hidden");const raw=urlInput.value.trim();let u;try{u=new URL(raw)}catch{showError("Invalid URL","Please paste a complete http:// or https:// media URL.");return}if(!/^https?:$/.test(u.protocol)){showError("Unsupported URL","Only http:// and https:// sources are supported.");return}inspectBtn.disabled=true;inspectBtn.textContent="Checking…";try{const r=await fetch(\`/api/inspect?url=\${encodeURIComponent(raw)}\`),data=await r.json();if(!r.ok)throw new Error(data.error||"The source could not be inspected.");currentUrl=raw;currentInfo=data;sourceName.textContent=filenameFromUrl(raw);sourceType.textContent=data.contentType.split(";")[0]||"Unknown";meta.textContent=[data.contentType,data.contentLength?\`\${data.contentLength} bytes\`:null].filter(Boolean).join(" • ");result.classList.remove("hidden");setKind(data.contentType.startsWith("audio/")?"audio":data.contentType.startsWith("image/")?"thumbnail":data.contentType.includes("vtt")||data.contentType.includes("subrip")?"captions":"video")}catch(err){showError("Couldn’t inspect that source",err.message)}finally{inspectBtn.disabled=false;inspectBtn.innerHTML='Get Media <span>→</span>'}});
`;

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

function validTarget(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function withCors(headers={}) {
  const h = new Headers(headers);
  h.set("Access-Control-Allow-Origin", "*");
  return h;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, {headers: withCors()});

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, {headers: withCors({"content-type":"text/html; charset=utf-8"})});
    }
    if (url.pathname === "/style.css") {
      return new Response(CSS, {headers: withCors({"content-type":"text/css; charset=utf-8"})});
    }
    if (url.pathname === "/app.js") {
      return new Response(JS, {headers: withCors({"content-type":"application/javascript; charset=utf-8"})});
    }

    if (url.pathname === "/api/inspect") {
      const target = url.searchParams.get("url");
      if (!target || !validTarget(target)) return json({error:"A valid http/https media URL is required."},400);
      try {
        const upstream = await fetch(target, {method:"HEAD", redirect:"follow"});
        if (!upstream.ok) return json({error:`Source returned HTTP ${upstream.status}.`},502);
        const contentType = (upstream.headers.get("content-type") || "application/octet-stream").toLowerCase();
        const contentLength = upstream.headers.get("content-length");
        return json({ok:true, contentType, contentLength:contentLength ? Number(contentLength) : null, finalUrl:upstream.url});
      } catch {
        return json({error:"The source could not be reached. It may block server requests or require authorization."},502);
      }
    }

    if (url.pathname === "/api/download") {
      const target = url.searchParams.get("url");
      if (!target || !validTarget(target)) return new Response("Invalid source URL.",{status:400,headers:withCors()});
      try {
        const upstream = await fetch(target, {redirect:"follow"});
        if (!upstream.ok) return new Response(`Source returned HTTP ${upstream.status}.`,{status:502,headers:withCors()});
        const headers = withCors(upstream.headers);
        headers.set("Content-Disposition",'attachment; filename="grabora-media"');
        return new Response(upstream.body, {status:200,headers});
      } catch {
        return new Response("Unable to fetch the source.",{status:502,headers:withCors()});
      }
    }

    return new Response("Not found",{status:404,headers:withCors({"content-type":"text/plain"})});
  }
};
