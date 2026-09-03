(()=>{var zo=Object.defineProperty,Io=Object.defineProperties;var Ro=Object.getOwnPropertyDescriptors;var je=Object.getOwnPropertySymbols;var Oo=Object.prototype.hasOwnProperty,Po=Object.prototype.propertyIsEnumerable;var Ke=(d,w,C)=>w in d?zo(d,w,{enumerable:!0,configurable:!0,writable:!0,value:C}):d[w]=C,Ht=(d,w)=>{for(var C in w||(w={}))Oo.call(w,C)&&Ke(d,C,w[C]);if(je)for(var C of je(w))Po.call(w,C)&&Ke(d,C,w[C]);return d},Xe=(d,w)=>Io(d,Ro(w));(()=>{if(window.Uxnote)return;const d=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),w=t=>d?d.getAttribute(t):null,C=`${location.protocol}//${location.host}`,qe=d&&(d.dataset.mailto||d.dataset.email||d.dataset.to)||"",bt=w("isToolVisibleAtFirstLaunch")||w("istoolvisibleatfirstlaunch")||d&&(d.dataset.isToolVisibleAtFirstLaunch||d.dataset.istoolvisibleatfirstlaunch),yt=w("isToolOnTopAtLaunch")||w("istoolontopatlaunch")||d&&(d.dataset.isToolOnTopAtLaunch||d.dataset.istoolontopatlaunch),Ye=d&&(d.dataset.hiddentoolbydefault||d.dataset.hidden||d.dataset.collapsed||d.dataset.startHidden||""),Ve=w("colorForHighlight")||w("colorForHighligh")||d&&(d.dataset.colorForHighlight||d.dataset.colorForHighligh),Dt=w("colorForTextHighligh")||w("colorForTextHighlight")||d&&(d.dataset.colorForTextHighligh||d.dataset.colorForTextHighlight),jt=w("colorForElementHighlight")||w("colorForElementHighligh")||d&&(d.dataset.colorForElementHighlight||d.dataset.colorForElementHighligh),Kt="#4e9cf6",X=rt(Ve||jt||Dt||Kt,Kt),_e=rt(Dt||X,X),Je=rt(jt||X,X),vt={text:Mt(_e,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:Mt(Je,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:Mt(X,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let k=yt!=null?O(yt,!1)?"top":"bottom":d&&d.dataset.position||"bottom";const Xt="wn-toolbar-pos",tt=d&&(d.dataset.dock||d.dataset.layout)||"",qt=`uxnote:site:${C}`,Yt=`uxnote:import-files:${C}`,Vt=`uxnote:hidden:${C}`,Ct=`uxnote:pending:${C}`,_t=(d&&d.dataset.serverUrl||"").trim().replace(/\/+$/,""),E=_t?{url:_t,apiKey:d&&d.dataset.serverApiKey||""}:null,Jt=O(d&&d.dataset.jsonExport,!0),kt=O(d&&d.dataset.jsonImport,!0),We=O(d&&d.dataset.mailExport,!0),Et=(d&&d.dataset.theme||"").trim().toLowerCase(),Lt=Et==="light"||Et==="dark"?Et:"auto",I=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,Ze=w("isBackdropVisible")||w("isbackdropvisible")||w("backdropVisible")||w("backdropvisible")||d&&(d.dataset.isBackdropVisible||d.dataset.isbackdropvisible||d.dataset.backdropVisible||d.dataset.backdropvisible||d.dataset.dim||d.dataset.dimpage||d.dataset.dimmer||d.dataset.overlay||d.dataset.dimLevel||d.dataset.dimlevel||d.dataset.dimstrength),Ge=.2,Wt=O(Ze,!0),r={mode:null,annotations:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,toolbar:null,panel:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,markerLayer:null,syncDot:null,syncStatus:null,colors:vt,customPosition:!1,dimEnabled:Wt,dimOpacity:Wt?Ge:0,dimOverlay:null,filters:{query:""},hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null},Zt=window.matchMedia?window.matchMedia("(max-width: 640px)"):null;function et(){return Zt?Zt.matches:window.innerWidth<=640}function Gt(){const t=yn();t&&(k=t);const e=vn(),n=bt!=null?!O(bt,!0):null;r.hidden=e!==null?e:n!==null?n:O(Ye,!1),kt&&(r.importFiles=An()),Qt(),kn(),Tt(),Qe(),tn(),en(),at(r.hidden),E?Ut():Sn(),_(),Pt(),ye(),Gn(),E||Ie(),wn()}function Qt(){const t=getComputedStyle(document.body);r.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function Qe(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
      .wn-annotator * { box-sizing: border-box; }
      :root {
        --wn-text-highlight: #4e9cf6;
        --wn-text-highlight-overlay: rgba(78, 156, 246, 0.2);
        --wn-text-highlight-soft: rgba(78, 156, 246, 0.12);
        --wn-element-highlight: #4e9cf6;
        --wn-element-highlight-soft: rgba(78, 156, 246, 0.12);
        --wn-element-highlight-soft-end: rgba(78, 156, 246, 0.04);
        --wn-element-highlight-strong: rgba(78, 156, 246, 0.9);
        --wn-element-highlight-shadow: rgba(78, 156, 246, 0.24);
        --wn-marker-text: #0b1622;
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
      :root[data-wn-theme="dark"] .wn-annot-modal {
        color-scheme: dark;
      }
      :root[data-wn-theme="dark"] .wn-annot-logo-img [fill="#000000"] {
        fill: var(--wn-text);
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
        max-width: calc(100vw - 28px);
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
        left: 12px;
        bottom: 18px;
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
      .wn-annot-visibility-btn:hover {
        background: rgba(109, 86, 199, 0.12);
        color: var(--wn-text);
      }
      .wn-annot-visibility-btn:hover::after { opacity: 1; transform: translateY(0); }
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
        padding-top:5px;
        padding-left:15px;
        padding-right: 0px;
      }
      .wn-annot-logo svg {
        width: 60px;
        height: 24px;
        fill: currentColor;
      }
      @media (max-width: 640px) {
        .wn-annot-toolbar {
          gap: 4px;
          padding: 6px 8px;
          flex-wrap: nowrap;
          left: 8px;
          right: 8px;
          transform: none;
          width: calc(100vw - 16px);
          max-width: calc(100vw - 16px);
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .wn-annot-toolbar button {
          --wn-btn-size: clamp(30px, 9vw, 36px);
        }
        .wn-annot-group {
          gap: 4px;
        }
        .wn-annot-spacer {
          display: block;
          flex: 1 1 auto;
          width: auto;
          min-width: clamp(8px, 4vw, 22px);
        }
        body:not(.wn-annot-hidden) .wn-annot-toolbar .wn-annot-visibility-btn {
          position: static;
          top: auto;
          bottom: auto;
          left: auto;
          right: auto;
          --wn-btn-size: clamp(30px, 9vw, 36px);
          width: var(--wn-btn-size);
          height: var(--wn-btn-size);
          min-width: var(--wn-btn-size);
          max-width: var(--wn-btn-size);
          min-height: var(--wn-btn-size);
          max-height: var(--wn-btn-size);
          flex: 0 0 var(--wn-btn-size);
          border: none;
          background: transparent;
          box-shadow: none;
        }
        body:not(.wn-annot-hidden) .wn-annot-toolbar .wn-annot-visibility-btn::after {
          display: none;
        }
        body.wn-annot-hidden .wn-annot-visibility-btn {
          opacity: 0.7;
          background: var(--wn-surface);
          border-color: var(--wn-border);
          box-shadow: 0 6px 16px var(--wn-shadow);
        }
        .wn-annot-logo {
          display: none;
        }
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
        width: 86px;
        height: auto;
        object-fit: contain;
        display: block;
      }
      .wn-annot-label { display: none; }
      .wn-annot-btn {
        position: relative;
      }
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
      .wn-annot-panel {
        position: fixed;
        top: 18px;
        right: 18px;
        bottom: 18px;
        width: min(360px, calc(100vw - 36px));
        max-height: calc(100vh - 36px);
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
        outline: 2px solid var(--wn-element-highlight, #4e9cf6);
        outline-offset: 2px;
        box-shadow: 0 0 0 3px var(--wn-element-highlight-soft, rgba(78,156,246,0.08));
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
        border: 2px dashed var(--wn-element-highlight, #4e9cf6);
        background: var(--wn-element-highlight-soft, rgba(78,156,246,0.1));
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
        min-width: min(440px, calc(100vw - 40px));
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
        width: min(420px, calc(100vw - 36px));
        max-width: 420px;
        opacity: 0.55;
        transition: opacity 0.15s ease;
      }
      /* Hover alone: the textarea holds focus for the whole life of the card. */
      .wn-annot-comment-card:hover {
        opacity: 1;
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
      @media (max-width: 640px) {
        .wn-annot-modal textarea {
          font-size: 16px;
        }
      }
      .wn-annot-import-modal {
        min-width: min(760px, calc(100vw - 40px));
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
        border: 2px dashed var(--wn-shot-frame, #4e9cf6);
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
        max-width: 92vw;
        max-height: 92vh;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
      }
    `,document.head.appendChild(t)}function tn(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${k}`;const e=f=>{const u=document.createElement("button");return u.className="wn-annot-btn wn-annotator",u.setAttribute("data-action",f.action),f.mode&&u.setAttribute("data-mode",f.mode),u.setAttribute("data-tip",f.tip),u.innerHTML=f.icon,u},n=f=>{const u=document.createElement("div");return u.className="wn-annot-group wn-annotator",f.forEach(g=>u.appendChild(e(g))),u},o=()=>{const f=document.createElement("div");return f.className="wn-annot-spacer wn-annotator",f},a=document.createDocumentFragment(),i=document.createElement("div");if(i.className="wn-annot-logo wn-annotator",i.innerHTML=lo(),a.appendChild(i),E){const f=document.createElement("div");f.className="wn-annot-sync-dot wn-annotator",f.setAttribute("role","status"),a.appendChild(f),r.syncDot=f,Re()}const s=[{action:"mode",mode:"text",tip:"Highlight text",icon:Te()},{action:"mode",mode:"element",tip:"Annotate an element",icon:co()}];De()&&s.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:fo()});const l=[];kt&&l.push({action:"import",tip:"Import JSON",icon:uo()}),Jt&&l.push({action:"export",tip:"Export JSON",icon:po()}),We&&l.push({action:"mail",tip:"Send by mail",icon:mo()});const c=[{action:"toggle-pos",tip:"Toolbar top / bottom",icon:go()},{action:"toggle-panel",tip:"Show / hide annotations",icon:wo()}];a.appendChild(o()),a.appendChild(n(s)),l.length&&(a.appendChild(o()),a.appendChild(n(l))),a.appendChild(o()),a.appendChild(n(c)),t.appendChild(a),document.body.appendChild(t),r.toolbar=t;const p=document.createElement("div");p.className="wn-annot-panel wn-annotator",p.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <button class="wn-annot-delete-all wn-annotator" type="button">
            ${Me()}<span>All</span>
          </button>
        </div>
        <div class="wn-annot-filters wn-annotator">
          <div class="wn-annot-filter-row wn-annotator">
            <input id="wn-filter-search" class="wn-annotator" type="search" placeholder="Keyword search" />
          </div>
        </div>
      </div>
      <div class="wn-annot-list"></div>
    `,k==="left"&&(p.style.left="18px",p.style.right="auto"),document.body.appendChild(p),r.panel=p,p.style.display="none";const m=p.querySelector(".wn-annot-delete-all");m&&m.addEventListener("click",async f=>{f.stopPropagation(),await ro()});const y=document.createElement("div");y.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(y),r.markerLayer=y;const h=document.createElement("div");h.className="wn-annot-outline wn-annotator",h.style.display="none",document.body.appendChild(h),r.outlineBox=h;const b=document.createElement("div");b.className="wn-annot-tip wn-annotator",b.textContent="Active mode",document.body.appendChild(b),r.tip=b,t.addEventListener("click",Tn),A(),ct(),lt(),P(),st(),gn(),nn()}function te(){r.dimOverlay&&r.dimOverlay.classList.toggle("is-visible",!r.hidden)}function en(){if(!r.dimEnabled||r.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(r.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),r.dimOverlay=t,te()}function ee(){if(!r.visibilityToggle)return;const t=r.visibilityToggle,n=et()&&r.toolbar&&!r.hidden?r.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===r.toolbar?r.toolbar.insertBefore(t,r.toolbar.firstChild):document.body.appendChild(t))}function nn(){if(r.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Masquer Uxnote"),t.setAttribute("data-tip","Masquer Uxnote"),t.innerHTML=ze(),t.addEventListener("click",Nn),r.visibilityToggle=t,ee(),it(),de()}function on(){if(r.commentModal)return r.commentModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-comment-card wn-annotator";const n=document.createElement("h4");n.textContent="Add a comment";const o=document.createElement("textarea");o.className="wn-annotator",o.placeholder="Your comment...";const a=document.createElement("div");a.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator",i.textContent="Cancel";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",s.textContent="Save",a.appendChild(i),a.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(a),t.appendChild(e),document.body.appendChild(t),r.commentModal={backdrop:t,modal:e,textarea:o,title:n,okBtn:s,cancelBtn:i},r.commentModal}function nt(){const t=r.commentModal;if(!t||!r.toolbar||!t.backdrop.classList.contains("show"))return;const e=t.modal,n=r.toolbar.getBoundingClientRect(),o=.75*(parseFloat(getComputedStyle(e).fontSize)||16);e.style.left=`${n.left+n.width/2}px`,k==="top"?(e.style.top=`${n.bottom+o}px`,e.style.bottom=""):(e.style.top="",e.style.bottom=`${window.innerHeight-n.top+o}px`)}function ne(t,e=""){return new Promise(n=>{const o=on(),{backdrop:a,textarea:i,title:s,okBtn:l,cancelBtn:c}=o;s.textContent=t||"Add a comment",i.value=e||"",i.placeholder="Your comment...",a.classList.add("show"),nt(),i.focus(),i.select();const p=b=>{a.classList.remove("show"),l.removeEventListener("click",m),c.removeEventListener("click",y),document.removeEventListener("keydown",h),window.removeEventListener("resize",nt),n(b)},m=()=>{p({comment:i.value.trim()})},y=()=>p(null),h=b=>{b.key==="Escape"&&p(null),b.key==="Enter"&&!(b.shiftKey||b.altKey)&&(b.preventDefault(),m())};l.textContent="Save",c.textContent="Cancel",l.addEventListener("click",m),c.addEventListener("click",y),document.addEventListener("keydown",h),window.addEventListener("resize",nt)})}async function At(t){const e=await ne(t);return e||null}function rn(){if(r.importModal)return r.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const a=document.createElement("label");a.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),l=document.createElement("div");l.className="wn-annot-import-drop-title wn-annotator",l.textContent="Drop JSON files here";const c=document.createElement("div");c.className="wn-annot-import-drop-sub wn-annotator",c.textContent="or click to select files",s.appendChild(l),s.appendChild(c),a.appendChild(i),a.appendChild(s);const p=document.createElement("div");p.className="wn-annot-import-panel wn-annotator";const m=document.createElement("div");m.className="wn-annot-import-title-row wn-annotator";const y=document.createElement("h5");y.textContent="Loaded files";const h=document.createElement("span");h.className="wn-annot-import-count wn-annotator",h.textContent="0";const b=document.createElement("p");b.textContent="Files are saved automatically.";const f=document.createElement("div");f.className="wn-annot-import-list wn-annotator",m.appendChild(y),m.appendChild(h),p.appendChild(m),p.appendChild(b),p.appendChild(f);const u=document.createElement("div");u.className="wn-annot-actions wn-annotator";const g=document.createElement("button");g.type="button",g.className="wn-annot-pill cancel wn-annotator",g.textContent="Close",u.appendChild(g),o.appendChild(a),o.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(u),t.appendChild(e),document.body.appendChild(t);const L=()=>{t.classList.remove("show"),document.removeEventListener("keydown",N)},N=x=>{x.key==="Escape"&&L()},Q=x=>{x.target===t&&L()};return g.addEventListener("click",L),t.addEventListener("click",Q),["dragenter","dragover"].forEach(x=>{a.addEventListener(x,v=>{v.preventDefault(),v.stopPropagation(),a.classList.add("dragover")})}),["dragleave","drop"].forEach(x=>{a.addEventListener(x,v=>{v.preventDefault(),v.stopPropagation(),a.classList.remove("dragover")})}),a.addEventListener("drop",x=>{var xt;const v=(xt=x.dataTransfer)==null?void 0:xt.files;v&&v.length&&oe(Array.from(v))}),i.addEventListener("change",x=>{const v=x.target.files;v&&v.length&&oe(Array.from(v)),i.value=""}),f.addEventListener("click",x=>{const v=x.target.closest("[data-import-remove]");v&&pn(v.dataset.importRemove)}),r.importModal={backdrop:t,modal:e,fileInput:i,fileList:f,filesCount:h,onKey:N,close:L},r.importModal}function an(){if(!kt)return;const t=rn();ot(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function ot(){if(!r.importModal)return;const{fileList:t,filesCount:e}=r.importModal,{fileCounts:n}=sn();if(t.innerHTML="",r.importFiles.length)r.importFiles.forEach(o=>{const a=document.createElement("div");a.className="wn-annot-import-card wn-annotator";const i=document.createElement("div");i.className="wn-annot-import-meta wn-annotator";const s=document.createElement("div");s.className="wn-annot-import-name wn-annotator",s.textContent=o.name;const l=document.createElement("div");l.className="wn-annot-import-sub wn-annotator";const c=n.get(o.id)||0,p=o.pageUrl?` | ${mn(o.pageUrl,36)}`:"";l.textContent=`${c} comments | ${un(o.size)}${p}`,i.appendChild(s),i.appendChild(l);const m=document.createElement("div");m.className="wn-annot-import-actions wn-annotator";const y=document.createElement("div");y.className="wn-annot-import-badge wn-annotator",y.textContent=String(c);const h=document.createElement("button");h.type="button",h.className="wn-annot-import-remove wn-annotator",h.dataset.importRemove=o.id,h.textContent="x",m.appendChild(y),m.appendChild(h),a.appendChild(i),a.appendChild(m),t.appendChild(a)});else{const o=document.createElement("div");o.className="wn-annot-import-empty wn-annotator",o.textContent="No imported files yet.",t.appendChild(o)}e.textContent=String(r.importFiles.length)}function sn(){const t=new Map;return r.annotations.forEach(e=>{e.importFileId&&t.set(e.importFileId,(t.get(e.importFileId)||0)+1)}),{fileCounts:t}}async function oe(t){if(!t||!t.length)return;const e=new Set(r.annotations.map(o=>o.id));let n=0;for(const o of t){const a=await ln(o,e);if(!a)continue;const{fileMeta:i,annotations:s}=a;s.length&&(r.importFiles.push(i),r.annotations.push(...s),n+=s.length)}if(!n){ot();return}M(),ce(),Y(),_(),U(),ot()}async function ln(t,e){let n;try{const c=await t.text();n=JSON.parse(c)}catch(c){return await ae(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await ae(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const a=Array.isArray(n)?t.lastModified:n.createdAt,i=Array.isArray(n)?"":n.pageUrl||"",s=Ae(),l=o.filter($t).map(c=>cn(c,{createdAt:a,pageUrl:i,fileId:s,existingIds:e}));return{fileMeta:{id:s,name:t.name,size:t.size,pageUrl:i,importedAt:Date.now()},annotations:l}}function cn(t,e){const n=t&&typeof t=="object"?t:{},o=n.pageUrl||e.pageUrl||window.location.href,a=dn(n.id,e.existingIds),i=Xe(Ht({},n),{id:a,createdAt:n.createdAt||e.createdAt||Date.now(),pageUrl:o,importFileId:e.fileId});return i.pageKey||(i.pageKey=S(o)),i}function dn(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=mt();while(e.has(n));return e.add(n),n}function pn(t){const e=r.importFiles.filter(n=>n.id!==t);e.length!==r.importFiles.length&&(r.importFiles=e,r.annotations=r.annotations.filter(n=>n.importFileId!==t),M(),ce(),Y(),_(),U(),ot())}function un(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function mn(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function fn(){if(r.dialogModal)return r.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const a=document.createElement("div");a.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",a.appendChild(i),a.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(a),t.appendChild(e),document.body.appendChild(t),r.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},r.dialogModal}function re({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:a=!0}){return new Promise(i=>{const{backdrop:s,title:l,message:c,okBtn:p,cancelBtn:m}=fn();l.textContent=t,c.textContent=e,p.textContent=n;const y=!!o;m.style.display=y?"inline-flex":"none",m.textContent=o||"";const h=L=>{s.classList.remove("show"),p.removeEventListener("click",b),m.removeEventListener("click",f),s.removeEventListener("click",u),document.removeEventListener("keydown",g),i(L)},b=()=>h(!0),f=()=>h(!1),u=L=>{L.target===s&&a&&h(!1)},g=L=>{L.key==="Escape"&&h(!1),(L.metaKey||L.ctrlKey)&&L.key==="Enter"&&b()};p.addEventListener("click",b),m.addEventListener("click",f),s.addEventListener("click",u),document.addEventListener("keydown",g),s.classList.add("show"),p.focus()})}async function hn(t,e="Confirmation"){return re({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function ae(t,e="Information"){await re({title:e,message:t,okLabel:"OK",cancelLabel:null})}function wn(){document.addEventListener("mouseup",zt),document.addEventListener("touchend",zt),document.addEventListener("pointerup",zt),document.addEventListener("mousemove",zn),document.addEventListener("click",In,!0),window.addEventListener("resize",$),window.addEventListener("resize",ct),window.addEventListener("resize",lt),window.addEventListener("resize",P),window.addEventListener("resize",it),window.addEventListener("scroll",$,{passive:!0}),Lo(),Lt==="auto"&&I&&(I.addEventListener?I.addEventListener("change",Tt):I.addListener&&I.addListener(Tt))}function gn(){if(!r.panel)return;const t=r.panel.querySelector("#wn-filter-search");if(!t)return;t.value=r.filters.query;const e=()=>{r.filters.query=t.value.trim().toLowerCase(),A()};t.addEventListener("input",e)}function F(t,e={}){const n=e.keepOutline;if(r.mode===t){r.mode=null,ie(),St(),n||dt();return}r.mode=t,ie(),xn(t),t!=="element"&&dt()}function ie(){r.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===r.mode?e.classList.add("active"):e.classList.remove("active")})}function xn(t){let e="";if(t==="text"?e="Select text then release to add a note.":t==="element"&&(e="Hover an element, click to annotate."),!e)return St();r.tip.textContent=e,r.tip.classList.add("show"),P(),requestAnimationFrame(P),requestAnimationFrame(P)}function St(){r.tip.classList.remove("show")}function bn(){if(r.toast)return r.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),document.body.appendChild(t),r.toast=t,t}function B(t){if(!t)return;const e=bn();e.textContent=t,e.classList.add("show"),r.toastTimer&&clearTimeout(r.toastTimer),r.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function yn(){try{const t=localStorage.getItem(Xt);if(t==="top"||t==="bottom")return t}catch(t){}return null}function vn(){try{const t=localStorage.getItem(Vt);return t==null?null:t==="true"}catch(t){return null}}function Cn(t){try{localStorage.setItem(Vt,t?"true":"false")}catch(e){}}function Tt(){const t=Lt==="dark"||Lt==="auto"&&!!(I&&I.matches);document.documentElement.setAttribute("data-wn-theme",t?"dark":"light")}function kn(){if(!document||!document.documentElement)return;const t=document.documentElement,e=r.colors||vt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,a=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",a.base),n("--wn-element-highlight-soft",a.soft),n("--wn-element-highlight-soft-end",a.softer),n("--wn-element-highlight-strong",a.strong),n("--wn-element-highlight-shadow",a.shadow),n("--wn-marker-text",a.text)}function Mt(t,e={}){var s,l,c;const n=rt(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,a=(l=e.softerAlpha)!=null?l:.04,i=(c=e.overlayAlpha)!=null?c:.7;return{base:n,overlay:T(n,i,T("#000000",i)),soft:T(n,o,T("#000000",o)),softer:T(n,a,T("#000000",a)),strong:T(n,.9,n),shadow:T(n,.24,"rgba(0,0,0,0.24)"),pill:T(n,.16,"rgba(0,0,0,0.16)"),pillBorder:T(n,.28,"rgba(0,0,0,0.28)"),text:En(n)}}function rt(t,e){const n=Nt(t);return n||Nt(e)||"#000000"}function Nt(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function se(t){const e=Nt(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function T(t,e=1,n=""){const o=se(t);if(!o)return n||"";const a=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${a})`}function En(t){const e=se(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function R(t){const e=r.colors||vt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function le(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function Ln(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder))}function O(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function An(){try{const t=localStorage.getItem(Yt),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||Ae(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function ce(){try{localStorage.setItem(Yt,JSON.stringify(r.importFiles||[]))}catch(t){}}function P(){if(!r.tip||!r.toolbar)return;const t=r.toolbar.getBoundingClientRect(),e=r.tip,n=10,o=t.left+t.width/2,a=k==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(a){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function $t(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function Sn(){try{const t=localStorage.getItem(qt),e=t?JSON.parse(t):[];r.annotations=(e||[]).filter($t),r.annotations.forEach(n=>{n.pageKey||(n.pageKey=S(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),r.annotations=[]}}function M(){if(E){Be();return}try{localStorage.setItem(qt,JSON.stringify(r.annotations))}catch(t){console.warn("Annotator storage save error",t)}}async function Tn(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(o==="screenshot"){await To();return}F(o);return}if(n==="export"){Jt&&ao();return}if(n==="import"){an();return}if(n==="mail"){await io();return}if(n==="toggle-panel"){Mn();return}if(n==="toggle-pos"){$n(k==="bottom"?"top":"bottom"),pe();return}}}function Mn(){const t=r.panel.style.display==="none";r.panel.style.display=t?"":"none",st()}function Nn(){at(!r.hidden)}function at(t){r.hidden=t,Cn(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(F(null),St(),dt()),de(),te(),it(),ct(),t||($(),lt(),P()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function de(){if(!r.visibilityToggle)return;const t=r.hidden?"Show Uxnote":"Hide Uxnote";r.visibilityToggle.classList.toggle("is-muted",r.hidden),r.visibilityToggle.innerHTML=r.hidden?xo():ze(),r.visibilityToggle.setAttribute("aria-label",t),r.visibilityToggle.setAttribute("aria-pressed",r.hidden?"true":"false"),r.visibilityToggle.setAttribute("data-tip",t)}function it(){const t=r.visibilityToggle;if(!t)return;ee();const e=18;if(et()){r.hidden?(t.style.bottom=`${e}px`,t.style.left=`${e}px`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",k==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function st(){if(!r.panel||!r.toolbar)return;const t=r.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=r.panel.style.display==="none";t.classList.toggle("active",!e)}function lt(){if(!r.panel||!r.toolbar)return;const t=r.panel,e=18,n=r.toolbar.getBoundingClientRect();if(et()){t.style.width="100vw",t.style.maxHeight="100vh",t.style.height="100vh",t.style.left="0",t.style.right="0",t.style.top="0",t.style.bottom="0",t.style.borderRadius="0";return}t.style.width=`min(360px, calc(100vw - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",k==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):k==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function $n(t){k=t==="top"?"top":"bottom";const e=r.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${k}`));try{localStorage.setItem(Xt,k)}catch(n){}pe(),it(),P(),nt(),lt(),ct()}function pe(){if(!r.toolbar)return;const t=r.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=k==="top"?Ne():$e())}function ct(){if(!r.toolbar||r.customPosition||!(tt==="push"||tt==="dock"||tt==="pad"||tt==="true"))return;const t=document.body;r.basePadding||Qt();const e=r.basePadding;if(r.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=r.toolbar.getBoundingClientRect(),o=Ht({},e);k==="top"?o.top=e.top+n.height:k==="bottom"?o.bottom=e.bottom+n.height:k==="left"?o.left=e.left+n.width:k==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}async function zt(){if(r.mode!=="text")return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!(H(e.commonAncestorContainer)&&H(e.startContainer)&&H(e.endContainer))){t.removeAllRanges(),B("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}const o=t.toString().trim();if(!o)return;const a=await At("Comment for this highlight?");if(!a)return;const{comment:i}=a,s=mt(),l=Pn(e,o),c=pt(e,s);t.removeAllRanges();const p={id:s,type:"text",target:l,comment:i.trim(),snippet:o.slice(0,180),pageUrl:window.location.href,pageKey:S(window.location.href),createdAt:Date.now(),status:"active"};r.annotations.push(p),M(),D(p,c),A(),F(null,{keepOutline:!0})}function zn(t){if(r.mode!=="element")return;const e=t.target;if(!e||!H(e)){dt();return}const n=e.getBoundingClientRect();On(n)}async function In(t){if(r.mode!=="element")return;const e=t.target;if(!e||!H(e)){B("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}t.preventDefault(),t.stopPropagation();const n=await At("Comment for this element?");if(!n)return;const{comment:o}=n,a=mt(),i=Rt(e),s=jn(e),l=e.getBoundingClientRect(),c={id:a,type:"element",target:{xpath:i,css:s,tag:e.tagName.toLowerCase()},comment:o.trim(),snippet:e.innerText?e.innerText.trim().slice(0,120):e.tagName,pageUrl:window.location.href,pageKey:S(window.location.href),rect:{x:l.x+window.scrollX,y:l.y+window.scrollY,w:l.width,h:l.height},createdAt:Date.now(),status:"active"};r.annotations.push(c),M(),D(c,e),xe(e,a),A(),F(null,{keepOutline:!0})}function It(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function q(t){const e=r.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function Y(){Object.keys(r.highlightSpans||{}).forEach(t=>{q(t).forEach(e=>{e&&e.parentNode&&It(e)})}),r.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&It(t)}),Object.values(r.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),r.markerLayer&&(r.markerLayer.innerHTML=""),r.markers={},Object.keys(r.elementTargets||{}).forEach(t=>{be(t)}),r.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function Rn(t){const e=r.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete r.markers[t],be(t);let n=q(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&It(o)}),delete r.highlightSpans[t]}function U(){Object.entries(r.markers).forEach(([t,e])=>{const n=r.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function On(t){const e=r.outlineBox;e.style.display="block",e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function dt(){r.outlineBox.style.display="none"}function ue(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&ue(t.parentElement):!1}function H(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||ue(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function Pn(t,e){return{startXPath:Rt(t.startContainer),startOffset:t.startOffset,endXPath:Rt(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function pt(t,e){let n=[];const o=t.cloneRange();if(Fn(o).forEach(i=>{const s=Bn(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",l=>{l.stopPropagation(),W(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return r.highlightSpans[e]=n,n[0]}function Uo(t,e){return pt(t,e)}function me(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function Fn(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!me(t,o))continue}catch(a){if(!me(t,o))continue}e.push(o)}return e}function Bn(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:a}=e;let i=t,s=a;if(o>0&&(i=i.splitText(o),s=a-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const l=document.createElement("span");return l.className="uxnote-textmark",l.dataset.uxnoteId=n,l.addEventListener("click",c=>{c.stopPropagation(),W(n)}),i.parentNode.insertBefore(l,i),l.appendChild(i),l}function fe(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function Un(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),a=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=a-n,l=i-o;return s<=0||l<=0?null:{x:n,y:o,width:s,height:l}}function he(t){if(!t||!fe(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const p=n.querySelector("summary");if(p&&!p.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const a=window.getComputedStyle(n);if(a.display==="none"||a.visibility==="hidden"||a.visibility==="collapse"||a.opacity==="0")return null;const i=a.overflowX||a.overflow,s=a.overflowY||a.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const p=n.getBoundingClientRect(),m=Un(e,p);if(!m)return null;e=m}n=n.parentElement}return e}function Hn(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function we(t){if(!t||t.nodeType!==1)return r.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:Hn(t)||r.markerLayer||document.body}function ge(t){return t===document.body||t===r.markerLayer||t===document.documentElement}function Dn(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(a){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(a){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const a=n.getAttribute("data-uxnote-open");if(a){const i=document.querySelector(a);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const a=n.id;if(a){const i=document.querySelector(`[aria-controls="${ut(a)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function xe(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),r.elementTargets[e]=t,!0}function be(t){const e=r.elementTargets[t];if(!e||e.nodeType!==1){delete r.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const l=s.filter(c=>c!==t);l.length?i.dataset.uxnoteIds=l.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(a=>a!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete r.elementTargets[t]}function Rt(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const a=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${a}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function ut(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function jn(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${ut(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let a=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(a+=`.${i.slice(0,2).map(ut).join(".")}`),e.unshift(a),n.parentElement&&n.parentElement.id){e.unshift(`#${ut(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function V(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function _(){r.annotations.forEach(t=>{t.pageKey===S(window.location.href)&&Kn(t)}),A()}function Kn(t){const e=J(t);if(!e){t.status="missing",ye();return}t.status="active",Ot(t,e)}function Ot(t,e){if(e){if(e.type==="screenshot"){D(t,null);return}if(e.type==="text"&&e.range){const n=pt(e.range,t.id);D(t,n);return}e.type==="element"&&e.el&&(xe(e.el,t.id),D(t,e.el))}}function Xn(t){if(!t)return null;const e=V(t.startXPath),n=V(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function J(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?qn(t):t.type==="element"?Vn(t):null:null:null}function qn(t){const e=t.target||{},n=Xn(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const a=Yn(o);return a?{type:"text",range:a}:null}function Yn(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!H(o))continue;const a=o.nodeValue.indexOf(e);if(a===-1)continue;const i=document.createRange();return i.setStart(o,a),i.setEnd(o,a+e.length),i}return null}function Vn(t){const e=t.target||{};if(e.xpath){const a=V(e.xpath);if(a&&a.nodeType===1)return{type:"element",el:a}}if(e.css)try{const a=document.querySelector(e.css);if(a&&a.nodeType===1)return{type:"element",el:a}}catch(a){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const a=document.querySelectorAll(n);for(const i of a)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function _n(){r.missingRetryTimer&&clearTimeout(r.missingRetryTimer),r.missingRetryTimer=setTimeout(()=>{Pt()},300)}function ye(){r.missingObserver||!window.MutationObserver||(r.missingObserver=new MutationObserver(()=>{r.annotations.some(t=>t.status==="missing")&&_n()}),r.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function Jn(){r.missingObserver&&(r.missingObserver.disconnect(),r.missingObserver=null)}function Pt(){let t=!1;r.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==S(window.location.href))return;const n=J(e);n&&(e.status="active",Ot(e,n),t=!0)}),t&&(M(),A(),$()),r.annotations.some(e=>e.status==="missing")||Jn()}function Wn(){let t=!1;r.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==S(window.location.href))return;const n=q(e.id).filter(fe);if(n.length){r.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=J(e);if(o&&o.range){pt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(M(),A(),$())}function Zn(){r.layoutTimer&&clearTimeout(r.layoutTimer),r.layoutTimer=setTimeout(()=>{$(),Wn(),r.annotations.some(t=>t.status==="missing")&&Pt()},120)}function Gn(){r.layoutObserver||!window.MutationObserver||(r.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&Zn()}),r.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function D(t,e){if(t.pageKey!==S(window.location.href)||!r.markerLayer)return;const n=r.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=r.annotations.findIndex(c=>c.id===t.id)+1,o.dataset.wnAnnotId=t.id;const a=R(t);le(o,a),o.addEventListener("click",()=>W(t.id));const i=Ce(t,e),s=ve(t,i),l=we(i&&i.anchor?i.anchor:e);if(o.parentNode!==l&&l.appendChild(o),o.style.zIndex=ge(l)?"":"9999",!i){o.style.display="none",r.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",ke(o,i,t),r.markers[t.id]={el:o,rect:i,frame:s}}function ve(t,e){const n=r.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const a=r.markerLayer||document.body;return o.parentNode!==a&&a.appendChild(o),o.style.setProperty("--wn-shot-frame",R(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function Ce(t,e){var n;if(t.type==="text"){const a=(e?[e]:q(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!a)return null;const i=he(a);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:a}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||r.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?V(t.target.xpath):null);if(!o)return null;const a=he(o);return a?{x:a.x,y:a.y,w:a.width,h:a.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function ke(t,e,n){const o=Qn(n),i=(t.offsetParent||document.body).getBoundingClientRect(),s=i.x+window.scrollX,l=i.y+window.scrollY,c=e.x+window.scrollX,p=e.y+window.scrollY;t.style.left=`${c-s+e.w+o.x+4}px`,t.style.top=`${p-l+o.y-4}px`}function Qn(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=r.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function $(){Object.entries(r.markers).forEach(([t,e])=>{const n=r.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:Ce(n);if(e.frame=ve(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const a=we(o.anchor);e.el.parentNode!==a&&a.appendChild(e.el),e.el.style.zIndex=ge(a)?"":"9999",ke(e.el,o,n),le(e.el,R(n))})}function to(){if(!r.panel)return;r.panel.style.display==="none"&&(r.panel.style.display="",st())}function eo(t){if(!r.panel)return;to();const e=r.panel.querySelector(".wn-annot-list");if(!e)return;e.querySelectorAll(".wn-annot-item").forEach(a=>a.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function W(t,e=!1,n,o){var l;const a=r.annotations.find(c=>c.id===t);if(!a)return;if(eo(t),a.status==="missing"){const c=J(a);if(c)a.status="active",Ot(a,c),A();else{B("Annotation introuvable sur cette page.");return}}const i=J(a);if(i){const c=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;c&&Dn(c)&&setTimeout(()=>{$()},160)}if(!((o||a.pageKey)===S(window.location.href))&&e){try{localStorage.setItem(Ct,JSON.stringify({id:a.id,pageKey:a.pageKey,pageUrl:n||a.pageUrl}))}catch(c){}window.location.href=n||a.pageUrl||window.location.href;return}if(a.type==="text"){const p=(q(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];p&&(p.scrollIntoView({behavior:"smooth",block:"center"}),Ft(p,R(a).base))}else if(a.type==="element"){const c=i&&i.el?i.el:(l=a.target)!=null&&l.xpath?V(a.target.xpath):null;c&&c.scrollIntoView&&(c.scrollIntoView({behavior:"smooth",block:"center"}),Ft(c,R(a).base))}else if(a.type==="screenshot"&&a.rect){window.scrollTo({top:Math.max(0,a.rect.y+a.rect.h/2-window.innerHeight/2),behavior:"smooth"});const c=r.markers[a.id];c&&c.frame&&Ft(c.frame,R(a).base)}}function Ft(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=r.colors)==null?void 0:i.element)==null?void 0:s.base)||"#4e9cf6",a=T(o,.6,"rgba(78,156,246,0.6)");t.style.boxShadow=`0 0 0 3px ${a}`,setTimeout(()=>{t.style.boxShadow=n},800)}function Ee(){if(!r.panel)return null;let t=r.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://uxnote.ninefortyone.studio",e.target="_blank",e.rel="noreferrer noopener",e.textContent="\xA9 UxNote \u2013 by NineFortyOne.Studio",t.appendChild(e),r.panel.appendChild(t)}return t}function A(){const t=r.panel.querySelector(".wn-annot-list"),e=r.panel.querySelector("h3");if(t.innerHTML="",!r.annotations.length){const o=document.createElement("div");o.className="wn-annot-empty",o.textContent="No annotations yet.",t.appendChild(o),e&&(e.textContent="Annotations (0)");const a=Ee();return}const n=r.annotations.slice().sort((o,a)=>o.createdAt-a.createdAt).filter(o=>{const a=r.filters.query,i=`${o.comment||""} ${o.snippet||""}`.toLowerCase();return!a||i.includes(a)});e&&(e.textContent=`Annotations (${n.length})`),n.forEach((o,a)=>{const i=document.createElement("div");i.className="wn-annot-item",i.dataset.id=o.id,Ln(i,R(o));const s=document.createElement("div");s.className="wn-annot-card-top";const l=document.createElement("div");l.className="wn-annot-card-top-left";const c=document.createElement("div");if(c.className="wn-annot-number",c.textContent=`#${a+1}`,l.appendChild(c),o.status==="missing"){const x=document.createElement("div");x.className="wn-annot-missing",x.textContent="Missing",l.appendChild(x)}const p=document.createElement("div");p.className="wn-annot-card-top-right";const m=document.createElement("button");m.type="button",m.className="wn-annot-edit wn-annotator",m.setAttribute("aria-label","Edit this annotation"),m.innerHTML=ho(),m.addEventListener("click",async x=>{x.stopPropagation(),await oo(o.id)}),p.appendChild(m);const y=document.createElement("button");y.type="button",y.className="wn-annot-delete wn-annotator",y.setAttribute("aria-label","Delete this annotation"),y.innerHTML=Me(),y.addEventListener("click",x=>{x.stopPropagation(),no(o.id)}),p.appendChild(y),s.appendChild(l),s.appendChild(p);const h=document.createElement("div");h.className="wn-annot-comment";const b=o.comment||"\u2014";h.textContent=b;const f=document.createElement("div");f.className="wn-annot-meta";const u=new Date(o.createdAt),g=u.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),L=u.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});f.textContent=`${g} \u2022 ${L}`,l.appendChild(f);const N=document.createElement("button");N.type="button",N.className="wn-annot-showmore wn-annotator",N.textContent="See more",N.addEventListener("click",x=>{x.stopPropagation();const v=h.classList.toggle("expanded");N.textContent=v?"See less":"See more"}),b.length<160&&(N.style.display="none"),i.appendChild(s),i.appendChild(h);const Q=No(o);if(Q){const x=document.createElement("div");x.className="wn-annot-shot";const v=document.createElement("img");v.src=Q,v.alt="The screenshot of this annotation",v.addEventListener("click",xt=>{xt.stopPropagation(),$o(Q)}),x.appendChild(v),i.appendChild(x)}i.appendChild(N),i.addEventListener("click",()=>{W(o.id,!0,o.pageUrl,o.pageKey),et()&&r.panel&&(r.panel.style.display="none",st())}),t.appendChild(i)}),Ee()}function no(t){const e=r.annotations.findIndex(n=>n.id===t);e!==-1&&(r.annotations.splice(e,1),M(),Rn(t),A(),U(),$())}async function oo(t){const e=r.annotations.find(a=>a.id===t);if(!e)return;const n=await ne("Edit this annotation",e.comment||"");if(!n)return;const{comment:o}=n;e.comment=o.trim(),M(),A()}async function ro(){!r.annotations.length||!await hn("Delete all annotations?","Delete")||(r.annotations=[],E?ko():M(),Y(),A(),U())}function ao(){const t=Le(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=Se(),o.click(),URL.revokeObjectURL(n)}function Le(t=r.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}async function io(){so(r.annotations)}function so(t){const e=Le(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(Se()),a=encodeURIComponent(n),i=(qe||"").trim(),s=i?encodeURIComponent(i):"",l="?";window.location.href=`mailto:${s}${l}subject=${o}&body=${a}`}function mt(){return"wn-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Ae(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Se(){const t=new Date,e=l=>String(l).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,a=(document.title||"").trim(),i=l=>l.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return a?s=`${i(a)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const z=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function lo(){return`
      <svg class="wn-annot-logo-img" viewBox="0 0 69 20" role="img" aria-label="Uxnote logo">
        <path d="M15.5141351,15.6336045 C15.0749867,15.7571123 13.3484743,16.0588732 13.7282884,18.0055773 C13.9814979,19.3033801 15.5809176,19.5099042 18.5265475,18.6251498 C24.7057419,17.0554179 32.6579091,16.101702 42.3830492,15.7640022 C56.9707594,15.2574524 60.5270025,16.163136 67.0775991,16.9762338 C68.0521554,17.1558296 69.5219587,16.163136 68.0521554,15.0188646 C63.2928783,12.8874893 28.8776434,11.9999303 15.5141351,15.6336045 Z" fill="#9E81FF"></path>
        <g transform="translate(-5, -4)">
          <path d="M11.1386719,19.2441406 C14.8007813,19.2441406 17.203125,17.1640625 17.203125,14 L17.203125,6.55859375 C17.203125,5.3671875 16.5488281,4.69335938 15.40625,4.69335938 C14.2734375,4.69335938 13.6191406,5.3671875 13.6191406,6.55859375 L13.6191406,13.6191406 C13.6191406,15.2597656 12.7304688,16.2363281 11.1386719,16.2363281 C9.53710938,16.2363281 8.6484375,15.2597656 8.6484375,13.6191406 L8.6484375,6.55859375 C8.6484375,5.3671875 7.99414062,4.69335938 6.86132812,4.69335938 C5.72851562,4.69335938 5.06445312,5.3671875 5.06445312,6.55859375 L5.06445312,14 C5.06445312,17.1640625 7.46679688,19.2441406 11.1386719,19.2441406 Z" fill="#000000" fill-rule="nonzero"></path>
          <path d="M18.8613631,11.140625 C19.2434527,11.140625 19.4404676,11.0348981 19.7628556,10.5961316 L20.8494228,9.12124174 L20.8912139,9.12124174 L22.0195721,10.6384224 C22.2703183,10.9767483 22.455393,11.140625 22.8852437,11.140625 C23.458378,11.140625 23.8941989,10.8287307 23.8941989,10.3106691 C23.8941989,10.0992153 23.816587,9.91947963 23.655393,9.72917126 L22.3061392,8.11683645 L23.6076318,6.61022852 C23.8344974,6.35648403 23.9121094,6.171462 23.9121094,5.93357654 C23.9121094,5.45251927 23.5240497,5.140625 22.9330049,5.140625 C22.5330049,5.140625 22.3061392,5.29392896 22.0136019,5.71155011 L21.016587,7.10185848 L20.9747959,7.10185848 L19.9598706,5.70626377 C19.6613631,5.28335628 19.4344974,5.140625 18.9867362,5.140625 C18.4136019,5.140625 17.9837512,5.48952368 17.9837512,5.9652946 C17.9837512,6.18732104 18.055393,6.37234306 18.2106168,6.55207874 L19.5598706,8.1591272 L18.216587,9.72388491 C17.9956915,9.97762941 17.9121094,10.1520787 17.9121094,10.3846779 C17.9121094,10.8340171 18.3061392,11.140625 18.8613631,11.140625 Z" fill="#9E81FF" fill-rule="nonzero"></path>
          <path d="M28.203125,19.2148438 C29.2675781,19.2148438 29.9023437,18.5800781 29.9023437,17.4375 L29.9023437,10.7285156 L29.9804688,10.7285156 L35.4101562,18.21875 C35.9277344,18.9316406 36.40625,19.2148438 37.1289063,19.2148438 C38.2128906,19.2148438 38.8183594,18.6191406 38.8183594,17.5351563 L38.8183594,6.47070313 C38.8183594,5.328125 38.1933594,4.69335938 37.1191406,4.69335938 C36.0546875,4.69335938 35.4199219,5.328125 35.4199219,6.47070313 L35.4199219,13.1015625 L35.3417969,13.1015625 L29.9511719,5.68945313 C29.4140625,4.98632812 28.9257812,4.69335938 28.2421875,4.69335938 C27.1289062,4.69335938 26.5039062,5.2890625 26.5039062,6.39257812 L26.5039062,17.4375 C26.5039062,18.5800781 27.1289062,19.2148438 28.203125,19.2148438 Z" fill="#000000" fill-rule="nonzero"></path>
          <path d="M45.8300781,19.2539062 C49.1796875,19.2539062 51.2695312,17.2324219 51.2695312,13.6777344 C51.2695312,10.1914062 49.1503906,8.11132812 45.8300781,8.11132812 C42.5292969,8.11132812 40.390625,10.2011719 40.390625,13.6777344 C40.390625,17.2226562 42.4804688,19.2539062 45.8300781,19.2539062 Z M45.8300781,16.7148438 C44.6386719,16.7148438 43.90625,15.6308594 43.90625,13.6875 C43.90625,11.7734375 44.6582031,10.6503906 45.8300781,10.6503906 C47.0117188,10.6503906 47.7636719,11.7734375 47.7636719,13.6875 C47.7636719,15.6308594 47.0117188,16.7148438 45.8300781,16.7148438 Z" fill="#000000" fill-rule="nonzero"></path>
          <path d="M53.4765625,16.1484375 C53.4765625,18.1210938 54.5214844,19.1367188 56.5722656,19.1367188 L56.6601562,19.1367188 C57.9980469,19.1367188 59.0917969,18.6289062 59.0917969,17.6230469 C59.0917969,16.8222656 58.6425781,16.4804688 57.8710938,16.3925781 L57.65625,16.3632813 C57.1679688,16.3144531 56.9433594,16.0507812 56.9433594,15.3867188 L56.9433594,10.9238281 L57.7832031,10.9238281 C58.5546875,10.9238281 59.0625,10.4160156 59.0625,9.64453125 C59.0625,8.87304688 58.5546875,8.36523437 57.7832031,8.36523437 L56.9433594,8.36523437 L56.9433594,7.515625 C56.9433594,6.39257812 56.3085938,5.71875 55.2148438,5.71875 C54.1113281,5.71875 53.4765625,6.39257812 53.4765625,7.515625 L53.4765625,8.36523437 L53.0957031,8.36523437 C52.3242188,8.36523437 51.8164062,8.86328125 51.8164062,9.64453125 C51.8164062,10.4160156 52.3242188,10.9238281 53.0957031,10.9238281 L53.4765625,10.9238281 L53.4765625,16.1484375 Z" fill="#000000" fill-rule="nonzero"></path>
          <path d="M65.3222656,19.2539062 C67.4414062,19.2539062 69.1601562,18.5019531 69.8632812,17.2519531 C70.0195312,16.9980469 70.0976562,16.734375 70.0976562,16.4707031 C70.0976562,15.7089844 69.5019531,15.2597656 68.7988281,15.2597656 C68.3691406,15.2597656 68.0859375,15.3769531 67.7246094,15.71875 C66.953125,16.5 66.2988281,16.8027344 65.3515625,16.8027344 C64.1015625,16.8027344 63.2519531,15.9238281 63.2519531,14.6347656 L63.2519531,14.4394531 L69.0332031,14.4394531 C69.9316406,14.4394531 70.4296875,13.9511719 70.4296875,13.0722656 C70.4296875,10.2011719 68.3496094,8.11132812 65.1855469,8.11132812 C61.9433594,8.11132812 59.8925781,10.2890625 59.8925781,13.7363281 C59.8925781,17.1933594 61.9140625,19.2539062 65.3222656,19.2539062 Z M63.3007812,12.4667969 C63.3886719,11.3535156 64.1796875,10.5722656 65.2539062,10.5722656 C66.3378906,10.5722656 67.109375,11.3144531 67.1679688,12.4667969 L63.3007812,12.4667969 Z" fill="#000000" fill-rule="nonzero"></path>
        </g>
        <path d="M15.5141351,15.6336045 C15.0749867,15.7571123 13.3484743,16.0588732 13.7282884,18.0055773 C13.9814979,19.3033801 15.5809176,19.5099042 18.5265475,18.6251498 C24.7057419,17.0554179 32.6579091,16.101702 42.3830492,15.7640022 C56.9707594,15.2574524 60.5270025,16.163136 67.0775991,16.9762338 C68.0521554,17.1558296 69.5219587,16.163136 68.0521554,15.0188646 C63.2928783,12.8874893 28.8776434,11.9999303 15.5141351,15.6336045 Z" fill-opacity="0.3" fill="#9E81FF"></path>
      </svg>
    `}function Te(){return z(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function co(){return z(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function po(){return z(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function uo(){return z(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function mo(){return z(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function fo(){return z(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function ho(){return Te()}function Me(){return`
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
    `}function wo(){return z(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function Ne(){return z(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function $e(){return z(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function go(){return k==="top"?Ne():$e()}function ze(){return`
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
    `}function xo(){return`
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
    `}function S(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function Ie(){try{const t=localStorage.getItem(Ct);if(!t)return;const e=JSON.parse(t);e.pageKey===S(window.location.href)&&W(e.id,!1),localStorage.removeItem(Ct)}catch(t){}}let j=new Map,Bt=Promise.resolve(),K=!1;const bo={pending:"Checking the server",ok:"Server connected",refused:"Server refused it: check the address or the key",unreachable:"Server unreachable: notes stay in this browser"};function Re(){const t=r.syncDot;if(!t)return;const e=r.syncStatus||"pending",n=bo[e];t.setAttribute("data-sync-status",e),t.setAttribute("data-tip",n),t.setAttribute("aria-label",n)}function ft(t){r.syncStatus!==t&&(r.syncStatus=t,Re())}async function Z(t,e){let n;try{n=await fetch(t,e)}catch(o){throw ft("unreachable"),o}if(!n.ok)throw ft("refused"),new Error(`HTTP ${n.status}`);return ft("ok"),n}function Oe(){return`${E.url}/annotations?site=${encodeURIComponent(C)}`}function Pe(t){return`${E.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function yo(t){return`${E.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function G(t){const e=Object.assign({},t);return E.apiKey&&(e["X-Uxnote-Key"]=E.apiKey),e}function Fe(t){return new Map(t.map(e=>[e.id,JSON.stringify(e)]))}function ht(t,e){console.warn("Uxnote sync:",t,e),!K&&(K=!0,B(t))}function wt(t){return Bt=Bt.then(t,t),Bt}async function Ut(){if(E)try{const t=await Z(Oe(),{headers:G({Accept:"application/json"})});let e;try{e=await t.json()}catch(n){throw ft("refused"),n}r.annotations=(e&&e.annotations||[]).filter($t),r.annotations.forEach(n=>{n.pageKey||(n.pageKey=S(n.pageUrl||window.location.href))}),j=Fe(r.annotations),K=!1,Y(),_(),U(),A(),Ie()}catch(t){ht("Uxnote: could not read the annotations from the server",t)}}function Be(){if(!E)return;const t=Fe(r.annotations);t.forEach((e,n)=>{j.get(n)!==e&&wt(()=>vo(n,e))}),j.forEach((e,n)=>{t.has(n)||wt(()=>Co(n))})}async function vo(t,e){try{await Z(Pe(t),{method:"PUT",headers:G({"Content-Type":"application/json"}),body:e}),j.set(t,e),K=!1}catch(n){ht("Uxnote: could not save this annotation on the server",n)}}async function Co(t){try{await Z(Pe(t),{method:"DELETE",headers:G()}),j.delete(t),K=!1}catch(e){ht("Uxnote: could not delete this annotation on the server",e)}}function ko(){E&&wt(async()=>{try{await Z(Oe(),{method:"DELETE",headers:G()}),j=new Map,K=!1}catch(t){ht("Uxnote: could not delete the annotations on the server",t)}})}let gt=null,Ue=S(window.location.href);function Eo(){gt=null;const t=S(window.location.href);t!==Ue&&(Ue=t,Y(),_(),U(),A(),wt(Ut))}function He(){gt&&clearTimeout(gt),gt=setTimeout(Eo,120)}function Lo(){["pushState","replaceState"].forEach(t=>{const e=history[t];typeof e=="function"&&(history[t]=function(...o){const a=e.apply(this,o);return He(),a})}),window.addEventListener("popstate",He)}function De(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Ao(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const a=document.createElement("span");a.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(a),o.appendChild(i);const s=u=>{const g=!!u&&u.w>=4&&u.h>=4;n.style.display=g?"block":"none",g&&(n.style.left=`${u.x}px`,n.style.top=`${u.y}px`,n.style.width=`${u.w}px`,n.style.height=`${u.h}px`)};s(null);const l=u=>({x:Math.min(Math.max(u.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(u.clientY,0),document.documentElement.clientHeight)}),c=(u,g)=>({x:Math.min(u.x,g.x),y:Math.min(u.y,g.y),w:Math.abs(g.x-u.x),h:Math.abs(g.y-u.y)});let p=null;const m=u=>{u.preventDefault(),p=l(u),s(null)},y=u=>{p&&(u.preventDefault(),s(c(p,l(u))))},h=u=>{if(!p)return;const g=c(p,l(u));if(p=null,g.w<4||g.h<4){s(null);return}b({x:g.x+window.scrollX,y:g.y+window.scrollY,w:g.w,h:g.h})},b=u=>{document.removeEventListener("keydown",f,!0),document.removeEventListener("mousemove",y,!0),document.removeEventListener("mouseup",h,!0),e.remove(),o.remove(),t(u)},f=u=>{u.key==="Escape"&&(u.preventDefault(),b(null))};e.addEventListener("mousedown",m),i.addEventListener("click",()=>b(null)),document.addEventListener("mousemove",y,!0),document.addEventListener("mouseup",h,!0),document.addEventListener("keydown",f,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function So(t){const e=await window.snapdom.toCanvas(document.body,{scale:1,exclude:[".wn-annotator",".wn-annot-dimmer"],excludeMode:"remove"}),n=document.body.getBoundingClientRect(),o=n.width?e.width/n.width:1,a=n.left+window.scrollX,i=n.top+window.scrollY,s=Math.max(0,Math.round((t.x-a)*o)),l=Math.max(0,Math.round((t.y-i)*o)),c=Math.min(e.width-s,Math.max(1,Math.round(t.w*o))),p=Math.min(e.height-l,Math.max(1,Math.round(t.h*o)));if(c<1||p<1)return null;const m=document.createElement("canvas");return m.width=c,m.height=p,m.getContext("2d").drawImage(e,s,l,c,p,0,0,c,p),{canvas:m,w:c,h:p}}async function To(){if(!(!De()||r.mode==="screenshot")){F("screenshot");try{const t=await Ao();if(!t)return;const e=So(t).catch(c=>(console.warn("Uxnote screenshot:",c),null)),n=await At("Comment for this region?");if(!n)return;const o=await e;if(!o){B("Uxnote: could not capture that region");return}const{comment:a}=n,i=mt();let s=null;if(E){const c=await new Promise(m=>o.canvas.toBlob(m,"image/png")),p=c?await Mo(c,i):null;if(!p){B("Uxnote: could not send the screenshot to the server");return}s={url:p.url,w:o.w,h:o.h,capturedAt:Date.now()}}else s={dataUrl:o.canvas.toDataURL("image/png"),w:o.w,h:o.h,capturedAt:Date.now()};const l={id:i,type:"screenshot",comment:a.trim(),snippet:"",pageUrl:window.location.href,pageKey:S(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:s,createdAt:Date.now(),status:"active"};r.annotations.push(l),M(),D(l,null),A()}finally{F(null)}}}async function Mo(t,e){try{const o=await(await Z(yo(e),{method:"PUT",headers:G({"Content-Type":"image/png"}),body:t})).json();return o&&o.url?o:null}catch(n){return console.warn("Uxnote screenshot:",n),null}}function No(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=E?new URL(`${E.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function $o(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=()=>{document.removeEventListener("keydown",a,!0),e.remove()},a=i=>{i.key==="Escape"&&(i.preventDefault(),o())};e.addEventListener("click",o),document.addEventListener("keydown",a,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Gt):Gt(),window.Uxnote={refresh:$,setHidden:t=>at(!!t),toggleVisibility:()=>at(!r.hidden),isHidden:()=>!!r.hidden,sync:{pull:Ut,push:Be,url:()=>E?E.url:null}}})();})();
