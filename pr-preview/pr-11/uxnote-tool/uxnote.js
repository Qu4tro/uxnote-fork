/*
 * Uxnote
 * Author: ninefortyonestudio (https://github.com/ninefortyonestudio)
 * Fork: https://github.com/Qu4tro/uxnote-fork
 * Upstream: https://github.com/ninefortyonestudio/uxnote
 * Version: v2.1.0
 * License: MIT (see LICENSE)
 *
 * This fork stores the annotations on the server named by data-server-url,
 * over the wire protocol of PROTOCOL.md. With no server named it stores them
 * in localStorage, on the browser that wrote them.
 *
 * An annotation can also be a screenshot of a region of the page. Load snapdom
 * (window.snapdom, MIT) before this script to offer the capture button.
 */
(() => {
  if (window.Uxnote) {
    return;
  }

  const script =
    document.currentScript ||
    Array.from(document.querySelectorAll('script')).find((s) =>
      (s.getAttribute('src') || '').includes('annotator.js')
    );
  const getScriptAttr = (name) => (script ? script.getAttribute(name) : null);
  const siteKey = `${location.protocol}//${location.host}`;
  const mailToDefault = (script && (script.dataset.mailto || script.dataset.email || script.dataset.to)) || '';
  const startVisibleAttr =
    getScriptAttr('isToolVisibleAtFirstLaunch') ||
    getScriptAttr('istoolvisibleatfirstlaunch') ||
    (script && (script.dataset.isToolVisibleAtFirstLaunch || script.dataset.istoolvisibleatfirstlaunch));
  const startTopAttr =
    getScriptAttr('isToolOnTopAtLaunch') ||
    getScriptAttr('istoolontopatlaunch') ||
    (script && (script.dataset.isToolOnTopAtLaunch || script.dataset.istoolontopatlaunch));
  const startHiddenAttr =
    script &&
    (script.dataset.hiddentoolbydefault ||
      script.dataset.hidden ||
      script.dataset.collapsed ||
      script.dataset.startHidden ||
      '');
  const globalHighlightColorAttr =
    getScriptAttr('colorForHighlight') ||
    getScriptAttr('colorForHighligh') ||
    (script && (script.dataset.colorForHighlight || script.dataset.colorForHighligh));
  const textHighlightColorAttr =
    getScriptAttr('colorForTextHighligh') ||
    getScriptAttr('colorForTextHighlight') ||
    (script && (script.dataset.colorForTextHighligh || script.dataset.colorForTextHighlight));
  const elementHighlightColorAttr =
    getScriptAttr('colorForElementHighlight') ||
    getScriptAttr('colorForElementHighligh') ||
    (script && (script.dataset.colorForElementHighlight || script.dataset.colorForElementHighligh));
  const defaultHighlightColor = '#4e9cf6';
  const baseHighlightColor = normalizeHexColor(
    globalHighlightColorAttr ||
      elementHighlightColorAttr ||
      textHighlightColorAttr ||
      defaultHighlightColor,
    defaultHighlightColor
  );
  const textHighlightColor = normalizeHexColor(textHighlightColorAttr || baseHighlightColor, baseHighlightColor);
  const elementHighlightColor = normalizeHexColor(elementHighlightColorAttr || baseHighlightColor, baseHighlightColor);
  const colorPalette = {
    text: buildColorSet(textHighlightColor, { overlayAlpha: 0.7, softAlpha: 0.18, softerAlpha: 0.08 }),
    element: buildColorSet(elementHighlightColor, { overlayAlpha: 0.35, softAlpha: 0.12, softerAlpha: 0.04 }),
    screenshot: buildColorSet(baseHighlightColor, { overlayAlpha: 0.35, softAlpha: 0.12, softerAlpha: 0.04 })
  };
  const initialPosition = (() => {
    if (startTopAttr !== null && startTopAttr !== undefined) {
      return parseBoolAttr(startTopAttr, false) ? 'top' : 'bottom';
    }
    return (script && script.dataset.position) || 'bottom';
  })();
  let position = initialPosition;
  const positionStorageKey = 'wn-toolbar-pos';
  const dockMode = (script && (script.dataset.dock || script.dataset.layout)) || '';
  const storageKey = `uxnote:site:${siteKey}`;
  const importFilesStorageKey = `uxnote:import-files:${siteKey}`;
  const visibilityStorageKey = `uxnote:hidden:${siteKey}`;
  const pendingFocusKey = `uxnote:pending:${siteKey}`;
  // A named server is the annotation store; no name at all means localStorage.
  const serverUrl = ((script && script.dataset.serverUrl) || '').trim().replace(/\/+$/, '');
  const server = serverUrl ? { url: serverUrl, apiKey: (script && script.dataset.serverApiKey) || '' } : null;
  const jsonExport = parseBoolAttr(script && script.dataset.jsonExport, true);
  const jsonImport = parseBoolAttr(script && script.dataset.jsonImport, true);
  const mailExport = parseBoolAttr(script && script.dataset.mailExport, true);
  const themeAttr = ((script && script.dataset.theme) || '').trim().toLowerCase();
  const theme = themeAttr === 'light' || themeAttr === 'dark' ? themeAttr : 'auto';
  const darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  // Two axes, read separately. The kind of input decides behaviour: with no
  // hover there is no preview stream and no tooltip, and a finger needs a
  // bigger target than a pointer. The room decides layout density: which
  // controls the bar carries, how wide the panel runs. Width alone answers
  // neither question -- every phone in landscape is wider than 640px, and a
  // narrow desktop window is not a phone.
  // `any-pointer` is deliberately not used: it is true on any laptop with a
  // touchscreen, mouse attached or not, which would strip those machines of
  // the hover preview they can use.
  const touchQuery = window.matchMedia ? window.matchMedia('(pointer: coarse) and (hover: none)') : null;
  const compactQuery = window.matchMedia
    ? window.matchMedia('(max-width: 640px), (max-height: 480px)')
    : null;

  function isTouchInput() {
    if (touchQuery) return touchQuery.matches;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  function isCompactLayout() {
    if (compactQuery) return compactQuery.matches;
    return window.innerWidth <= 640 || window.innerHeight <= 480;
  }

  function subscribeMedia(query, handler) {
    if (!query) return;
    if (query.addEventListener) query.addEventListener('change', handler);
    else if (query.addListener) query.addListener(handler);
  }

  const dimConfigAttr =
    getScriptAttr('isBackdropVisible') ||
    getScriptAttr('isbackdropvisible') ||
    getScriptAttr('backdropVisible') ||
    getScriptAttr('backdropvisible') ||
    (script &&
      (script.dataset.isBackdropVisible ||
        script.dataset.isbackdropvisible ||
        script.dataset.backdropVisible ||
        script.dataset.backdropvisible ||
        script.dataset.dim ||
        script.dataset.dimpage ||
        script.dataset.dimmer ||
        script.dataset.overlay ||
        script.dataset.dimLevel ||
        script.dataset.dimlevel ||
        script.dataset.dimstrength));
  const defaultDimOpacity = 0.2;
  // On a desktop the dimmer frames the tool against the page. On a phone the
  // bar is a strip and the page is the whole screen, so it only costs
  // contrast; a page that asks for it by name still gets it.
  const dimEnabled = parseBoolAttr(dimConfigAttr, !isTouchInput());
  const dimOpacity = dimEnabled ? defaultDimOpacity : 0;

  // Central state (positions, annotations, DOM elements, filters...)
  const state = {
    mode: null,
    annotations: [],
    importFiles: [],
    markers: {},
    highlightSpans: {},
    elementTargets: {},
    outlineBox: null,
    toolbar: null,
    panel: null,
    visibilityToggle: null,
    commentModal: null,
    dialogModal: null,
    importModal: null,
    markerLayer: null,
    syncDot: null,
    syncStatus: null,
    colors: colorPalette,
    customPosition: false,
    dimEnabled,
    dimOpacity,
    dimOverlay: null,
    filters: {
      query: ''
    },
    hidden: false,
    missingObserver: null,
    missingRetryTimer: null,
    layoutObserver: null,
    layoutTimer: null,
    toast: null,
    toastTimer: null
  };

  // Entry point: load config, build UI, restore data
  function init() {
    const savedPos = loadSavedPosition();
    if (savedPos) position = savedPos;
    const savedHidden = loadHiddenState();
    const initialHiddenFromVisible =
      startVisibleAttr !== null && startVisibleAttr !== undefined
        ? !parseBoolAttr(startVisibleAttr, true)
        : null;
    state.hidden =
      savedHidden !== null
        ? savedHidden
        : initialHiddenFromVisible !== null
        ? initialHiddenFromVisible
        : parseBoolAttr(startHiddenAttr, false);
    if (jsonImport) state.importFiles = loadImportFiles();
    captureBasePadding();
    applyColorTheme();
    applyTheme();
    injectStyles();
    createShell();
    createDimmer();
    setAnnotatorVisibility(state.hidden);
    if (server) {
      remotePull();
    } else {
      loadAnnotations();
    }
    restoreAnnotations();
    retryResolveMissingAnnotations();
    startMissingObserver();
    startLayoutObserver();
    if (!server) focusPendingAnnotation();
    bindGlobalHandlers();
  }

  function captureBasePadding() {
    const s = getComputedStyle(document.body);
    state.basePadding = {
      top: parseFloat(s.paddingTop) || 0,
      right: parseFloat(s.paddingRight) || 0,
      bottom: parseFloat(s.paddingBottom) || 0,
      left: parseFloat(s.paddingLeft) || 0
    };
  }

  // Inline style injection keeps the tool self-contained (no external CSS fetch).
  function injectStyles() {
    // Inject scoped CSS to avoid polluting host page
    const style = document.createElement('style');
    style.setAttribute('data-wn-style', 'annotator');
    style.textContent = `
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
        max-width: 92%;
        max-height: 92vh;
        max-height: 92dvh;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.5);
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
    `;
    document.head.appendChild(style);
  }

  // The bar carries a different set of controls on a compact layout, so it is
  // filled by a function that can run again when the form factor changes.
  function buildToolbar() {
    const toolbar = state.toolbar;
    if (!toolbar) return;
    const compact = isCompactLayout();

    const makeButton = (btn) => {
      const b = document.createElement('button');
      b.className = 'wn-annot-btn wn-annotator';
      b.setAttribute('data-action', btn.action);
      if (btn.mode) b.setAttribute('data-mode', btn.mode);
      b.setAttribute('data-tip', btn.tip);
      b.innerHTML = btn.icon;
      return b;
    };

    const makeGroup = (btns) => {
      const g = document.createElement('div');
      g.className = 'wn-annot-group wn-annotator';
      btns.forEach((btn) => g.appendChild(makeButton(btn)));
      return g;
    };

    const makeSpacer = () => {
      const s = document.createElement('div');
      s.className = 'wn-annot-spacer wn-annotator';
      return s;
    };

    // The visibility button belongs to state and is mounted inside the bar on
    // compact, so it comes out before the rebuild and is remounted after.
    const toggle = state.visibilityToggle;
    if (toggle && toggle.parentNode === toolbar) toolbar.removeChild(toggle);
    toolbar.innerHTML = '';

    const frag = document.createDocumentFragment();

    const logo = document.createElement('div');
    logo.className = 'wn-annot-logo wn-annotator';
    logo.innerHTML = iconWordmark();
    frag.appendChild(logo);

    // Only a page with a server has a server to report on. Without one the
    // notes are in this browser and there is nothing the dot could say.
    if (server) {
      const dot = document.createElement('div');
      dot.className = 'wn-annot-sync-dot wn-annotator';
      dot.setAttribute('role', 'status');
      frag.appendChild(dot);
      state.syncDot = dot;
      applySyncStatus();
    }

    const editButtons = [
      { action: 'mode', mode: 'text', tip: 'Highlight text', icon: iconPen() },
      { action: 'mode', mode: 'element', tip: 'Annotate an element', icon: iconTarget() }
    ];
    if (captureAvailable()) {
      editButtons.push({ action: 'mode', mode: 'screenshot', tip: 'Capture a region', icon: iconCamera() });
    }
    // Compact keeps five controls -- hide, highlight, element, camera, notes --
    // so each is a thumb-sized target and none of them scrolls out of reach.
    // Import needs the file on the device and is unusable at this size, the
    // position toggle has no second answer where the bar belongs in thumb
    // reach, and export moves to the panel head. The mail button goes with
    // them: on a phone the export path already opens the system share sheet,
    // which is where a handoff to mail belongs.
    const exportButtons = [];
    if (jsonImport && !compact) exportButtons.push({ action: 'import', tip: 'Import JSON', icon: iconUpload() });
    if (jsonExport && !compact) exportButtons.push({ action: 'export', tip: 'Export JSON', icon: iconDownload() });
    if (mailExport && !compact) exportButtons.push({ action: 'mail', tip: 'Send by mail', icon: iconMail() });
    const controlButtons = [];
    if (!compact) controlButtons.push({ action: 'toggle-pos', tip: 'Toolbar top / bottom', icon: iconSwap() });
    controlButtons.push({ action: 'toggle-panel', tip: 'Show / hide annotations', icon: iconPanel() });

    frag.appendChild(makeSpacer());
    frag.appendChild(makeGroup(editButtons));
    if (exportButtons.length) {
      frag.appendChild(makeSpacer());
      frag.appendChild(makeGroup(exportButtons));
    }
    frag.appendChild(makeSpacer());
    frag.appendChild(makeGroup(controlButtons));

    toolbar.appendChild(frag);
    updatePositionIcon();
    updateToolbarActive();
    updateToggleActive();
    mountVisibilityToggle();
  }

  // One entry point for a change of form factor. The bar's button set differs
  // between the two, so a rotation has to rebuild it, not merely reposition it.
  function applyFormFactor() {
    buildToolbar();
    positionVisibilityToggle();
    positionPanel();
    positionTip();
    positionCommentCard();
    applyPageOffset();
    refreshMarkers();
  }

  function createShell() {
    // Build toolbar, panel, and annotation layers
    const toolbar = document.createElement('div');
    toolbar.className = `wn-annot-toolbar wn-annotator wn-pos-${position}`;
    document.body.appendChild(toolbar);
    state.toolbar = toolbar;
    buildToolbar();

    const panel = document.createElement('div');
    panel.className = 'wn-annot-panel wn-annotator';
    panel.innerHTML = `
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <div class="wn-annot-panel-tools wn-annotator">
            ${
              jsonExport
                ? `<button class="wn-annot-panel-export wn-annotator" type="button">${iconDownload()}<span>Export</span></button>`
                : ''
            }
            <button class="wn-annot-delete-all wn-annotator" type="button">
              ${iconTrash()}<span>All</span>
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
    `;
    if (position === 'left') {
      panel.style.left = '18px';
      panel.style.right = 'auto';
    }
    document.body.appendChild(panel);
    state.panel = panel;
    panel.style.display = 'none';
    const deleteAllBtn = panel.querySelector('.wn-annot-delete-all');
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener('click', async (evt) => {
        evt.stopPropagation();
        await deleteAllAnnotations();
      });
    }
    const panelExportBtn = panel.querySelector('.wn-annot-panel-export');
    if (panelExportBtn) {
      panelExportBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        if (jsonExport) exportAnnotations();
      });
    }

    const markerLayer = document.createElement('div');
    markerLayer.className = 'wn-annot-marker-layer wn-annotator';
    document.body.appendChild(markerLayer);
    state.markerLayer = markerLayer;

    const outline = document.createElement('div');
    outline.className = 'wn-annot-outline wn-annotator';
    outline.style.display = 'none';
    document.body.appendChild(outline);
    state.outlineBox = outline;

    const tip = document.createElement('div');
    tip.className = 'wn-annot-tip wn-annotator';
    tip.textContent = 'Active mode';
    document.body.appendChild(tip);
    state.tip = tip;

    toolbar.addEventListener('click', onToolbarClick);
    renderList();
    applyPageOffset();
    positionPanel();
    positionTip();
    updateToggleActive();
    initFilters();
    createVisibilityToggle();
  }

  function updateDimmer() {
    if (!state.dimOverlay) return;
    state.dimOverlay.classList.toggle('is-visible', !state.hidden);
  }

  function createDimmer() {
    if (!state.dimEnabled || state.dimOverlay) return;
    const dimmer = document.createElement('div');
    dimmer.className = 'wn-annot-dimmer';
    dimmer.setAttribute('aria-hidden', 'true');
    dimmer.style.setProperty('--wn-dim-opacity', String(state.dimOpacity));
    const first = document.body.firstChild;
    if (first) {
      document.body.insertBefore(dimmer, first);
    } else {
      document.body.appendChild(dimmer);
    }
    state.dimOverlay = dimmer;
    updateDimmer();
  }

  function mountVisibilityToggle() {
    if (!state.visibilityToggle) return;
    const btn = state.visibilityToggle;
    const inlineTarget = isCompactLayout() && state.toolbar && !state.hidden;
    const target = inlineTarget ? state.toolbar : document.body;
    if (btn.parentNode !== target) {
      if (btn.parentNode) {
        btn.parentNode.removeChild(btn);
      }
      if (target === state.toolbar) {
        state.toolbar.insertBefore(btn, state.toolbar.firstChild);
      } else {
        document.body.appendChild(btn);
      }
    }
  }

  function createVisibilityToggle() {
    if (state.visibilityToggle) return;
    // Floating toggle to hide/show every annotator element
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wn-annot-visibility-btn wn-annotator';
    btn.setAttribute('aria-label', 'Hide Uxnote');
    btn.setAttribute('data-tip', 'Hide Uxnote');
    btn.innerHTML = iconEyeOpen();
    btn.addEventListener('click', toggleAnnotatorVisibility);
    state.visibilityToggle = btn;
    mountVisibilityToggle();
    positionVisibilityToggle();
    syncVisibilityButton();
  }

  function ensureCommentModal() {
    if (state.commentModal) return state.commentModal;
    const backdrop = document.createElement('div');
    backdrop.className = 'wn-annot-modal-backdrop wn-annotator';
    const modal = document.createElement('div');
    modal.className = 'wn-annot-modal wn-annot-comment-card wn-annotator';

    const title = document.createElement('h4');
    title.textContent = 'Add a comment';

    const textarea = document.createElement('textarea');
    textarea.className = 'wn-annotator';
    textarea.placeholder = 'Your comment...';

    const actions = document.createElement('div');
    actions.className = 'wn-annot-actions wn-annotator';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'wn-annot-pill cancel wn-annotator';
    cancelBtn.textContent = 'Cancel';
    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'wn-annot-pill primary wn-annotator';
    okBtn.textContent = 'Save';

    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    modal.appendChild(title);
    modal.appendChild(textarea);
    modal.appendChild(actions);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    state.commentModal = {
      backdrop,
      modal,
      textarea,
      title,
      okBtn,
      cancelBtn
    };
    return state.commentModal;
  }

  // Park the card against the toolbar, 0.75em clear of it, so the page it is
  // about stays in view while the comment is written.
  function positionCommentCard() {
    const modalState = state.commentModal;
    if (!modalState || !state.toolbar) return;
    if (!modalState.backdrop.classList.contains('show')) return;
    const card = modalState.modal;
    const barRect = state.toolbar.getBoundingClientRect();
    const gap = 0.75 * (parseFloat(getComputedStyle(card).fontSize) || 16);
    card.style.left = `${barRect.left + barRect.width / 2}px`;
    if (position === 'top') {
      card.style.top = `${barRect.bottom + gap}px`;
      card.style.bottom = '';
    } else {
      card.style.top = '';
      card.style.bottom = `${window.innerHeight - barRect.top + gap}px`;
    }
  }

  function askForComment(label, defaultValue = '') {
    return new Promise((resolve) => {
      const modalState = ensureCommentModal();
      const { backdrop, textarea, title, okBtn, cancelBtn } = modalState;
      title.textContent = label || 'Add a comment';
      textarea.value = defaultValue || '';
      textarea.placeholder = 'Your comment...';

      backdrop.classList.add('show');
      positionCommentCard();
      textarea.focus();
      textarea.select();

      const close = (val) => {
        backdrop.classList.remove('show');
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        document.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', positionCommentCard);
        resolve(val);
      };
      const onOk = () => {
        close({ comment: textarea.value.trim() });
      };
      const onCancel = () => close(null);
      const onKey = (evt) => {
        if (evt.key === 'Escape') close(null);
        if (evt.key === 'Enter' && !(evt.shiftKey || evt.altKey)) {
          evt.preventDefault();
          onOk();
        }
      };

      okBtn.textContent = 'Save';
      cancelBtn.textContent = 'Cancel';
      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      document.addEventListener('keydown', onKey);
      window.addEventListener('resize', positionCommentCard);
    });
  }

  async function awaitComment(label) {
    const val = await askForComment(label);
    if (!val) return null;
    return val;
  }

  function ensureImportModal() {
    if (state.importModal) return state.importModal;
    const backdrop = document.createElement('div');
    backdrop.className = 'wn-annot-modal-backdrop wn-annotator';
    const modal = document.createElement('div');
    modal.className = 'wn-annot-modal wn-annotator wn-annot-import-modal';

    const title = document.createElement('h4');
    title.textContent = 'Import JSON files';

    const body = document.createElement('div');
    body.className = 'wn-annot-import-body wn-annotator';

    const dropzone = document.createElement('label');
    dropzone.className = 'wn-annot-import-drop wn-annotator';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    fileInput.multiple = true;
    fileInput.className = 'wn-annotator';
    const dropContent = document.createElement('div');
    const dropTitle = document.createElement('div');
    dropTitle.className = 'wn-annot-import-drop-title wn-annotator';
    dropTitle.textContent = 'Drop JSON files here';
    const dropSub = document.createElement('div');
    dropSub.className = 'wn-annot-import-drop-sub wn-annotator';
    dropSub.textContent = 'or click to select files';
    dropContent.appendChild(dropTitle);
    dropContent.appendChild(dropSub);
    dropzone.appendChild(fileInput);
    dropzone.appendChild(dropContent);

    const filesPanel = document.createElement('div');
    filesPanel.className = 'wn-annot-import-panel wn-annotator';
    const filesTitleRow = document.createElement('div');
    filesTitleRow.className = 'wn-annot-import-title-row wn-annotator';
    const filesTitle = document.createElement('h5');
    filesTitle.textContent = 'Loaded files';
    const filesCount = document.createElement('span');
    filesCount.className = 'wn-annot-import-count wn-annotator';
    filesCount.textContent = '0';
    const filesDesc = document.createElement('p');
    filesDesc.textContent = 'Files are saved automatically.';
    const fileList = document.createElement('div');
    fileList.className = 'wn-annot-import-list wn-annotator';
    filesTitleRow.appendChild(filesTitle);
    filesTitleRow.appendChild(filesCount);
    filesPanel.appendChild(filesTitleRow);
    filesPanel.appendChild(filesDesc);
    filesPanel.appendChild(fileList);

    const actions = document.createElement('div');
    actions.className = 'wn-annot-actions wn-annotator';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'wn-annot-pill cancel wn-annotator';
    closeBtn.textContent = 'Close';
    actions.appendChild(closeBtn);

    body.appendChild(dropzone);
    body.appendChild(filesPanel);
    modal.appendChild(title);
    modal.appendChild(body);
    modal.appendChild(actions);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    const close = () => {
      backdrop.classList.remove('show');
      document.removeEventListener('keydown', onKey);
    };
    const onKey = (evt) => {
      if (evt.key === 'Escape') close();
    };
    const onBackdrop = (evt) => {
      if (evt.target === backdrop) close();
    };

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', onBackdrop);

    ['dragenter', 'dragover'].forEach((evtName) => {
      dropzone.addEventListener(evtName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((evtName) => {
      dropzone.addEventListener(evtName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        dropzone.classList.remove('dragover');
      });
    });
    dropzone.addEventListener('drop', (event) => {
      const files = event.dataTransfer?.files;
      if (files && files.length) {
        handleImportFiles(Array.from(files));
      }
    });

    fileInput.addEventListener('change', (event) => {
      const files = event.target.files;
      if (files && files.length) {
        handleImportFiles(Array.from(files));
      }
      fileInput.value = '';
    });

    fileList.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-import-remove]');
      if (!btn) return;
      removeImportedFile(btn.dataset.importRemove);
    });

    state.importModal = {
      backdrop,
      modal,
      fileInput,
      fileList,
      filesCount,
      onKey,
      close
    };
    return state.importModal;
  }

  function openImportModal() {
    if (!jsonImport) return;
    const modalState = ensureImportModal();
    renderImportModal();
    modalState.backdrop.classList.add('show');
    document.addEventListener('keydown', modalState.onKey);
  }

  function renderImportModal() {
    if (!state.importModal) return;
    const { fileList, filesCount } = state.importModal;
    const { fileCounts } = buildImportSummary();

    fileList.innerHTML = '';
    if (!state.importFiles.length) {
      const empty = document.createElement('div');
      empty.className = 'wn-annot-import-empty wn-annotator';
      empty.textContent = 'No imported files yet.';
      fileList.appendChild(empty);
    } else {
      state.importFiles.forEach((file) => {
        const card = document.createElement('div');
        card.className = 'wn-annot-import-card wn-annotator';

        const meta = document.createElement('div');
        meta.className = 'wn-annot-import-meta wn-annotator';
        const name = document.createElement('div');
        name.className = 'wn-annot-import-name wn-annotator';
        name.textContent = file.name;
        const sub = document.createElement('div');
        sub.className = 'wn-annot-import-sub wn-annotator';
        const count = fileCounts.get(file.id) || 0;
        const urlLabel = file.pageUrl ? ` | ${truncateText(file.pageUrl, 36)}` : '';
        sub.textContent = `${count} comments | ${formatBytes(file.size)}${urlLabel}`;
        meta.appendChild(name);
        meta.appendChild(sub);

        const actions = document.createElement('div');
        actions.className = 'wn-annot-import-actions wn-annotator';
        const badge = document.createElement('div');
        badge.className = 'wn-annot-import-badge wn-annotator';
        badge.textContent = String(count);
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'wn-annot-import-remove wn-annotator';
        removeBtn.dataset.importRemove = file.id;
        removeBtn.textContent = 'x';
        actions.appendChild(badge);
        actions.appendChild(removeBtn);

        card.appendChild(meta);
        card.appendChild(actions);
        fileList.appendChild(card);
      });
    }

    filesCount.textContent = String(state.importFiles.length);
  }

  function buildImportSummary() {
    const fileCounts = new Map();
    state.annotations.forEach((ann) => {
      if (ann.importFileId) {
        fileCounts.set(ann.importFileId, (fileCounts.get(ann.importFileId) || 0) + 1);
      }
    });
    return { fileCounts };
  }

  async function handleImportFiles(files) {
    if (!files || !files.length) return;
    const existingIds = new Set(state.annotations.map((ann) => ann.id));
    let importedCount = 0;
    for (const file of files) {
      const result = await parseImportFile(file, existingIds);
      if (!result) continue;
      const { fileMeta, annotations } = result;
      if (!annotations.length) continue;
      state.importFiles.push(fileMeta);
      state.annotations.push(...annotations);
      importedCount += annotations.length;
    }
    if (!importedCount) {
      renderImportModal();
      return;
    }
    saveAnnotations();
    saveImportFiles();
    clearRenderedAnnotations();
    restoreAnnotations();
    renumberMarkers();
    renderImportModal();
  }

  async function parseImportFile(file, existingIds) {
    let parsed;
    try {
      const text = await file.text();
      parsed = JSON.parse(text);
    } catch (err) {
      await alertDialog(`Invalid JSON in ${file.name}.`, 'Import error');
      return null;
    }

    const annotations = Array.isArray(parsed) ? parsed : parsed.annotations;
    if (!Array.isArray(annotations)) {
      await alertDialog(`Unsupported JSON format in ${file.name}.`, 'Import error');
      return null;
    }

    const payloadCreatedAt = Array.isArray(parsed) ? file.lastModified : parsed.createdAt;
    const pageUrl = Array.isArray(parsed) ? '' : parsed.pageUrl || '';
    const fileId = generateImportFileId();

    const normalized = annotations
      .filter(isStoredAnnotation)
      .map((ann) =>
        normalizeImportedAnnotation(ann, {
          createdAt: payloadCreatedAt,
          pageUrl,
          fileId,
          existingIds
        })
      );

    return {
      fileMeta: {
        id: fileId,
        name: file.name,
        size: file.size,
        pageUrl,
        importedAt: Date.now()
      },
      annotations: normalized
    };
  }

  function normalizeImportedAnnotation(annotation, options) {
    const ann = annotation && typeof annotation === 'object' ? annotation : {};
    const pageUrl = ann.pageUrl || options.pageUrl || window.location.href;
    const id = ensureUniqueImportId(ann.id, options.existingIds);
    const normalized = {
      ...ann,
      id,
      createdAt: ann.createdAt || options.createdAt || Date.now(),
      pageUrl,
      importFileId: options.fileId
    };
    if (!normalized.pageKey) {
      normalized.pageKey = normalizePageKey(pageUrl);
    }
    return normalized;
  }

  function ensureUniqueImportId(id, existingIds) {
    if (id && !existingIds.has(id)) {
      existingIds.add(id);
      return id;
    }
    let next;
    do {
      next = generateId();
    } while (existingIds.has(next));
    existingIds.add(next);
    return next;
  }

  function removeImportedFile(fileId) {
    const nextFiles = state.importFiles.filter((file) => file.id !== fileId);
    if (nextFiles.length === state.importFiles.length) return;
    state.importFiles = nextFiles;
    state.annotations = state.annotations.filter((ann) => ann.importFileId !== fileId);
    saveAnnotations();
    saveImportFiles();
    clearRenderedAnnotations();
    restoreAnnotations();
    renumberMarkers();
    renderImportModal();
  }

  function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, idx);
    return `${value.toFixed(value < 10 && idx > 0 ? 1 : 0)} ${units[idx]}`;
  }

  function truncateText(value, max) {
    if (typeof value !== 'string') return '';
    if (value.length <= max) return value;
    return value.slice(0, max - 3) + '...';
  }

  function ensureDialogModal() {
    if (state.dialogModal) return state.dialogModal;
    const backdrop = document.createElement('div');
    backdrop.className = 'wn-annot-modal-backdrop wn-annotator';
    const modal = document.createElement('div');
    modal.className = 'wn-annot-modal wn-annotator';
    const title = document.createElement('h4');
    title.className = 'wn-annotator';
    const message = document.createElement('div');
    message.className = 'wn-annot-dialog-message wn-annotator';
    const actions = document.createElement('div');
    actions.className = 'wn-annot-actions wn-annotator';
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'wn-annot-pill cancel wn-annotator';
    const okBtn = document.createElement('button');
    okBtn.type = 'button';
    okBtn.className = 'wn-annot-pill primary wn-annotator';

    actions.appendChild(cancelBtn);
    actions.appendChild(okBtn);
    modal.appendChild(title);
    modal.appendChild(message);
    modal.appendChild(actions);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    state.dialogModal = { backdrop, modal, title, message, okBtn, cancelBtn };
    return state.dialogModal;
  }

  function showDialog({ title = 'Information', message = '', okLabel = 'OK', cancelLabel = 'Cancel', dismissOnBackdrop = true }) {
    return new Promise((resolve) => {
      const { backdrop, title: titleEl, message: messageEl, okBtn, cancelBtn } = ensureDialogModal();
      titleEl.textContent = title;
      messageEl.textContent = message;
      okBtn.textContent = okLabel;
      const showCancel = Boolean(cancelLabel);
      cancelBtn.style.display = showCancel ? 'inline-flex' : 'none';
      cancelBtn.textContent = cancelLabel || '';

      const close = (val) => {
        backdrop.classList.remove('show');
        okBtn.removeEventListener('click', onOk);
        cancelBtn.removeEventListener('click', onCancel);
        backdrop.removeEventListener('click', onBackdrop);
        document.removeEventListener('keydown', onKey);
        resolve(val);
      };
      const onOk = () => close(true);
      const onCancel = () => close(false);
      const onBackdrop = (evt) => {
        if (evt.target === backdrop && dismissOnBackdrop) {
          close(false);
        }
      };
      const onKey = (evt) => {
        if (evt.key === 'Escape') close(false);
        if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') onOk();
      };

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      backdrop.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
      backdrop.classList.add('show');
      okBtn.focus();
    });
  }

  async function confirmDialog(message, title = 'Confirmation') {
    return showDialog({ title, message, okLabel: 'Confirm', cancelLabel: 'Cancel' });
  }

  async function alertDialog(message, title = 'Information') {
    await showDialog({ title, message, okLabel: 'OK', cancelLabel: null });
  }

  function bindGlobalHandlers() {
    // Global subscriptions to mouse/keyboard/resize to keep UI in sync
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('touchend', handleTextSelection);
    document.addEventListener('pointerup', handleTextSelection);
    document.addEventListener('mousemove', handleElementHover);
    document.addEventListener('click', handleElementClick, true);
    window.addEventListener('resize', refreshMarkers);
    window.addEventListener('resize', applyPageOffset);
    window.addEventListener('resize', positionPanel);
    window.addEventListener('resize', positionTip);
    window.addEventListener('resize', positionVisibilityToggle);
    window.addEventListener('scroll', refreshMarkers, { passive: true });
    watchRouteChanges();
    // A rotation crosses the compact boundary without always firing a resize
    // the layout functions can read, and the bar's button set differs across
    // it, so both queries are subscribed rather than polled.
    subscribeMedia(touchQuery, applyFormFactor);
    subscribeMedia(compactQuery, applyFormFactor);
    if (theme === 'auto') subscribeMedia(darkQuery, applyTheme);
  }

  function initFilters() {
    // Install the keyword search and re-render on change
    if (!state.panel) return;
    const searchInput = state.panel.querySelector('#wn-filter-search');
    if (!searchInput) return;

    searchInput.value = state.filters.query;

    const trigger = () => {
      state.filters.query = searchInput.value.trim().toLowerCase();
      renderList();
    };

    searchInput.addEventListener('input', trigger);
  }

  function setMode(nextMode, options = {}) {
    const keepOutline = options.keepOutline;
    // Toggle annotation mode and refresh associated UI
    if (state.mode === nextMode) {
      state.mode = null;
      updateToolbarActive();
      hideTip();
      if (!keepOutline) hideOutline();
      return;
    }
    state.mode = nextMode;
    updateToolbarActive();
    showTipForMode(nextMode);
    if (nextMode !== 'element') {
      hideOutline();
    }
  }

  function updateToolbarActive() {
    const buttons = state.toolbar.querySelectorAll('button[data-action="mode"]');
    buttons.forEach((btn) => {
      const mode = btn.getAttribute('data-mode');
      if (mode === state.mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function showTipForMode(mode) {
    let text = '';
    if (mode === 'text') {
      text = 'Select text then release to add a note.';
    } else if (mode === 'element') {
      text = 'Hover an element, click to annotate.';
    }
    if (!text) return hideTip();
    state.tip.textContent = text;
    state.tip.classList.add('show');
    positionTip();
    requestAnimationFrame(positionTip);
    requestAnimationFrame(positionTip);
  }

  function hideTip() {
    state.tip.classList.remove('show');
  }

  function ensureToast() {
    if (state.toast) return state.toast;
    const toast = document.createElement('div');
    toast.className = 'wn-annot-toast wn-annotator';
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    state.toast = toast;
    return toast;
  }

  function showToast(message) {
    if (!message) return;
    const toast = ensureToast();
    toast.textContent = message;
    toast.classList.add('show');
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  function loadSavedPosition() {
    try {
      const saved = localStorage.getItem(positionStorageKey);
      if (saved === 'top' || saved === 'bottom') return saved;
    } catch (err) {
      // ignore
    }
    return null;
  }

  function loadHiddenState() {
    try {
      const saved = localStorage.getItem(visibilityStorageKey);
      if (saved === null || saved === undefined) return null;
      return saved === 'true';
    } catch (err) {
      return null;
    }
  }

  function saveHiddenState(hidden) {
    try {
      localStorage.setItem(visibilityStorageKey, hidden ? 'true' : 'false');
    } catch (err) {
      // ignore
    }
  }

  function applyTheme() {
    const dark = theme === 'dark' || (theme === 'auto' && !!(darkQuery && darkQuery.matches));
    document.documentElement.setAttribute('data-wn-theme', dark ? 'dark' : 'light');
  }

  function applyColorTheme() {
    if (!document || !document.documentElement) return;
    const root = document.documentElement;
    const palette = state.colors || colorPalette;
    const setVar = (key, val) => {
      if (!val) return;
      root.style.setProperty(key, val);
    };
    const text = palette.text;
    const elem = palette.element;
    setVar('--wn-text-highlight', text.base);
    setVar('--wn-text-highlight-overlay', text.overlay);
    setVar('--wn-text-highlight-soft', text.soft);
    setVar('--wn-element-highlight', elem.base);
    setVar('--wn-element-highlight-soft', elem.soft);
    setVar('--wn-element-highlight-soft-end', elem.softer);
    setVar('--wn-element-highlight-strong', elem.strong);
    setVar('--wn-element-highlight-shadow', elem.shadow);
    setVar('--wn-marker-text', elem.text);
  }

  function buildColorSet(hexColor, opts = {}) {
    const base = normalizeHexColor(hexColor, '#000000');
    const softAlpha = opts.softAlpha ?? 0.12;
    const softerAlpha = opts.softerAlpha ?? 0.04;
    const overlayAlpha = opts.overlayAlpha ?? 0.7;
    return {
      base,
      overlay: rgbaFromHex(base, overlayAlpha, rgbaFromHex('#000000', overlayAlpha)),
      soft: rgbaFromHex(base, softAlpha, rgbaFromHex('#000000', softAlpha)),
      softer: rgbaFromHex(base, softerAlpha, rgbaFromHex('#000000', softerAlpha)),
      strong: rgbaFromHex(base, 0.9, base),
      shadow: rgbaFromHex(base, 0.24, 'rgba(0,0,0,0.24)'),
      pill: rgbaFromHex(base, 0.16, 'rgba(0,0,0,0.16)'),
      pillBorder: rgbaFromHex(base, 0.28, 'rgba(0,0,0,0.28)'),
      text: getReadableTextColor(base)
    };
  }

  function normalizeHexColor(val, fallback) {
    const parsed = parseHexColor(val);
    if (parsed) return parsed;
    return parseHexColor(fallback) || '#000000';
  }

  function parseHexColor(val) {
    if (!val || typeof val !== 'string') return null;
    const v = val.trim();
    const match = v.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!match) return null;
    const hex = match[1];
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    return `#${full.toLowerCase()}`;
  }

  function hexToRgb(hex) {
    const clean = parseHexColor(hex);
    if (!clean) return null;
    const int = parseInt(clean.slice(1), 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255
    };
  }

  function rgbaFromHex(hex, alpha = 1, fallback = '') {
    const rgb = hexToRgb(hex);
    if (!rgb) return fallback || '';
    const a = typeof alpha === 'number' && alpha >= 0 && alpha <= 1 ? alpha : 1;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`;
  }

  function getReadableTextColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#0b1622';
    const luminance = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
    return luminance > 160 ? '#0b1622' : '#ffffff';
  }

  function getAnnotationColors(annotation) {
    const palette = state.colors || colorPalette;
    const type = annotation && annotation.type;
    if (type === 'text') return palette.text;
    if (type === 'screenshot') return palette.screenshot;
    return palette.element;
  }

  function applyMarkerPalette(marker, palette) {
    if (!marker || !palette) return;
    marker.style.setProperty('--wn-marker-bg', palette.base);
    marker.style.setProperty('--wn-marker-text', palette.text);
    marker.style.setProperty('--wn-marker-shadow', palette.shadow);
  }

  function applyItemAccent(item, palette) {
    if (!item || !palette) return;
    item.style.setProperty('--wn-item-accent', palette.base);
    item.style.setProperty('--wn-item-accent-strong', palette.strong);
    item.style.setProperty('--wn-item-accent-shadow', palette.shadow);
    item.style.setProperty('--wn-item-accent-soft', palette.soft);
    item.style.setProperty('--wn-item-accent-soft-end', palette.softer);
    item.style.setProperty('--wn-item-number-bg', palette.pill);
    item.style.setProperty('--wn-item-number-border', palette.pillBorder);
  }

  function parseBoolAttr(val, fallback = false) {
    if (val === undefined || val === null || val === '') return fallback;
    const v = String(val).toLowerCase();
    if (v === 'true' || v === '1' || v === 'yes' || v === 'on') return true;
    if (v === 'false' || v === '0' || v === 'no' || v === 'off') return false;
    return fallback;
  }

  function loadImportFiles() {
    try {
      const stored = localStorage.getItem(importFilesStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter((file) => file && typeof file === 'object')
        .map((file) => ({
          id: file.id || generateImportFileId(),
          name: String(file.name || 'Imported file'),
          size: Number(file.size || 0),
          pageUrl: typeof file.pageUrl === 'string' ? file.pageUrl : '',
          importedAt: Number(file.importedAt || 0)
        }));
    } catch (err) {
      return [];
    }
  }

  function saveImportFiles() {
    try {
      localStorage.setItem(importFilesStorageKey, JSON.stringify(state.importFiles || []));
    } catch (err) {
      // ignore storage errors
    }
  }

  function positionTip() {
    if (!state.tip || !state.toolbar) return;
    const barRect = state.toolbar.getBoundingClientRect();
    const tip = state.tip;
    const gap = 10;
    const centerX = barRect.left + barRect.width / 2;
    const isBottom = position === 'bottom';

    tip.style.left = `${centerX}px`;
    tip.style.right = '';
    tip.style.transform = 'translateX(-50%)';
    tip.style.top = '';
    tip.style.bottom = '';

    const tipRect = tip.getBoundingClientRect();

    if (isBottom) {
      const top = Math.max(8, barRect.top - gap - tipRect.height);
      tip.style.top = `${top}px`;
    } else {
      const top = barRect.bottom + gap;
      tip.style.top = `${top}px`;
    }
  }

  function isStoredAnnotation(ann) {
    return !!ann && (ann.type === 'text' || ann.type === 'element' || ann.type === 'screenshot');
  }

  // Local storage helpers
  function loadAnnotations() {
    try {
      const stored = localStorage.getItem(storageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      state.annotations = (parsed || []).filter(isStoredAnnotation);
      // Backward compatibility: add pageKey if missing
      state.annotations.forEach((ann) => {
        if (!ann.pageKey) {
          ann.pageKey = normalizePageKey(ann.pageUrl || window.location.href);
        }
      });
    } catch (err) {
      console.warn('Annotator storage error', err);
      state.annotations = [];
    }
  }

  function saveAnnotations() {
    if (server) {
      syncAnnotations();
      return;
    }
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.annotations));
    } catch (err) {
      console.warn('Annotator storage save error', err);
    }
  }

  async function onToolbarClick(evt) {
    const btn = evt.target.closest('button');
    if (!btn || !btn.classList.contains('wn-annotator')) return;
    const action = btn.getAttribute('data-action');
    if (!action) return;
    if (action === 'mode') {
      const mode = btn.getAttribute('data-mode');
      if (mode === 'screenshot') {
        await captureRegionAnnotation();
        return;
      }
      setMode(mode);
      return;
    }
    if (action === 'export') {
      // Nothing to ask: the file holds every annotation of the site either
      // way, so the press is the answer.
      if (jsonExport) exportAnnotations();
      return;
    }
    if (action === 'import') {
      openImportModal();
      return;
    }
    if (action === 'mail') {
      await emailAnnotations();
      return;
    }
    if (action === 'toggle-panel') {
      togglePanel();
      return;
    }
    if (action === 'toggle-pos') {
      setPosition(position === 'bottom' ? 'top' : 'bottom');
      updatePositionIcon();
      return;
    }
  }

  function togglePanel() {
    const isHidden = state.panel.style.display === 'none';
    // Restore default flex layout when re-opening so the footer stays pinned
    state.panel.style.display = isHidden ? '' : 'none';
    updateToggleActive();
  }

  function toggleAnnotatorVisibility() {
    setAnnotatorVisibility(!state.hidden);
  }

  function setAnnotatorVisibility(hidden) {
    state.hidden = hidden;
    saveHiddenState(hidden);
    document.body.classList.toggle('wn-annot-hidden', hidden);
    if (hidden) {
      setMode(null);
      hideTip();
      hideOutline();
    }
    syncVisibilityButton();
    updateDimmer();
    positionVisibilityToggle();
    applyPageOffset();
    if (!hidden) {
      refreshMarkers();
      positionPanel();
      positionTip();
    }
    document.dispatchEvent(new CustomEvent('uxnote:visibility', { detail: { hidden } }));
  }

  function syncVisibilityButton() {
    if (!state.visibilityToggle) return;
    const label = state.hidden ? 'Show Uxnote' : 'Hide Uxnote';
    state.visibilityToggle.classList.toggle('is-muted', state.hidden);
    state.visibilityToggle.innerHTML = state.hidden ? iconEyeClosed() : iconEyeOpen();
    state.visibilityToggle.setAttribute('aria-label', label);
    state.visibilityToggle.setAttribute('aria-pressed', state.hidden ? 'true' : 'false');
    state.visibilityToggle.setAttribute('data-tip', label);
  }

  function positionVisibilityToggle() {
    const btn = state.visibilityToggle;
    if (!btn) return;
    mountVisibilityToggle();
    const inset = 18;
    if (isCompactLayout()) {
      if (state.hidden) {
        // Clear of the home indicator and of the curve of the screen.
        btn.style.bottom = `max(${inset}px, env(safe-area-inset-bottom))`;
        btn.style.left = `max(${inset}px, env(safe-area-inset-left))`;
        btn.style.top = '';
        btn.style.right = '';
      } else {
        btn.style.top = '';
        btn.style.right = '';
        btn.style.bottom = '';
        btn.style.left = '';
      }
      return;
    }
    btn.style.left = '';
    btn.style.right = '';
    if (position === 'top') {
      btn.style.top = `${inset}px`;
      btn.style.bottom = '';
    } else {
      btn.style.bottom = `${inset}px`;
      btn.style.top = '';
    }
  }

  function updateToggleActive() {
    if (!state.panel || !state.toolbar) return;
    const btn = state.toolbar.querySelector('button[data-action="toggle-panel"]');
    if (!btn) return;
    const hidden = state.panel.style.display === 'none';
    btn.classList.toggle('active', !hidden);
  }

  function positionPanel() {
    if (!state.panel || !state.toolbar) return;
    const p = state.panel;
    const inset = 18;
    const barRect = state.toolbar.getBoundingClientRect();

    if (isCompactLayout()) {
      // Four insets and no width of its own: the box is the viewport, without
      // a 100vw that a horizontally overflowing host page makes wrong, and
      // without a 100vh that iOS Safari measures past its own bottom bar.
      p.style.width = 'auto';
      p.style.height = 'auto';
      p.style.maxHeight = 'none';
      p.style.left = '0';
      p.style.right = '0';
      p.style.top = '0';
      p.style.bottom = '0';
      p.style.borderRadius = '0';
      // Otherwise the heading sits under the status bar and the notch.
      p.style.paddingTop = `max(${inset}px, env(safe-area-inset-top))`;
      p.style.paddingBottom = `max(${inset}px, env(safe-area-inset-bottom))`;
      return;
    }

    p.style.width = `min(360px, calc(100% - ${inset * 2}px))`;
    p.style.maxHeight = `calc(100vh - ${inset * 2}px)`;
    // Where dvh is understood it replaces the line above; where it is not, the
    // assignment is dropped and the vh value stands.
    p.style.maxHeight = `calc(100dvh - ${inset * 2}px)`;
    p.style.left = 'auto';
    p.style.right = `${inset}px`;
    p.style.top = `${inset}px`;
    p.style.bottom = `${inset}px`;
    p.style.height = '';
    p.style.borderRadius = '';
    p.style.paddingTop = '';
    p.style.paddingBottom = '';

    if (position === 'left') {
      p.style.left = `${barRect.width + inset}px`;
      p.style.right = `${inset}px`;
    } else if (position === 'right') {
      p.style.right = `${barRect.width + inset}px`;
      p.style.left = `${inset}px`;
    }
  }

  function setPosition(next) {
    position = next === 'top' ? 'top' : 'bottom';
    const t = state.toolbar;
    if (t) {
      t.classList.remove('wn-pos-top', 'wn-pos-bottom', 'wn-pos-left', 'wn-pos-right');
      t.classList.add(`wn-pos-${position}`);
    }
    try {
      localStorage.setItem(positionStorageKey, position);
    } catch (err) {
      // ignore storage errors
    }
    updatePositionIcon();
    positionVisibilityToggle();
    positionTip();
    positionCommentCard();
    positionPanel();
    applyPageOffset();
  }

  function updatePositionIcon() {
    if (!state.toolbar) return;
    const btn = state.toolbar.querySelector('button[data-action="toggle-pos"]');
    if (!btn) return;
    btn.innerHTML = position === 'top' ? iconToolbarTop() : iconToolbarBottom();
  }

  function applyPageOffset() {
    // Pad the body so the fixed toolbar does not cover content
    if (
      !state.toolbar ||
      state.customPosition ||
      !(dockMode === 'push' || dockMode === 'dock' || dockMode === 'pad' || dockMode === 'true')
    ) {
      return;
    }
    const body = document.body;
    if (!state.basePadding) captureBasePadding();
    const base = state.basePadding;
    if (state.hidden) {
      body.style.paddingTop = `${base.top}px`;
      body.style.paddingRight = `${base.right}px`;
      body.style.paddingBottom = `${base.bottom}px`;
      body.style.paddingLeft = `${base.left}px`;
      return;
    }
    const barRect = state.toolbar.getBoundingClientRect();
    const next = { ...base };
    if (position === 'top') {
      next.top = base.top + barRect.height;
    } else if (position === 'bottom') {
      next.bottom = base.bottom + barRect.height;
    } else if (position === 'left') {
      next.left = base.left + barRect.width;
    } else if (position === 'right') {
      next.right = base.right + barRect.width;
    }
    body.style.paddingTop = `${next.top}px`;
    body.style.paddingRight = `${next.right}px`;
    body.style.paddingBottom = `${next.bottom}px`;
    body.style.paddingLeft = `${next.left}px`;
  }

  // Capture a text selection and convert to annotation (text mode)
  async function handleTextSelection() {
    if (state.mode !== 'text') return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!range) return;
    const isAllowed =
      isAnnotatableTarget(range.commonAncestorContainer) &&
      isAnnotatableTarget(range.startContainer) &&
      isAnnotatableTarget(range.endContainer);
    if (!isAllowed) {
      selection.removeAllRanges();
      showToast('This area is a popup or overlay. It cannot be annotated.');
      return;
    }
    const snippet = selection.toString().trim();
    if (!snippet) return;
    const res = await awaitComment('Comment for this highlight?');
    if (!res) return;
    const { comment } = res;
    const id = generateId();
    const payload = serializeRange(range, snippet);
    const span = applyTextHighlight(range, id);
    selection.removeAllRanges();
    const annotation = {
      id,
      type: 'text',
      target: payload,
      comment: comment.trim(),
      snippet: snippet.slice(0, 180),
      pageUrl: window.location.href,
      pageKey: normalizePageKey(window.location.href),
      createdAt: Date.now(),
      status: 'active'
    };
    state.annotations.push(annotation);
    saveAnnotations();
    addMarkerForAnnotation(annotation, span);
    renderList();
    setMode(null, { keepOutline: true });
  }

  function handleElementHover(evt) {
    if (state.mode !== 'element') return;
    const el = evt.target;
    if (!el || !isAnnotatableTarget(el)) {
      hideOutline();
      return;
    }
    const rect = el.getBoundingClientRect();
    showOutline(rect);
  }

  // Click on a DOM element to mark it and add a comment (element mode)
  async function handleElementClick(evt) {
    if (state.mode !== 'element') return;
    const el = evt.target;
    if (!el || !isAnnotatableTarget(el)) {
      showToast('This area is a popup or overlay. It cannot be annotated.');
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();
    const res = await awaitComment('Comment for this element?');
    if (!res) return;
    const { comment } = res;
    const id = generateId();
    const targetXPath = getXPath(el);
    const targetCss = buildCssSelector(el);
    const rect = el.getBoundingClientRect();
    const annotation = {
      id,
      type: 'element',
      target: { xpath: targetXPath, css: targetCss, tag: el.tagName.toLowerCase() },
      comment: comment.trim(),
      snippet: el.innerText ? el.innerText.trim().slice(0, 120) : el.tagName,
      pageUrl: window.location.href,
      pageKey: normalizePageKey(window.location.href),
      rect: { x: rect.x + window.scrollX, y: rect.y + window.scrollY, w: rect.width, h: rect.height },
      createdAt: Date.now(),
      status: 'active'
    };
    state.annotations.push(annotation);
    saveAnnotations();
    addMarkerForAnnotation(annotation, el);
    applyElementHighlight(el, id);
    renderList();
    setMode(null, { keepOutline: true });
  }

  function unwrapHighlightSpan(span) {
    const parent = span && span.parentNode;
    if (!parent) return;
    while (span.firstChild) {
      parent.insertBefore(span.firstChild, span);
    }
    parent.removeChild(span);
  }

  function getHighlightSpans(id) {
    const entry = state.highlightSpans[id];
    if (!entry) {
      return Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${id}"]`));
    }
    return Array.isArray(entry) ? entry : [entry];
  }

  function clearRenderedAnnotations() {
    // Clean highlights/rectangles/markers on page before reload
    Object.keys(state.highlightSpans || {}).forEach((id) => {
      getHighlightSpans(id).forEach((span) => {
        if (span && span.parentNode) {
          unwrapHighlightSpan(span);
        }
      });
    });
    state.highlightSpans = {};
    Array.from(document.querySelectorAll('.uxnote-textmark[data-uxnote-id], .wn-annot-highlight[data-wn-annot-id]')).forEach((span) => {
      if (span && span.parentNode) {
        unwrapHighlightSpan(span);
      }
    });
    Object.values(state.markers || {}).forEach((entry) => {
      if (entry && entry.el && entry.el.parentNode) {
        entry.el.parentNode.removeChild(entry.el);
      }
    });
    if (state.markerLayer) {
      state.markerLayer.innerHTML = '';
    }
    state.markers = {};
    Object.keys(state.elementTargets || {}).forEach((id) => {
      removeElementHighlight(id);
    });
    state.elementTargets = {};
    Array.from(document.querySelectorAll('.uxnote-annotated[data-uxnote-ids]')).forEach((el) => {
      delete el.dataset.uxnoteIds;
      el.classList.remove('uxnote-annotated');
    });
  }

  function removeRenderedAnnotation(id) {
    const markerEntry = state.markers[id];
    if (markerEntry && markerEntry.el && markerEntry.el.parentNode) {
      markerEntry.el.parentNode.removeChild(markerEntry.el);
    }
    if (markerEntry && markerEntry.frame && markerEntry.frame.parentNode) {
      markerEntry.frame.parentNode.removeChild(markerEntry.frame);
    }
    delete state.markers[id];
    removeElementHighlight(id);

    let highlightSpans = getHighlightSpans(id);
    if (!highlightSpans.length) {
      highlightSpans = Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${id}"]`));
      if (!highlightSpans.length) {
        highlightSpans = Array.from(document.querySelectorAll(`.wn-annot-highlight[data-wn-annot-id="${id}"]`));
      }
    }
    highlightSpans.forEach((span) => {
      if (span) unwrapHighlightSpan(span);
    });
    delete state.highlightSpans[id];
  }

  function renumberMarkers() {
    Object.entries(state.markers).forEach(([id, entry]) => {
      const idx = state.annotations.findIndex((a) => a.id === id);
      if (idx !== -1) {
        entry.el.textContent = idx + 1;
      }
    });
  }

  function showOutline(rect) {
    const o = state.outlineBox;
    o.style.display = 'block';
    o.style.left = `${rect.x + window.scrollX}px`;
    o.style.top = `${rect.y + window.scrollY}px`;
    o.style.width = `${rect.width}px`;
    o.style.height = `${rect.height}px`;
  }

  function hideOutline() {
    state.outlineBox.style.display = 'none';
  }

  function isWithinAnnotator(node) {
    if (!node) return false;
    return (
      (node.classList && node.classList.contains('wn-annotator')) ||
      (node.parentElement && isWithinAnnotator(node.parentElement))
    );
  }

  function isAnnotatableTarget(node) {
    if (!node) return false;
    const el =
      node.nodeType === Node.ELEMENT_NODE
        ? node
        : node.nodeType === Node.DOCUMENT_NODE
        ? document.body
        : node.parentElement;
    if (!el) return false;
    if (isWithinAnnotator(el)) return false;
    if (el.closest) {
      if (el.closest('[data-uxnote-ignore]')) return false;
      if (el.closest('[data-uxnote-allow]')) return true;
      const blocked = el.closest(
        '#uxnote-root, .wn-annotator, dialog, [popover], [role="dialog"], [role="menu"], [role="tooltip"], [aria-modal="true"]'
      );
      if (blocked) return false;
    }
    return true;
  }

  function serializeRange(range, quote) {
    return {
      startXPath: getXPath(range.startContainer),
      startOffset: range.startOffset,
      endXPath: getXPath(range.endContainer),
      endOffset: range.endOffset,
      quote: quote ? String(quote).slice(0, 200) : ''
    };
  }

  function applyTextHighlight(range, id) {
    let spans = [];
    const workingRange = range.cloneRange();
    const textNodes = getTextNodesInRange(workingRange);
    textNodes.forEach((node) => {
      const span = wrapTextNodePortion(
        node,
        {
          start: node === workingRange.startContainer ? workingRange.startOffset : 0,
          end: node === workingRange.endContainer ? workingRange.endOffset : node.length
        },
        id
      );
      if (span) spans.push(span);
    });
    // Fallback: if no spans were created, wrap the whole range in one span
    if (!spans.length) {
      const span = document.createElement('span');
      span.className = 'uxnote-textmark';
      span.dataset.uxnoteId = id;
      span.addEventListener('click', (evt) => {
        evt.stopPropagation();
        focusAnnotation(id);
      });
      const contents = workingRange.extractContents();
      span.appendChild(contents);
      workingRange.insertNode(span);
      spans = [span];
    }
    state.highlightSpans[id] = spans;
    return spans[0];
  }

  function wrapRange(range, id) {
    return applyTextHighlight(range, id);
  }

  function rangeIntersectsNode(range, node) {
    const nodeRange = document.createRange();
    nodeRange.selectNodeContents(node);
    return (
      range.compareBoundaryPoints(Range.END_TO_START, nodeRange) > 0 &&
      range.compareBoundaryPoints(Range.START_TO_END, nodeRange) < 0
    );
  }

  function getTextNodesInRange(range) {
    const nodes = [];
    const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      try {
        if (range.intersectsNode) {
          if (!range.intersectsNode(node)) continue;
        } else if (!rangeIntersectsNode(range, node)) {
          continue;
        }
      } catch (err) {
        if (!rangeIntersectsNode(range, node)) continue;
      }
      nodes.push(node);
    }
    return nodes;
  }

  function wrapTextNodePortion(node, offsets, id) {
    if (!node || !node.parentNode) return null;
    const { start, end } = offsets;
    let textNode = node;
    let localEnd = end;
    if (start > 0) {
      textNode = textNode.splitText(start);
      localEnd = end - start;
    }
    if (localEnd < textNode.length) {
      textNode.splitText(localEnd);
    }
    if (!textNode.parentNode) return null;
    const span = document.createElement('span');
    span.className = 'uxnote-textmark';
    span.dataset.uxnoteId = id;
    span.addEventListener('click', (evt) => {
      evt.stopPropagation();
      focusAnnotation(id);
    });
    textNode.parentNode.insertBefore(span, textNode);
    span.appendChild(textNode);
    return span;
  }

  function isNodeConnected(node) {
    if (!node) return false;
    if (typeof node.isConnected === 'boolean') return node.isConnected;
    return document.body && document.body.contains(node);
  }

  function intersectRect(a, b) {
    if (!a || !b) return null;
    const left = Math.max(a.x, b.x);
    const top = Math.max(a.y, b.y);
    const right = Math.min(a.x + a.width, b.x + b.width);
    const bottom = Math.min(a.y + a.height, b.y + b.height);
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) return null;
    return { x: left, y: top, width, height };
  }

  function getVisibleRect(el) {
    if (!el || !isNodeConnected(el) || !el.getBoundingClientRect) return null;
    let rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    let node = el;
    while (node && node.nodeType === 1) {
      if (node.tagName === 'DETAILS' && !node.open) {
        const summary = node.querySelector('summary');
        if (summary && !summary.contains(el)) return null;
      }
      if (node.hasAttribute && node.hasAttribute('hidden')) return null;
      const ariaHidden = node.getAttribute && node.getAttribute('aria-hidden');
      if (ariaHidden === 'true') return null;
      const style = window.getComputedStyle(node);
      if (
        style.display === 'none' ||
        style.visibility === 'hidden' ||
        style.visibility === 'collapse' ||
        style.opacity === '0'
      ) {
        return null;
      }
      const overflowX = style.overflowX || style.overflow;
      const overflowY = style.overflowY || style.overflow;
      const clipX = overflowX && overflowX !== 'visible';
      const clipY = overflowY && overflowY !== 'visible';
      if (clipX || clipY) {
        const clipRect = node.getBoundingClientRect();
        const next = intersectRect(rect, clipRect);
        if (!next) return null;
        rect = next;
      }
      node = node.parentElement;
    }
    return rect;
  }

  function getStackingContextAncestor(el) {
    let node = el && el.nodeType === 1 ? el : null;
    while (node && node.nodeType === 1 && node !== document.body) {
      const style = window.getComputedStyle(node);
      const z = style.zIndex;
      const hasPosition = style.position !== 'static';
      const createsStacking =
        (hasPosition && z !== 'auto') ||
        style.opacity !== '1' ||
        style.transform !== 'none' ||
        style.filter !== 'none' ||
        style.perspective !== 'none' ||
        style.mixBlendMode !== 'normal' ||
        style.isolation === 'isolate' ||
        (style.willChange && style.willChange !== 'auto') ||
        (style.contain && style.contain !== 'none');
      if (createsStacking) return node;
      node = node.parentElement;
    }
    return document.body;
  }

  function getMarkerHost(anchor) {
    if (!anchor || anchor.nodeType !== 1) return state.markerLayer || document.body;
    const offsetParent = anchor.offsetParent;
    if (offsetParent && offsetParent.nodeType === 1) return offsetParent;
    return getStackingContextAncestor(anchor) || state.markerLayer || document.body;
  }

  function isGlobalMarkerHost(host) {
    return host === document.body || host === state.markerLayer || host === document.documentElement;
  }

  function openContainersForTarget(targetEl) {
    if (!targetEl || targetEl.nodeType !== 1) return false;
    let opened = false;
    let node = targetEl;
    while (node && node.nodeType === 1 && node !== document.body) {
      if (node.tagName === 'DETAILS' && !node.open) {
        node.open = true;
        opened = true;
      }
      if (node.tagName === 'DIALOG' && !node.open) {
        try {
          if (typeof node.showModal === 'function') {
            node.showModal();
          } else if (typeof node.show === 'function') {
            node.show();
          }
          opened = true;
        } catch (err) {
          // ignore
        }
      }
      if (node.hasAttribute && node.hasAttribute('popover')) {
        try {
          if (typeof node.showPopover === 'function') {
            node.showPopover();
            opened = true;
          }
        } catch (err) {
          // ignore
        }
      }
      if (node.hasAttribute && node.hasAttribute('data-uxnote-open')) {
        const selector = node.getAttribute('data-uxnote-open');
        if (selector) {
          const trigger = document.querySelector(selector);
          if (trigger && typeof trigger.click === 'function') {
            trigger.click();
            opened = true;
          }
        }
      }
      const ariaHidden = node.getAttribute && node.getAttribute('aria-hidden');
      if ((node.hasAttribute && node.hasAttribute('hidden')) || ariaHidden === 'true') {
        const id = node.id;
        if (id) {
          const control = document.querySelector(`[aria-controls="${escapeCssIdent(id)}"]`);
          if (control && typeof control.click === 'function') {
            control.click();
            opened = true;
          }
        }
      }
      node = node.parentElement;
    }
    return opened;
  }

  function applyElementHighlight(el, id) {
    if (!el || el.nodeType !== 1) return false;
    const current = el.dataset.uxnoteIds ? el.dataset.uxnoteIds.split(',').filter(Boolean) : [];
    const next = new Set(current);
    next.add(id);
    el.dataset.uxnoteIds = Array.from(next).join(',');
    el.classList.add('uxnote-annotated');
    state.elementTargets[id] = el;
    return true;
  }

  function removeElementHighlight(id) {
    const el = state.elementTargets[id];
    if (!el || el.nodeType !== 1) {
      delete state.elementTargets[id];
      const candidates = Array.from(document.querySelectorAll('[data-uxnote-ids]'));
      candidates.forEach((candidate) => {
        const current = candidate.dataset.uxnoteIds ? candidate.dataset.uxnoteIds.split(',').filter(Boolean) : [];
        if (!current.includes(id)) return;
        const next = current.filter((value) => value !== id);
        if (next.length) {
          candidate.dataset.uxnoteIds = next.join(',');
        } else {
          delete candidate.dataset.uxnoteIds;
          candidate.classList.remove('uxnote-annotated');
        }
      });
      return;
    }
    const current = el.dataset.uxnoteIds ? el.dataset.uxnoteIds.split(',').filter(Boolean) : [];
    const next = current.filter((value) => value !== id);
    if (next.length) {
      el.dataset.uxnoteIds = next.join(',');
    } else {
      delete el.dataset.uxnoteIds;
      el.classList.remove('uxnote-annotated');
    }
    delete state.elementTargets[id];
  }

  function getXPath(node) {
    if (node === document.body) return '/html/body';
    const parts = [];
    while (node && node !== document) {
      let index = 1;
      let sibling = node.previousSibling;
      while (sibling) {
        if (sibling.nodeType === node.nodeType && sibling.nodeName === node.nodeName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      const name = node.nodeType === 3 ? 'text()' : node.nodeName.toLowerCase();
      parts.unshift(`${name}[${index}]`);
      node = node.parentNode;
      if (!node || node.nodeType !== 1) break;
    }
    return '/' + parts.join('/');
  }

  function escapeCssIdent(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }
    return String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function buildCssSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    if (el.id) return `#${escapeCssIdent(el.id)}`;
    const parts = [];
    let node = el;
    let depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      let part = node.tagName.toLowerCase();
      const classes = Array.from(node.classList || []).filter(
        (name) => name && !name.startsWith('wn-') && !name.startsWith('uxnote-')
      );
      if (classes.length) {
        part += `.${classes.slice(0, 2).map(escapeCssIdent).join('.')}`;
      }
      parts.unshift(part);
      if (node.parentElement && node.parentElement.id) {
        parts.unshift(`#${escapeCssIdent(node.parentElement.id)}`);
        break;
      }
      node = node.parentElement;
      depth += 1;
    }
    return parts.join(' > ');
  }

  function findNodeByXPath(xpath) {
    try {
      const doc = document;
      const result = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
      return result.singleNodeValue;
    } catch (err) {
      return null;
    }
  }

  function restoreAnnotations() {
    state.annotations.forEach((ann) => {
      if (ann.pageKey === normalizePageKey(window.location.href)) {
        renderAnnotation(ann);
      }
    });
    renderList();
  }

  function renderAnnotation(annotation) {
    const resolved = resolveTarget(annotation);
    if (!resolved) {
      annotation.status = 'missing';
      startMissingObserver();
      return;
    }
    annotation.status = 'active';
    renderResolvedAnnotation(annotation, resolved);
  }

  function renderResolvedAnnotation(annotation, resolved) {
    if (!resolved) return;
    if (resolved.type === 'screenshot') {
      addMarkerForAnnotation(annotation, null);
      return;
    }
    if (resolved.type === 'text' && resolved.range) {
      const span = applyTextHighlight(resolved.range, annotation.id);
      addMarkerForAnnotation(annotation, span);
      return;
    }
    if (resolved.type === 'element' && resolved.el) {
      applyElementHighlight(resolved.el, annotation.id);
      addMarkerForAnnotation(annotation, resolved.el);
    }
  }

  function deserializeRange(payload) {
    if (!payload) return null;
    const startNode = findNodeByXPath(payload.startXPath);
    const endNode = findNodeByXPath(payload.endXPath);
    if (!startNode || !endNode) return null;
    try {
      const range = document.createRange();
      range.setStart(startNode, payload.startOffset);
      range.setEnd(endNode, payload.endOffset);
      return range;
    } catch (err) {
      return null;
    }
  }

  function resolveTarget(annotation) {
    if (!annotation) return null;
    if (annotation.type === 'screenshot') {
      return annotation.rect ? { type: 'screenshot' } : null;
    }
    if (!annotation.target) return null;
    if (annotation.type === 'text') {
      return resolveTextTarget(annotation);
    }
    if (annotation.type === 'element') {
      return resolveElementTarget(annotation);
    }
    return null;
  }

  function resolveTextTarget(annotation) {
    const payload = annotation.target || {};
    const range = deserializeRange(payload);
    if (range) return { type: 'text', range };
    const quote = payload.quote || annotation.snippet || '';
    if (!quote) return null;
    const fallback = findRangeByQuote(quote);
    if (!fallback) return null;
    return { type: 'text', range: fallback };
  }

  function findRangeByQuote(quote) {
    const text = String(quote || '').trim();
    if (!text || text.length < 4) return null;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue || !node.nodeValue.trim()) continue;
      if (!isAnnotatableTarget(node)) continue;
      const idx = node.nodeValue.indexOf(text);
      if (idx === -1) continue;
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + text.length);
      return range;
    }
    return null;
  }

  function resolveElementTarget(annotation) {
    const target = annotation.target || {};
    if (target.xpath) {
      const node = findNodeByXPath(target.xpath);
      if (node && node.nodeType === 1) return { type: 'element', el: node };
    }
    if (target.css) {
      try {
        const node = document.querySelector(target.css);
        if (node && node.nodeType === 1) return { type: 'element', el: node };
      } catch (err) {
        // ignore invalid selector
      }
    }
    const tag = target.tag;
    const snippet = (annotation.snippet || '').trim();
    if (tag && snippet) {
      const nodes = document.querySelectorAll(tag);
      for (const node of nodes) {
        if (!node || node.nodeType !== 1) continue;
        if ((node.textContent || '').includes(snippet)) {
          return { type: 'element', el: node };
        }
      }
    }
    return null;
  }

  function scheduleMissingRetry() {
    if (state.missingRetryTimer) {
      clearTimeout(state.missingRetryTimer);
    }
    state.missingRetryTimer = setTimeout(() => {
      retryResolveMissingAnnotations();
    }, 300);
  }

  function startMissingObserver() {
    if (state.missingObserver || !window.MutationObserver) return;
    state.missingObserver = new MutationObserver(() => {
      if (!state.annotations.some((ann) => ann.status === 'missing')) return;
      scheduleMissingRetry();
    });
    state.missingObserver.observe(document.body, { childList: true, subtree: true });
  }

  function stopMissingObserver() {
    if (!state.missingObserver) return;
    state.missingObserver.disconnect();
    state.missingObserver = null;
  }

  function retryResolveMissingAnnotations() {
    let changed = false;
    state.annotations.forEach((ann) => {
      if (ann.status !== 'missing') return;
      if (ann.pageKey !== normalizePageKey(window.location.href)) return;
      const resolved = resolveTarget(ann);
      if (!resolved) return;
      ann.status = 'active';
      renderResolvedAnnotation(ann, resolved);
      changed = true;
    });
    if (changed) {
      saveAnnotations();
      renderList();
      refreshMarkers();
    }
    if (!state.annotations.some((ann) => ann.status === 'missing')) {
      stopMissingObserver();
    }
  }

  function reconcileTextAnnotations() {
    let changed = false;
    state.annotations.forEach((ann) => {
      if (ann.type !== 'text') return;
      if (ann.pageKey !== normalizePageKey(window.location.href)) return;
      const spans = getHighlightSpans(ann.id).filter(isNodeConnected);
      if (spans.length) {
        state.highlightSpans[ann.id] = spans;
        if (ann.status === 'missing') {
          ann.status = 'active';
          changed = true;
        }
        return;
      }
      const resolved = resolveTarget(ann);
      if (resolved && resolved.range) {
        applyTextHighlight(resolved.range, ann.id);
        ann.status = 'active';
        changed = true;
        return;
      }
      if (ann.status !== 'missing') {
        ann.status = 'missing';
        changed = true;
      }
    });
    if (changed) {
      saveAnnotations();
      renderList();
      refreshMarkers();
    }
  }

  function scheduleLayoutRefresh() {
    if (state.layoutTimer) clearTimeout(state.layoutTimer);
    state.layoutTimer = setTimeout(() => {
      refreshMarkers();
      reconcileTextAnnotations();
      if (state.annotations.some((ann) => ann.status === 'missing')) {
        retryResolveMissingAnnotations();
      }
    }, 120);
  }

  function startLayoutObserver() {
    if (state.layoutObserver || !window.MutationObserver) return;
    state.layoutObserver = new MutationObserver((mutations) => {
      const relevant = mutations.some((mutation) => {
        const target = mutation.target;
        if (!target) return false;
        if (target.classList && target.classList.contains('wn-annotator')) return false;
        if (target.closest && target.closest('.wn-annotator')) return false;
        return true;
      });
      if (!relevant) return;
      scheduleLayoutRefresh();
    });
    state.layoutObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'open', 'hidden', 'aria-hidden']
    });
  }

  function addMarkerForAnnotation(annotation, targetNode) {
    if (annotation.pageKey !== normalizePageKey(window.location.href)) return;
    if (!state.markerLayer) return;
    const existingMarker = state.markers[annotation.id];
    if (existingMarker && existingMarker.el && existingMarker.el.parentNode) {
      existingMarker.el.parentNode.removeChild(existingMarker.el);
    }
    const marker = document.createElement('div');
    marker.className = 'wn-annot-marker wn-annotator';
    marker.textContent = state.annotations.findIndex((a) => a.id === annotation.id) + 1;
    marker.dataset.wnAnnotId = annotation.id;
    const palette = getAnnotationColors(annotation);
    applyMarkerPalette(marker, palette);
    marker.addEventListener('click', () => focusAnnotation(annotation.id));
    const rect = getViewportRect(annotation, targetNode);
    const frame = syncShotFrame(annotation, rect);
    const host = getMarkerHost(rect && rect.anchor ? rect.anchor : targetNode);
    if (marker.parentNode !== host) {
      host.appendChild(marker);
    }
    marker.style.zIndex = isGlobalMarkerHost(host) ? '' : '9999';
    if (!rect) {
      marker.style.display = 'none';
      state.markers[annotation.id] = { el: marker, rect: null, frame };
      return;
    }
    marker.style.display = '';
    positionMarker(marker, rect, annotation);
    state.markers[annotation.id] = { el: marker, rect, frame };
  }

  // A region has no node to anchor on, so the frame is what shows on the page
  // where the picture was taken. It lives in the marker layer, which the
  // visibility toggle takes off the page and a capture leaves out of its copy.
  function syncShotFrame(annotation, rect) {
    const entry = state.markers[annotation.id];
    let frame = entry ? entry.frame : null;
    if (annotation.type !== 'screenshot' || !rect) {
      if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
      return null;
    }
    if (!frame) {
      frame = document.createElement('div');
      frame.className = 'wn-annot-shot-frame wn-annotator';
    }
    const host = state.markerLayer || document.body;
    if (frame.parentNode !== host) host.appendChild(frame);
    frame.style.setProperty('--wn-shot-frame', getAnnotationColors(annotation).base);
    frame.style.left = `${rect.x}px`;
    frame.style.top = `${rect.y}px`;
    frame.style.width = `${rect.w}px`;
    frame.style.height = `${rect.h}px`;
    return frame;
  }

  function getViewportRect(annotation, targetNode) {
    if (annotation.type === 'text') {
      const spans = targetNode ? [targetNode] : getHighlightSpans(annotation.id);
      const span = spans[0] || document.querySelector(`.uxnote-textmark[data-uxnote-id="${annotation.id}"]`);
      if (!span) return null;
      const r = getVisibleRect(span);
      if (!r) return null;
      return { x: r.x, y: r.y, w: r.width, h: r.height, anchor: span };
    }
    if (annotation.type === 'element') {
      const el =
        (targetNode && targetNode.nodeType === 1 ? targetNode : null) ||
        state.elementTargets[annotation.id] ||
        (annotation.target?.xpath ? findNodeByXPath(annotation.target.xpath) : null);
      if (!el) return null;
      const r = getVisibleRect(el);
      if (!r) return null;
      return { x: r.x, y: r.y, w: r.width, h: r.height, anchor: el };
    }
    if (annotation.type === 'screenshot') {
      const r = annotation.rect;
      if (!r) return null;
      return { x: r.x - window.scrollX, y: r.y - window.scrollY, w: r.w, h: r.h, anchor: null };
    }
    return null;
  }

  function positionMarker(marker, rect, annotation) {
    const offset = getMarkerOffset(annotation);
    const offsetParent = marker.offsetParent || document.body;
    const parentRect = offsetParent.getBoundingClientRect();
    const parentDocX = parentRect.x + window.scrollX;
    const parentDocY = parentRect.y + window.scrollY;
    const targetDocX = rect.x + window.scrollX;
    const targetDocY = rect.y + window.scrollY;
    const left = targetDocX - parentDocX + rect.w + offset.x + 4;
    // The marker is centred on `left`, so it parks half its width past the
    // right edge of its target. On a block that runs the full width of the
    // screen that half hangs outside the document, which widens the document
    // -- and a wider document moves every fixed element on the page, the
    // toolbar included. It is a touch-sized marker that makes this bite.
    const bound = isGlobalMarkerHost(offsetParent)
      ? document.documentElement.clientWidth
      : offsetParent.clientWidth;
    const half = (marker.offsetWidth || 25) / 2;
    marker.style.left = `${bound ? Math.min(left, bound - half - 2) : left}px`;
    marker.style.top = `${targetDocY - parentDocY + offset.y - 4}px`;
  }

  function getMarkerOffset(annotation) {
    if (annotation.type !== 'element') return { x: 0, y: 0 };
    const target = annotation.target && annotation.target.xpath;
    if (!target) return { x: 0, y: 0 };
    const group = state.annotations.filter(
      (ann) =>
        ann.type === 'element' &&
        ann.pageKey === annotation.pageKey &&
        ann.target &&
        ann.target.xpath === target
    );
    if (group.length <= 1) return { x: 0, y: 0 };
    const index = group.findIndex((ann) => ann.id === annotation.id);
    if (index <= 0) return { x: 0, y: 0 };
    const gap = 24;
    return { x: -index * gap, y: 0 };
  }


  function refreshMarkers() {
    Object.entries(state.markers).forEach(([id, entry]) => {
      const ann = state.annotations.find((a) => a.id === id);
      if (!ann) return;
      const rect = ann.status === 'missing' ? null : getViewportRect(ann);
      entry.frame = syncShotFrame(ann, rect);
      if (!rect) {
        entry.el.style.display = 'none';
        entry.rect = null;
        return;
      }
      entry.el.style.display = '';
      entry.rect = rect;
      const host = getMarkerHost(rect.anchor);
      if (entry.el.parentNode !== host) {
        host.appendChild(entry.el);
      }
      entry.el.style.zIndex = isGlobalMarkerHost(host) ? '' : '9999';
      positionMarker(entry.el, rect, ann);
      applyMarkerPalette(entry.el, getAnnotationColors(ann));
    });
  }

  function ensurePanelVisible() {
    if (!state.panel) return;
    const isHidden = state.panel.style.display === 'none';
    if (isHidden) {
      state.panel.style.display = '';
      updateToggleActive();
    }
  }

  function focusListItem(id) {
    if (!state.panel) return;
    ensurePanelVisible();
    const list = state.panel.querySelector('.wn-annot-list');
    if (!list) return;
    const items = list.querySelectorAll('.wn-annot-item');
    items.forEach((el) => el.classList.remove('is-focused'));
    const target = list.querySelector(`.wn-annot-item[data-id="${id}"]`);
    if (!target) return;
    target.classList.add('is-focused');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Scroll/flash the target when selecting from the list or marker
  function focusAnnotation(id, allowNavigate = false, targetUrl, targetPageKey) {
    const ann = state.annotations.find((a) => a.id === id);
    if (!ann) return;
    focusListItem(id);
    if (ann.status === 'missing') {
      const resolved = resolveTarget(ann);
      if (resolved) {
        ann.status = 'active';
        renderResolvedAnnotation(ann, resolved);
        renderList();
      } else {
        showToast('This annotation is not on this page.');
        return;
      }
    }
    const resolved = resolveTarget(ann);
    if (resolved) {
      const targetEl =
        resolved.type === 'element'
          ? resolved.el
          : resolved.range && resolved.range.commonAncestorContainer
          ? resolved.range.commonAncestorContainer.parentElement
          : null;
      if (targetEl && openContainersForTarget(targetEl)) {
        setTimeout(() => {
          refreshMarkers();
        }, 160);
      }
    }
    const samePage = (targetPageKey || ann.pageKey) === normalizePageKey(window.location.href);
    if (!samePage && allowNavigate) {
      try {
        localStorage.setItem(pendingFocusKey, JSON.stringify({ id: ann.id, pageKey: ann.pageKey, pageUrl: targetUrl || ann.pageUrl }));
      } catch (err) {
        // ignore
      }
      window.location.href = targetUrl || ann.pageUrl || window.location.href;
      return;
    }
    if (ann.type === 'text') {
      const spans =
        getHighlightSpans(id) ||
        Array.from(document.querySelectorAll(`.uxnote-textmark[data-uxnote-id="${id}"]`));
      const span = spans[0];
      if (span) {
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flash(span, getAnnotationColors(ann).base);
      }
    } else if (ann.type === 'element') {
      const el = resolved && resolved.el ? resolved.el : ann.target?.xpath ? findNodeByXPath(ann.target.xpath) : null;
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flash(el, getAnnotationColors(ann).base);
      }
    } else if (ann.type === 'screenshot' && ann.rect) {
      window.scrollTo({
        top: Math.max(0, ann.rect.y + ann.rect.h / 2 - window.innerHeight / 2),
        behavior: 'smooth'
      });
      const entry = state.markers[ann.id];
      if (entry && entry.frame) flash(entry.frame, getAnnotationColors(ann).base);
    }
  }

  function flash(el, accentColor) {
    el.style.transition = 'box-shadow 0.2s ease';
    const prev = el.style.boxShadow;
    const accent = accentColor || (state.colors?.element?.base || '#4e9cf6');
    const flashColor = rgbaFromHex(accent, 0.6, 'rgba(78,156,246,0.6)');
    el.style.boxShadow = `0 0 0 3px ${flashColor}`;
    setTimeout(() => {
      el.style.boxShadow = prev;
    }, 800);
  }

  function ensureFooter() {
    if (!state.panel) return null;
    let footer = state.panel.querySelector('.wn-annot-footer');
    if (!footer) {
      footer = document.createElement('div');
      footer.className = 'wn-annot-footer wn-annotator';
      const link = document.createElement('a');
      link.href = 'https://github.com/Qu4tro/uxnote-fork';
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      link.textContent = 'uxnote-fork on GitHub';
      footer.appendChild(link);
      state.panel.appendChild(footer);
    }
    return footer;
  }


  // Rebuild the side panel list with filtering and numbering
  function renderList() {
    const list = state.panel.querySelector('.wn-annot-list');
      const title = state.panel.querySelector('h3');
      list.innerHTML = '';
      if (!state.annotations.length) {
        const empty = document.createElement('div');
        empty.className = 'wn-annot-empty';
      empty.textContent = 'No annotations yet.';
      list.appendChild(empty);
      if (title) title.textContent = 'Annotations (0)';
      const footer = ensureFooter();
      return;
    }
    const filtered = state.annotations
      .slice()
      .sort((a, b) => a.createdAt - b.createdAt)
      .filter((ann) => {
        const q = state.filters.query;
        const haystack = `${ann.comment || ''} ${ann.snippet || ''}`.toLowerCase();
        return !q || haystack.includes(q);
  });
    if (title) title.textContent = `Annotations (${filtered.length})`;
    filtered.forEach((ann, idx) => {
      const item = document.createElement('div');
      item.className = 'wn-annot-item';
      item.dataset.id = ann.id;
      applyItemAccent(item, getAnnotationColors(ann));

      const top = document.createElement('div');
      top.className = 'wn-annot-card-top';
      const topLeft = document.createElement('div');
      topLeft.className = 'wn-annot-card-top-left';
      const number = document.createElement('div');
      number.className = 'wn-annot-number';
      number.textContent = `#${idx + 1}`;
      topLeft.appendChild(number);
      if (ann.status === 'missing') {
        const missing = document.createElement('div');
        missing.className = 'wn-annot-missing';
        missing.textContent = 'Missing';
        topLeft.appendChild(missing);
      }
      const topRight = document.createElement('div');
      topRight.className = 'wn-annot-card-top-right';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'wn-annot-edit wn-annotator';
      editBtn.setAttribute('aria-label', 'Edit this annotation');
      editBtn.innerHTML = iconEdit();
      editBtn.addEventListener('click', async (evt) => {
        evt.stopPropagation();
        await editAnnotation(ann.id);
      });
      topRight.appendChild(editBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'wn-annot-delete wn-annotator';
      deleteBtn.setAttribute('aria-label', 'Delete this annotation');
      deleteBtn.innerHTML = iconTrash();
      deleteBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        deleteAnnotation(ann.id);
      });
      topRight.appendChild(deleteBtn);
      top.appendChild(topLeft);
      top.appendChild(topRight);
      const comment = document.createElement('div');
      comment.className = 'wn-annot-comment';
      const commentText = ann.comment || '—';
      comment.textContent = commentText;

      const meta = document.createElement('div');
      meta.className = 'wn-annot-meta';
      const createdAt = new Date(ann.createdAt);
      const createdAtDate = createdAt.toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const createdAtTime = createdAt.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
      meta.textContent = `${createdAtDate} • ${createdAtTime}`;
      topLeft.appendChild(meta);

      const showMore = document.createElement('button');
      showMore.type = 'button';
      showMore.className = 'wn-annot-showmore wn-annotator';
      showMore.textContent = 'See more';
      showMore.addEventListener('click', (evt) => {
        evt.stopPropagation();
        const expanded = comment.classList.toggle('expanded');
        showMore.textContent = expanded ? 'See less' : 'See more';
      });
      if (commentText.length < 160) {
        showMore.style.display = 'none';
      }

      item.appendChild(top);
      item.appendChild(comment);
      const shotSrc = screenshotSrc(ann);
      if (shotSrc) {
        const shotWrap = document.createElement('div');
        shotWrap.className = 'wn-annot-shot';
        const shotImg = document.createElement('img');
        shotImg.src = shotSrc;
        shotImg.alt = 'The screenshot of this annotation';
        shotImg.addEventListener('click', (evt) => {
          evt.stopPropagation();
          openScreenshotLightbox(shotSrc);
        });
        shotWrap.appendChild(shotImg);
        item.appendChild(shotWrap);
      }
      item.appendChild(showMore);
      item.addEventListener('click', () => {
        focusAnnotation(ann.id, true, ann.pageUrl, ann.pageKey);
        if (isCompactLayout() && state.panel) {
          state.panel.style.display = 'none';
          updateToggleActive();
        }
      });
      list.appendChild(item);
    });

    ensureFooter();
  }

  function deleteAnnotation(id) {
    const idx = state.annotations.findIndex((a) => a.id === id);
    if (idx === -1) return;
    state.annotations.splice(idx, 1);
    saveAnnotations();
    removeRenderedAnnotation(id);
    renderList();
    renumberMarkers();
    refreshMarkers();
  }

  async function editAnnotation(id) {
    const ann = state.annotations.find((a) => a.id === id);
    if (!ann) return;
    const res = await askForComment('Edit this annotation', ann.comment || '');
    if (!res) return;
    const { comment } = res;
    ann.comment = comment.trim();
    saveAnnotations();
    renderList();
  }

  async function deleteAllAnnotations() {
    if (!state.annotations.length) return;
    const confirmDelete = await confirmDialog('Delete all annotations?', 'Delete');
    if (!confirmDelete) return;
    state.annotations = [];
    if (server) {
      remoteDeleteAll();
    } else {
      saveAnnotations();
    }
    clearRenderedAnnotations();
    renderList();
    renumberMarkers();
  }

  function exportAnnotations() {
    // Export local annotations to a JSON file named with site and time
    const payload = buildAnnotationsPayload();
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = buildFilename();
    a.click();
    URL.revokeObjectURL(url);
  }

  function buildAnnotationsPayload(annotations = state.annotations) {
    return {
      pageUrl: window.location.href,
      createdAt: Date.now(),
      annotations
    };
  }

  async function emailAnnotations() {
    sendAnnotationsByMail(state.annotations);
  }

  function sendAnnotationsByMail(annotations) {
    const payload = buildAnnotationsPayload(annotations);
    const data = JSON.stringify(payload, null, 2);
    const subject = encodeURIComponent(buildFilename());
    const body = encodeURIComponent(data);
    const to = (mailToDefault || '').trim();
    const toPart = to ? encodeURIComponent(to) : '';
    const sep = toPart ? '?' : '?';
    window.location.href = `mailto:${toPart}${sep}subject=${subject}&body=${body}`;
  }

  function generateId() {
    return 'wn-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  }

  function generateImportFileId() {
    return 'imp-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  }

  function buildFilename() {
    // Construit un nom de fichier lisible : titre/host + date + heure (sans secondes)
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const date = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}`;
    const time = `${pad(now.getHours())}-${pad(now.getMinutes())}`;
    const rawTitle = (document.title || '').trim();
    const slugify = (str) =>
      str
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/^-+|-+$/g, '') || 'annotations';
    let base;
    if (rawTitle) {
      base = `${slugify(rawTitle)}-annotations`;
    } else if (window.location && window.location.hostname) {
      base = `${slugify(window.location.hostname)}-annotations`;
    } else {
      base = 'annotations';
    }
    return `${base}_${date}_${time}.json`;
  }

  // Icons: inline Tabler icons (MIT) for UI and inline Uxnote logo.
  const iconSvg = (paths) => `
    <svg class="wn-annot-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      ${paths}
    </svg>
  `;
  function iconWordmark() {
    return `
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
    `;
  }
  function iconPen() {
    return iconSvg(`
      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
      <path d="M13.5 6.5l4 4" />
      <circle cx="6.1" cy="17.9" r="1.1" fill="#000" stroke="none" />
    `);
  }
  function iconTarget() {
    return iconSvg(`
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M12 3v3" />
      <path d="M12 18v3" />
      <path d="M3 12h3" />
      <path d="M18 12h3" />
    `);
  }
  function iconDownload() {
    return iconSvg(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 11l5 5l5 -5" />
      <path d="M12 4l0 12" />
    `);
  }
  function iconUpload() {
    return iconSvg(`
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
      <path d="M7 9l5 -5l5 5" />
      <path d="M12 4l0 12" />
    `);
  }
  function iconMail() {
    return iconSvg(`
      <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10" />
      <path d="M3 7l9 6l9 -6" />
    `);
  }
  function iconCamera() {
    return iconSvg(`
      <path d="M4 9a2 2 0 0 1 2 -2h1.4l1.6 -2h6l1.6 2h1.4a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-8" />
      <circle cx="12" cy="13" r="3.2" />
    `);
  }
  function iconEdit() {
    return iconPen();
  }
  function iconTrash() {
    return `
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
    `;
  }
  function iconPanel() {
    return iconSvg(`
      <path d="M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12" />
      <path d="M15 4l0 16" />
    `);
  }
  function iconToolbarTop() {
    return iconSvg(`
      <rect x="0.5" y="3" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 10l0 12" />
      <path d="M7 17l5 5l5 -5" />
    `);
  }
  function iconToolbarBottom() {
    return iconSvg(`
      <rect x="0.5" y="17" width="23" height="4" rx="2" fill="currentColor" stroke="none" />
      <path d="M12 14l0 -12" />
      <path d="M7 7l5 -5l5 5" />
    `);
  }
  function iconSwap() {
    return position === 'top' ? iconToolbarTop() : iconToolbarBottom();
  }
  function iconEyeOpen() {
    return `
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
    `;
  }
  function iconEyeClosed() {
    return `
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
    `;
  }

  function normalizePageKey(url) {
    try {
      const u = new URL(url, window.location.href);
      return `${u.origin}${u.pathname}`;
    } catch (err) {
      return `${window.location.origin}${window.location.pathname}`;
    }
  }

  function focusPendingAnnotation() {
    try {
      const raw = localStorage.getItem(pendingFocusKey);
      if (!raw) return;
      const pending = JSON.parse(raw);
      if (pending.pageKey === normalizePageKey(window.location.href)) {
        focusAnnotation(pending.id, false);
      }
      localStorage.removeItem(pendingFocusKey);
    } catch (err) {
      // ignore
    }
  }

  // ------------------------------------------------------------------
  // Server sync
  // ------------------------------------------------------------------

  // The set that the server last agreed to. Each change is diffed against it
  // and travels as one request per annotation, so a note that another reviewer
  // changed survives a change made here to a different note. PROTOCOL.md holds
  // the contract.
  let syncedSnapshot = new Map();
  let syncQueue = Promise.resolve();
  let syncWarned = false;

  // One line per state, because a single line covering three of them tells a
  // reviewer nothing about the one they are looking at.
  const SYNC_STATUS_TIPS = {
    pending: 'Checking the server',
    ok: 'Server connected',
    refused: 'Server refused it: check the address or the key',
    unreachable: 'Server unreachable: notes stay in this browser'
  };

  function applySyncStatus() {
    const dot = state.syncDot;
    if (!dot) return;
    const status = state.syncStatus || 'pending';
    const tip = SYNC_STATUS_TIPS[status];
    dot.setAttribute('data-sync-status', status);
    dot.setAttribute('data-tip', tip);
    dot.setAttribute('aria-label', tip);
  }

  function setSyncStatus(next) {
    if (state.syncStatus === next) return;
    state.syncStatus = next;
    applySyncStatus();
  }

  // Three answers the dot can carry, and they are three different failures:
  // the request came back and was usable, it came back and was not -- a
  // refused key, an address that answers as something else -- or it never
  // came back at all.
  async function syncFetch(url, options) {
    let res;
    try {
      res = await fetch(url, options);
    } catch (err) {
      setSyncStatus('unreachable');
      throw err;
    }
    if (!res.ok) {
      setSyncStatus('refused');
      throw new Error(`HTTP ${res.status}`);
    }
    setSyncStatus('ok');
    return res;
  }

  function annotationsUrl() {
    return `${server.url}/annotations?site=${encodeURIComponent(siteKey)}`;
  }

  function annotationUrl(id) {
    return `${server.url}/annotations/${encodeURIComponent(id)}?site=${encodeURIComponent(siteKey)}`;
  }

  function screenshotUrl(id) {
    return `${server.url}/screenshots/${encodeURIComponent(id)}?site=${encodeURIComponent(siteKey)}`;
  }

  // The key is in the page source, so it keeps a passer-by from writing to a
  // review server and nothing more. An empty key sends no header.
  function syncHeaders(headers) {
    const merged = Object.assign({}, headers);
    if (server.apiKey) merged['X-Uxnote-Key'] = server.apiKey;
    return merged;
  }

  function snapshotOf(annotations) {
    return new Map(annotations.map((ann) => [ann.id, JSON.stringify(ann)]));
  }

  // One toast per run of failures: the second one says nothing the first did
  // not. The next request that succeeds arms it again.
  function warnSync(message, err) {
    console.warn('Uxnote sync:', message, err);
    if (syncWarned) return;
    syncWarned = true;
    showToast(message);
  }

  function enqueueSync(run) {
    syncQueue = syncQueue.then(run, run);
    return syncQueue;
  }

  async function remotePull() {
    if (!server) return;
    try {
      const res = await syncFetch(annotationsUrl(), { headers: syncHeaders({ Accept: 'application/json' }) });
      let payload;
      try {
        payload = await res.json();
      } catch (err) {
        // An answer that is not the annotation set means the address is
        // serving something else, which is the reviewer's to fix.
        setSyncStatus('refused');
        throw err;
      }
      state.annotations = ((payload && payload.annotations) || []).filter(isStoredAnnotation);
      state.annotations.forEach((ann) => {
        if (!ann.pageKey) {
          ann.pageKey = normalizePageKey(ann.pageUrl || window.location.href);
        }
      });
      syncedSnapshot = snapshotOf(state.annotations);
      syncWarned = false;
      clearRenderedAnnotations();
      restoreAnnotations();
      renumberMarkers();
      renderList();
      // The hop that a card on another page starts lands here, because the set
      // it points into only exists once the pull has answered.
      focusPendingAnnotation();
    } catch (err) {
      warnSync('Uxnote: could not read the annotations from the server', err);
    }
  }

  function syncAnnotations() {
    if (!server) return;
    const next = snapshotOf(state.annotations);
    next.forEach((body, id) => {
      if (syncedSnapshot.get(id) !== body) enqueueSync(() => remoteUpsert(id, body));
    });
    syncedSnapshot.forEach((body, id) => {
      if (!next.has(id)) enqueueSync(() => remoteDelete(id));
    });
  }

  // A failed request leaves the snapshot stale, so the next change sends it
  // again.
  async function remoteUpsert(id, body) {
    try {
      await syncFetch(annotationUrl(id), {
        method: 'PUT',
        headers: syncHeaders({ 'Content-Type': 'application/json' }),
        body
      });
      syncedSnapshot.set(id, body);
      syncWarned = false;
    } catch (err) {
      warnSync('Uxnote: could not save this annotation on the server', err);
    }
  }

  async function remoteDelete(id) {
    try {
      await syncFetch(annotationUrl(id), { method: 'DELETE', headers: syncHeaders() });
      syncedSnapshot.delete(id);
      syncWarned = false;
    } catch (err) {
      warnSync('Uxnote: could not delete this annotation on the server', err);
    }
  }

  // Delete all is one request, never one per annotation.
  function remoteDeleteAll() {
    if (!server) return;
    enqueueSync(async () => {
      try {
        await syncFetch(annotationsUrl(), { method: 'DELETE', headers: syncHeaders() });
        syncedSnapshot = new Map();
        syncWarned = false;
      } catch (err) {
        warnSync('Uxnote: could not delete the annotations on the server', err);
      }
    });
  }

  // ------------------------------------------------------------------
  // Route changes
  // ------------------------------------------------------------------

  // A page can change without a document load. The annotations of the page
  // just left come off the screen, and the ones of the new page go on.
  let routeChangeTimer = null;
  let routePageKey = normalizePageKey(window.location.href);

  function onRouteChange() {
    routeChangeTimer = null;
    const pageKey = normalizePageKey(window.location.href);
    if (pageKey === routePageKey) return;
    routePageKey = pageKey;
    clearRenderedAnnotations();
    restoreAnnotations();
    renumberMarkers();
    renderList();
    enqueueSync(remotePull);
  }

  function scheduleRouteChange() {
    if (routeChangeTimer) clearTimeout(routeChangeTimer);
    // Long enough for the router to have drawn the page the annotations sit on.
    routeChangeTimer = setTimeout(onRouteChange, 120);
  }

  function watchRouteChanges() {
    ['pushState', 'replaceState'].forEach((name) => {
      const original = history[name];
      if (typeof original !== 'function') return;
      history[name] = function patched(...args) {
        const result = original.apply(this, args);
        scheduleRouteChange();
        return result;
      };
    });
    window.addEventListener('popstate', scheduleRouteChange);
  }

  // ------------------------------------------------------------------
  // Region screenshots
  // ------------------------------------------------------------------

  // snapdom renders the page a screenshot is cropped out of. The widget never
  // loads it: a second script tag on the page is the whole opt-in, so a strict
  // script-src has nothing to allow that the page did not already allow.
  function captureAvailable() {
    return !!(window.snapdom && typeof window.snapdom.toCanvas === 'function');
  }

  // Resolves the framed region in page coordinates, or null when the reviewer
  // stops.
  function selectRegion() {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.className = 'wn-shot-overlay wn-annotator';
      const rectEl = document.createElement('div');
      rectEl.className = 'wn-shot-rect wn-annotator';
      overlay.appendChild(rectEl);

      const hint = document.createElement('div');
      hint.className = 'wn-shot-hint wn-annotator';
      const label = document.createElement('span');
      label.textContent = 'Drag to frame a region. Escape stops.';
      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.textContent = 'Cancel';
      hint.appendChild(label);
      hint.appendChild(cancelBtn);

      const setRect = (r) => {
        const usable = !!r && r.w >= 4 && r.h >= 4;
        rectEl.style.display = usable ? 'block' : 'none';
        if (!usable) return;
        rectEl.style.left = `${r.x}px`;
        rectEl.style.top = `${r.y}px`;
        rectEl.style.width = `${r.w}px`;
        rectEl.style.height = `${r.h}px`;
      };
      setRect(null);

      // The pointer crosses the hint bar and leaves the viewport mid-drag, so
      // the move and the release are read on the document and the point is held
      // inside the frame the reviewer can see.
      const pointIn = (evt) => ({
        x: Math.min(Math.max(evt.clientX, 0), document.documentElement.clientWidth),
        y: Math.min(Math.max(evt.clientY, 0), document.documentElement.clientHeight)
      });
      const rectFrom = (a, b) => ({
        x: Math.min(a.x, b.x),
        y: Math.min(a.y, b.y),
        w: Math.abs(b.x - a.x),
        h: Math.abs(b.y - a.y)
      });

      let dragStart = null;
      const onDown = (evt) => {
        evt.preventDefault();
        dragStart = pointIn(evt);
        setRect(null);
      };
      const onMove = (evt) => {
        if (!dragStart) return;
        evt.preventDefault();
        setRect(rectFrom(dragStart, pointIn(evt)));
      };
      // A release under the floor is a stray click: it frames nothing and the
      // overlay stays open for another drag.
      const onUp = (evt) => {
        if (!dragStart) return;
        const r = rectFrom(dragStart, pointIn(evt));
        dragStart = null;
        if (r.w < 4 || r.h < 4) {
          setRect(null);
          return;
        }
        finish({
          x: r.x + window.scrollX,
          y: r.y + window.scrollY,
          w: r.w,
          h: r.h
        });
      };
      const finish = (result) => {
        document.removeEventListener('keydown', onKey, true);
        document.removeEventListener('mousemove', onMove, true);
        document.removeEventListener('mouseup', onUp, true);
        overlay.remove();
        hint.remove();
        resolve(result);
      };
      const onKey = (evt) => {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          finish(null);
        }
      };
      overlay.addEventListener('mousedown', onDown);
      cancelBtn.addEventListener('click', () => finish(null));
      document.addEventListener('mousemove', onMove, true);
      document.addEventListener('mouseup', onUp, true);
      document.addEventListener('keydown', onKey, true);
      document.body.appendChild(overlay);
      document.body.appendChild(hint);
    });
  }

  // Render the page with snapdom, the widget's own interface left out, and crop
  // the region out of it.
  async function captureRegion(rect) {
    // The interface is dropped from the copy snapdom renders, and not hidden on
    // the page: the toolbar, the panel and the dim stay in front of the
    // reviewer while the picture is taken. The dim overlay is interface too,
    // and it is the one piece that carries no .wn-annotator class.
    //
    // 'remove' and not the default 'hide', which stands a box of the same size
    // in the flow of the copy and pushes the page down under it. Every piece of
    // the interface is fixed or absolute, so removing it moves nothing else.
    const page = await window.snapdom.toCanvas(document.body, {
      scale: 1,
      exclude: ['.wn-annotator', '.wn-annot-dimmer'],
      excludeMode: 'remove'
    });
    const bodyRect = document.body.getBoundingClientRect();
    const factor = bodyRect.width ? page.width / bodyRect.width : 1;
    const originX = bodyRect.left + window.scrollX;
    const originY = bodyRect.top + window.scrollY;
    const sx = Math.max(0, Math.round((rect.x - originX) * factor));
    const sy = Math.max(0, Math.round((rect.y - originY) * factor));
    const sw = Math.min(page.width - sx, Math.max(1, Math.round(rect.w * factor)));
    const sh = Math.min(page.height - sy, Math.max(1, Math.round(rect.h * factor)));
    if (sw < 1 || sh < 1) return null;
    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    canvas.getContext('2d').drawImage(page, sx, sy, sw, sh, 0, 0, sw, sh);
    return { canvas, w: sw, h: sh };
  }

  // The camera is a capture mode like the other two: the reviewer frames a
  // region, comments on it, and the picture is the annotation.
  async function captureRegionAnnotation() {
    if (!captureAvailable() || state.mode === 'screenshot') return;
    // The mode stands until the annotation is written or the reviewer stops,
    // the way it does for a highlight and for an element.
    setMode('screenshot');
    try {
      const rect = await selectRegion();
      if (!rect) return;
      // The picture is of the page the drag was released on, and it is taken
      // while the comment is being written, so releasing the drag opens the
      // prompt as directly as releasing a selection does.
      const pending = captureRegion(rect).catch((err) => {
        console.warn('Uxnote screenshot:', err);
        return null;
      });
      const res = await awaitComment('Comment for this region?');
      if (!res) return;
      const shot = await pending;
      if (!shot) {
        showToast('Uxnote: could not capture that region');
        return;
      }
      const { comment } = res;
      const id = generateId();
      let stored = null;
      if (server) {
        // The annotation itself lives on that server, so a refused upload is a
        // transient failure and not a second mode. Nothing is created.
        const blob = await new Promise((done) => shot.canvas.toBlob(done, 'image/png'));
        const uploaded = blob ? await uploadScreenshot(blob, id) : null;
        if (!uploaded) {
          showToast('Uxnote: could not send the screenshot to the server');
          return;
        }
        stored = { url: uploaded.url, w: shot.w, h: shot.h, capturedAt: Date.now() };
      } else {
        stored = { dataUrl: shot.canvas.toDataURL('image/png'), w: shot.w, h: shot.h, capturedAt: Date.now() };
      }
      const annotation = {
        id,
        type: 'screenshot',
        comment: comment.trim(),
        snippet: '',
        pageUrl: window.location.href,
        pageKey: normalizePageKey(window.location.href),
        rect: { x: rect.x, y: rect.y, w: rect.w, h: rect.h },
        screenshot: stored,
        createdAt: Date.now(),
        status: 'active'
      };
      state.annotations.push(annotation);
      saveAnnotations();
      addMarkerForAnnotation(annotation, null);
      renderList();
    } finally {
      setMode(null);
    }
  }

  // The PNG travels as the body of the request, so a server needs no multipart
  // parser. The answer names the address the server serves the file at.
  async function uploadScreenshot(blob, id) {
    try {
      const res = await syncFetch(screenshotUrl(id), {
        method: 'PUT',
        headers: syncHeaders({ 'Content-Type': 'image/png' }),
        body: blob
      });
      const payload = await res.json();
      return payload && payload.url ? payload : null;
    } catch (err) {
      console.warn('Uxnote screenshot:', err);
      return null;
    }
  }

  function screenshotSrc(ann) {
    const shot = ann && ann.screenshot;
    if (!shot) return null;
    if (shot.dataUrl) return shot.dataUrl;
    if (!shot.url) return null;
    try {
      // The address the server answers with is relative to the base URL, and
      // the server can be a different origin from the page under review.
      const base = server ? new URL(`${server.url}/`, window.location.href) : window.location.href;
      return new URL(shot.url, base).href;
    } catch (err) {
      return shot.url;
    }
  }

  function openScreenshotLightbox(src) {
    const box = document.createElement('div');
    box.className = 'wn-shot-lightbox wn-annotator';
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'The screenshot of this annotation';
    box.appendChild(img);
    const close = () => {
      document.removeEventListener('keydown', onKey, true);
      box.remove();
    };
    const onKey = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        close();
      }
    };
    box.addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);
    document.body.appendChild(box);
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

  window.Uxnote = {
    refresh: refreshMarkers,
    setHidden: (hidden) => setAnnotatorVisibility(!!hidden),
    toggleVisibility: () => setAnnotatorVisibility(!state.hidden),
    isHidden: () => !!state.hidden,
    sync: { pull: remotePull, push: syncAnnotations, url: () => (server ? server.url : null) }
  };
})();
