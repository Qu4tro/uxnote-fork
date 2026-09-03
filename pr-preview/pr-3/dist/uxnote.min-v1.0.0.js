(()=>{var Ko=Object.defineProperty,Vo=Object.defineProperties;var Xo=Object.getOwnPropertyDescriptors;var Ze=Object.getOwnPropertySymbols;var Yo=Object.prototype.hasOwnProperty,_o=Object.prototype.propertyIsEnumerable;var Ge=(m,y,C)=>y in m?Ko(m,y,{enumerable:!0,configurable:!0,writable:!0,value:C}):m[y]=C,Xt=(m,y)=>{for(var C in y||(y={}))Yo.call(y,C)&&Ge(m,C,y[C]);if(Ze)for(var C of Ze(y))_o.call(y,C)&&Ge(m,C,y[C]);return m},Qe=(m,y)=>Vo(m,Xo(y));(()=>{if(window.Uxnote)return;const m=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),y=t=>m?m.getAttribute(t):null,C=`${location.protocol}//${location.host}`,tn=m&&(m.dataset.mailto||m.dataset.email||m.dataset.to)||"",Lt=y("isToolVisibleAtFirstLaunch")||y("istoolvisibleatfirstlaunch")||m&&(m.dataset.isToolVisibleAtFirstLaunch||m.dataset.istoolvisibleatfirstlaunch),At=y("isToolOnTopAtLaunch")||y("istoolontopatlaunch")||m&&(m.dataset.isToolOnTopAtLaunch||m.dataset.istoolontopatlaunch),en=m&&(m.dataset.hiddentoolbydefault||m.dataset.hidden||m.dataset.collapsed||m.dataset.startHidden||""),nn=y("colorForHighlight")||y("colorForHighligh")||m&&(m.dataset.colorForHighlight||m.dataset.colorForHighligh),Yt=y("colorForTextHighligh")||y("colorForTextHighlight")||m&&(m.dataset.colorForTextHighligh||m.dataset.colorForTextHighlight),_t=y("colorForElementHighlight")||y("colorForElementHighligh")||m&&(m.dataset.colorForElementHighlight||m.dataset.colorForElementHighligh),Jt="#4e9cf6",G=ct(nn||_t||Yt||Jt,Jt),on=ct(Yt||G,G),an=ct(_t||G,G),Nt={text:It(on,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:It(an,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:It(G,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let E=At!=null?dt(At,!1)?"top":"bottom":m&&m.dataset.position||"bottom";const Wt="wn-toolbar-pos",it=m&&(m.dataset.dock||m.dataset.layout)||"",Zt=`uxnote:site:${C}`,Gt=`uxnote:annotator:${C}`,Qt=`uxnote:annotators:${C}`,te=`uxnote:import-files:${C}`,ee=`uxnote:hidden:${C}`,St=`uxnote:pending:${C}`,ne=(m&&m.dataset.serverUrl||"").trim().replace(/\/+$/,""),L=ne?{url:ne,apiKey:m&&m.dataset.serverApiKey||""}:null,rn=y("isBackdropVisible")||y("isbackdropvisible")||y("backdropVisible")||y("backdropvisible")||m&&(m.dataset.isBackdropVisible||m.dataset.isbackdropvisible||m.dataset.backdropVisible||m.dataset.backdropvisible||m.dataset.dim||m.dataset.dimpage||m.dataset.dimmer||m.dataset.overlay||m.dataset.dimLevel||m.dataset.dimlevel||m.dataset.dimstrength),sn=.2,oe=dt(rn,!0),a={mode:null,annotations:[],annotatorName:"",annotatorNames:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,toolbar:null,panel:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,exportModal:null,markerLayer:null,colors:Nt,customPosition:!1,dimEnabled:oe,dimOpacity:oe?sn:0,dimOverlay:null,filters:{priority:"all",author:"all",query:""},hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null},ae=window.matchMedia?window.matchMedia("(max-width: 640px)"):null;function Q(){return ae?ae.matches:window.innerWidth<=640}function re(){const t=In();t&&(E=t);const e=On(),n=Lt!=null?!dt(Lt,!0):null;a.hidden=e!==null?e:n!==null?n:dt(en,!1),a.annotatorName=we(),a.annotatorNames=Un(),a.importFiles=jn(),ie(),Pn(),ln(),cn(),dn(),ut(a.hidden),L?Xe():qn(),pt(),vt(),Ut(),Me(),ho(),L||je(),Tn()}function ie(){const t=getComputedStyle(document.body);a.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function ln(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
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
      }
      .wn-annot-toolbar {
        --wn-accent: #6d56c7;
        --wn-bg: #f6f2fb;
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
        background: var(--wn-bg);
        color: #4b4557;
        z-index: 2147483647;
        font-family: var(--wn-icon-font);
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        box-shadow: 0 8px 24px rgba(73, 64, 157, 0.14);
        border-radius: 999px;
        border: 1px solid rgba(109, 86, 199, 0.15);
        backdrop-filter: blur(10px);
      }
      .wn-annot-toolbar button {
        border: none;
        background: transparent;
        color: #575062;
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
        border: 1px solid rgba(109, 86, 199, 0.15);
        background: #f6f2fb;
        color: #4b4557;
        box-shadow: 0 8px 24px rgba(73, 64, 157, 0.18);
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
        color: #3e384a;
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
          background: rgba(246, 242, 251, 0.35);
          border-color: rgba(109, 86, 199, 0.22);
          box-shadow: 0 6px 16px rgba(73, 64, 157, 0.16);
        }
        .wn-annot-logo {
          display: none;
        }
      }
      .wn-annot-toolbar button:hover {
        background: rgba(109, 86, 199, 0.12);
        color: #3e384a;
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
        background: #fdfcff;
        color: #342d43;
        border: 1px solid rgba(109, 86, 199, 0.16);
        border-radius: 18px;
        box-shadow: 0 10px 26px rgba(73, 64, 157, 0.16);
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
        color: #3f3852;
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
      .wn-annot-filters select,
      .wn-annot-filters input[type="search"] {
        height: 34px;
        border-radius: 12px;
        border: 1px solid rgba(109, 86, 199, 0.18);
        background: #fff;
        padding: 6px 10px;
        font-size: 12px;
        color: #342d43;
      }
      .wn-annot-filter-row select {
        flex: 1 1 auto;
        min-width: 0;
      }
      .wn-annot-filter-row input[type="search"] {
        width: 100%;
      }
      .wn-annot-filter-clear {
        border: 1px solid rgba(109, 86, 199, 0.25);
        background: rgba(109, 86, 199, 0.08);
        color: #5a5266;
        width: 26px;
        height: 26px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 12px;
        line-height: 1;
        padding: 0;
      }
      .wn-annot-filter-clear:hover {
        background: rgba(109, 86, 199, 0.16);
      }
      .wn-annot-filters select:focus,
      .wn-annot-filters input[type="search"]:focus {
        outline: none;
        border-color: rgba(109, 86, 199, 0.6);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.14);
      }
      .wn-annot-filters .wn-annot-filter-label {
        font-size: 12px;
        color: #5a5266;
        font-weight: 600;
        margin-right: 4px;
      }
      .wn-annot-panel .wn-annot-empty {
        color: #7b7588;
        font-size: 13px;
        padding: 10px 0;
        background: rgba(109, 86, 199, 0.04);
        border: 1px dashed rgba(109, 86, 199, 0.18);
        border-radius: 12px;
        text-align: center;
      }
      .wn-annot-delete-all {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(209, 59, 59, 0.1);
        border: 1px solid rgba(209, 59, 59, 0.25);
        color: #b83232;
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
        background: #ffffff;
        border: 1px solid rgba(109, 86, 199, 0.14);
        border-radius: 14px;
        padding: 14px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
        box-shadow: 0 2px 8px rgba(73, 64, 157, 0.08);
      }
      .wn-annot-item:hover {
        border-color: rgba(109, 86, 199, 0.32);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(73, 64, 157, 0.12);
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
        gap: 10px;
        margin-bottom: 8px;
        align-items: flex-start;
      }
      .wn-annot-card-top-left {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-width: 0;
      }
      .wn-annot-card-top-right {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        min-width: 0;
      }
      .wn-annot-delete {
        border: 1px solid rgba(209, 59, 59, 0.2);
        background: rgba(209, 59, 59, 0.08);
        color: #d13b3b;
        width: 30px;
        height: 30px;
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
        color: #b83232;
      }
      .wn-annot-delete:active {
        transform: translateY(1px);
      }
      .wn-annot-edit {
        border: 1px solid rgba(109, 86, 199, 0.22);
        background: rgba(109, 86, 199, 0.08);
        color: #4b4557;
        width: 30px;
        height: 30px;
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
        color: #352f46;
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
        color: #7b7588;
        background: linear-gradient(180deg, transparent, rgba(255,255,255,0.75));
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
        min-width: 32px;
        height: 32px;
        padding: 0 10px;
        border-radius: 12px;
        background: var(--wn-item-number-bg, rgba(109, 86, 199, 0.12));
        border: 1px solid var(--wn-item-number-border, rgba(109, 86, 199, 0.24));
        color: var(--wn-item-number-text, #000000);
        font-weight: 800;
        font-size: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        letter-spacing: 0.2px;
      }
      .wn-annot-meta {
        font-size: 11px;
        color: #7f7891;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        max-width: 220px;
        text-align: right;
        word-break: break-word;
        line-height: 1.4;
      }
      .wn-annot-meta-bottom {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
        margin-left: auto;
        margin-top: 10px;
        width: 100%;
        text-align: right;
      }
      .wn-annot-priority {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 700;
        color: #4b4557;
        padding: 8px 10px;
        border-radius: 12px;
        border: 1px solid rgba(109, 86, 199, 0.2);
        background: rgba(109, 86, 199, 0.06);
      }
      .wn-annot-priority .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .wn-annot-priority.low { border-color: rgba(47,191,113,0.35); background: rgba(47,191,113,0.08); color: #1f7a4c; }
      .wn-annot-priority.low .dot { background: #2fbf71; }
      .wn-annot-priority.medium { border-color: rgba(227,178,60,0.35); background: rgba(227,178,60,0.08); color: #8a6b1f; }
      .wn-annot-priority.medium .dot { background: #e3b23c; }
      .wn-annot-priority.high { border-color: rgba(224,91,91,0.35); background: rgba(224,91,91,0.1); color: #a03232; }
      .wn-annot-priority.high .dot { background: #e05b5b; }
      .wn-annot-missing {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 700;
        color: #a03232;
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
        color: #352f46;
        margin-bottom: 8px;
      }
      .wn-annot-comment {
        font-size: 12px;
        color: #5a5266;
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
        color: #6d56c7;
        font-weight: 700;
        font-size: 12px;
        cursor: pointer;
        margin-left: auto;
        margin-top: 6px;
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
        background: #f6f2fb;
        color: #3f3852;
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        border: 1px solid rgba(109, 86, 199, 0.2);
        box-shadow: 0 12px 28px rgba(73, 64, 157, 0.18);
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
        background: #f6f2fb;
        color: #342d43;
        padding: 10px 14px;
        border-radius: 999px;
        font-size: 12px;
        z-index: 2147483100;
        pointer-events: none;
        opacity: 0;
        border: 1px solid rgba(109, 86, 199, 0.16);
        box-shadow: 0 10px 24px rgba(73, 64, 157, 0.15);
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
        background: rgba(28, 22, 48, 0.35);
        backdrop-filter: blur(4px);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 2147483200;
        padding: 18px;
      }
      .wn-annot-modal-backdrop.show { display: flex; }
      .wn-annot-modal {
        background: #f6f2fb;
        color: #342d43;
        border: 1px solid rgba(109, 86, 199, 0.18);
        border-radius: 16px;
        box-shadow: 0 16px 38px rgba(73, 64, 157, 0.2);
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
        color: #3f3852;
      }
      .wn-annot-dialog-message {
        font-size: 13px;
        line-height: 1.6;
        color: #3f3852;
      }
      .wn-annot-name-row {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 4px;
      }
      .wn-annot-name-row label {
        font-size: 13px;
        color: #4b4557;
        font-weight: 600;
      }
      .wn-annot-name-inputs {
        display: flex;
        gap: 8px;
        align-items: center;
        flex-wrap: wrap;
      }
      .wn-annot-name-select {
        min-width: 140px;
      }
      .wn-annot-modal textarea {
        width: 100%;
        min-height: 90px;
        border-radius: 12px;
        border: 1px solid rgba(109, 86, 199, 0.22);
        background: #fff;
        padding: 10px 12px;
        font-size: 14px;
        color: #342d43;
        resize: vertical;
        outline: none;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
      }
      .wn-annot-modal input[type="text"] {
        width: 100%;
        border-radius: 12px;
        border: 1px solid rgba(109, 86, 199, 0.22);
        background: #fff;
        padding: 10px 12px;
        font-size: 14px;
        color: #342d43;
        outline: none;
        box-shadow: inset 0 1px 2px rgba(0,0,0,0.05);
      }
      .wn-annot-modal textarea:focus {
        border-color: rgba(109, 86, 199, 0.55);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.15);
      }
      .wn-annot-modal input[type="text"]:focus {
        border-color: rgba(109, 86, 199, 0.55);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.15);
      }
      @media (max-width: 640px) {
        .wn-annot-modal textarea,
        .wn-annot-modal input[type="text"],
        .wn-annot-modal select {
          font-size: 16px;
        }
      }
      .wn-annot-export-modal {
        min-width: min(640px, calc(100vw - 40px));
        max-width: 860px;
      }
      .wn-annot-export-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }
      .wn-annot-export-panel {
        border: 1px solid rgba(109, 86, 199, 0.12);
        border-radius: 14px;
        padding: 12px;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 220px;
      }
      .wn-annot-export-panel h5 {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        color: #3f3852;
      }
      .wn-annot-export-panel p {
        margin: 0;
        font-size: 12px;
        color: #5a5266;
      }
      .wn-annot-export-list {
        display: grid;
        gap: 8px;
        overflow-y: auto;
        padding-right: 4px;
      }
      .wn-annot-export-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 14px;
        font-weight: 600;
        color: #3f3852;
      }
      .wn-annot-export-item input {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 6px;
        border: 1.5px solid rgba(109, 86, 199, 0.5);
        background: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.2s ease;
      }
      .wn-annot-export-item input:checked {
        background: #6d56c7;
        border-color: #6d56c7;
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.18);
      }
      .wn-annot-export-item input:checked::after {
        content: '';
        width: 8px;
        height: 5px;
        border-left: 2px solid #fff;
        border-bottom: 2px solid #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -55%) rotate(-45deg);
      }
      .wn-annot-export-item span {
        font-size: 14px;
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
        background: linear-gradient(135deg, rgba(109, 86, 199, 0.08), rgba(246, 242, 251, 0.95));
        cursor: pointer;
        transition: border 0.2s ease, transform 0.2s ease;
      }
      .wn-annot-import-drop:hover {
        transform: translateY(-1px);
        border-color: rgba(109, 86, 199, 0.6);
      }
      .wn-annot-import-drop.dragover {
        border-color: rgba(109, 86, 199, 0.9);
        background: linear-gradient(135deg, rgba(109, 86, 199, 0.16), rgba(246, 242, 251, 0.95));
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
        color: #3f3852;
      }
      .wn-annot-import-drop-sub {
        font-size: 12px;
        color: #5a5266;
        margin-top: 4px;
      }
      .wn-annot-import-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 12px;
      }
      .wn-annot-import-panel {
        border: 1px solid rgba(109, 86, 199, 0.12);
        border-radius: 14px;
        padding: 12px;
        background: #fff;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-height: 220px;
      }
      .wn-annot-import-panel h5 {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        color: #3f3852;
      }
      .wn-annot-import-title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .wn-annot-import-count {
        background: rgba(109, 86, 199, 0.16);
        color: #4b4557;
        border-radius: 999px;
        padding: 4px 8px;
        font-weight: 600;
        font-size: 11px;
        border: 1px solid rgba(109, 86, 199, 0.2);
      }
      .wn-annot-import-panel p {
        margin: 0;
        font-size: 12px;
        color: #5a5266;
      }
      .wn-annot-import-list {
        display: grid;
        gap: 8px;
        overflow-y: auto;
        overflow-x: hidden;
        padding-right: 4px;
      }
      .wn-annot-import-card {
        border: 1px solid rgba(109, 86, 199, 0.14);
        background: #f8f6fd;
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
        color: #3f3852;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .wn-annot-import-sub {
        font-size: 11px;
        color: #5a5266;
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
        color: #4b4557;
        border-radius: 999px;
        padding: 4px 8px;
        font-weight: 600;
        font-size: 11px;
        border: 1px solid rgba(109, 86, 199, 0.2);
      }
      .wn-annot-import-remove {
        border: 1px solid rgba(209, 59, 59, 0.35);
        background: rgba(209, 59, 59, 0.12);
        color: #b83232;
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
      .wn-annot-import-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: 8px;
      }
      .wn-annot-import-stat {
        background: rgba(109, 86, 199, 0.08);
        border: 1px solid rgba(109, 86, 199, 0.12);
        border-radius: 12px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .wn-annot-import-stat span:first-child {
        font-size: 11px;
        color: #5a5266;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }
      .wn-annot-import-stat span:last-child {
        font-size: 16px;
        font-weight: 700;
        color: #3f3852;
      }
      .wn-annot-import-empty {
        font-size: 12px;
        color: #5a5266;
        border: 1px dashed rgba(109, 86, 199, 0.18);
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
        color: #5a5563;
        border: 1px solid rgba(109, 86, 199, 0.25);
      }
      .wn-annot-modal .wn-annot-pill.cancel:hover {
        background: rgba(109, 86, 199, 0.08);
      }
      .wn-annot-modal .wn-annot-pill.primary {
        background: #6d56c7;
        color: #fdfdff;
        box-shadow: 0 10px 24px rgba(109, 86, 199, 0.35);
      }
      .wn-annot-modal .wn-annot-pill.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 14px 28px rgba(109, 86, 199, 0.4);
      }
      .wn-annot-modal .wn-annot-pill.secondary {
        background: rgba(109, 86, 199, 0.12);
        color: #4b4557;
        border: 1px solid rgba(109, 86, 199, 0.22);
      }
      .wn-annot-modal .wn-annot-pill.secondary:hover {
        background: rgba(109, 86, 199, 0.18);
      }
      .wn-annot-modal .wn-annot-prio {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .wn-annot-modal .wn-annot-prio label {
        font-size: 13px;
        color: #4b4557;
        font-weight: 600;
      }
      .wn-annot-modal .wn-annot-prio-options {
        display: flex;
        gap: 10px;
      }
      .wn-annot-modal .wn-annot-prio-btn {
        flex: 1 1 0;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 12px;
        border: 1px solid rgba(109, 86, 199, 0.22);
        background: #fff;
        cursor: pointer;
        transition: all 0.15s ease;
        font-size: 13px;
        font-weight: 600;
        color: #3e384a;
      }
      .wn-annot-modal .wn-annot-prio-btn .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
      }
      .wn-annot-modal .wn-annot-prio-btn[data-priority="low"] .dot { background: #2fbf71; }
      .wn-annot-modal .wn-annot-prio-btn[data-priority="medium"] .dot { background: #e3b23c; }
      .wn-annot-modal .wn-annot-prio-btn[data-priority="high"] .dot { background: #e05b5b; }
      .wn-annot-modal .wn-annot-prio-btn.active {
        border-color: rgba(109, 86, 199, 0.6);
        box-shadow: 0 0 0 3px rgba(109, 86, 199, 0.16);
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
        border: 2px solid #6d56c7;
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
        background: #f6f2fb;
        color: #3f3852;
        font: 12px/1.4 "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
        border: 1px solid rgba(109, 86, 199, 0.2);
        border-radius: 999px;
        box-shadow: 0 12px 28px rgba(73, 64, 157, 0.18);
        z-index: 2147483652;
      }
      .wn-shot-hint button {
        border: 1px solid rgba(109, 86, 199, 0.22);
        border-radius: 999px;
        padding: 6px 14px;
        font: inherit;
        font-weight: 600;
        background: #fff;
        color: #3e384a;
        cursor: pointer;
      }
      .wn-annot-shot {
        margin: 8px 0 4px;
      }
      .wn-annot-shot img {
        display: block;
        max-width: 100%;
        max-height: 140px;
        border: 1px solid rgba(109, 86, 199, 0.2);
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
    `,document.head.appendChild(t)}function cn(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${E}`;const e=h=>{const p=document.createElement("button");return p.className="wn-annot-btn wn-annotator",p.setAttribute("data-action",h.action),h.mode&&p.setAttribute("data-mode",h.mode),p.setAttribute("data-tip",h.tip),p.innerHTML=h.icon,p},n=h=>{const p=document.createElement("div");return p.className="wn-annot-group wn-annotator",h.forEach(g=>p.appendChild(e(g))),p},o=()=>{const h=document.createElement("div");return h.className="wn-annot-spacer wn-annotator",h},r=document.createDocumentFragment(),i=document.createElement("div");i.className="wn-annot-logo wn-annotator",i.innerHTML=Eo(),r.appendChild(i);const s=[{action:"mode",mode:"text",tip:"Highlight text",icon:Be()},{action:"mode",mode:"element",tip:"Annotate an element",icon:Lo()}];_e()&&s.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:So()});const d=[{action:"import",tip:"Import JSON",icon:No()},{action:"export",tip:"Export JSON",icon:Ao()}],l=[{action:"toggle-pos",tip:"Toolbar top / bottom",icon:$o()},{action:"toggle-panel",tip:"Show / hide annotations",icon:Mo()}];r.appendChild(o()),r.appendChild(n(s)),r.appendChild(o()),r.appendChild(n(d)),r.appendChild(o()),r.appendChild(n(l)),t.appendChild(r),document.body.appendChild(t),a.toolbar=t;const c=document.createElement("div");c.className="wn-annot-panel wn-annotator",c.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <button class="wn-annot-delete-all wn-annotator" type="button">
            ${Fe()}<span>All</span>
          </button>
        </div>
        <div class="wn-annot-filters wn-annotator">
          <div class="wn-annot-filter-row wn-annotator">
            <input id="wn-filter-search" class="wn-annotator" type="search" placeholder="Keyword search" />
          </div>
          <div class="wn-annot-filter-row wn-annotator">
            <label class="wn-annot-filter-label wn-annotator" for="wn-filter-priority">Priority</label>
            <select id="wn-filter-priority" class="wn-annotator">
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <button class="wn-annot-filter-clear wn-annotator" type="button" data-filter-clear="priority" aria-label="Clear priority filter">\u2715</button>
          </div>
          <div class="wn-annot-filter-row wn-annotator">
            <label class="wn-annot-filter-label wn-annotator" for="wn-filter-author">Reviewer</label>
            <select id="wn-filter-author" class="wn-annotator">
              <option value="all">All</option>
            </select>
            <button class="wn-annot-filter-clear wn-annotator" type="button" data-filter-clear="author" aria-label="Clear reviewer filter">\u2715</button>
          </div>
        </div>
      </div>
      <div class="wn-annot-list"></div>
    `,E==="left"&&(c.style.left="18px",c.style.right="auto"),document.body.appendChild(c),a.panel=c,Q()&&(c.style.display="none");const u=c.querySelector(".wn-annot-delete-all");u&&u.addEventListener("click",async h=>{h.stopPropagation(),await vo()});const f=document.createElement("div");f.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(f),a.markerLayer=f;const w=document.createElement("div");w.className="wn-annot-outline wn-annotator",w.style.display="none",document.body.appendChild(w),a.outlineBox=w;const x=document.createElement("div");x.className="wn-annot-tip wn-annotator",x.textContent="Active mode",document.body.appendChild(x),a.tip=x,t.addEventListener("click",Kn),$(),gt(),ht(),q(),ft(),Mn(),pn()}function se(){a.dimOverlay&&a.dimOverlay.classList.toggle("is-visible",!a.hidden)}function dn(){if(!a.dimEnabled||a.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(a.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),a.dimOverlay=t,se()}function le(){if(!a.visibilityToggle)return;const t=a.visibilityToggle,n=Q()&&a.toolbar&&!a.hidden?a.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===a.toolbar?a.toolbar.insertBefore(t,a.toolbar.firstChild):document.body.appendChild(t))}function pn(){if(a.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Masquer Uxnote"),t.setAttribute("data-tip","Masquer Uxnote"),t.innerHTML=De(),t.addEventListener("click",Xn),a.visibilityToggle=t,le(),mt(),ye()}function un(){if(a.commentModal)return a.commentModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator";const n=document.createElement("h4");n.textContent="Add a comment";const o=document.createElement("div");o.className="wn-annot-name-row wn-annotator";const r=document.createElement("label");r.textContent="Reviewer name";const i=document.createElement("div");i.className="wn-annot-name-inputs wn-annotator";const s=document.createElement("input");s.type="text",s.className="wn-annotator",s.placeholder="Reviewer name",i.appendChild(s),o.appendChild(r),o.appendChild(i);const d=document.createElement("textarea");d.className="wn-annotator",d.placeholder="Your comment...";const l=document.createElement("div");l.className="wn-annot-prio wn-annotator";const c=document.createElement("label");c.textContent="Priority";const u=document.createElement("div");u.className="wn-annot-prio-options wn-annotator";const f=(g,b)=>{const k=document.createElement("button");return k.type="button",k.className="wn-annot-prio-btn wn-annotator",k.setAttribute("data-priority",g),k.innerHTML=`<span class="dot wn-annotator"></span><span class="wn-annotator">${b}</span>`,k},w=[f("low","Low"),f("medium","Medium"),f("high","High")];w.forEach(g=>u.appendChild(g)),l.appendChild(c),l.appendChild(u);const x=document.createElement("div");x.className="wn-annot-actions wn-annotator";const h=document.createElement("button");h.type="button",h.className="wn-annot-pill cancel wn-annotator",h.textContent="Cancel";const p=document.createElement("button");return p.type="button",p.className="wn-annot-pill primary wn-annotator",p.textContent="Save",x.appendChild(h),x.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(d),e.appendChild(l),e.appendChild(x),t.appendChild(e),document.body.appendChild(t),a.commentModal={backdrop:t,modal:e,textarea:d,title:n,okBtn:p,cancelBtn:h,prioButtons:w,nameInput:s},a.commentModal}function ce(t,e="",n="medium",o=""){return new Promise(r=>{const i=un(),{backdrop:s,textarea:d,title:l,okBtn:c,cancelBtn:u,prioButtons:f,nameInput:w}=i;l.textContent=t||"Add a comment",d.value=e||"",d.placeholder="Your comment...",f.forEach(v=>v.classList.toggle("active",v.getAttribute("data-priority")===n));const x=v=>{f.forEach(M=>M.classList.remove("active")),v.classList.add("active")},h=f.map(v=>M=>x(v));f.forEach((v,M)=>v.addEventListener("click",h[M]));const p=a.annotatorNames||[],g=o||a.annotatorName||p[0]||"";w.value=g||"",w.disabled=!1,w.placeholder="Reviewer name",s.classList.add("show"),g?(d.focus(),d.select()):(w.focus(),w.select());const b=v=>{s.classList.remove("show"),c.removeEventListener("click",k),u.removeEventListener("click",N),s.removeEventListener("click",z),document.removeEventListener("keydown",D),f.forEach((M,S)=>M.removeEventListener("click",h[S])),r(v)},k=async()=>{const v=f.find(U=>U.classList.contains("active")),M=v?v.getAttribute("data-priority"):n,S=w.value.trim();if(!S){await Mt("Please enter a reviewer name.","Reviewer name required");return}be(S),b({comment:d.value.trim(),priority:M,author:S})},N=()=>b(null),z=v=>{v.target===s&&b(null)},D=v=>{v.key==="Escape"&&b(null),v.key==="Enter"&&!(v.shiftKey||v.altKey)&&(v.preventDefault(),k())};c.textContent="Save",u.textContent="Cancel",c.addEventListener("click",k),u.addEventListener("click",N),s.addEventListener("click",z),document.addEventListener("keydown",D)})}async function Tt(t){const e=await ce(t);return e||null}function mn(){if(a.exportModal)return a.exportModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-export-modal";const n=document.createElement("h4");n.textContent="Export annotations";const o=document.createElement("div");o.className="wn-annot-export-grid wn-annotator";const r=document.createElement("div");r.className="wn-annot-export-panel wn-annotator";const i=document.createElement("h5");i.textContent="Reviewers";const s=document.createElement("p");s.textContent="Choose reviewers to include.";const d=document.createElement("div");d.className="wn-annot-export-list wn-annotator",r.appendChild(i),r.appendChild(s),r.appendChild(d);const l=document.createElement("div");l.className="wn-annot-export-panel wn-annotator";const c=document.createElement("h5");c.textContent="Criticality";const u=document.createElement("p");u.textContent="Select priority levels.";const f=document.createElement("div");f.className="wn-annot-export-list wn-annotator",l.appendChild(c),l.appendChild(u),l.appendChild(f),o.appendChild(r),o.appendChild(l);const w=document.createElement("div");w.className="wn-annot-actions wn-annotator";const x=document.createElement("button");x.type="button",x.className="wn-annot-pill cancel wn-annotator",x.textContent="Cancel";const h=document.createElement("button");h.type="button",h.className="wn-annot-pill secondary wn-annotator",h.textContent="Send by mail";const p=document.createElement("button");p.type="button",p.className="wn-annot-pill primary wn-annotator",p.textContent="Export file",w.appendChild(x),w.appendChild(h),w.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(w),t.appendChild(e),document.body.appendChild(t);const g=()=>{t.classList.remove("show"),document.removeEventListener("keydown",b)},b=N=>{N.key==="Escape"&&g()},k=N=>{N.target===t&&g()};return x.addEventListener("click",g),t.addEventListener("click",k),p.addEventListener("click",()=>{const N=st(d),z=st(f);Co({reviewers:N,priorities:z}),g()}),h.addEventListener("click",()=>{const N=st(d),z=st(f);ko({reviewers:N,priorities:z}),g()}),a.exportModal={backdrop:t,reviewerList:d,prioList:f,onKey:b},a.exportModal}function fn(){const t=mn();hn(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function hn(){if(!a.exportModal)return;const{reviewerList:t,prioList:e}=a.exportModal;t.innerHTML="",gn().forEach(n=>{t.appendChild(de(n.value,n.label,!0))}),e.innerHTML="",wn().forEach(n=>{e.appendChild(de(n.value,n.label,!0))})}function gn(){return Array.from(new Set(a.annotations.map(e=>(e.author||"").trim()||"__unknown"))).filter(Boolean).sort((e,n)=>V(e).localeCompare(V(n))).map(e=>({value:e,label:V(e)}))}function wn(){return[{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}function de(t,e,n){const o=document.createElement("label");o.className="wn-annot-export-item wn-annotator";const r=document.createElement("input");r.type="checkbox",r.value=t,r.checked=n,r.className="wn-annotator";const i=document.createElement("span");return i.textContent=e,o.appendChild(r),o.appendChild(i),o}function st(t){return Array.from(t.querySelectorAll('input[type="checkbox"]')).filter(e=>e.checked).map(e=>e.value)}function xn(){if(a.importModal)return a.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const r=document.createElement("label");r.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),d=document.createElement("div");d.className="wn-annot-import-drop-title wn-annotator",d.textContent="Drop JSON files here";const l=document.createElement("div");l.className="wn-annot-import-drop-sub wn-annotator",l.textContent="or click to select files",s.appendChild(d),s.appendChild(l),r.appendChild(i),r.appendChild(s);const c=document.createElement("div");c.className="wn-annot-import-grid wn-annotator";const u=document.createElement("div");u.className="wn-annot-import-panel wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-title-row wn-annotator";const w=document.createElement("h5");w.textContent="Loaded files";const x=document.createElement("span");x.className="wn-annot-import-count wn-annotator",x.textContent="0";const h=document.createElement("p");h.textContent="Files are saved automatically.";const p=document.createElement("div");p.className="wn-annot-import-list wn-annotator",f.appendChild(w),f.appendChild(x),u.appendChild(f),u.appendChild(h),u.appendChild(p);const g=document.createElement("div");g.className="wn-annot-import-panel wn-annotator";const b=document.createElement("h5");b.textContent="Reviewer summary";const k=document.createElement("p");k.textContent="Counts based on imported files.";const N=document.createElement("div");N.className="wn-annot-import-stats wn-annotator";const z=document.createElement("div");z.className="wn-annot-import-stat wn-annotator";const D=document.createElement("span");D.textContent="Reviewers";const v=document.createElement("span");v.textContent="0",z.appendChild(D),z.appendChild(v);const M=document.createElement("div");M.className="wn-annot-import-stat wn-annotator";const S=document.createElement("span");S.textContent="Comments";const U=document.createElement("span");U.textContent="0",M.appendChild(S),M.appendChild(U),N.appendChild(z),N.appendChild(M);const A=document.createElement("div");A.className="wn-annot-import-list wn-annotator",g.appendChild(b),g.appendChild(k),g.appendChild(N),g.appendChild(A),c.appendChild(u),c.appendChild(g);const B=document.createElement("div");B.className="wn-annot-actions wn-annotator";const K=document.createElement("button");K.type="button",K.className="wn-annot-pill cancel wn-annotator",K.textContent="Close",B.appendChild(K),o.appendChild(r),o.appendChild(c),e.appendChild(n),e.appendChild(o),e.appendChild(B),t.appendChild(e),document.body.appendChild(t);const Et=()=>{t.classList.remove("show"),document.removeEventListener("keydown",Je)},Je=I=>{I.key==="Escape"&&Et()},qo=I=>{I.target===t&&Et()};return K.addEventListener("click",Et),t.addEventListener("click",qo),["dragenter","dragover"].forEach(I=>{r.addEventListener(I,T=>{T.preventDefault(),T.stopPropagation(),r.classList.add("dragover")})}),["dragleave","drop"].forEach(I=>{r.addEventListener(I,T=>{T.preventDefault(),T.stopPropagation(),r.classList.remove("dragover")})}),r.addEventListener("drop",I=>{var We;const T=(We=I.dataTransfer)==null?void 0:We.files;T&&T.length&&pe(Array.from(T))}),i.addEventListener("change",I=>{const T=I.target.files;T&&T.length&&pe(Array.from(T)),i.value=""}),p.addEventListener("click",I=>{const T=I.target.closest("[data-import-remove]");T&&En(T.dataset.importRemove)}),a.importModal={backdrop:t,modal:e,fileInput:i,fileList:p,reviewerList:A,filesCount:x,statReviewersValue:v,statCommentsValue:U,onKey:Je,close:Et},a.importModal}function bn(){const t=xn();lt(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function lt(){if(!a.importModal)return;const{fileList:t,reviewerList:e,filesCount:n,statReviewersValue:o,statCommentsValue:r}=a.importModal,{fileCounts:i,reviewerCounts:s,totalComments:d}=yn();if(t.innerHTML="",a.importFiles.length)a.importFiles.forEach(l=>{const c=document.createElement("div");c.className="wn-annot-import-card wn-annotator";const u=document.createElement("div");u.className="wn-annot-import-meta wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-name wn-annotator",f.textContent=l.name;const w=document.createElement("div");w.className="wn-annot-import-sub wn-annotator";const x=i.get(l.id)||0,h=l.pageUrl?` | ${An(l.pageUrl,36)}`:"";w.textContent=`${x} comments | ${Ln(l.size)}${h}`,u.appendChild(f),u.appendChild(w);const p=document.createElement("div");p.className="wn-annot-import-actions wn-annotator";const g=document.createElement("div");g.className="wn-annot-import-badge wn-annotator",g.textContent=String(x);const b=document.createElement("button");b.type="button",b.className="wn-annot-import-remove wn-annotator",b.dataset.importRemove=l.id,b.textContent="x",p.appendChild(g),p.appendChild(b),c.appendChild(u),c.appendChild(p),t.appendChild(c)});else{const l=document.createElement("div");l.className="wn-annot-import-empty wn-annotator",l.textContent="No imported files yet.",t.appendChild(l)}if(e.innerHTML="",s.size)Array.from(s.entries()).sort((l,c)=>c[1]-l[1]||l[0].localeCompare(c[0])).forEach(([l,c])=>{const u=document.createElement("div");u.className="wn-annot-import-card wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-meta wn-annotator";const w=document.createElement("div");w.className="wn-annot-import-name wn-annotator",w.textContent=l;const x=document.createElement("div");x.className="wn-annot-import-sub wn-annotator",x.textContent=`${c} comments`,f.appendChild(w),f.appendChild(x);const h=document.createElement("div");h.className="wn-annot-import-badge wn-annotator",h.textContent=String(c),u.appendChild(f),u.appendChild(h),e.appendChild(u)});else{const l=document.createElement("div");l.className="wn-annot-import-empty wn-annotator",l.textContent="No reviewers yet.",e.appendChild(l)}n.textContent=String(a.importFiles.length),o.textContent=String(s.size),r.textContent=String(d)}function yn(){const t=new Map,e=new Map,n=a.annotations.filter(o=>o.importFileId);return n.forEach(o=>{o.importFileId&&t.set(o.importFileId,(t.get(o.importFileId)||0)+1);const r=(o.author||"").trim()||"Unknown reviewer";e.set(r,(e.get(r)||0)+1)}),{fileCounts:t,reviewerCounts:e,totalComments:n.length}}async function pe(t){if(!t||!t.length)return;const e=new Set(a.annotations.map(o=>o.id));let n=0;for(const o of t){const r=await vn(o,e);if(!r)continue;const{fileMeta:i,annotations:s}=r;s.length&&(a.importFiles.push(i),a.annotations.push(...s),n+=s.length)}if(!n){lt();return}P(),xe(),pt(),wt(),vt(),et(),lt()}async function vn(t,e){let n;try{const c=await t.text();n=JSON.parse(c)}catch(c){return await Mt(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await Mt(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const r=Array.isArray(n)?"":n.exportedBy||n.annotator||n.author||"",i=Array.isArray(n)?t.lastModified:n.createdAt,s=Array.isArray(n)?"":n.pageUrl||"",d=Pe(),l=o.filter(Rt).map(c=>Cn(c,{fallbackAuthor:r,createdAt:i,pageUrl:s,fileId:d,existingIds:e}));return{fileMeta:{id:d,name:t.name,size:t.size,pageUrl:s,importedAt:Date.now()},annotations:l}}function Cn(t,e){const n=t&&typeof t=="object"?t:{},o=(n.author||e.fallbackAuthor||"").trim(),r=n.pageUrl||e.pageUrl||window.location.href,i=kn(n.id,e.existingIds),s=Qe(Xt({},n),{id:i,createdAt:n.createdAt||e.createdAt||Date.now(),priority:n.priority||"medium",author:o,pageUrl:r,importFileId:e.fileId});return s.pageKey||(s.pageKey=O(r)),s}function kn(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=Ct();while(e.has(n));return e.add(n),n}function En(t){const e=a.importFiles.filter(n=>n.id!==t);e.length!==a.importFiles.length&&(a.importFiles=e,a.annotations=a.annotations.filter(n=>n.importFileId!==t),P(),xe(),pt(),wt(),vt(),et(),lt())}function Ln(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function An(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function Nn(){if(a.dialogModal)return a.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const r=document.createElement("div");r.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",r.appendChild(i),r.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(r),t.appendChild(e),document.body.appendChild(t),a.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},a.dialogModal}function ue({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:r=!0}){return new Promise(i=>{const{backdrop:s,title:d,message:l,okBtn:c,cancelBtn:u}=Nn();d.textContent=t,l.textContent=e,c.textContent=n;const f=!!o;u.style.display=f?"inline-flex":"none",u.textContent=o||"";const w=b=>{s.classList.remove("show"),c.removeEventListener("click",x),u.removeEventListener("click",h),s.removeEventListener("click",p),document.removeEventListener("keydown",g),i(b)},x=()=>w(!0),h=()=>w(!1),p=b=>{b.target===s&&r&&w(!1)},g=b=>{b.key==="Escape"&&w(!1),(b.metaKey||b.ctrlKey)&&b.key==="Enter"&&x()};c.addEventListener("click",x),u.addEventListener("click",h),s.addEventListener("click",p),document.addEventListener("keydown",g),s.classList.add("show"),c.focus()})}async function Sn(t,e="Confirmation"){return ue({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function Mt(t,e="Information"){await ue({title:e,message:t,okLabel:"OK",cancelLabel:null})}function Tn(){document.addEventListener("mouseup",Pt),document.addEventListener("touchend",Pt),document.addEventListener("pointerup",Pt),document.addEventListener("mousemove",_n),document.addEventListener("click",Jn,!0),window.addEventListener("resize",F),window.addEventListener("resize",gt),window.addEventListener("resize",ht),window.addEventListener("resize",q),window.addEventListener("resize",mt),window.addEventListener("scroll",F,{passive:!0})}function V(t){return t==="__unknown"?"Unknown":t}function $t(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-priority"),e=a.panel.querySelector("#wn-filter-author"),n=a.panel.querySelector('[data-filter-clear="priority"]'),o=a.panel.querySelector('[data-filter-clear="author"]');n&&t&&(n.style.display=t.value==="all"?"none":"inline-flex"),o&&e&&(o.style.display=e.value==="all"?"none":"inline-flex")}function me(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-author");if(!t)return;const e=a.filters.author||"all",n=Array.from(new Set(a.annotations.map(i=>(i.author||"").trim()||"__unknown"))).filter(i=>i);t.innerHTML="";const o=document.createElement("option");o.value="all",o.textContent="All",t.appendChild(o),n.sort((i,s)=>V(i).localeCompare(V(s))).forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=V(i),t.appendChild(s)});const r=["all",...n];t.value=r.includes(e)?e:"all",a.filters.author=t.value,$t()}function Mn(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-priority"),e=a.panel.querySelector("#wn-filter-author"),n=a.panel.querySelector("#wn-filter-search"),o=a.panel.querySelector('[data-filter-clear="priority"]'),r=a.panel.querySelector('[data-filter-clear="author"]');if(!t||!e||!n)return;t.value=a.filters.priority,e.value=a.filters.author,n.value=a.filters.query;const i=()=>{a.filters.priority=t.value,a.filters.author=e.value,a.filters.query=n.value.trim().toLowerCase(),$(),$t()};t.addEventListener("change",i),e.addEventListener("change",i),n.addEventListener("input",i),o&&o.addEventListener("click",()=>{t.value="all",i()}),r&&r.addEventListener("click",()=>{e.value="all",i()}),me(),$t()}function X(t,e={}){const n=e.keepOutline;if(a.mode===t){a.mode=null,fe(),zt(),n||xt();return}a.mode=t,fe(),$n(t),t!=="element"&&xt()}function fe(){a.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===a.mode?e.classList.add("active"):e.classList.remove("active")})}function $n(t){let e="";if(t==="text"?e="Select text then release to add a note.":t==="element"&&(e="Hover an element, click to annotate."),!e)return zt();a.tip.textContent=e,a.tip.classList.add("show"),q(),requestAnimationFrame(q),requestAnimationFrame(q)}function zt(){a.tip.classList.remove("show")}function zn(){if(a.toast)return a.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),document.body.appendChild(t),a.toast=t,t}function Y(t){if(!t)return;const e=zn();e.textContent=t,e.classList.add("show"),a.toastTimer&&clearTimeout(a.toastTimer),a.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function In(){try{const t=localStorage.getItem(Wt);if(t==="top"||t==="bottom")return t}catch(t){}return null}function On(){try{const t=localStorage.getItem(ee);return t==null?null:t==="true"}catch(t){return null}}function Rn(t){try{localStorage.setItem(ee,t?"true":"false")}catch(e){}}function Pn(){if(!document||!document.documentElement)return;const t=document.documentElement,e=a.colors||Nt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,r=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",r.base),n("--wn-element-highlight-soft",r.soft),n("--wn-element-highlight-soft-end",r.softer),n("--wn-element-highlight-strong",r.strong),n("--wn-element-highlight-shadow",r.shadow),n("--wn-marker-text",r.text)}function It(t,e={}){var s,d,l;const n=ct(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,r=(d=e.softerAlpha)!=null?d:.04,i=(l=e.overlayAlpha)!=null?l:.7;return{base:n,overlay:R(n,i,R("#000000",i)),soft:R(n,o,R("#000000",o)),softer:R(n,r,R("#000000",r)),strong:R(n,.9,n),shadow:R(n,.24,"rgba(0,0,0,0.24)"),pill:R(n,.16,"rgba(0,0,0,0.16)"),pillBorder:R(n,.28,"rgba(0,0,0,0.28)"),text:Bn(n)}}function ct(t,e){const n=Ot(t);return n||Ot(e)||"#000000"}function Ot(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function he(t){const e=Ot(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function R(t,e=1,n=""){const o=he(t);if(!o)return n||"";const r=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${r})`}function Bn(t){const e=he(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function j(t){const e=a.colors||Nt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function ge(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function Fn(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder),t.style.setProperty("--wn-item-number-text","#000000"))}function dt(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function we(){try{return localStorage.getItem(Gt)||""}catch(t){return""}}function Hn(t){try{localStorage.setItem(Gt,t)}catch(e){}}function Un(){try{const t=localStorage.getItem(Qt),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>typeof n=="string"&&n.trim()).map(n=>n.trim()):[]}catch(t){return[]}}function Dn(t){try{localStorage.setItem(Qt,JSON.stringify(t||[]))}catch(e){}}function jn(){try{const t=localStorage.getItem(te),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||Pe(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function xe(){try{localStorage.setItem(te,JSON.stringify(a.importFiles||[]))}catch(t){}}function be(t){const e=(t||"").trim();if(!e)return;a.annotatorName=e;const n=[e,...a.annotatorNames.filter(o=>o!==e)];a.annotatorNames=n,Hn(e),Dn(n)}function pt(){const t=Array.from(new Set((a.annotations||[]).map(n=>(n.author||"").trim()).filter(Boolean))),e=Array.from(new Set([...a.annotatorNames||[],...t]));a.annotatorNames=e,a.annotatorName||(a.annotatorName=we()||e[0]||"")}function Zo(t,e={}){if(!t)return!1;const n=e.force||!1;let o=!1;return a.annotations.forEach(r=>{!n&&r.author||(r.author!==t&&(o=!0),r.author=t)}),o&&P(),o}function q(){if(!a.tip||!a.toolbar)return;const t=a.toolbar.getBoundingClientRect(),e=a.tip,n=10,o=t.left+t.width/2,r=E==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(r){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function Rt(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function qn(){try{const t=localStorage.getItem(Zt),e=t?JSON.parse(t):[];a.annotations=(e||[]).filter(Rt),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=O(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),a.annotations=[]}}function P(){if(L){Ye();return}try{localStorage.setItem(Zt,JSON.stringify(a.annotations))}catch(t){console.warn("Annotator storage save error",t)}}async function Kn(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(o==="screenshot"){await Ho();return}X(o);return}if(n==="export"){fn();return}if(n==="import"){bn();return}if(n==="toggle-panel"){Vn();return}if(n==="toggle-pos"){Yn(E==="bottom"?"top":"bottom"),ve();return}}}function Vn(){const t=a.panel.style.display==="none";a.panel.style.display=t?"":"none",ft()}function Xn(){ut(!a.hidden)}function ut(t){a.hidden=t,Rn(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(X(null),zt(),xt()),ye(),se(),mt(),gt(),t||(F(),ht(),q()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function ye(){if(!a.visibilityToggle)return;const t=a.hidden?"Show Uxnote":"Hide Uxnote";a.visibilityToggle.classList.toggle("is-muted",a.hidden),a.visibilityToggle.innerHTML=a.hidden?zo():De(),a.visibilityToggle.setAttribute("aria-label",t),a.visibilityToggle.setAttribute("aria-pressed",a.hidden?"true":"false"),a.visibilityToggle.setAttribute("data-tip",t)}function mt(){const t=a.visibilityToggle;if(!t)return;le();const e=18;if(Q()){a.hidden?(t.style.bottom=`${e}px`,t.style.left=`${e}px`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",E==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function ft(){if(!a.panel||!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=a.panel.style.display==="none";t.classList.toggle("active",!e)}function ht(){if(!a.panel||!a.toolbar)return;const t=a.panel,e=18,n=a.toolbar.getBoundingClientRect();if(Q()){t.style.width="100vw",t.style.maxHeight="100vh",t.style.height="100vh",t.style.left="0",t.style.right="0",t.style.top="0",t.style.bottom="0",t.style.borderRadius="0";return}t.style.width=`min(360px, calc(100vw - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",E==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):E==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function Yn(t){E=t==="top"?"top":"bottom";const e=a.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${E}`));try{localStorage.setItem(Wt,E)}catch(n){}ve(),mt(),q(),ht(),gt()}function ve(){if(!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=E==="top"?He():Ue())}function gt(){if(!a.toolbar||a.customPosition||!(it==="push"||it==="dock"||it==="pad"||it==="true"))return;const t=document.body;a.basePadding||ie();const e=a.basePadding;if(a.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=a.toolbar.getBoundingClientRect(),o=Xt({},e);E==="top"?o.top=e.top+n.height:E==="bottom"?o.bottom=e.bottom+n.height:E==="left"?o.left=e.left+n.width:E==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}async function Pt(){if(a.mode!=="text")return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!(_(e.commonAncestorContainer)&&_(e.startContainer)&&_(e.endContainer))){t.removeAllRanges(),Y("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}const o=t.toString().trim();if(!o)return;const r=await Tt("Comment for this highlight?");if(!r)return;const{comment:i,priority:s,author:d}=r,l=Ct(),c=Gn(e,o),u=bt(e,l);t.removeAllRanges();const f={id:l,type:"text",target:c,comment:i.trim(),author:d||a.annotatorName||"",priority:s||"medium",snippet:o.slice(0,180),pageUrl:window.location.href,pageKey:O(window.location.href),createdAt:Date.now(),status:"active"};a.annotations.push(f),P(),J(f,u),$(),X(null,{keepOutline:!0})}function _n(t){if(a.mode!=="element")return;const e=t.target;if(!e||!_(e)){xt();return}const n=e.getBoundingClientRect();Zn(n)}async function Jn(t){if(a.mode!=="element")return;const e=t.target;if(!e||!_(e)){Y("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}t.preventDefault(),t.stopPropagation();const n=await Tt("Comment for this element?");if(!n)return;const{comment:o,priority:r,author:i}=n,s=Ct(),d=Ft(e),l=ao(e),c=e.getBoundingClientRect(),u={id:s,type:"element",target:{xpath:d,css:l,tag:e.tagName.toLowerCase()},comment:o.trim(),author:i||a.annotatorName||"",priority:r||"medium",snippet:e.innerText?e.innerText.trim().slice(0,120):e.tagName,pageUrl:window.location.href,pageKey:O(window.location.href),rect:{x:c.x+window.scrollX,y:c.y+window.scrollY,w:c.width,h:c.height},createdAt:Date.now(),status:"active"};a.annotations.push(u),P(),J(u,e),Se(e,s),$(),X(null,{keepOutline:!0})}function Bt(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function tt(t){const e=a.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function wt(){Object.keys(a.highlightSpans||{}).forEach(t=>{tt(t).forEach(e=>{e&&e.parentNode&&Bt(e)})}),a.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&Bt(t)}),Object.values(a.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),a.markerLayer&&(a.markerLayer.innerHTML=""),a.markers={},Object.keys(a.elementTargets||{}).forEach(t=>{Te(t)}),a.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function Wn(t){const e=a.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete a.markers[t],Te(t);let n=tt(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&Bt(o)}),delete a.highlightSpans[t]}function et(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function Zn(t){const e=a.outlineBox;e.style.display="block",e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function xt(){a.outlineBox.style.display="none"}function Ce(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&Ce(t.parentElement):!1}function _(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||Ce(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function Gn(t,e){return{startXPath:Ft(t.startContainer),startOffset:t.startOffset,endXPath:Ft(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function bt(t,e){let n=[];const o=t.cloneRange();if(Qn(o).forEach(i=>{const s=to(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",d=>{d.stopPropagation(),at(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return a.highlightSpans[e]=n,n[0]}function Go(t,e){return bt(t,e)}function ke(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function Qn(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!ke(t,o))continue}catch(r){if(!ke(t,o))continue}e.push(o)}return e}function to(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:r}=e;let i=t,s=r;if(o>0&&(i=i.splitText(o),s=r-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const d=document.createElement("span");return d.className="uxnote-textmark",d.dataset.uxnoteId=n,d.addEventListener("click",l=>{l.stopPropagation(),at(n)}),i.parentNode.insertBefore(d,i),d.appendChild(i),d}function Ee(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function eo(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),r=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=r-n,d=i-o;return s<=0||d<=0?null:{x:n,y:o,width:s,height:d}}function Le(t){if(!t||!Ee(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const c=n.querySelector("summary");if(c&&!c.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const r=window.getComputedStyle(n);if(r.display==="none"||r.visibility==="hidden"||r.visibility==="collapse"||r.opacity==="0")return null;const i=r.overflowX||r.overflow,s=r.overflowY||r.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const c=n.getBoundingClientRect(),u=eo(e,c);if(!u)return null;e=u}n=n.parentElement}return e}function no(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function Ae(t){if(!t||t.nodeType!==1)return a.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:no(t)||a.markerLayer||document.body}function Ne(t){return t===document.body||t===a.markerLayer||t===document.documentElement}function oo(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(r){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(r){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const r=n.getAttribute("data-uxnote-open");if(r){const i=document.querySelector(r);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const r=n.id;if(r){const i=document.querySelector(`[aria-controls="${yt(r)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function Se(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),a.elementTargets[e]=t,!0}function Te(t){const e=a.elementTargets[t];if(!e||e.nodeType!==1){delete a.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const d=s.filter(l=>l!==t);d.length?i.dataset.uxnoteIds=d.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(r=>r!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete a.elementTargets[t]}function Ft(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const r=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${r}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function yt(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function ao(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${yt(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let r=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(r+=`.${i.slice(0,2).map(yt).join(".")}`),e.unshift(r),n.parentElement&&n.parentElement.id){e.unshift(`#${yt(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function nt(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function vt(){a.annotations.forEach(t=>{t.pageKey===O(window.location.href)&&ro(t)}),$()}function ro(t){const e=ot(t);if(!e){t.status="missing",Me();return}t.status="active",Ht(t,e)}function Ht(t,e){if(e){if(e.type==="screenshot"){J(t,null);return}if(e.type==="text"&&e.range){const n=bt(e.range,t.id);J(t,n);return}e.type==="element"&&e.el&&(Se(e.el,t.id),J(t,e.el))}}function io(t){if(!t)return null;const e=nt(t.startXPath),n=nt(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function ot(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?so(t):t.type==="element"?co(t):null:null:null}function so(t){const e=t.target||{},n=io(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const r=lo(o);return r?{type:"text",range:r}:null}function lo(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!_(o))continue;const r=o.nodeValue.indexOf(e);if(r===-1)continue;const i=document.createRange();return i.setStart(o,r),i.setEnd(o,r+e.length),i}return null}function co(t){const e=t.target||{};if(e.xpath){const r=nt(e.xpath);if(r&&r.nodeType===1)return{type:"element",el:r}}if(e.css)try{const r=document.querySelector(e.css);if(r&&r.nodeType===1)return{type:"element",el:r}}catch(r){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const r=document.querySelectorAll(n);for(const i of r)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function po(){a.missingRetryTimer&&clearTimeout(a.missingRetryTimer),a.missingRetryTimer=setTimeout(()=>{Ut()},300)}function Me(){a.missingObserver||!window.MutationObserver||(a.missingObserver=new MutationObserver(()=>{a.annotations.some(t=>t.status==="missing")&&po()}),a.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function uo(){a.missingObserver&&(a.missingObserver.disconnect(),a.missingObserver=null)}function Ut(){let t=!1;a.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==O(window.location.href))return;const n=ot(e);n&&(e.status="active",Ht(e,n),t=!0)}),t&&(P(),$(),F()),a.annotations.some(e=>e.status==="missing")||uo()}function mo(){let t=!1;a.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==O(window.location.href))return;const n=tt(e.id).filter(Ee);if(n.length){a.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=ot(e);if(o&&o.range){bt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(P(),$(),F())}function fo(){a.layoutTimer&&clearTimeout(a.layoutTimer),a.layoutTimer=setTimeout(()=>{F(),mo(),a.annotations.some(t=>t.status==="missing")&&Ut()},120)}function ho(){a.layoutObserver||!window.MutationObserver||(a.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&fo()}),a.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function J(t,e){if(t.pageKey!==O(window.location.href)||!a.markerLayer)return;const n=a.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=a.annotations.findIndex(l=>l.id===t.id)+1,o.dataset.wnAnnotId=t.id;const r=j(t);ge(o,r),o.addEventListener("click",()=>at(t.id));const i=ze(t,e),s=$e(t,i),d=Ae(i&&i.anchor?i.anchor:e);if(o.parentNode!==d&&d.appendChild(o),o.style.zIndex=Ne(d)?"":"9999",!i){o.style.display="none",a.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",Ie(o,i,t),a.markers[t.id]={el:o,rect:i,frame:s}}function $e(t,e){const n=a.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const r=a.markerLayer||document.body;return o.parentNode!==r&&r.appendChild(o),o.style.setProperty("--wn-shot-frame",j(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function ze(t,e){var n;if(t.type==="text"){const r=(e?[e]:tt(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!r)return null;const i=Le(r);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:r}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||a.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?nt(t.target.xpath):null);if(!o)return null;const r=Le(o);return r?{x:r.x,y:r.y,w:r.width,h:r.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function Ie(t,e,n){const o=go(n),i=(t.offsetParent||document.body).getBoundingClientRect(),s=i.x+window.scrollX,d=i.y+window.scrollY,l=e.x+window.scrollX,c=e.y+window.scrollY;t.style.left=`${l-s+e.w+o.x+4}px`,t.style.top=`${c-d+o.y-4}px`}function go(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=a.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function F(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:ze(n);if(e.frame=$e(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const r=Ae(o.anchor);e.el.parentNode!==r&&r.appendChild(e.el),e.el.style.zIndex=Ne(r)?"":"9999",Ie(e.el,o,n),ge(e.el,j(n))})}function wo(){if(!a.panel)return;a.panel.style.display==="none"&&(a.panel.style.display="",ft())}function xo(t){if(!a.panel)return;wo();const e=a.panel.querySelector(".wn-annot-list");if(!e)return;e.querySelectorAll(".wn-annot-item").forEach(r=>r.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function at(t,e=!1,n,o){var d;const r=a.annotations.find(l=>l.id===t);if(!r)return;if(xo(t),r.status==="missing"){const l=ot(r);if(l)r.status="active",Ht(r,l),$();else{Y("Annotation introuvable sur cette page.");return}}const i=ot(r);if(i){const l=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;l&&oo(l)&&setTimeout(()=>{F()},160)}if(!((o||r.pageKey)===O(window.location.href))&&e){try{localStorage.setItem(St,JSON.stringify({id:r.id,pageKey:r.pageKey,pageUrl:n||r.pageUrl}))}catch(l){}window.location.href=n||r.pageUrl||window.location.href;return}if(r.type==="text"){const c=(tt(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];c&&(c.scrollIntoView({behavior:"smooth",block:"center"}),Dt(c,j(r).base))}else if(r.type==="element"){const l=i&&i.el?i.el:(d=r.target)!=null&&d.xpath?nt(r.target.xpath):null;l&&l.scrollIntoView&&(l.scrollIntoView({behavior:"smooth",block:"center"}),Dt(l,j(r).base))}else if(r.type==="screenshot"&&r.rect){window.scrollTo({top:Math.max(0,r.rect.y+r.rect.h/2-window.innerHeight/2),behavior:"smooth"});const l=a.markers[r.id];l&&l.frame&&Dt(l.frame,j(r).base)}}function Dt(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=a.colors)==null?void 0:i.element)==null?void 0:s.base)||"#4e9cf6",r=R(o,.6,"rgba(78,156,246,0.6)");t.style.boxShadow=`0 0 0 3px ${r}`,setTimeout(()=>{t.style.boxShadow=n},800)}function Oe(){if(!a.panel)return null;let t=a.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://uxnote.ninefortyone.studio",e.target="_blank",e.rel="noreferrer noopener",e.textContent="\xA9 UxNote \u2013 by NineFortyOne.Studio",t.appendChild(e),a.panel.appendChild(t)}return t}function $(){const t=a.panel.querySelector(".wn-annot-list"),e=a.panel.querySelector("h3");if(t.innerHTML="",me(),!a.annotations.length){const o=document.createElement("div");o.className="wn-annot-empty",o.textContent="No annotations yet.",t.appendChild(o),e&&(e.textContent="Annotations (0)");const r=Oe();return}const n=a.annotations.slice().sort((o,r)=>o.createdAt-r.createdAt).filter(o=>{const r=a.filters.priority==="all"||(o.priority||"medium")===a.filters.priority,i=a.filters.query,s=`${o.comment||""} ${o.snippet||""} ${o.author||""}`.toLowerCase(),d=!i||s.includes(i),l=a.filters.author||"all",c=(o.author||"").trim()||"__unknown";return r&&d&&(l==="all"||c===l)});e&&(e.textContent=`Annotations (${n.length})`),n.forEach((o,r)=>{const i=document.createElement("div");i.className="wn-annot-item",i.dataset.id=o.id,Fn(i,j(o));const s=o.priority||"medium",d=s==="high"?"High":s==="low"?"Low":"Medium",l=document.createElement("div");l.className="wn-annot-card-top";const c=document.createElement("div");c.className="wn-annot-card-top-left";const u=document.createElement("div");u.className="wn-annot-number",u.textContent=`#${r+1}`;const f=document.createElement("div");if(f.className=`wn-annot-priority ${s}`,f.innerHTML=`<span class="dot"></span><span>${d}</span>`,c.appendChild(u),c.appendChild(f),o.status==="missing"){const A=document.createElement("div");A.className="wn-annot-missing",A.textContent="Missing",c.appendChild(A)}const w=document.createElement("div");w.className="wn-annot-meta-bottom";const x=document.createElement("div");x.className="wn-annot-card-top-right";const h=document.createElement("button");h.type="button",h.className="wn-annot-edit wn-annotator",h.setAttribute("aria-label","Edit this annotation"),h.innerHTML=To(),h.addEventListener("click",async A=>{A.stopPropagation(),await yo(o.id)}),x.appendChild(h);const p=document.createElement("button");p.type="button",p.className="wn-annot-delete wn-annotator",p.setAttribute("aria-label","Delete this annotation"),p.innerHTML=Fe(),p.addEventListener("click",A=>{A.stopPropagation(),bo(o.id)}),x.appendChild(p),l.appendChild(c),l.appendChild(x);const g=document.createElement("div");g.className="wn-annot-comment";const b=o.comment||"\u2014";g.textContent=b;const k=document.createElement("div");k.className="wn-annot-meta";const z=((o.author||"").trim()||"Unknown reviewer").toUpperCase(),D=new Date(o.createdAt),v=D.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),M=D.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});k.textContent=`${z} \u2022 ${v} \u2022 ${M}`,w.appendChild(k);const S=document.createElement("button");S.type="button",S.className="wn-annot-showmore wn-annotator",S.textContent="See more",S.addEventListener("click",A=>{A.stopPropagation();const B=g.classList.toggle("expanded");S.textContent=B?"See less":"See more"}),b.length<160&&(S.style.display="none"),i.appendChild(l),i.appendChild(g);const U=Do(o);if(U){const A=document.createElement("div");A.className="wn-annot-shot";const B=document.createElement("img");B.src=U,B.alt="The screenshot of this annotation",B.addEventListener("click",K=>{K.stopPropagation(),jo(U)}),A.appendChild(B),i.appendChild(A)}i.appendChild(S),i.appendChild(w),i.addEventListener("click",()=>{at(o.id,!0,o.pageUrl,o.pageKey),Q()&&a.panel&&(a.panel.style.display="none",ft())}),t.appendChild(i)}),Oe()}function bo(t){const e=a.annotations.findIndex(n=>n.id===t);e!==-1&&(a.annotations.splice(e,1),P(),Wn(t),$(),et(),F())}async function yo(t){const e=a.annotations.find(s=>s.id===t);if(!e)return;const n=await ce("Edit this annotation",e.comment||"",e.priority||"medium",e.author||a.annotatorName||"");if(!n)return;const{comment:o,priority:r,author:i}=n;e.comment=o.trim(),e.priority=r||"medium",e.author=i||e.author||a.annotatorName||"",be(e.author),P(),$()}async function vo(){!a.annotations.length||!await Sn("Delete all annotations?","Delete")||(a.annotations=[],L?Po():P(),wt(),$(),et())}function Qo(){const t=jt(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=qt(),o.click(),URL.revokeObjectURL(n)}function Co(t){const e=new Set(t&&t.reviewers||[]),n=new Set(t&&t.priorities||[]),o=a.annotations.filter(l=>{const c=(l.author||"").trim()||"__unknown",u=l.priority||"medium",f=!e.size||e.has(c),w=!n.size||n.has(u);return f&&w}),r=jt(o),i=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),d=document.createElement("a");d.href=s,d.download=qt(),d.click(),URL.revokeObjectURL(s)}function jt(t=a.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}function ko(t){const e=new Set(t&&t.reviewers||[]),n=new Set(t&&t.priorities||[]),o=a.annotations.filter(r=>{const i=(r.author||"").trim()||"__unknown",s=r.priority||"medium",d=!e.size||e.has(i),l=!n.size||n.has(s);return d&&l});Re(o)}async function ta(){Re(a.annotations)}function Re(t){const e=jt(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(qt()),r=encodeURIComponent(n),i=(tn||"").trim(),s=i?encodeURIComponent(i):"",d="?";window.location.href=`mailto:${s}${d}subject=${o}&body=${r}`}function Ct(){return"wn-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Pe(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function qt(){const t=new Date,e=d=>String(d).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,r=(document.title||"").trim(),i=d=>d.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return r?s=`${i(r)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const H=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function Eo(){return`
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
    `}function Be(){return H(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function Lo(){return H(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function Ao(){return H(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function No(){return H(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function ea(){return H(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function So(){return H(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function To(){return Be()}function Fe(){return`
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
    `}function Mo(){return H(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function He(){return H(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function Ue(){return H(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function $o(){return E==="top"?He():Ue()}function De(){return`
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
    `}function zo(){return`
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
    `}function O(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function je(){try{const t=localStorage.getItem(St);if(!t)return;const e=JSON.parse(t);e.pageKey===O(window.location.href)&&at(e.id,!1),localStorage.removeItem(St)}catch(t){}}let W=new Map,Kt=Promise.resolve(),Z=!1;function qe(){return`${L.url}/annotations?site=${encodeURIComponent(C)}`}function Ke(t){return`${L.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function Io(t){return`${L.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function rt(t){const e=Object.assign({},t);return L.apiKey&&(e["X-Uxnote-Key"]=L.apiKey),e}function Ve(t){return new Map(t.map(e=>[e.id,JSON.stringify(e)]))}function kt(t,e){console.warn("Uxnote sync:",t,e),!Z&&(Z=!0,Y(t))}function Vt(t){return Kt=Kt.then(t,t),Kt}async function Xe(){if(L)try{const t=await fetch(qe(),{headers:rt({Accept:"application/json"})});if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json();a.annotations=(e&&e.annotations||[]).filter(Rt),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=O(n.pageUrl||window.location.href))}),W=Ve(a.annotations),Z=!1,pt(),wt(),vt(),et(),$(),je()}catch(t){kt("Uxnote: could not read the annotations from the server",t)}}function Ye(){if(!L)return;const t=Ve(a.annotations);t.forEach((e,n)=>{W.get(n)!==e&&Vt(()=>Oo(n,e))}),W.forEach((e,n)=>{t.has(n)||Vt(()=>Ro(n))})}async function Oo(t,e){try{const n=await fetch(Ke(t),{method:"PUT",headers:rt({"Content-Type":"application/json"}),body:e});if(!n.ok)throw new Error(`HTTP ${n.status}`);W.set(t,e),Z=!1}catch(n){kt("Uxnote: could not save this annotation on the server",n)}}async function Ro(t){try{const e=await fetch(Ke(t),{method:"DELETE",headers:rt()});if(!e.ok)throw new Error(`HTTP ${e.status}`);W.delete(t),Z=!1}catch(e){kt("Uxnote: could not delete this annotation on the server",e)}}function Po(){L&&Vt(async()=>{try{const t=await fetch(qe(),{method:"DELETE",headers:rt()});if(!t.ok)throw new Error(`HTTP ${t.status}`);W=new Map,Z=!1}catch(t){kt("Uxnote: could not delete the annotations on the server",t)}})}function _e(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Bo(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const r=document.createElement("span");r.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(r),o.appendChild(i);const s=p=>{const g=!!p&&p.w>=4&&p.h>=4;n.style.display=g?"block":"none",g&&(n.style.left=`${p.x}px`,n.style.top=`${p.y}px`,n.style.width=`${p.w}px`,n.style.height=`${p.h}px`)};s(null);const d=p=>({x:Math.min(Math.max(p.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(p.clientY,0),document.documentElement.clientHeight)}),l=(p,g)=>({x:Math.min(p.x,g.x),y:Math.min(p.y,g.y),w:Math.abs(g.x-p.x),h:Math.abs(g.y-p.y)});let c=null;const u=p=>{p.preventDefault(),c=d(p),s(null)},f=p=>{c&&(p.preventDefault(),s(l(c,d(p))))},w=p=>{if(!c)return;const g=l(c,d(p));if(c=null,g.w<4||g.h<4){s(null);return}x({x:g.x+window.scrollX,y:g.y+window.scrollY,w:g.w,h:g.h})},x=p=>{document.removeEventListener("keydown",h,!0),document.removeEventListener("mousemove",f,!0),document.removeEventListener("mouseup",w,!0),e.remove(),o.remove(),t(p)},h=p=>{p.key==="Escape"&&(p.preventDefault(),x(null))};e.addEventListener("mousedown",u),i.addEventListener("click",()=>x(null)),document.addEventListener("mousemove",f,!0),document.addEventListener("mouseup",w,!0),document.addEventListener("keydown",h,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function Fo(t){const e=document.createElement("style");e.textContent=".wn-annotator, .wn-annot-dimmer { display: none !important; }",document.head.appendChild(e);try{await new Promise(w=>requestAnimationFrame(()=>requestAnimationFrame(w)));const n=await window.snapdom.toCanvas(document.body,{scale:1}),o=document.body.getBoundingClientRect(),r=o.width?n.width/o.width:1,i=o.left+window.scrollX,s=o.top+window.scrollY,d=Math.max(0,Math.round((t.x-i)*r)),l=Math.max(0,Math.round((t.y-s)*r)),c=Math.min(n.width-d,Math.max(1,Math.round(t.w*r))),u=Math.min(n.height-l,Math.max(1,Math.round(t.h*r)));if(c<1||u<1)return null;const f=document.createElement("canvas");return f.width=c,f.height=u,f.getContext("2d").drawImage(n,d,l,c,u,0,0,c,u),{canvas:f,w:c,h:u}}finally{e.remove()}}async function Ho(){if(!_e()||a.mode==="screenshot")return;X("screenshot");let t=null;try{t=await Bo()}finally{X(null)}if(!t)return;let e=null;try{e=await Fo(t)}catch(c){console.warn("Uxnote screenshot:",c)}if(!e){Y("Uxnote: could not capture that region");return}const n=await Tt("Comment for this region?");if(!n)return;const{comment:o,priority:r,author:i}=n,s=Ct();let d=null;if(L){const c=await new Promise(f=>e.canvas.toBlob(f,"image/png")),u=c?await Uo(c,s):null;if(!u){Y("Uxnote: could not send the screenshot to the server");return}d={url:u.url,w:e.w,h:e.h,capturedAt:Date.now()}}else d={dataUrl:e.canvas.toDataURL("image/png"),w:e.w,h:e.h,capturedAt:Date.now()};const l={id:s,type:"screenshot",comment:o.trim(),author:i||a.annotatorName||"",priority:r||"medium",snippet:"",pageUrl:window.location.href,pageKey:O(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:d,createdAt:Date.now(),status:"active"};a.annotations.push(l),P(),J(l,null),$()}async function Uo(t,e){try{const n=await fetch(Io(e),{method:"PUT",headers:rt({"Content-Type":"image/png"}),body:t});if(!n.ok)throw new Error(`HTTP ${n.status}`);const o=await n.json();return o&&o.url?o:null}catch(n){return console.warn("Uxnote screenshot:",n),null}}function Do(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=L?new URL(`${L.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function jo(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=()=>{document.removeEventListener("keydown",r,!0),e.remove()},r=i=>{i.key==="Escape"&&(i.preventDefault(),o())};e.addEventListener("click",o),document.addEventListener("keydown",r,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",re):re(),window.Uxnote={refresh:F,setHidden:t=>ut(!!t),toggleVisibility:()=>ut(!a.hidden),isHidden:()=>!!a.hidden,sync:{pull:Xe,push:Ye,url:()=>L?L.url:null}}})();})();
