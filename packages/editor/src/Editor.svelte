<script>
  import { deriveRenderPlan, renderSvg, printableArea, surfaceFromPreset } from "@mondrian/matrix";
  import { onMount } from "svelte";
  import { FORMATS, formatFrame, formatSearch, liquidFillSvg } from "./formats.js";

  import { VARIATIONS, readVariation, variationSearch, variationWork, normalizeVariation } from "./variations.js";
  import { CORNERS, resizeCorner, customSelection, restoreSelection } from "./resize.js";

  // Receive the measured work from Astro; matrix owns geometry and SVG generation.
  let { work, galleryHref, galleryIndexHref } = $props();
  const surface = surfaceFromPreset("sticker-50");
  const area = printableArea(surface);
  // Derive the initial frame from the reactive work prop; edits override it.
  let editedSelection = $state(null);
  let selection = $derived(editedSelection ?? formatFrame(work, "original", surface));
  let formatId = $derived(selection.formatId);
  let studyHref = $state("");
  let stage;
  let drag = null;
  const cornerLabels = { nw: "Top left", ne: "Top right", sw: "Bottom left", se: "Bottom right" };
  let variationId = $state("original");
  let variedWork = $derived(variationWork(work, variationId));
  let svg = $derived(liquidFillSvg(renderSvg(deriveRenderPlan(variedWork))));

  function chooseVariation(id) {
    if (drag) return;
    variationId = normalizeVariation(id);
    const url = new URL(window.location.href);
    url.search = variationSearch(url.search, variationId);
    window.history.replaceState(window.history.state, "", url);
    syncStudyLink(url.search);
  }

  function syncStudyLink(search) {
    const link = new URL(galleryHref, window.location.href);
    link.search = search;
    studyHref = link.href;
  }

  function writeSelection(next) {
    const url = new URL(window.location.href);
    url.search = formatSearch(url.search, next);
    window.history.replaceState(window.history.state, "", url);
    syncStudyLink(url.search);
  }

  function chooseFormat(id) {
    if (drag) return;
    editedSelection = formatFrame(work, id, surface);
    writeSelection(selection);
  }

  function startResize(event, corner) {
    if (drag || event.button !== 0) return;
    const bounds = stage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag = { pointerId: event.pointerId, corner, startX: event.clientX,
      startY: event.clientY, bounds, initial: $state.snapshot(selection) };
  }

  function moveResize(event) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const dx = (event.clientX - drag.startX) / drag.bounds.width;
    const dy = (event.clientY - drag.startY) / drag.bounds.height;
    if (!dx && !dy) { editedSelection = drag.initial; return; }
    editedSelection = customSelection(resizeCorner(drag.initial.frame, drag.corner, dx, dy, area), surface);
  }

  function finishResize(event, cancel = false) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const initial = drag.initial;
    drag = null;
    if (cancel) editedSelection = initial;
    else if (selection.formatId === "custom") writeSelection(selection);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function resizeByKey(event, corner) {
    const directions = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = directions[event.key];
    if (!direction || drag) return;
    event.preventDefault();
    const step = event.shiftKey ? 0.05 : 0.01;
    editedSelection = customSelection(resizeCorner(selection.frame, corner, direction[0] * step, direction[1] * step, area), surface);
    writeSelection(selection);
  }

  onMount(() => {
    // Browser URL is authoritative for the statically generated Create route.
    function restoreFormat() {
      drag = null;
      editedSelection = restoreSelection(work, window.location.search, surface);
      variationId = readVariation(window.location.search);
      syncStudyLink(window.location.search);
    }
    restoreFormat();
    window.addEventListener("popstate", restoreFormat);
    return () => window.removeEventListener("popstate", restoreFormat);
  });

  // Each group describes a menu title and its options. Nested each blocks render the controls.
  // Format and geometric Variations are active; other controls remain placeholders.
  const groups = [
    { title: "Surface", options: ["Sticker 50 × 50 mm", "Sticker 70 × 70 mm", "Sticker 100 × 70 mm", "A6", "A5", "A4", "Landscape", "Digital square", "Digital 4:5", "Digital 16:9", "Digital 9:16", "Custom surface"] },
    { title: "Format", options: ["Original", "1:1", "5:4", "4:5", "16:9", "9:16", "Custom"] },
    { title: "Variations", options: ["Original", "Mirror horizontal", "Mirror vertical", "Rotate 180°", "Invert contrast"] },
    { title: "Colour and lines", options: ["Hue", "Invert palette", "Line weight"] },
    { title: "Plane clip lab", options: ["Rectangle", "Circle", "Triangle"] },
  ];
