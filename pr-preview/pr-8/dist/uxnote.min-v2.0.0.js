(()=>{var Go=Object.defineProperty,tr=Object.defineProperties;var er=Object.getOwnPropertyDescriptors;var nn=Object.getOwnPropertySymbols;var nr=Object.prototype.hasOwnProperty,or=Object.prototype.propertyIsEnumerable;var on=(d,w,C)=>w in d?Go(d,w,{enumerable:!0,configurable:!0,writable:!0,value:C}):d[w]=C,Jt=(d,w)=>{for(var C in w||(w={}))nr.call(w,C)&&on(d,C,w[C]);if(nn)for(var C of nn(w))or.call(w,C)&&on(d,C,w[C]);return d},rn=(d,w)=>tr(d,er(w));(()=>{if(window.Uxnote)return;const d=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),w=t=>d?d.getAttribute(t):null,C=`${location.protocol}//${location.host}`,an=d&&(d.dataset.mailto||d.dataset.email||d.dataset.to)||"",St=w("isToolVisibleAtFirstLaunch")||w("istoolvisibleatfirstlaunch")||d&&(d.dataset.isToolVisibleAtFirstLaunch||d.dataset.istoolvisibleatfirstlaunch),Tt=w("isToolOnTopAtLaunch")||w("istoolontopatlaunch")||d&&(d.dataset.isToolOnTopAtLaunch||d.dataset.istoolontopatlaunch),sn=d&&(d.dataset.hiddentoolbydefault||d.dataset.hidden||d.dataset.collapsed||d.dataset.startHidden||""),ln=w("colorForHighlight")||w("colorForHighligh")||d&&(d.dataset.colorForHighlight||d.dataset.colorForHighligh),Zt=w("colorForTextHighligh")||w("colorForTextHighlight")||d&&(d.dataset.colorForTextHighligh||d.dataset.colorForTextHighlight),Wt=w("colorForElementHighlight")||w("colorForElementHighligh")||d&&(d.dataset.colorForElementHighlight||d.dataset.colorForElementHighligh),Gt="#4e9cf6",q=lt(ln||Wt||Zt||Gt,Gt),cn=lt(Zt||q,q),dn=lt(Wt||q,q),Mt={text:Rt(cn,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:Rt(dn,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:Rt(q,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let E=Tt!=null?P(Tt,!1)?"top":"bottom":d&&d.dataset.position||"bottom";const te="wn-toolbar-pos",ot=d&&(d.dataset.dock||d.dataset.layout)||"",Nt=`uxnote:site:${C}`,ee=`${Nt}:synced`,ne=`uxnote:import-files:${C}`,oe=`uxnote:hidden:${C}`,$t=`uxnote:pending:${C}`,re=(d&&d.dataset.serverUrl||"").trim().replace(/\/+$/,""),v=re?{url:re,apiKey:d&&d.dataset.serverApiKey||""}:null,ae=P(d&&d.dataset.jsonExport,!0),It=P(d&&d.dataset.jsonImport,!0),pn=P(d&&d.dataset.mailExport,!0),rt=(d&&d.dataset.theme||"").trim().toLowerCase(),Y=rt==="light"||rt==="dark"||rt==="reverse-auto"?rt:"auto",un=Y==="auto"||Y==="reverse-auto",H=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,mn=w("isBackdropVisible")||w("isbackdropvisible")||w("backdropVisible")||w("backdropvisible")||d&&(d.dataset.isBackdropVisible||d.dataset.isbackdropvisible||d.dataset.backdropVisible||d.dataset.backdropvisible||d.dataset.dim||d.dataset.dimpage||d.dataset.dimmer||d.dataset.overlay||d.dataset.dimLevel||d.dataset.dimlevel||d.dataset.dimstrength),fn=.2,ie=P(mn,!0),r={mode:null,annotations:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,toolbar:null,panel:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,markerLayer:null,syncDot:null,syncStatus:null,colors:Mt,customPosition:!1,dimEnabled:ie,dimOpacity:ie?fn:0,dimOverlay:null,filters:{query:""},hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null},se=window.matchMedia?window.matchMedia("(max-width: 640px)"):null;function at(){return se?se.matches:window.innerWidth<=640}function le(){const t=Hn();t&&(E=t);const e=On(),n=St!=null?!P(St,!0):null;r.hidden=e!==null?e:n!==null?n:P(sn,!1),It&&(r.importFiles=Fn()),ce(),Pn(),Ot(),hn(),wn(),gn(),dt(r.hidden),Dn(),v&&!Uo()&&(r.annotations=[]),W(),jt(),Me(),fo(),v||Xt(),v&&(z(Qt),Fo()),Nn()}function ce(){const t=getComputedStyle(document.body);r.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function hn(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
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
        padding-left: 15px;
        padding-right: 0px;
      }
      .wn-annot-logo svg {
        width: 86px;
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
    `,document.head.appendChild(t)}function wn(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${E}`;const e=f=>{const u=document.createElement("button");return u.className="wn-annot-btn wn-annotator",u.setAttribute("data-action",f.action),f.mode&&u.setAttribute("data-mode",f.mode),u.setAttribute("data-tip",f.tip),u.innerHTML=f.icon,u},n=f=>{const u=document.createElement("div");return u.className="wn-annot-group wn-annotator",f.forEach(g=>u.appendChild(e(g))),u},o=()=>{const f=document.createElement("div");return f.className="wn-annot-spacer wn-annotator",f},a=document.createDocumentFragment(),i=document.createElement("div");if(i.className="wn-annot-logo wn-annotator",i.innerHTML=Eo(),a.appendChild(i),v){const f=document.createElement("div");f.className="wn-annot-sync-dot wn-annotator",f.setAttribute("role","status"),a.appendChild(f),r.syncDot=f,Xe()}const s=[{action:"mode",mode:"text",tip:"Highlight text",icon:Pe()},{action:"mode",mode:"element",tip:"Annotate an element",icon:Qo()}];tn()&&s.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:To()});const l=[];It&&l.push({action:"import",tip:"Import JSON",icon:Lo()}),ae&&l.push({action:"export",tip:"Export JSON",icon:Ao()}),pn&&l.push({action:"mail",tip:"Send by mail",icon:So()});const c=[{action:"toggle-pos",tip:"Toolbar top / bottom",icon:$o()},{action:"toggle-panel",tip:"Show / hide annotations",icon:No()}];a.appendChild(o()),a.appendChild(n(s)),l.length&&(a.appendChild(o()),a.appendChild(n(l))),a.appendChild(o()),a.appendChild(n(c)),t.appendChild(a),document.body.appendChild(t),r.toolbar=t;const p=document.createElement("div");p.className="wn-annot-panel wn-annotator",p.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <button class="wn-annot-delete-all wn-annotator" type="button">
            ${Ue()}<span>All</span>
          </button>
        </div>
        <div class="wn-annot-filters wn-annotator">
          <div class="wn-annot-filter-row wn-annotator">
            <input id="wn-filter-search" class="wn-annotator" type="search" placeholder="Keyword search" />
          </div>
        </div>
      </div>
      <div class="wn-annot-list"></div>
    `,E==="left"&&(p.style.left="18px",p.style.right="auto"),document.body.appendChild(p),r.panel=p,p.style.display="none";const m=p.querySelector(".wn-annot-delete-all");m&&m.addEventListener("click",async f=>{f.stopPropagation(),await yo()});const y=document.createElement("div");y.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(y),r.markerLayer=y;const h=document.createElement("div");h.className="wn-annot-outline wn-annotator",h.style.display="none",document.body.appendChild(h),r.outlineBox=h;const b=document.createElement("div");b.className="wn-annot-tip wn-annotator",b.textContent="Active mode",document.body.appendChild(b),r.tip=b,t.addEventListener("click",Vn),A(),ft(),mt(),U(),ut(),$n(),xn()}function de(){r.dimOverlay&&r.dimOverlay.classList.toggle("is-visible",!r.hidden)}function gn(){if(!r.dimEnabled||r.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(r.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),r.dimOverlay=t,de()}function pe(){if(!r.visibilityToggle)return;const t=r.visibilityToggle,n=at()&&r.toolbar&&!r.hidden?r.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===r.toolbar?r.toolbar.insertBefore(t,r.toolbar.firstChild):document.body.appendChild(t))}function xn(){if(r.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Masquer Uxnote"),t.setAttribute("data-tip","Masquer Uxnote"),t.innerHTML=De(),t.addEventListener("click",Kn),r.visibilityToggle=t,pe(),pt(),ye()}function bn(){if(r.commentModal)return r.commentModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-comment-card wn-annotator";const n=document.createElement("h4");n.textContent="Add a comment";const o=document.createElement("textarea");o.className="wn-annotator",o.placeholder="Your comment...";const a=document.createElement("div");a.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator",i.textContent="Cancel";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",s.textContent="Save",a.appendChild(i),a.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(a),t.appendChild(e),document.body.appendChild(t),r.commentModal={backdrop:t,modal:e,textarea:o,title:n,okBtn:s,cancelBtn:i},r.commentModal}function it(){const t=r.commentModal;if(!t||!r.toolbar||!t.backdrop.classList.contains("show"))return;const e=t.modal,n=r.toolbar.getBoundingClientRect(),o=.75*(parseFloat(getComputedStyle(e).fontSize)||16);e.style.left=`${n.left+n.width/2}px`,E==="top"?(e.style.top=`${n.bottom+o}px`,e.style.bottom=""):(e.style.top="",e.style.bottom=`${window.innerHeight-n.top+o}px`)}function ue(t,e=""){return new Promise(n=>{const o=bn(),{backdrop:a,textarea:i,title:s,okBtn:l,cancelBtn:c}=o;s.textContent=t||"Add a comment",i.value=e||"",i.placeholder="Your comment...",a.classList.add("show"),it(),i.focus(),i.select();const p=b=>{a.classList.remove("show"),l.removeEventListener("click",m),c.removeEventListener("click",y),document.removeEventListener("keydown",h),window.removeEventListener("resize",it),n(b)},m=()=>{p({comment:i.value.trim()})},y=()=>p(null),h=b=>{b.key==="Escape"&&p(null),b.key==="Enter"&&!(b.shiftKey||b.altKey)&&(b.preventDefault(),m())};l.textContent="Save",c.textContent="Cancel",l.addEventListener("click",m),c.addEventListener("click",y),document.addEventListener("keydown",h),window.addEventListener("resize",it)})}async function zt(t){const e=await ue(t);return e||null}function yn(){if(r.importModal)return r.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const a=document.createElement("label");a.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),l=document.createElement("div");l.className="wn-annot-import-drop-title wn-annotator",l.textContent="Drop JSON files here";const c=document.createElement("div");c.className="wn-annot-import-drop-sub wn-annotator",c.textContent="or click to select files",s.appendChild(l),s.appendChild(c),a.appendChild(i),a.appendChild(s);const p=document.createElement("div");p.className="wn-annot-import-panel wn-annotator";const m=document.createElement("div");m.className="wn-annot-import-title-row wn-annotator";const y=document.createElement("h5");y.textContent="Loaded files";const h=document.createElement("span");h.className="wn-annot-import-count wn-annotator",h.textContent="0";const b=document.createElement("p");b.textContent="Files are saved automatically.";const f=document.createElement("div");f.className="wn-annot-import-list wn-annotator",m.appendChild(y),m.appendChild(h),p.appendChild(m),p.appendChild(b),p.appendChild(f);const u=document.createElement("div");u.className="wn-annot-actions wn-annotator";const g=document.createElement("button");g.type="button",g.className="wn-annot-pill cancel wn-annotator",g.textContent="Close",u.appendChild(g),o.appendChild(a),o.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(u),t.appendChild(e),document.body.appendChild(t);const Q=()=>{t.classList.remove("show"),document.removeEventListener("keydown",M)},M=x=>{x.key==="Escape"&&Q()},nt=x=>{x.target===t&&Q()};return g.addEventListener("click",Q),t.addEventListener("click",nt),["dragenter","dragover"].forEach(x=>{a.addEventListener(x,k=>{k.preventDefault(),k.stopPropagation(),a.classList.add("dragover")})}),["dragleave","drop"].forEach(x=>{a.addEventListener(x,k=>{k.preventDefault(),k.stopPropagation(),a.classList.remove("dragover")})}),a.addEventListener("drop",x=>{var Lt;const k=(Lt=x.dataTransfer)==null?void 0:Lt.files;k&&k.length&&me(Array.from(k))}),i.addEventListener("change",x=>{const k=x.target.files;k&&k.length&&me(Array.from(k)),i.value=""}),f.addEventListener("click",x=>{const k=x.target.closest("[data-import-remove]");k&&An(k.dataset.importRemove)}),r.importModal={backdrop:t,modal:e,fileInput:i,fileList:f,filesCount:h,onKey:M,close:Q},r.importModal}function vn(){if(!It)return;const t=yn();st(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function st(){if(!r.importModal)return;const{fileList:t,filesCount:e}=r.importModal,{fileCounts:n}=kn();if(t.innerHTML="",r.importFiles.length)r.importFiles.forEach(o=>{const a=document.createElement("div");a.className="wn-annot-import-card wn-annotator";const i=document.createElement("div");i.className="wn-annot-import-meta wn-annotator";const s=document.createElement("div");s.className="wn-annot-import-name wn-annotator",s.textContent=o.name;const l=document.createElement("div");l.className="wn-annot-import-sub wn-annotator";const c=n.get(o.id)||0,p=o.pageUrl?` | ${Sn(o.pageUrl,36)}`:"";l.textContent=`${c} comments | ${Ln(o.size)}${p}`,i.appendChild(s),i.appendChild(l);const m=document.createElement("div");m.className="wn-annot-import-actions wn-annotator";const y=document.createElement("div");y.className="wn-annot-import-badge wn-annotator",y.textContent=String(c);const h=document.createElement("button");h.type="button",h.className="wn-annot-import-remove wn-annotator",h.dataset.importRemove=o.id,h.textContent="x",m.appendChild(y),m.appendChild(h),a.appendChild(i),a.appendChild(m),t.appendChild(a)});else{const o=document.createElement("div");o.className="wn-annot-import-empty wn-annotator",o.textContent="No imported files yet.",t.appendChild(o)}e.textContent=String(r.importFiles.length)}function kn(){const t=new Map;return r.annotations.forEach(e=>{e.importFileId&&t.set(e.importFileId,(t.get(e.importFileId)||0)+1)}),{fileCounts:t}}async function me(t){if(!t||!t.length)return;const e=new Set(r.annotations.map(o=>o.id));let n=0;for(const o of t){const a=await Cn(o,e);if(!a)continue;const{fileMeta:i,annotations:s}=a;s.length&&(r.importFiles.push(i),r.annotations.push(...s),n+=s.length)}if(!n){st();return}N(),be(),J(),W(),F(),st()}async function Cn(t,e){let n;try{const c=await t.text();n=JSON.parse(c)}catch(c){return await he(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await he(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const a=Array.isArray(n)?t.lastModified:n.createdAt,i=Array.isArray(n)?"":n.pageUrl||"",s=Oe(),l=o.filter(Ut).map(c=>En(c,{createdAt:a,pageUrl:i,fileId:s,existingIds:e}));return{fileMeta:{id:s,name:t.name,size:t.size,pageUrl:i,importedAt:Date.now()},annotations:l}}function En(t,e){const n=t&&typeof t=="object"?t:{},o=n.pageUrl||e.pageUrl||window.location.href,a=Qn(n.id,e.existingIds),i=rn(Jt({},n),{id:a,createdAt:n.createdAt||e.createdAt||Date.now(),pageUrl:o,importFileId:e.fileId});return i.pageKey||(i.pageKey=L(o)),i}function Qn(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=xt();while(e.has(n));return e.add(n),n}function An(t){const e=r.importFiles.filter(n=>n.id!==t);e.length!==r.importFiles.length&&(r.importFiles=e,r.annotations=r.annotations.filter(n=>n.importFileId!==t),N(),be(),J(),W(),F(),st())}function Ln(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function Sn(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function Tn(){if(r.dialogModal)return r.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const a=document.createElement("div");a.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",a.appendChild(i),a.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(a),t.appendChild(e),document.body.appendChild(t),r.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},r.dialogModal}function fe({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:a=!0}){return new Promise(i=>{const{backdrop:s,title:l,message:c,okBtn:p,cancelBtn:m}=Tn();l.textContent=t,c.textContent=e,p.textContent=n;const y=!!o;m.style.display=y?"inline-flex":"none",m.textContent=o||"";const h=Q=>{s.classList.remove("show"),p.removeEventListener("click",b),m.removeEventListener("click",f),s.removeEventListener("click",u),document.removeEventListener("keydown",g),i(Q)},b=()=>h(!0),f=()=>h(!1),u=Q=>{Q.target===s&&a&&h(!1)},g=Q=>{Q.key==="Escape"&&h(!1),(Q.metaKey||Q.ctrlKey)&&Q.key==="Enter"&&b()};p.addEventListener("click",b),m.addEventListener("click",f),s.addEventListener("click",u),document.addEventListener("keydown",g),s.classList.add("show"),p.focus()})}async function Mn(t,e="Confirmation"){return fe({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function he(t,e="Information"){await fe({title:e,message:t,okLabel:"OK",cancelLabel:null})}function Nn(){document.addEventListener("mouseup",Bt),document.addEventListener("touchend",Bt),document.addEventListener("pointerup",Bt),document.addEventListener("mousemove",qn),document.addEventListener("click",Yn,!0),window.addEventListener("resize",$),window.addEventListener("resize",ft),window.addEventListener("resize",mt),window.addEventListener("resize",U),window.addEventListener("resize",pt),window.addEventListener("scroll",$,{passive:!0}),qo(),un&&H&&(H.addEventListener?H.addEventListener("change",Ot):H.addListener&&H.addListener(Ot))}function $n(){if(!r.panel)return;const t=r.panel.querySelector("#wn-filter-search");if(!t)return;t.value=r.filters.query;const e=()=>{r.filters.query=t.value.trim().toLowerCase(),A()};t.addEventListener("input",e)}function B(t,e={}){const n=e.keepOutline;if(r.mode===t){r.mode=null,we(),Ht(),n||ht();return}r.mode=t,we(),In(t),t!=="element"&&ht()}function we(){r.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===r.mode?e.classList.add("active"):e.classList.remove("active")})}function In(t){let e="";if(t==="text"?e="Select text then release to add a note.":t==="element"&&(e="Hover an element, click to annotate."),!e)return Ht();r.tip.textContent=e,r.tip.classList.add("show"),U(),requestAnimationFrame(U),requestAnimationFrame(U)}function Ht(){r.tip.classList.remove("show")}function zn(){if(r.toast)return r.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),document.body.appendChild(t),r.toast=t,t}function O(t){if(!t)return;const e=zn();e.textContent=t,e.classList.add("show"),r.toastTimer&&clearTimeout(r.toastTimer),r.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function Hn(){try{const t=localStorage.getItem(te);if(t==="top"||t==="bottom")return t}catch(t){}return null}function On(){try{const t=localStorage.getItem(oe);return t==null?null:t==="true"}catch(t){return null}}function Rn(t){try{localStorage.setItem(oe,t?"true":"false")}catch(e){}}function Ot(){const t=!!(H&&H.matches),e=Y==="dark"||Y==="auto"&&t||Y==="reverse-auto"&&!t;document.documentElement.setAttribute("data-wn-theme",e?"dark":"light")}function Pn(){if(!document||!document.documentElement)return;const t=document.documentElement,e=r.colors||Mt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,a=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",a.base),n("--wn-element-highlight-soft",a.soft),n("--wn-element-highlight-soft-end",a.softer),n("--wn-element-highlight-strong",a.strong),n("--wn-element-highlight-shadow",a.shadow),n("--wn-marker-text",a.text)}function Rt(t,e={}){var s,l,c;const n=lt(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,a=(l=e.softerAlpha)!=null?l:.04,i=(c=e.overlayAlpha)!=null?c:.7;return{base:n,overlay:S(n,i,S("#000000",i)),soft:S(n,o,S("#000000",o)),softer:S(n,a,S("#000000",a)),strong:S(n,.9,n),shadow:S(n,.24,"rgba(0,0,0,0.24)"),pill:S(n,.16,"rgba(0,0,0,0.16)"),pillBorder:S(n,.28,"rgba(0,0,0,0.28)"),text:Un(n)}}function lt(t,e){const n=Pt(t);return n||Pt(e)||"#000000"}function Pt(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function ge(t){const e=Pt(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function S(t,e=1,n=""){const o=ge(t);if(!o)return n||"";const a=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${a})`}function Un(t){const e=ge(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function R(t){const e=r.colors||Mt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function xe(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function Bn(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder))}function P(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function Fn(){try{const t=localStorage.getItem(ne),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||Oe(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function be(){try{localStorage.setItem(ne,JSON.stringify(r.importFiles||[]))}catch(t){}}function U(){if(!r.tip||!r.toolbar)return;const t=r.toolbar.getBoundingClientRect(),e=r.tip,n=10,o=t.left+t.width/2,a=E==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(a){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function Ut(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function Dn(){try{const t=localStorage.getItem(Nt),e=t?JSON.parse(t):[];r.annotations=(e||[]).filter(Ut),r.annotations.forEach(n=>{n.pageKey||(n.pageKey=L(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),r.annotations=[]}}function N(){ct(),v&&_t()}function ct(){try{localStorage.setItem(Nt,JSON.stringify(r.annotations)),v&&Ct()}catch(t){console.warn("Annotator storage save error",t),v&&Ye()}}async function Vn(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(o==="screenshot"){await Jo();return}B(o);return}if(n==="export"){ae&&vo();return}if(n==="import"){vn();return}if(n==="mail"){await ko();return}if(n==="toggle-panel"){jn();return}if(n==="toggle-pos"){Xn(E==="bottom"?"top":"bottom"),ve();return}}}function jn(){const t=r.panel.style.display==="none";r.panel.style.display=t?"":"none",ut()}function Kn(){dt(!r.hidden)}function dt(t){r.hidden=t,Rn(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(B(null),Ht(),ht()),ye(),de(),pt(),ft(),t||($(),mt(),U()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function ye(){if(!r.visibilityToggle)return;const t=r.hidden?"Show Uxnote":"Hide Uxnote";r.visibilityToggle.classList.toggle("is-muted",r.hidden),r.visibilityToggle.innerHTML=r.hidden?Io():De(),r.visibilityToggle.setAttribute("aria-label",t),r.visibilityToggle.setAttribute("aria-pressed",r.hidden?"true":"false"),r.visibilityToggle.setAttribute("data-tip",t)}function pt(){const t=r.visibilityToggle;if(!t)return;pe();const e=18;if(at()){r.hidden?(t.style.bottom=`${e}px`,t.style.left=`${e}px`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",E==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function ut(){if(!r.panel||!r.toolbar)return;const t=r.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=r.panel.style.display==="none";t.classList.toggle("active",!e)}function mt(){if(!r.panel||!r.toolbar)return;const t=r.panel,e=18,n=r.toolbar.getBoundingClientRect();if(at()){t.style.width="100vw",t.style.maxHeight="100vh",t.style.height="100vh",t.style.left="0",t.style.right="0",t.style.top="0",t.style.bottom="0",t.style.borderRadius="0";return}t.style.width=`min(360px, calc(100vw - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",E==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):E==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function Xn(t){E=t==="top"?"top":"bottom";const e=r.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${E}`));try{localStorage.setItem(te,E)}catch(n){}ve(),pt(),U(),it(),mt(),ft()}function ve(){if(!r.toolbar)return;const t=r.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=E==="top"?Be():Fe())}function ft(){if(!r.toolbar||r.customPosition||!(ot==="push"||ot==="dock"||ot==="pad"||ot==="true"))return;const t=document.body;r.basePadding||ce();const e=r.basePadding;if(r.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=r.toolbar.getBoundingClientRect(),o=Jt({},e);E==="top"?o.top=e.top+n.height:E==="bottom"?o.bottom=e.bottom+n.height:E==="left"?o.left=e.left+n.width:E==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}async function Bt(){if(r.mode!=="text")return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!(D(e.commonAncestorContainer)&&D(e.startContainer)&&D(e.endContainer))){t.removeAllRanges(),O("This area is a popup or overlay. It cannot be annotated.");return}const o=t.toString().trim();if(!o)return;const a=await zt("Comment for this highlight?");if(!a)return;const{comment:i}=a,s=xt(),l=Zn(e,o),c=wt(e,s);t.removeAllRanges();const p={id:s,type:"text",target:l,comment:i.trim(),snippet:o.slice(0,180),pageUrl:window.location.href,pageKey:L(window.location.href),createdAt:Date.now(),status:"active"};r.annotations.push(p),N(),V(p,c),A(),B(null,{keepOutline:!0})}function qn(t){if(r.mode!=="element")return;const e=t.target;if(!e||!D(e)){ht();return}const n=e.getBoundingClientRect();Jn(n)}async function Yn(t){if(r.mode!=="element")return;const e=t.target;if(!e||!D(e)){O("This area is a popup or overlay. It cannot be annotated.");return}t.preventDefault(),t.stopPropagation();const n=await zt("Comment for this element?");if(!n)return;const{comment:o}=n,a=xt(),i=Dt(e),s=oo(e),l=e.getBoundingClientRect(),c={id:a,type:"element",target:{xpath:i,css:s,tag:e.tagName.toLowerCase()},comment:o.trim(),snippet:e.innerText?e.innerText.trim().slice(0,120):e.tagName,pageUrl:window.location.href,pageKey:L(window.location.href),rect:{x:l.x+window.scrollX,y:l.y+window.scrollY,w:l.width,h:l.height},createdAt:Date.now(),status:"active"};r.annotations.push(c),N(),V(c,e),Se(e,a),A(),B(null,{keepOutline:!0})}function Ft(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function _(t){const e=r.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function J(){Object.keys(r.highlightSpans||{}).forEach(t=>{_(t).forEach(e=>{e&&e.parentNode&&Ft(e)})}),r.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&Ft(t)}),Object.values(r.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),r.markerLayer&&(r.markerLayer.innerHTML=""),r.markers={},Object.keys(r.elementTargets||{}).forEach(t=>{Te(t)}),r.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function _n(t){const e=r.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete r.markers[t],Te(t);let n=_(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&Ft(o)}),delete r.highlightSpans[t]}function F(){Object.entries(r.markers).forEach(([t,e])=>{const n=r.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function Jn(t){const e=r.outlineBox;e.style.display="block",e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function ht(){r.outlineBox.style.display="none"}function ke(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&ke(t.parentElement):!1}function D(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||ke(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function Zn(t,e){return{startXPath:Dt(t.startContainer),startOffset:t.startOffset,endXPath:Dt(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function wt(t,e){let n=[];const o=t.cloneRange();if(Wn(o).forEach(i=>{const s=Gn(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",l=>{l.stopPropagation(),tt(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return r.highlightSpans[e]=n,n[0]}function ir(t,e){return wt(t,e)}function Ce(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function Wn(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!Ce(t,o))continue}catch(a){if(!Ce(t,o))continue}e.push(o)}return e}function Gn(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:a}=e;let i=t,s=a;if(o>0&&(i=i.splitText(o),s=a-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const l=document.createElement("span");return l.className="uxnote-textmark",l.dataset.uxnoteId=n,l.addEventListener("click",c=>{c.stopPropagation(),tt(n)}),i.parentNode.insertBefore(l,i),l.appendChild(i),l}function Ee(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function to(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),a=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=a-n,l=i-o;return s<=0||l<=0?null:{x:n,y:o,width:s,height:l}}function Qe(t){if(!t||!Ee(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const p=n.querySelector("summary");if(p&&!p.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const a=window.getComputedStyle(n);if(a.display==="none"||a.visibility==="hidden"||a.visibility==="collapse"||a.opacity==="0")return null;const i=a.overflowX||a.overflow,s=a.overflowY||a.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const p=n.getBoundingClientRect(),m=to(e,p);if(!m)return null;e=m}n=n.parentElement}return e}function eo(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function Ae(t){if(!t||t.nodeType!==1)return r.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:eo(t)||r.markerLayer||document.body}function Le(t){return t===document.body||t===r.markerLayer||t===document.documentElement}function no(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(a){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(a){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const a=n.getAttribute("data-uxnote-open");if(a){const i=document.querySelector(a);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const a=n.id;if(a){const i=document.querySelector(`[aria-controls="${gt(a)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function Se(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),r.elementTargets[e]=t,!0}function Te(t){const e=r.elementTargets[t];if(!e||e.nodeType!==1){delete r.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const l=s.filter(c=>c!==t);l.length?i.dataset.uxnoteIds=l.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(a=>a!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete r.elementTargets[t]}function Dt(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const a=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${a}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function gt(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function oo(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${gt(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let a=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(a+=`.${i.slice(0,2).map(gt).join(".")}`),e.unshift(a),n.parentElement&&n.parentElement.id){e.unshift(`#${gt(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function Z(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function W(){r.annotations.forEach(t=>{t.pageKey===L(window.location.href)&&ro(t)}),A()}function ro(t){const e=G(t);if(!e){t.status="missing",Me();return}t.status="active",Vt(t,e)}function Vt(t,e){if(e){if(e.type==="screenshot"){V(t,null);return}if(e.type==="text"&&e.range){const n=wt(e.range,t.id);V(t,n);return}e.type==="element"&&e.el&&(Se(e.el,t.id),V(t,e.el))}}function ao(t){if(!t)return null;const e=Z(t.startXPath),n=Z(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function G(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?io(t):t.type==="element"?lo(t):null:null:null}function io(t){const e=t.target||{},n=ao(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const a=so(o);return a?{type:"text",range:a}:null}function so(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!D(o))continue;const a=o.nodeValue.indexOf(e);if(a===-1)continue;const i=document.createRange();return i.setStart(o,a),i.setEnd(o,a+e.length),i}return null}function lo(t){const e=t.target||{};if(e.xpath){const a=Z(e.xpath);if(a&&a.nodeType===1)return{type:"element",el:a}}if(e.css)try{const a=document.querySelector(e.css);if(a&&a.nodeType===1)return{type:"element",el:a}}catch(a){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const a=document.querySelectorAll(n);for(const i of a)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function co(){r.missingRetryTimer&&clearTimeout(r.missingRetryTimer),r.missingRetryTimer=setTimeout(()=>{jt()},300)}function Me(){r.missingObserver||!window.MutationObserver||(r.missingObserver=new MutationObserver(()=>{r.annotations.some(t=>t.status==="missing")&&co()}),r.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function po(){r.missingObserver&&(r.missingObserver.disconnect(),r.missingObserver=null)}function jt(){let t=!1;r.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==L(window.location.href))return;const n=G(e);n&&(e.status="active",Vt(e,n),t=!0)}),t&&(N(),A(),$()),r.annotations.some(e=>e.status==="missing")||po()}function uo(){let t=!1;r.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==L(window.location.href))return;const n=_(e.id).filter(Ee);if(n.length){r.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=G(e);if(o&&o.range){wt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(N(),A(),$())}function mo(){r.layoutTimer&&clearTimeout(r.layoutTimer),r.layoutTimer=setTimeout(()=>{$(),uo(),r.annotations.some(t=>t.status==="missing")&&jt()},120)}function fo(){r.layoutObserver||!window.MutationObserver||(r.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&mo()}),r.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function V(t,e){if(t.pageKey!==L(window.location.href)||!r.markerLayer)return;const n=r.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=r.annotations.findIndex(c=>c.id===t.id)+1,o.dataset.wnAnnotId=t.id;const a=R(t);xe(o,a),o.addEventListener("click",()=>tt(t.id));const i=$e(t,e),s=Ne(t,i),l=Ae(i&&i.anchor?i.anchor:e);if(o.parentNode!==l&&l.appendChild(o),o.style.zIndex=Le(l)?"":"9999",!i){o.style.display="none",r.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",Ie(o,i,t),r.markers[t.id]={el:o,rect:i,frame:s}}function Ne(t,e){const n=r.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const a=r.markerLayer||document.body;return o.parentNode!==a&&a.appendChild(o),o.style.setProperty("--wn-shot-frame",R(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function $e(t,e){var n;if(t.type==="text"){const a=(e?[e]:_(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!a)return null;const i=Qe(a);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:a}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||r.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?Z(t.target.xpath):null);if(!o)return null;const a=Qe(o);return a?{x:a.x,y:a.y,w:a.width,h:a.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function Ie(t,e,n){const o=ho(n),i=(t.offsetParent||document.body).getBoundingClientRect(),s=i.x+window.scrollX,l=i.y+window.scrollY,c=e.x+window.scrollX,p=e.y+window.scrollY;t.style.left=`${c-s+e.w+o.x+4}px`,t.style.top=`${p-l+o.y-4}px`}function ho(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=r.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function $(){Object.entries(r.markers).forEach(([t,e])=>{const n=r.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:$e(n);if(e.frame=Ne(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const a=Ae(o.anchor);e.el.parentNode!==a&&a.appendChild(e.el),e.el.style.zIndex=Le(a)?"":"9999",Ie(e.el,o,n),xe(e.el,R(n))})}function wo(){if(!r.panel)return;r.panel.style.display==="none"&&(r.panel.style.display="",ut())}function go(t){if(!r.panel)return;wo();const e=r.panel.querySelector(".wn-annot-list");if(!e)return;e.querySelectorAll(".wn-annot-item").forEach(a=>a.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function tt(t,e=!1,n,o){var l;const a=r.annotations.find(c=>c.id===t);if(!a)return;if(go(t),a.status==="missing"){const c=G(a);if(c)a.status="active",Vt(a,c),A();else{O("This annotation is not on this page.");return}}const i=G(a);if(i){const c=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;c&&no(c)&&setTimeout(()=>{$()},160)}if(!((o||a.pageKey)===L(window.location.href))&&e){try{localStorage.setItem($t,JSON.stringify({id:a.id,pageKey:a.pageKey,pageUrl:n||a.pageUrl}))}catch(c){}window.location.href=n||a.pageUrl||window.location.href;return}if(a.type==="text"){const p=(_(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];p&&(p.scrollIntoView({behavior:"smooth",block:"center"}),Kt(p,R(a).base))}else if(a.type==="element"){const c=i&&i.el?i.el:(l=a.target)!=null&&l.xpath?Z(a.target.xpath):null;c&&c.scrollIntoView&&(c.scrollIntoView({behavior:"smooth",block:"center"}),Kt(c,R(a).base))}else if(a.type==="screenshot"&&a.rect){window.scrollTo({top:Math.max(0,a.rect.y+a.rect.h/2-window.innerHeight/2),behavior:"smooth"});const c=r.markers[a.id];c&&c.frame&&Kt(c.frame,R(a).base)}}function Kt(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=r.colors)==null?void 0:i.element)==null?void 0:s.base)||"#4e9cf6",a=S(o,.6,"rgba(78,156,246,0.6)");t.style.boxShadow=`0 0 0 3px ${a}`,setTimeout(()=>{t.style.boxShadow=n},800)}function ze(){if(!r.panel)return null;let t=r.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://github.com/Qu4tro/uxnote-fork",e.target="_blank",e.rel="noreferrer noopener",e.textContent="uxnote-fork on GitHub",t.appendChild(e),r.panel.appendChild(t)}return t}function A(){const t=r.panel.querySelector(".wn-annot-list"),e=r.panel.querySelector("h3");if(t.innerHTML="",!r.annotations.length){const o=document.createElement("div");o.className="wn-annot-empty",o.textContent="No annotations yet.",t.appendChild(o),e&&(e.textContent="Annotations (0)");const a=ze();return}const n=r.annotations.slice().sort((o,a)=>o.createdAt-a.createdAt).filter(o=>{const a=r.filters.query,i=`${o.comment||""} ${o.snippet||""}`.toLowerCase();return!a||i.includes(a)});e&&(e.textContent=`Annotations (${n.length})`),n.forEach((o,a)=>{const i=document.createElement("div");i.className="wn-annot-item",i.dataset.id=o.id,Bn(i,R(o));const s=document.createElement("div");s.className="wn-annot-card-top";const l=document.createElement("div");l.className="wn-annot-card-top-left";const c=document.createElement("div");if(c.className="wn-annot-number",c.textContent=`#${a+1}`,l.appendChild(c),o.status==="missing"){const x=document.createElement("div");x.className="wn-annot-missing",x.textContent="Missing",l.appendChild(x)}const p=document.createElement("div");p.className="wn-annot-card-top-right";const m=document.createElement("button");m.type="button",m.className="wn-annot-edit wn-annotator",m.setAttribute("aria-label","Edit this annotation"),m.innerHTML=Mo(),m.addEventListener("click",async x=>{x.stopPropagation(),await bo(o.id)}),p.appendChild(m);const y=document.createElement("button");y.type="button",y.className="wn-annot-delete wn-annotator",y.setAttribute("aria-label","Delete this annotation"),y.innerHTML=Ue(),y.addEventListener("click",x=>{x.stopPropagation(),xo(o.id)}),p.appendChild(y),s.appendChild(l),s.appendChild(p);const h=document.createElement("div");h.className="wn-annot-comment";const b=o.comment||"\u2014";h.textContent=b;const f=document.createElement("div");f.className="wn-annot-meta";const u=new Date(o.createdAt),g=u.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),Q=u.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});f.textContent=`${g} \u2022 ${Q}`,l.appendChild(f);const M=document.createElement("button");M.type="button",M.className="wn-annot-showmore wn-annotator",M.textContent="See more",M.addEventListener("click",x=>{x.stopPropagation();const k=h.classList.toggle("expanded");M.textContent=k?"See less":"See more"}),b.length<160&&(M.style.display="none"),i.appendChild(s),i.appendChild(h);const nt=Zo(o);if(nt){const x=document.createElement("div");x.className="wn-annot-shot";const k=document.createElement("img");k.src=nt,k.alt="The screenshot of this annotation",k.addEventListener("click",Lt=>{Lt.stopPropagation(),Wo(nt)}),x.appendChild(k),i.appendChild(x)}i.appendChild(M),i.addEventListener("click",()=>{tt(o.id,!0,o.pageUrl,o.pageKey),at()&&r.panel&&(r.panel.style.display="none",ut())}),t.appendChild(i)}),ze()}function xo(t){const e=r.annotations.findIndex(n=>n.id===t);e!==-1&&(r.annotations.splice(e,1),N(),_n(t),A(),F(),$())}async function bo(t){const e=r.annotations.find(a=>a.id===t);if(!e)return;const n=await ue("Edit this annotation",e.comment||"");if(!n)return;const{comment:o}=n;e.comment=o.trim(),N(),A()}async function yo(){!r.annotations.length||!await Mn("Delete all annotations?","Delete")||(r.annotations=[],ct(),v&&Ko(),J(),A(),F())}function vo(){const t=He(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=Re(),o.click(),URL.revokeObjectURL(n)}function He(t=r.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}async function ko(){Co(r.annotations)}function Co(t){const e=He(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(Re()),a=encodeURIComponent(n),i=(an||"").trim(),s=i?encodeURIComponent(i):"",l="?";window.location.href=`mailto:${s}${l}subject=${o}&body=${a}`}function xt(){if(typeof crypto.randomUUID=="function")return crypto.randomUUID();const t=crypto.getRandomValues(new Uint8Array(16));t[6]=t[6]&15|64,t[8]=t[8]&63|128;const e=Array.from(t,n=>n.toString(16).padStart(2,"0")).join("");return`${e.slice(0,8)}-${e.slice(8,12)}-${e.slice(12,16)}-${e.slice(16,20)}-${e.slice(20)}`}function Oe(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Re(){const t=new Date,e=l=>String(l).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,a=(document.title||"").trim(),i=l=>l.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return a?s=`${i(a)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const I=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function Eo(){return`
      <svg class="wn-annot-logo-img" viewBox="0 0 1512 357" role="img" aria-label="uxnote-fork logo">
        <g fill="#7d58fa">
          <path d="M8.5 20.125A12.125 12.125 0 0 1 32.75 20.125V96A5.5 5.5 0 0 0 43.75 96V20.125A12.125 12.125 0 0 1 68 20.125V96A5.5 5.5 0 0 0 79 96V20.125A12.125 12.125 0 0 1 103.25 20.125V96A5.5 5.5 0 0 0 114.25 96V20.125A12.125 12.125 0 0 1 138.5 20.125V110C138.5 125 133 132 126 138L107 157C98 166 91 178 91 192C91 222 112 262 112 306C112 334 94 349 73.5 349C53 349 35 334 35 306C35 262 56 222 56 192C56 178 49 166 40 157L21 138C14 132 8.5 125 8.5 110Z"/>
          <path d="M264.64 263.94Q248.05 263.94 237.28 257.82Q226.51 251.7 221.26 239.37Q216 227.05 216 208.4V153.58Q216 142.06 222.01 136.1Q228.02 130.14 239.18 130.14Q250.34 130.14 256.39 136.1Q262.45 142.06 262.45 153.58V209.59Q262.45 218.99 266.35 223.68Q270.24 228.37 278.58 228.37Q287.96 228.37 293.98 221.53Q300 214.7 300 203.66V153.58Q300 142.06 306.01 136.1Q312.02 130.14 323.18 130.14Q334.34 130.14 340.39 136.1Q346.45 142.06 346.45 153.58V239.89Q346.45 263.42 323.87 263.42Q312.97 263.42 307.04 257.37Q301.12 251.31 301.12 239.89V224.72L305.27 237.55Q299.46 250.31 289.2 257.12Q278.94 263.94 264.64 263.94ZM360.11 263.14Q351.53 263.14 346.33 258.38Q341.13 253.61 341 246.31Q340.87 239.01 346.97 231.44L385.58 184.58V205.14L350.08 161.84Q343.89 154.1 344.07 146.88Q344.24 139.66 349.44 134.9Q354.64 130.14 363.22 130.14Q371.72 130.14 377.1 132.89Q382.47 135.65 387.2 141.92L411.52 173.44H395.37L419.78 141.92Q424.6 135.65 430.1 132.89Q435.59 130.14 443.67 130.14Q452.5 130.14 457.57 134.95Q462.64 139.76 462.86 146.97Q463.07 154.19 456.71 161.93L421.13 205.21V184.43L460.08 231.44Q466.44 238.92 466.18 246.22Q465.92 253.52 460.63 258.33Q455.35 263.14 446.52 263.14Q438.44 263.14 433.03 260.38Q427.61 257.63 422.63 251.36L395.37 216.73H411.33L384 251.36Q379.1 257.37 373.86 260.25Q368.61 263.14 360.11 263.14ZM501.18 263.42Q490.02 263.42 484.01 257.37Q478 251.31 478 239.89V153.58Q478 142.15 483.92 136.15Q489.85 130.14 500.75 130.14Q511.65 130.14 517.49 136.15Q523.33 142.15 523.33 153.58V165.66L520.46 154.97Q526.7 142.8 538.34 136.21Q549.97 129.62 564.7 129.62Q580.1 129.62 590.02 135.61Q599.93 141.6 604.89 153.88Q609.85 166.16 609.85 185.07V239.89Q609.85 251.31 603.84 257.37Q597.83 263.42 586.67 263.42Q575.51 263.42 569.45 257.37Q563.4 251.31 563.4 239.89V186.97Q563.4 175.26 559.37 170.22Q555.34 165.19 547.43 165.19Q537.08 165.19 530.77 171.86Q524.45 178.53 524.45 189.74V239.89Q524.45 263.42 501.18 263.42ZM679.9 263.94Q658.57 263.94 642.63 255.85Q626.68 247.76 617.84 232.59Q609 217.42 609 196.73Q609 181.17 613.98 168.78Q618.97 156.4 628.33 147.57Q637.69 138.75 650.78 134.18Q663.86 129.62 679.9 129.62Q701.4 129.62 717.27 137.71Q733.13 145.8 741.97 160.84Q750.81 175.88 750.81 196.73Q750.81 212.3 745.83 224.73Q740.84 237.16 731.48 245.98Q722.12 254.81 709.03 259.38Q695.95 263.94 679.9 263.94ZM679.9 229.65Q687.06 229.65 692.45 226.21Q697.84 222.76 700.97 215.49Q704.1 208.23 704.1 196.73Q704.1 179.36 697.31 171.63Q690.52 163.91 679.9 163.91Q672.92 163.91 667.44 167.31Q661.97 170.71 658.84 177.89Q655.71 185.07 655.71 196.73Q655.71 214.02 662.5 221.83Q669.29 229.65 679.9 229.65ZM825.91 263.94Q806.45 263.94 793.68 257.87Q780.91 251.79 774.68 239.7Q768.45 227.61 768.45 209.34V166.75H759.71Q751.28 166.75 746.64 162.33Q742 157.9 742 149.66Q742 141.32 746.64 136.94Q751.28 132.56 759.71 132.56H768.45V116.31Q768.45 104.89 774.51 98.88Q780.56 92.87 791.72 92.87Q802.88 92.87 808.89 98.88Q814.9 104.89 814.9 116.31V132.56H836.23Q844.83 132.56 849.39 136.94Q853.94 141.32 853.94 149.66Q853.94 157.9 849.39 162.33Q844.83 166.75 836.23 166.75H814.9V207.85Q814.9 217.37 819.46 221.97Q824.03 226.57 833.96 226.57Q837.56 226.57 840.96 225.78Q844.35 225 847.29 224.91Q851.42 224.65 854.09 227.45Q856.76 230.25 856.76 239.87Q856.76 247.58 854.4 252.96Q852.04 258.34 845.94 260.74Q842.21 262.12 835.98 263.03Q829.75 263.94 825.91 263.94ZM912.94 263.94Q889.44 263.94 872.37 255.69Q855.3 247.43 846.15 232.31Q837 217.18 837 196.66Q837 176.83 845.72 161.79Q854.44 146.74 869.76 138.18Q885.07 129.62 904.6 129.62Q919 129.62 930.67 134.3Q942.33 138.99 950.69 147.67Q959.06 156.36 963.44 168.65Q967.81 180.94 967.81 196.14Q967.81 201.34 964.89 203.82Q961.96 206.3 955.79 206.3H875.85V184.34H933.69L929.68 187.59Q929.68 178.09 926.99 172Q924.3 165.91 919.23 162.85Q914.16 159.8 906.74 159.8Q898.61 159.8 892.66 163.55Q886.71 167.31 883.59 174.65Q880.46 182 880.46 192.96V195.12Q880.46 213.68 888.67 221.67Q896.88 229.65 914.12 229.65Q919.91 229.65 927.39 228.29Q934.87 226.93 941.61 224.25Q948.42 221.62 953.43 223.26Q958.44 224.9 961.17 228.93Q963.89 232.95 964.17 238.16Q964.44 243.36 961.73 248.1Q959.02 252.85 952.99 255.55Q944.03 259.8 933.74 261.87Q923.45 263.94 912.94 263.94ZM996.31 208.94Q988.57 208.94 983.28 203.74Q978 198.54 978 190.9Q978 182.99 983.28 177.92Q988.57 172.85 996.31 172.85H1048.06Q1055.87 172.85 1061.07 177.92Q1066.27 182.99 1066.27 190.9Q1066.27 198.54 1061.07 203.74Q1055.87 208.94 1048.06 208.94ZM1101.49 263.42Q1090.33 263.42 1084.27 257.37Q1078.22 251.31 1078.22 239.89V166.75H1071.55Q1063.12 166.75 1058.56 162.33Q1054 157.9 1054 149.66Q1054 141.32 1058.56 136.94Q1063.12 132.56 1071.55 132.56H1091.78L1078.22 144.84V137.46Q1078.22 108.59 1092.7 94.15Q1107.19 79.71 1135.93 76.69L1143.64 75.91Q1151.86 75.05 1156.82 78.02Q1161.78 80.99 1163.58 85.85Q1165.37 90.7 1164.51 95.86Q1163.64 101.01 1160.49 104.66Q1157.35 108.32 1152.27 108.75L1148.61 109.01Q1135.24 110.05 1129.95 114.74Q1124.67 119.44 1124.67 128.75V137.23L1119.16 132.56H1139.69Q1148.28 132.56 1152.76 136.94Q1157.23 141.32 1157.23 149.66Q1157.23 157.9 1152.76 162.33Q1148.28 166.75 1139.69 166.75H1124.67V239.89Q1124.67 263.42 1101.49 263.42ZM1209.9 263.94Q1188.57 263.94 1172.63 255.85Q1156.68 247.76 1147.84 232.59Q1139 217.42 1139 196.73Q1139 181.17 1143.98 168.78Q1148.97 156.4 1158.33 147.57Q1167.69 138.75 1180.78 134.18Q1193.86 129.62 1209.9 129.62Q1231.4 129.62 1247.27 137.71Q1263.13 145.8 1271.97 160.84Q1280.81 175.88 1280.81 196.73Q1280.81 212.3 1275.83 224.73Q1270.84 237.16 1261.48 245.98Q1252.12 254.81 1239.03 259.38Q1225.95 263.94 1209.9 263.94ZM1209.9 229.65Q1217.06 229.65 1222.45 226.21Q1227.84 222.76 1230.97 215.49Q1234.1 208.23 1234.1 196.73Q1234.1 179.36 1227.31 171.63Q1220.52 163.91 1209.9 163.91Q1202.92 163.91 1197.44 167.31Q1191.97 170.71 1188.84 177.89Q1185.71 185.07 1185.71 196.73Q1185.71 214.02 1192.5 221.83Q1199.29 229.65 1209.9 229.65ZM1313.87 263.42Q1302.28 263.42 1296.14 257.37Q1290 251.31 1290 239.89V153.58Q1290 142.15 1295.92 136.15Q1301.85 130.14 1312.75 130.14Q1323.65 130.14 1329.49 136.15Q1335.33 142.15 1335.33 153.58V164.18H1332.72Q1335.21 148.53 1346.08 139.35Q1356.94 130.18 1373.19 129.62Q1380.67 129.43 1384.43 133.52Q1388.19 137.62 1388.38 148.4Q1388.57 157.93 1384.63 163.39Q1380.69 168.85 1369.81 169.96L1363.74 170.49Q1349.99 171.72 1343.65 178.11Q1337.31 184.49 1337.31 197.03V239.89Q1337.31 251.31 1331.3 257.37Q1325.29 263.42 1313.87 263.42ZM1396.18 263.42Q1385.02 263.42 1379.01 257.37Q1373 251.31 1373 239.89V98.04Q1373 86.62 1379.01 80.61Q1385.02 74.6 1396.18 74.6Q1407.34 74.6 1413.39 80.61Q1419.45 86.62 1419.45 98.04V184.17H1419.97L1452.03 145.6Q1458.42 137.71 1464.08 133.92Q1469.75 130.14 1479.36 130.14Q1488.98 130.14 1494.17 134.91Q1499.36 139.68 1499.61 146.72Q1499.86 153.77 1494 160.89L1459.59 201.57V185.34L1498.1 233.93Q1503.8 241.22 1502.82 248.06Q1501.85 254.9 1496.18 259.16Q1490.52 263.42 1481.85 263.42Q1471.38 263.42 1465.16 259.63Q1458.93 255.85 1452.71 247.61L1419.97 207.44H1419.45V239.89Q1419.45 263.42 1396.18 263.42Z"/>
        </g>
      </svg>
    `}function Pe(){return I(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function Qo(){return I(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function Ao(){return I(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function Lo(){return I(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function So(){return I(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function To(){return I(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function Mo(){return Pe()}function Ue(){return`
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
    `}function No(){return I(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function Be(){return I(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function Fe(){return I(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function $o(){return E==="top"?Be():Fe()}function De(){return`
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
    `}function Io(){return`
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
    `}function L(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function Xt(){try{const t=localStorage.getItem($t);if(!t)return;const e=JSON.parse(t);e.pageKey===L(window.location.href)&&tt(e.id,!1),localStorage.removeItem($t)}catch(t){}}let T=new Map,qt=Promise.resolve(),j=!1,Ve=!1;const je=3e5,Ke=1e4,zo=je;let bt=null,yt=Ke,vt="/health";const Ho={pending:"Checking the server",ok:"Server connected",refused:"Server refused it: check the address or the key",unreachable:"Server unreachable: notes are held here until it answers"};function Xe(){const t=r.syncDot;if(!t)return;const e=r.syncStatus||"pending",n=Ho[e];t.setAttribute("data-sync-status",e),t.setAttribute("data-tip",n),t.setAttribute("aria-label",n)}function et(t){r.syncStatus!==t&&(r.syncStatus=t,Xe())}async function K(t,e){let n;try{n=await fetch(t,e)}catch(o){throw et("unreachable"),o}if(!n.ok){et("refused");const o=new Error(`HTTP ${n.status}`);throw o.status=n.status,o}return et("ok"),n}function Yt(){return`${v.url}/annotations?site=${encodeURIComponent(C)}`}function qe(t){return`${v.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function Oo(){return vt?`${v.url}${vt}`:Yt()}function Ro(t){return`${v.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function X(t){const e=Object.assign({},t);return v.apiKey&&(e["X-Uxnote-Key"]=v.apiKey),e}function Po(t){return new Map(t.map(e=>[e.id,kt(e)]))}function kt(t){const e=typeof t=="string"?t:JSON.stringify(t);let n=2166136261;for(let o=0;o<e.length;o+=1)n^=e.charCodeAt(o),n=Math.imul(n,16777619)>>>0;return`${e.length}:${n.toString(36)}`}function Ct(){try{localStorage.setItem(ee,JSON.stringify(Array.from(T)))}catch(t){console.warn("Annotator storage save error",t),Ye()}}function Uo(){let t=null;try{t=localStorage.getItem(ee);const e=t?JSON.parse(t):[];T=new Map(Array.isArray(e)?e:[])}catch(e){console.warn("Uxnote sync: the stored server snapshot is unreadable",e),T=new Map}return t!==null}function Et(t,e){console.warn("Uxnote sync:",t,e),!j&&(j=!0,O(t))}function Ye(){Ve||(Ve=!0,O("Uxnote: this browser has no room left, so notes are not kept for a reload"))}function z(t){return qt=qt.then(t,t),qt}async function Qt(){if(!v)return;let t;try{const n=await K(Yt(),{headers:X({Accept:"application/json"})});try{t=await n.json()}catch(o){throw et("refused"),o}}catch(n){Et("Uxnote: could not read the annotations from the server",n),Xt();return}const e=(t&&t.annotations||[]).filter(Ut);e.forEach(n=>{n.pageKey||(n.pageKey=L(n.pageUrl||window.location.href))}),Bo(e),j=!1,ct(),J(),W(),F(),A(),_t(),Xt()}function Bo(t){const e=new Map(t.map(a=>[a.id,a])),n=[],o=new Set;r.annotations.forEach(a=>{const i=T.get(a.id);if(i===void 0||i!==kt(a)){n.push(a),o.add(a.id);return}const s=e.get(a.id);s&&(n.push(s),o.add(a.id))}),t.forEach(a=>{o.has(a.id)||n.push(a)}),r.annotations=n,T=Po(t)}async function _e(){try{const t=await K(Oo(),{headers:X({Accept:"application/json"})});try{await t.json()}catch(e){return et("refused"),!1}return!0}catch(t){return vt&&t.status===404?(vt="",_e()):!1}}async function Je(t){bt=null;const e=r.syncStatus==="ok";if(!await _e()){Ze(yt),yt=Math.min(yt*2,zo);return}yt=Ke,Ze(je),!t&&!e&&z(Qt)}function Ze(t){bt&&clearTimeout(bt),bt=setTimeout(()=>z(()=>Je(!1)),t)}function Fo(){v&&z(()=>Je(!0))}function _t(){if(!v)return;const t=new Map(r.annotations.map(e=>[e.id,JSON.stringify(e)]));t.forEach((e,n)=>{T.get(n)!==kt(e)&&z(()=>Vo(n,e))}),T.forEach((e,n)=>{t.has(n)||z(()=>jo(n))})}async function Do(t){const e=t&&t.screenshot;if(!e||!e.dataUrl)return!1;const o=await(await fetch(e.dataUrl)).blob(),a=await en(o,t.id,{rethrow:!0});if(!a)throw new Error("the screenshot upload answered with no address");return t.screenshot={url:a.url,w:e.w,h:e.h,capturedAt:e.capturedAt},!0}async function Vo(t,e){try{const n=r.annotations.find(a=>a.id===t),o=n&&n.screenshot&&n.screenshot.dataUrl;o&&(await Do(n),e=JSON.stringify(n)),await K(qe(t),{method:"PUT",headers:X({"Content-Type":"application/json"}),body:e}),T.set(t,kt(e)),j=!1,o?ct():Ct()}catch(n){Et("Uxnote: could not save this annotation on the server",n)}}async function jo(t){try{await K(qe(t),{method:"DELETE",headers:X()}),T.delete(t),j=!1,Ct()}catch(e){Et("Uxnote: could not delete this annotation on the server",e)}}function Ko(){v&&z(async()=>{try{await K(Yt(),{method:"DELETE",headers:X()}),T=new Map,j=!1,Ct()}catch(t){Et("Uxnote: could not delete the annotations on the server",t)}})}let At=null,We=L(window.location.href);function Xo(){At=null;const t=L(window.location.href);t!==We&&(We=t,J(),W(),F(),A(),z(Qt))}function Ge(){At&&clearTimeout(At),At=setTimeout(Xo,120)}function qo(){["pushState","replaceState"].forEach(t=>{const e=history[t];typeof e=="function"&&(history[t]=function(...o){const a=e.apply(this,o);return Ge(),a})}),window.addEventListener("popstate",Ge)}function tn(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Yo(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const a=document.createElement("span");a.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(a),o.appendChild(i);const s=u=>{const g=!!u&&u.w>=4&&u.h>=4;n.style.display=g?"block":"none",g&&(n.style.left=`${u.x}px`,n.style.top=`${u.y}px`,n.style.width=`${u.w}px`,n.style.height=`${u.h}px`)};s(null);const l=u=>({x:Math.min(Math.max(u.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(u.clientY,0),document.documentElement.clientHeight)}),c=(u,g)=>({x:Math.min(u.x,g.x),y:Math.min(u.y,g.y),w:Math.abs(g.x-u.x),h:Math.abs(g.y-u.y)});let p=null;const m=u=>{u.preventDefault(),p=l(u),s(null)},y=u=>{p&&(u.preventDefault(),s(c(p,l(u))))},h=u=>{if(!p)return;const g=c(p,l(u));if(p=null,g.w<4||g.h<4){s(null);return}b({x:g.x+window.scrollX,y:g.y+window.scrollY,w:g.w,h:g.h})},b=u=>{document.removeEventListener("keydown",f,!0),document.removeEventListener("mousemove",y,!0),document.removeEventListener("mouseup",h,!0),e.remove(),o.remove(),t(u)},f=u=>{u.key==="Escape"&&(u.preventDefault(),b(null))};e.addEventListener("mousedown",m),i.addEventListener("click",()=>b(null)),document.addEventListener("mousemove",y,!0),document.addEventListener("mouseup",h,!0),document.addEventListener("keydown",f,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function _o(t){const e=await window.snapdom.toCanvas(document.body,{scale:1,exclude:[".wn-annotator",".wn-annot-dimmer"],excludeMode:"remove"}),n=document.body.getBoundingClientRect(),o=n.width?e.width/n.width:1,a=n.left+window.scrollX,i=n.top+window.scrollY,s=Math.max(0,Math.round((t.x-a)*o)),l=Math.max(0,Math.round((t.y-i)*o)),c=Math.min(e.width-s,Math.max(1,Math.round(t.w*o))),p=Math.min(e.height-l,Math.max(1,Math.round(t.h*o)));if(c<1||p<1)return null;const m=document.createElement("canvas");return m.width=c,m.height=p,m.getContext("2d").drawImage(e,s,l,c,p,0,0,c,p),{canvas:m,w:c,h:p}}async function Jo(){if(!(!tn()||r.mode==="screenshot")){B("screenshot");try{const t=await Yo();if(!t)return;const e=_o(t).catch(c=>(console.warn("Uxnote screenshot:",c),null)),n=await zt("Comment for this region?");if(!n)return;const o=await e;if(!o){O("Uxnote: could not capture that region");return}const{comment:a}=n,i=xt();let s={dataUrl:o.canvas.toDataURL("image/png"),w:o.w,h:o.h,capturedAt:Date.now()};if(v){const c=await new Promise(m=>o.canvas.toBlob(m,"image/png")),p=c?await en(c,i):null;p?s={url:p.url,w:o.w,h:o.h,capturedAt:Date.now()}:O("Uxnote: the picture stays on this device until the server answers")}const l={id:i,type:"screenshot",comment:a.trim(),snippet:"",pageUrl:window.location.href,pageKey:L(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:s,createdAt:Date.now(),status:"active"};r.annotations.push(l),N(),V(l,null),A()}finally{B(null)}}}async function en(t,e,n={}){try{const a=await(await K(Ro(e),{method:"PUT",headers:X({"Content-Type":"image/png"}),body:t})).json();return a&&a.url?a:null}catch(o){if(console.warn("Uxnote screenshot:",o),n.rethrow)throw o;return null}}function Zo(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=v?new URL(`${v.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function Wo(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=()=>{document.removeEventListener("keydown",a,!0),e.remove()},a=i=>{i.key==="Escape"&&(i.preventDefault(),o())};e.addEventListener("click",o),document.addEventListener("keydown",a,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",le):le(),window.Uxnote={refresh:$,setHidden:t=>dt(!!t),toggleVisibility:()=>dt(!r.hidden),isHidden:()=>!!r.hidden,sync:{pull:Qt,push:_t,url:()=>v?v.url:null}}})();})();
