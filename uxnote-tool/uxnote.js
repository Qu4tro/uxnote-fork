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
  // The third kind had no name of its own. Without one, the only way to
  // recolour a region frame was to recolour the other two with it.
  const regionHighlightColorAttr =
    getScriptAttr('colorForRegionHighlight') ||
    (script && script.dataset.colorForRegionHighlight);
  // Three kinds of annotation, so three colours: a marker, an outline or a
  // frame says which kind it belongs to before the note is read.
  const defaultTextHighlightColor = '#4e9cf6';
  const defaultElementHighlightColor = '#8b5cf6';
  const defaultRegionHighlightColor = '#f59f00';
  // `colorForHighlight` still paints all three. What it no longer does is
  // work the other way round: naming the text colour alone used to make it
  // the base, and take the element outline and the region frame with it.
  const baseHighlightColor = parseHexColor(globalHighlightColorAttr);
  const textFallback = baseHighlightColor || defaultTextHighlightColor;
  const elementFallback = baseHighlightColor || defaultElementHighlightColor;
  const textHighlightColor = normalizeHexColor(textHighlightColorAttr || textFallback, textFallback);
  const elementHighlightColor = normalizeHexColor(elementHighlightColorAttr || elementFallback, elementFallback);
  const regionFallback = baseHighlightColor || defaultRegionHighlightColor;
  const regionHighlightColor = normalizeHexColor(regionHighlightColorAttr || regionFallback, regionFallback);
  const colorPalette = {
    text: buildColorSet(textHighlightColor, { overlayAlpha: 0.7, softAlpha: 0.18, softerAlpha: 0.08 }),
    element: buildColorSet(elementHighlightColor, { overlayAlpha: 0.35, softAlpha: 0.12, softerAlpha: 0.04 }),
    screenshot: buildColorSet(regionHighlightColor, { overlayAlpha: 0.35, softAlpha: 0.12, softerAlpha: 0.04 })
  };
  const initialPosition = (() => {
    if (startTopAttr !== null && startTopAttr !== undefined) {
      return parseBoolAttr(startTopAttr, false) ? 'top' : 'bottom';
    }
    return (script && script.dataset.position) || 'bottom';
  })();
  let position = initialPosition;
  const positionStorageKey = 'wn-toolbar-pos';
  const panelViewStorageKey = 'wn-panel-view';
  const dockMode = (script && (script.dataset.dock || script.dataset.layout)) || '';
  const storageKey = `uxnote:site:${siteKey}`;
  const syncedStorageKey = `${storageKey}:synced`;
  const importFilesStorageKey = `uxnote:import-files:${siteKey}`;
  const visibilityStorageKey = `uxnote:hidden:${siteKey}`;
  const pendingFocusKey = `uxnote:pending:${siteKey}`;
  // A named server is the annotation store; no name at all means localStorage.
  const serverUrl = ((script && script.dataset.serverUrl) || '').trim().replace(/\/+$/, '');
  const server = serverUrl ? { url: serverUrl, apiKey: (script && script.dataset.serverApiKey) || '' } : null;
  const jsonExport = parseBoolAttr(script && script.dataset.jsonExport, true);
  const jsonImport = parseBoolAttr(script && script.dataset.jsonImport, true);
  // A handoff to mail needs somewhere to send it, so the address is the switch.
  // Name one and the toolbar carries the button; name none, or something that
  // is not an address, and there is no button to press. The test is a local
  // part, an @ and a dotted domain -- past that an address is the mail client's
  // business and not the widget's.
  const mailTo = mailToDefault.trim();
  const mailExport = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(mailTo);
  const themeAttr = ((script && script.dataset.theme) || '').trim().toLowerCase();
  const theme =
    themeAttr === 'light' || themeAttr === 'dark' || themeAttr === 'reverse-auto' ? themeAttr : 'auto';
  // Both of these read the system preference, so both follow it as it changes.
  const followsSystem = theme === 'auto' || theme === 'reverse-auto';
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
    selectionBar: null,
    selectionTimer: null,
    selectionRange: null,
    elementPicker: null,
    elementTrail: [],
    elementTrailIndex: 0,
    toolbar: null,
    panel: null,
    panelView: 'rail',
    cards: new Map(),
    focusedId: null,
    visibilityToggle: null,
    commentModal: null,
    dialogModal: null,
    importModal: null,
    markerLayer: null,
    syncDot: null,
    syncStatus: null,
    syncPending: new Set(),
    shotObserver: null,
    colors: colorPalette,
    customPosition: false,
    dimEnabled,
    dimOpacity,
    dimOverlay: null,
    filters: {
      query: '',
      sort: 'oldest',
      group: 'none'
    },
    bands: new Map(),
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
    state.panelView = loadPanelView();
    if (jsonImport) state.importFiles = loadImportFiles();
    captureBasePadding();
    applyColorTheme();
    applyTheme();
    injectStyles();
    createShell();
    createDimmer();
    setAnnotatorVisibility(state.hidden);
    loadAnnotations();
    if (server && !loadSyncedSnapshot()) state.annotations = [];
    restoreAnnotations();
    retryResolveMissingAnnotations();
    startMissingObserver();
    startLayoutObserver();
    if (!server) focusPendingAnnotation();
    // The copy in this browser is on the page before the server has said
    // anything, so a reviewer with a dead server still opens their notes. The
    // pull settles the two sets, and the probe watches for the server coming
    // back with nobody writing.
    if (server) {
      enqueueSync(remotePull);
      startHealthLoop();
    }
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
      .wn-annot-panel-view {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        padding: 0;
        border-radius: 10px;
        border: 1px solid var(--wn-border);
        background: rgba(109, 86, 199, 0.08);
        color: var(--wn-text-muted);
        cursor: pointer;
        transition: all 0.12s ease;
      }
      .wn-annot-panel-view:hover {
        background: rgba(109, 86, 199, 0.16);
        color: var(--wn-text);
      }
      .wn-annot-panel-view.active {
        background: rgba(109, 86, 199, 0.2);
        border-color: rgba(109, 86, 199, 0.4);
        color: var(--wn-text);
      }
      .wn-annot-panel-view svg {
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
      /* The rail has room for the note and little else. Everything the panel
         used to drop for want of width is built once and drawn full size. */
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
        .wn-annot-panel-export {
          display: inline-flex;
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

  // The surfaces that become sheets. A sheet is a panel or a dialog anchored
  // to the bottom edge on a compact layout; the class is carried at all times
  // and the compact media query is what turns it into one.
  const sheetModals = ['commentModal', 'dialogModal'];

  // The handle and the close button a sheet needs. The notes panel had no way
  // to dismiss itself at all -- the only exit was the toolbar button it was
  // painted over.
  function buildSheetGrip(label, onClose) {
    const grip = document.createElement('div');
    grip.className = 'wn-annot-sheet-grip wn-annotator';
    const handle = document.createElement('span');
    handle.className = 'wn-annot-sheet-handle wn-annotator';
    handle.setAttribute('aria-hidden', 'true');
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'wn-annot-sheet-close wn-annotator';
    close.setAttribute('aria-label', label);
    close.innerHTML = iconClose();
    close.addEventListener('click', (evt) => {
      evt.stopPropagation();
      onClose();
    });
    grip.appendChild(handle);
    grip.appendChild(close);
    bindSheetDrag(grip, onClose);
    return grip;
  }

  // A handle that only looks draggable is a lie, so it drags. Past a third of
  // its own height, or on a quick flick, the sheet goes; anything shorter
  // springs back. Pointer events rather than touch ones, because this shell is
  // a sheet in a narrow desktop window too.
  function bindSheetDrag(grip, onClose) {
    let sheet = null;
    let startY = 0;
    let startedAt = 0;
    let travel = 0;

    const onMove = (evt) => {
      if (!sheet) return;
      travel = Math.max(0, evt.clientY - startY);
      sheet.style.transform = `translateY(${travel}px)`;
    };
    const onEnd = () => {
      if (!sheet) return;
      grip.removeEventListener('pointermove', onMove);
      grip.removeEventListener('pointerup', onEnd);
      grip.removeEventListener('pointercancel', onEnd);
      const height = sheet.getBoundingClientRect().height || 1;
      const speed = travel / Math.max(1, Date.now() - startedAt);
      sheet.style.transform = '';
      sheet.style.transition = '';
      sheet = null;
      if (travel > height / 3 || (travel > 40 && speed > 0.5)) onClose();
    };

    grip.addEventListener('pointerdown', (evt) => {
      // Capturing the pointer sends the click that follows to the grip rather
      // than to whatever was pressed, which swallowed the close button whole.
      // Nobody drags a sheet by its close button anyway.
      if (evt.target.closest('.wn-annot-sheet-close')) return;
      sheet = grip.closest('.wn-annot-sheet');
      if (!sheet) return;
      startY = evt.clientY;
      startedAt = Date.now();
      travel = 0;
      sheet.style.transition = 'none';
      if (grip.setPointerCapture) grip.setPointerCapture(evt.pointerId);
      grip.addEventListener('pointermove', onMove);
      grip.addEventListener('pointerup', onEnd);
      grip.addEventListener('pointercancel', onEnd);
    });
  }

  function isSheetOpen() {
    // Hiding the widget takes every surface off the screen with a display
    // rule, and a page held still for a sheet nobody can see is a page that
    // cannot be scrolled at all.
    if (state.hidden || !isCompactLayout()) return false;
    if (state.panel && state.panel.style.display !== 'none') return true;
    return sheetModals.some((key) => {
      const modalState = state[key];
      return modalState && modalState.backdrop.classList.contains('show');
    });
  }

  // Hold the page still under a sheet. Nothing did this before, so a flick
  // that ran off the end of the notes list carried on into the host page.
  // Hiding the root's overflow leaves programmatic scrolling alone -- measured
  // -- so focusing an annotation from the list still moves the page to it.
  // On iOS Safari this is weaker than it looks; `overscroll-behavior` on the
  // sheet itself is what stops the chaining there.
  function syncPageScrollLock() {
    const locked = isSheetOpen();
    if (locked === !!state.scrollLocked) return;
    const root = document.documentElement;
    state.scrollLocked = locked;
    if (locked) {
      state.scrollLockPrev = root.style.overflow;
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = state.scrollLockPrev || '';
      state.scrollLockPrev = '';
    }
  }

  // How much room at each end a sheet has to give up. The toolbar paints above
  // every one of them, and on a phone it used to cover the bottom 50px of the
  // notes panel -- its footer, and the only control that could close it.
  function applySheetInset() {
    const root = document.documentElement;
    const setInsets = (bottom, top) => {
      root.style.setProperty('--wn-sheet-bottom', `${bottom}px`);
      root.style.setProperty('--wn-sheet-top-guard', `${top}px`);
    };
    if (!state.toolbar || !isCompactLayout() || state.hidden) {
      setInsets(0, 0);
      return;
    }
    const rect = state.toolbar.getBoundingClientRect();
    const gap = 8;
    const height = root.clientHeight;
    if (position === 'top') {
      setInsets(0, Math.max(0, Math.round(rect.bottom + gap)));
      return;
    }
    setInsets(Math.max(0, Math.round(height - rect.top + gap)), 0);
  }

  function setPanelOpen(open) {
    if (!state.panel) return;
    state.panel.style.display = open ? '' : 'none';
    updateToggleActive();
    syncPageScrollLock();
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
    syncPanelView();
    positionPanel();
    positionTip();
    positionCommentCard();
    applyPageOffset();
    applySheetInset();
    positionActionBars();
    syncPageScrollLock();
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
    panel.className = 'wn-annot-panel wn-annot-sheet wn-annotator';
    panel.innerHTML = `
      <div class="wn-annot-panel-head wn-annotator">
        <div class="wn-annot-panel-top wn-annotator">
          <h3>Annotations (0)</h3>
          <div class="wn-annot-panel-tools wn-annotator">
            <button class="wn-annot-panel-view wn-annotator" type="button"></button>
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
    const panelHead = panel.querySelector('.wn-annot-panel-head');
    if (panelHead) {
      panelHead.insertBefore(
        buildSheetGrip('Close the annotations', () => setPanelOpen(false)),
        panelHead.firstChild
      );
    }
    const panelList = panel.querySelector('.wn-annot-list');
    if (panelList) panelList.addEventListener('keydown', onListKey);
    const panelViewBtn = panel.querySelector('.wn-annot-panel-view');
    if (panelViewBtn) {
      panelViewBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        setPanelView(isFullView() ? 'rail' : 'full');
      });
    }
    const panelExportBtn = panel.querySelector('.wn-annot-panel-export');
    if (panelExportBtn) {
      panelExportBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        requestExport();
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
    syncPanelView();
    renderList();
    applyPageOffset();
    applySheetInset();
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
    modal.className = 'wn-annot-modal wn-annot-comment-card wn-annot-sheet wn-annotator';

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
    modal.appendChild(buildSheetGrip('Discard this comment', () => cancelBtn.click()));
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
    if (isCompactLayout()) {
      // The sheet is placed against the viewport edges by the stylesheet, and
      // an inline left and bottom from the parked-card path would beat it.
      card.style.left = '';
      card.style.top = '';
      card.style.bottom = '';
      return;
    }
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
      syncPageScrollLock();
      textarea.focus();
      textarea.select();

      const close = (val) => {
        backdrop.classList.remove('show');
        syncPageScrollLock();
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
        if (evt.key === 'Escape') {
          evt.preventDefault();
          close(null);
        }
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

  // One action wherever it is pressed. On a compact layout the file goes to
  // the share sheet, which is how a phone hands a file to another
  // application; on a desktop it goes to the download anchor the widget has
  // always used. Neither asks anything first -- the file holds every
  // annotation of the site either way.
  function requestExport() {
    if (!jsonExport) return;
    if (isCompactLayout()) {
      shareAnnotations();
      return;
    }
    exportAnnotations();
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
      if (evt.key === 'Escape') {
        evt.preventDefault();
        close();
      }
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
    modal.className = 'wn-annot-modal wn-annot-sheet wn-annotator';
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
    modal.appendChild(buildSheetGrip('Dismiss', () => cancelBtn.click()));
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
        syncPageScrollLock();
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
        if (evt.key === 'Escape') {
          evt.preventDefault();
          close(false);
        }
        if ((evt.metaKey || evt.ctrlKey) && evt.key === 'Enter') onOk();
      };

      okBtn.addEventListener('click', onOk);
      cancelBtn.addEventListener('click', onCancel);
      backdrop.addEventListener('click', onBackdrop);
      document.addEventListener('keydown', onKey);
      backdrop.classList.add('show');
      syncPageScrollLock();
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
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('mousemove', handleElementHover);
    document.addEventListener('click', handleElementClick, true);
    window.addEventListener('keydown', handleModeEscape);
    window.addEventListener('resize', refreshMarkers);
    window.addEventListener('resize', applyPageOffset);
    window.addEventListener('resize', positionPanel);
    window.addEventListener('resize', applySheetInset);
    window.addEventListener('resize', positionTip);
    window.addEventListener('resize', positionVisibilityToggle);
    window.addEventListener('resize', positionActionBars);
    window.addEventListener('scroll', refreshMarkers, { passive: true });
    bindSyncFlush();
    watchRouteChanges();
    // A rotation crosses the compact boundary without always firing a resize
    // the layout functions can read, and the bar's button set differs across
    // it, so both queries are subscribed rather than polled.
    subscribeMedia(touchQuery, applyFormFactor);
    subscribeMedia(compactQuery, applyFormFactor);
    if (followsSystem) subscribeMedia(darkQuery, applyTheme);
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

    const sortInput = state.panel.querySelector('#wn-filter-sort');
    if (sortInput) {
      sortInput.value = state.filters.sort;
      sortInput.addEventListener('change', () => {
        state.filters.sort = sortInput.value;
        renderList();
      });
    }
    const groupInput = state.panel.querySelector('#wn-filter-group');
    if (groupInput) {
      groupInput.value = state.filters.group;
      groupInput.addEventListener('change', () => {
        state.filters.group = groupInput.value;
        renderList();
      });
    }
  }

  function setMode(nextMode, options = {}) {
    const keepOutline = options.keepOutline;
    // Toggle annotation mode and refresh associated UI
    if (state.mode === nextMode) {
      state.mode = null;
      updateToolbarActive();
      hideTip();
      closeTouchCapture();
      if (!keepOutline) hideOutline();
      return;
    }
    state.mode = nextMode;
    updateToolbarActive();
    showTipForMode(nextMode);
    closeTouchCapture();
    if (nextMode !== 'element') {
      hideOutline();
    }
  }

  // Escape leaves whatever mode is up, whichever one it is. It is bound on the
  // window and not on the document, so every overlay that reads the key -- the
  // comment card, the dialogs, the import modal, the region drag, the
  // lightbox -- gets it first and marks it handled; this is what is left. With
  // no mode on, the key is the host page's and the widget does not touch it.
  function handleModeEscape(evt) {
    if (evt.key !== 'Escape' || evt.defaultPrevented) return;
    if (!state.mode) return;
    evt.preventDefault();
    setMode(null);
  }

  // Leaving a mode takes its bar with it. Both are built only on a coarse
  // pointer, so on a mouse this is two null checks.
  function closeTouchCapture() {
    if (state.selectionTimer) {
      clearTimeout(state.selectionTimer);
      state.selectionTimer = null;
    }
    hideSelectionBar();
    closeElementPicker();
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
    const touch = isTouchInput();
    let text = '';
    if (mode === 'text') {
      text = touch ? 'Select text, then tap Add note.' : 'Select text then release to add a note. Escape stops.';
    } else if (mode === 'element') {
      text = touch ? 'Tap an element to preview it, then pin it.' : 'Hover an element, click to annotate. Escape stops.';
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

  function loadPanelView() {
    try {
      if (localStorage.getItem(panelViewStorageKey) === 'full') return 'full';
    } catch (err) {
      // ignore
    }
    return 'rail';
  }

  // The rail is the shape that leaves the page visible, so it is the one the
  // panel opens in. The full-size view is asked for, and the asking is
  // remembered -- except when the widget shrinks the panel itself to uncover
  // the note the reviewer just picked.
  function setPanelView(next, options = {}) {
    const view = next === 'full' ? 'full' : 'rail';
    if (options.remember !== false) {
      try {
        localStorage.setItem(panelViewStorageKey, view);
      } catch (err) {
        // ignore
      }
    }
    if (state.panelView === view) return;
    state.panelView = view;
    syncPanelView();
  }

  function isFullView() {
    return state.panelView === 'full' && !isCompactLayout();
  }

  // A compact layout is already a sheet and never takes the class, so the
  // sheet's rules and the full-size view's never meet.
  function syncPanelView() {
    if (!state.panel) return;
    const full = isFullView();
    const btn = state.panel.querySelector('.wn-annot-panel-view');
    if (btn) {
      const label = full ? 'Shrink the panel to the side' : 'Open the panel full size';
      btn.innerHTML = full ? iconCollapse() : iconExpand();
      btn.classList.toggle('active', full);
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-pressed', full ? 'true' : 'false');
      btn.setAttribute('data-tip', label);
    }
    if (state.panel.classList.contains('is-full') === full) return;
    state.panel.classList.toggle('is-full', full);
    positionPanel();
    renderList();
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
    const systemDark = !!(darkQuery && darkQuery.matches);
    // A site that is itself on auto leaves the widget wearing the same theme as
    // the page it annotates. 'reverse-auto' reads the same preference and takes
    // the other side of it, so the two stay apart on either setting rather than
    // holding one fixed side that collides on one of them.
    const dark =
      theme === 'dark' ||
      (theme === 'auto' && systemDark) ||
      (theme === 'reverse-auto' && !systemDark);
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
    setVar('--wn-shot-frame', palette.screenshot.base);
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
    item.style.setProperty('--wn-item-accent-text', palette.text);
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
    persistAnnotations();
    if (server) syncAnnotations();
  }

  // The set goes to localStorage whether or not a server is named. With one,
  // the copy is what carries a note across a reload the server was down for,
  // and the digests beside it are what tell a note the server never saw from
  // one it already holds.
  function persistAnnotations() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state.annotations));
      if (server) persistSnapshot();
    } catch (err) {
      console.warn('Annotator storage save error', err);
      // A capture on a coarse pointer is the whole viewport rather than a
      // hand-framed corner of it, so the store fills faster than it used to,
      // and it says so now whether or not a server is named. warnStorage says
      // it once: a refused write repeats for every note after it, and the
      // reviewer only needs telling that the browser is full.
      warnStorage();
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
      requestExport();
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
    // Restore default flex layout when re-opening so the footer stays pinned
    setPanelOpen(state.panel.style.display === 'none');
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
    applySheetInset();
    syncPageScrollLock();
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
    // The room the full-size view runs in. The bar sits the same distance from
    // whichever edge it is docked against, so giving up that distance at both
    // ends at once clears the bar at either position and leaves the view where
    // it is when the reviewer swaps the bar over. A hidden bar has no box and
    // reserves nothing.
    const reserve = barRect.height
      ? Math.max(
          0,
          Math.round(
            (position === 'top' ? barRect.bottom : document.documentElement.clientHeight - barRect.top) + 10
          )
        )
      : 0;
    document.documentElement.style.setProperty('--wn-bar-reserve', `${reserve}px`);

    if (isCompactLayout()) {
      // The sheet is placed by the stylesheet, against the viewport edges and
      // clear of the toolbar. Every inline value the desktop branch leaves
      // behind would beat those rules, so they come off here.
      p.style.width = '';
      p.style.height = '';
      p.style.maxHeight = '';
      p.style.left = '';
      p.style.right = '';
      p.style.top = '';
      p.style.bottom = '';
      p.style.borderRadius = '';
      p.style.paddingTop = '';
      p.style.paddingBottom = '';
      applySheetInset();
      return;
    }

    if (isFullView()) {
      p.style.width = '100%';
      p.style.maxHeight = 'none';
      p.style.left = '0px';
      p.style.right = '0px';
      p.style.top = 'var(--wn-bar-reserve)';
      p.style.bottom = 'var(--wn-bar-reserve)';
      p.style.height = '';
      p.style.borderRadius = '0px';
      p.style.paddingTop = '';
      p.style.paddingBottom = '';
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
    applySheetInset();
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

  function isRangeAnnotatable(range) {
    return (
      isAnnotatableTarget(range.commonAncestorContainer) &&
      isAnnotatableTarget(range.startContainer) &&
      isAnnotatableTarget(range.endContainer)
    );
  }

  // Capture a text selection and convert to annotation (text mode)
  async function handleTextSelection() {
    if (state.mode !== 'text') return;
    // Where a finger is driving, the release is the wrong moment to read the
    // selection: a long press picks one word and every drag of a handle after
    // it is another release. The action bar commits there instead.
    if (isTouchInput()) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    const range = selection.getRangeAt(0);
    if (!range) return;
    if (!isRangeAnnotatable(range)) {
      selection.removeAllRanges();
      showToast('This area is a popup or overlay. It cannot be annotated.');
      return;
    }
    const snippet = selection.toString().trim();
    if (!snippet) return;
    await commitTextAnnotation(range, snippet);
  }

  async function commitTextAnnotation(range, snippet) {
    const res = await awaitComment('Comment for this highlight?');
    if (!res) return;
    const { comment } = res;
    const id = generateId();
    const payload = serializeRange(range, snippet);
    const span = applyTextHighlight(range, id);
    const selection = window.getSelection();
    if (selection) selection.removeAllRanges();
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
    outlineElement(el);
  }

  // The outline is a box in the page's own flow, so one that runs past what a
  // clipping ancestor actually shows widens the document -- and fixed chrome
  // is positioned against that width, so the toolbar walks off the screen with
  // it. Measured on this repo's own demo page: outlining a row of the pricing
  // table, which sits in a scroller narrower than itself, took the document
  // from 375px to 459px and carried the bar with it. The visible rect is what
  // the marker for the same element is placed by.
  function outlineElement(el) {
    const rect = getVisibleRect(el);
    if (!rect) {
      hideOutline();
      return;
    }
    showOutline(rect);
  }

  // Click on a DOM element to mark it and add a comment (element mode)
  async function handleElementClick(evt) {
    if (state.mode !== 'element') return;
    const el = evt.target;
    // The widget's own controls are not a target and never were. Saying so
    // out loud on every tap of the toolbar -- which the picker bar now sits
    // beside -- is noise, and it named the bar an overlay to its own user.
    if (isWithinAnnotator(el)) return;
    if (!el || !isAnnotatableTarget(el)) {
      showToast('This area is a popup or overlay. It cannot be annotated.');
      return;
    }
    evt.preventDefault();
    evt.stopPropagation();
    // Without a hover stream there is no preview at all: the outline that says
    // what is about to be annotated only ever appeared once the tap had
    // committed it. The tap previews, and `Pin here` commits.
    if (isTouchInput()) {
      openElementPicker(el);
      return;
    }
    await commitElementAnnotation(el);
  }

  async function commitElementAnnotation(el) {
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

  // ------------------------------------------------------------------
  // Capture on a coarse pointer
  // ------------------------------------------------------------------

  // Long enough that dragging a selection handle from one word to the next
  // does not raise the bar between them, short enough that letting go of the
  // handle answers straight away.
  const SELECTION_SETTLE_MS = 400;

  // Both bars are raised clear of the toolbar, which paints above everything
  // the widget owns and sits in thumb reach at the bottom of a phone.
  function positionActionBar(bar) {
    if (!bar || !state.toolbar || !bar.classList.contains('show')) return;
    const root = document.documentElement;
    const rect = state.toolbar.getBoundingClientRect();
    const gap = 8;
    if (position === 'top') {
      bar.style.top = `${Math.round(rect.bottom + gap)}px`;
      bar.style.bottom = 'auto';
      return;
    }
    bar.style.top = 'auto';
    bar.style.bottom = `${Math.round(root.clientHeight - rect.top + gap)}px`;
  }

  function positionActionBars() {
    positionActionBar(state.selectionBar);
    const picker = state.elementPicker;
    if (!picker || !picker.bar.classList.contains('show')) return;
    // A hover outline is redrawn by the next move. A previewed one is pinned,
    // so a reflow leaves it on the geometry the element used to have -- and a
    // box in the page's flow that no longer fits the page widens it.
    syncElementPicker();
  }

  function isCommentOpen() {
    const modalState = state.commentModal;
    return !!(modalState && modalState.backdrop.classList.contains('show'));
  }

  // The selection the reviewer has settled on, or nothing. A range that runs
  // into the widget's own chrome, or into a part of the page the host marked
  // off, is not one.
  function settledSelectionRange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;
    const range = selection.getRangeAt(0);
    if (!range || !range.toString().trim()) return null;
    if (!isRangeAnnotatable(range)) return null;
    return range;
  }

  // `selectionchange` rather than the release. On a phone the first release
  // comes with one word selected and every handle drag after it is another
  // one, so committing on a release commits the first word and clears the
  // selection out from under the reviewer mid-gesture.
  function handleSelectionChange() {
    if (!isTouchInput()) return;
    if (state.selectionTimer) clearTimeout(state.selectionTimer);
    state.selectionTimer = null;
    if (state.mode !== 'text' || isCommentOpen()) {
      hideSelectionBar();
      return;
    }
    state.selectionTimer = setTimeout(reviewSelection, SELECTION_SETTLE_MS);
  }

  function reviewSelection() {
    state.selectionTimer = null;
    if (state.mode !== 'text' || isCommentOpen()) return hideSelectionBar();
    const range = settledSelectionRange();
    if (!range) return hideSelectionBar();
    // Held as a copy: tapping the bar collapses the live selection before the
    // click lands, and the range is what the annotation is made from.
    state.selectionRange = range.cloneRange();
    showSelectionBar();
  }

  function ensureSelectionBar() {
    if (state.selectionBar) return state.selectionBar;
    const bar = document.createElement('div');
    bar.className = 'wn-annot-actionbar wn-annot-selection-bar wn-annotator';
    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'primary wn-annotator';
    add.textContent = 'Add note';
    add.addEventListener('click', (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      addNoteForSelection();
    });
    bar.appendChild(add);
    document.body.appendChild(bar);
    state.selectionBar = bar;
    return bar;
  }

  function showSelectionBar() {
    const bar = ensureSelectionBar();
    // The mode tip is drawn on the same strip of screen, just clear of the
    // toolbar. The bar is the instruction while it is up.
    hideTip();
    bar.classList.add('show');
    positionActionBar(bar);
  }

  function hideSelectionBar() {
    state.selectionRange = null;
    const bar = state.selectionBar;
    if (!bar || !bar.classList.contains('show')) return;
    bar.classList.remove('show');
    if (state.mode && !state.hidden) showTipForMode(state.mode);
  }

  async function addNoteForSelection() {
    const range = state.selectionRange;
    hideSelectionBar();
    if (!range) return;
    // The page can have moved on while the bar stood there.
    if (!isNodeConnected(range.startContainer) || !isNodeConnected(range.endContainer)) {
      showToast('That text is no longer on the page.');
      return;
    }
    const snippet = range.toString().trim();
    if (!snippet) return;
    await commitTextAnnotation(range, snippet);
  }

  // What the chip calls the element under the finger. The full selector runs
  // four levels deep and does not fit a phone; the last step of it is what
  // tells a reviewer whether they have the paragraph or the card.
  function describeElement(el) {
    if (!el || el.nodeType !== 1) return '';
    const tag = el.tagName.toLowerCase();
    if (el.id) return `${tag}#${el.id}`;
    const classes = Array.from(el.classList || []).filter(
      (name) => name && !name.startsWith('wn-') && !name.startsWith('uxnote-')
    );
    if (!classes.length) return tag;
    return `${tag}.${classes.slice(0, 2).join('.')}`;
  }

  function ensureElementPicker() {
    if (state.elementPicker) return state.elementPicker;
    const bar = document.createElement('div');
    bar.className = 'wn-annot-actionbar wn-annot-pick-bar wn-annotator';
    const name = document.createElement('span');
    name.className = 'wn-annot-pick-name wn-annotator';
    const make = (label, className, onTap) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `${className} wn-annotator`;
      btn.textContent = label;
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        onTap();
      });
      return btn;
    };
    // Wider and narrower walk the chain the tap started on, which is also the
    // answer to a fat finger: start anywhere inside the block and climb to it.
    const wider = make('Wider', 'wn-annot-pick-wider', () => stepElementPicker(1));
    const narrower = make('Narrower', 'wn-annot-pick-narrower', () => stepElementPicker(-1));
    const pin = make('Pin here', 'primary wn-annot-pick-pin', pinElementPicker);
    bar.appendChild(name);
    bar.appendChild(narrower);
    bar.appendChild(wider);
    bar.appendChild(pin);
    document.body.appendChild(bar);
    state.elementPicker = { bar, name, wider, narrower, pin };
    return state.elementPicker;
  }

  function openElementPicker(el) {
    state.elementTrail = [el];
    state.elementTrailIndex = 0;
    const picker = ensureElementPicker();
    hideTip();
    picker.bar.classList.add('show');
    syncElementPicker();
  }

  function pickedElement() {
    return state.elementTrail[state.elementTrailIndex] || null;
  }

  function nextWiderElement() {
    const el = pickedElement();
    if (state.elementTrailIndex < state.elementTrail.length - 1) {
      return state.elementTrail[state.elementTrailIndex + 1];
    }
    if (!el || el === document.body) return null;
    const parent = el.parentElement;
    if (!parent || !isAnnotatableTarget(parent)) return null;
    return parent;
  }

  function stepElementPicker(direction) {
    if (direction > 0) {
      const wider = nextWiderElement();
      if (!wider) return;
      if (state.elementTrailIndex === state.elementTrail.length - 1) {
        state.elementTrail.push(wider);
      }
      state.elementTrailIndex += 1;
    } else {
      if (state.elementTrailIndex === 0) return;
      state.elementTrailIndex -= 1;
    }
    syncElementPicker();
  }

  function syncElementPicker() {
    const picker = state.elementPicker;
    const el = pickedElement();
    if (!picker || !el) return;
    picker.name.textContent = describeElement(el);
    picker.narrower.disabled = state.elementTrailIndex === 0;
    picker.wider.disabled = !nextWiderElement();
    outlineElement(el);
    positionActionBar(picker.bar);
  }

  function closeElementPicker() {
    state.elementTrail = [];
    state.elementTrailIndex = 0;
    const picker = state.elementPicker;
    if (!picker || !picker.bar.classList.contains('show')) return;
    picker.bar.classList.remove('show');
    if (state.mode && !state.hidden) showTipForMode(state.mode);
  }

  async function pinElementPicker() {
    const el = pickedElement();
    closeElementPicker();
    if (!el || !isNodeConnected(el)) {
      showToast('That element is no longer on the page.');
      return;
    }
    await commitElementAnnotation(el);
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
    if (state.panel.style.display === 'none') setPanelOpen(true);
  }

  function focusListItem(id) {
    if (!state.panel) return;
    ensurePanelVisible();
    const list = state.panel.querySelector('.wn-annot-list');
    if (!list) return;
    state.focusedId = id;
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
    const accent = accentColor || (state.colors?.element?.base || '#8b5cf6');
    const flashColor = rgbaFromHex(accent, 0.6, 'rgba(139,92,246,0.6)');
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


  // What each kind is called, and the mark the eye reads before the words.
  const KIND_LABELS = {
    text: 'Text highlight',
    element: 'Element pin',
    screenshot: 'Region capture'
  };

  const KIND_ORDER = { text: 0, element: 1, screenshot: 2 };

  const LIST_SORTS = {
    oldest: (a, b) => a.createdAt - b.createdAt,
    newest: (a, b) => b.createdAt - a.createdAt,
    kind: (a, b) => (KIND_ORDER[a.type] ?? 3) - (KIND_ORDER[b.type] ?? 3) || a.createdAt - b.createdAt,
    page: (a, b) =>
      String(a.pageKey || '').localeCompare(String(b.pageKey || '')) || a.createdAt - b.createdAt
  };

  function kindIcon(type) {
    if (type === 'text') return iconPen();
    if (type === 'screenshot') return iconCamera();
    return iconTarget();
  }

  // The same icon markup goes on every card in the list, and parsing it again
  // for each of them is the most expensive thing a card does. It is parsed
  // once per shape and cloned after that.
  const iconNodes = new Map();
  function iconNode(markup) {
    let node = iconNodes.get(markup);
    if (!node) {
      const holder = document.createElement('div');
      holder.innerHTML = markup;
      node = holder.firstElementChild;
      iconNodes.set(markup, node);
    }
    return node.cloneNode(true);
  }

  // Two addresses over a set of two hundred notes, not two hundred of them.
  const pageLabels = new Map();

  // The element an element pin points at, in the terms it was stored in.
  function describeAnnotationTarget(ann) {
    const target = (ann && ann.target) || {};
    if (ann.type !== 'element') return '';
    if (target.css) return truncateText(target.css, 90);
    if (target.tag) return `<${target.tag}>`;
    if (target.xpath) return truncateText(target.xpath, 90);
    return '';
  }

  // The page a note belongs to, as the part of the address that distinguishes
  // it. A set can span pages; the panel never used to say which one.
  function describeAnnotationPage(ann) {
    const href = (ann && (ann.pageUrl || ann.pageKey)) || '';
    if (!href) return '';
    if (pageLabels.has(href)) return pageLabels.get(href);
    let label;
    try {
      const url = new URL(href, window.location.href);
      label = truncateText(`${url.pathname || '/'}${url.search || ''}`, 60);
    } catch (err) {
      label = truncateText(href, 60);
    }
    pageLabels.set(href, label);
    return label;
  }

  function isOnThisPage(ann) {
    return (ann && ann.pageKey) === normalizePageKey(window.location.href);
  }

  // Where a server is named, whether it has this note. The snapshot holds the
  // id of everything the server took, and the pending set the ids a change is
  // still owed for -- an edit leaves the id in the snapshot and the note
  // unsent, and those are not the same answer.
  function syncStateOf(ann) {
    if (!server) return '';
    if (state.syncPending.has(ann.id)) return 'pending';
    return syncedSnapshot.has(ann.id) ? 'sent' : 'local';
  }

  const SYNC_FACTS = {
    sent: 'On the server',
    pending: 'Not sent yet',
    local: 'Only in this browser'
  };

  // One formatter each, built on the first card and kept. Asking a date to
  // format itself with options builds one of these behind the call, and a
  // long list asks twice per card.
  let stampFormats = null;
  function formatStamp(value) {
    if (!stampFormats) {
      stampFormats = {
        date: new Intl.DateTimeFormat(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }),
        time: new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' })
      };
    }
    const at = new Date(value);
    return `${stampFormats.date.format(at)} \u2022 ${stampFormats.time.format(at)}`;
  }

  function addFact(row, label, value, className) {
    if (!value) return;
    const chip = document.createElement('div');
    chip.className = className ? `wn-annot-fact ${className}` : 'wn-annot-fact';
    const name = document.createElement('b');
    name.textContent = label;
    chip.appendChild(name);
    chip.appendChild(document.createTextNode(value));
    chip.title = `${label} ${value}`;
    row.appendChild(chip);
  }

  // Everything one annotation holds, in one card. The rail draws the part of
  // it that fits in 360px and the full-size view draws all of it; which is
  // which is the stylesheet's to decide, so a change of view moves no DOM.
  function buildCard(ann, number) {
    const item = document.createElement('div');
    item.className = 'wn-annot-item';
    item.dataset.id = ann.id;
    item.tabIndex = -1;
    if (state.focusedId === ann.id) item.classList.add('is-focused');
    applyItemAccent(item, getAnnotationColors(ann));

    const top = document.createElement('div');
    top.className = 'wn-annot-card-top';
    const topLeft = document.createElement('div');
    topLeft.className = 'wn-annot-card-top-left';

    const kindLabel = KIND_LABELS[ann.type] || KIND_LABELS.element;
    const kind = document.createElement('div');
    kind.className = 'wn-annot-kind';
    kind.title = kindLabel;
    kind.appendChild(iconNode(kindIcon(ann.type)));
    const kindName = document.createElement('span');
    kindName.className = 'wn-annot-kind-label';
    kindName.textContent = kindLabel;
    kind.appendChild(kindName);
    topLeft.appendChild(kind);

    const numberEl = document.createElement('div');
    numberEl.className = 'wn-annot-number';
    numberEl.textContent = `#${number}`;
    topLeft.appendChild(numberEl);
    if (ann.status === 'missing') {
      const missing = document.createElement('div');
      missing.className = 'wn-annot-missing';
      missing.textContent = 'Missing';
      topLeft.appendChild(missing);
    }
    const meta = document.createElement('div');
    meta.className = 'wn-annot-meta';
    meta.textContent = formatStamp(ann.createdAt);
    topLeft.appendChild(meta);

    const topRight = document.createElement('div');
    topRight.className = 'wn-annot-card-top-right';
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'wn-annot-edit wn-annotator';
    editBtn.setAttribute('aria-label', 'Edit this annotation');
    editBtn.appendChild(iconNode(iconEdit()));
    editBtn.addEventListener('click', async (evt) => {
      evt.stopPropagation();
      await editAnnotation(ann.id);
    });
    topRight.appendChild(editBtn);
    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'wn-annot-delete wn-annotator';
    deleteBtn.setAttribute('aria-label', 'Delete this annotation');
    deleteBtn.appendChild(iconNode(iconTrash()));
    deleteBtn.addEventListener('click', (evt) => {
      evt.stopPropagation();
      deleteAnnotation(ann.id);
    });
    topRight.appendChild(deleteBtn);
    top.appendChild(topLeft);
    top.appendChild(topRight);
    item.appendChild(top);

    const comment = document.createElement('div');
    comment.className = 'wn-annot-comment';
    const commentText = ann.comment || '\u2014';
    comment.textContent = commentText;
    item.appendChild(comment);

    const showMore = document.createElement('button');
    showMore.type = 'button';
    showMore.className = 'wn-annot-showmore wn-annotator';
    showMore.textContent = 'See more';
    showMore.addEventListener('click', (evt) => {
      evt.stopPropagation();
      const expanded = comment.classList.toggle('expanded');
      showMore.textContent = expanded ? 'See less' : 'See more';
    });
    if (commentText.length < 160) showMore.style.display = 'none';
    item.appendChild(showMore);

    const detail = document.createElement('div');
    detail.className = 'wn-annot-detail';
    const snippet = (ann.snippet || '').trim();
    if (snippet) {
      const quote = document.createElement('div');
      quote.className = 'wn-annot-quote';
      quote.textContent = snippet;
      detail.appendChild(quote);
    }
    const targetText = describeAnnotationTarget(ann);
    if (targetText) {
      const target = document.createElement('div');
      target.className = 'wn-annot-target';
      target.textContent = targetText;
      target.title = targetText;
      detail.appendChild(target);
    }
    item.appendChild(detail);

    const shotSrc = screenshotSrc(ann);
    if (shotSrc) {
      const shotWrap = document.createElement('div');
      shotWrap.className = 'wn-annot-shot is-pending';
      const shotImg = document.createElement('img');
      shotImg.alt = 'The screenshot of this annotation';
      shotImg.addEventListener('click', (evt) => {
        evt.stopPropagation();
        openScreenshotLightbox(shotSrc);
      });
      shotWrap.appendChild(shotImg);
      item.appendChild(shotWrap);
      observeShot(shotWrap);
    }

    const facts = document.createElement('div');
    facts.className = 'wn-annot-facts';
    addFact(facts, 'Page', describeAnnotationPage(ann), isOnThisPage(ann) ? 'is-page' : 'is-page is-elsewhere');
    if (ann.updatedAt && ann.updatedAt > ann.createdAt) {
      addFact(facts, 'Edited', formatStamp(ann.updatedAt));
    }
    const sync = syncStateOf(ann);
    if (sync) addFact(facts, '', SYNC_FACTS[sync], `is-${sync}`);
    // An import can carry these and the widget reads neither. Showing what
    // arrived is honest; offering to edit it would not be.
    if (ann.author) addFact(facts, 'Author', truncateText(String(ann.author), 40));
    if (ann.priority) addFact(facts, 'Priority', truncateText(String(ann.priority), 20));
    item.appendChild(facts);

    item.addEventListener('click', () => {
      focusAnnotation(ann.id, true, ann.pageUrl, ann.pageKey);
      // The sheet covers the page it is pointing at, so it steps aside. The
      // full-size view covers it too, and falls back to the rail rather than
      // closing: the list is still what the reviewer is working through.
      if (isCompactLayout()) setPanelOpen(false);
      else if (isFullView()) setPanelView('rail', { remember: false });
    });
    return item;
  }

  // A picture is a data URL in storage, and a set of them is more than a
  // browser should decode to draw a list nobody has scrolled to yet. Each is
  // asked for when the card holding it comes near the viewport -- which a
  // closed panel never does, so a panel nobody opened decodes nothing at all.
  function observeShot(wrap) {
    const observer = ensureShotObserver();
    if (!observer) {
      loadShot(wrap);
      return;
    }
    observer.observe(wrap);
  }

  function ensureShotObserver() {
    if (state.shotObserver) return state.shotObserver;
    if (typeof IntersectionObserver !== 'function' || !state.panel) return null;
    const list = state.panel.querySelector('.wn-annot-list');
    if (!list) return null;
    state.shotObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          loadShot(entry.target);
        });
      },
      { root: list, rootMargin: '400px 0px' }
    );
    return state.shotObserver;
  }

  function loadShot(wrap) {
    const img = wrap.firstElementChild;
    if (!img || img.getAttribute('src')) return;
    const item = wrap.parentNode;
    const ann = state.annotations.find((one) => one.id === (item && item.dataset.id));
    const src = ann && screenshotSrc(ann);
    if (!src) return;
    img.src = src;
    wrap.classList.remove('is-pending');
  }

  // An observer holds what it watches, so a card that leaves the list has to
  // hand its picture back or the set only ever grows.
  function releaseCard(entry) {
    if (entry && entry.shot && state.shotObserver) state.shotObserver.unobserve(entry.shot);
  }

  // Everything one search reads. The snippet was searchable and invisible; the
  // rest of it was neither.
  function searchHaystack(ann) {
    return `${ann.comment || ''} ${ann.snippet || ''} ${KIND_LABELS[ann.type] || ''} ${
      describeAnnotationTarget(ann)
    } ${ann.pageUrl || ''} ${ann.author || ''} ${ann.priority || ''}`.toLowerCase();
  }

  // A bulk sync answers one request per annotation, and each answer changes
  // one card. Rendering on every one of them would run the list as many times
  // as there are notes; this runs it once for the frame.
  function queueListRender() {
    if (state.listRenderQueued || !state.panel) return;
    state.listRenderQueued = true;
    requestAnimationFrame(() => {
      state.listRenderQueued = false;
      if (state.panel) renderList();
    });
  }

  // Whether the set is about more than the page being read. The widget
  // follows route changes, so it can hold notes made anywhere on the site.
  function spansPages() {
    const pages = new Set();
    for (const ann of state.annotations) {
      if (!isOnThisPage(ann)) return true;
      pages.add(ann.pageKey);
      if (pages.size > 1) return true;
    }
    return false;
  }

  function bandKey(ann, group) {
    return group === 'kind' ? `kind:${ann.type}` : `page:${ann.pageKey || ''}`;
  }

  function bandLabel(ann, group) {
    if (group === 'kind') return KIND_LABELS[ann.type] || KIND_LABELS.element;
    return describeAnnotationPage(ann) || 'This page';
  }

  function bandFor(key, label, tally) {
    let node = state.bands.get(key);
    if (!node) {
      node = document.createElement('div');
      node.className = 'wn-annot-band';
      const name = document.createElement('span');
      name.className = 'wn-annot-band-name';
      const count = document.createElement('span');
      count.className = 'wn-annot-band-count';
      node.appendChild(name);
      node.appendChild(count);
      state.bands.set(key, node);
    }
    node.firstChild.textContent = label;
    node.lastChild.textContent = tally;
    return node;
  }

  // A long list is not only a pointer's to walk. One card at a time is in the
  // tab order -- two hundred tab stops is not a keyboard path -- and the
  // arrows step from there.
  function onListKey(evt) {
    const item = evt.target.closest && evt.target.closest('.wn-annot-item');
    if (!item) return;
    if (evt.key === 'Enter' || evt.key === ' ') {
      // A button inside the card answers for itself.
      if (evt.target !== item) return;
      evt.preventDefault();
      item.click();
      return;
    }
    const steps = { ArrowDown: 1, ArrowUp: -1 };
    if (!(evt.key in steps) && evt.key !== 'Home' && evt.key !== 'End') return;
    const items = Array.from(evt.currentTarget.querySelectorAll('.wn-annot-item'));
    const at = items.indexOf(item);
    const next =
      evt.key === 'Home'
        ? items[0]
        : evt.key === 'End'
        ? items[items.length - 1]
        : items[at + steps[evt.key]];
    if (!next || next === item) return;
    evt.preventDefault();
    item.tabIndex = -1;
    next.tabIndex = 0;
    next.focus();
  }

  function emptyNote(message) {
    const empty = document.createElement('div');
    empty.className = 'wn-annot-empty';
    empty.textContent = message;
    return empty;
  }

  // Everything a card draws, in one string. Two renders that agree on it would
  // have built the same card, so the one already on the page is kept: an edit,
  // a delete, a keystroke in the search box or an answer from the server
  // rebuilds the cards it changed and leaves a long list alone.
  function cardKey(ann, number) {
    const shot = ann.screenshot;
    return [
      number,
      ann.type,
      ann.status || '',
      ann.comment || '',
      ann.snippet || '',
      ann.createdAt,
      ann.updatedAt || '',
      ann.author || '',
      ann.priority || '',
      ann.pageUrl || '',
      isOnThisPage(ann) ? '1' : '0',
      describeAnnotationTarget(ann),
      shot ? shot.url || `inline:${(shot.dataUrl || '').length}` : '',
      syncStateOf(ann)
    ].join('\u001f');
  }

  function cardFor(ann, number) {
    const key = cardKey(ann, number);
    const held = state.cards.get(ann.id);
    if (held && held.key === key) return held.node;
    releaseCard(held);
    const node = buildCard(ann, number);
    state.cards.set(ann.id, { key, node, shot: node.querySelector('.wn-annot-shot') });
    return node;
  }

  // Put the wanted nodes in the wanted order with the fewest moves, rather
  // than emptying the list and building it again.
  function reconcileList(list, wanted) {
    let node = list.firstChild;
    for (const next of wanted) {
      if (node === next) {
        node = node.nextSibling;
        continue;
      }
      list.insertBefore(next, node);
    }
    while (node) {
      const spent = node;
      node = node.nextSibling;
      list.removeChild(spent);
    }
  }

  // A card a search hid is worth keeping; a card whose annotation is gone is
  // not, and holding it would grow the map for the life of the page.
  function pruneCards() {
    if (state.cards.size === state.annotations.length) return;
    const live = new Set(state.annotations.map((ann) => ann.id));
    state.cards.forEach((entry, id) => {
      if (live.has(id)) return;
      releaseCard(entry);
      state.cards.delete(id);
    });
  }

  // Rebuild the side panel list with filtering and numbering
  function renderList() {
    const list = state.panel.querySelector('.wn-annot-list');
    const title = state.panel.querySelector('h3');
    // The number on a card is the number on its marker, and the marker counts
    // from the order the notes were made in. A filtered list used to renumber
    // itself, so the card and the mark on the page disagreed.
    const numbers = new Map();
    state.annotations.forEach((ann, idx) => numbers.set(ann.id, idx + 1));
    const query = state.filters.query;
    // The rail holds one column and reads in the order the notes were made
    // in; sorting and grouping are the full-size view's, where the controls
    // for them are drawn.
    const full = isFullView();
    const sort = (full && LIST_SORTS[state.filters.sort]) || LIST_SORTS.oldest;
    const group = full ? state.filters.group : 'none';
    const filtered = state.annotations
      .filter((ann) => !query || searchHaystack(ann).includes(query))
      .sort(sort);
    if (title) title.textContent = `Annotations (${filtered.length})`;
    list.classList.toggle('is-multipage', spansPages());
    let wanted;
    if (!state.annotations.length) {
      wanted = [emptyNote('No annotations yet.')];
    } else if (!filtered.length) {
      wanted = [emptyNote('No annotation matches that search.')];
    } else if (group === 'none') {
      wanted = filtered.map((ann) => cardFor(ann, numbers.get(ann.id)));
    } else {
      const bands = new Map();
      filtered.forEach((ann) => {
        const key = bandKey(ann, group);
        let bucket = bands.get(key);
        if (!bucket) {
          bucket = { label: bandLabel(ann, group), items: [] };
          bands.set(key, bucket);
        }
        bucket.items.push(ann);
      });
      wanted = [];
      bands.forEach((bucket, key) => {
        wanted.push(bandFor(key, bucket.label, bucket.items.length));
        bucket.items.forEach((ann) => wanted.push(cardFor(ann, numbers.get(ann.id))));
      });
    }
    reconcileList(list, wanted);
    const cards = wanted.filter((node) => node.classList.contains('wn-annot-item'));
    const stop = cards.find((node) => node.dataset.id === state.focusedId) || cards[0];
    cards.forEach((node) => {
      node.tabIndex = node === stop ? 0 : -1;
    });
    pruneCards();
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
    ann.updatedAt = Date.now();
    saveAnnotations();
    renderList();
  }

  async function deleteAllAnnotations() {
    if (!state.annotations.length) return;
    const confirmDelete = await confirmDialog('Delete all annotations?', 'Delete');
    if (!confirmDelete) return;
    state.annotations = [];
    // The snapshot keeps every id until the server takes the delete, so a
    // reload before it does still owes the server the same request.
    persistAnnotations();
    if (server) remoteDeleteAll();
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

  // The share sheet is how a phone hands a file to another application. Where
  // there is none -- or where it refuses files, or fails -- this is the same
  // download anchor the desktop has always used.
  async function shareAnnotations() {
    const name = buildFilename();
    const data = JSON.stringify(buildAnnotationsPayload(), null, 2);
    if (navigator.share && navigator.canShare && typeof File === 'function') {
      const file = new File([data], name, { type: 'application/json' });
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: name });
          return;
        }
      } catch (err) {
        // A dismissed share sheet is an answer, not a failure.
        if (err && err.name === 'AbortError') return;
      }
    }
    exportAnnotations();
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
    window.location.href = `mailto:${encodeURIComponent(mailTo)}?subject=${subject}&body=${body}`;
  }

  // A uuid, because two browsers that both write while the server is away
  // settle their sets against each other when it comes back, and an id drawn
  // from six characters of Math.random collides often enough over a review to
  // merge one reviewer's note onto another's. crypto.randomUUID wants a secure
  // context, which an http review host is not, so the same 122 bits come from
  // getRandomValues there.
  function generateId() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  function generateImportFileId() {
    return 'imp-' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  }

  function buildFilename() {
    // Builds a readable filename: title or host, then the date and the time without seconds
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
  function iconClose() {
    return iconSvg(`
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    `);
  }
  function iconExpand() {
    return iconSvg(`
      <path d="M4 9v-4a1 1 0 0 1 1 -1h4" />
      <path d="M20 9v-4a1 1 0 0 0 -1 -1h-4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1 -1 1h-4" />
    `);
  }
  function iconCollapse() {
    return iconSvg(`
      <path d="M9 4v4a1 1 0 0 1 -1 1h-4" />
      <path d="M15 4v4a1 1 0 0 0 1 1h4" />
      <path d="M9 20v-4a1 1 0 0 0 -1 -1h-4" />
      <path d="M15 20v-4a1 1 0 0 1 1 -1h4" />
    `);
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
  let storageWarned = false;

  // How often the server is asked whether it is there, and how the asking
  // slows down while it is not. A server that comes back has nothing to say
  // to a browser that never asks again, and a reviewer who is reading rather
  // than writing gives it no other reason to.
  const HEALTH_INTERVAL = 300000;
  const HEALTH_BACKOFF_MIN = 10000;
  const HEALTH_BACKOFF_MAX = HEALTH_INTERVAL;
  let healthTimer = null;
  let healthBackoff = HEALTH_BACKOFF_MIN;
  // Emptied when a server answers 404 to /health, which a server written
  // against version 1 of the protocol does, and the probe falls back to the
  // read that has always been in it.
  let healthPath = '/health';

  // One line per state, because a single line covering three of them tells a
  // reviewer nothing about the one they are looking at.
  const SYNC_STATUS_TIPS = {
    pending: 'Checking the server',
    ok: 'Server connected',
    refused: 'Server refused it: check the address or the key',
    unreachable: 'Server unreachable: notes are held here until it answers'
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
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      throw err;
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

  function healthUrl() {
    return healthPath ? `${server.url}${healthPath}` : annotationsUrl();
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

  // What the server agreed to, one entry per annotation, kept as a digest and
  // not as the body it came from. The snapshot is only ever compared, never
  // sent, and it outlives the tab in localStorage beside the set: holding the
  // bodies there would put every annotation in storage twice, and an inline
  // screenshot is large enough that the second copy is what runs the browser
  // out of room.
  function snapshotOf(annotations) {
    return new Map(annotations.map((ann) => [ann.id, digestOf(ann)]));
  }

  // Length and an FNV-1a hash of the JSON. This settles whether a body changed
  // under this browser, not whether someone forged one, so 32 bits and the
  // length behind them are enough.
  function digestOf(annotation) {
    const body = typeof annotation === 'string' ? annotation : JSON.stringify(annotation);
    let hash = 0x811c9dc5;
    for (let i = 0; i < body.length; i += 1) {
      hash ^= body.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return `${body.length}:${hash.toString(36)}`;
  }

  // Answering a queue of requests moves the snapshot and leaves the set alone,
  // and the set is the large half. Writing it once per request would put the
  // whole of a review through JSON.stringify for each note that goes up.
  function persistSnapshot() {
    try {
      localStorage.setItem(syncedStorageKey, JSON.stringify(Array.from(syncedSnapshot)));
    } catch (err) {
      console.warn('Annotator storage save error', err);
      warnStorage();
    }
  }

  // False when this browser has no record of ever having synced this site. The
  // set beside it is then a set written before a server was named, and it is
  // the reviewer's alone: the pull adopts the server's set rather than pushing
  // private notes onto a shared one.
  function loadSyncedSnapshot() {
    let stored = null;
    try {
      stored = localStorage.getItem(syncedStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      syncedSnapshot = new Map(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      // An unreadable snapshot means every note looks unsent. The set goes up
      // again, which the server takes, rather than staying here unsent.
      console.warn('Uxnote sync: the stored server snapshot is unreadable', err);
      syncedSnapshot = new Map();
    }
    return stored !== null;
  }

  // One toast per run of failures: the second one says nothing the first did
  // not. The next request that succeeds arms it again.
  function warnSync(message, err) {
    console.warn('Uxnote sync:', message, err);
    if (syncWarned) return;
    syncWarned = true;
    showToast(message);
  }

  // The set no longer fits in this browser. Saying it once is the whole of
  // what the widget can do: the reviewer decides what to delete or export.
  function warnStorage() {
    if (storageWarned) return;
    storageWarned = true;
    showToast('Uxnote: this browser has no room left, so notes are not kept for a reload');
  }

  function enqueueSync(run) {
    syncQueue = syncQueue.then(run, run);
    return syncQueue;
  }

  async function remotePull() {
    if (!server) return;
    let payload;
    try {
      const res = await syncFetch(annotationsUrl(), { headers: syncHeaders({ Accept: 'application/json' }) });
      try {
        payload = await res.json();
      } catch (err) {
        // An answer that is not the annotation set means the address is
        // serving something else, which is the reviewer's to fix.
        setSyncStatus('refused');
        throw err;
      }
    } catch (err) {
      // The set that is on the screen came from this browser's copy, and it
      // stays on the screen. A server that did not answer has said nothing
      // about it.
      warnSync('Uxnote: could not read the annotations from the server', err);
      // The set the hop points into is this browser's copy, and it is already
      // drawn, so the hop lands on it rather than being spent on nothing.
      focusPendingAnnotation();
      return;
    }
    const pulled = ((payload && payload.annotations) || []).filter(isStoredAnnotation);
    pulled.forEach((ann) => {
      if (!ann.pageKey) {
        ann.pageKey = normalizePageKey(ann.pageUrl || window.location.href);
      }
    });
    reconcile(pulled);
    syncWarned = false;
    persistAnnotations();
    clearRenderedAnnotations();
    restoreAnnotations();
    renumberMarkers();
    renderList();
    // Whatever the reconciliation kept as this browser's own is owed to the
    // server, and this is the first moment it can be sent.
    syncAnnotations();
    // The hop that a card on another page starts lands here, because the set
    // it points into is only settled once the pull has answered.
    focusPendingAnnotation();
  }

  // Three sets meet: what this browser holds, the digests of what it last saw
  // the server agree to, and what the server holds now. The digests are what
  // tell the two kinds of difference apart. An id the snapshot knows, matching
  // the body it knows, gone from the server: another reviewer deleted it, and
  // it goes. An id the snapshot does not know, or knows with a different body:
  // this browser wrote it while the server was away, and it stays and is sent.
  //
  // The snapshot then becomes the server's set outright, so syncAnnotations
  // derives every request owed -- a note written here, a note edited here, a
  // note deleted here that the server still holds -- from the same diff it
  // runs after any other change.
  function reconcile(pulled) {
    const remote = new Map(pulled.map((ann) => [ann.id, ann]));
    const kept = [];
    const keptIds = new Set();
    state.annotations.forEach((ann) => {
      const agreed = syncedSnapshot.get(ann.id);
      if (agreed === undefined || agreed !== digestOf(ann)) {
        kept.push(ann);
        keptIds.add(ann.id);
        return;
      }
      const fromServer = remote.get(ann.id);
      if (fromServer) {
        kept.push(fromServer);
        keptIds.add(ann.id);
      }
    });
    pulled.forEach((ann) => {
      if (!keptIds.has(ann.id)) kept.push(ann);
    });
    state.annotations = kept;
    syncedSnapshot = snapshotOf(pulled);
  }

  // The probe exists for the server that comes back while nobody is writing.
  // Nothing else would ask it: the queue only moves when a note does, so
  // without this the dot stays red and the unsent notes stay unsent until the
  // reviewer happens to type.
  async function probeHealth() {
    try {
      const res = await syncFetch(healthUrl(), { headers: syncHeaders({ Accept: 'application/json' }) });
      try {
        await res.json();
      } catch (err) {
        // A 200 of HTML is a website at that address, not this API, and a
        // probe that took the status code alone would paint the dot green
        // over a read that is failing on the same address.
        setSyncStatus('refused');
        return false;
      }
      return true;
    } catch (err) {
      // A server built against version 1 of the protocol has no /health. It
      // answers 404 once, and every probe after this one is the read.
      if (healthPath && err.status === 404) {
        healthPath = '';
        return probeHealth();
      }
      return false;
    }
  }

  async function runHealthCheck(first) {
    healthTimer = null;
    const wasReachable = state.syncStatus === 'ok';
    const reachable = await probeHealth();
    if (!reachable) {
      scheduleHealthCheck(healthBackoff);
      healthBackoff = Math.min(healthBackoff * 2, HEALTH_BACKOFF_MAX);
      return;
    }
    healthBackoff = HEALTH_BACKOFF_MIN;
    scheduleHealthCheck(HEALTH_INTERVAL);
    // The pull at boot is init's, so the first probe only reports. Past it, a
    // server that was not answering and now is has a set this browser has not
    // read and notes it has not been given.
    if (!first && !wasReachable) enqueueSync(remotePull);
  }

  function scheduleHealthCheck(delay) {
    if (healthTimer) clearTimeout(healthTimer);
    // On the queue with the writes, so a probe never lands the dot on an
    // answer that a request in flight is about to contradict.
    healthTimer = setTimeout(() => enqueueSync(() => runHealthCheck(false)), delay);
  }

  function startHealthLoop() {
    if (!server) return;
    enqueueSync(() => runHealthCheck(true));
  }

  function syncAnnotations() {
    if (!server) return;
    const next = new Map(state.annotations.map((ann) => [ann.id, JSON.stringify(ann)]));
    next.forEach((body, id) => {
      if (syncedSnapshot.get(id) === digestOf(body)) return;
      state.syncPending.add(id);
      enqueueSync(() => remoteUpsert(id, body));
    });
    syncedSnapshot.forEach((digest, id) => {
      if (!next.has(id)) enqueueSync(() => remoteDelete(id));
    });
  }

  // A picture written while the server was down is still inline. It goes up
  // as a PNG before the annotation that points at it, so what reaches the
  // server is the same shape either way and no annotation carries a base64
  // document in its body.
  async function uploadInlineScreenshot(ann) {
    const shot = ann && ann.screenshot;
    if (!shot || !shot.dataUrl) return false;
    const res = await fetch(shot.dataUrl);
    const blob = await res.blob();
    const uploaded = await uploadScreenshot(blob, ann.id, { rethrow: true });
    if (!uploaded) throw new Error('the screenshot upload answered with no address');
    ann.screenshot = { url: uploaded.url, w: shot.w, h: shot.h, capturedAt: shot.capturedAt };
    return true;
  }

  // A failed upsert waits for the next change to be retried. On a desktop
  // there usually is one; on a phone the tab goes to a lock screen or a task
  // switcher with the note still unsent, and no next change ever comes. These
  // are the three moments left to spend it in.
  function bindSyncFlush() {
    if (!server) return;
    window.addEventListener('online', () => syncAnnotations());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushSyncNow();
    });
    // `pagehide` and not `beforeunload`, which iOS does not fire reliably.
    window.addEventListener('pagehide', flushSyncNow);
  }

  // On the way out the queue is bypassed and the requests are marked
  // `keepalive`: a plain fetch is killed with the page, and anything waiting
  // behind one in the queue would never be issued at all.
  function flushSyncNow() {
    if (!server) return;
    // The same diff syncAnnotations runs: the snapshot holds digests, so what
    // is compared and what is sent are not the same string.
    const next = new Map(state.annotations.map((ann) => [ann.id, JSON.stringify(ann)]));
    next.forEach((body, id) => {
      if (syncedSnapshot.get(id) !== digestOf(body)) remoteUpsert(id, body, { keepalive: true });
    });
    syncedSnapshot.forEach((digest, id) => {
      if (!next.has(id)) remoteDelete(id, { keepalive: true });
    });
  }

  // A failed request leaves the snapshot stale, so the next change sends it
  // again -- and so does the next pull, and the next probe that finds the
  // server back, and the next load of the page, because the snapshot is in
  // localStorage beside the set it disagrees with.
  async function remoteUpsert(id, body, options = {}) {
    try {
      const ann = state.annotations.find((one) => one.id === id);
      // The upload rewrites the picture from a base64 document into an
      // address, so unlike every other request this one changes the set and
      // not only the snapshot. Writing the snapshot alone would leave the
      // browser holding the inline copy it just replaced.
      const uploaded = ann && ann.screenshot && ann.screenshot.dataUrl;
      if (uploaded) {
        await uploadInlineScreenshot(ann);
        body = JSON.stringify(ann);
      }
      await syncFetch(annotationUrl(id), {
        method: 'PUT',
        headers: syncHeaders({ 'Content-Type': 'application/json' }),
        keepalive: !!options.keepalive,
        body
      });
      syncedSnapshot.set(id, digestOf(body));
      state.syncPending.delete(id);
      queueListRender();
      syncWarned = false;
      if (uploaded) persistAnnotations();
      else persistSnapshot();
    } catch (err) {
      warnSync('Uxnote: could not save this annotation on the server', err);
    }
  }

  async function remoteDelete(id, options = {}) {
    try {
      await syncFetch(annotationUrl(id), {
        method: 'DELETE',
        headers: syncHeaders(),
        keepalive: !!options.keepalive
      });
      syncedSnapshot.delete(id);
      syncWarned = false;
      persistSnapshot();
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
        persistSnapshot();
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

  // What the camera frames on a coarse pointer: the part of the page that is
  // on the screen. Scrolling is the framing gesture, so there is nothing to
  // drag, no precision to find, and no overlay to be trapped in.
  function viewportCaptureRect() {
    const root = document.documentElement;
    return { x: window.scrollX, y: window.scrollY, w: root.clientWidth, h: root.clientHeight };
  }

  // snapdom renders the whole document before the crop comes out of it, which
  // is the most expensive thing the widget does -- a long page on a mid
  // Android can sit on it. The wait is bounded rather than open, and what
  // happened is said out loud.
  const CAPTURE_TIMEOUT_MS = 20000;

  function captureWithGuard(rect) {
    const render = captureRegion(rect).then(
      (shot) => ({ shot }),
      (err) => {
        console.warn('Uxnote screenshot:', err);
        return { shot: null };
      }
    );
    const guard = new Promise((resolve) => {
      setTimeout(() => resolve({ shot: null, timedOut: true }), CAPTURE_TIMEOUT_MS);
    });
    return Promise.race([render, guard]);
  }

  // The camera is a capture mode like the other two: the reviewer frames a
  // region, comments on it, and the picture is the annotation.
  async function captureRegionAnnotation() {
    if (!captureAvailable() || state.mode === 'screenshot') return;
    // The mode stands until the annotation is written or the reviewer stops,
    // the way it does for a highlight and for an element.
    setMode('screenshot');
    try {
      // The drag is a mouse gesture and the overlay it lived in read nothing
      // else: a touch drag framed nothing, opened nothing, and left the
      // reviewer inside an overlay whose only way out named the Escape key.
      const rect = isTouchInput() ? viewportCaptureRect() : await selectRegion();
      if (!rect) return;
      // The picture is of the page the drag was released on, and it is taken
      // while the comment is being written, so releasing the drag opens the
      // prompt as directly as releasing a selection does.
      const pending = captureWithGuard(rect);
      const res = await awaitComment('Comment for this region?');
      if (!res) return;
      const { shot, timedOut } = await pending;
      if (!shot) {
        showToast(
          timedOut ? 'Uxnote: the page took too long to capture' : 'Uxnote: could not capture that region'
        );
        return;
      }
      const { comment } = res;
      const id = generateId();
      // The picture rides on the annotation until a server takes it off. A
      // server that is not answering used to throw the whole capture away,
      // while a text or an element note written in the same minute was kept
      // and sent again later; there is no reason for the third kind to be the
      // one that loses the reviewer's work.
      let stored = { dataUrl: shot.canvas.toDataURL('image/png'), w: shot.w, h: shot.h, capturedAt: Date.now() };
      if (server) {
        const blob = await new Promise((done) => shot.canvas.toBlob(done, 'image/png'));
        const uploaded = blob ? await uploadScreenshot(blob, id) : null;
        if (uploaded) {
          stored = { url: uploaded.url, w: shot.w, h: shot.h, capturedAt: Date.now() };
        } else {
          showToast('Uxnote: the picture stays on this device until the server answers');
        }
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
  async function uploadScreenshot(blob, id, opts = {}) {
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
      // The capture path takes a null and keeps the picture inline. The sync
      // path needs the throw, so the annotation stays unsent and is tried
      // again rather than being marked delivered without its picture.
      if (opts.rethrow) throw err;
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
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'wn-shot-lightbox-close wn-annotator';
    closeBtn.setAttribute('aria-label', 'Close the screenshot');
    closeBtn.innerHTML = iconClose();
    box.appendChild(closeBtn);
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
    closeBtn.addEventListener('click', close);
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