</script>

<!-- Named sections associate their visible headings with assistive technology. -->
<section class="editor-study" aria-labelledby="editor-title">
  <header class="editor-study__header">
    <div class="editor-title-block">
      <h1 id="editor-title">Create your composition</h1>
      <p>{work.title} · {work.year}</p>
      <p class="notice">Drag a corner, choose a format or a variation · Other tools pending.</p>
    </div>
    <div class="preview-heading">
      <!-- History controls remain disabled until their behavior is implemented. -->
      <div class="actions">
        {#each ["Undo", "Reset", "Hold to compare"] as action}
          <button type="button" disabled>{action}</button>
        {/each}
      </div>
      <nav class="actions study-links" aria-label="Editor navigation">
        <a href={studyHref || galleryHref} data-recipe-gallery-link>View SVG study</a>
        <a href={galleryIndexHref}>Gallery</a>
      </nav>
    </div>
  </header>
  <!-- Keep the preview first in DOM order for the narrow-screen layout. -->
  <div class="workspace">
    <section class="preview" aria-labelledby="preview-title">
      <h2 id="preview-title" class="visually-hidden">Your composition</h2>
      <!-- Stable normalized coordinate space; Seat 7 will integrate physical paper. -->
      <div class="editor-study__stage">
        <div class="resize-space" bind:this={stage}>
          <div class="editor-study__painting"
            style:left={selection.frame.x * 100 + "%"}
            style:top={selection.frame.y * 100 + "%"}
            style:width={selection.frame.width * 100 + "%"}
            style:height={selection.frame.height * 100 + "%"}>
            {@html svg}
            {#each CORNERS as corner}
              <button type="button" class={"resize-handle " + corner}
                aria-label={"Resize " + cornerLabels[corner] + " corner with arrow keys"}
                onpointerdown={(event) => startResize(event, corner)}
                onpointermove={moveResize}
                onpointerup={(event) => { moveResize(event); finishResize(event); }}
                onpointercancel={(event) => finishResize(event, true)}
                onlostpointercapture={(event) => finishResize(event, true)}
                onkeydown={(event) => resizeByKey(event, corner)}></button>
            {/each}
          </div>
        </div>
      </div>
    </section>
    <aside class="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Composition tools</h2>
      <!-- All categories start closed; native disclosure works with keyboard and mouse. -->
      <details>
        <summary>01 / Texture</summary>
        <div class="group-content">
          <p class="notice">Current source</p>
          <label class="visually-hidden" for="texture">Texture</label>
          <select id="texture" disabled><option>{work.title}</option></select>
        </div>
      </details>
      {#each groups as group, i}
        <details>
          <summary>0{i + 2} / {group.title}</summary>
          <div class="group-content">
            {#if group.title === "Format"}
              <div class="options chips" role="group" aria-label="Composition format">
                {#each FORMATS as format}
                  <button type="button" aria-pressed={formatId === format.id} onclick={() => chooseFormat(format.id)}>{format.label}</button>
                {/each}
                <button type="button" aria-pressed={formatId === "custom"} disabled>Custom</button>
              </div>
              <p class="notice" aria-live="polite">Selected: {formatId === "custom" ? "Custom" : FORMATS.find((format) => format.id === formatId)?.label}</p>
            {:else if group.title === "Variations"}
              <div class="options chips" role="group" aria-label="Composition variation">
                {#each VARIATIONS as variation}
                  <button type="button" aria-pressed={variationId === variation.id} onclick={() => chooseVariation(variation.id)}>{variation.label}</button>
                {/each}
                <button type="button" disabled>Invert contrast</button>
              </div>
              <p class="notice" aria-live="polite">Selected: {VARIATIONS.find((variation) => variation.id === variationId)?.label}</p>
            {:else if group.title === "Surface"}
              <div class="options">
                {#each group.options as option}
                  <button type="button" disabled>{option}</button>
                {/each}
              </div>
            {:else}
              <div class="options" class:chips={group.title === "Format" || group.title === "Variations"}>
                {#each group.options as option}
                  {#if option === "Hue" || option === "Line weight"}
                    <label class="range-preview">{option}<input type="range" disabled /></label>
                  {:else}
                    <button type="button" disabled>{option}</button>
                  {/if}
                {/each}
              </div>
            {/if}
          </div>
        </details>
      {/each}
    </aside>
    <!-- Reserve space for sharing, export and print; Seat 7 owns output integration. -->
    <section class="output" aria-labelledby="output-title">
      <h2 id="output-title" class="visually-hidden">Your personal version</h2>
      <button type="button" disabled>Copy link</button>
      <button type="button" disabled>QR code</button>
      <div class="export-select">
        <select aria-label="Export format" disabled>
          <option>Export</option>
          {#each ["SVG", "PNG", "Standalone HTML", "CSV"] as format}<option>{format}</option>{/each}
        </select>
      </div>
      <details class="print-settings">
        <summary>Print settings</summary>
        <div class="group-content options">
          <button type="button" disabled>Crop marks</button>
          <button type="button" disabled>Calibrate print</button>
        </div>
      </details>
      <button class="print" type="button" disabled>Print</button>
    </section>
  </div>
</section>

<style>
  /* Shared design tokens; keep the original SVG colours separate from chrome. */
  .editor-study {
    display: grid;
    gap: var(--nx-space-3);
    min-width: 0;
    font-family: var(--nx-font-body);
    color: var(--nx-color-ink);
    line-height: var(--nx-leading-normal);
  }
  h1, h2, p { margin: 0; }
  .editor-study__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--nx-space-2); }
  .editor-title-block { display: grid; gap: var(--nx-space-1); min-width: 0; }
  h1 {
    font-family: var(--nx-font-headline);
    font-size: var(--nx-text-xl);
    line-height: var(--nx-leading-tight);
    letter-spacing: var(--nx-tracking-display);
  }
  h2 { font: 600 var(--nx-text-md)/var(--nx-leading-tight) var(--nx-font-subhead); }
  label, summary { font: 600 var(--nx-text-sm)/var(--nx-leading-normal) var(--nx-font-subhead); }
  .notice { font: var(--nx-text-xs)/var(--nx-leading-normal) var(--nx-font-caption); color: var(--nx-color-muted); }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  /* Mobile first: keep the artwork above the tools. */
  .workspace { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--nx-space-3); min-height: 0; }
  .preview, .controls, .output { min-width: 0; min-height: 0; }
  .preview { display: grid; gap: var(--nx-space-2); grid-template-rows: minmax(0, 1fr); }
  .preview-heading, .output {
    display: flex; flex-wrap: wrap; align-items: center; gap: var(--nx-space-1);
    padding: var(--nx-space-1); border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--nx-color-paper);
  }
  .preview-heading { justify-content: flex-end; border: 0; padding: 0; background: transparent; min-width: 0; }
  .controls {
    display: grid; align-content: start; gap: var(--nx-space-2);
    padding: var(--nx-space-3);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--nx-color-paper);
  }
  /* Size the SVG within both axes of the available stage. */
  .editor-study__stage {
    display: grid; place-items: center;
    padding: max(var(--nx-space-3), var(--nx-touch-min));
    min-height: min(40dvh, 18rem);
    background: color-mix(in srgb, var(--nx-color-ink) 5%, var(--nx-color-canvas));
    container-type: size;
  }
  .resize-space {
    position: relative;
    width: min(100%, 40rem, 100cqh);
    aspect-ratio: 1;
  }
  .editor-study__painting {
    position: absolute;
    container-type: size;
    outline: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--white, var(--nx-color-paper));
  }
  .editor-study__painting :global(svg) { display: block; width: 100%; height: 100%; }
  .resize-handle {
    position: absolute; z-index: 1;
    width: var(--nx-touch-min); height: var(--nx-touch-min);
    --handle-x: -50%; --handle-y: -50%;
    touch-action: none; transform: translate(var(--handle-x), var(--handle-y));
    display: grid; place-items: center;
  }
  .resize-handle.nw { top: 0; left: 0; cursor: nwse-resize; }
  .resize-handle.ne { top: 0; left: 100%; cursor: nesw-resize; }
  .resize-handle.sw { top: 100%; left: 0; cursor: nesw-resize; }
  .resize-handle.se { top: 100%; left: 100%; cursor: nwse-resize; }
  details { border-top: var(--nx-stroke-armature) solid var(--nx-color-muted); }
  summary { box-sizing: border-box; min-height: var(--nx-touch-min); padding: var(--nx-space-2); cursor: pointer; }
  summary:focus-visible, a:focus-visible, button:focus-visible { outline: 2px solid var(--nx-color-focus); outline-offset: 2px; }
  .group-content { display: grid; gap: var(--nx-space-2); padding: 0 var(--nx-space-2) var(--nx-space-2); }
  .group-content select { width: 100%; min-width: 0; }
  .actions, .options { display: flex; flex-wrap: wrap; gap: var(--nx-space-1); }
  .chips { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  button, select, .study-links a {
    box-sizing: border-box;
    min-height: var(--nx-touch-min); min-width: var(--nx-touch-min); max-width: 100%;
    padding: var(--nx-space-1) var(--nx-space-2);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    border-radius: var(--nx-radius-chrome);
    background: var(--nx-color-canvas); color: var(--nx-color-muted);
    font: inherit; font-size: var(--nx-text-sm); overflow-wrap: anywhere;
  }
  .study-links a { display: inline-flex; align-items: center; color: var(--nx-color-muted); background: transparent; border-color: transparent; text-decoration: underline; }
  button:not(:disabled) { cursor: pointer; color: var(--nx-color-ink); }
  button[aria-pressed="true"] { background: var(--nx-color-ink); color: var(--nx-color-canvas); border-color: var(--nx-color-ink); }
  button:disabled, select:disabled { cursor: not-allowed; opacity: 1; }
  button.resize-handle:not(:disabled) { padding: 0; border: 0; background: transparent; }
  button.resize-handle::after {
    content: ""; position: absolute; left: 50%; top: 50%;
    transform: translate(-50%, -50%); width: 12px; height: 12px;
    background: var(--nx-color-paper); border: 2px solid var(--nx-color-ink);
    box-sizing: border-box;
  }
  button.resize-handle.nw:not(:disabled), button.resize-handle.se:not(:disabled) { cursor: nwse-resize; }
  button.resize-handle.ne:not(:disabled), button.resize-handle.sw:not(:disabled) { cursor: nesw-resize; }
  button.resize-handle:focus-visible { z-index: 2; }
  /* When a frame is narrow or short, shift hit targets outward without
     moving the visible corner markers or reducing the 44px targets. */
  @container (width < 44px) {
    .resize-handle.nw, .resize-handle.sw { --handle-x: calc(-100% + 6px); }
    .resize-handle.ne, .resize-handle.se { --handle-x: -6px; }
    button.resize-handle.nw::after, button.resize-handle.sw::after { left: calc(100% - 6px); }
    button.resize-handle.ne::after, button.resize-handle.se::after { left: 6px; }
  }
  @container (height < 44px) {
    .resize-handle.nw, .resize-handle.ne { --handle-y: calc(-100% + 6px); }
    .resize-handle.sw, .resize-handle.se { --handle-y: -6px; }
    button.resize-handle.nw::after, button.resize-handle.ne::after { top: calc(100% - 6px); }
    button.resize-handle.sw::after, button.resize-handle.se::after { top: 6px; }
  }
  @media print {
    button.resize-handle { display: none; }
  }
  .range-preview { display: grid; width: 100%; }
  .range-preview input { min-height: var(--nx-touch-min); width: 100%; margin: 0; accent-color: var(--nx-color-ink); }
  .print { margin-inline-start: auto; border-color: var(--nx-color-ink); }
  .print-settings { border: 0; }
  .print-settings[open] { flex-basis: 100%; }
  /* Only the sidebar scrolls on sufficiently large desktop viewports. */
  @media (min-width: 52rem) and (min-height: 35rem) {
    .editor-study { height: 100%; grid-template-rows: auto minmax(0, 1fr); }
    .workspace {
      grid-template-columns: minmax(15rem, 1fr) minmax(0, 3fr);
      grid-template-rows: minmax(0, 1fr) auto;
      grid-template-areas: "controls preview" "controls output";
    }
    .controls { grid-area: controls; overflow-y: auto; scrollbar-gutter: stable; }
    .preview { grid-area: preview; }
    .output { grid-area: output; }
    .editor-study__stage { min-height: 0; padding: max(var(--nx-space-2), var(--nx-touch-min)); }
  }
</style>
