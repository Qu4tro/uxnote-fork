(()=>{var Go=Object.defineProperty,Qo=Object.defineProperties;var ta=Object.getOwnPropertyDescriptors;var on=Object.getOwnPropertySymbols;var ea=Object.prototype.hasOwnProperty,na=Object.prototype.propertyIsEnumerable;var an=(u,y,C)=>y in u?Go(u,y,{enumerable:!0,configurable:!0,writable:!0,value:C}):u[y]=C,Wt=(u,y)=>{for(var C in y||(y={}))ea.call(y,C)&&an(u,C,y[C]);if(on)for(var C of on(y))na.call(y,C)&&an(u,C,y[C]);return u},rn=(u,y)=>Qo(u,ta(y));(()=>{if(window.Uxnote)return;const u=document.currentScript||Array.from(document.querySelectorAll("script")).find(t=>(t.getAttribute("src")||"").includes("annotator.js")),y=t=>u?u.getAttribute(t):null,C=`${location.protocol}//${location.host}`,sn=u&&(u.dataset.mailto||u.dataset.email||u.dataset.to)||"",St=y("isToolVisibleAtFirstLaunch")||y("istoolvisibleatfirstlaunch")||u&&(u.dataset.isToolVisibleAtFirstLaunch||u.dataset.istoolvisibleatfirstlaunch),Tt=y("isToolOnTopAtLaunch")||y("istoolontopatlaunch")||u&&(u.dataset.isToolOnTopAtLaunch||u.dataset.istoolontopatlaunch),ln=u&&(u.dataset.hiddentoolbydefault||u.dataset.hidden||u.dataset.collapsed||u.dataset.startHidden||""),cn=y("colorForHighlight")||y("colorForHighligh")||u&&(u.dataset.colorForHighlight||u.dataset.colorForHighligh),Zt=y("colorForTextHighligh")||y("colorForTextHighlight")||u&&(u.dataset.colorForTextHighligh||u.dataset.colorForTextHighlight),Gt=y("colorForElementHighlight")||y("colorForElementHighligh")||u&&(u.dataset.colorForElementHighlight||u.dataset.colorForElementHighligh),Qt="#4e9cf6",tt=mt(cn||Gt||Zt||Qt,Qt),dn=mt(Zt||tt,tt),pn=mt(Gt||tt,tt),Mt={text:Bt(dn,{overlayAlpha:.7,softAlpha:.18,softerAlpha:.08}),element:Bt(pn,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04}),screenshot:Bt(tt,{overlayAlpha:.35,softAlpha:.12,softerAlpha:.04})};let k=Tt!=null?_(Tt,!1)?"top":"bottom":u&&u.dataset.position||"bottom";const te="wn-toolbar-pos",lt=u&&(u.dataset.dock||u.dataset.layout)||"",ee=`uxnote:site:${C}`,ne=`uxnote:annotator:${C}`,oe=`uxnote:annotators:${C}`,ae=`uxnote:import-files:${C}`,re=`uxnote:hidden:${C}`,$t=`uxnote:pending:${C}`,ie=(u&&u.dataset.serverUrl||"").trim().replace(/\/+$/,""),L=ie?{url:ie,apiKey:u&&u.dataset.serverApiKey||""}:null,se=_(u&&u.dataset.jsonExport,!0),zt=_(u&&u.dataset.jsonImport,!0),un=y("isBackdropVisible")||y("isbackdropvisible")||y("backdropVisible")||y("backdropvisible")||u&&(u.dataset.isBackdropVisible||u.dataset.isbackdropvisible||u.dataset.backdropVisible||u.dataset.backdropvisible||u.dataset.dim||u.dataset.dimpage||u.dataset.dimmer||u.dataset.overlay||u.dataset.dimLevel||u.dataset.dimlevel||u.dataset.dimstrength),mn=.2,le=_(un,!0),a={mode:null,annotations:[],annotatorName:"",annotatorNames:[],importFiles:[],markers:{},highlightSpans:{},elementTargets:{},outlineBox:null,toolbar:null,panel:null,visibilityToggle:null,commentModal:null,dialogModal:null,importModal:null,exportModal:null,markerLayer:null,colors:Mt,customPosition:!1,dimEnabled:le,dimOpacity:le?mn:0,dimOverlay:null,filters:{priority:"all",author:"all",query:""},hidden:!1,missingObserver:null,missingRetryTimer:null,layoutObserver:null,layoutTimer:null,toast:null,toastTimer:null},ce=window.matchMedia?window.matchMedia("(max-width: 640px)"):null;function ct(){return ce?ce.matches:window.innerWidth<=640}function de(){const t=Fn();t&&(k=t);const e=Un(),n=St!=null?!_(St,!0):null;a.hidden=e!==null?e:n!==null?n:_(ln,!1),a.annotatorName=Ce(),a.annotatorNames=Xn(),zt&&(a.importFiles=_n()),pe(),jn(),fn(),hn(),wn(),ht(a.hidden),L?Jt():Jn(),ft(),at(),Kt(),Oe(),vo(),L||Ye(),On()}function pe(){const t=getComputedStyle(document.body);a.basePadding={top:parseFloat(t.paddingTop)||0,right:parseFloat(t.paddingRight)||0,bottom:parseFloat(t.paddingBottom)||0,left:parseFloat(t.paddingLeft)||0}}function fn(){const t=document.createElement("style");t.setAttribute("data-wn-style","annotator"),t.textContent=`
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
        background: rgba(28, 22, 48, 0.45);
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
    `,document.head.appendChild(t)}function hn(){const t=document.createElement("div");t.className=`wn-annot-toolbar wn-annotator wn-pos-${k}`;const e=h=>{const p=document.createElement("button");return p.className="wn-annot-btn wn-annotator",p.setAttribute("data-action",h.action),h.mode&&p.setAttribute("data-mode",h.mode),p.setAttribute("data-tip",h.tip),p.innerHTML=h.icon,p},n=h=>{const p=document.createElement("div");return p.className="wn-annot-group wn-annotator",h.forEach(w=>p.appendChild(e(w))),p},o=()=>{const h=document.createElement("div");return h.className="wn-annot-spacer wn-annotator",h},r=document.createDocumentFragment(),i=document.createElement("div");i.className="wn-annot-logo wn-annotator",i.innerHTML=Mo(),r.appendChild(i);const s=[{action:"mode",mode:"text",tip:"Highlight text",icon:je()},{action:"mode",mode:"element",tip:"Annotate an element",icon:$o()}];tn()&&s.push({action:"mode",mode:"screenshot",tip:"Capture a region",icon:Io()});const c=[];zt&&c.push({action:"import",tip:"Import JSON",icon:Ro()}),se&&c.push({action:"export",tip:"Export JSON",icon:zo()});const l=[{action:"toggle-pos",tip:"Toolbar top / bottom",icon:Bo()},{action:"toggle-panel",tip:"Show / hide annotations",icon:Po()}];r.appendChild(o()),r.appendChild(n(s)),c.length&&(r.appendChild(o()),r.appendChild(n(c))),r.appendChild(o()),r.appendChild(n(l)),t.appendChild(r),document.body.appendChild(t),a.toolbar=t;const d=document.createElement("div");d.className="wn-annot-panel wn-annotator",d.innerHTML=`
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <button class="wn-annot-delete-all wn-annotator" type="button">
            ${qe()}<span>All</span>
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
    `,k==="left"&&(d.style.left="18px",d.style.right="auto"),document.body.appendChild(d),a.panel=d,d.style.display="none";const m=d.querySelector(".wn-annot-delete-all");m&&m.addEventListener("click",async h=>{h.stopPropagation(),await No()});const f=document.createElement("div");f.className="wn-annot-marker-layer wn-annotator",document.body.appendChild(f),a.markerLayer=f;const g=document.createElement("div");g.className="wn-annot-outline wn-annotator",g.style.display="none",document.body.appendChild(g),a.outlineBox=g;const x=document.createElement("div");x.className="wn-annot-tip wn-annotator",x.textContent="Active mode",document.body.appendChild(x),a.tip=x,t.addEventListener("click",Wn),T(),bt(),xt(),j(),gt(),Pn(),gn()}function ue(){a.dimOverlay&&a.dimOverlay.classList.toggle("is-visible",!a.hidden)}function wn(){if(!a.dimEnabled||a.dimOverlay)return;const t=document.createElement("div");t.className="wn-annot-dimmer",t.setAttribute("aria-hidden","true"),t.style.setProperty("--wn-dim-opacity",String(a.dimOpacity));const e=document.body.firstChild;e?document.body.insertBefore(t,e):document.body.appendChild(t),a.dimOverlay=t,ue()}function me(){if(!a.visibilityToggle)return;const t=a.visibilityToggle,n=ct()&&a.toolbar&&!a.hidden?a.toolbar:document.body;t.parentNode!==n&&(t.parentNode&&t.parentNode.removeChild(t),n===a.toolbar?a.toolbar.insertBefore(t,a.toolbar.firstChild):document.body.appendChild(t))}function gn(){if(a.visibilityToggle)return;const t=document.createElement("button");t.type="button",t.className="wn-annot-visibility-btn wn-annotator",t.setAttribute("aria-label","Masquer Uxnote"),t.setAttribute("data-tip","Masquer Uxnote"),t.innerHTML=Xe(),t.addEventListener("click",Gn),a.visibilityToggle=t,me(),wt(),Le()}function xn(){if(a.commentModal)return a.commentModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annot-comment-card wn-annotator";const n=document.createElement("h4");n.textContent="Add a comment";const o=document.createElement("div");o.className="wn-annot-name-row wn-annotator";const r=document.createElement("label");r.textContent="Reviewer name";const i=document.createElement("div");i.className="wn-annot-name-inputs wn-annotator";const s=document.createElement("input");s.type="text",s.className="wn-annotator",s.placeholder="Reviewer name",i.appendChild(s),o.appendChild(r),o.appendChild(i);const c=document.createElement("textarea");c.className="wn-annotator",c.placeholder="Your comment...";const l=document.createElement("div");l.className="wn-annot-prio wn-annotator";const d=document.createElement("label");d.textContent="Priority";const m=document.createElement("div");m.className="wn-annot-prio-options wn-annotator";const f=(w,b)=>{const E=document.createElement("button");return E.type="button",E.className="wn-annot-prio-btn wn-annotator",E.setAttribute("data-priority",w),E.innerHTML=`<span class="dot wn-annotator"></span><span class="wn-annotator">${b}</span>`,E},g=[f("low","Low"),f("medium","Medium"),f("high","High")];g.forEach(w=>m.appendChild(w)),l.appendChild(d),l.appendChild(m);const x=document.createElement("div");x.className="wn-annot-actions wn-annotator";const h=document.createElement("button");h.type="button",h.className="wn-annot-pill cancel wn-annotator",h.textContent="Cancel";const p=document.createElement("button");return p.type="button",p.className="wn-annot-pill primary wn-annotator",p.textContent="Save",x.appendChild(h),x.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(c),e.appendChild(l),e.appendChild(x),t.appendChild(e),document.body.appendChild(t),a.commentModal={backdrop:t,modal:e,textarea:c,title:n,okBtn:p,cancelBtn:h,prioButtons:g,nameInput:s},a.commentModal}function dt(){const t=a.commentModal;if(!t||!a.toolbar||!t.backdrop.classList.contains("show"))return;const e=t.modal,n=a.toolbar.getBoundingClientRect(),o=.75*(parseFloat(getComputedStyle(e).fontSize)||16);e.style.left=`${n.left+n.width/2}px`,k==="top"?(e.style.top=`${n.bottom+o}px`,e.style.bottom=""):(e.style.top="",e.style.bottom=`${window.innerHeight-n.top+o}px`)}function fe(t,e="",n="medium",o=""){return new Promise(r=>{const i=xn(),{backdrop:s,textarea:c,title:l,okBtn:d,cancelBtn:m,prioButtons:f,nameInput:g}=i;l.textContent=t||"Add a comment",c.value=e||"",c.placeholder="Your comment...",f.forEach(v=>v.classList.toggle("active",v.getAttribute("data-priority")===n));const x=v=>{f.forEach($=>$.classList.remove("active")),v.classList.add("active")},h=f.map(v=>$=>x(v));f.forEach((v,$)=>v.addEventListener("click",h[$]));const p=a.annotatorNames||[],w=o||a.annotatorName||p[0]||"";g.value=w||"",g.disabled=!1,g.placeholder="Reviewer name",s.classList.add("show"),dt(),w?(c.focus(),c.select()):(g.focus(),g.select());const b=v=>{s.classList.remove("show"),d.removeEventListener("click",E),m.removeEventListener("click",N),document.removeEventListener("keydown",z),window.removeEventListener("resize",dt),f.forEach(($,I)=>$.removeEventListener("click",h[I])),r(v)},E=async()=>{const v=f.find(O=>O.classList.contains("active")),$=v?v.getAttribute("data-priority"):n,I=g.value.trim();if(!I){await It("Please enter a reviewer name.","Reviewer name required");return}Ee(I),b({comment:c.value.trim(),priority:$,author:I})},N=()=>b(null),z=v=>{v.key==="Escape"&&b(null),v.key==="Enter"&&!(v.shiftKey||v.altKey)&&(v.preventDefault(),E())};d.textContent="Save",m.textContent="Cancel",d.addEventListener("click",E),m.addEventListener("click",N),document.addEventListener("keydown",z),window.addEventListener("resize",dt)})}async function Rt(t){const e=await fe(t);return e||null}function bn(){if(a.exportModal)return a.exportModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-export-modal";const n=document.createElement("h4");n.textContent="Export annotations";const o=document.createElement("div");o.className="wn-annot-export-grid wn-annotator";const r=document.createElement("div");r.className="wn-annot-export-panel wn-annotator";const i=document.createElement("h5");i.textContent="Reviewers";const s=document.createElement("p");s.textContent="Choose reviewers to include.";const c=document.createElement("div");c.className="wn-annot-export-list wn-annotator",r.appendChild(i),r.appendChild(s),r.appendChild(c);const l=document.createElement("div");l.className="wn-annot-export-panel wn-annotator";const d=document.createElement("h5");d.textContent="Criticality";const m=document.createElement("p");m.textContent="Select priority levels.";const f=document.createElement("div");f.className="wn-annot-export-list wn-annotator",l.appendChild(d),l.appendChild(m),l.appendChild(f),o.appendChild(r),o.appendChild(l);const g=document.createElement("div");g.className="wn-annot-actions wn-annotator";const x=document.createElement("button");x.type="button",x.className="wn-annot-pill cancel wn-annotator",x.textContent="Cancel";const h=document.createElement("button");h.type="button",h.className="wn-annot-pill secondary wn-annotator",h.textContent="Send by mail";const p=document.createElement("button");p.type="button",p.className="wn-annot-pill primary wn-annotator",p.textContent="Export file",g.appendChild(x),g.appendChild(h),g.appendChild(p),e.appendChild(n),e.appendChild(o),e.appendChild(g),t.appendChild(e),document.body.appendChild(t);const w=()=>{t.classList.remove("show"),document.removeEventListener("keydown",b)},b=N=>{N.key==="Escape"&&w()},E=N=>{N.target===t&&w()};return x.addEventListener("click",w),t.addEventListener("click",E),p.addEventListener("click",()=>{const N=pt(c),z=pt(f);So({reviewers:N,priorities:z}),w()}),h.addEventListener("click",()=>{const N=pt(c),z=pt(f);To({reviewers:N,priorities:z}),w()}),a.exportModal={backdrop:t,reviewerList:c,prioList:f,onKey:b},a.exportModal}function yn(){if(!se)return;const t=bn();vn(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function vn(){if(!a.exportModal)return;const{reviewerList:t,prioList:e}=a.exportModal;t.innerHTML="",Cn().forEach(n=>{t.appendChild(he(n.value,n.label,!0))}),e.innerHTML="",kn().forEach(n=>{e.appendChild(he(n.value,n.label,!0))})}function Cn(){return Array.from(new Set(a.annotations.map(e=>(e.author||"").trim()||"__unknown"))).filter(Boolean).sort((e,n)=>V(e).localeCompare(V(n))).map(e=>({value:e,label:V(e)}))}function kn(){return[{value:"high",label:"High"},{value:"medium",label:"Medium"},{value:"low",label:"Low"}]}function he(t,e,n){const o=document.createElement("label");o.className="wn-annot-export-item wn-annotator";const r=document.createElement("input");r.type="checkbox",r.value=t,r.checked=n,r.className="wn-annotator";const i=document.createElement("span");return i.textContent=e,o.appendChild(r),o.appendChild(i),o}function pt(t){return Array.from(t.querySelectorAll('input[type="checkbox"]')).filter(e=>e.checked).map(e=>e.value)}function En(){if(a.importModal)return a.importModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator wn-annot-import-modal";const n=document.createElement("h4");n.textContent="Import JSON files";const o=document.createElement("div");o.className="wn-annot-import-body wn-annotator";const r=document.createElement("label");r.className="wn-annot-import-drop wn-annotator";const i=document.createElement("input");i.type="file",i.accept="application/json",i.multiple=!0,i.className="wn-annotator";const s=document.createElement("div"),c=document.createElement("div");c.className="wn-annot-import-drop-title wn-annotator",c.textContent="Drop JSON files here";const l=document.createElement("div");l.className="wn-annot-import-drop-sub wn-annotator",l.textContent="or click to select files",s.appendChild(c),s.appendChild(l),r.appendChild(i),r.appendChild(s);const d=document.createElement("div");d.className="wn-annot-import-grid wn-annotator";const m=document.createElement("div");m.className="wn-annot-import-panel wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-title-row wn-annotator";const g=document.createElement("h5");g.textContent="Loaded files";const x=document.createElement("span");x.className="wn-annot-import-count wn-annotator",x.textContent="0";const h=document.createElement("p");h.textContent="Files are saved automatically.";const p=document.createElement("div");p.className="wn-annot-import-list wn-annotator",f.appendChild(g),f.appendChild(x),m.appendChild(f),m.appendChild(h),m.appendChild(p);const w=document.createElement("div");w.className="wn-annot-import-panel wn-annotator";const b=document.createElement("h5");b.textContent="Reviewer summary";const E=document.createElement("p");E.textContent="Counts based on imported files.";const N=document.createElement("div");N.className="wn-annot-import-stats wn-annotator";const z=document.createElement("div");z.className="wn-annot-import-stat wn-annotator";const v=document.createElement("span");v.textContent="Reviewers";const $=document.createElement("span");$.textContent="0",z.appendChild(v),z.appendChild($);const I=document.createElement("div");I.className="wn-annot-import-stat wn-annotator";const O=document.createElement("span");O.textContent="Comments";const q=document.createElement("span");q.textContent="0",I.appendChild(O),I.appendChild(q),N.appendChild(z),N.appendChild(I);const A=document.createElement("div");A.className="wn-annot-import-list wn-annotator",w.appendChild(b),w.appendChild(E),w.appendChild(N),w.appendChild(A),d.appendChild(m),d.appendChild(w);const H=document.createElement("div");H.className="wn-annot-actions wn-annotator";const K=document.createElement("button");K.type="button",K.className="wn-annot-pill cancel wn-annotator",K.textContent="Close",H.appendChild(K),o.appendChild(r),o.appendChild(d),e.appendChild(n),e.appendChild(o),e.appendChild(H),t.appendChild(e),document.body.appendChild(t);const Nt=()=>{t.classList.remove("show"),document.removeEventListener("keydown",en)},en=R=>{R.key==="Escape"&&Nt()},Zo=R=>{R.target===t&&Nt()};return K.addEventListener("click",Nt),t.addEventListener("click",Zo),["dragenter","dragover"].forEach(R=>{r.addEventListener(R,S=>{S.preventDefault(),S.stopPropagation(),r.classList.add("dragover")})}),["dragleave","drop"].forEach(R=>{r.addEventListener(R,S=>{S.preventDefault(),S.stopPropagation(),r.classList.remove("dragover")})}),r.addEventListener("drop",R=>{var nn;const S=(nn=R.dataTransfer)==null?void 0:nn.files;S&&S.length&&we(Array.from(S))}),i.addEventListener("change",R=>{const S=R.target.files;S&&S.length&&we(Array.from(S)),i.value=""}),p.addEventListener("click",R=>{const S=R.target.closest("[data-import-remove]");S&&Mn(S.dataset.importRemove)}),a.importModal={backdrop:t,modal:e,fileInput:i,fileList:p,reviewerList:A,filesCount:x,statReviewersValue:$,statCommentsValue:q,onKey:en,close:Nt},a.importModal}function Ln(){if(!zt)return;const t=En();ut(),t.backdrop.classList.add("show"),document.addEventListener("keydown",t.onKey)}function ut(){if(!a.importModal)return;const{fileList:t,reviewerList:e,filesCount:n,statReviewersValue:o,statCommentsValue:r}=a.importModal,{fileCounts:i,reviewerCounts:s,totalComments:c}=An();if(t.innerHTML="",a.importFiles.length)a.importFiles.forEach(l=>{const d=document.createElement("div");d.className="wn-annot-import-card wn-annotator";const m=document.createElement("div");m.className="wn-annot-import-meta wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-name wn-annotator",f.textContent=l.name;const g=document.createElement("div");g.className="wn-annot-import-sub wn-annotator";const x=i.get(l.id)||0,h=l.pageUrl?` | ${zn(l.pageUrl,36)}`:"";g.textContent=`${x} comments | ${$n(l.size)}${h}`,m.appendChild(f),m.appendChild(g);const p=document.createElement("div");p.className="wn-annot-import-actions wn-annotator";const w=document.createElement("div");w.className="wn-annot-import-badge wn-annotator",w.textContent=String(x);const b=document.createElement("button");b.type="button",b.className="wn-annot-import-remove wn-annotator",b.dataset.importRemove=l.id,b.textContent="x",p.appendChild(w),p.appendChild(b),d.appendChild(m),d.appendChild(p),t.appendChild(d)});else{const l=document.createElement("div");l.className="wn-annot-import-empty wn-annotator",l.textContent="No imported files yet.",t.appendChild(l)}if(e.innerHTML="",s.size)Array.from(s.entries()).sort((l,d)=>d[1]-l[1]||l[0].localeCompare(d[0])).forEach(([l,d])=>{const m=document.createElement("div");m.className="wn-annot-import-card wn-annotator";const f=document.createElement("div");f.className="wn-annot-import-meta wn-annotator";const g=document.createElement("div");g.className="wn-annot-import-name wn-annotator",g.textContent=l;const x=document.createElement("div");x.className="wn-annot-import-sub wn-annotator",x.textContent=`${d} comments`,f.appendChild(g),f.appendChild(x);const h=document.createElement("div");h.className="wn-annot-import-badge wn-annotator",h.textContent=String(d),m.appendChild(f),m.appendChild(h),e.appendChild(m)});else{const l=document.createElement("div");l.className="wn-annot-import-empty wn-annotator",l.textContent="No reviewers yet.",e.appendChild(l)}n.textContent=String(a.importFiles.length),o.textContent=String(s.size),r.textContent=String(c)}function An(){const t=new Map,e=new Map,n=a.annotations.filter(o=>o.importFileId);return n.forEach(o=>{o.importFileId&&t.set(o.importFileId,(t.get(o.importFileId)||0)+1);const r=(o.author||"").trim()||"Unknown reviewer";e.set(r,(e.get(r)||0)+1)}),{fileCounts:t,reviewerCounts:e,totalComments:n.length}}async function we(t){if(!t||!t.length)return;const e=new Set(a.annotations.map(o=>o.id));let n=0;for(const o of t){const r=await Nn(o,e);if(!r)continue;const{fileMeta:i,annotations:s}=r;s.length&&(a.importFiles.push(i),a.annotations.push(...s),n+=s.length)}if(!n){ut();return}B(),ke(),ft(),nt(),at(),J(),ut()}async function Nn(t,e){let n;try{const d=await t.text();n=JSON.parse(d)}catch(d){return await It(`Invalid JSON in ${t.name}.`,"Import error"),null}const o=Array.isArray(n)?n:n.annotations;if(!Array.isArray(o))return await It(`Unsupported JSON format in ${t.name}.`,"Import error"),null;const r=Array.isArray(n)?"":n.exportedBy||n.annotator||n.author||"",i=Array.isArray(n)?t.lastModified:n.createdAt,s=Array.isArray(n)?"":n.pageUrl||"",c=De(),l=o.filter(Ft).map(d=>Sn(d,{fallbackAuthor:r,createdAt:i,pageUrl:s,fileId:c,existingIds:e}));return{fileMeta:{id:c,name:t.name,size:t.size,pageUrl:s,importedAt:Date.now()},annotations:l}}function Sn(t,e){const n=t&&typeof t=="object"?t:{},o=(n.author||e.fallbackAuthor||"").trim(),r=n.pageUrl||e.pageUrl||window.location.href,i=Tn(n.id,e.existingIds),s=rn(Wt({},n),{id:i,createdAt:n.createdAt||e.createdAt||Date.now(),priority:n.priority||"medium",author:o,pageUrl:r,importFileId:e.fileId});return s.pageKey||(s.pageKey=M(r)),s}function Tn(t,e){if(t&&!e.has(t))return e.add(t),t;let n;do n=kt();while(e.has(n));return e.add(n),n}function Mn(t){const e=a.importFiles.filter(n=>n.id!==t);e.length!==a.importFiles.length&&(a.importFiles=e,a.annotations=a.annotations.filter(n=>n.importFileId!==t),B(),ke(),ft(),nt(),at(),J(),ut())}function $n(t){if(!t)return"0 B";const e=["B","KB","MB","GB"],n=Math.min(Math.floor(Math.log(t)/Math.log(1024)),e.length-1),o=t/Math.pow(1024,n);return`${o.toFixed(o<10&&n>0?1:0)} ${e[n]}`}function zn(t,e){return typeof t!="string"?"":t.length<=e?t:t.slice(0,e-3)+"..."}function Rn(){if(a.dialogModal)return a.dialogModal;const t=document.createElement("div");t.className="wn-annot-modal-backdrop wn-annotator";const e=document.createElement("div");e.className="wn-annot-modal wn-annotator";const n=document.createElement("h4");n.className="wn-annotator";const o=document.createElement("div");o.className="wn-annot-dialog-message wn-annotator";const r=document.createElement("div");r.className="wn-annot-actions wn-annotator";const i=document.createElement("button");i.type="button",i.className="wn-annot-pill cancel wn-annotator";const s=document.createElement("button");return s.type="button",s.className="wn-annot-pill primary wn-annotator",r.appendChild(i),r.appendChild(s),e.appendChild(n),e.appendChild(o),e.appendChild(r),t.appendChild(e),document.body.appendChild(t),a.dialogModal={backdrop:t,modal:e,title:n,message:o,okBtn:s,cancelBtn:i},a.dialogModal}function ge({title:t="Information",message:e="",okLabel:n="OK",cancelLabel:o="Cancel",dismissOnBackdrop:r=!0}){return new Promise(i=>{const{backdrop:s,title:c,message:l,okBtn:d,cancelBtn:m}=Rn();c.textContent=t,l.textContent=e,d.textContent=n;const f=!!o;m.style.display=f?"inline-flex":"none",m.textContent=o||"";const g=b=>{s.classList.remove("show"),d.removeEventListener("click",x),m.removeEventListener("click",h),s.removeEventListener("click",p),document.removeEventListener("keydown",w),i(b)},x=()=>g(!0),h=()=>g(!1),p=b=>{b.target===s&&r&&g(!1)},w=b=>{b.key==="Escape"&&g(!1),(b.metaKey||b.ctrlKey)&&b.key==="Enter"&&x()};d.addEventListener("click",x),m.addEventListener("click",h),s.addEventListener("click",p),document.addEventListener("keydown",w),s.classList.add("show"),d.focus()})}async function In(t,e="Confirmation"){return ge({title:e,message:t,okLabel:"Confirm",cancelLabel:"Cancel"})}async function It(t,e="Information"){await ge({title:e,message:t,okLabel:"OK",cancelLabel:null})}function On(){document.addEventListener("mouseup",Ut),document.addEventListener("touchend",Ut),document.addEventListener("pointerup",Ut),document.addEventListener("mousemove",to),document.addEventListener("click",eo,!0),window.addEventListener("resize",F),window.addEventListener("resize",bt),window.addEventListener("resize",xt),window.addEventListener("resize",j),window.addEventListener("resize",wt),window.addEventListener("scroll",F,{passive:!0}),Ko()}function V(t){return t==="__unknown"?"Unknown":t}function Ot(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-priority"),e=a.panel.querySelector("#wn-filter-author"),n=a.panel.querySelector('[data-filter-clear="priority"]'),o=a.panel.querySelector('[data-filter-clear="author"]');n&&t&&(n.style.display=t.value==="all"?"none":"inline-flex"),o&&e&&(o.style.display=e.value==="all"?"none":"inline-flex")}function xe(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-author");if(!t)return;const e=a.filters.author||"all",n=Array.from(new Set(a.annotations.map(i=>(i.author||"").trim()||"__unknown"))).filter(i=>i);t.innerHTML="";const o=document.createElement("option");o.value="all",o.textContent="All",t.appendChild(o),n.sort((i,s)=>V(i).localeCompare(V(s))).forEach(i=>{const s=document.createElement("option");s.value=i,s.textContent=V(i),t.appendChild(s)});const r=["all",...n];t.value=r.includes(e)?e:"all",a.filters.author=t.value,Ot()}function Pn(){if(!a.panel)return;const t=a.panel.querySelector("#wn-filter-priority"),e=a.panel.querySelector("#wn-filter-author"),n=a.panel.querySelector("#wn-filter-search"),o=a.panel.querySelector('[data-filter-clear="priority"]'),r=a.panel.querySelector('[data-filter-clear="author"]');if(!t||!e||!n)return;t.value=a.filters.priority,e.value=a.filters.author,n.value=a.filters.query;const i=()=>{a.filters.priority=t.value,a.filters.author=e.value,a.filters.query=n.value.trim().toLowerCase(),T(),Ot()};t.addEventListener("change",i),e.addEventListener("change",i),n.addEventListener("input",i),o&&o.addEventListener("click",()=>{t.value="all",i()}),r&&r.addEventListener("click",()=>{e.value="all",i()}),xe(),Ot()}function X(t,e={}){const n=e.keepOutline;if(a.mode===t){a.mode=null,be(),Pt(),n||yt();return}a.mode=t,be(),Bn(t),t!=="element"&&yt()}function be(){a.toolbar.querySelectorAll('button[data-action="mode"]').forEach(e=>{e.getAttribute("data-mode")===a.mode?e.classList.add("active"):e.classList.remove("active")})}function Bn(t){let e="";if(t==="text"?e="Select text then release to add a note.":t==="element"&&(e="Hover an element, click to annotate."),!e)return Pt();a.tip.textContent=e,a.tip.classList.add("show"),j(),requestAnimationFrame(j),requestAnimationFrame(j)}function Pt(){a.tip.classList.remove("show")}function Hn(){if(a.toast)return a.toast;const t=document.createElement("div");return t.className="wn-annot-toast wn-annotator",t.setAttribute("aria-live","polite"),document.body.appendChild(t),a.toast=t,t}function Y(t){if(!t)return;const e=Hn();e.textContent=t,e.classList.add("show"),a.toastTimer&&clearTimeout(a.toastTimer),a.toastTimer=setTimeout(()=>{e.classList.remove("show")},2200)}function Fn(){try{const t=localStorage.getItem(te);if(t==="top"||t==="bottom")return t}catch(t){}return null}function Un(){try{const t=localStorage.getItem(re);return t==null?null:t==="true"}catch(t){return null}}function Dn(t){try{localStorage.setItem(re,t?"true":"false")}catch(e){}}function jn(){if(!document||!document.documentElement)return;const t=document.documentElement,e=a.colors||Mt,n=(i,s)=>{s&&t.style.setProperty(i,s)},o=e.text,r=e.element;n("--wn-text-highlight",o.base),n("--wn-text-highlight-overlay",o.overlay),n("--wn-text-highlight-soft",o.soft),n("--wn-element-highlight",r.base),n("--wn-element-highlight-soft",r.soft),n("--wn-element-highlight-soft-end",r.softer),n("--wn-element-highlight-strong",r.strong),n("--wn-element-highlight-shadow",r.shadow),n("--wn-marker-text",r.text)}function Bt(t,e={}){var s,c,l;const n=mt(t,"#000000"),o=(s=e.softAlpha)!=null?s:.12,r=(c=e.softerAlpha)!=null?c:.04,i=(l=e.overlayAlpha)!=null?l:.7;return{base:n,overlay:P(n,i,P("#000000",i)),soft:P(n,o,P("#000000",o)),softer:P(n,r,P("#000000",r)),strong:P(n,.9,n),shadow:P(n,.24,"rgba(0,0,0,0.24)"),pill:P(n,.16,"rgba(0,0,0,0.16)"),pillBorder:P(n,.28,"rgba(0,0,0,0.28)"),text:qn(n)}}function mt(t,e){const n=Ht(t);return n||Ht(e)||"#000000"}function Ht(t){if(!t||typeof t!="string")return null;const n=t.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);if(!n)return null;const o=n[1];return`#${(o.length===3?o.split("").map(i=>i+i).join(""):o).toLowerCase()}`}function ye(t){const e=Ht(t);if(!e)return null;const n=parseInt(e.slice(1),16);return{r:n>>16&255,g:n>>8&255,b:n&255}}function P(t,e=1,n=""){const o=ye(t);if(!o)return n||"";const r=typeof e=="number"&&e>=0&&e<=1?e:1;return`rgba(${o.r}, ${o.g}, ${o.b}, ${r})`}function qn(t){const e=ye(t);return e?.299*e.r+.587*e.g+.114*e.b>160?"#0b1622":"#ffffff":"#0b1622"}function D(t){const e=a.colors||Mt,n=t&&t.type;return n==="text"?e.text:n==="screenshot"?e.screenshot:e.element}function ve(t,e){!t||!e||(t.style.setProperty("--wn-marker-bg",e.base),t.style.setProperty("--wn-marker-text",e.text),t.style.setProperty("--wn-marker-shadow",e.shadow))}function Kn(t,e){!t||!e||(t.style.setProperty("--wn-item-accent",e.base),t.style.setProperty("--wn-item-accent-strong",e.strong),t.style.setProperty("--wn-item-accent-shadow",e.shadow),t.style.setProperty("--wn-item-accent-soft",e.soft),t.style.setProperty("--wn-item-accent-soft-end",e.softer),t.style.setProperty("--wn-item-number-bg",e.pill),t.style.setProperty("--wn-item-number-border",e.pillBorder),t.style.setProperty("--wn-item-number-text","#000000"))}function _(t,e=!1){if(t==null||t==="")return e;const n=String(t).toLowerCase();return n==="true"||n==="1"||n==="yes"||n==="on"?!0:n==="false"||n==="0"||n==="no"||n==="off"?!1:e}function Ce(){try{return localStorage.getItem(ne)||""}catch(t){return""}}function Vn(t){try{localStorage.setItem(ne,t)}catch(e){}}function Xn(){try{const t=localStorage.getItem(oe),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>typeof n=="string"&&n.trim()).map(n=>n.trim()):[]}catch(t){return[]}}function Yn(t){try{localStorage.setItem(oe,JSON.stringify(t||[]))}catch(e){}}function _n(){try{const t=localStorage.getItem(ae),e=t?JSON.parse(t):[];return Array.isArray(e)?e.filter(n=>n&&typeof n=="object").map(n=>({id:n.id||De(),name:String(n.name||"Imported file"),size:Number(n.size||0),pageUrl:typeof n.pageUrl=="string"?n.pageUrl:"",importedAt:Number(n.importedAt||0)})):[]}catch(t){return[]}}function ke(){try{localStorage.setItem(ae,JSON.stringify(a.importFiles||[]))}catch(t){}}function Ee(t){const e=(t||"").trim();if(!e)return;a.annotatorName=e;const n=[e,...a.annotatorNames.filter(o=>o!==e)];a.annotatorNames=n,Vn(e),Yn(n)}function ft(){const t=Array.from(new Set((a.annotations||[]).map(n=>(n.author||"").trim()).filter(Boolean))),e=Array.from(new Set([...a.annotatorNames||[],...t]));a.annotatorNames=e,a.annotatorName||(a.annotatorName=Ce()||e[0]||"")}function ra(t,e={}){if(!t)return!1;const n=e.force||!1;let o=!1;return a.annotations.forEach(r=>{!n&&r.author||(r.author!==t&&(o=!0),r.author=t)}),o&&B(),o}function j(){if(!a.tip||!a.toolbar)return;const t=a.toolbar.getBoundingClientRect(),e=a.tip,n=10,o=t.left+t.width/2,r=k==="bottom";e.style.left=`${o}px`,e.style.right="",e.style.transform="translateX(-50%)",e.style.top="",e.style.bottom="";const i=e.getBoundingClientRect();if(r){const s=Math.max(8,t.top-n-i.height);e.style.top=`${s}px`}else{const s=t.bottom+n;e.style.top=`${s}px`}}function Ft(t){return!!t&&(t.type==="text"||t.type==="element"||t.type==="screenshot")}function Jn(){try{const t=localStorage.getItem(ee),e=t?JSON.parse(t):[];a.annotations=(e||[]).filter(Ft),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=M(n.pageUrl||window.location.href))})}catch(t){console.warn("Annotator storage error",t),a.annotations=[]}}function B(){if(L){Ze();return}try{localStorage.setItem(ee,JSON.stringify(a.annotations))}catch(t){console.warn("Annotator storage save error",t)}}async function Wn(t){const e=t.target.closest("button");if(!e||!e.classList.contains("wn-annotator"))return;const n=e.getAttribute("data-action");if(n){if(n==="mode"){const o=e.getAttribute("data-mode");if(o==="screenshot"){await Yo();return}X(o);return}if(n==="export"){yn();return}if(n==="import"){Ln();return}if(n==="toggle-panel"){Zn();return}if(n==="toggle-pos"){Qn(k==="bottom"?"top":"bottom"),Ae();return}}}function Zn(){const t=a.panel.style.display==="none";a.panel.style.display=t?"":"none",gt()}function Gn(){ht(!a.hidden)}function ht(t){a.hidden=t,Dn(t),document.body.classList.toggle("wn-annot-hidden",t),t&&(X(null),Pt(),yt()),Le(),ue(),wt(),bt(),t||(F(),xt(),j()),document.dispatchEvent(new CustomEvent("uxnote:visibility",{detail:{hidden:t}}))}function Le(){if(!a.visibilityToggle)return;const t=a.hidden?"Show Uxnote":"Hide Uxnote";a.visibilityToggle.classList.toggle("is-muted",a.hidden),a.visibilityToggle.innerHTML=a.hidden?Ho():Xe(),a.visibilityToggle.setAttribute("aria-label",t),a.visibilityToggle.setAttribute("aria-pressed",a.hidden?"true":"false"),a.visibilityToggle.setAttribute("data-tip",t)}function wt(){const t=a.visibilityToggle;if(!t)return;me();const e=18;if(ct()){a.hidden?(t.style.bottom=`${e}px`,t.style.left=`${e}px`,t.style.top="",t.style.right=""):(t.style.top="",t.style.right="",t.style.bottom="",t.style.left="");return}t.style.left="",t.style.right="",k==="top"?(t.style.top=`${e}px`,t.style.bottom=""):(t.style.bottom=`${e}px`,t.style.top="")}function gt(){if(!a.panel||!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-panel"]');if(!t)return;const e=a.panel.style.display==="none";t.classList.toggle("active",!e)}function xt(){if(!a.panel||!a.toolbar)return;const t=a.panel,e=18,n=a.toolbar.getBoundingClientRect();if(ct()){t.style.width="100vw",t.style.maxHeight="100vh",t.style.height="100vh",t.style.left="0",t.style.right="0",t.style.top="0",t.style.bottom="0",t.style.borderRadius="0";return}t.style.width=`min(360px, calc(100vw - ${e*2}px))`,t.style.maxHeight=`calc(100vh - ${e*2}px)`,t.style.left="auto",t.style.right=`${e}px`,t.style.top=`${e}px`,t.style.bottom=`${e}px`,t.style.height="",t.style.borderRadius="",k==="left"?(t.style.left=`${n.width+e}px`,t.style.right=`${e}px`):k==="right"&&(t.style.right=`${n.width+e}px`,t.style.left=`${e}px`)}function Qn(t){k=t==="top"?"top":"bottom";const e=a.toolbar;e&&(e.classList.remove("wn-pos-top","wn-pos-bottom","wn-pos-left","wn-pos-right"),e.classList.add(`wn-pos-${k}`));try{localStorage.setItem(te,k)}catch(n){}Ae(),wt(),j(),dt(),xt(),bt()}function Ae(){if(!a.toolbar)return;const t=a.toolbar.querySelector('button[data-action="toggle-pos"]');t&&(t.innerHTML=k==="top"?Ke():Ve())}function bt(){if(!a.toolbar||a.customPosition||!(lt==="push"||lt==="dock"||lt==="pad"||lt==="true"))return;const t=document.body;a.basePadding||pe();const e=a.basePadding;if(a.hidden){t.style.paddingTop=`${e.top}px`,t.style.paddingRight=`${e.right}px`,t.style.paddingBottom=`${e.bottom}px`,t.style.paddingLeft=`${e.left}px`;return}const n=a.toolbar.getBoundingClientRect(),o=Wt({},e);k==="top"?o.top=e.top+n.height:k==="bottom"?o.bottom=e.bottom+n.height:k==="left"?o.left=e.left+n.width:k==="right"&&(o.right=e.right+n.width),t.style.paddingTop=`${o.top}px`,t.style.paddingRight=`${o.right}px`,t.style.paddingBottom=`${o.bottom}px`,t.style.paddingLeft=`${o.left}px`}async function Ut(){if(a.mode!=="text")return;const t=window.getSelection();if(!t||t.rangeCount===0||t.isCollapsed)return;const e=t.getRangeAt(0);if(!e)return;if(!(W(e.commonAncestorContainer)&&W(e.startContainer)&&W(e.endContainer))){t.removeAllRanges(),Y("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}const o=t.toString().trim();if(!o)return;const r=await Rt("Comment for this highlight?");if(!r)return;const{comment:i,priority:s,author:c}=r,l=kt(),d=ao(e,o),m=vt(e,l);t.removeAllRanges();const f={id:l,type:"text",target:d,comment:i.trim(),author:c||a.annotatorName||"",priority:s||"medium",snippet:o.slice(0,180),pageUrl:window.location.href,pageKey:M(window.location.href),createdAt:Date.now(),status:"active"};a.annotations.push(f),B(),Z(f,m),T(),X(null,{keepOutline:!0})}function to(t){if(a.mode!=="element")return;const e=t.target;if(!e||!W(e)){yt();return}const n=e.getBoundingClientRect();oo(n)}async function eo(t){if(a.mode!=="element")return;const e=t.target;if(!e||!W(e)){Y("Cette zone est une popup/overlay, annotation bloqu\xE9e.");return}t.preventDefault(),t.stopPropagation();const n=await Rt("Comment for this element?");if(!n)return;const{comment:o,priority:r,author:i}=n,s=kt(),c=jt(e),l=po(e),d=e.getBoundingClientRect(),m={id:s,type:"element",target:{xpath:c,css:l,tag:e.tagName.toLowerCase()},comment:o.trim(),author:i||a.annotatorName||"",priority:r||"medium",snippet:e.innerText?e.innerText.trim().slice(0,120):e.tagName,pageUrl:window.location.href,pageKey:M(window.location.href),rect:{x:d.x+window.scrollX,y:d.y+window.scrollY,w:d.width,h:d.height},createdAt:Date.now(),status:"active"};a.annotations.push(m),B(),Z(m,e),Re(e,s),T(),X(null,{keepOutline:!0})}function Dt(t){const e=t&&t.parentNode;if(e){for(;t.firstChild;)e.insertBefore(t.firstChild,t);e.removeChild(t)}}function et(t){const e=a.highlightSpans[t];return e?Array.isArray(e)?e:[e]:Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`))}function nt(){Object.keys(a.highlightSpans||{}).forEach(t=>{et(t).forEach(e=>{e&&e.parentNode&&Dt(e)})}),a.highlightSpans={},Array.from(document.querySelectorAll(".uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]")).forEach(t=>{t&&t.parentNode&&Dt(t)}),Object.values(a.markers||{}).forEach(t=>{t&&t.el&&t.el.parentNode&&t.el.parentNode.removeChild(t.el)}),a.markerLayer&&(a.markerLayer.innerHTML=""),a.markers={},Object.keys(a.elementTargets||{}).forEach(t=>{Ie(t)}),a.elementTargets={},Array.from(document.querySelectorAll(".uxnote-annotated[data-uxnote-ids]")).forEach(t=>{delete t.dataset.uxnoteIds,t.classList.remove("uxnote-annotated")})}function no(t){const e=a.markers[t];e&&e.el&&e.el.parentNode&&e.el.parentNode.removeChild(e.el),e&&e.frame&&e.frame.parentNode&&e.frame.parentNode.removeChild(e.frame),delete a.markers[t],Ie(t);let n=et(t);n.length||(n=Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)),n.length||(n=Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${t}"]`)))),n.forEach(o=>{o&&Dt(o)}),delete a.highlightSpans[t]}function J(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.findIndex(o=>o.id===t);n!==-1&&(e.el.textContent=n+1)})}function oo(t){const e=a.outlineBox;e.style.display="block",e.style.left=`${t.x+window.scrollX}px`,e.style.top=`${t.y+window.scrollY}px`,e.style.width=`${t.width}px`,e.style.height=`${t.height}px`}function yt(){a.outlineBox.style.display="none"}function Ne(t){return t?t.classList&&t.classList.contains("wn-annotator")||t.parentElement&&Ne(t.parentElement):!1}function W(t){if(!t)return!1;const e=t.nodeType===Node.ELEMENT_NODE?t:t.nodeType===Node.DOCUMENT_NODE?document.body:t.parentElement;if(!e||Ne(e))return!1;if(e.closest){if(e.closest("[data-uxnote-ignore]"))return!1;if(e.closest("[data-uxnote-allow]"))return!0;if(e.closest('#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'))return!1}return!0}function ao(t,e){return{startXPath:jt(t.startContainer),startOffset:t.startOffset,endXPath:jt(t.endContainer),endOffset:t.endOffset,quote:e?String(e).slice(0,200):""}}function vt(t,e){let n=[];const o=t.cloneRange();if(ro(o).forEach(i=>{const s=io(i,{start:i===o.startContainer?o.startOffset:0,end:i===o.endContainer?o.endOffset:i.length},e);s&&n.push(s)}),!n.length){const i=document.createElement("span");i.className="uxnote-textmark",i.dataset.uxnoteId=e,i.addEventListener("click",c=>{c.stopPropagation(),it(e)});const s=o.extractContents();i.appendChild(s),o.insertNode(i),n=[i]}return a.highlightSpans[e]=n,n[0]}function ia(t,e){return vt(t,e)}function Se(t,e){const n=document.createRange();return n.selectNodeContents(e),t.compareBoundaryPoints(Range.END_TO_START,n)>0&&t.compareBoundaryPoints(Range.START_TO_END,n)<0}function ro(t){const e=[],n=document.createTreeWalker(t.commonAncestorContainer,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();)if(!(!o.nodeValue||!o.nodeValue.trim())){try{if(t.intersectsNode){if(!t.intersectsNode(o))continue}else if(!Se(t,o))continue}catch(r){if(!Se(t,o))continue}e.push(o)}return e}function io(t,e,n){if(!t||!t.parentNode)return null;const{start:o,end:r}=e;let i=t,s=r;if(o>0&&(i=i.splitText(o),s=r-o),s<i.length&&i.splitText(s),!i.parentNode)return null;const c=document.createElement("span");return c.className="uxnote-textmark",c.dataset.uxnoteId=n,c.addEventListener("click",l=>{l.stopPropagation(),it(n)}),i.parentNode.insertBefore(c,i),c.appendChild(i),c}function Te(t){return t?typeof t.isConnected=="boolean"?t.isConnected:document.body&&document.body.contains(t):!1}function so(t,e){if(!t||!e)return null;const n=Math.max(t.x,e.x),o=Math.max(t.y,e.y),r=Math.min(t.x+t.width,e.x+e.width),i=Math.min(t.y+t.height,e.y+e.height),s=r-n,c=i-o;return s<=0||c<=0?null:{x:n,y:o,width:s,height:c}}function Me(t){if(!t||!Te(t)||!t.getBoundingClientRect)return null;let e=t.getBoundingClientRect();if(!e.width||!e.height)return null;let n=t;for(;n&&n.nodeType===1;){if(n.tagName==="DETAILS"&&!n.open){const d=n.querySelector("summary");if(d&&!d.contains(t))return null}if(n.hasAttribute&&n.hasAttribute("hidden")||(n.getAttribute&&n.getAttribute("aria-hidden"))==="true")return null;const r=window.getComputedStyle(n);if(r.display==="none"||r.visibility==="hidden"||r.visibility==="collapse"||r.opacity==="0")return null;const i=r.overflowX||r.overflow,s=r.overflowY||r.overflow;if(i&&i!=="visible"||s&&s!=="visible"){const d=n.getBoundingClientRect(),m=so(e,d);if(!m)return null;e=m}n=n.parentElement}return e}function lo(t){let e=t&&t.nodeType===1?t:null;for(;e&&e.nodeType===1&&e!==document.body;){const n=window.getComputedStyle(e),o=n.zIndex;if(n.position!=="static"&&o!=="auto"||n.opacity!=="1"||n.transform!=="none"||n.filter!=="none"||n.perspective!=="none"||n.mixBlendMode!=="normal"||n.isolation==="isolate"||n.willChange&&n.willChange!=="auto"||n.contain&&n.contain!=="none")return e;e=e.parentElement}return document.body}function $e(t){if(!t||t.nodeType!==1)return a.markerLayer||document.body;const e=t.offsetParent;return e&&e.nodeType===1?e:lo(t)||a.markerLayer||document.body}function ze(t){return t===document.body||t===a.markerLayer||t===document.documentElement}function co(t){if(!t||t.nodeType!==1)return!1;let e=!1,n=t;for(;n&&n.nodeType===1&&n!==document.body;){if(n.tagName==="DETAILS"&&!n.open&&(n.open=!0,e=!0),n.tagName==="DIALOG"&&!n.open)try{typeof n.showModal=="function"?n.showModal():typeof n.show=="function"&&n.show(),e=!0}catch(r){}if(n.hasAttribute&&n.hasAttribute("popover"))try{typeof n.showPopover=="function"&&(n.showPopover(),e=!0)}catch(r){}if(n.hasAttribute&&n.hasAttribute("data-uxnote-open")){const r=n.getAttribute("data-uxnote-open");if(r){const i=document.querySelector(r);i&&typeof i.click=="function"&&(i.click(),e=!0)}}const o=n.getAttribute&&n.getAttribute("aria-hidden");if(n.hasAttribute&&n.hasAttribute("hidden")||o==="true"){const r=n.id;if(r){const i=document.querySelector(`[aria-controls="${Ct(r)}"]`);i&&typeof i.click=="function"&&(i.click(),e=!0)}}n=n.parentElement}return e}function Re(t,e){if(!t||t.nodeType!==1)return!1;const n=t.dataset.uxnoteIds?t.dataset.uxnoteIds.split(",").filter(Boolean):[],o=new Set(n);return o.add(e),t.dataset.uxnoteIds=Array.from(o).join(","),t.classList.add("uxnote-annotated"),a.elementTargets[e]=t,!0}function Ie(t){const e=a.elementTargets[t];if(!e||e.nodeType!==1){delete a.elementTargets[t],Array.from(document.querySelectorAll("[data-uxnote-ids]")).forEach(i=>{const s=i.dataset.uxnoteIds?i.dataset.uxnoteIds.split(",").filter(Boolean):[];if(!s.includes(t))return;const c=s.filter(l=>l!==t);c.length?i.dataset.uxnoteIds=c.join(","):(delete i.dataset.uxnoteIds,i.classList.remove("uxnote-annotated"))});return}const o=(e.dataset.uxnoteIds?e.dataset.uxnoteIds.split(",").filter(Boolean):[]).filter(r=>r!==t);o.length?e.dataset.uxnoteIds=o.join(","):(delete e.dataset.uxnoteIds,e.classList.remove("uxnote-annotated")),delete a.elementTargets[t]}function jt(t){if(t===document.body)return"/html/body";const e=[];for(;t&&t!==document;){let n=1,o=t.previousSibling;for(;o;)o.nodeType===t.nodeType&&o.nodeName===t.nodeName&&n++,o=o.previousSibling;const r=t.nodeType===3?"text()":t.nodeName.toLowerCase();if(e.unshift(`${r}[${n}]`),t=t.parentNode,!t||t.nodeType!==1)break}return"/"+e.join("/")}function Ct(t){return window.CSS&&typeof window.CSS.escape=="function"?window.CSS.escape(t):String(t).replace(/[^a-zA-Z0-9_-]/g,"\\$&")}function po(t){if(!t||t.nodeType!==1)return"";if(t.id)return`#${Ct(t.id)}`;const e=[];let n=t,o=0;for(;n&&n.nodeType===1&&o<4;){let r=n.tagName.toLowerCase();const i=Array.from(n.classList||[]).filter(s=>s&&!s.startsWith("wn-")&&!s.startsWith("uxnote-"));if(i.length&&(r+=`.${i.slice(0,2).map(Ct).join(".")}`),e.unshift(r),n.parentElement&&n.parentElement.id){e.unshift(`#${Ct(n.parentElement.id)}`);break}n=n.parentElement,o+=1}return e.join(" > ")}function ot(t){try{const e=document;return e.evaluate(t,e,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue}catch(e){return null}}function at(){a.annotations.forEach(t=>{t.pageKey===M(window.location.href)&&uo(t)}),T()}function uo(t){const e=rt(t);if(!e){t.status="missing",Oe();return}t.status="active",qt(t,e)}function qt(t,e){if(e){if(e.type==="screenshot"){Z(t,null);return}if(e.type==="text"&&e.range){const n=vt(e.range,t.id);Z(t,n);return}e.type==="element"&&e.el&&(Re(e.el,t.id),Z(t,e.el))}}function mo(t){if(!t)return null;const e=ot(t.startXPath),n=ot(t.endXPath);if(!e||!n)return null;try{const o=document.createRange();return o.setStart(e,t.startOffset),o.setEnd(n,t.endOffset),o}catch(o){return null}}function rt(t){return t?t.type==="screenshot"?t.rect?{type:"screenshot"}:null:t.target?t.type==="text"?fo(t):t.type==="element"?wo(t):null:null:null}function fo(t){const e=t.target||{},n=mo(e);if(n)return{type:"text",range:n};const o=e.quote||t.snippet||"";if(!o)return null;const r=ho(o);return r?{type:"text",range:r}:null}function ho(t){const e=String(t||"").trim();if(!e||e.length<4)return null;const n=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);let o;for(;o=n.nextNode();){if(!o.nodeValue||!o.nodeValue.trim()||!W(o))continue;const r=o.nodeValue.indexOf(e);if(r===-1)continue;const i=document.createRange();return i.setStart(o,r),i.setEnd(o,r+e.length),i}return null}function wo(t){const e=t.target||{};if(e.xpath){const r=ot(e.xpath);if(r&&r.nodeType===1)return{type:"element",el:r}}if(e.css)try{const r=document.querySelector(e.css);if(r&&r.nodeType===1)return{type:"element",el:r}}catch(r){}const n=e.tag,o=(t.snippet||"").trim();if(n&&o){const r=document.querySelectorAll(n);for(const i of r)if(!(!i||i.nodeType!==1)&&(i.textContent||"").includes(o))return{type:"element",el:i}}return null}function go(){a.missingRetryTimer&&clearTimeout(a.missingRetryTimer),a.missingRetryTimer=setTimeout(()=>{Kt()},300)}function Oe(){a.missingObserver||!window.MutationObserver||(a.missingObserver=new MutationObserver(()=>{a.annotations.some(t=>t.status==="missing")&&go()}),a.missingObserver.observe(document.body,{childList:!0,subtree:!0}))}function xo(){a.missingObserver&&(a.missingObserver.disconnect(),a.missingObserver=null)}function Kt(){let t=!1;a.annotations.forEach(e=>{if(e.status!=="missing"||e.pageKey!==M(window.location.href))return;const n=rt(e);n&&(e.status="active",qt(e,n),t=!0)}),t&&(B(),T(),F()),a.annotations.some(e=>e.status==="missing")||xo()}function bo(){let t=!1;a.annotations.forEach(e=>{if(e.type!=="text"||e.pageKey!==M(window.location.href))return;const n=et(e.id).filter(Te);if(n.length){a.highlightSpans[e.id]=n,e.status==="missing"&&(e.status="active",t=!0);return}const o=rt(e);if(o&&o.range){vt(o.range,e.id),e.status="active",t=!0;return}e.status!=="missing"&&(e.status="missing",t=!0)}),t&&(B(),T(),F())}function yo(){a.layoutTimer&&clearTimeout(a.layoutTimer),a.layoutTimer=setTimeout(()=>{F(),bo(),a.annotations.some(t=>t.status==="missing")&&Kt()},120)}function vo(){a.layoutObserver||!window.MutationObserver||(a.layoutObserver=new MutationObserver(t=>{t.some(n=>{const o=n.target;return!(!o||o.classList&&o.classList.contains("wn-annotator")||o.closest&&o.closest(".wn-annotator"))})&&yo()}),a.layoutObserver.observe(document.body,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["style","class","open","hidden","aria-hidden"]}))}function Z(t,e){if(t.pageKey!==M(window.location.href)||!a.markerLayer)return;const n=a.markers[t.id];n&&n.el&&n.el.parentNode&&n.el.parentNode.removeChild(n.el);const o=document.createElement("div");o.className="wn-annot-marker wn-annotator",o.textContent=a.annotations.findIndex(l=>l.id===t.id)+1,o.dataset.wnAnnotId=t.id;const r=D(t);ve(o,r),o.addEventListener("click",()=>it(t.id));const i=Be(t,e),s=Pe(t,i),c=$e(i&&i.anchor?i.anchor:e);if(o.parentNode!==c&&c.appendChild(o),o.style.zIndex=ze(c)?"":"9999",!i){o.style.display="none",a.markers[t.id]={el:o,rect:null,frame:s};return}o.style.display="",He(o,i,t),a.markers[t.id]={el:o,rect:i,frame:s}}function Pe(t,e){const n=a.markers[t.id];let o=n?n.frame:null;if(t.type!=="screenshot"||!e)return o&&o.parentNode&&o.parentNode.removeChild(o),null;o||(o=document.createElement("div"),o.className="wn-annot-shot-frame wn-annotator");const r=a.markerLayer||document.body;return o.parentNode!==r&&r.appendChild(o),o.style.setProperty("--wn-shot-frame",D(t).base),o.style.left=`${e.x}px`,o.style.top=`${e.y}px`,o.style.width=`${e.w}px`,o.style.height=`${e.h}px`,o}function Be(t,e){var n;if(t.type==="text"){const r=(e?[e]:et(t.id))[0]||document.querySelector(`.uxnote-textmark[data-uxnote-id="${t.id}"]`);if(!r)return null;const i=Me(r);return i?{x:i.x,y:i.y,w:i.width,h:i.height,anchor:r}:null}if(t.type==="element"){const o=(e&&e.nodeType===1?e:null)||a.elementTargets[t.id]||((n=t.target)!=null&&n.xpath?ot(t.target.xpath):null);if(!o)return null;const r=Me(o);return r?{x:r.x,y:r.y,w:r.width,h:r.height,anchor:o}:null}if(t.type==="screenshot"){const o=t.rect;return o?{x:o.x-window.scrollX,y:o.y-window.scrollY,w:o.w,h:o.h,anchor:null}:null}return null}function He(t,e,n){const o=Co(n),i=(t.offsetParent||document.body).getBoundingClientRect(),s=i.x+window.scrollX,c=i.y+window.scrollY,l=e.x+window.scrollX,d=e.y+window.scrollY;t.style.left=`${l-s+e.w+o.x+4}px`,t.style.top=`${d-c+o.y-4}px`}function Co(t){if(t.type!=="element")return{x:0,y:0};const e=t.target&&t.target.xpath;if(!e)return{x:0,y:0};const n=a.annotations.filter(i=>i.type==="element"&&i.pageKey===t.pageKey&&i.target&&i.target.xpath===e);if(n.length<=1)return{x:0,y:0};const o=n.findIndex(i=>i.id===t.id);return o<=0?{x:0,y:0}:{x:-o*24,y:0}}function F(){Object.entries(a.markers).forEach(([t,e])=>{const n=a.annotations.find(i=>i.id===t);if(!n)return;const o=n.status==="missing"?null:Be(n);if(e.frame=Pe(n,o),!o){e.el.style.display="none",e.rect=null;return}e.el.style.display="",e.rect=o;const r=$e(o.anchor);e.el.parentNode!==r&&r.appendChild(e.el),e.el.style.zIndex=ze(r)?"":"9999",He(e.el,o,n),ve(e.el,D(n))})}function ko(){if(!a.panel)return;a.panel.style.display==="none"&&(a.panel.style.display="",gt())}function Eo(t){if(!a.panel)return;ko();const e=a.panel.querySelector(".wn-annot-list");if(!e)return;e.querySelectorAll(".wn-annot-item").forEach(r=>r.classList.remove("is-focused"));const o=e.querySelector(`.wn-annot-item[data-id="${t}"]`);o&&(o.classList.add("is-focused"),o.scrollIntoView({behavior:"smooth",block:"nearest"}))}function it(t,e=!1,n,o){var c;const r=a.annotations.find(l=>l.id===t);if(!r)return;if(Eo(t),r.status==="missing"){const l=rt(r);if(l)r.status="active",qt(r,l),T();else{Y("Annotation introuvable sur cette page.");return}}const i=rt(r);if(i){const l=i.type==="element"?i.el:i.range&&i.range.commonAncestorContainer?i.range.commonAncestorContainer.parentElement:null;l&&co(l)&&setTimeout(()=>{F()},160)}if(!((o||r.pageKey)===M(window.location.href))&&e){try{localStorage.setItem($t,JSON.stringify({id:r.id,pageKey:r.pageKey,pageUrl:n||r.pageUrl}))}catch(l){}window.location.href=n||r.pageUrl||window.location.href;return}if(r.type==="text"){const d=(et(t)||Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${t}"]`)))[0];d&&(d.scrollIntoView({behavior:"smooth",block:"center"}),Vt(d,D(r).base))}else if(r.type==="element"){const l=i&&i.el?i.el:(c=r.target)!=null&&c.xpath?ot(r.target.xpath):null;l&&l.scrollIntoView&&(l.scrollIntoView({behavior:"smooth",block:"center"}),Vt(l,D(r).base))}else if(r.type==="screenshot"&&r.rect){window.scrollTo({top:Math.max(0,r.rect.y+r.rect.h/2-window.innerHeight/2),behavior:"smooth"});const l=a.markers[r.id];l&&l.frame&&Vt(l.frame,D(r).base)}}function Vt(t,e){var i,s;t.style.transition="box-shadow 0.2s ease";const n=t.style.boxShadow,o=e||((s=(i=a.colors)==null?void 0:i.element)==null?void 0:s.base)||"#4e9cf6",r=P(o,.6,"rgba(78,156,246,0.6)");t.style.boxShadow=`0 0 0 3px ${r}`,setTimeout(()=>{t.style.boxShadow=n},800)}function Fe(){if(!a.panel)return null;let t=a.panel.querySelector(".wn-annot-footer");if(!t){t=document.createElement("div"),t.className="wn-annot-footer wn-annotator";const e=document.createElement("a");e.href="https://uxnote.ninefortyone.studio",e.target="_blank",e.rel="noreferrer noopener",e.textContent="\xA9 UxNote \u2013 by NineFortyOne.Studio",t.appendChild(e),a.panel.appendChild(t)}return t}function T(){const t=a.panel.querySelector(".wn-annot-list"),e=a.panel.querySelector("h3");if(t.innerHTML="",xe(),!a.annotations.length){const o=document.createElement("div");o.className="wn-annot-empty",o.textContent="No annotations yet.",t.appendChild(o),e&&(e.textContent="Annotations (0)");const r=Fe();return}const n=a.annotations.slice().sort((o,r)=>o.createdAt-r.createdAt).filter(o=>{const r=a.filters.priority==="all"||(o.priority||"medium")===a.filters.priority,i=a.filters.query,s=`${o.comment||""} ${o.snippet||""} ${o.author||""}`.toLowerCase(),c=!i||s.includes(i),l=a.filters.author||"all",d=(o.author||"").trim()||"__unknown";return r&&c&&(l==="all"||d===l)});e&&(e.textContent=`Annotations (${n.length})`),n.forEach((o,r)=>{const i=document.createElement("div");i.className="wn-annot-item",i.dataset.id=o.id,Kn(i,D(o));const s=o.priority||"medium",c=s==="high"?"High":s==="low"?"Low":"Medium",l=document.createElement("div");l.className="wn-annot-card-top";const d=document.createElement("div");d.className="wn-annot-card-top-left";const m=document.createElement("div");m.className="wn-annot-number",m.textContent=`#${r+1}`;const f=document.createElement("div");if(f.className=`wn-annot-priority ${s}`,f.innerHTML=`<span class="dot"></span><span>${c}</span>`,d.appendChild(m),d.appendChild(f),o.status==="missing"){const A=document.createElement("div");A.className="wn-annot-missing",A.textContent="Missing",d.appendChild(A)}const g=document.createElement("div");g.className="wn-annot-meta-bottom";const x=document.createElement("div");x.className="wn-annot-card-top-right";const h=document.createElement("button");h.type="button",h.className="wn-annot-edit wn-annotator",h.setAttribute("aria-label","Edit this annotation"),h.innerHTML=Oo(),h.addEventListener("click",async A=>{A.stopPropagation(),await Ao(o.id)}),x.appendChild(h);const p=document.createElement("button");p.type="button",p.className="wn-annot-delete wn-annotator",p.setAttribute("aria-label","Delete this annotation"),p.innerHTML=qe(),p.addEventListener("click",A=>{A.stopPropagation(),Lo(o.id)}),x.appendChild(p),l.appendChild(d),l.appendChild(x);const w=document.createElement("div");w.className="wn-annot-comment";const b=o.comment||"\u2014";w.textContent=b;const E=document.createElement("div");E.className="wn-annot-meta";const z=((o.author||"").trim()||"Unknown reviewer").toUpperCase(),v=new Date(o.createdAt),$=v.toLocaleDateString(void 0,{year:"numeric",month:"2-digit",day:"2-digit"}),I=v.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});E.textContent=`${z} \u2022 ${$} \u2022 ${I}`,g.appendChild(E);const O=document.createElement("button");O.type="button",O.className="wn-annot-showmore wn-annotator",O.textContent="See more",O.addEventListener("click",A=>{A.stopPropagation();const H=w.classList.toggle("expanded");O.textContent=H?"See less":"See more"}),b.length<160&&(O.style.display="none"),i.appendChild(l),i.appendChild(w);const q=Jo(o);if(q){const A=document.createElement("div");A.className="wn-annot-shot";const H=document.createElement("img");H.src=q,H.alt="The screenshot of this annotation",H.addEventListener("click",K=>{K.stopPropagation(),Wo(q)}),A.appendChild(H),i.appendChild(A)}i.appendChild(O),i.appendChild(g),i.addEventListener("click",()=>{it(o.id,!0,o.pageUrl,o.pageKey),ct()&&a.panel&&(a.panel.style.display="none",gt())}),t.appendChild(i)}),Fe()}function Lo(t){const e=a.annotations.findIndex(n=>n.id===t);e!==-1&&(a.annotations.splice(e,1),B(),no(t),T(),J(),F())}async function Ao(t){const e=a.annotations.find(s=>s.id===t);if(!e)return;const n=await fe("Edit this annotation",e.comment||"",e.priority||"medium",e.author||a.annotatorName||"");if(!n)return;const{comment:o,priority:r,author:i}=n;e.comment=o.trim(),e.priority=r||"medium",e.author=i||e.author||a.annotatorName||"",Ee(e.author),B(),T()}async function No(){!a.annotations.length||!await In("Delete all annotations?","Delete")||(a.annotations=[],L?jo():B(),nt(),T(),J())}function sa(){const t=Xt(),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),n=URL.createObjectURL(e),o=document.createElement("a");o.href=n,o.download=Yt(),o.click(),URL.revokeObjectURL(n)}function So(t){const e=new Set(t&&t.reviewers||[]),n=new Set(t&&t.priorities||[]),o=a.annotations.filter(l=>{const d=(l.author||"").trim()||"__unknown",m=l.priority||"medium",f=!e.size||e.has(d),g=!n.size||n.has(m);return f&&g}),r=Xt(o),i=new Blob([JSON.stringify(r,null,2)],{type:"application/json"}),s=URL.createObjectURL(i),c=document.createElement("a");c.href=s,c.download=Yt(),c.click(),URL.revokeObjectURL(s)}function Xt(t=a.annotations){return{pageUrl:window.location.href,createdAt:Date.now(),annotations:t}}function To(t){const e=new Set(t&&t.reviewers||[]),n=new Set(t&&t.priorities||[]),o=a.annotations.filter(r=>{const i=(r.author||"").trim()||"__unknown",s=r.priority||"medium",c=!e.size||e.has(i),l=!n.size||n.has(s);return c&&l});Ue(o)}async function la(){Ue(a.annotations)}function Ue(t){const e=Xt(t),n=JSON.stringify(e,null,2),o=encodeURIComponent(Yt()),r=encodeURIComponent(n),i=(sn||"").trim(),s=i?encodeURIComponent(i):"",c="?";window.location.href=`mailto:${s}${c}subject=${o}&body=${r}`}function kt(){return"wn-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function De(){return"imp-"+Math.random().toString(36).slice(2,8)+Date.now().toString(36)}function Yt(){const t=new Date,e=c=>String(c).padStart(2,"0"),n=`${e(t.getDate())}-${e(t.getMonth()+1)}-${t.getFullYear()}`,o=`${e(t.getHours())}-${e(t.getMinutes())}`,r=(document.title||"").trim(),i=c=>c.toLowerCase().replace(/[^a-z0-9]+/gi,"-").replace(/^-+|-+$/g,"")||"annotations";let s;return r?s=`${i(r)}-annotations`:window.location&&window.location.hostname?s=`${i(window.location.hostname)}-annotations`:s="annotations",`${s}_${n}_${o}.json`}const U=t=>`
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${t}
    </svg>
  `;function Mo(){return`
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
    `}function je(){return U(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `)}function $o(){return U(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `)}function zo(){return U(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `)}function Ro(){return U(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `)}function ca(){return U(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `)}function Io(){return U(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `)}function Oo(){return je()}function qe(){return`
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
    `}function Po(){return U(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `)}function Ke(){return U(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `)}function Ve(){return U(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `)}function Bo(){return k==="top"?Ke():Ve()}function Xe(){return`
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
    `}function Ho(){return`
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
    `}function M(t){try{const e=new URL(t,window.location.href);return`${e.origin}${e.pathname}`}catch(e){return`${window.location.origin}${window.location.pathname}`}}function Ye(){try{const t=localStorage.getItem($t);if(!t)return;const e=JSON.parse(t);e.pageKey===M(window.location.href)&&it(e.id,!1),localStorage.removeItem($t)}catch(t){}}let G=new Map,_t=Promise.resolve(),Q=!1;function _e(){return`${L.url}/annotations?site=${encodeURIComponent(C)}`}function Je(t){return`${L.url}/annotations/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function Fo(t){return`${L.url}/screenshots/${encodeURIComponent(t)}?site=${encodeURIComponent(C)}`}function st(t){const e=Object.assign({},t);return L.apiKey&&(e["X-Uxnote-Key"]=L.apiKey),e}function We(t){return new Map(t.map(e=>[e.id,JSON.stringify(e)]))}function Et(t,e){console.warn("Uxnote sync:",t,e),!Q&&(Q=!0,Y(t))}function Lt(t){return _t=_t.then(t,t),_t}async function Jt(){if(L)try{const t=await fetch(_e(),{headers:st({Accept:"application/json"})});if(!t.ok)throw new Error(`HTTP ${t.status}`);const e=await t.json();a.annotations=(e&&e.annotations||[]).filter(Ft),a.annotations.forEach(n=>{n.pageKey||(n.pageKey=M(n.pageUrl||window.location.href))}),G=We(a.annotations),Q=!1,ft(),nt(),at(),J(),T(),Ye()}catch(t){Et("Uxnote: could not read the annotations from the server",t)}}function Ze(){if(!L)return;const t=We(a.annotations);t.forEach((e,n)=>{G.get(n)!==e&&Lt(()=>Uo(n,e))}),G.forEach((e,n)=>{t.has(n)||Lt(()=>Do(n))})}async function Uo(t,e){try{const n=await fetch(Je(t),{method:"PUT",headers:st({"Content-Type":"application/json"}),body:e});if(!n.ok)throw new Error(`HTTP ${n.status}`);G.set(t,e),Q=!1}catch(n){Et("Uxnote: could not save this annotation on the server",n)}}async function Do(t){try{const e=await fetch(Je(t),{method:"DELETE",headers:st()});if(!e.ok)throw new Error(`HTTP ${e.status}`);G.delete(t),Q=!1}catch(e){Et("Uxnote: could not delete this annotation on the server",e)}}function jo(){L&&Lt(async()=>{try{const t=await fetch(_e(),{method:"DELETE",headers:st()});if(!t.ok)throw new Error(`HTTP ${t.status}`);G=new Map,Q=!1}catch(t){Et("Uxnote: could not delete the annotations on the server",t)}})}let At=null,Ge=M(window.location.href);function qo(){At=null;const t=M(window.location.href);t!==Ge&&(Ge=t,nt(),at(),J(),T(),Lt(Jt))}function Qe(){At&&clearTimeout(At),At=setTimeout(qo,120)}function Ko(){["pushState","replaceState"].forEach(t=>{const e=history[t];typeof e=="function"&&(history[t]=function(...o){const r=e.apply(this,o);return Qe(),r})}),window.addEventListener("popstate",Qe)}function tn(){return!!(window.snapdom&&typeof window.snapdom.toCanvas=="function")}function Vo(){return new Promise(t=>{const e=document.createElement("div");e.className="wn-shot-overlay wn-annotator";const n=document.createElement("div");n.className="wn-shot-rect wn-annotator",e.appendChild(n);const o=document.createElement("div");o.className="wn-shot-hint wn-annotator";const r=document.createElement("span");r.textContent="Drag to frame a region. Escape stops.";const i=document.createElement("button");i.type="button",i.textContent="Cancel",o.appendChild(r),o.appendChild(i);const s=p=>{const w=!!p&&p.w>=4&&p.h>=4;n.style.display=w?"block":"none",w&&(n.style.left=`${p.x}px`,n.style.top=`${p.y}px`,n.style.width=`${p.w}px`,n.style.height=`${p.h}px`)};s(null);const c=p=>({x:Math.min(Math.max(p.clientX,0),document.documentElement.clientWidth),y:Math.min(Math.max(p.clientY,0),document.documentElement.clientHeight)}),l=(p,w)=>({x:Math.min(p.x,w.x),y:Math.min(p.y,w.y),w:Math.abs(w.x-p.x),h:Math.abs(w.y-p.y)});let d=null;const m=p=>{p.preventDefault(),d=c(p),s(null)},f=p=>{d&&(p.preventDefault(),s(l(d,c(p))))},g=p=>{if(!d)return;const w=l(d,c(p));if(d=null,w.w<4||w.h<4){s(null);return}x({x:w.x+window.scrollX,y:w.y+window.scrollY,w:w.w,h:w.h})},x=p=>{document.removeEventListener("keydown",h,!0),document.removeEventListener("mousemove",f,!0),document.removeEventListener("mouseup",g,!0),e.remove(),o.remove(),t(p)},h=p=>{p.key==="Escape"&&(p.preventDefault(),x(null))};e.addEventListener("mousedown",m),i.addEventListener("click",()=>x(null)),document.addEventListener("mousemove",f,!0),document.addEventListener("mouseup",g,!0),document.addEventListener("keydown",h,!0),document.body.appendChild(e),document.body.appendChild(o)})}async function Xo(t){const e=document.createElement("style");e.textContent=".wn-annotator, .wn-annot-dimmer { display: none !important; }",document.head.appendChild(e);try{await new Promise(g=>requestAnimationFrame(()=>requestAnimationFrame(g)));const n=await window.snapdom.toCanvas(document.body,{scale:1}),o=document.body.getBoundingClientRect(),r=o.width?n.width/o.width:1,i=o.left+window.scrollX,s=o.top+window.scrollY,c=Math.max(0,Math.round((t.x-i)*r)),l=Math.max(0,Math.round((t.y-s)*r)),d=Math.min(n.width-c,Math.max(1,Math.round(t.w*r))),m=Math.min(n.height-l,Math.max(1,Math.round(t.h*r)));if(d<1||m<1)return null;const f=document.createElement("canvas");return f.width=d,f.height=m,f.getContext("2d").drawImage(n,c,l,d,m,0,0,d,m),{canvas:f,w:d,h:m}}finally{e.remove()}}async function Yo(){if(!tn()||a.mode==="screenshot")return;X("screenshot");let t=null;try{t=await Vo()}finally{X(null)}if(!t)return;let e=null;try{e=await Xo(t)}catch(d){console.warn("Uxnote screenshot:",d)}if(!e){Y("Uxnote: could not capture that region");return}const n=await Rt("Comment for this region?");if(!n)return;const{comment:o,priority:r,author:i}=n,s=kt();let c=null;if(L){const d=await new Promise(f=>e.canvas.toBlob(f,"image/png")),m=d?await _o(d,s):null;if(!m){Y("Uxnote: could not send the screenshot to the server");return}c={url:m.url,w:e.w,h:e.h,capturedAt:Date.now()}}else c={dataUrl:e.canvas.toDataURL("image/png"),w:e.w,h:e.h,capturedAt:Date.now()};const l={id:s,type:"screenshot",comment:o.trim(),author:i||a.annotatorName||"",priority:r||"medium",snippet:"",pageUrl:window.location.href,pageKey:M(window.location.href),rect:{x:t.x,y:t.y,w:t.w,h:t.h},screenshot:c,createdAt:Date.now(),status:"active"};a.annotations.push(l),B(),Z(l,null),T()}async function _o(t,e){try{const n=await fetch(Fo(e),{method:"PUT",headers:st({"Content-Type":"image/png"}),body:t});if(!n.ok)throw new Error(`HTTP ${n.status}`);const o=await n.json();return o&&o.url?o:null}catch(n){return console.warn("Uxnote screenshot:",n),null}}function Jo(t){const e=t&&t.screenshot;if(!e)return null;if(e.dataUrl)return e.dataUrl;if(!e.url)return null;try{const n=L?new URL(`${L.url}/`,window.location.href):window.location.href;return new URL(e.url,n).href}catch(n){return e.url}}function Wo(t){const e=document.createElement("div");e.className="wn-shot-lightbox wn-annotator";const n=document.createElement("img");n.src=t,n.alt="The screenshot of this annotation",e.appendChild(n);const o=()=>{document.removeEventListener("keydown",r,!0),e.remove()},r=i=>{i.key==="Escape"&&(i.preventDefault(),o())};e.addEventListener("click",o),document.addEventListener("keydown",r,!0),document.body.appendChild(e)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",de):de(),window.Uxnote={refresh:F,setHidden:t=>ht(!!t),toggleVisibility:()=>ht(!a.hidden),isHidden:()=>!!a.hidden,sync:{pull:Jt,push:Ze,url:()=>L?L.url:null}}})();})();
