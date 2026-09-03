(()=>{var Na=Object.defineProperty,$a=Object.defineProperties;var Ia=Object.getOwnPropertyDescriptors;var vn=Object.getOwnPropertySymbols;var Pa=Object.prototype.hasOwnProperty,za=Object.prototype.propertyIsEnumerable;var kn=(d,w,C)=>w in d?Na(d,w,{enumerable:!0,configurable:!0,writable:!0,value:C}):d[w]=C,de=(d,w)=>{for(var C in w||(w={}))Pa.call(w,C)&&kn(d,C,w[C]);if(vn)for(var C of vn(w))za.call(w,C)&&kn(d,C,w[C]);return d},Cn=(d,w)=>$a(d,Ia(w));(()=>{if(window.Uxnote)return;const d=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),w=t=>d?d.getAttribute(t):null,C=`${location.protocol}//${location.host}`,En=d&&(d.dataset.mailto||d.dataset.email||d.dataset.to)||"",Et=w("isToolVisibleAtFirstLaunch")||w("istoolvisibleatfirstlaunch")||d&&(d.dataset.isToolVisibleAtFirstLaunch||d.dataset.istoolvisibleatfirstlaunch),Tt=w("isToolOnTopAtLaunch")||w("istoolontopatlaunch")||d&&(d.dataset.isToolOnTopAtLaunch||d.dataset.istoolontopatlaunch),Tn=d&&(d.dataset.hiddentoolbydefault||d.dataset.hidden||d.dataset.collapsed||d.dataset.startHidden||""),Ln=w("colorForHighlight")||w("colorForHighligh")||d&&(d.dataset.colorForHighlight||d.dataset.colorForHighligh),Qn=w("colorForTextHighligh")||w("colorForTextHighlight")||d&&(d.dataset.colorForTextHighligh||d.dataset.colorForTextHighlight),Sn=w("colorForElementHighlight")||w("colorForElementHighligh")||d&&(d.dataset.colorForElementHighlight||d.dataset.colorForElementHighligh),An=w("colorForRegionHighlight")||d&&d.dataset.colorForRegionHighlight,Mn="#4e9cf6",Nn="#8b5cf6",$n="#f59f00",Lt=mt(Ln),pe=Lt||Mn,ue=Lt||Nn,In=ht(Qn||pe,pe),Pn=ht(Sn||ue,ue),he=Lt||$n,zn=ht(An||he,he),Qt={text:Dt(In,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:Dt(Pn,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:Dt(zn,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let v=Tt!=null?B(Tt,!1)?"top":"bottom":d&&d.dataset.position||"bottom";const me="wn-toolbar-pos",dt=d&&(d.dataset.dock||d.dataset.layout)||"",fe=`uxnote:site:${C}`,we=`uxnote:import-files:${C}`,ge=`uxnote:hidden:${C}`,St=`uxnote:pending:${C}`,xe=(d&&d.dataset.serverUrl||"").trim().replace(/\/+$/,""),k=xe?{url:xe,apiKey:d&&d.dataset.serverApiKey||""}:null,At=B(d&&d.dataset.jsonExport,!0),Mt=B(d&&d.dataset.jsonImport,!0),Rn=B(d&&d.dataset.mailExport,!0),Nt=(d&&d.dataset.theme||"").trim().toLowerCase(),$t=Nt==="light"||Nt==="dark"?Nt:"auto",It=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,Pt=window.matchMedia?window.matchMedia("(pointer: coarse) and (hover: none)"):null,zt=window.matchMedia?window.matchMedia("(max-width: 640px), (max-height: 480px)"):null;function F(){return Pt?Pt.matches:"ontouchstart"in window||navigator.maxTouchPoints>0}function I(){return zt?zt.matches:window.innerWidth<=640||window.innerHeight<=480}function Rt(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}const Hn=w("isBackdropVisible")||w("isbackdropvisible")||w("backdropVisible")||w("backdropvisible")||d&&(d.dataset.isBackdropVisible||d.dataset.isbackdropvisible||d.dataset.backdropVisible||d.dataset.backdropvisible||d.dataset.dim||d.dataset.dimpage||d.dataset.dimmer||d.dataset.overlay||d.dataset.dimLevel||d.dataset.dimlevel||d.dataset.dimstrength),On=.2,be=B(Hn,!F()),a={mode:null,annotations:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,selectionBar:null,selectionTimer:null,selectionRange:null,elementPicker:null,elementTrail:[],elementTrailIndex:0,toolbar:null,panel:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,markerLayer:null,syncDot:null,syncStatus:null,colors:Qt,customPosition:!1,dimEnabled:be,dimOpacity:be?On:0,dimOverlay:null,filters:{query:""},hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null};function ye(){const t=so();t&&(v=t);const e=lo(),n=Et!=null?!B(Et,!0):null;a.hidden=e!==null?e:n!==null?n:B(Tn,!1),Mt&&(a.importFiles=mo()),ve(),po(),Ne(),Bn(),jn(),Vn(),ft(a.hidden),k?le():fo(),at(),ne(),We(),Jo(),k||dn(),ao()}function ve(){const t=getComputedStyle(document.body);a.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function Bn(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
      .wn-annotator * { box-sizing: border-box; }
      :root {
        --wn-text-highlight: #4e9cf6;
        --wn-text-highlight-overlay: rgba(78, 156, 246, 0.2);
        --wn-text-highlight-soft: rgba(78, 156, 246, 0.12);
        --wn-element-highlight: #8b5cf6;
        --wn-element-highlight-soft: rgba(139, 92, 246, 0.12);
        --wn-element-highlight-soft-end: rgba(139, 92, 246, 0.04);
        --wn-element-highlight-strong: rgba(139, 92, 246, 0.9);
        --wn-element-highlight-shadow: rgba(139, 92, 246, 0.24);
        --wn-shot-frame: #f59f00;
        --wn-marker-text: #ffffff;
        --wn-accent: #6d56c7;
        --wn-surface: #f6f2fb;
        --wn-surface-raised: #fdfcff;
        --wn-surface-input: #ffffff;
        --wn-text: #342d43;
        --wn-text-muted: #5a5266;
        --wn-text-faint: #7b7588;
        --wn-border: rgba(109, 86, 199, 0.18);
        --wn-shadow: rgba(73, 64, 157, 0.16);
        --wn-backdrop: rgba(28, 22, 48, 0.45);
        --wn-danger: #b83232;
      }
      :root[data-wn-theme="dark"] {
        --wn-surface: #1e1a2e;
        --wn-surface-raised: #262138;
        --wn-surface-input: #15121f;
        --wn-text: #ece8f6;
        --wn-text-muted: #b8b1c9;
        --wn-text-faint: #958ea6;
        --wn-border: rgba(196, 184, 255, 0.2);
        --wn-shadow: rgba(0, 0, 0, 0.45);
        --wn-backdrop: rgba(0, 0, 0, 0.6);
        --wn-danger: #f08c8c;
      }
      /* Native controls inside the chrome follow the theme; the page keeps its own. */
      :root[data-wn-theme="dark"] .wn-annot-panel,
      :root[data-wn-theme="dark"] .wn-annot-modal,
      :root[data-wn-theme="dark"] .wn-annot-sheet,
      :root[data-wn-theme="dark"] .wn-annot-actionbar,
      :root[data-wn-theme="dark"] .wn-shot-lightbox {
        color-scheme: dark;
      }
      .wn-annot-toolbar {
        --wn-icon-font: "SF Pro Symbols", "SF Pro Display", "SF Pro Text", -apple-system, system-ui, "Segoe UI", "Inter", sans-serif;
        --wn-group-gap: 12px;
        --wn-spacer: 50px;
        position: fixed;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        padding: 10px 14px;
        background: var(--wn-surface);
        color: var(--wn-text-muted);
        z-index: 2147483647;
        font-family: var(--wn-icon-font);
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        /* Centred on left: 50% with no width of its own, the bar can only ever
           be half the viewport wide, so it wraps long before it runs out of
           room. It asks for the width of its row instead, and gives that up
           only against the edges of the viewport. */
        width: max-content;
        /* Percent, not vw. A fixed box is positioned against the initial
           containing block, and on a host page that overflows horizontally
           that block is wider than 100vw -- so a bar sized in vw and centred
           on it is not centred on the screen. */
        max-width: calc(100% - 28px);
        box-shadow: 0 8px 24px var(--wn-shadow);
        border-radius: 999px;
        border: 1px solid var(--wn-border);
        backdrop-filter: blur(10px);
      }
      .wn-annot-toolbar button {
        border: none;
        background: transparent;
        color: var(--wn-text-muted);
        padding: 0;
        cursor: pointer;
        font-size: 0;
        --wn-btn-size: 44px;
        width: var(--wn-btn-size);
        height: var(--wn-btn-size);
        min-width: var(--wn-btn-size);
        max-width: var(--wn-btn-size);
        min-height: var(--wn-btn-size);
        max-height: var(--wn-btn-size);
        aspect-ratio: 1 / 1;
        flex: 0 0 var(--wn-btn-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        transition: all 0.2s ease;
        border-radius: 50%;
        box-shadow: none;
      }
      .wn-annot-visibility-btn {
        position: fixed;
        left: max(12px, env(safe-area-inset-left));
        bottom: max(18px, env(safe-area-inset-bottom));
        --wn-btn-size: 55px;
        width: var(--wn-btn-size);
        height: var(--wn-btn-size);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid var(--wn-border);
        background: var(--wn-surface);
        color: var(--wn-text-muted);
        box-shadow: 0 8px 24px var(--wn-shadow);
        backdrop-filter: blur(10px);
        cursor: pointer;
        transition: all 0.2s ease;
        z-index: 2147483650;
        padding: 0;
        position: fixed;
      }
      /* Without a hover stream the tooltip never opens, so on touch it is only
         a box the layout has to carry. It is drawn where hover exists. */
      @media (hover: hover) {
        .wn-annot-visibility-btn::after {
          content: attr(data-tip);
          position: absolute;
          left: 2px;
          bottom: calc(100% + 10px);
          background: rgba(35, 31, 74, 0.92);
          color: #fff;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transform: translateY(2px);
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .wn-annot-visibility-btn:hover::after { opacity: 1; transform: translateY(0); }
      }
      .wn-annot-visibility-btn:hover {
        background: rgba(109, 86, 199, 0.12);
        color: var(--wn-text);
      }
      .wn-annot-visibility-btn:active {
        background: rgba(109, 86, 199, 0.18);
      }
      .wn-annot-visibility-btn svg {
        width: 20px;
        height: 20px;
      }
      .wn-annot-visibility-btn.is-muted {
        opacity: 0.32;
      }
      .wn-annot-group {
        display: inline-flex;
        align-items: center;
        gap: var(--wn-group-gap);
      }
      .wn-annot-spacer {
        flex: 0 0 var(--wn-spacer);
        width: var(--wn-spacer);
        height: 1px;
      }
      .wn-annot-logo {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding-left: 15px;
        padding-right: 0px;
      }
      .wn-annot-logo svg {
        width: 94px;
        height: auto;
        fill: currentColor;
      }
      .wn-annot-toolbar button:hover {
        background: rgba(109, 86, 199, 0.12);
        color: var(--wn-text);
      }
      .wn-annot-toolbar button:active {
        background: rgba(109, 86, 199, 0.18);
      }
      .wn-annot-toolbar button.active {
        background: var(--wn-accent);
        color: #fdfdff;
        box-shadow: 0 10px 24px rgba(109, 86, 199, 0.35);
        transform: translateY(0);
      }
      body.wn-annot-hidden .wn-annotator:not(.wn-annot-visibility-btn) {
        display: none !important;
      }
      body.wn-annot-hidden .uxnote-textmark {
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 !important;
        border-radius: 0 !important;
        pointer-events: none !important;
      }
      body.wn-annot-hidden .uxnote-annotated {
        outline: none !important;
        box-shadow: none !important;
      }
      body.wn-annot-hidden .wn-annot-visibility-btn {
        opacity: 0.26;
      }
      .wn-annot-icon {
        width: 20px;
        height: 20px;
        fill: none;
        stroke: currentColor;
        font-family: var(--wn-icon-font);
      }
      .wn-annot-img {
        width: 20px;
        height: 20px;
        object-fit: contain;
        display: block;
      }
      .wn-annot-logo-img {
        width: 94px;
        height: auto;
        object-fit: contain;
        display: block;
      }
      .wn-annot-label { display: none; }
      .wn-annot-btn {
        position: relative;
      }
      @media (hover: hover) {
        .wn-annot-btn::after {
          content: attr(data-tip);
          position: absolute;
          left: 50%;
          background: rgba(35, 31, 74, 0.92);
          color: #fff;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 11px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .wn-annot-toolbar.wn-pos-bottom .wn-annot-btn::after {
          bottom: calc(100% + 10px);
          transform: translateX(-50%) translateY(2px);
        }
        .wn-annot-toolbar.wn-pos-top .wn-annot-btn::after {
          top: calc(100% + 10px);
          transform: translateX(-50%) translateY(-2px);
        }
        .wn-annot-btn:hover::after {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
      .wn-annot-sync-dot {
        position: relative;
        flex: 0 0 auto;
        width: 10px;
        height: 10px;
        margin-left: 10px;
        border-radius: 50%;
        background: #8b8794;
        box-shadow: 0 0 0 3px rgba(139, 135, 148, 0.18);
        transition: background 0.2s ease, box-shadow 0.2s ease;
      }
      .wn-annot-sync-dot[data-sync-status='ok'] {
        background: #2ea043;
        box-shadow: 0 0 0 3px rgba(46, 160, 67, 0.22);
      }
      .wn-annot-sync-dot[data-sync-status='refused'] {
        background: #d29922;
        box-shadow: 0 0 0 3px rgba(210, 153, 34, 0.24);
      }
      .wn-annot-sync-dot[data-sync-status='unreachable'] {
        background: #e5534b;
        box-shadow: 0 0 0 3px rgba(229, 83, 75, 0.24);
      }
      /* The dot sits at the left end of the bar, so its tooltip hangs from
         that end rather than centring on a 10px target and running off the
         edge of the screen. */
      .wn-annot-sync-dot::after {
        content: attr(data-tip);
        position: absolute;
        left: -8px;
        background: rgba(35, 31, 74, 0.92);
        color: #fff;
        padding: 6px 8px;
        border-radius: 8px;
        font-size: 11px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.12s ease, transform 0.12s ease;
      }
      .wn-annot-toolbar.wn-pos-bottom .wn-annot-sync-dot::after {
        bottom: calc(100% + 10px);
        transform: translateY(2px);
      }
      .wn-annot-toolbar.wn-pos-top .wn-annot-sync-dot::after {
        top: calc(100% + 10px);
        transform: translateY(-2px);
      }
      .wn-annot-sync-dot:hover::after {
        opacity: 1;
        transform: translateY(0);
      }
      .wn-annot-toolbar.wn-pos-right {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        top: auto;
        bottom: 18px;
        flex-direction: row;
        border-radius: 32px;
      }
      .wn-annot-toolbar.wn-pos-right button,
      .wn-annot-toolbar.wn-pos-left button {
        width: 100%;
      }
      .wn-annot-toolbar.wn-pos-left {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        top: auto;
        bottom: 18px;
        flex-direction: row;
        border-radius: 32px;
      }
      .wn-annot-toolbar.wn-pos-top {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        top: 18px;
        bottom: auto;
        flex-direction: row;
        justify-content: center;
        border-radius: 32px;
      }
      .wn-annot-toolbar.wn-pos-bottom {
        bottom: 18px;
        left: 50%;
        right: auto;
        top: auto;
        transform: translateX(-50%);
        flex-direction: row;
        justify-content: center;
        border-radius: 32px;
      }
      /* One shell for every surface that is a panel or a dialog on a compact
         layout. Everything here is inert on a desktop: the rules that make it
         a sheet live in the compact media query at the end of this sheet, so
         a wide window keeps its side panel and its centred modals. */
      .wn-annot-sheet-grip {
        display: none;
        position: relative;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        height: 44px;
        /* The gesture is ours; without this the browser pans the page instead. */
        touch-action: none;
      }
      .wn-annot-sheet-handle {
        display: block;
        width: 44px;
        height: 5px;
        border-radius: 999px;
        background: var(--wn-border);
      }
      .wn-annot-sheet-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 44px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: none;
        border-radius: 999px;
        background: transparent;
        color: var(--wn-text-muted);
        cursor: pointer;
      }
      .wn-annot-sheet-close:hover {
        background: rgba(109, 86, 199, 0.12);
        color: var(--wn-text);
      }
      .wn-annot-sheet-close svg {
        width: 20px;
        height: 20px;
      }
      .wn-annot-panel {
        position: fixed;
        top: 18px;
        right: 18px;
        bottom: 18px;
        width: min(360px, calc(100% - 36px));
        max-height: calc(100vh - 36px);
        /* On iOS Safari 100vh is the tall viewport, so a panel measured in it
           runs under the browser's own bottom bar. dvh is the one on screen. */
        max-height: calc(100dvh - 36px);
        background: var(--wn-surface-raised);
        color: var(--wn-text);
        border: 1px solid var(--wn-border);
        border-radius: 18px;
        box-shadow: 0 10px 26px var(--wn-shadow);
        padding: 18px;
        overflow-y: auto;
        z-index: 2147483000;
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        left: auto;
        display: flex;
        flex-direction: column;
      }
      .wn-annot-panel h3 {
        margin: 0 0 14px;
        font-size: 15px;
        letter-spacing: 0.2px;
        color: var(--wn-text);
        font-weight: 700;
      }
      .wn-annot-panel-head {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .wn-annot-panel-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
      }
      .wn-annot-filters {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 12px;
      }
      .wn-annot-filter-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .wn-annot-filters input[type="search"] {
        height: 34px;
        border-radius: 12px;
        border: 1px solid var(--wn-border);
        background: var(--wn-surface-input);
        padding: 6px 10px;
        font-size: 12px;
        color: var(--wn-text);
      }
      .wn-annot-filter-row input[type="search"] {
        width: 100%;
      }
      .wn-annot-filters input[type="search"]:focus {
        outline: none;
        border-color: rgba(109, 86, 199, 0.6);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.14);
      }
      .wn-annot-panel .wn-annot-empty {
        color: var(--wn-text-faint);
        font-size: 13px;
        padding: 10px 0;
        background: rgba(109, 86, 199, 0.04);
        border: 1px dashed var(--wn-border);
        border-radius: 12px;
        text-align: center;
      }
      .wn-annot-panel-tools {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      /* The bar has no room for export on compact, so the panel carries it
         there, beside the delete-all it already holds. */
      .wn-annot-panel-export {
        display: none;
        align-items: center;
        gap: 6px;
        background: rgba(109, 86, 199, 0.12);
        border: 1px solid var(--wn-border);
        color: var(--wn-text-muted);
        padding: 6px 10px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-panel-export:hover {
        background: rgba(109, 86, 199, 0.18);
        color: var(--wn-text);
      }
      .wn-annot-panel-export:active {
        transform: translateY(1px);
      }
      .wn-annot-panel-export svg {
        width: 16px;
        height: 16px;
      }
      .wn-annot-delete-all {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(209, 59, 59, 0.1);
        border: 1px solid rgba(209, 59, 59, 0.25);
        color: var(--wn-danger);
        padding: 6px 10px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-delete-all:hover {
        background: rgba(209, 59, 59, 0.16);
        border-color: rgba(209, 59, 59, 0.32);
      }
      .wn-annot-delete-all:active {
        transform: translateY(1px);
      }
      .wn-annot-delete-all svg {
        width: 16px;
        height: 16px;
      }
      .wn-annot-list {
        flex: 1 1 auto;
        overflow: auto;
        padding-top: 8px;
        padding-bottom: 4px;
      }
      .wn-annot-item {
        background: var(--wn-surface-raised);
        border: 1px solid var(--wn-border);
        border-radius: 14px;
        padding: 10px 12px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        box-shadow: 0 2px 8px var(--wn-shadow);
      }
      .wn-annot-item:hover {
        border-color: rgba(109, 86, 199, 0.32);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px var(--wn-shadow);
      }
      .wn-annot-item.is-focused {
        border-color: var(--wn-item-accent-strong, var(--wn-element-highlight-strong));
        box-shadow: 0 6px 16px var(--wn-item-accent-shadow, var(--wn-element-highlight-shadow));
        background: linear-gradient(
          180deg,
          var(--wn-item-accent-soft, var(--wn-element-highlight-soft)),
          var(--wn-item-accent-soft-end, var(--wn-element-highlight-soft-end))
        );
        transform: translateY(-1px);
      }
      .wn-annot-card-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 8px;
      }
      .wn-annot-card-top-left {
        display: inline-flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        row-gap: 4px;
        min-width: 0;
      }
      .wn-annot-card-top-right {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        margin-left: auto;
        min-width: 0;
      }
      .wn-annot-delete {
        border: 1px solid rgba(209, 59, 59, 0.2);
        background: rgba(209, 59, 59, 0.08);
        color: var(--wn-danger);
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-delete:hover {
        background: rgba(209, 59, 59, 0.14);
        border-color: rgba(209, 59, 59, 0.3);
        color: var(--wn-danger);
      }
      .wn-annot-delete:active {
        transform: translateY(1px);
      }
      .wn-annot-edit {
        border: 1px solid var(--wn-border);
        background: rgba(109, 86, 199, 0.08);
        color: var(--wn-text-muted);
        width: 28px;
        height: 28px;
        border-radius: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-edit:hover {
        background: rgba(109, 86, 199, 0.14);
        border-color: rgba(109, 86, 199, 0.3);
        color: var(--wn-text);
      }
      .wn-annot-edit:active {
        transform: translateY(1px);
      }
      .wn-annot-edit svg {
        width: 16px;
        height: 16px;
      }
      .wn-annot-delete svg {
        width: 16px;
        height: 16px;
      }
      .wn-annot-footer {
        flex: 0 0 auto;
        padding-top: 6px;
        margin-top: auto;
        text-align: center;
        font-size: 12px;
        color: var(--wn-text-faint);
        background: linear-gradient(180deg, transparent, var(--wn-surface-raised));
        position: sticky;
        bottom: 0;
        padding-bottom: 6px;
      }
      .wn-annot-footer a {
        color: inherit;
        text-decoration: none;
        font-weight: 700;
      }
      .wn-annot-number {
        min-width: 26px;
        height: 22px;
        padding: 0 8px;
        border-radius: 8px;
        background: var(--wn-item-number-bg, rgba(109, 86, 199, 0.12));
        border: 1px solid var(--wn-item-number-border, rgba(109, 86, 199, 0.24));
        color: var(--wn-text);
        font-weight: 800;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.2px;
      }
      .wn-annot-meta {
        font-size: 11px;
        color: var(--wn-text-faint);
        text-transform: uppercase;
        letter-spacing: 0.3px;
        max-width: 220px;
        text-align: left;
        white-space: nowrap;
        line-height: 1.4;
      }
      .wn-annot-missing {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        color: var(--wn-danger);
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(224, 91, 91, 0.35);
        background: rgba(224, 91, 91, 0.12);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .wn-annot-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--wn-text);
        margin-bottom: 8px;
      }
      .wn-annot-comment {
        font-size: 12px;
        color: var(--wn-text-muted);
        background: rgba(109, 86, 199, 0.06);
        border: 1px dashed rgba(109, 86, 199, 0.3);
        border-radius: 12px;
        padding: 8px 10px;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        line-height: 1.5;
        margin-bottom: 0;
        transition: max-height 0.2s ease;
      }
      .wn-annot-comment.expanded {
        -webkit-line-clamp: unset;
      }
      .wn-annot-showmore {
        border: none;
        background: transparent;
        color: var(--wn-accent);
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        margin-left: auto;
        margin-top: 4px;
      }
      .uxnote-textmark {
        display: inline;
        background: var(--wn-text-highlight-overlay, rgba(78,156,246,0.2));
        border: none;
        box-shadow: none;
        padding: 0;
        border-radius: 2px;
        cursor: pointer;
        position: relative;
      }
      .uxnote-annotated {
        outline: 2px solid var(--wn-element-highlight, #8b5cf6);
        outline-offset: 2px;
        box-shadow: 0 0 0 3px var(--wn-element-highlight-soft, rgba(139,92,246,0.08));
      }
      .wn-annot-marker-layer {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .wn-annot-marker {
        position: absolute;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        background: var(--wn-marker-bg, var(--wn-element-highlight));
        color: var(--wn-marker-text, #0b1622);
        font-weight: 700;
        font-size: 11px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        box-shadow: 0 10px 25px var(--wn-marker-shadow, rgba(0,0,0,0.25));
        cursor: pointer;
        transform: translate(-50%, -50%);
      }
      .wn-annot-marker:hover { background: var(--wn-marker-bg, var(--wn-element-highlight)); filter: brightness(1.05); }
      .wn-annot-outline {
        position: absolute;
        border: 2px dashed var(--wn-element-highlight, #8b5cf6);
        background: var(--wn-element-highlight-soft, rgba(139,92,246,0.1));
        pointer-events: none;
        z-index: 2147482800;
      }
      .wn-annot-toast {
        position: fixed;
        left: 50%;
        bottom: 26px;
        transform: translateX(-50%);
        background: var(--wn-surface);
        color: var(--wn-text);
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        border: 1px solid var(--wn-border);
        box-shadow: 0 12px 28px var(--wn-shadow);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
        z-index: 2147483200;
      }
      .wn-annot-toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
      }
      .wn-annot-tip {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        background: var(--wn-surface);
        color: var(--wn-text);
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        z-index: 2147483100;
        pointer-events: none;
        opacity: 0;
        border: 1px solid var(--wn-border);
        box-shadow: 0 10px 24px var(--wn-shadow);
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .wn-annot-tip.show { opacity: 1; }
      .wn-annot-dimmer {
        position: fixed;
        inset: 0;
        background: rgba(18, 14, 32, var(--wn-dim-opacity, 0.2));
        z-index: 2147481200;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
      }
      .wn-annot-dimmer.is-visible { opacity: 1; }
      .wn-annot-modal-backdrop {
        position: fixed;
        inset: 0;
        background: var(--wn-backdrop);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2147483200;
        padding: 18px;
      }
      .wn-annot-modal-backdrop.show { display: flex; }
      .wn-annot-modal {
        background: var(--wn-surface);
        color: var(--wn-text);
        border: 1px solid var(--wn-border);
        border-radius: 16px;
        box-shadow: 0 16px 38px var(--wn-shadow);
        padding: 18px;
        min-width: min(440px, 100%);
        max-width: 520px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
      }
      .wn-annot-modal h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 700;
        color: var(--wn-text);
      }
      .wn-annot-comment-card {
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        min-width: 0;
        width: min(420px, calc(100% - 36px));
        max-width: 420px;
      }
      /* The card is parked over the page it is about, so it is translucent
         until it is pointed at -- hover alone, because the textarea holds
         focus for the whole life of the card. Both halves want a pointer that
         can hover. Without one the card never came back, and the page read
         straight through the comment being written. */
      @media (hover: hover) {
        .wn-annot-comment-card {
          opacity: 0.55;
          transition: opacity 0.15s ease;
        }
        .wn-annot-comment-card:hover {
          opacity: 1;
        }
      }
      .wn-annot-dialog-message {
        font-size: 13px;
        line-height: 1.6;
        color: var(--wn-text);
      }
      .wn-annot-modal textarea {
        width: 100%;
        min-height: 90px;
        border-radius: 12px;
        border: 1px solid var(--wn-border);
        background: var(--wn-surface-input);
        padding: 10px 12px;
        font-size: 14px;
        color: var(--wn-text);
        resize: vertical;
        outline: none;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
      }
      .wn-annot-modal textarea:focus {
        border-color: rgba(109, 86, 199, 0.55);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.15);
      }
      .wn-annot-import-modal {
        min-width: min(760px, 100%);
        max-width: 960px;
      }
      .wn-annot-import-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .wn-annot-import-drop {
        position: relative;
        display: block;
        border: 1.5px dashed rgba(109, 86, 199, 0.32);
        border-radius: 14px;
        padding: 14px;
        background: linear-gradient(135deg, rgba(109, 86, 199, 0.08), var(--wn-surface));
        cursor: pointer;
        transition: border 0.2s ease, transform 0.2s ease;
      }
      .wn-annot-import-drop:hover {
        transform: translateY(-1px);
        border-color: rgba(109, 86, 199, 0.6);
      }
      .wn-annot-import-drop.dragover {
        border-color: rgba(109, 86, 199, 0.9);
        background: linear-gradient(135deg, rgba(109, 86, 199, 0.16), var(--wn-surface));
      }
      .wn-annot-import-drop input {
        position: absolute;
        inset: 0;
        opacity: 0;
        cursor: pointer;
      }
      .wn-annot-import-drop-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--wn-text);
      }
      .wn-annot-import-drop-sub {
        font-size: 12px;
        color: var(--wn-text-muted);
        margin-top: 4px;
      }
      .wn-annot-import-panel {
        border: 1px solid var(--wn-border);
        border-radius: 14px;
        padding: 12px;
        background: var(--wn-surface-input);
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 220px;
      }
      .wn-annot-import-panel h5 {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        color: var(--wn-text);
      }
      .wn-annot-import-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .wn-annot-import-count {
        background: rgba(109, 86, 199, 0.16);
        color: var(--wn-text-muted);
        border-radius: 999px;
        padding: 4px 8px;
        font-weight: 600;
        font-size: 11px;
        border: 1px solid var(--wn-border);
      }
      .wn-annot-import-panel p {
        margin: 0;
        font-size: 12px;
        color: var(--wn-text-muted);
      }
      .wn-annot-import-list {
        display: grid;
        gap: 8px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 4px;
      }
      .wn-annot-import-card {
        border: 1px solid var(--wn-border);
        background: var(--wn-surface);
        border-radius: 12px;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
        width: 100%;
        min-width: 0;
      }
      .wn-annot-import-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
      }
      .wn-annot-import-name {
        font-size: 13px;
        font-weight: 600;
        color: var(--wn-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .wn-annot-import-sub {
        font-size: 11px;
        color: var(--wn-text-muted);
        font-family: "SF Mono", "SFMono-Regular", ui-monospace, monospace;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .wn-annot-import-actions {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .wn-annot-import-badge {
        background: rgba(109, 86, 199, 0.16);
        color: var(--wn-text-muted);
        border-radius: 999px;
        padding: 4px 8px;
        font-weight: 600;
        font-size: 11px;
        border: 1px solid var(--wn-border);
      }
      .wn-annot-import-remove {
        border: 1px solid rgba(209, 59, 59, 0.35);
        background: rgba(209, 59, 59, 0.12);
        color: var(--wn-danger);
        width: 26px;
        height: 26px;
        padding: 0;
        border-radius: 50%;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .wn-annot-import-empty {
        font-size: 12px;
        color: var(--wn-text-muted);
        border: 1px dashed var(--wn-border);
        border-radius: 10px;
        padding: 10px;
        text-align: center;
      }
      .wn-annot-modal .wn-annot-actions {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
      .wn-annot-modal .wn-annot-pill {
        border: none;
        padding: 10px 14px;
        border-radius: 999px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .wn-annot-modal .wn-annot-pill.cancel {
        background: transparent;
        color: var(--wn-text-muted);
        border: 1px solid var(--wn-border);
      }
      .wn-annot-modal .wn-annot-pill.cancel:hover {
        background: rgba(109, 86, 199, 0.08);
      }
      .wn-annot-modal .wn-annot-pill.primary {
        background: var(--wn-accent);
        color: #fdfdff;
        box-shadow: 0 10px 24px rgba(109, 86, 199, 0.35);
      }
      .wn-annot-modal .wn-annot-pill.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 28px rgba(109, 86, 199, 0.4);
      }
      .wn-annot-modal .wn-annot-pill.secondary {
        background: rgba(109, 86, 199, 0.12);
        color: var(--wn-text-muted);
        border: 1px solid var(--wn-border);
      }
      .wn-annot-modal .wn-annot-pill.secondary:hover {
        background: rgba(109, 86, 199, 0.18);
      }
      .wn-annot-shot-frame {
        position: absolute;
        box-sizing: border-box;
        border: 2px dashed var(--wn-shot-frame, #f59f00);
        border-radius: 6px;
        pointer-events: none;
      }
      .wn-shot-overlay {
        position: fixed;
        inset: 0;
        cursor: crosshair;
        z-index: 2147483651;
      }
      .wn-shot-rect {
        position: absolute;
        box-sizing: border-box;
        border: 2px solid var(--wn-accent);
        border-radius: 4px;
        /* The dim outside the frame is one huge spread, so no second element
           has to track the four bands around the rectangle. */
        box-shadow: 0 0 0 100000px rgba(18, 14, 32, 0.45);
      }
      .wn-shot-hint {
        position: fixed;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px 8px 16px;
        background: var(--wn-surface);
        color: var(--wn-text);
        font: 12px/1.4 "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        border: 1px solid var(--wn-border);
        border-radius: 999px;
        box-shadow: 0 12px 28px var(--wn-shadow);
        z-index: 2147483652;
      }
      .wn-shot-hint button {
        border: 1px solid var(--wn-border);
        border-radius: 999px;
        padding: 6px 14px;
        font: inherit;
        font-weight: 600;
        background: var(--wn-surface-input);
        color: var(--wn-text);
        cursor: pointer;
      }
      .wn-annot-shot {
        margin: 8px 0 4px;
      }
      .wn-annot-shot img {
        display: block;
        max-width: 100%;
        max-height: 140px;
        border: 1px solid var(--wn-border);
        border-radius: 10px;
        cursor: zoom-in;
      }
      .wn-shot-lightbox {
        position: fixed;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(18, 14, 32, 0.82);
        cursor: zoom-out;
        z-index: 2147483653;
      }
      .wn-shot-lightbox img {
        max-width: 92%;
        max-height: 92vh;
        max-height: 92dvh;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
      }
      /* Escape closed this and nothing else did. There is no Escape on a
         phone, and a full-screen image gives no clue that it is dismissable. */
      .wn-shot-lightbox-close {
        position: absolute;
        top: max(12px, env(safe-area-inset-top));
        right: max(12px, env(safe-area-inset-right));
        width: 44px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 1px solid var(--wn-border);
        border-radius: 999px;
        background: var(--wn-surface);
        color: var(--wn-text);
        cursor: pointer;
      }
      .wn-shot-lightbox-close svg {
        width: 22px;
        height: 22px;
      }

      /* The two bars a finger drives a capture from, both raised just clear of
         the toolbar and never anchored to the selection: iOS puts its own
         Copy / Look Up callout directly above one, and that is a fight nobody
         wins. Neither bar is built where a pointer can hover -- there the
         release commits a highlight and the hover previews an element. */
      .wn-annot-actionbar {
        position: fixed;
        left: max(10px, env(safe-area-inset-left));
        right: max(10px, env(safe-area-inset-right));
        display: none;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px;
        background: var(--wn-surface);
        color: var(--wn-text);
        border: 1px solid var(--wn-border);
        border-radius: 18px;
        box-shadow: 0 12px 28px var(--wn-shadow);
        font: 13px/1.4 "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        /* Above the notes panel, below the comment sheet that answers it. */
        z-index: 2147483150;
      }
      .wn-annot-actionbar.show { display: flex; }
      .wn-annot-actionbar button {
        flex: 1 1 auto;
        min-height: 48px;
        min-width: 48px;
        padding: 10px 12px;
        border: 1px solid var(--wn-border);
        border-radius: 14px;
        background: var(--wn-surface-input);
        color: var(--wn-text);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }
      .wn-annot-actionbar button.primary {
        background: var(--wn-accent);
        border-color: var(--wn-accent);
        color: #fdfdff;
      }
      .wn-annot-actionbar button[disabled] {
        opacity: 0.4;
        cursor: default;
      }
      /* The name of the element under the finger takes a row of its own: three
         thumb-sized controls already fill the width of a 320px screen. */
      .wn-annot-pick-name {
        flex: 1 0 100%;
        min-width: 0;
        text-align: center;
        font-weight: 600;
        color: var(--wn-text-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* How much room the layout has. Both arms carry weight: every phone in
         landscape is wider than 640px, so the width arm alone leaves it on the
         desktop layout with a bar that eats a fifth of the screen. */
      @media (max-width: 640px), (max-height: 480px) {
        /* A media query adds no specificity, so a rule naming the toolbar
           class alone loses to the two-class .wn-pos-* rules above and the bar
           stays centre-anchored. These name the position classes and come last
           on purpose; keep this block at the end of the sheet. */
        .wn-annot-toolbar.wn-pos-bottom,
        .wn-annot-toolbar.wn-pos-top,
        .wn-annot-toolbar.wn-pos-left,
        .wn-annot-toolbar.wn-pos-right {
          /* Insets, never a width in vw: on a host page that overflows
             horizontally the containing block is wider than the screen, and a
             bar sized in vw and centred on it walks off one edge. */
          left: max(8px, env(safe-area-inset-left));
          right: max(8px, env(safe-area-inset-right));
          transform: none;
          width: auto;
          max-width: none;
          gap: 4px;
          padding: 6px 8px;
          flex-wrap: nowrap;
          overflow: visible;
          border-radius: 32px;
        }
        .wn-annot-toolbar.wn-pos-bottom,
        .wn-annot-toolbar.wn-pos-left,
        .wn-annot-toolbar.wn-pos-right {
          top: auto;
          bottom: max(12px, env(safe-area-inset-bottom));
        }
        .wn-annot-toolbar.wn-pos-top {
          bottom: auto;
          top: max(12px, env(safe-area-inset-top));
        }
        .wn-annot-toolbar button {
          --wn-btn-size: 48px;
        }
        .wn-annot-group {
          gap: 4px;
        }
        /* The spacers do the spreading, so five controls sit evenly across the
           bar and give up their room first when there is little of it. */
        .wn-annot-spacer {
          display: block;
          flex: 1 1 auto;
          width: auto;
          min-width: 4px;
        }
        .wn-annot-logo {
          display: none;
        }
        body:not(.wn-annot-hidden) .wn-annot-toolbar .wn-annot-visibility-btn {
          position: static;
          top: auto;
          bottom: auto;
          left: auto;
          right: auto;
          border: none;
          background: transparent;
          box-shadow: none;
        }
        body.wn-annot-hidden .wn-annot-visibility-btn {
          opacity: 0.7;
          background: var(--wn-surface);
          border-color: var(--wn-border);
          box-shadow: 0 6px 16px var(--wn-shadow);
        }
        .wn-annot-panel-export {
          display: inline-flex;
        }

        /* The sheet. Insets rather than a width, because a host page that
           overflows horizontally makes the containing block wider than the
           screen. The bottom clears the toolbar, which paints above every one
           of these and used to sit on the panel's own footer with no way to
           move either. */
        .wn-annot-sheet {
          position: fixed;
          left: 0;
          right: 0;
          top: auto;
          bottom: var(--wn-sheet-bottom, 0px);
          width: auto;
          min-width: 0;
          max-width: none;
          height: auto;
          transform: none;
          opacity: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-radius: 18px 18px 0 0;
          border-bottom: none;
          overflow: hidden;
          overscroll-behavior: contain;
          padding-top: 8px;
          padding-left: max(16px, env(safe-area-inset-left));
          padding-right: max(16px, env(safe-area-inset-right));
          padding-bottom: max(18px, env(safe-area-inset-bottom));
          /* 85% of the viewport, and never more room than the toolbar leaves.
             dvh is the viewport that is on the screen; where it is not
             understood the declaration above it stands. */
          max-height: min(85vh, calc(100vh - var(--wn-sheet-bottom, 0px) - var(--wn-sheet-top-guard, 0px)));
          max-height: min(85dvh, calc(100dvh - var(--wn-sheet-bottom, 0px) - var(--wn-sheet-top-guard, 0px)));
        }
        .wn-annot-sheet-grip {
          display: flex;
        }
        /* The sheet holds its own edges and the list scrolls inside it. */
        .wn-annot-panel.wn-annot-sheet .wn-annot-list {
          overflow-y: auto;
          overscroll-behavior: contain;
          -webkit-overflow-scrolling: touch;
        }
        .wn-annot-modal.wn-annot-sheet .wn-annot-actions {
          justify-content: stretch;
        }
        .wn-annot-modal.wn-annot-sheet .wn-annot-pill {
          flex: 1 1 0;
          min-height: 48px;
        }
        .wn-annot-modal.wn-annot-sheet textarea {
          flex: 0 1 auto;
        }
      }

      /* What kind of input is driving the widget. A finger has the same reach
         on a tablet as on a phone, and a mouse in a narrow window keeps its
         precision, so this is not a question of width. */
      @media (pointer: coarse) and (hover: none) {
        .wn-annot-marker {
          width: 44px;
          height: 44px;
          font-size: 15px;
        }
        .wn-annot-edit,
        .wn-annot-delete {
          width: 44px;
          height: 44px;
        }
        .wn-annot-edit svg,
        .wn-annot-delete svg {
          width: 18px;
          height: 18px;
        }
        .wn-annot-delete-all,
        .wn-annot-panel-export {
          min-height: 44px;
          padding: 8px 14px;
          font-size: 13px;
        }
        .wn-annot-modal .wn-annot-pill {
          min-height: 44px;
          padding: 12px 18px;
        }
        .wn-shot-hint button {
          min-height: 44px;
          padding: 10px 18px;
        }
        /* Under 16px iOS Safari zooms the page in when the field takes focus,
           and does not zoom back out when it loses it. Every field, at every
           width, because the trigger is the keyboard and not the room. */
        .wn-annot-panel input,
        .wn-annot-panel select,
        .wn-annot-panel textarea,
        .wn-annot-modal input,
        .wn-annot-modal select,
        .wn-annot-modal textarea {
          font-size: 16px;
        }
        .wn-annot-filters input[type="search"] {
          height: 44px;
          border-radius: 14px;
          padding: 8px 12px;
          font-size: 16px;
        }
      }
    `,document.head.appendChild(t)}const Un=["commentModal","dialogModal"];function Ht(t,e){const n=document.createElement("div");n.className="wn-annot-sheet-grip wn-annotator";const o=document.createElement("span");o.className="wn-annot-sheet-handle wn-annotator",o.setAttribute("aria-hidden","true");const r=document.createElement("button");return r.type="button",r.className="wn-annot-sheet-close wn-annotator",r.setAttribute("aria-label",t),r.innerHTML=rn(),r.addEventListener("click",i=>{i.stopPropagation(),e()}),n.appendChild(o),n.appendChild(r),Fn(n,e),n}function Fn(t,e){let n=null,o=0,r=0,i=0;const s=c=>{n&&(i=Math.max(0,c.clientY-o),n.style.transform=`translateY(${i}px)`)},l=()=>{if(!n)return;t.removeEventListener("pointermove",s),t.removeEventListener("pointerup",l),t.removeEventListener("pointercancel",l);const c=n.getBoundingClientRect().height||1,p=i/Math.max(1,Date.now()-r);n.style.transform="",n.style.transition="",n=null,(i>c/3||i>40&&p>.5)&&e()};t.addEventListener("pointerdown",c=>{c.target.closest(".wn-annot-sheet-close")||(n=t.closest(".wn-annot-sheet"),n&&(o=c.clientY,r=Date.now(),i=0,n.style.transition="none",t.setPointerCapture&&t.setPointerCapture(c.pointerId),t.addEventListener("pointermove",s),t.addEventListener("pointerup",l),t.addEventListener("pointercancel",l)))})}function Dn(){return a.hidden||!I()?!1:a.panel&&a.panel.style.display!=="none"?!0:Un.some(t=>{const e=a[t];return e&&e.backdrop.classList.contains("show")})}function H(){const t=Dn();if(t===!!a.scrollLocked)return;const e=document.documentElement;a.scrollLocked=t,t?(a.scrollLockPrev=e.style.overflow,e.style.overflow="hidden"):(e.style.overflow=a.scrollLockPrev||"",a.scrollLockPrev="")}function D(){const t=document.documentElement,e=(i,s)=>{t.style.setProperty("--wn-sheet-bottom",`${i}px`),t.style.setProperty("--wn-sheet-top-guard",`${s}px`)};if(!a.toolbar||!I()||a.hidden){e(0,0);return}const n=a.toolbar.getBoundingClientRect(),o=8,r=t.clientHeight;if(v==="top"){e(0,Math.max(0,Math.round(n.bottom+o)));return}e(Math.max(0,Math.round(r-n.top+o)),0)}function pt(t){a.panel&&(a.panel.style.display=t?"":"none",Vt(),H())}function ke(){const t=a.toolbar;if(!t)return;const e=I(),n=h=>{const m=document.createElement("button");return m.className="wn-annot-btn wn-annotator",m.setAttribute("data-action",h.action),h.mode&&m.setAttribute("data-mode",h.mode),m.setAttribute("data-tip",h.tip),m.innerHTML=h.icon,m},o=h=>{const m=document.createElement("div");return m.className="wn-annot-group wn-annotator",h.forEach(b=>m.appendChild(n(b))),m},r=()=>{const h=document.createElement("div");return h.className="wn-annot-spacer wn-annotator",h},i=a.visibilityToggle;i&&i.parentNode===t&&t.removeChild(i),t.innerHTML="";const s=document.createDocumentFragment(),l=document.createElement("div");if(l.className="wn-annot-logo wn-annotator",l.innerHTML=sa(),s.appendChild(l),k){const h=document.createElement("div");h.className="wn-annot-sync-dot wn-annotator",h.setAttribute("role","status"),s.appendChild(h),a.syncDot=h,pn()}const c=[{action:"mode",mode:"text",tip:"Highlight text",icon:nn()},{action:"mode",mode:"element",tip:"Annotate an element",icon:la()}];bn()&&c.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:pa()});const p=[];Mt&&!e&&p.push({action:"import",tip:"Import JSON",icon:ca()}),At&&!e&&p.push({action:"export",tip:"Export JSON",icon:on()}),Rn&&!e&&p.push({action:"mail",tip:"Send by mail",icon:da()});const u=[];e||u.push({action:"toggle-pos",tip:"Toolbar top / bottom",icon:ma()}),u.push({action:"toggle-panel",tip:"Show / hide annotations",icon:ha()}),s.appendChild(r()),s.appendChild(o(c)),p.length&&(s.appendChild(r()),s.appendChild(o(p))),s.appendChild(r()),s.appendChild(o(u)),t.appendChild(s),Kt(),Ut(),Vt(),Ot()}function Ce(){ke(),W(),_(),z(),X(),J(),D(),Ue(),H(),M()}function jn(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${v}`,document.body.appendChild(t),a.toolbar=t,ke();const e=document.createElement("div");e.className="wn-annot-panel wn-annot-sheet wn-annotator",e.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <div class="wn-annot-panel-tools wn-annotator">
            ${At?`<button class="wn-annot-panel-export wn-annotator" type="button">${on()}<span>Export</span></button>`:""}
            <button class="wn-annot-delete-all wn-annotator" type="button">
              ${an()}<span>All</span>
            </button>
          </div>
        </div>
        <div class="wn-annot-filters wn-annotator">
          <div class="wn-annot-filter-row wn-annotator">
            <input id="wn-filter-search" class="wn-annotator" type="search" placeholder="Keyword search" />
          </div>
        </div>
      </div>
      <div class="wn-annot-list"></div>
    `,v==="left"&&(e.style.left="18px",e.style.right="auto"),document.body.appendChild(e),a.panel=e,e.style.display="none";const n=e.querySelector(".wn-annot-delete-all");n&&n.addEventListener("click",async c=>{c.stopPropagation(),await oa()});const o=e.querySelector(".wn-annot-panel-head");o&&o.insertBefore(Ht("Close the annotations",()=>pt(!1)),o.firstChild);const r=e.querySelector(".wn-annot-panel-export");r&&r.addEventListener("click",c=>{c.stopPropagation(),Le()});const i=document.createElement("div");i.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(i),a.markerLayer=i;const s=document.createElement("div");s.className="wn-annot-outline wn-annotator",s.style.display="none",document.body.appendChild(s),a.outlineBox=s;const l=document.createElement("div");l.className="wn-annot-tip wn-annotator",l.textContent="Active mode",document.body.appendChild(l),a.tip=l,t.addEventListener("click",wo),T(),J(),D(),_(),z(),Vt(),ro(),Kn()}function Ee(){a.dimOverlay&&a.dimOverlay.classList.toggle("is-visible",!a.hidden)}function Vn(){if(!a.dimEnabled||a.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(a.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),a.dimOverlay=t,Ee()}function Ot(){if(!a.visibilityToggle)return;const t=a.visibilityToggle,n=I()&&a.toolbar&&!a.hidden?a.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===a.toolbar?a.toolbar.insertBefore(t,a.toolbar.firstChild):document.body.appendChild(t))}function Kn(){if(a.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Hide Uxnote"),t.setAttribute("data-tip","Hide Uxnote"),t.innerHTML=cn(),t.addEventListener("click",xo),a.visibilityToggle=t,Ot(),W(),ze()}function Yn(){if(a.commentModal)return a.commentModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-comment-card wn-annot-sheet wn-annotator";const n=document.createElement("h4");n.textContent="Add a comment";const o=document.createElement("textarea");o.className="wn-annotator",o.placeholder="Your comment...";const r=document.createElement("div");r.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator",i.textContent="Cancel";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",s.textContent="Save",r.appendChild(i),r.appendChild(s),e.appendChild(Ht("Discard this comment",()=>i.click())),e.appendChild(n),e.appendChild(o),e.appendChild(r),t.appendChild(e),document.body.appendChild(t),a.commentModal={backdrop:t,modal:e,textarea:o,title:n,okBtn:s,cancelBtn:i},a.commentModal}function X(){const t=a.commentModal;if(!t||!a.toolbar||!t.backdrop.classList.contains("show"))return;const e=t.modal;if(I()){e.style.left="",e.style.top="",e.style.bottom="";return}const n=a.toolbar.getBoundingClientRect(),o=.75*(parseFloat(getComputedStyle(e).fontSize)||16);e.style.left=`${n.left+n.width/2}px`,v==="top"?(e.style.top=`${n.bottom+o}px`,e.style.bottom=""):(e.style.top="",e.style.bottom=`${window.innerHeight-n.top+o}px`)}function Te(t,e=""){return new Promise(n=>{const o=Yn(),{backdrop:r,textarea:i,title:s,okBtn:l,cancelBtn:c}=o;s.textContent=t||"Add a comment",i.value=e||"",i.placeholder="Your comment...",r.classList.add("show"),X(),H(),i.focus(),i.select();const p=b=>{r.classList.remove("show"),H(),l.removeEventListener("click",u),c.removeEventListener("click",h),document.removeEventListener("keydown",m),window.removeEventListener("resize",X),n(b)},u=()=>{p({comment:i.value.trim()})},h=()=>p(null),m=b=>{b.key==="Escape"&&p(null),b.key==="Enter"&&!(b.shiftKey||b.altKey)&&(b.preventDefault(),u())};l.textContent="Save",c.textContent="Cancel",l.addEventListener("click",u),c.addEventListener("click",h),document.addEventListener("keydown",m),window.addEventListener("resize",X)})}async function Bt(t){const e=await Te(t);return e||null}function Le(){if(At){if(I()){aa();return}tn()}}function Xn(){if(a.importModal)return a.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const r=document.createElement("label");r.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),l=document.createElement("div");l.className="wn-annot-import-drop-title wn-annotator",l.textContent="Drop JSON files here";const c=document.createElement("div");c.className="wn-annot-import-drop-sub wn-annotator",c.textContent="or click to select files",s.appendChild(l),s.appendChild(c),r.appendChild(i),r.appendChild(s);const p=document.createElement("div");p.className="wn-annot-import-panel wn-annotator";const u=document.createElement("div");u.className="wn-annot-import-title-row wn-annotator";const h=document.createElement("h5");h.textContent="Loaded files";const m=document.createElement("span");m.className="wn-annot-import-count wn-annotator",m.textContent="0";const b=document.createElement("p");b.textContent="Files are saved automatically.";const Q=document.createElement("div");Q.className="wn-annot-import-list wn-annotator",u.appendChild(h),u.appendChild(m),p.appendChild(u),p.appendChild(b),p.appendChild(Q);const f=document.createElement("div");f.className="wn-annot-actions wn-annotator";const x=document.createElement("button");x.type="button",x.className="wn-annot-pill cancel wn-annotator",x.textContent="Close",f.appendChild(x),o.appendChild(r),o.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(f),t.appendChild(e),document.body.appendChild(t);const E=()=>{t.classList.remove("show"),document.removeEventListener("keydown",$)},$=g=>{g.key==="Escape"&&E()},ct=g=>{g.target===t&&E()};return x.addEventListener("click",E),t.addEventListener("click",ct),["dragenter","dragover"].forEach(g=>{r.addEventListener(g,y=>{y.preventDefault(),y.stopPropagation(),r.classList.add("dragover")})}),["dragleave","drop"].forEach(g=>{r.addEventListener(g,y=>{y.preventDefault(),y.stopPropagation(),r.classList.remove("dragover")})}),r.addEventListener("drop",g=>{var Ct;const y=(Ct=g.dataTransfer)==null?void 0:Ct.files;y&&y.length&&Qe(Array.from(y))}),i.addEventListener("change",g=>{const y=g.target.files;y&&y.length&&Qe(Array.from(y)),i.value=""}),Q.addEventListener("click",g=>{const y=g.target.closest("[data-import-remove]");y&&Gn(y.dataset.importRemove)}),a.importModal={backdrop:t,modal:e,fileInput:i,fileList:Q,filesCount:m,onKey:$,close:E},a.importModal}function qn(){if(!Mt)return;const t=Xn();ut(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function ut(){if(!a.importModal)return;const{fileList:t,filesCount:e}=a.importModal,{fileCounts:n}=Wn();if(t.innerHTML="",a.importFiles.length)a.importFiles.forEach(o=>{const r=document.createElement("div");r.className="wn-annot-import-card wn-annotator";const i=document.createElement("div");i.className="wn-annot-import-meta wn-annotator";const s=document.createElement("div");s.className="wn-annot-import-name wn-annotator",s.textContent=o.name;const l=document.createElement("div");l.className="wn-annot-import-sub wn-annotator";const c=n.get(o.id)||0,p=o.pageUrl?` | ${eo(o.pageUrl,36)}`:"";l.textContent=`${c} comments | ${to(o.size)}${p}`,i.appendChild(s),i.appendChild(l);const u=document.createElement("div");u.className="wn-annot-import-actions wn-annotator";const h=document.createElement("div");h.className="wn-annot-import-badge wn-annotator",h.textContent=String(c);const m=document.createElement("button");m.type="button",m.className="wn-annot-import-remove wn-annotator",m.dataset.importRemove=o.id,m.textContent="x",u.appendChild(h),u.appendChild(m),r.appendChild(i),r.appendChild(u),t.appendChild(r)});else{const o=document.createElement("div");o.className="wn-annot-import-empty wn-annotator",o.textContent="No imported files yet.",t.appendChild(o)}e.textContent=String(a.importFiles.length)}function Wn(){const t=new Map;return a.annotations.forEach(e=>{e.importFileId&&t.set(e.importFileId,(t.get(e.importFileId)||0)+1)}),{fileCounts:t}}async function Qe(t){if(!t||!t.length)return;const e=new Set(a.annotations.map(o=>o.id));let n=0;for(const o of t){const r=await _n(o,e);if(!r)continue;const{fileMeta:i,annotations:s}=r;s.length&&(a.importFiles.push(i),a.annotations.push(...s),n+=s.length)}if(!n){ut();return}A(),Pe(),tt(),at(),V(),ut()}async function _n(t,e){let n;try{const c=await t.text();n=JSON.parse(c)}catch(c){return await Ae(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await Ae(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const r=Array.isArray(n)?t.lastModified:n.createdAt,i=Array.isArray(n)?"":n.pageUrl||"",s=en(),l=o.filter(jt).map(c=>Jn(c,{createdAt:r,pageUrl:i,fileId:s,existingIds:e}));return{fileMeta:{id:s,name:t.name,size:t.size,pageUrl:i,importedAt:Date.now()},annotations:l}}function Jn(t,e){const n=t&&typeof t=="object"?t:{},o=n.pageUrl||e.pageUrl||window.location.href,r=Zn(n.id,e.existingIds),i=Cn(de({},n),{id:r,createdAt:n.createdAt||e.createdAt||Date.now(),pageUrl:o,importFileId:e.fileId});return i.pageKey||(i.pageKey=L(o)),i}function Zn(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=xt();while(e.has(n));return e.add(n),n}function Gn(t){const e=a.importFiles.filter(n=>n.id!==t);e.length!==a.importFiles.length&&(a.importFiles=e,a.annotations=a.annotations.filter(n=>n.importFileId!==t),A(),Pe(),tt(),at(),V(),ut())}function to(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function eo(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function no(){if(a.dialogModal)return a.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-sheet wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const r=document.createElement("div");r.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",r.appendChild(i),r.appendChild(s),e.appendChild(Ht("Dismiss",()=>i.click())),e.appendChild(n),e.appendChild(o),e.appendChild(r),t.appendChild(e),document.body.appendChild(t),a.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},a.dialogModal}function Se({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:r=!0}){return new Promise(i=>{const{backdrop:s,title:l,message:c,okBtn:p,cancelBtn:u}=no();l.textContent=t,c.textContent=e,p.textContent=n;const h=!!o;u.style.display=h?"inline-flex":"none",u.textContent=o||"";const m=E=>{s.classList.remove("show"),H(),p.removeEventListener("click",b),u.removeEventListener("click",Q),s.removeEventListener("click",f),document.removeEventListener("keydown",x),i(E)},b=()=>m(!0),Q=()=>m(!1),f=E=>{E.target===s&&r&&m(!1)},x=E=>{E.key==="Escape"&&m(!1),(E.metaKey||E.ctrlKey)&&E.key==="Enter"&&b()};p.addEventListener("click",b),u.addEventListener("click",Q),s.addEventListener("click",f),document.addEventListener("keydown",x),s.classList.add("show"),H(),p.focus()})}async function oo(t,e="Confirmation"){return Se({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function Ae(t,e="Information"){await Se({title:e,message:t,okLabel:"OK",cancelLabel:null})}function ao(){document.addEventListener("mouseup",Yt),document.addEventListener("touchend",Yt),document.addEventListener("pointerup",Yt),document.addEventListener("selectionchange",Eo),document.addEventListener("mousemove",yo),document.addEventListener("click",vo,!0),window.addEventListener("resize",M),window.addEventListener("resize",J),window.addEventListener("resize",_),window.addEventListener("resize",D),window.addEventListener("resize",z),window.addEventListener("resize",W),window.addEventListener("resize",Ue),window.addEventListener("scroll",M,{passive:!0}),ba(),ka(),Rt(Pt,Ce),Rt(zt,Ce),$t==="auto"&&Rt(It,Ne)}function ro(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-search");if(!t)return;t.value=a.filters.query;const e=()=>{a.filters.query=t.value.trim().toLowerCase(),T()};t.addEventListener("input",e)}function j(t,e={}){const n=e.keepOutline;if(a.mode===t){a.mode=null,Ut(),q(),Me(),n||et();return}a.mode=t,Ut(),Ft(t),Me(),t!=="element"&&et()}function Me(){a.selectionTimer&&(clearTimeout(a.selectionTimer),a.selectionTimer=null),Z(),Ve()}function Ut(){a.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===a.mode?e.classList.add("active"):e.classList.remove("active")})}function Ft(t){const e=F();let n="";if(t==="text"?n=e?"Select text, then tap Add note.":"Select text then release to add a note.":t==="element"&&(n=e?"Tap an element to preview it, then pin it.":"Hover an element, click to annotate."),!n)return q();a.tip.textContent=n,a.tip.classList.add("show"),z(),requestAnimationFrame(z),requestAnimationFrame(z)}function q(){a.tip.classList.remove("show")}function io(){if(a.toast)return a.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),document.body.appendChild(t),a.toast=t,t}function P(t){if(!t)return;const e=io();e.textContent=t,e.classList.add("show"),a.toastTimer&&clearTimeout(a.toastTimer),a.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function so(){try{const t=localStorage.getItem(me);if(t==="top"||t==="bottom")return t}catch(t){}return null}function lo(){try{const t=localStorage.getItem(ge);return t==null?null:t==="true"}catch(t){return null}}function co(t){try{localStorage.setItem(ge,t?"true":"false")}catch(e){}}function Ne(){const t=$t==="dark"||$t==="auto"&&!!(It&&It.matches);document.documentElement.setAttribute("data-wn-theme",t?"dark":"light")}function po(){if(!document||!document.documentElement)return;const t=document.documentElement,e=a.colors||Qt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,r=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",r.base),n("--wn-element-highlight-soft",r.soft),n("--wn-element-highlight-soft-end",r.softer),n("--wn-element-highlight-strong",r.strong),n("--wn-element-highlight-shadow",r.shadow),n("--wn-shot-frame",e.screenshot.base),n("--wn-marker-text",r.text)}function Dt(t,e={}){var s,l,c;const n=ht(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,r=(l=e.softerAlpha)!=null?l:.04,i=(c=e.overlayAlpha)!=null?c:.7;return{base:n,overlay:S(n,i,S("#000000",i)),soft:S(n,o,S("#000000",o)),softer:S(n,r,S("#000000",r)),strong:S(n,.9,n),shadow:S(n,.24,"rgba(0,0,0,0.24)"),pill:S(n,.16,"rgba(0,0,0,0.16)"),pillBorder:S(n,.28,"rgba(0,0,0,0.28)"),text:uo(n)}}function ht(t,e){const n=mt(t);return n||mt(e)||"#000000"}function mt(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function $e(t){const e=mt(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function S(t,e=1,n=""){const o=$e(t);if(!o)return n||"";const r=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${r})`}function uo(t){const e=$e(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function O(t){const e=a.colors||Qt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function Ie(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function ho(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder))}function B(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function mo(){try{const t=localStorage.getItem(we),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||en(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function Pe(){try{localStorage.setItem(we,JSON.stringify(a.importFiles||[]))}catch(t){}}function z(){if(!a.tip||!a.toolbar)return;const t=a.toolbar.getBoundingClientRect(),e=a.tip,n=10,o=t.left+t.width/2,r=v==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(r){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function jt(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function fo(){try{const t=localStorage.getItem(fe),e=t?JSON.parse(t):[];a.annotations=(e||[]).filter(jt),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=L(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),a.annotations=[]}}function A(){if(k){ce();return}try{localStorage.setItem(fe,JSON.stringify(a.annotations))}catch(t){console.warn("Annotator storage save error",t),P("Uxnote: this browser has no room left to store notes")}}async function wo(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(o==="screenshot"){await Sa();return}j(o);return}if(n==="export"){Le();return}if(n==="import"){qn();return}if(n==="mail"){await ra();return}if(n==="toggle-panel"){go();return}if(n==="toggle-pos"){bo(v==="bottom"?"top":"bottom"),Kt();return}}}function go(){pt(a.panel.style.display==="none")}function xo(){ft(!a.hidden)}function ft(t){a.hidden=t,co(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(j(null),q(),et()),ze(),Ee(),W(),J(),D(),H(),t||(M(),_(),z()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function ze(){if(!a.visibilityToggle)return;const t=a.hidden?"Show Uxnote":"Hide Uxnote";a.visibilityToggle.classList.toggle("is-muted",a.hidden),a.visibilityToggle.innerHTML=a.hidden?fa():cn(),a.visibilityToggle.setAttribute("aria-label",t),a.visibilityToggle.setAttribute("aria-pressed",a.hidden?"true":"false"),a.visibilityToggle.setAttribute("data-tip",t)}function W(){const t=a.visibilityToggle;if(!t)return;Ot();const e=18;if(I()){a.hidden?(t.style.bottom=`max(${e}px, env(safe-area-inset-bottom))`,t.style.left=`max(${e}px, env(safe-area-inset-left))`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",v==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function Vt(){if(!a.panel||!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=a.panel.style.display==="none";t.classList.toggle("active",!e)}function _(){if(!a.panel||!a.toolbar)return;const t=a.panel,e=18,n=a.toolbar.getBoundingClientRect();if(I()){t.style.width="",t.style.height="",t.style.maxHeight="",t.style.left="",t.style.right="",t.style.top="",t.style.bottom="",t.style.borderRadius="",t.style.paddingTop="",t.style.paddingBottom="",D();return}t.style.width=`min(360px, calc(100% - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.maxHeight=`calc(100dvh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",t.style.paddingTop="",t.style.paddingBottom="",v==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):v==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function bo(t){v=t==="top"?"top":"bottom";const e=a.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${v}`));try{localStorage.setItem(me,v)}catch(n){}Kt(),W(),z(),X(),_(),J(),D()}function Kt(){if(!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=v==="top"?sn():ln())}function J(){if(!a.toolbar||a.customPosition||!(dt==="push"||dt==="dock"||dt==="pad"||dt==="true"))return;const t=document.body;a.basePadding||ve();const e=a.basePadding;if(a.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=a.toolbar.getBoundingClientRect(),o=de({},e);v==="top"?o.top=e.top+n.height:v==="bottom"?o.bottom=e.bottom+n.height:v==="left"?o.left=e.left+n.width:v==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}function Re(t){return U(t.commonAncestorContainer)&&U(t.startContainer)&&U(t.endContainer)}async function Yt(){if(a.mode!=="text"||F())return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!Re(e)){t.removeAllRanges(),P("This area is a popup or overlay. It cannot be annotated.");return}const n=t.toString().trim();n&&await He(e,n)}async function He(t,e){const n=await Bt("Comment for this highlight?");if(!n)return;const{comment:o}=n,r=xt(),i=zo(t,e),s=wt(t,r),l=window.getSelection();l&&l.removeAllRanges();const c={id:r,type:"text",target:i,comment:o.trim(),snippet:e.slice(0,180),pageUrl:window.location.href,pageKey:L(window.location.href),createdAt:Date.now(),status:"active"};a.annotations.push(c),A(),K(c,s),T(),j(null,{keepOutline:!0})}function yo(t){if(a.mode!=="element")return;const e=t.target;if(!e||!U(e)){et();return}Oe(e)}function Oe(t){const e=Zt(t);if(!e){et();return}Po(e)}async function vo(t){if(a.mode!=="element")return;const e=t.target;if(!Jt(e)){if(!e||!U(e)){P("This area is a popup or overlay. It cannot be annotated.");return}if(t.preventDefault(),t.stopPropagation(),F()){No(e);return}await Be(e)}}async function Be(t){const e=await Bt("Comment for this element?");if(!e)return;const{comment:n}=e,o=xt(),r=te(t),i=Fo(t),s=t.getBoundingClientRect(),l={id:o,type:"element",target:{xpath:r,css:i,tag:t.tagName.toLowerCase()},comment:n.trim(),snippet:t.innerText?t.innerText.trim().slice(0,120):t.tagName,pageUrl:window.location.href,pageKey:L(window.location.href),rect:{x:s.x+window.scrollX,y:s.y+window.scrollY,w:s.width,h:s.height},createdAt:Date.now(),status:"active"};a.annotations.push(l),A(),K(l,t),Xe(t,o),T(),j(null,{keepOutline:!0})}const ko=400;function Xt(t){if(!t||!a.toolbar||!t.classList.contains("show"))return;const e=document.documentElement,n=a.toolbar.getBoundingClientRect(),o=8;if(v==="top"){t.style.top=`${Math.round(n.bottom+o)}px`,t.style.bottom="auto";return}t.style.top="auto",t.style.bottom=`${Math.round(e.clientHeight-n.top+o)}px`}function Ue(){Xt(a.selectionBar);const t=a.elementPicker;!t||!t.bar.classList.contains("show")||Wt()}function Fe(){const t=a.commentModal;return!!(t&&t.backdrop.classList.contains("show"))}function Co(){const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return null;const e=t.getRangeAt(0);return!e||!e.toString().trim()||!Re(e)?null:e}function Eo(){if(F()){if(a.selectionTimer&&clearTimeout(a.selectionTimer),a.selectionTimer=null,a.mode!=="text"||Fe()){Z();return}a.selectionTimer=setTimeout(To,ko)}}function To(){if(a.selectionTimer=null,a.mode!=="text"||Fe())return Z();const t=Co();if(!t)return Z();a.selectionRange=t.cloneRange(),Qo()}function Lo(){if(a.selectionBar)return a.selectionBar;const t=document.createElement("div");t.className="wn-annot-actionbar wn-annot-selection-bar wn-annotator";const e=document.createElement("button");return e.type="button",e.className="primary wn-annotator",e.textContent="Add note",e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),So()}),t.appendChild(e),document.body.appendChild(t),a.selectionBar=t,t}function Qo(){const t=Lo();q(),t.classList.add("show"),Xt(t)}function Z(){a.selectionRange=null;const t=a.selectionBar;!t||!t.classList.contains("show")||(t.classList.remove("show"),a.mode&&!a.hidden&&Ft(a.mode))}async function So(){const t=a.selectionRange;if(Z(),!t)return;if(!nt(t.startContainer)||!nt(t.endContainer)){P("That text is no longer on the page.");return}const e=t.toString().trim();e&&await He(t,e)}function Ao(t){if(!t||t.nodeType!==1)return"";const e=t.tagName.toLowerCase();if(t.id)return`${e}#${t.id}`;const n=Array.from(t.classList||[]).filter(o=>o&&!o.startsWith("wn-")&&!o.startsWith("uxnote-"));return n.length?`${e}.${n.slice(0,2).join(".")}`:e}function Mo(){if(a.elementPicker)return a.elementPicker;const t=document.createElement("div");t.className="wn-annot-actionbar wn-annot-pick-bar wn-annotator";const e=document.createElement("span");e.className="wn-annot-pick-name wn-annotator";const n=(s,l,c)=>{const p=document.createElement("button");return p.type="button",p.className=`${l} wn-annotator`,p.textContent=s,p.addEventListener("click",u=>{u.preventDefault(),u.stopPropagation(),c()}),p},o=n("Wider","wn-annot-pick-wider",()=>je(1)),r=n("Narrower","wn-annot-pick-narrower",()=>je(-1)),i=n("Pin here","primary wn-annot-pick-pin",$o);return t.appendChild(e),t.appendChild(r),t.appendChild(o),t.appendChild(i),document.body.appendChild(t),a.elementPicker={bar:t,name:e,wider:o,narrower:r,pin:i},a.elementPicker}function No(t){a.elementTrail=[t],a.elementTrailIndex=0;const e=Mo();q(),e.bar.classList.add("show"),Wt()}function qt(){return a.elementTrail[a.elementTrailIndex]||null}function De(){const t=qt();if(a.elementTrailIndex<a.elementTrail.length-1)return a.elementTrail[a.elementTrailIndex+1];if(!t||t===document.body)return null;const e=t.parentElement;return!e||!U(e)?null:e}function je(t){if(t>0){const e=De();if(!e)return;a.elementTrailIndex===a.elementTrail.length-1&&a.elementTrail.push(e),a.elementTrailIndex+=1}else{if(a.elementTrailIndex===0)return;a.elementTrailIndex-=1}Wt()}function Wt(){const t=a.elementPicker,e=qt();!t||!e||(t.name.textContent=Ao(e),t.narrower.disabled=a.elementTrailIndex===0,t.wider.disabled=!De(),Oe(e),Xt(t.bar))}function Ve(){a.elementTrail=[],a.elementTrailIndex=0;const t=a.elementPicker;!t||!t.bar.classList.contains("show")||(t.bar.classList.remove("show"),a.mode&&!a.hidden&&Ft(a.mode))}async function $o(){const t=qt();if(Ve(),!t||!nt(t)){P("That element is no longer on the page.");return}await Be(t)}function _t(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function G(t){const e=a.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function tt(){Object.keys(a.highlightSpans||{}).forEach(t=>{G(t).forEach(e=>{e&&e.parentNode&&_t(e)})}),a.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&_t(t)}),Object.values(a.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),a.markerLayer&&(a.markerLayer.innerHTML=""),a.markers={},Object.keys(a.elementTargets||{}).forEach(t=>{qe(t)}),a.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function Io(t){const e=a.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete a.markers[t],qe(t);let n=G(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&_t(o)}),delete a.highlightSpans[t]}function V(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function Po(t){const e=a.outlineBox;e.style.display="block",e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function et(){a.outlineBox.style.display="none"}function Jt(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&Jt(t.parentElement):!1}function U(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||Jt(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function zo(t,e){return{startXPath:te(t.startContainer),startOffset:t.startOffset,endXPath:te(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function wt(t,e){let n=[];const o=t.cloneRange();if(Ro(o).forEach(i=>{const s=Ho(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",l=>{l.stopPropagation(),it(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return a.highlightSpans[e]=n,n[0]}function Oa(t,e){return wt(t,e)}function Ke(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function Ro(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!Ke(t,o))continue}catch(r){if(!Ke(t,o))continue}e.push(o)}return e}function Ho(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:r}=e;let i=t,s=r;if(o>0&&(i=i.splitText(o),s=r-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const l=document.createElement("span");return l.className="uxnote-textmark",l.dataset.uxnoteId=n,l.addEventListener("click",c=>{c.stopPropagation(),it(n)}),i.parentNode.insertBefore(l,i),l.appendChild(i),l}function nt(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function Oo(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),r=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=r-n,l=i-o;return s<=0||l<=0?null:{x:n,y:o,width:s,height:l}}function Zt(t){if(!t||!nt(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const p=n.querySelector("summary");if(p&&!p.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const r=window.getComputedStyle(n);if(r.display==="none"||r.visibility==="hidden"||r.visibility==="collapse"||r.opacity==="0")return null;const i=r.overflowX||r.overflow,s=r.overflowY||r.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const p=n.getBoundingClientRect(),u=Oo(e,p);if(!u)return null;e=u}n=n.parentElement}return e}function Bo(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function Ye(t){if(!t||t.nodeType!==1)return a.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:Bo(t)||a.markerLayer||document.body}function Gt(t){return t===document.body||t===a.markerLayer||t===document.documentElement}function Uo(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(r){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(r){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const r=n.getAttribute("data-uxnote-open");if(r){const i=document.querySelector(r);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const r=n.id;if(r){const i=document.querySelector(`[aria-controls="${gt(r)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function Xe(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),a.elementTargets[e]=t,!0}function qe(t){const e=a.elementTargets[t];if(!e||e.nodeType!==1){delete a.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const l=s.filter(c=>c!==t);l.length?i.dataset.uxnoteIds=l.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(r=>r!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete a.elementTargets[t]}function te(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const r=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${r}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function gt(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function Fo(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${gt(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let r=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(r+=`.${i.slice(0,2).map(gt).join(".")}`),e.unshift(r),n.parentElement&&n.parentElement.id){e.unshift(`#${gt(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function ot(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function at(){a.annotations.forEach(t=>{t.pageKey===L(window.location.href)&&Do(t)}),T()}function Do(t){const e=rt(t);if(!e){t.status="missing",We();return}t.status="active",ee(t,e)}function ee(t,e){if(e){if(e.type==="screenshot"){K(t,null);return}if(e.type==="text"&&e.range){const n=wt(e.range,t.id);K(t,n);return}e.type==="element"&&e.el&&(Xe(e.el,t.id),K(t,e.el))}}function jo(t){if(!t)return null;const e=ot(t.startXPath),n=ot(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function rt(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?Vo(t):t.type==="element"?Yo(t):null:null:null}function Vo(t){const e=t.target||{},n=jo(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const r=Ko(o);return r?{type:"text",range:r}:null}function Ko(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!U(o))continue;const r=o.nodeValue.indexOf(e);if(r===-1)continue;const i=document.createRange();return i.setStart(o,r),i.setEnd(o,r+e.length),i}return null}function Yo(t){const e=t.target||{};if(e.xpath){const r=ot(e.xpath);if(r&&r.nodeType===1)return{type:"element",el:r}}if(e.css)try{const r=document.querySelector(e.css);if(r&&r.nodeType===1)return{type:"element",el:r}}catch(r){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const r=document.querySelectorAll(n);for(const i of r)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function Xo(){a.missingRetryTimer&&clearTimeout(a.missingRetryTimer),a.missingRetryTimer=setTimeout(()=>{ne()},300)}function We(){a.missingObserver||!window.MutationObserver||(a.missingObserver=new MutationObserver(()=>{a.annotations.some(t=>t.status==="missing")&&Xo()}),a.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function qo(){a.missingObserver&&(a.missingObserver.disconnect(),a.missingObserver=null)}function ne(){let t=!1;a.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==L(window.location.href))return;const n=rt(e);n&&(e.status="active",ee(e,n),t=!0)}),t&&(A(),T(),M()),a.annotations.some(e=>e.status==="missing")||qo()}function Wo(){let t=!1;a.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==L(window.location.href))return;const n=G(e.id).filter(nt);if(n.length){a.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=rt(e);if(o&&o.range){wt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(A(),T(),M())}function _o(){a.layoutTimer&&clearTimeout(a.layoutTimer),a.layoutTimer=setTimeout(()=>{M(),Wo(),a.annotations.some(t=>t.status==="missing")&&ne()},120)}function Jo(){a.layoutObserver||!window.MutationObserver||(a.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&_o()}),a.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function K(t,e){if(t.pageKey!==L(window.location.href)||!a.markerLayer)return;const n=a.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=a.annotations.findIndex(c=>c.id===t.id)+1,o.dataset.wnAnnotId=t.id;const r=O(t);Ie(o,r),o.addEventListener("click",()=>it(t.id));const i=Je(t,e),s=_e(t,i),l=Ye(i&&i.anchor?i.anchor:e);if(o.parentNode!==l&&l.appendChild(o),o.style.zIndex=Gt(l)?"":"9999",!i){o.style.display="none",a.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",Ze(o,i,t),a.markers[t.id]={el:o,rect:i,frame:s}}function _e(t,e){const n=a.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const r=a.markerLayer||document.body;return o.parentNode!==r&&r.appendChild(o),o.style.setProperty("--wn-shot-frame",O(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function Je(t,e){var n;if(t.type==="text"){const r=(e?[e]:G(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!r)return null;const i=Zt(r);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:r}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||a.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?ot(t.target.xpath):null);if(!o)return null;const r=Zt(o);return r?{x:r.x,y:r.y,w:r.width,h:r.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function Ze(t,e,n){const o=Zo(n),r=t.offsetParent||document.body,i=r.getBoundingClientRect(),s=i.x+window.scrollX,l=i.y+window.scrollY,c=e.x+window.scrollX,p=e.y+window.scrollY,u=c-s+e.w+o.x+4,h=Gt(r)?document.documentElement.clientWidth:r.clientWidth,m=(t.offsetWidth||25)/2;t.style.left=`${h?Math.min(u,h-m-2):u}px`,t.style.top=`${p-l+o.y-4}px`}function Zo(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=a.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function M(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:Je(n);if(e.frame=_e(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const r=Ye(o.anchor);e.el.parentNode!==r&&r.appendChild(e.el),e.el.style.zIndex=Gt(r)?"":"9999",Ze(e.el,o,n),Ie(e.el,O(n))})}function Go(){a.panel&&a.panel.style.display==="none"&&pt(!0)}function ta(t){if(!a.panel)return;Go();const e=a.panel.querySelector(".wn-annot-list");if(!e)return;e.querySelectorAll(".wn-annot-item").forEach(r=>r.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function it(t,e=!1,n,o){var l;const r=a.annotations.find(c=>c.id===t);if(!r)return;if(ta(t),r.status==="missing"){const c=rt(r);if(c)r.status="active",ee(r,c),T();else{P("This annotation is not on this page.");return}}const i=rt(r);if(i){const c=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;c&&Uo(c)&&setTimeout(()=>{M()},160)}if(!((o||r.pageKey)===L(window.location.href))&&e){try{localStorage.setItem(St,JSON.stringify({id:r.id,pageKey:r.pageKey,pageUrl:n||r.pageUrl}))}catch(c){}window.location.href=n||r.pageUrl||window.location.href;return}if(r.type==="text"){const p=(G(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];p&&(p.scrollIntoView({behavior:"smooth",block:"center"}),oe(p,O(r).base))}else if(r.type==="element"){const c=i&&i.el?i.el:(l=r.target)!=null&&l.xpath?ot(r.target.xpath):null;c&&c.scrollIntoView&&(c.scrollIntoView({behavior:"smooth",block:"center"}),oe(c,O(r).base))}else if(r.type==="screenshot"&&r.rect){window.scrollTo({top:Math.max(0,r.rect.y+r.rect.h/2-window.innerHeight/2),behavior:"smooth"});const c=a.markers[r.id];c&&c.frame&&oe(c.frame,O(r).base)}}function oe(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=a.colors)==null?void 0:i.element)==null?void 0:s.base)||"#8b5cf6",r=S(o,.6,"rgba(139,92,246,0.6)");t.style.boxShadow=`0 0 0 3px ${r}`,setTimeout(()=>{t.style.boxShadow=n},800)}function Ge(){if(!a.panel)return null;let t=a.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://github.com/Qu4tro/uxnote-fork",e.target="_blank",e.rel="noreferrer noopener",e.textContent="uxnote-fork on GitHub",t.appendChild(e),a.panel.appendChild(t)}return t}function T(){const t=a.panel.querySelector(".wn-annot-list"),e=a.panel.querySelector("h3");if(t.innerHTML="",!a.annotations.length){const o=document.createElement("div");o.className="wn-annot-empty",o.textContent="No annotations yet.",t.appendChild(o),e&&(e.textContent="Annotations (0)");const r=Ge();return}const n=a.annotations.slice().sort((o,r)=>o.createdAt-r.createdAt).filter(o=>{const r=a.filters.query,i=`${o.comment||""} ${o.snippet||""}`.toLowerCase();return!r||i.includes(r)});e&&(e.textContent=`Annotations (${n.length})`),n.forEach((o,r)=>{const i=document.createElement("div");i.className="wn-annot-item",i.dataset.id=o.id,ho(i,O(o));const s=document.createElement("div");s.className="wn-annot-card-top";const l=document.createElement("div");l.className="wn-annot-card-top-left";const c=document.createElement("div");if(c.className="wn-annot-number",c.textContent=`#${r+1}`,l.appendChild(c),o.status==="missing"){const g=document.createElement("div");g.className="wn-annot-missing",g.textContent="Missing",l.appendChild(g)}const p=document.createElement("div");p.className="wn-annot-card-top-right";const u=document.createElement("button");u.type="button",u.className="wn-annot-edit wn-annotator",u.setAttribute("aria-label","Edit this annotation"),u.innerHTML=ua(),u.addEventListener("click",async g=>{g.stopPropagation(),await na(o.id)}),p.appendChild(u);const h=document.createElement("button");h.type="button",h.className="wn-annot-delete wn-annotator",h.setAttribute("aria-label","Delete this annotation"),h.innerHTML=an(),h.addEventListener("click",g=>{g.stopPropagation(),ea(o.id)}),p.appendChild(h),s.appendChild(l),s.appendChild(p);const m=document.createElement("div");m.className="wn-annot-comment";const b=o.comment||"\u2014";m.textContent=b;const Q=document.createElement("div");Q.className="wn-annot-meta";const f=new Date(o.createdAt),x=f.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),E=f.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});Q.textContent=`${x} \u2022 ${E}`,l.appendChild(Q);const $=document.createElement("button");$.type="button",$.className="wn-annot-showmore wn-annotator",$.textContent="See more",$.addEventListener("click",g=>{g.stopPropagation();const y=m.classList.toggle("expanded");$.textContent=y?"See less":"See more"}),b.length<160&&($.style.display="none"),i.appendChild(s),i.appendChild(m);const ct=Aa(o);if(ct){const g=document.createElement("div");g.className="wn-annot-shot";const y=document.createElement("img");y.src=ct,y.alt="The screenshot of this annotation",y.addEventListener("click",Ct=>{Ct.stopPropagation(),Ma(ct)}),g.appendChild(y),i.appendChild(g)}i.appendChild($),i.addEventListener("click",()=>{it(o.id,!0,o.pageUrl,o.pageKey),I()&&pt(!1)}),t.appendChild(i)}),Ge()}function ea(t){const e=a.annotations.findIndex(n=>n.id===t);e!==-1&&(a.annotations.splice(e,1),A(),Io(t),T(),V(),M())}async function na(t){const e=a.annotations.find(r=>r.id===t);if(!e)return;const n=await Te("Edit this annotation",e.comment||"");if(!n)return;const{comment:o}=n;e.comment=o.trim(),A(),T()}async function oa(){!a.annotations.length||!await oo("Delete all annotations?","Delete")||(a.annotations=[],k?ya():A(),tt(),T(),V())}function tn(){const t=ae(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=re(),o.click(),URL.revokeObjectURL(n)}async function aa(){const t=re(),e=JSON.stringify(ae(),null,2);if(navigator.share&&navigator.canShare&&typeof File=="function"){const n=new File([e],t,{type:"application/json"});try{if(navigator.canShare({files:[n]})){await navigator.share({files:[n],title:t});return}}catch(o){if(o&&o.name==="AbortError")return}}tn()}function ae(t=a.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}async function ra(){ia(a.annotations)}function ia(t){const e=ae(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(re()),r=encodeURIComponent(n),i=(En||"").trim(),s=i?encodeURIComponent(i):"",l="?";window.location.href=`mailto:${s}${l}subject=${o}&body=${r}`}function xt(){return"wn-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function en(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function re(){const t=new Date,e=l=>String(l).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,r=(document.title||"").trim(),i=l=>l.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return r?s=`${i(r)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const N=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function sa(){return`
      <svg class="wn-annot-logo-img" viewBox="204 54 1652 250" role="img" aria-label="uxnote-fork logo">
        <path fill="currentColor" d="M264.64 263.94Q248.05 263.94 237.28 257.82Q226.51 251.7 221.26 239.37Q216 227.05 216 208.4V153.58Q216 142.06 222.01 136.1Q228.02 130.14 239.18 130.14Q250.34 130.14 256.39 136.1Q262.45 142.06 262.45 153.58V209.59Q262.45 218.99 266.35 223.68Q270.24 228.37 278.58 228.37Q287.96 228.37 293.98 221.53Q300 214.7 300 203.66V153.58Q300 142.06 306.01 136.1Q312.02 130.14 323.18 130.14Q334.34 130.14 340.39 136.1Q346.45 142.06 346.45 153.58V239.89Q346.45 263.42 323.87 263.42Q312.97 263.42 307.04 257.37Q301.12 251.31 301.12 239.89V224.72L305.27 237.55Q299.46 250.31 289.2 257.12Q278.94 263.94 264.64 263.94ZM360.11 263.14Q351.53 263.14 346.33 258.38Q341.13 253.61 341 246.31Q340.87 239.01 346.97 231.44L385.58 184.58V205.14L350.08 161.84Q343.89 154.1 344.07 146.88Q344.24 139.66 349.44 134.9Q354.64 130.14 363.22 130.14Q371.72 130.14 377.1 132.89Q382.47 135.65 387.2 141.92L411.52 173.44H395.37L419.78 141.92Q424.6 135.65 430.1 132.89Q435.59 130.14 443.67 130.14Q452.5 130.14 457.57 134.95Q462.64 139.76 462.86 146.97Q463.07 154.19 456.71 161.93L421.13 205.21V184.43L460.08 231.44Q466.44 238.92 466.18 246.22Q465.92 253.52 460.63 258.33Q455.35 263.14 446.52 263.14Q438.44 263.14 433.03 260.38Q427.61 257.63 422.63 251.36L395.37 216.73H411.33L384 251.36Q379.1 257.37 373.86 260.25Q368.61 263.14 360.11 263.14ZM501.18 263.42Q490.02 263.42 484.01 257.37Q478 251.31 478 239.89V153.58Q478 142.15 483.92 136.15Q489.85 130.14 500.75 130.14Q511.65 130.14 517.49 136.15Q523.33 142.15 523.33 153.58V165.66L520.46 154.97Q526.7 142.8 538.34 136.21Q549.97 129.62 564.7 129.62Q580.1 129.62 590.02 135.61Q599.93 141.6 604.89 153.88Q609.85 166.16 609.85 185.07V239.89Q609.85 251.31 603.84 257.37Q597.83 263.42 586.67 263.42Q575.51 263.42 569.45 257.37Q563.4 251.31 563.4 239.89V186.97Q563.4 175.26 559.37 170.22Q555.34 165.19 547.43 165.19Q537.08 165.19 530.77 171.86Q524.45 178.53 524.45 189.74V239.89Q524.45 263.42 501.18 263.42ZM679.9 263.94Q658.57 263.94 642.63 255.85Q626.68 247.76 617.84 232.59Q609 217.42 609 196.73Q609 181.17 613.98 168.78Q618.97 156.4 628.33 147.57Q637.69 138.75 650.78 134.18Q663.86 129.62 679.9 129.62Q701.4 129.62 717.27 137.71Q733.13 145.8 741.97 160.84Q750.81 175.88 750.81 196.73Q750.81 212.3 745.83 224.73Q740.84 237.16 731.48 245.98Q722.12 254.81 709.03 259.38Q695.95 263.94 679.9 263.94ZM679.9 229.65Q687.06 229.65 692.45 226.21Q697.84 222.76 700.97 215.49Q704.1 208.23 704.1 196.73Q704.1 179.36 697.31 171.63Q690.52 163.91 679.9 163.91Q672.92 163.91 667.44 167.31Q661.97 170.71 658.84 177.89Q655.71 185.07 655.71 196.73Q655.71 214.02 662.5 221.83Q669.29 229.65 679.9 229.65ZM825.91 263.94Q806.45 263.94 793.68 257.87Q780.91 251.79 774.68 239.7Q768.45 227.61 768.45 209.34V166.75H759.71Q751.28 166.75 746.64 162.33Q742 157.9 742 149.66Q742 141.32 746.64 136.94Q751.28 132.56 759.71 132.56H768.45V116.31Q768.45 104.89 774.51 98.88Q780.56 92.87 791.72 92.87Q802.88 92.87 808.89 98.88Q814.9 104.89 814.9 116.31V132.56H836.23Q844.83 132.56 849.39 136.94Q853.94 141.32 853.94 149.66Q853.94 157.9 849.39 162.33Q844.83 166.75 836.23 166.75H814.9V207.85Q814.9 217.37 819.46 221.97Q824.03 226.57 833.96 226.57Q837.56 226.57 840.96 225.78Q844.35 225 847.29 224.91Q851.42 224.65 854.09 227.45Q856.76 230.25 856.76 239.87Q856.76 247.58 854.4 252.96Q852.04 258.34 845.94 260.74Q842.21 262.12 835.98 263.03Q829.75 263.94 825.91 263.94ZM912.94 263.94Q889.44 263.94 872.37 255.69Q855.3 247.43 846.15 232.31Q837 217.18 837 196.66Q837 176.83 845.72 161.79Q854.44 146.74 869.76 138.18Q885.07 129.62 904.6 129.62Q919 129.62 930.67 134.3Q942.33 138.99 950.69 147.67Q959.06 156.36 963.44 168.65Q967.81 180.94 967.81 196.14Q967.81 201.34 964.89 203.82Q961.96 206.3 955.79 206.3H875.85V184.34H933.69L929.68 187.59Q929.68 178.09 926.99 172Q924.3 165.91 919.23 162.85Q914.16 159.8 906.74 159.8Q898.61 159.8 892.66 163.55Q886.71 167.31 883.59 174.65Q880.46 182 880.46 192.96V195.12Q880.46 213.68 888.67 221.67Q896.88 229.65 914.12 229.65Q919.91 229.65 927.39 228.29Q934.87 226.93 941.61 224.25Q948.42 221.62 953.43 223.26Q958.44 224.9 961.17 228.93Q963.89 232.95 964.17 238.16Q964.44 243.36 961.73 248.1Q959.02 252.85 952.99 255.55Q944.03 259.8 933.74 261.87Q923.45 263.94 912.94 263.94Z"/>
        <g fill="none" stroke="var(--wn-accent)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1008 179.34H1116C1188 179.34 1188 98.34 1260 98.34H1296"/>
          <path d="M1116 179.34C1188 179.34 1188 260.34 1260 260.34H1296"/>
        </g>
        <circle fill="var(--wn-accent)" cx="1328" cy="98.34" r="32"/>
        <circle fill="var(--wn-accent)" cx="1328" cy="260.34" r="32"/>
        <path fill="var(--wn-accent)" transform="translate(340 0)" d="M1101.49 263.42Q1090.33 263.42 1084.27 257.37Q1078.22 251.31 1078.22 239.89V166.75H1071.55Q1063.12 166.75 1058.56 162.33Q1054 157.9 1054 149.66Q1054 141.32 1058.56 136.94Q1063.12 132.56 1071.55 132.56H1091.78L1078.22 144.84V137.46Q1078.22 108.59 1092.7 94.15Q1107.19 79.71 1135.93 76.69L1143.64 75.91Q1151.86 75.05 1156.82 78.02Q1161.78 80.99 1163.58 85.85Q1165.37 90.7 1164.51 95.86Q1163.64 101.01 1160.49 104.66Q1157.35 108.32 1152.27 108.75L1148.61 109.01Q1135.24 110.05 1129.95 114.74Q1124.67 119.44 1124.67 128.75V137.23L1119.16 132.56H1139.69Q1148.28 132.56 1152.76 136.94Q1157.23 141.32 1157.23 149.66Q1157.23 157.9 1152.76 162.33Q1148.28 166.75 1139.69 166.75H1124.67V239.89Q1124.67 263.42 1101.49 263.42ZM1209.9 263.94Q1188.57 263.94 1172.63 255.85Q1156.68 247.76 1147.84 232.59Q1139 217.42 1139 196.73Q1139 181.17 1143.98 168.78Q1148.97 156.4 1158.33 147.57Q1167.69 138.75 1180.78 134.18Q1193.86 129.62 1209.9 129.62Q1231.4 129.62 1247.27 137.71Q1263.13 145.8 1271.97 160.84Q1280.81 175.88 1280.81 196.73Q1280.81 212.3 1275.83 224.73Q1270.84 237.16 1261.48 245.98Q1252.12 254.81 1239.03 259.38Q1225.95 263.94 1209.9 263.94ZM1209.9 229.65Q1217.06 229.65 1222.45 226.21Q1227.84 222.76 1230.97 215.49Q1234.1 208.23 1234.1 196.73Q1234.1 179.36 1227.31 171.63Q1220.52 163.91 1209.9 163.91Q1202.92 163.91 1197.44 167.31Q1191.97 170.71 1188.84 177.89Q1185.71 185.07 1185.71 196.73Q1185.71 214.02 1192.5 221.83Q1199.29 229.65 1209.9 229.65ZM1313.87 263.42Q1302.28 263.42 1296.14 257.37Q1290 251.31 1290 239.89V153.58Q1290 142.15 1295.92 136.15Q1301.85 130.14 1312.75 130.14Q1323.65 130.14 1329.49 136.15Q1335.33 142.15 1335.33 153.58V164.18H1332.72Q1335.21 148.53 1346.08 139.35Q1356.94 130.18 1373.19 129.62Q1380.67 129.43 1384.43 133.52Q1388.19 137.62 1388.38 148.4Q1388.57 157.93 1384.63 163.39Q1380.69 168.85 1369.81 169.96L1363.74 170.49Q1349.99 171.72 1343.65 178.11Q1337.31 184.49 1337.31 197.03V239.89Q1337.31 251.31 1331.3 257.37Q1325.29 263.42 1313.87 263.42ZM1396.18 263.42Q1385.02 263.42 1379.01 257.37Q1373 251.31 1373 239.89V98.04Q1373 86.62 1379.01 80.61Q1385.02 74.6 1396.18 74.6Q1407.34 74.6 1413.39 80.61Q1419.45 86.62 1419.45 98.04V184.17H1419.97L1452.03 145.6Q1458.42 137.71 1464.08 133.92Q1469.75 130.14 1479.36 130.14Q1488.98 130.14 1494.17 134.91Q1499.36 139.68 1499.61 146.72Q1499.86 153.77 1494 160.89L1459.59 201.57V185.34L1498.1 233.93Q1503.8 241.22 1502.82 248.06Q1501.85 254.9 1496.18 259.16Q1490.52 263.42 1481.85 263.42Q1471.38 263.42 1465.16 259.63Q1458.93 255.85 1452.71 247.61L1419.97 207.44H1419.45V239.89Q1419.45 263.42 1396.18 263.42Z"/>
      </svg>
    `}function nn(){return N(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function la(){return N(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function on(){return N(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function ca(){return N(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function da(){return N(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function pa(){return N(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function ua(){return nn()}function an(){return`
      <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M4 7h16M10 11v6M14 11v6M6.5 7l.8 11.2a2 2 0 0 0 2 1.8h5.4a2 2 0 0 0 2-1.8L17.5 7M9 7V5.4A1.4 1.4 0 0 1 10.4 4h3.2A1.4 1.4 0 0 1 15 5.4V7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `}function rn(){return N(`
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    `)}function ha(){return N(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function sn(){return N(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function ln(){return N(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function ma(){return v==="top"?sn():ln()}function cn(){return`
      <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M2.5 12c1.8-3.6 5.3-6 9.5-6s7.7 2.4 9.5 6c-1.8 3.6-5.3 6-9.5 6s-7.7-2.4-9.5-6Z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.6" />
      </svg>
    `}function fa(){return`
      <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M5.2 7.1C3.7 8.1 2.5 9.7 1.8 12c1.8 3.6 5.3 6 9.5 6 1.7 0 3.3-.4 4.7-1.1"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M9.5 9.5a3.5 3.5 0 0 0 5 5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22.2 12c-.9-1.8-2.3-3.3-4-4.4-1-.7-2.1-1.3-3.3-1.7"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4 4l16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    `}function L(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function dn(){try{const t=localStorage.getItem(St);if(!t)return;const e=JSON.parse(t);e.pageKey===L(window.location.href)&&it(e.id,!1),localStorage.removeItem(St)}catch(t){}}let R=new Map,ie=Promise.resolve(),Y=!1;const wa={pending:"Checking the server",ok:"Server connected",refused:"Server refused it: check the address or the key",unreachable:"Server unreachable: notes stay in this browser"};function pn(){const t=a.syncDot;if(!t)return;const e=a.syncStatus||"pending",n=wa[e];t.setAttribute("data-sync-status",e),t.setAttribute("data-tip",n),t.setAttribute("aria-label",n)}function bt(t){a.syncStatus!==t&&(a.syncStatus=t,pn())}async function st(t,e){let n;try{n=await fetch(t,e)}catch(o){throw bt("unreachable"),o}if(!n.ok)throw bt("refused"),new Error(`HTTP ${n.status}`);return bt("ok"),n}function un(){return`${k.url}/annotations?site=${encodeURIComponent(C)}`}function hn(t){return`${k.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function ga(t){return`${k.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function lt(t){const e=Object.assign({},t);return k.apiKey&&(e["X-Uxnote-Key"]=k.apiKey),e}function se(t){return new Map(t.map(e=>[e.id,JSON.stringify(e)]))}function yt(t,e){console.warn("Uxnote sync:",t,e),!Y&&(Y=!0,P(t))}function vt(t){return ie=ie.then(t,t),ie}async function le(){if(k)try{const t=await st(un(),{headers:lt({Accept:"application/json"})});let e;try{e=await t.json()}catch(n){throw bt("refused"),n}a.annotations=(e&&e.annotations||[]).filter(jt),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=L(n.pageUrl||window.location.href))}),R=se(a.annotations),Y=!1,tt(),at(),V(),T(),dn()}catch(t){yt("Uxnote: could not read the annotations from the server",t)}}function ce(){if(!k)return;const t=se(a.annotations);t.forEach((e,n)=>{R.get(n)!==e&&vt(()=>fn(n,e))}),R.forEach((e,n)=>{t.has(n)||vt(()=>wn(n))})}async function xa(t){const e=t&&t.screenshot;if(!e||!e.dataUrl)return!1;const o=await(await fetch(e.dataUrl)).blob(),r=await yn(o,t.id,{rethrow:!0});if(!r)throw new Error("the screenshot upload answered with no address");return t.screenshot={url:r.url,w:e.w,h:e.h,capturedAt:e.capturedAt},!0}function ba(){k&&(window.addEventListener("online",()=>ce()),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&mn()}),window.addEventListener("pagehide",mn))}function mn(){if(!k)return;const t=se(a.annotations);t.forEach((e,n)=>{R.get(n)!==e&&fn(n,e,{keepalive:!0})}),R.forEach((e,n)=>{t.has(n)||wn(n,{keepalive:!0})})}async function fn(t,e,n={}){try{const o=a.annotations.find(r=>r.id===t);o&&o.screenshot&&o.screenshot.dataUrl&&(await xa(o),e=JSON.stringify(o)),await st(hn(t),{method:"PUT",headers:lt({"Content-Type":"application/json"}),keepalive:!!n.keepalive,body:e}),R.set(t,e),Y=!1}catch(o){yt("Uxnote: could not save this annotation on the server",o)}}async function wn(t,e={}){try{await st(hn(t),{method:"DELETE",headers:lt(),keepalive:!!e.keepalive}),R.delete(t),Y=!1}catch(n){yt("Uxnote: could not delete this annotation on the server",n)}}function ya(){k&&vt(async()=>{try{await st(un(),{method:"DELETE",headers:lt()}),R=new Map,Y=!1}catch(t){yt("Uxnote: could not delete the annotations on the server",t)}})}let kt=null,gn=L(window.location.href);function va(){kt=null;const t=L(window.location.href);t!==gn&&(gn=t,tt(),at(),V(),T(),vt(le))}function xn(){kt&&clearTimeout(kt),kt=setTimeout(va,120)}function ka(){["pushState","replaceState"].forEach(t=>{const e=history[t];typeof e=="function"&&(history[t]=function(...o){const r=e.apply(this,o);return xn(),r})}),window.addEventListener("popstate",xn)}function bn(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Ca(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const r=document.createElement("span");r.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(r),o.appendChild(i);const s=f=>{const x=!!f&&f.w>=4&&f.h>=4;n.style.display=x?"block":"none",x&&(n.style.left=`${f.x}px`,n.style.top=`${f.y}px`,n.style.width=`${f.w}px`,n.style.height=`${f.h}px`)};s(null);const l=f=>({x:Math.min(Math.max(f.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(f.clientY,0),document.documentElement.clientHeight)}),c=(f,x)=>({x:Math.min(f.x,x.x),y:Math.min(f.y,x.y),w:Math.abs(x.x-f.x),h:Math.abs(x.y-f.y)});let p=null;const u=f=>{f.preventDefault(),p=l(f),s(null)},h=f=>{p&&(f.preventDefault(),s(c(p,l(f))))},m=f=>{if(!p)return;const x=c(p,l(f));if(p=null,x.w<4||x.h<4){s(null);return}b({x:x.x+window.scrollX,y:x.y+window.scrollY,w:x.w,h:x.h})},b=f=>{document.removeEventListener("keydown",Q,!0),document.removeEventListener("mousemove",h,!0),document.removeEventListener("mouseup",m,!0),e.remove(),o.remove(),t(f)},Q=f=>{f.key==="Escape"&&(f.preventDefault(),b(null))};e.addEventListener("mousedown",u),i.addEventListener("click",()=>b(null)),document.addEventListener("mousemove",h,!0),document.addEventListener("mouseup",m,!0),document.addEventListener("keydown",Q,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function Ea(t){const e=await window.snapdom.toCanvas(document.body,{scale:1,exclude:[".wn-annotator",".wn-annot-dimmer"],excludeMode:"remove"}),n=document.body.getBoundingClientRect(),o=n.width?e.width/n.width:1,r=n.left+window.scrollX,i=n.top+window.scrollY,s=Math.max(0,Math.round((t.x-r)*o)),l=Math.max(0,Math.round((t.y-i)*o)),c=Math.min(e.width-s,Math.max(1,Math.round(t.w*o))),p=Math.min(e.height-l,Math.max(1,Math.round(t.h*o)));if(c<1||p<1)return null;const u=document.createElement("canvas");return u.width=c,u.height=p,u.getContext("2d").drawImage(e,s,l,c,p,0,0,c,p),{canvas:u,w:c,h:p}}function Ta(){const t=document.documentElement;return{x:window.scrollX,y:window.scrollY,w:t.clientWidth,h:t.clientHeight}}const La=2e4;function Qa(t){const e=Ea(t).then(o=>({shot:o}),o=>(console.warn("Uxnote screenshot:",o),{shot:null})),n=new Promise(o=>{setTimeout(()=>o({shot:null,timedOut:!0}),La)});return Promise.race([e,n])}async function Sa(){if(!(!bn()||a.mode==="screenshot")){j("screenshot");try{const t=F()?Ta():await Ca();if(!t)return;const e=Qa(t),n=await Bt("Comment for this region?");if(!n)return;const{shot:o,timedOut:r}=await e;if(!o){P(r?"Uxnote: the page took too long to capture":"Uxnote: could not capture that region");return}const{comment:i}=n,s=xt();let l={dataUrl:o.canvas.toDataURL("image/png"),w:o.w,h:o.h,capturedAt:Date.now()};if(k){const p=await new Promise(h=>o.canvas.toBlob(h,"image/png")),u=p?await yn(p,s):null;u?l={url:u.url,w:o.w,h:o.h,capturedAt:Date.now()}:P("Uxnote: the picture stays on this device until the server answers")}const c={id:s,type:"screenshot",comment:i.trim(),snippet:"",pageUrl:window.location.href,pageKey:L(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:l,createdAt:Date.now(),status:"active"};a.annotations.push(c),A(),K(c,null),T()}finally{j(null)}}}async function yn(t,e,n={}){try{const r=await(await st(ga(e),{method:"PUT",headers:lt({"Content-Type":"image/png"}),body:t})).json();return r&&r.url?r:null}catch(o){if(console.warn("Uxnote screenshot:",o),n.rethrow)throw o;return null}}function Aa(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=k?new URL(`${k.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function Ma(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=document.createElement("button");o.type="button",o.className="wn-shot-lightbox-close wn-annotator",o.setAttribute("aria-label","Close the screenshot"),o.innerHTML=rn(),e.appendChild(o);const r=()=>{document.removeEventListener("keydown",i,!0),e.remove()},i=s=>{s.key==="Escape"&&(s.preventDefault(),r())};o.addEventListener("click",r),e.addEventListener("click",r),document.addEventListener("keydown",i,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ye):ye(),window.Uxnote={refresh:M,setHidden:t=>ft(!!t),toggleVisibility:()=>ft(!a.hidden),isHidden:()=>!!a.hidden,sync:{pull:le,push:ce,url:()=>k?k.url:null}}})();})();
