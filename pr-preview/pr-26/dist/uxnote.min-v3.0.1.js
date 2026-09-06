(()=>{var ai=Object.defineProperty,ri=Object.defineProperties;var ii=Object.getOwnPropertyDescriptors;var yo=Object.getOwnPropertySymbols;var si=Object.prototype.hasOwnProperty,li=Object.prototype.propertyIsEnumerable;var vo=(u,w,T)=>w in u?ai(u,w,{enumerable:!0,configurable:!0,writable:!0,value:T}):u[w]=T,Oe=(u,w)=>{for(var T in w||(w={}))si.call(w,T)&&vo(u,T,w[T]);if(yo)for(var T of yo(w))li.call(w,T)&&vo(u,T,w[T]);return u},ko=(u,w)=>ri(u,ii(w));(()=>{if(window.Uxnote)return;const u=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),w=t=>u?u.getAttribute(t):null,T=`${location.protocol}//${location.host}`,Eo=u&&(u.dataset.mailto||u.dataset.email||u.dataset.to)||"",Kt=w("isToolVisibleAtFirstLaunch")||w("istoolvisibleatfirstlaunch")||u&&(u.dataset.isToolVisibleAtFirstLaunch||u.dataset.istoolvisibleatfirstlaunch),qt=w("isToolOnTopAtLaunch")||w("istoolontopatlaunch")||u&&(u.dataset.isToolOnTopAtLaunch||u.dataset.istoolontopatlaunch),Co=u&&(u.dataset.hiddentoolbydefault||u.dataset.hidden||u.dataset.collapsed||u.dataset.startHidden||""),To=w("colorForHighlight")||w("colorForHighligh")||u&&(u.dataset.colorForHighlight||u.dataset.colorForHighligh),Ao=w("colorForTextHighligh")||w("colorForTextHighlight")||u&&(u.dataset.colorForTextHighligh||u.dataset.colorForTextHighlight),Lo=w("colorForElementHighlight")||w("colorForElementHighligh")||u&&(u.dataset.colorForElementHighlight||u.dataset.colorForElementHighligh),So=w("colorForRegionHighlight")||u&&u.dataset.colorForRegionHighlight,Mo="#4e9cf6",Qo="#8b5cf6",No="#f59f00",Yt=Lt(To),ze=Yt||Mo,He=Yt||Qo,Io=At(Ao||ze,ze),$o=At(Lo||He,He),Re=Yt||No,Po=At(So||Re,Re),Xt={text:de(Io,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:de($o,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:de(Po,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let E=qt!=null?Y(qt,!1)?"top":"bottom":u&&u.dataset.position||"bottom";const Be="wn-toolbar-pos",Fe="wn-panel-view",kt=u&&(u.dataset.dock||u.dataset.layout)||"",_t=`uxnote:site:${T}`,Ue=`${_t}:synced`,De=`uxnote:import-files:${T}`,je=`uxnote:hidden:${T}`,Wt=`uxnote:pending:${T}`,Ve=(u&&u.dataset.serverUrl||"").trim().replace(/\/+$/,""),b=Ve?{url:Ve,apiKey:u&&u.dataset.serverApiKey||""}:null,Ke=Y(u&&u.dataset.jsonExport,!0),Jt=Y(u&&u.dataset.jsonImport,!0),qe=Eo.trim(),Oo=/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(qe),Et=(u&&u.dataset.theme||"").trim().toLowerCase(),nt=Et==="light"||Et==="dark"||Et==="reverse-auto"?Et:"auto",zo=nt==="auto"||nt==="reverse-auto",Zt=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,Gt=window.matchMedia?window.matchMedia("(pointer: coarse) and (hover: none)"):null,te=window.matchMedia?window.matchMedia("(max-width: 640px), (max-height: 480px)"):null;function F(){return Gt?Gt.matches:"ontouchstart"in window||navigator.maxTouchPoints>0}function I(){return te?te.matches:window.innerWidth<=640||window.innerHeight<=480}function ee(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}const Ho=w("isBackdropVisible")||w("isbackdropvisible")||w("backdropVisible")||w("backdropvisible")||u&&(u.dataset.isBackdropVisible||u.dataset.isbackdropvisible||u.dataset.backdropVisible||u.dataset.backdropvisible||u.dataset.dim||u.dataset.dimpage||u.dataset.dimmer||u.dataset.overlay||u.dataset.dimLevel||u.dataset.dimlevel||u.dataset.dimstrength),Ro=.2,Ye=Y(Ho,!F()),a={mode:null,annotations:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,selectionBar:null,selectionTimer:null,selectionRange:null,elementPicker:null,elementTrail:[],elementTrailIndex:0,toolbar:null,panel:null,panelView:"rail",cards:new Map,focusedId:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,markerLayer:null,syncDot:null,syncStatus:null,syncPending:new Set,shotObserver:null,colors:Xt,customPosition:!1,dimEnabled:Ye,dimOpacity:Ye?Ro:0,dimOverlay:null,filters:{query:"",sort:"oldest",group:"none"},bands:new Map,hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null,note:null,noteAnchor:null,noteTimer:null};function Xe(){const t=ca();t&&(E=t);const e=pa(),n=Kt!=null?!Y(Kt,!0):null;a.hidden=e!==null?e:n!==null?n:Y(Co,!1),a.panelView=da(),Jt&&(a.importFiles=ma()),_e(),ha(),ln(),Bo(),jo(),Vo(),Mt(a.hidden),wa(),b&&!Dr()&&(a.annotations=[]),ft(),Ce(),Ln(),Ga(),b||Ie(),b&&(B(Ut),Vr()),aa()}function _e(){const t=getComputedStyle(document.body);a.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function Bo(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
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
        /* This bar is fixed over the page under review, so its height is page
           the reviewer cannot see. The room around the controls is the only
           part of that height it can give back: the controls themselves are
           the box a finger is hit on and stay it, on every pointer. What is
           left is the 2px that keeps an active control off the edge. */
        padding: 2px 14px;
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
        --wn-btn-size: 50px;
        box-sizing: border-box;
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
      /* Two controls the rail has no room for and no use for: it holds one
         column in the order the notes were made in. */
      .wn-annot-arrange {
        display: none;
        align-items: center;
        gap: 10px;
      }
      .wn-annot-arrange label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--wn-text-faint);
      }
      .wn-annot-arrange select {
        height: 34px;
        border-radius: 12px;
        border: 1px solid var(--wn-border);
        background: var(--wn-surface-input);
        color: var(--wn-text);
        font-size: 12px;
        padding: 0 8px;
        cursor: pointer;
      }
      .wn-annot-arrange select:focus {
        outline: none;
        border-color: rgba(109, 86, 199, 0.6);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.14);
      }
      .wn-annot-band {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--wn-text-faint);
      }
      .wn-annot-band-count {
        color: var(--wn-text-muted);
        background: rgba(109, 86, 199, 0.1);
        border-radius: 999px;
        padding: 1px 8px;
      }
      .wn-annot-band::after {
        content: '';
        flex: 1 1 auto;
        height: 1px;
        background: var(--wn-border);
      }
      .wn-annot-item:focus-visible {
        outline: 2px solid var(--wn-item-accent-strong, var(--wn-accent));
        outline-offset: 2px;
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
      /* Four symbols and a named button in the head of a 360px rail. They
         drop below the title together rather than one at a time, so a long
         count never leaves a single icon stranded on its own line. */
      .wn-annot-panel-top {
        flex-wrap: wrap;
      }
      .wn-annot-panel-top h3 {
        flex: 1 1 auto;
      }
      .wn-annot-panel-tools {
        display: inline-flex;
        align-items: center;
        flex: 0 0 auto;
        margin-left: auto;
        gap: 4px;
      }
      .wn-annot-panel-view,
      .wn-annot-panel-io {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 28px;
        padding: 0;
        border-radius: 10px;
        border: 1px solid var(--wn-border);
        background: rgba(109, 86, 199, 0.08);
        color: var(--wn-text-muted);
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-panel-view:hover,
      .wn-annot-panel-io:hover {
        background: rgba(109, 86, 199, 0.16);
        color: var(--wn-text);
      }
      .wn-annot-panel-io:active {
        transform: translateY(1px);
      }
      .wn-annot-panel-view.active {
        background: rgba(109, 86, 199, 0.2);
        border-color: rgba(109, 86, 199, 0.4);
        color: var(--wn-text);
      }
      .wn-annot-panel-view svg,
      .wn-annot-panel-io svg {
        width: 16px;
        height: 16px;
      }
      /* The word each symbol stands for. A pointer reads it on hover, so here
         it is only the label a layout without hover falls back to. */
      .wn-annot-panel-io span {
        display: none;
      }
      /* A symbol on its own says little, so it is named on hover, the way the
         bar names its own. The label hangs from the right edge of the head,
         which is the edge these buttons sit against. */
      @media (hover: hover) {
        .wn-annot-panel-tools button[data-tip] {
          position: relative;
        }
        .wn-annot-panel-tools button[data-tip]::after {
          content: attr(data-tip);
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: rgba(35, 31, 74, 0.92);
          color: #fff;
          padding: 6px 8px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-2px);
          transition: opacity 0.12s ease, transform 0.12s ease;
        }
        .wn-annot-panel-tools button[data-tip]:hover::after {
          opacity: 1;
          transform: translateY(0);
        }
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
      /* Which of the three kinds this is, in the kind's own colour, read
         before any of the words beside it. */
      .wn-annot-kind {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        height: 22px;
        padding: 0 4px;
        border-radius: 8px;
        background: var(--wn-item-accent, var(--wn-accent));
        color: var(--wn-item-accent-text, #ffffff);
        font-size: 11px;
        font-weight: 700;
      }
      .wn-annot-kind svg {
        width: 14px;
        height: 14px;
      }
      .wn-annot-kind-label {
        display: none;
      }
      .wn-annot-quote {
        font-size: 12px;
        line-height: 1.5;
        color: var(--wn-text);
        border-left: 3px solid var(--wn-item-accent, var(--wn-accent));
        padding: 1px 0 1px 10px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .wn-annot-target {
        align-self: flex-start;
        max-width: 100%;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 11px;
        color: var(--wn-text-muted);
        background: rgba(109, 86, 199, 0.08);
        border: 1px solid var(--wn-border);
        border-radius: 8px;
        padding: 3px 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .wn-annot-fact {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        max-width: 100%;
        font-size: 11px;
        color: var(--wn-text-muted);
        background: rgba(109, 86, 199, 0.06);
        border: 1px solid var(--wn-border);
        border-radius: 999px;
        padding: 3px 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      /* The name of the fact is the quieter half of it: a reviewer reads the
         author, not the word Author. */
      .wn-annot-fact b {
        font-weight: 700;
        color: var(--wn-text-faint);
      }
      /* Every note on the page being read makes a page chip on every card
         that says nothing. It is drawn where the set spans more than the one. */
      .wn-annot-list:not(.is-multipage) .wn-annot-fact.is-page {
        display: none;
      }
      .wn-annot-fact.is-elsewhere {
        color: var(--wn-accent);
        border-color: rgba(109, 86, 199, 0.4);
        background: rgba(109, 86, 199, 0.12);
      }
      .wn-annot-fact.is-sent {
        color: #2ea043;
        border-color: rgba(46, 160, 67, 0.35);
        background: rgba(46, 160, 67, 0.1);
      }
      .wn-annot-fact.is-pending {
        color: #b5820f;
        border-color: rgba(210, 153, 34, 0.4);
        background: rgba(210, 153, 34, 0.12);
      }
      .wn-annot-fact.is-local {
        color: var(--wn-danger);
        border-color: rgba(224, 91, 91, 0.35);
        background: rgba(224, 91, 91, 0.1);
      }
      :root[data-wn-theme="dark"] .wn-annot-fact.is-sent {
        color: #56d364;
      }
      :root[data-wn-theme="dark"] .wn-annot-fact.is-pending {
        color: #e3b341;
      }
      /* The rail has room for the note and little else. Everything a 360px
         column has to drop is built once and drawn where there is room. */
      .wn-annot-detail,
      .wn-annot-facts {
        display: none;
      }
      /* The full-size view. Full width, and vertically the room between the
         two toolbar positions: --wn-bar-reserve is the bar's height given up
         at the top and at the bottom at once, so the view clears the bar
         wherever it is and nothing moves when the reviewer swaps it over. The
         geometry itself is written inline beside the rail's, which is inline
         too and would otherwise beat any rule here. */
      .wn-annot-panel.is-full {
        padding: 14px 24px 8px;
        border-left: none;
        border-right: none;
        overflow: hidden;
        box-shadow: 0 0 30px var(--wn-shadow);
      }
      .wn-annot-panel.is-full .wn-annot-panel-head {
        gap: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--wn-border);
      }
      .wn-annot-panel.is-full h3 {
        margin: 0;
        font-size: 16px;
        white-space: nowrap;
      }
      .wn-annot-panel.is-full .wn-annot-filters {
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 0;
      }
      .wn-annot-panel.is-full .wn-annot-filter-row {
        flex: 1 1 240px;
        max-width: 420px;
      }
      .wn-annot-panel.is-full .wn-annot-arrange {
        display: inline-flex;
      }
      /* A heading owns the width of the grid, not one cell of it. */
      .wn-annot-panel.is-full .wn-annot-band {
        grid-column: 1 / -1;
        margin: 4px 0 -4px;
      }
      /* An empty list in a full-size view is mostly room. The one thing it
         has to say belongs in the middle of it, not in a corner. */
      .wn-annot-panel.is-full .wn-annot-empty {
        grid-column: 1 / -1;
        max-width: 460px;
        margin: 48px auto 0;
        padding: 26px 20px;
      }
      .wn-annot-panel.is-full .wn-annot-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
        align-content: start;
        /* Each card is as tall as what it holds. Stretching them to the
           tallest of their row gives a one-word note the height of a capture
           and fills the difference with nothing. */
        align-items: start;
        gap: 14px;
        padding: 14px 2px 10px;
        overflow-y: auto;
      }
      /* The cards of a row are as tall as the tallest of them, and the facts
         sit on the floor of each. A ragged bottom edge reads as a layout that
         has gone wrong; a row of cards that end together does not. */
      .wn-annot-panel.is-full .wn-annot-item {
        margin-bottom: 0;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .wn-annot-panel.is-full .wn-annot-card-top {
        margin-bottom: 0;
      }
      /* The stamp takes a line of its own rather than wrapping on to one at
         whatever width the kind's name happens to run out of room. */
      .wn-annot-panel.is-full .wn-annot-meta {
        flex-basis: 100%;
      }
      .wn-annot-panel.is-full .wn-annot-shot {
        margin: 0;
      }
      .wn-annot-panel.is-full .wn-annot-showmore {
        margin-top: 0;
      }
      .wn-annot-panel.is-full .wn-annot-kind {
        padding-right: 9px;
      }
      .wn-annot-panel.is-full .wn-annot-kind-label {
        display: inline;
      }
      .wn-annot-panel.is-full .wn-annot-comment {
        font-size: 13px;
        color: var(--wn-text);
        background: transparent;
        border: none;
        border-radius: 0;
        padding: 0;
        -webkit-line-clamp: 5;
      }
      .wn-annot-panel.is-full .wn-annot-comment.expanded {
        -webkit-line-clamp: unset;
      }
      .wn-annot-panel.is-full .wn-annot-detail {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wn-annot-panel.is-full .wn-annot-facts {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding-top: 2px;
      }
      /* The picture at the size it was taken at, up to the room a card has.
         A capture taller than it is wide keeps its height rather than being
         letterboxed down to a strip; full size is still a click away. */
      .wn-annot-panel.is-full .wn-annot-shot.is-pending {
        min-height: 170px;
      }
      .wn-annot-panel.is-full .wn-annot-shot img {
        max-height: 260px;
        max-width: 100%;
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
        margin: 0;
        inset: auto;
        padding: 0;
        border: 2px dashed var(--wn-element-highlight, #8b5cf6);
        background: var(--wn-element-highlight-soft, rgba(139,92,246,0.1));
        pointer-events: none;
        z-index: 2147482800;
      }
      /* A mark on the page says where a note is. This says what it says, and
         opens it for editing, without a trip to the panel. It takes the
         pointer, so the pointer can travel from the mark into it. */
      .wn-annot-note {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 2147483090;
        display: none;
        flex-direction: column;
        gap: 8px;
        width: max-content;
        max-width: 320px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid var(--wn-border);
        background: var(--wn-surface);
        color: var(--wn-text);
        box-shadow: 0 12px 28px var(--wn-shadow);
        font-family: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        font-size: 12px;
        line-height: 1.5;
      }
      .wn-annot-note.show {
        display: flex;
      }
      .wn-annot-note-top {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }
      .wn-annot-note-kind {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--wn-item-accent-strong, var(--wn-text-muted));
      }
      .wn-annot-note-kind svg {
        width: 13px;
        height: 13px;
      }
      .wn-annot-note-number {
        font-size: 11px;
        font-weight: 800;
        color: var(--wn-text-muted);
        background: var(--wn-item-number-bg, rgba(109, 86, 199, 0.1));
        border: 1px solid var(--wn-item-number-border, transparent);
        border-radius: 999px;
        padding: 1px 7px;
      }
      .wn-annot-note-edit {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin-left: auto;
        width: 26px;
        height: 26px;
        padding: 0;
        border-radius: 8px;
        border: 1px solid var(--wn-border);
        background: rgba(109, 86, 199, 0.08);
        color: var(--wn-text-muted);
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-note-edit:hover {
        background: rgba(109, 86, 199, 0.18);
        color: var(--wn-text);
      }
      .wn-annot-note-edit svg {
        width: 14px;
        height: 14px;
      }
      /* A comment is whatever was typed, newlines and long words included,
         and a very long one scrolls inside the bubble rather than growing it
         past the screen. */
      .wn-annot-note-text {
        white-space: pre-wrap;
        overflow-wrap: anywhere;
        max-height: 180px;
        overflow-y: auto;
        color: var(--wn-text);
      }
      .wn-annot-note-text.is-empty {
        color: var(--wn-text-faint);
        font-style: italic;
      }
      .wn-annot-toast {
        position: fixed;
        margin: 0;
        inset: auto;
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
        margin: 0;
        inset: auto;
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
      /* The prompt is a dialog the widget opens modally, so it stays live over
         a host page's own modal: the top layer holds the newest one and makes
         everything under it inert. The look is the card's own -- what is
         reset here is what the UA gives a modal dialog and the card already
         carries: the centring margin and inset, and the room a scroller
         needs. */
      .wn-annot-comment-dialog {
        margin: 0;
        inset: auto;
        max-height: none;
        overflow: visible;
      }
      .wn-annot-comment-dialog:not([open]) { display: none; }
      /* The backdrop is the dialog's own box for a hit test, and a card that
         reads as hovered wherever the pointer is left never goes translucent
         again. Nothing under a modal dialog answers a pointer anyway. */
      .wn-annot-comment-dialog::backdrop {
        background: var(--wn-backdrop);
        pointer-events: none;
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
      /* The frame a picture that has not been asked for yet stands in. Without
         a box of its own nothing would ever come on screen to ask for it. */
      .wn-annot-shot.is-pending {
        min-height: 84px;
        border: 1px dashed var(--wn-border);
        border-radius: 10px;
        background: rgba(109, 86, 199, 0.05);
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
        /* Import wants a file already on the device, which a phone picker
           cannot usefully give; mail rides the share sheet the export opens
           here. The export itself stays, and is the whole handoff. */
        .wn-annot-panel-io[data-action='import'],
        .wn-annot-panel-io[data-action='mail'] {
          display: none;
        }
        /* Nothing hovers here, so the symbol that is left carries its word
           rather than waiting to be asked for it. */
        .wn-annot-panel-io {
          width: auto;
          height: auto;
          gap: 6px;
          padding: 8px 14px;
          font-weight: 700;
          font-size: 13px;
        }
        .wn-annot-panel-io span {
          display: inline;
        }
        /* A compact layout is already a sheet, and the full-size view is the
           room a pointer layout has. The class never reaches here. */
        .wn-annot-panel-view {
          display: none;
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
        .wn-annot-delete-all {
          min-height: 44px;
          padding: 8px 14px;
          font-size: 13px;
        }
        .wn-annot-panel-view,
        .wn-annot-panel-io {
          min-width: 44px;
          min-height: 44px;
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
    `,document.head.appendChild(t)}const Fo=["commentModal","dialogModal"];function ne(t,e){const n=document.createElement("div");n.className="wn-annot-sheet-grip wn-annotator";const o=document.createElement("span");o.className="wn-annot-sheet-handle wn-annotator",o.setAttribute("aria-hidden","true");const r=document.createElement("button");return r.type="button",r.className="wn-annot-sheet-close wn-annotator",r.setAttribute("aria-label",t),r.innerHTML=Zn(),r.addEventListener("click",i=>{i.stopPropagation(),e()}),n.appendChild(o),n.appendChild(r),Uo(n,e),n}function Uo(t,e){let n=null,o=0,r=0,i=0;const s=l=>{n&&(i=Math.max(0,l.clientY-o),n.style.transform=`translateY(${i}px)`)},c=()=>{if(!n)return;t.removeEventListener("pointermove",s),t.removeEventListener("pointerup",c),t.removeEventListener("pointercancel",c);const l=n.getBoundingClientRect().height||1,d=i/Math.max(1,Date.now()-r);n.style.transform="",n.style.transition="",n=null,(i>l/3||i>40&&d>.5)&&e()};t.addEventListener("pointerdown",l=>{l.target.closest(".wn-annot-sheet-close")||(n=t.closest(".wn-annot-sheet"),n&&(o=l.clientY,r=Date.now(),i=0,n.style.transition="none",t.setPointerCapture&&t.setPointerCapture(l.pointerId),t.addEventListener("pointermove",s),t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)))})}function Do(){return a.hidden||!I()?!1:a.panel&&a.panel.style.display!=="none"?!0:Fo.some(t=>We(a[t]))}function We(t){return t?t.dialog?t.dialog.open:t.backdrop.classList.contains("show"):!1}function U(){const t=Do();if(t===!!a.scrollLocked)return;const e=document.documentElement;a.scrollLocked=t,t?(a.scrollLockPrev=e.style.overflow,e.style.overflow="hidden"):(e.style.overflow=a.scrollLockPrev||"",a.scrollLockPrev="")}function q(){const t=document.documentElement,e=(i,s)=>{t.style.setProperty("--wn-sheet-bottom",`${i}px`),t.style.setProperty("--wn-sheet-top-guard",`${s}px`)};if(!a.toolbar||!I()||a.hidden){e(0,0);return}const n=a.toolbar.getBoundingClientRect(),o=8,r=t.clientHeight;if(E==="top"){e(0,Math.max(0,Math.round(n.bottom+o)));return}e(Math.max(0,Math.round(r-n.top+o)),0)}function ot(t){a.panel&&(a.panel.style.display=t?"":"none",ue(),U())}function Je(){const t=a.toolbar;if(!t)return;const e=I(),n=p=>{const h=document.createElement("button");return h.className="wn-annot-btn wn-annotator",h.setAttribute("data-action",p.action),p.mode&&h.setAttribute("data-mode",p.mode),h.setAttribute("data-tip",p.tip),h.innerHTML=p.icon,h},o=p=>{const h=document.createElement("div");return h.className="wn-annot-group wn-annotator",p.forEach(m=>h.appendChild(n(m))),h},r=()=>{const p=document.createElement("div");return p.className="wn-annot-spacer wn-annotator",p},i=a.visibilityToggle;i&&i.parentNode===t&&t.removeChild(i),t.innerHTML="";const s=document.createDocumentFragment(),c=document.createElement("div");if(c.className="wn-annot-logo wn-annotator",c.innerHTML=Sr(),s.appendChild(c),b){const p=document.createElement("div");p.className="wn-annot-sync-dot wn-annotator",p.setAttribute("role","status"),s.appendChild(p),a.syncDot=p,ro()}const l=[{action:"mode",mode:"text",tip:"Highlight text",icon:Ne()},{action:"mode",mode:"element",tip:"Annotate an element",icon:Xn()}];go()&&l.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:_n()});const d=[];e||d.push({action:"toggle-pos",tip:"Toolbar top / bottom",icon:Or()}),d.push({action:"toggle-panel",tip:"Show / hide annotations",icon:Pr()}),s.appendChild(r()),s.appendChild(o(l)),s.appendChild(r()),s.appendChild(o(d)),t.appendChild(s),he(),ie(),ue(),ae()}function oe(t,e,n,o,r){return t?`<button class="wn-annot-panel-io wn-annotator" type="button" data-action="${e}" data-tip="${n}" aria-label="${n}">${r}<span>${o}</span></button>`:""}function Ze(){Je(),st(),ce(),X(),R(),at(),lt(),q(),xn(),U(),$()}function jo(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${E}`,document.body.appendChild(t),a.toolbar=t,Je();const e=document.createElement("div");e.className="wn-annot-panel wn-annot-sheet wn-annotator",e.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <div class="wn-annot-panel-tools wn-annotator">
            <button class="wn-annot-panel-view wn-annotator" type="button"></button>
            ${oe(Jt,"import","Import JSON","Import",Qr())}
            ${oe(Ke,"export","Export JSON","Export",Mr())}
            ${oe(Oo,"mail","Send by mail","Mail",Nr())}
            <button class="wn-annot-delete-all wn-annotator" type="button">
              ${Jn()}<span>All</span>
            </button>
          </div>
        </div>
        <div class="wn-annot-filters wn-annotator">
          <div class="wn-annot-filter-row wn-annotator">
            <input id="wn-filter-search" class="wn-annotator" type="search" placeholder="Keyword search" />
          </div>
          <div class="wn-annot-arrange wn-annotator">
            <label for="wn-filter-sort">Sort
              <select id="wn-filter-sort" class="wn-annotator">
                <option value="oldest">Oldest first</option>
                <option value="newest">Newest first</option>
                <option value="kind">By kind</option>
                <option value="page">By page</option>
              </select>
            </label>
            <label for="wn-filter-group">Group
              <select id="wn-filter-group" class="wn-annotator">
                <option value="none">Nothing</option>
                <option value="page">By page</option>
                <option value="kind">By kind</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <div class="wn-annot-list"></div>
    `,E==="left"&&(e.style.left="18px",e.style.right="auto"),document.body.appendChild(e),a.panel=e,e.style.display="none";const n=e.querySelector(".wn-annot-delete-all");n&&n.addEventListener("click",async p=>{p.stopPropagation(),await Cr()});const o=e.querySelector(".wn-annot-panel-head");o&&o.insertBefore(ne("Close the annotations",()=>ot(!1)),o.firstChild);const r=e.querySelector(".wn-annot-list");r&&r.addEventListener("keydown",br);const i=e.querySelector(".wn-annot-panel-view");i&&i.addEventListener("click",p=>{p.stopPropagation(),sn(it()?"rail":"full")});const s=e.querySelector(".wn-annot-panel-tools");s&&s.addEventListener("click",xa);const c=document.createElement("div");c.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(c),a.markerLayer=c;const l=document.createElement("div");l.className="wn-annot-outline wn-annotator",l.style.display="none",se(l),document.body.appendChild(l),a.outlineBox=l;const d=document.createElement("div");d.className="wn-annot-tip wn-annotator",d.textContent="Active mode",se(d),document.body.appendChild(d),a.tip=d,t.addEventListener("click",ga),ce(),A(),lt(),q(),X(),R(),ue(),ra(),Ko()}function Ge(){a.dimOverlay&&a.dimOverlay.classList.toggle("is-visible",!a.hidden)}function Vo(){if(!a.dimEnabled||a.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(a.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),a.dimOverlay=t,Ge()}function ae(){if(!a.visibilityToggle)return;const t=a.visibilityToggle,n=I()&&a.toolbar&&!a.hidden?a.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===a.toolbar?a.toolbar.insertBefore(t,a.toolbar.firstChild):document.body.appendChild(t))}function Ko(){if(a.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Hide Uxnote"),t.setAttribute("data-tip","Hide Uxnote"),t.innerHTML=eo(),t.addEventListener("click",ya),a.visibilityToggle=t,ae(),st(),hn()}function qo(){if(a.commentModal)return a.commentModal;const t=document.createElement("dialog");t.className="wn-annot-comment-dialog wn-annot-modal wn-annot-comment-card wn-annot-sheet wn-annotator";const e=document.createElement("h4");e.textContent="Add a comment";const n=document.createElement("textarea");n.className="wn-annotator",n.placeholder="Your comment...";const o=document.createElement("div");o.className="wn-annot-actions wn-annotator";const r=document.createElement("button");r.type="button",r.className="wn-annot-pill cancel wn-annotator",r.textContent="Cancel";const i=document.createElement("button");return i.type="button",i.className="wn-annot-pill primary wn-annotator",i.textContent="Save",o.appendChild(r),o.appendChild(i),t.appendChild(ne("Discard this comment",()=>r.click())),t.appendChild(e),t.appendChild(n),t.appendChild(o),document.body.appendChild(t),a.commentModal={dialog:t,textarea:n,title:e,okBtn:i,cancelBtn:r},a.commentModal}function at(){const t=a.commentModal;if(!t||!a.toolbar||!t.dialog.open)return;const e=t.dialog;if(I()){e.style.left="",e.style.top="",e.style.bottom="";return}const n=a.toolbar.getBoundingClientRect(),o=.75*(parseFloat(getComputedStyle(e).fontSize)||16);e.style.left=`${n.left+n.width/2}px`,E==="top"?(e.style.top=`${n.bottom+o}px`,e.style.bottom=""):(e.style.top="",e.style.bottom=`${window.innerHeight-n.top+o}px`)}function tn(t,e=""){return new Promise(n=>{const o=qo(),{dialog:r,textarea:i,title:s,okBtn:c,cancelBtn:l}=o;s.textContent=t||"Add a comment",i.value=e||"",i.placeholder="Your comment...",r.open||r.showModal(),at(),U(),i.focus(),i.select();let d=!1;const p=f=>{d||(d=!0,r.open&&r.close(),U(),c.removeEventListener("click",h),l.removeEventListener("click",m),r.removeEventListener("cancel",y),document.removeEventListener("keydown",v),window.removeEventListener("resize",at),n(f))},h=()=>{p({comment:i.value.trim()})},m=()=>p(null),v=f=>{f.key==="Escape"&&(f.preventDefault(),p(null)),f.key==="Enter"&&!(f.shiftKey||f.altKey)&&(f.preventDefault(),h())},y=f=>{f.preventDefault(),p(null)};c.textContent="Save",l.textContent="Cancel",c.addEventListener("click",h),l.addEventListener("click",m),r.addEventListener("cancel",y),document.addEventListener("keydown",v),window.addEventListener("resize",at)})}async function re(t){const e=await tn(t);return e||null}function Yo(){if(Ke){if(I()){Tr();return}qn()}}function Xo(){if(a.importModal)return a.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const r=document.createElement("label");r.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),c=document.createElement("div");c.className="wn-annot-import-drop-title wn-annotator",c.textContent="Drop JSON files here";const l=document.createElement("div");l.className="wn-annot-import-drop-sub wn-annotator",l.textContent="or click to select files",s.appendChild(c),s.appendChild(l),r.appendChild(i),r.appendChild(s);const d=document.createElement("div");d.className="wn-annot-import-panel wn-annotator";const p=document.createElement("div");p.className="wn-annot-import-title-row wn-annotator";const h=document.createElement("h5");h.textContent="Loaded files";const m=document.createElement("span");m.className="wn-annot-import-count wn-annotator",m.textContent="0";const v=document.createElement("p");v.textContent="Files are saved automatically.";const y=document.createElement("div");y.className="wn-annot-import-list wn-annotator",p.appendChild(h),p.appendChild(m),d.appendChild(p),d.appendChild(v),d.appendChild(y);const f=document.createElement("div");f.className="wn-annot-actions wn-annotator";const g=document.createElement("button");g.type="button",g.className="wn-annot-pill cancel wn-annotator",g.textContent="Close",f.appendChild(g),o.appendChild(r),o.appendChild(d),e.appendChild(n),e.appendChild(o),e.appendChild(f),t.appendChild(e),document.body.appendChild(t);const L=()=>{t.classList.remove("show"),document.removeEventListener("keydown",et)},et=k=>{k.key==="Escape"&&(k.preventDefault(),L())},Vt=k=>{k.target===t&&L()};return g.addEventListener("click",L),t.addEventListener("click",Vt),["dragenter","dragover"].forEach(k=>{r.addEventListener(k,C=>{C.preventDefault(),C.stopPropagation(),r.classList.add("dragover")})}),["dragleave","drop"].forEach(k=>{r.addEventListener(k,C=>{C.preventDefault(),C.stopPropagation(),r.classList.remove("dragover")})}),r.addEventListener("drop",k=>{var x;const C=(x=k.dataTransfer)==null?void 0:x.files;C&&C.length&&en(Array.from(C))}),i.addEventListener("change",k=>{const C=k.target.files;C&&C.length&&en(Array.from(C)),i.value=""}),y.addEventListener("click",k=>{const C=k.target.closest("[data-import-remove]");C&&ta(C.dataset.importRemove)}),a.importModal={backdrop:t,modal:e,fileInput:i,fileList:y,filesCount:m,onKey:et,close:L},a.importModal}function _o(){if(!Jt)return;const t=Xo();Ct(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function Ct(){if(!a.importModal)return;const{fileList:t,filesCount:e}=a.importModal,{fileCounts:n}=Wo();if(t.innerHTML="",a.importFiles.length)a.importFiles.forEach(o=>{const r=document.createElement("div");r.className="wn-annot-import-card wn-annotator";const i=document.createElement("div");i.className="wn-annot-import-meta wn-annotator";const s=document.createElement("div");s.className="wn-annot-import-name wn-annotator",s.textContent=o.name;const c=document.createElement("div");c.className="wn-annot-import-sub wn-annotator";const l=n.get(o.id)||0,d=o.pageUrl?` | ${D(o.pageUrl,36)}`:"";c.textContent=`${l} comments | ${ea(o.size)}${d}`,i.appendChild(s),i.appendChild(c);const p=document.createElement("div");p.className="wn-annot-import-actions wn-annotator";const h=document.createElement("div");h.className="wn-annot-import-badge wn-annotator",h.textContent=String(l);const m=document.createElement("button");m.type="button",m.className="wn-annot-import-remove wn-annotator",m.dataset.importRemove=o.id,m.textContent="x",p.appendChild(h),p.appendChild(m),r.appendChild(i),r.appendChild(p),t.appendChild(r)});else{const o=document.createElement("div");o.className="wn-annot-import-empty wn-annotator",o.textContent="No imported files yet.",t.appendChild(o)}e.textContent=String(a.importFiles.length)}function Wo(){const t=new Map;return a.annotations.forEach(e=>{e.importFileId&&t.set(e.importFileId,(t.get(e.importFileId)||0)+1)}),{fileCounts:t}}async function en(t){if(!t||!t.length)return;const e=new Set(a.annotations.map(o=>o.id));let n=0;for(const o of t){const r=await Jo(o,e);if(!r)continue;const{fileMeta:i,annotations:s}=r;s.length&&(a.importFiles.push(i),a.annotations.push(...s),n+=s.length)}if(!n){Ct();return}z(),un(),pt(),ft(),_(),Ct()}async function Jo(t,e){let n;try{const l=await t.text();n=JSON.parse(l)}catch(l){return await on(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await on(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const r=Array.isArray(n)?t.lastModified:n.createdAt,i=Array.isArray(n)?"":n.pageUrl||"",s=Yn(),c=o.filter(pe).map(l=>Zo(l,{createdAt:r,pageUrl:i,fileId:s,existingIds:e}));return{fileMeta:{id:s,name:t.name,size:t.size,pageUrl:i,importedAt:Date.now()},annotations:c}}function Zo(t,e){const n=t&&typeof t=="object"?t:{},o=n.pageUrl||e.pageUrl||window.location.href,r=Go(n.id,e.existingIds),i=ko(Oe({},n),{id:r,createdAt:n.createdAt||e.createdAt||Date.now(),pageUrl:o,importFileId:e.fileId});return i.pageKey||(i.pageKey=S(o)),i}function Go(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=Ot();while(e.has(n));return e.add(n),n}function ta(t){const e=a.importFiles.filter(n=>n.id!==t);e.length!==a.importFiles.length&&(a.importFiles=e,a.annotations=a.annotations.filter(n=>n.importFileId!==t),z(),un(),pt(),ft(),_(),Ct())}function ea(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function D(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function na(){if(a.dialogModal)return a.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-sheet wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const r=document.createElement("div");r.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",r.appendChild(i),r.appendChild(s),e.appendChild(ne("Dismiss",()=>i.click())),e.appendChild(n),e.appendChild(o),e.appendChild(r),t.appendChild(e),document.body.appendChild(t),a.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},a.dialogModal}function nn({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:r=!0}){return new Promise(i=>{const{backdrop:s,title:c,message:l,okBtn:d,cancelBtn:p}=na();c.textContent=t,l.textContent=e,d.textContent=n;const h=!!o;p.style.display=h?"inline-flex":"none",p.textContent=o||"";const m=L=>{s.classList.remove("show"),U(),d.removeEventListener("click",v),p.removeEventListener("click",y),s.removeEventListener("click",f),document.removeEventListener("keydown",g),i(L)},v=()=>m(!0),y=()=>m(!1),f=L=>{L.target===s&&r&&m(!1)},g=L=>{L.key==="Escape"&&(L.preventDefault(),m(!1)),(L.metaKey||L.ctrlKey)&&L.key==="Enter"&&v()};d.addEventListener("click",v),p.addEventListener("click",y),s.addEventListener("click",f),document.addEventListener("keydown",g),s.classList.add("show"),U(),d.focus()})}async function oa(t,e="Confirmation"){return nn({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function on(t,e="Information"){await nn({title:e,message:t,okLabel:"OK",cancelLabel:null})}function aa(){document.addEventListener("mouseup",fe),document.addEventListener("touchend",fe),document.addEventListener("pointerup",fe),document.addEventListener("selectionchange",Aa),document.addEventListener("mousemove",ka),document.addEventListener("mouseover",sr),document.addEventListener("click",Ea,!0),document.addEventListener("click",sa),window.addEventListener("keydown",ia),window.addEventListener("resize",$),window.addEventListener("resize",lt),window.addEventListener("resize",X),window.addEventListener("resize",q),window.addEventListener("resize",R),window.addEventListener("resize",st),window.addEventListener("resize",xn),window.addEventListener("scroll",$,{passive:!0}),qr(),_r(),ee(Gt,Ze),ee(te,Ze),zo&&ee(Zt,ln)}function ra(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-search");if(!t)return;t.value=a.filters.query;const e=()=>{a.filters.query=t.value.trim().toLowerCase(),A()};t.addEventListener("input",e);const n=a.panel.querySelector("#wn-filter-sort");n&&(n.value=a.filters.sort,n.addEventListener("change",()=>{a.filters.sort=n.value,A()}));const o=a.panel.querySelector("#wn-filter-group");o&&(o.value=a.filters.group,o.addEventListener("change",()=>{a.filters.group=o.value,A()}))}function j(t,e={}){const n=e.keepOutline;if(a.mode===t){a.mode=null,ie(),rt(),an(),n||W();return}a.mode=t,P(),ie(),le(t),an(),t!=="element"&&W()}function ia(t){t.key!=="Escape"||t.defaultPrevented||a.mode&&(t.preventDefault(),j(null))}function an(){a.selectionTimer&&(clearTimeout(a.selectionTimer),a.selectionTimer=null),ct(),vn()}function ie(){a.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===a.mode?e.classList.add("active"):e.classList.remove("active")})}const rn=typeof HTMLElement!="undefined"&&typeof HTMLElement.prototype.showPopover=="function";function se(t){rn&&t.setAttribute("popover","manual")}function Tt(t){if(!(!t||!rn))try{t.matches(":popover-open")&&t.hidePopover(),t.showPopover()}catch(e){}}function le(t){const e=F();let n="";if(t==="text"?n=e?"Select text, then tap Add note.":"Select text then release to add a note. Escape stops.":t==="element"&&(n=e?"Tap an element to preview it, then pin it.":"Hover an element, click to annotate. Escape stops."),!n)return rt();a.tip.textContent=n,a.tip.classList.add("show"),Tt(a.tip),R(),requestAnimationFrame(R),requestAnimationFrame(R)}function rt(){a.tip.classList.remove("show")}function sa(){!a.tip||!a.tip.classList.contains("show")||Tt(a.tip)}function la(){if(a.toast)return a.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),se(t),document.body.appendChild(t),a.toast=t,t}function O(t){if(!t)return;const e=la();e.textContent=t,e.classList.add("show"),Tt(e),a.toastTimer&&clearTimeout(a.toastTimer),a.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function ca(){try{const t=localStorage.getItem(Be);if(t==="top"||t==="bottom")return t}catch(t){}return null}function da(){try{if(localStorage.getItem(Fe)==="full")return"full"}catch(t){}return"rail"}function sn(t,e={}){const n=t==="full"?"full":"rail";if(e.remember!==!1)try{localStorage.setItem(Fe,n)}catch(o){}a.panelView!==n&&(a.panelView=n,ce())}function it(){return a.panelView==="full"&&!I()}function ce(){if(!a.panel)return;const t=it(),e=a.panel.querySelector(".wn-annot-panel-view");if(e){const n=t?"Shrink the panel to the side":"Open the panel full size";e.innerHTML=t?$r():Ir(),e.classList.toggle("active",t),e.setAttribute("aria-label",n),e.setAttribute("aria-pressed",t?"true":"false"),e.setAttribute("data-tip",n)}a.panel.classList.contains("is-full")!==t&&(a.panel.classList.toggle("is-full",t),X(),A())}function pa(){try{const t=localStorage.getItem(je);return t==null?null:t==="true"}catch(t){return null}}function ua(t){try{localStorage.setItem(je,t?"true":"false")}catch(e){}}function ln(){const t=!!(Zt&&Zt.matches),e=nt==="dark"||nt==="auto"&&t||nt==="reverse-auto"&&!t;document.documentElement.setAttribute("data-wn-theme",e?"dark":"light")}function ha(){if(!document||!document.documentElement)return;const t=document.documentElement,e=a.colors||Xt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,r=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",r.base),n("--wn-element-highlight-soft",r.soft),n("--wn-element-highlight-soft-end",r.softer),n("--wn-element-highlight-strong",r.strong),n("--wn-element-highlight-shadow",r.shadow),n("--wn-shot-frame",e.screenshot.base),n("--wn-marker-text",r.text)}function de(t,e={}){var s,c,l;const n=At(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,r=(c=e.softerAlpha)!=null?c:.04,i=(l=e.overlayAlpha)!=null?l:.7;return{base:n,overlay:N(n,i,N("#000000",i)),soft:N(n,o,N("#000000",o)),softer:N(n,r,N("#000000",r)),strong:N(n,.9,n),shadow:N(n,.24,"rgba(0,0,0,0.24)"),pill:N(n,.16,"rgba(0,0,0,0.16)"),pillBorder:N(n,.28,"rgba(0,0,0,0.28)"),text:fa(n)}}function At(t,e){const n=Lt(t);return n||Lt(e)||"#000000"}function Lt(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function cn(t){const e=Lt(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function N(t,e=1,n=""){const o=cn(t);if(!o)return n||"";const r=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${r})`}function fa(t){const e=cn(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function H(t){const e=a.colors||Xt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function dn(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function pn(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-text",e.text),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder))}function Y(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function ma(){try{const t=localStorage.getItem(De),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||Yn(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function un(){try{localStorage.setItem(De,JSON.stringify(a.importFiles||[]))}catch(t){}}function R(){if(!a.tip||!a.toolbar)return;const t=a.toolbar.getBoundingClientRect(),e=a.tip,n=10,o=t.left+t.width/2,r=E==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(r){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function pe(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function wa(){try{const t=localStorage.getItem(_t),e=t?JSON.parse(t):[];a.annotations=(e||[]).filter(pe),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=S(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),a.annotations=[]}}function z(){St(),b&&Dt()}function St(){try{localStorage.setItem(_t,JSON.stringify(a.annotations)),b&&Bt()}catch(t){console.warn("Annotator storage save error",t),so()}}async function ga(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(ot(!1),o==="screenshot"){await ei();return}j(o);return}if(n==="toggle-panel"){ba();return}if(n==="toggle-pos"){va(E==="bottom"?"top":"bottom"),he();return}}}async function xa(t){const e=t.target.closest("button[data-action]");if(!e)return;t.stopPropagation();const n=e.getAttribute("data-action");if(n==="export"){Yo();return}if(n==="import"){_o();return}n==="mail"&&await Ar()}function ba(){ot(a.panel.style.display==="none")}function ya(){Mt(!a.hidden)}function Mt(t){a.hidden=t,ua(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(j(null),rt(),W(),P()),hn(),Ge(),st(),lt(),q(),U(),t||($(),X(),R()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function hn(){if(!a.visibilityToggle)return;const t=a.hidden?"Show Uxnote":"Hide Uxnote";a.visibilityToggle.classList.toggle("is-muted",a.hidden),a.visibilityToggle.innerHTML=a.hidden?zr():eo(),a.visibilityToggle.setAttribute("aria-label",t),a.visibilityToggle.setAttribute("aria-pressed",a.hidden?"true":"false"),a.visibilityToggle.setAttribute("data-tip",t)}function st(){const t=a.visibilityToggle;if(!t)return;ae();const e=18;if(I()){a.hidden?(t.style.bottom=`max(${e}px, env(safe-area-inset-bottom))`,t.style.left=`max(${e}px, env(safe-area-inset-left))`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",E==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function ue(){if(!a.panel||!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=a.panel.style.display==="none";t.classList.toggle("active",!e)}function X(){if(!a.panel||!a.toolbar)return;const t=a.panel,e=18,n=a.toolbar.getBoundingClientRect(),o=n.height?Math.max(0,Math.round((E==="top"?n.bottom:document.documentElement.clientHeight-n.top)+10)):0;if(document.documentElement.style.setProperty("--wn-bar-reserve",`${o}px`),I()){t.style.width="",t.style.height="",t.style.maxHeight="",t.style.left="",t.style.right="",t.style.top="",t.style.bottom="",t.style.borderRadius="",t.style.paddingTop="",t.style.paddingBottom="",q();return}if(it()){t.style.width="100%",t.style.maxHeight="none",t.style.left="0px",t.style.right="0px",t.style.top="var(--wn-bar-reserve)",t.style.bottom="var(--wn-bar-reserve)",t.style.height="",t.style.borderRadius="0px",t.style.paddingTop="",t.style.paddingBottom="";return}t.style.width=`min(360px, calc(100% - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.maxHeight=`calc(100dvh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",t.style.paddingTop="",t.style.paddingBottom="",E==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):E==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function va(t){E=t==="top"?"top":"bottom";const e=a.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${E}`));try{localStorage.setItem(Be,E)}catch(n){}he(),st(),R(),at(),X(),lt(),q()}function he(){if(!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=E==="top"?Gn():to())}function lt(){if(!a.toolbar||a.customPosition||!(kt==="push"||kt==="dock"||kt==="pad"||kt==="true"))return;const t=document.body;a.basePadding||_e();const e=a.basePadding;if(a.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=a.toolbar.getBoundingClientRect(),o=Oe({},e);E==="top"?o.top=e.top+n.height:E==="bottom"?o.bottom=e.bottom+n.height:E==="left"?o.left=e.left+n.width:E==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}function fn(t){return V(t.commonAncestorContainer)&&V(t.startContainer)&&V(t.endContainer)}async function fe(){if(a.mode!=="text"||F())return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!fn(e)){t.removeAllRanges(),O("This area is a popup or overlay. It cannot be annotated.");return}const n=t.toString().trim();n&&await mn(e,n)}async function mn(t,e){const n=kn(t.commonAncestorContainer),o=await re("Comment for this highlight?");if(!o)return;const{comment:r}=o,i=Ot(),s=Ha(t,e),c=Nt(t,i),l=window.getSelection();l&&l.removeAllRanges();const d={id:i,type:"text",target:s,comment:r.trim(),snippet:e.slice(0,180),pageUrl:window.location.href,pageKey:S(window.location.href),createdAt:Date.now(),status:"active"};a.annotations.push(d),z(),J(d,c),A(),n||j(null,{keepOutline:!0})}function ka(t){if(a.mode!=="element")return;if(Qt()){W();return}const e=t.target;if(!e||!V(e)){W();return}wn(e)}function wn(t){const e=ye(t);if(!e){W();return}za(e)}async function Ea(t){if(a.mode!=="element"||Qt())return;const e=t.target;if(!be(e)){if(!e||!V(e)){O("This area is a popup or overlay. It cannot be annotated.");return}if(t.preventDefault(),t.stopPropagation(),F()){$a(e);return}await gn(e)}}async function gn(t){const e=kn(t),n=await re("Comment for this element?");if(!n)return;const{comment:o}=n,r=Ot(),i=ke(t),s=ja(t),c=t.getBoundingClientRect(),l={id:r,type:"element",target:{xpath:i,css:s,tag:t.tagName.toLowerCase()},comment:o.trim(),snippet:t.innerText?t.innerText.trim().slice(0,120):t.tagName,pageUrl:window.location.href,pageKey:S(window.location.href),rect:{x:c.x+window.scrollX,y:c.y+window.scrollY,w:c.width,h:c.height},createdAt:Date.now(),status:"active"};a.annotations.push(l),z(),J(l,t),Tn(t,r),A(),e||j(null,{keepOutline:!0})}const Ca=400;function me(t){if(!t||!a.toolbar||!t.classList.contains("show"))return;const e=document.documentElement,n=a.toolbar.getBoundingClientRect(),o=8;if(E==="top"){t.style.top=`${Math.round(n.bottom+o)}px`,t.style.bottom="auto";return}t.style.top="auto",t.style.bottom=`${Math.round(e.clientHeight-n.top+o)}px`}function xn(){me(a.selectionBar);const t=a.elementPicker;!t||!t.bar.classList.contains("show")||ge()}function Qt(){return We(a.commentModal)}function Ta(){const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return null;const e=t.getRangeAt(0);return!e||!e.toString().trim()||!fn(e)?null:e}function Aa(){if(F()){if(a.selectionTimer&&clearTimeout(a.selectionTimer),a.selectionTimer=null,a.mode!=="text"||Qt()){ct();return}a.selectionTimer=setTimeout(La,Ca)}}function La(){if(a.selectionTimer=null,a.mode!=="text"||Qt())return ct();const t=Ta();if(!t)return ct();a.selectionRange=t.cloneRange(),Ma()}function Sa(){if(a.selectionBar)return a.selectionBar;const t=document.createElement("div");t.className="wn-annot-actionbar wn-annot-selection-bar wn-annotator";const e=document.createElement("button");return e.type="button",e.className="primary wn-annotator",e.textContent="Add note",e.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),Qa()}),t.appendChild(e),document.body.appendChild(t),a.selectionBar=t,t}function Ma(){const t=Sa();rt(),t.classList.add("show"),me(t)}function ct(){a.selectionRange=null;const t=a.selectionBar;!t||!t.classList.contains("show")||(t.classList.remove("show"),a.mode&&!a.hidden&&le(a.mode))}async function Qa(){const t=a.selectionRange;if(ct(),!t)return;if(!ut(t.startContainer)||!ut(t.endContainer)){O("That text is no longer on the page.");return}const e=t.toString().trim();e&&await mn(t,e)}function Na(t){if(!t||t.nodeType!==1)return"";const e=t.tagName.toLowerCase();if(t.id)return`${e}#${t.id}`;const n=Array.from(t.classList||[]).filter(o=>o&&!o.startsWith("wn-")&&!o.startsWith("uxnote-"));return n.length?`${e}.${n.slice(0,2).join(".")}`:e}function Ia(){if(a.elementPicker)return a.elementPicker;const t=document.createElement("div");t.className="wn-annot-actionbar wn-annot-pick-bar wn-annotator";const e=document.createElement("span");e.className="wn-annot-pick-name wn-annotator";const n=(s,c,l)=>{const d=document.createElement("button");return d.type="button",d.className=`${c} wn-annotator`,d.textContent=s,d.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),l()}),d},o=n("Wider","wn-annot-pick-wider",()=>yn(1)),r=n("Narrower","wn-annot-pick-narrower",()=>yn(-1)),i=n("Pin here","primary wn-annot-pick-pin",Pa);return t.appendChild(e),t.appendChild(r),t.appendChild(o),t.appendChild(i),document.body.appendChild(t),a.elementPicker={bar:t,name:e,wider:o,narrower:r,pin:i},a.elementPicker}function $a(t){a.elementTrail=[t],a.elementTrailIndex=0;const e=Ia();rt(),e.bar.classList.add("show"),ge()}function we(){return a.elementTrail[a.elementTrailIndex]||null}function bn(){const t=we();if(a.elementTrailIndex<a.elementTrail.length-1)return a.elementTrail[a.elementTrailIndex+1];if(!t||t===document.body)return null;const e=t.parentElement;return!e||!V(e)?null:e}function yn(t){if(t>0){const e=bn();if(!e)return;a.elementTrailIndex===a.elementTrail.length-1&&a.elementTrail.push(e),a.elementTrailIndex+=1}else{if(a.elementTrailIndex===0)return;a.elementTrailIndex-=1}ge()}function ge(){const t=a.elementPicker,e=we();!t||!e||(t.name.textContent=Na(e),t.narrower.disabled=a.elementTrailIndex===0,t.wider.disabled=!bn(),wn(e),me(t.bar))}function vn(){a.elementTrail=[],a.elementTrailIndex=0;const t=a.elementPicker;!t||!t.bar.classList.contains("show")||(t.bar.classList.remove("show"),a.mode&&!a.hidden&&le(a.mode))}async function Pa(){const t=we();if(vn(),!t||!ut(t)){O("That element is no longer on the page.");return}await gn(t)}function xe(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function dt(t){const e=a.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function pt(){Object.keys(a.highlightSpans||{}).forEach(t=>{dt(t).forEach(e=>{e&&e.parentNode&&xe(e)})}),a.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&xe(t)}),Object.values(a.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),a.markerLayer&&(a.markerLayer.innerHTML=""),a.markers={},Object.keys(a.elementTargets||{}).forEach(t=>{An(t)}),a.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function Oa(t){const e=a.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete a.markers[t],An(t);let n=dt(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&xe(o)}),delete a.highlightSpans[t]}function _(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function za(t){const e=a.outlineBox;e.style.display="block",Tt(e),e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function W(){a.outlineBox.style.display="none"}function be(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&be(t.parentElement):!1}function kn(t){const e=t&&t.nodeType===Node.ELEMENT_NODE?t:t&&t.parentElement;if(!e||!e.closest)return!1;const n=e.closest("dialog");if(!n)return!1;try{return n.matches(":modal")}catch(o){return!1}}function V(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||be(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function Ha(t,e){return{startXPath:ke(t.startContainer),startOffset:t.startOffset,endXPath:ke(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function Nt(t,e){let n=[];const o=t.cloneRange();if(Ra(o).forEach(i=>{const s=Ba(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",c=>{c.stopPropagation(),wt(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return a.highlightSpans[e]=n,n[0]}function pi(t,e){return Nt(t,e)}function En(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function Ra(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!En(t,o))continue}catch(r){if(!En(t,o))continue}e.push(o)}return e}function Ba(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:r}=e;let i=t,s=r;if(o>0&&(i=i.splitText(o),s=r-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const c=document.createElement("span");return c.className="uxnote-textmark",c.dataset.uxnoteId=n,c.addEventListener("click",l=>{l.stopPropagation(),wt(n)}),i.parentNode.insertBefore(c,i),c.appendChild(i),c}function ut(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function Fa(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),r=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=r-n,c=i-o;return s<=0||c<=0?null:{x:n,y:o,width:s,height:c}}function ye(t){if(!t||!ut(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const d=n.querySelector("summary");if(d&&!d.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const r=window.getComputedStyle(n);if(r.display==="none"||r.visibility==="hidden"||r.visibility==="collapse"||r.opacity==="0")return null;const i=r.overflowX||r.overflow,s=r.overflowY||r.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const d=n.getBoundingClientRect(),p=Fa(e,d);if(!p)return null;e=p}n=n.parentElement}return e}function Ua(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function Cn(t){if(!t||t.nodeType!==1)return a.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:Ua(t)||a.markerLayer||document.body}function ve(t){return t===document.body||t===a.markerLayer||t===document.documentElement}function Da(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(r){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(r){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const r=n.getAttribute("data-uxnote-open");if(r){const i=document.querySelector(r);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const r=n.id;if(r){const i=document.querySelector(`[aria-controls="${It(r)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function Tn(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),a.elementTargets[e]=t,!0}function An(t){const e=a.elementTargets[t];if(!e||e.nodeType!==1){delete a.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const c=s.filter(l=>l!==t);c.length?i.dataset.uxnoteIds=c.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(r=>r!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete a.elementTargets[t]}function ke(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const r=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${r}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function It(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function ja(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${It(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let r=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(r+=`.${i.slice(0,2).map(It).join(".")}`),e.unshift(r),n.parentElement&&n.parentElement.id){e.unshift(`#${It(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function ht(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function ft(){a.annotations.forEach(t=>{t.pageKey===S(window.location.href)&&Va(t)}),A()}function Va(t){const e=mt(t);if(!e){t.status="missing",Ln();return}t.status="active",Ee(t,e)}function Ee(t,e){if(e){if(e.type==="screenshot"){J(t,null);return}if(e.type==="text"&&e.range){const n=Nt(e.range,t.id);J(t,n);return}e.type==="element"&&e.el&&(Tn(e.el,t.id),J(t,e.el))}}function Ka(t){if(!t)return null;const e=ht(t.startXPath),n=ht(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function mt(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?qa(t):t.type==="element"?Xa(t):null:null:null}function qa(t){const e=t.target||{},n=Ka(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const r=Ya(o);return r?{type:"text",range:r}:null}function Ya(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!V(o))continue;const r=o.nodeValue.indexOf(e);if(r===-1)continue;const i=document.createRange();return i.setStart(o,r),i.setEnd(o,r+e.length),i}return null}function Xa(t){const e=t.target||{};if(e.xpath){const r=ht(e.xpath);if(r&&r.nodeType===1)return{type:"element",el:r}}if(e.css)try{const r=document.querySelector(e.css);if(r&&r.nodeType===1)return{type:"element",el:r}}catch(r){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const r=document.querySelectorAll(n);for(const i of r)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function _a(){a.missingRetryTimer&&clearTimeout(a.missingRetryTimer),a.missingRetryTimer=setTimeout(()=>{Ce()},300)}function Ln(){a.missingObserver||!window.MutationObserver||(a.missingObserver=new MutationObserver(()=>{a.annotations.some(t=>t.status==="missing")&&_a()}),a.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function Wa(){a.missingObserver&&(a.missingObserver.disconnect(),a.missingObserver=null)}function Ce(){let t=!1;a.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==S(window.location.href))return;const n=mt(e);n&&(e.status="active",Ee(e,n),t=!0)}),t&&(z(),A(),$()),a.annotations.some(e=>e.status==="missing")||Wa()}function Ja(){let t=!1;a.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==S(window.location.href))return;const n=dt(e.id).filter(ut);if(n.length){a.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=mt(e);if(o&&o.range){Nt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(z(),A(),$())}function Za(){a.layoutTimer&&clearTimeout(a.layoutTimer),a.layoutTimer=setTimeout(()=>{$(),Ja(),a.annotations.some(t=>t.status==="missing")&&Ce()},120)}function Ga(){a.layoutObserver||!window.MutationObserver||(a.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&Za()}),a.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function J(t,e){if(t.pageKey!==S(window.location.href)||!a.markerLayer)return;const n=a.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=a.annotations.findIndex(l=>l.id===t.id)+1,o.dataset.wnAnnotId=t.id;const r=H(t);dn(o,r),o.addEventListener("click",()=>wt(t.id));const i=Mn(t,e),s=Sn(t,i),c=Cn(i&&i.anchor?i.anchor:e);if(o.parentNode!==c&&c.appendChild(o),o.style.zIndex=ve(c)?"":"9999",!i){o.style.display="none",a.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",Qn(o,i,t),a.markers[t.id]={el:o,rect:i,frame:s}}function Sn(t,e){const n=a.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const r=a.markerLayer||document.body;return o.parentNode!==r&&r.appendChild(o),o.style.setProperty("--wn-shot-frame",H(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function Mn(t,e){var n;if(t.type==="text"){const r=(e?[e]:dt(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!r)return null;const i=ye(r);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:r}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||a.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?ht(t.target.xpath):null);if(!o)return null;const r=ye(o);return r?{x:r.x,y:r.y,w:r.width,h:r.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function Qn(t,e,n){const o=tr(n),r=t.offsetParent||document.body,i=r.getBoundingClientRect(),s=i.x+window.scrollX,c=i.y+window.scrollY,l=e.x+window.scrollX,d=e.y+window.scrollY,p=l-s+e.w+o.x+4,h=ve(r)?document.documentElement.clientWidth:r.clientWidth,m=(t.offsetWidth||25)/2;t.style.left=`${h?Math.min(p,h-m-2):p}px`,t.style.top=`${d-c+o.y-4}px`}function tr(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=a.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function $(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:Mn(n);if(e.frame=Sn(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const r=Cn(o.anchor);e.el.parentNode!==r&&r.appendChild(e.el),e.el.style.zIndex=ve(r)?"":"9999",Qn(e.el,o,n),dn(e.el,H(n))}),In()}function er(){a.panel&&a.panel.style.display==="none"&&ot(!0)}function nr(t){if(!a.panel)return;er();const e=a.panel.querySelector(".wn-annot-list");if(!e)return;a.focusedId=t,e.querySelectorAll(".wn-annot-item").forEach(r=>r.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function wt(t,e=!1,n,o){var c;const r=a.annotations.find(l=>l.id===t);if(!r)return;if(nr(t),r.status==="missing"){const l=mt(r);if(l)r.status="active",Ee(r,l),A();else{O("This annotation is not on this page.");return}}const i=mt(r);if(i){const l=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;l&&Da(l)&&setTimeout(()=>{$()},160)}if(!((o||r.pageKey)===S(window.location.href))&&e){try{localStorage.setItem(Wt,JSON.stringify({id:r.id,pageKey:r.pageKey,pageUrl:n||r.pageUrl}))}catch(l){}window.location.href=n||r.pageUrl||window.location.href;return}if(r.type==="text"){const d=(dt(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];d&&(d.scrollIntoView({behavior:"smooth",block:"center"}),Te(d,H(r).base))}else if(r.type==="element"){const l=i&&i.el?i.el:(c=r.target)!=null&&c.xpath?ht(r.target.xpath):null;l&&l.scrollIntoView&&(l.scrollIntoView({behavior:"smooth",block:"center"}),Te(l,H(r).base))}else if(r.type==="screenshot"&&r.rect){window.scrollTo({top:Math.max(0,r.rect.y+r.rect.h/2-window.innerHeight/2),behavior:"smooth"});const l=a.markers[r.id];l&&l.frame&&Te(l.frame,H(r).base)}}function Te(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=a.colors)==null?void 0:i.element)==null?void 0:s.base)||"#8b5cf6",r=N(o,.6,"rgba(139,92,246,0.6)");t.style.boxShadow=`0 0 0 3px ${r}`,setTimeout(()=>{t.style.boxShadow=n},800)}function Nn(){return!F()&&!a.hidden&&!a.mode}function or(t){if(!t||!t.closest)return null;const e=t.closest(".wn-annot-marker[data-wn-annot-id]");if(e)return{anchor:e,id:e.dataset.wnAnnotId};const n=t.closest(".uxnote-textmark[data-uxnote-id]");return n?{anchor:n,id:n.dataset.uxnoteId}:null}function ar(){if(a.note)return a.note;const t=document.createElement("div");return t.className="wn-annot-note wn-annotator",t.addEventListener("mouseleave",$n),document.body.appendChild(t),a.note=t,t}function rr(t,e){const n=document.createDocumentFragment(),o=document.createElement("div");o.className="wn-annot-note-top";const r=document.createElement("span");r.className="wn-annot-note-kind",r.appendChild(gt(zn(t.type)));const i=document.createElement("span");i.textContent=K[t.type]||K.element,r.appendChild(i),o.appendChild(r);const s=document.createElement("span");s.className="wn-annot-note-number",s.textContent=`#${e}`,o.appendChild(s);const c=document.createElement("button");c.type="button",c.className="wn-annot-note-edit wn-annotator",c.setAttribute("aria-label","Edit this annotation"),c.appendChild(gt(Wn())),c.addEventListener("click",async p=>{p.stopPropagation(),P(),await Kn(t.id)}),o.appendChild(c),n.appendChild(o);const l=document.createElement("div"),d=(t.comment||"").trim();return l.className=d?"wn-annot-note-text":"wn-annot-note-text is-empty",l.textContent=d||"Nothing written on this one yet.",n.appendChild(l),n}function ir(t,e){if(!Nn())return P();const n=a.annotations.findIndex(c=>c.id===e);if(n===-1)return P();const o=a.annotations[n],r=n+1;$t();const i=ar(),s=`${o.id}:${r}:${o.updatedAt||""}`;(a.noteAnchor!==t||i.dataset.key!==s)&&(i.dataset.key=s,i.innerHTML="",pn(i,H(o)),i.appendChild(rr(o,r)),a.noteAnchor=t),i.classList.add("show"),In()}function In(){const t=a.note,e=a.noteAnchor;if(!t||!e||!t.classList.contains("show"))return;if(!e.isConnected)return P();const n=e.getBoundingClientRect();if(!n.width&&!n.height)return P();const o=t.getBoundingClientRect(),r=document.documentElement,i=8,s=10,c=Math.max(i,Math.min(n.left+n.width/2-o.width/2,r.clientWidth-o.width-i)),l=n.top-o.height-s,d=l>=i?l:Math.min(n.bottom+s,r.clientHeight-o.height-i);t.style.left=`${Math.round(c)}px`,t.style.top=`${Math.round(Math.max(i,d))}px`}function $n(){$t(),a.noteTimer=setTimeout(P,180)}function $t(){a.noteTimer&&(clearTimeout(a.noteTimer),a.noteTimer=null)}function P(){$t(),a.noteAnchor=null,a.note&&a.note.classList.remove("show")}function sr(t){if(!Nn())return;const e=t.target;if(a.note&&a.note.contains(e)){$t();return}const n=or(e);if(n){ir(n.anchor,n.id);return}$n()}function lr(){if(!a.panel)return null;let t=a.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://github.com/Qu4tro/uxnote-fork",e.target="_blank",e.rel="noreferrer noopener",e.textContent="uxnote-fork on GitHub",t.appendChild(e),a.panel.appendChild(t)}return t}const K={text:"Text highlight",element:"Element pin",screenshot:"Region capture"},Pn={text:0,element:1,screenshot:2},On={oldest:(t,e)=>t.createdAt-e.createdAt,newest:(t,e)=>e.createdAt-t.createdAt,kind:(t,e)=>{var n,o;return((n=Pn[t.type])!=null?n:3)-((o=Pn[e.type])!=null?o:3)||t.createdAt-e.createdAt},page:(t,e)=>String(t.pageKey||"").localeCompare(String(e.pageKey||""))||t.createdAt-e.createdAt};function zn(t){return t==="text"?Ne():t==="screenshot"?_n():Xn()}const Hn=new Map;function gt(t){let e=Hn.get(t);if(!e){const n=document.createElement("div");n.innerHTML=t,e=n.firstElementChild,Hn.set(t,e)}return e.cloneNode(!0)}const Ae=new Map;function Le(t){const e=t&&t.target||{};return t.type!=="element"?"":e.css?D(e.css,90):e.tag?`<${e.tag}>`:e.xpath?D(e.xpath,90):""}function Rn(t){const e=t&&(t.pageKey||t.pageUrl)||"";if(!e)return"";if(Ae.has(e))return Ae.get(e);let n;try{n=D(new URL(e,window.location.href).pathname||"/",60)}catch(o){n=D(e,60)}return Ae.set(e,n),n}function Se(t){return(t&&t.pageKey)===S(window.location.href)}function Bn(t){return b?a.syncPending.has(t.id)?"pending":M.has(t.id)?"sent":"local":""}const cr={sent:"On the server",pending:"Not sent yet",local:"Only in this browser"};let Pt=null;function Fn(t){Pt||(Pt={date:new Intl.DateTimeFormat(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),time:new Intl.DateTimeFormat(void 0,{hour:"2-digit",minute:"2-digit"})});const e=new Date(t);return`${Pt.date.format(e)} \u2022 ${Pt.time.format(e)}`}function xt(t,e,n,o){if(!n)return;const r=document.createElement("div");r.className=o?`wn-annot-fact ${o}`:"wn-annot-fact";const i=document.createElement("b");i.textContent=e,r.appendChild(i),r.appendChild(document.createTextNode(n)),r.title=`${e} ${n}`,t.appendChild(r)}function dr(t,e){const n=document.createElement("div");n.className="wn-annot-item",n.dataset.id=t.id,n.tabIndex=-1,a.focusedId===t.id&&n.classList.add("is-focused"),pn(n,H(t));const o=document.createElement("div");o.className="wn-annot-card-top";const r=document.createElement("div");r.className="wn-annot-card-top-left";const i=K[t.type]||K.element,s=document.createElement("div");s.className="wn-annot-kind",s.title=i,s.appendChild(gt(zn(t.type)));const c=document.createElement("span");c.className="wn-annot-kind-label",c.textContent=i,s.appendChild(c),r.appendChild(s);const l=document.createElement("div");if(l.className="wn-annot-number",l.textContent=`#${e}`,r.appendChild(l),t.status==="missing"){const x=document.createElement("div");x.className="wn-annot-missing",x.textContent="Missing",r.appendChild(x)}const d=document.createElement("div");d.className="wn-annot-meta",d.textContent=Fn(t.createdAt),r.appendChild(d);const p=document.createElement("div");p.className="wn-annot-card-top-right";const h=document.createElement("button");h.type="button",h.className="wn-annot-edit wn-annotator",h.setAttribute("aria-label","Edit this annotation"),h.appendChild(gt(Wn())),h.addEventListener("click",async x=>{x.stopPropagation(),await Kn(t.id)}),p.appendChild(h);const m=document.createElement("button");m.type="button",m.className="wn-annot-delete wn-annotator",m.setAttribute("aria-label","Delete this annotation"),m.appendChild(gt(Jn())),m.addEventListener("click",x=>{x.stopPropagation(),Er(t.id)}),p.appendChild(m),o.appendChild(r),o.appendChild(p),n.appendChild(o);const v=document.createElement("div");v.className="wn-annot-comment";const y=t.comment||"\u2014";v.textContent=y,n.appendChild(v);const f=document.createElement("button");f.type="button",f.className="wn-annot-showmore wn-annotator",f.textContent="See more",f.addEventListener("click",x=>{x.stopPropagation();const vt=v.classList.toggle("expanded");f.textContent=vt?"See less":"See more"}),y.length<160&&(f.style.display="none"),n.appendChild(f);const g=document.createElement("div");g.className="wn-annot-detail";const L=(t.snippet||"").trim();if(L){const x=document.createElement("div");x.className="wn-annot-quote",x.textContent=L,g.appendChild(x)}const et=Le(t);if(et){const x=document.createElement("div");x.className="wn-annot-target",x.textContent=et,x.title=et,g.appendChild(x)}n.appendChild(g);const Vt=bo(t);if(Vt){const x=document.createElement("div");x.className="wn-annot-shot is-pending";const vt=document.createElement("img");vt.alt="The screenshot of this annotation",vt.addEventListener("click",oi=>{oi.stopPropagation(),ni(Vt)}),x.appendChild(vt),n.appendChild(x),pr(x)}const k=document.createElement("div");k.className="wn-annot-facts",xt(k,"Page",Rn(t),Se(t)?"is-page":"is-page is-elsewhere"),t.updatedAt&&t.updatedAt>t.createdAt&&xt(k,"Edited",Fn(t.updatedAt));const C=Bn(t);return C&&xt(k,"",cr[C],`is-${C}`),t.author&&xt(k,"Author",D(String(t.author),40)),t.priority&&xt(k,"Priority",D(String(t.priority),20)),n.appendChild(k),n.addEventListener("click",()=>{wt(t.id,!0,t.pageUrl,t.pageKey),I()?ot(!1):it()&&sn("rail",{remember:!1})}),n}function pr(t){const e=ur();if(!e){Un(t);return}e.observe(t)}function ur(){if(a.shotObserver)return a.shotObserver;if(typeof IntersectionObserver!="function"||!a.panel)return null;const t=a.panel.querySelector(".wn-annot-list");return t?(a.shotObserver=new IntersectionObserver((e,n)=>{e.forEach(o=>{o.isIntersecting&&(n.unobserve(o.target),Un(o.target))})},{root:t,rootMargin:"400px 0px"}),a.shotObserver):null}function Un(t){const e=t.firstElementChild;if(!e||e.getAttribute("src"))return;const n=t.parentNode,o=a.annotations.find(i=>i.id===(n&&n.dataset.id)),r=o&&bo(o);r&&(e.src=r,t.classList.remove("is-pending"))}function Dn(t){t&&t.shot&&a.shotObserver&&a.shotObserver.unobserve(t.shot)}function hr(t){return`${t.comment||""} ${t.snippet||""} ${K[t.type]||""} ${Le(t)} ${t.pageUrl||""} ${t.author||""} ${t.priority||""}`.toLowerCase()}function fr(){a.listRenderQueued||!a.panel||(a.listRenderQueued=!0,requestAnimationFrame(()=>{a.listRenderQueued=!1,a.panel&&A()}))}function mr(){const t=new Set;for(const e of a.annotations)if(!Se(e)||(t.add(e.pageKey),t.size>1))return!0;return!1}function wr(t,e){return e==="kind"?`kind:${t.type}`:`page:${t.pageKey||""}`}function gr(t,e){return e==="kind"?K[t.type]||K.element:Rn(t)||"This page"}function xr(t,e,n){let o=a.bands.get(t);if(!o){o=document.createElement("div"),o.className="wn-annot-band";const r=document.createElement("span");r.className="wn-annot-band-name";const i=document.createElement("span");i.className="wn-annot-band-count",o.appendChild(r),o.appendChild(i),a.bands.set(t,o)}return o.firstChild.textContent=e,o.lastChild.textContent=n,o}function br(t){const e=t.target.closest&&t.target.closest(".wn-annot-item");if(!e)return;if(t.key==="Enter"||t.key===" "){if(t.target!==e)return;t.preventDefault(),e.click();return}const n={ArrowDown:1,ArrowUp:-1};if(!(t.key in n)&&t.key!=="Home"&&t.key!=="End")return;const o=Array.from(t.currentTarget.querySelectorAll(".wn-annot-item")),r=o.indexOf(e),i=t.key==="Home"?o[0]:t.key==="End"?o[o.length-1]:o[r+n[t.key]];!i||i===e||(t.preventDefault(),e.tabIndex=-1,i.tabIndex=0,i.focus())}function jn(t){const e=document.createElement("div");return e.className="wn-annot-empty",e.textContent=t,e}function yr(t,e){const n=t.screenshot;return[e,t.type,t.status||"",t.comment||"",t.snippet||"",t.createdAt,t.updatedAt||"",t.author||"",t.priority||"",t.pageUrl||"",Se(t)?"1":"0",Le(t),n?n.url||`inline:${(n.dataUrl||"").length}`:"",Bn(t)].join("")}function Vn(t,e){const n=yr(t,e),o=a.cards.get(t.id);if(o&&o.key===n)return o.node;Dn(o);const r=dr(t,e);return a.cards.set(t.id,{key:n,node:r,shot:r.querySelector(".wn-annot-shot")}),r}function vr(t,e){let n=t.firstChild;for(const o of e){if(n===o){n=n.nextSibling;continue}t.insertBefore(o,n)}for(;n;){const o=n;n=n.nextSibling,t.removeChild(o)}}function kr(){if(a.cards.size===a.annotations.length)return;const t=new Set(a.annotations.map(e=>e.id));a.cards.forEach((e,n)=>{t.has(n)||(Dn(e),a.cards.delete(n))})}function A(){const t=a.panel.querySelector(".wn-annot-list"),e=a.panel.querySelector("h3"),n=new Map;a.annotations.forEach((h,m)=>n.set(h.id,m+1));const o=a.filters.query,r=it(),i=r&&On[a.filters.sort]||On.oldest,s=r?a.filters.group:"none",c=a.annotations.filter(h=>!o||hr(h).includes(o)).sort(i);e&&(e.textContent=`Annotations (${c.length})`),t.classList.toggle("is-multipage",mr());let l;if(!a.annotations.length)l=[jn("No annotations yet.")];else if(!c.length)l=[jn("No annotation matches that search.")];else if(s==="none")l=c.map(h=>Vn(h,n.get(h.id)));else{const h=new Map;c.forEach(m=>{const v=wr(m,s);let y=h.get(v);y||(y={label:gr(m,s),items:[]},h.set(v,y)),y.items.push(m)}),l=[],h.forEach((m,v)=>{l.push(xr(v,m.label,m.items.length)),m.items.forEach(y=>l.push(Vn(y,n.get(y.id))))})}vr(t,l);const d=l.filter(h=>h.classList.contains("wn-annot-item")),p=d.find(h=>h.dataset.id===a.focusedId)||d[0];d.forEach(h=>{h.tabIndex=h===p?0:-1}),kr(),lr()}function Er(t){const e=a.annotations.findIndex(n=>n.id===t);e!==-1&&(a.annotations.splice(e,1),P(),z(),Oa(t),A(),_(),$())}async function Kn(t){const e=a.annotations.find(r=>r.id===t);if(!e)return;const n=await tn("Edit this annotation",e.comment||"");if(!n)return;const{comment:o}=n;e.comment=o.trim(),e.updatedAt=Date.now(),z(),A()}async function Cr(){!a.annotations.length||!await oa("Delete all annotations?","Delete")||(a.annotations=[],P(),St(),b&&Yr(),pt(),A(),_())}function qn(){const t=Me(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=Qe(),o.click(),URL.revokeObjectURL(n)}async function Tr(){const t=Qe(),e=JSON.stringify(Me(),null,2);if(navigator.share&&navigator.canShare&&typeof File=="function"){const n=new File([e],t,{type:"application/json"});try{if(navigator.canShare({files:[n]})){await navigator.share({files:[n],title:t});return}}catch(o){if(o&&o.name==="AbortError")return}}qn()}function Me(t=a.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}async function Ar(){Lr(a.annotations)}function Lr(t){const e=Me(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(Qe()),r=encodeURIComponent(n);window.location.href=`mailto:${encodeURIComponent(qe)}?subject=${o}&body=${r}`}function Ot(){if(typeof crypto.randomUUID=="function")return crypto.randomUUID();const t=crypto.getRandomValues(new Uint8Array(16));t[6]=t[6]&15|64,t[8]=t[8]&63|128;const e=Array.from(t,n=>n.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}function Yn(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Qe(){const t=new Date,e=c=>String(c).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,r=(document.title||"").trim(),i=c=>c.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return r?s=`${i(r)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const Q=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function Sr(){return`
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
    `}function Ne(){return Q(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function Xn(){return Q(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function Mr(){return Q(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function Qr(){return Q(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function Nr(){return Q(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function _n(){return Q(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function Wn(){return Ne()}function Jn(){return`
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
    `}function Zn(){return Q(`
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    `)}function Ir(){return Q(`
      <path d="M4 9v-4a1 1 0 0 1 1 -1h4" />
      <path d="M20 9v-4a1 1 0 0 0 -1 -1h-4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1 -1 1h-4" />
    `)}function $r(){return Q(`
      <path d="M9 4v4a1 1 0 0 1 -1 1h-4" />
      <path d="M15 4v4a1 1 0 0 0 1 1h4" />
      <path d="M9 20v-4a1 1 0 0 0 -1 -1h-4" />
      <path d="M15 20v-4a1 1 0 0 1 1 -1h4" />
    `)}function Pr(){return Q(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function Gn(){return Q(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function to(){return Q(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function Or(){return E==="top"?Gn():to()}function eo(){return`
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
    `}function zr(){return`
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
    `}function S(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function Ie(){try{const t=localStorage.getItem(Wt);if(!t)return;const e=JSON.parse(t);e.pageKey===S(window.location.href)&&wt(e.id,!1),localStorage.removeItem(Wt)}catch(t){}}let M=new Map,$e=Promise.resolve(),Z=!1,no=!1;const oo=3e5,ao=1e4,Hr=oo;let zt=null,Ht=ao,Rt="/health";const Rr={pending:"Checking the server",ok:"Server connected",refused:"Server refused it: check the address or the key",unreachable:"Server unreachable: notes are held here until it answers"};function ro(){const t=a.syncDot;if(!t)return;const e=a.syncStatus||"pending",n=Rr[e];t.setAttribute("data-sync-status",e),t.setAttribute("data-tip",n),t.setAttribute("aria-label",n)}function bt(t){a.syncStatus!==t&&(a.syncStatus=t,ro())}async function G(t,e){let n;try{n=await fetch(t,e)}catch(o){throw bt("unreachable"),o}if(!n.ok){bt("refused");const o=new Error(`HTTP ${n.status}`);throw o.status=n.status,o}return bt("ok"),n}function Pe(){return`${b.url}/annotations?site=${encodeURIComponent(T)}`}function io(t){return`${b.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(T)}`}function Br(){return Rt?`${b.url}${Rt}`:Pe()}function Fr(t){return`${b.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(T)}`}function tt(t){const e=Object.assign({},t);return b.apiKey&&(e["X-Uxnote-Key"]=b.apiKey),e}function Ur(t){return new Map(t.map(e=>[e.id,yt(e)]))}function yt(t){const e=typeof t=="string"?t:JSON.stringify(t);let n=2166136261;for(let o=0;o<e.length;o+=1)n^=e.charCodeAt(o),n=Math.imul(n,16777619)>>>0;return`${e.length}:${n.toString(36)}`}function Bt(){try{localStorage.setItem(Ue,JSON.stringify(Array.from(M)))}catch(t){console.warn("Annotator storage save error",t),so()}}function Dr(){let t=null;try{t=localStorage.getItem(Ue);const e=t?JSON.parse(t):[];M=new Map(Array.isArray(e)?e:[])}catch(e){console.warn("Uxnote sync: the stored server snapshot is unreadable",e),M=new Map}return t!==null}function Ft(t,e){console.warn("Uxnote sync:",t,e),!Z&&(Z=!0,O(t))}function so(){no||(no=!0,O("Uxnote: this browser has no room left, so notes are not kept for a reload"))}function B(t){return $e=$e.then(t,t),$e}async function Ut(){if(!b)return;let t;try{const n=await G(Pe(),{headers:tt({Accept:"application/json"})});try{t=await n.json()}catch(o){throw bt("refused"),o}}catch(n){Ft("Uxnote: could not read the annotations from the server",n),Ie();return}const e=(t&&t.annotations||[]).filter(pe);e.forEach(n=>{n.pageKey||(n.pageKey=S(n.pageUrl||window.location.href))}),jr(e),Z=!1,St(),pt(),ft(),_(),A(),Dt(),Ie()}function jr(t){const e=new Map(t.map(r=>[r.id,r])),n=[],o=new Set;a.annotations.forEach(r=>{const i=M.get(r.id);if(i===void 0||i!==yt(r)){n.push(r),o.add(r.id);return}const s=e.get(r.id);s&&(n.push(s),o.add(r.id))}),t.forEach(r=>{o.has(r.id)||n.push(r)}),a.annotations=n,M=Ur(t)}async function lo(){try{const t=await G(Br(),{headers:tt({Accept:"application/json"})});try{await t.json()}catch(e){return bt("refused"),!1}return!0}catch(t){return Rt&&t.status===404?(Rt="",lo()):!1}}async function co(t){zt=null;const e=a.syncStatus==="ok";if(!await lo()){po(Ht),Ht=Math.min(Ht*2,Hr);return}Ht=ao,po(oo),!t&&!e&&B(Ut)}function po(t){zt&&clearTimeout(zt),zt=setTimeout(()=>B(()=>co(!1)),t)}function Vr(){b&&B(()=>co(!0))}function Dt(){if(!b)return;const t=new Map(a.annotations.map(e=>[e.id,JSON.stringify(e)]));t.forEach((e,n)=>{M.get(n)!==yt(e)&&(a.syncPending.add(n),B(()=>ho(n,e)))}),M.forEach((e,n)=>{t.has(n)||B(()=>fo(n))})}async function Kr(t){const e=t&&t.screenshot;if(!e||!e.dataUrl)return!1;const o=await(await fetch(e.dataUrl)).blob(),r=await xo(o,t.id,{rethrow:!0});if(!r)throw new Error("the screenshot upload answered with no address");return t.screenshot={url:r.url,w:e.w,h:e.h,capturedAt:e.capturedAt},!0}function qr(){b&&(window.addEventListener("online",()=>Dt()),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&uo()}),window.addEventListener("pagehide",uo))}function uo(){if(!b)return;const t=new Map(a.annotations.map(e=>[e.id,JSON.stringify(e)]));t.forEach((e,n)=>{M.get(n)!==yt(e)&&ho(n,e,{keepalive:!0})}),M.forEach((e,n)=>{t.has(n)||fo(n,{keepalive:!0})})}async function ho(t,e,n={}){try{const o=a.annotations.find(i=>i.id===t),r=o&&o.screenshot&&o.screenshot.dataUrl;r&&(await Kr(o),e=JSON.stringify(o)),await G(io(t),{method:"PUT",headers:tt({"Content-Type":"application/json"}),keepalive:!!n.keepalive,body:e}),M.set(t,yt(e)),a.syncPending.delete(t),fr(),Z=!1,r?St():Bt()}catch(o){Ft("Uxnote: could not save this annotation on the server",o)}}async function fo(t,e={}){try{await G(io(t),{method:"DELETE",headers:tt(),keepalive:!!e.keepalive}),M.delete(t),Z=!1,Bt()}catch(n){Ft("Uxnote: could not delete this annotation on the server",n)}}function Yr(){b&&B(async()=>{try{await G(Pe(),{method:"DELETE",headers:tt()}),M=new Map,Z=!1,Bt()}catch(t){Ft("Uxnote: could not delete the annotations on the server",t)}})}let jt=null,mo=S(window.location.href);function Xr(){jt=null;const t=S(window.location.href);t!==mo&&(mo=t,pt(),ft(),_(),A(),B(Ut))}function wo(){jt&&clearTimeout(jt),jt=setTimeout(Xr,120)}function _r(){["pushState","replaceState"].forEach(t=>{const e=history[t];typeof e=="function"&&(history[t]=function(...o){const r=e.apply(this,o);return wo(),r})}),window.addEventListener("popstate",wo)}function go(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Wr(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const r=document.createElement("span");r.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(r),o.appendChild(i);const s=f=>{const g=!!f&&f.w>=4&&f.h>=4;n.style.display=g?"block":"none",g&&(n.style.left=`${f.x}px`,n.style.top=`${f.y}px`,n.style.width=`${f.w}px`,n.style.height=`${f.h}px`)};s(null);const c=f=>({x:Math.min(Math.max(f.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(f.clientY,0),document.documentElement.clientHeight)}),l=(f,g)=>({x:Math.min(f.x,g.x),y:Math.min(f.y,g.y),w:Math.abs(g.x-f.x),h:Math.abs(g.y-f.y)});let d=null;const p=f=>{f.preventDefault(),d=c(f),s(null)},h=f=>{d&&(f.preventDefault(),s(l(d,c(f))))},m=f=>{if(!d)return;const g=l(d,c(f));if(d=null,g.w<4||g.h<4){s(null);return}v({x:g.x+window.scrollX,y:g.y+window.scrollY,w:g.w,h:g.h})},v=f=>{document.removeEventListener("keydown",y,!0),document.removeEventListener("mousemove",h,!0),document.removeEventListener("mouseup",m,!0),e.remove(),o.remove(),t(f)},y=f=>{f.key==="Escape"&&(f.preventDefault(),v(null))};e.addEventListener("mousedown",p),i.addEventListener("click",()=>v(null)),document.addEventListener("mousemove",h,!0),document.addEventListener("mouseup",m,!0),document.addEventListener("keydown",y,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function Jr(t){const e=await window.snapdom.toCanvas(document.body,{scale:1,exclude:[".wn-annotator",".wn-annot-dimmer"],excludeMode:"remove"}),n=document.body.getBoundingClientRect(),o=n.width?e.width/n.width:1,r=n.left+window.scrollX,i=n.top+window.scrollY,s=Math.max(0,Math.round((t.x-r)*o)),c=Math.max(0,Math.round((t.y-i)*o)),l=Math.min(e.width-s,Math.max(1,Math.round(t.w*o))),d=Math.min(e.height-c,Math.max(1,Math.round(t.h*o)));if(l<1||d<1)return null;const p=document.createElement("canvas");return p.width=l,p.height=d,p.getContext("2d").drawImage(e,s,c,l,d,0,0,l,d),{canvas:p,w:l,h:d}}function Zr(){const t=document.documentElement;return{x:window.scrollX,y:window.scrollY,w:t.clientWidth,h:t.clientHeight}}const Gr=2e4;function ti(t){const e=Jr(t).then(o=>({shot:o}),o=>(console.warn("Uxnote screenshot:",o),{shot:null})),n=new Promise(o=>{setTimeout(()=>o({shot:null,timedOut:!0}),Gr)});return Promise.race([e,n])}async function ei(){if(!(!go()||a.mode==="screenshot")){j("screenshot");try{const t=F()?Zr():await Wr();if(!t)return;const e=ti(t),n=await re("Comment for this region?");if(!n)return;const{shot:o,timedOut:r}=await e;if(!o){O(r?"Uxnote: the page took too long to capture":"Uxnote: could not capture that region");return}const{comment:i}=n,s=Ot();let c={dataUrl:o.canvas.toDataURL("image/png"),w:o.w,h:o.h,capturedAt:Date.now()};if(b){const d=await new Promise(h=>o.canvas.toBlob(h,"image/png")),p=d?await xo(d,s):null;p?c={url:p.url,w:o.w,h:o.h,capturedAt:Date.now()}:O("Uxnote: the picture stays on this device until the server answers")}const l={id:s,type:"screenshot",comment:i.trim(),snippet:"",pageUrl:window.location.href,pageKey:S(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:c,createdAt:Date.now(),status:"active"};a.annotations.push(l),z(),J(l,null),A()}finally{j(null)}}}async function xo(t,e,n={}){try{const r=await(await G(Fr(e),{method:"PUT",headers:tt({"Content-Type":"image/png"}),body:t})).json();return r&&r.url?r:null}catch(o){if(console.warn("Uxnote screenshot:",o),n.rethrow)throw o;return null}}function bo(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=b?new URL(`${b.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function ni(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=document.createElement("button");o.type="button",o.className="wn-shot-lightbox-close wn-annotator",o.setAttribute("aria-label","Close the screenshot"),o.innerHTML=Zn(),e.appendChild(o);const r=()=>{document.removeEventListener("keydown",i,!0),e.remove()},i=s=>{s.key==="Escape"&&(s.preventDefault(),r())};o.addEventListener("click",r),e.addEventListener("click",r),document.addEventListener("keydown",i,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Xe):Xe(),window.Uxnote={refresh:$,setHidden:t=>Mt(!!t),toggleVisibility:()=>Mt(!a.hidden),isHidden:()=>!!a.hidden,sync:{pull:Ut,push:Dt,url:()=>b?b.url:null}}})();})();
