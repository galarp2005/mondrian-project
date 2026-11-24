<script>
  import { deriveRenderPlan, renderSvg } from "@mondrian/matrix";

  // Receive the measured work from Astro; matrix owns geometry and SVG generation.
  let { work, galleryHref, galleryIndexHref } = $props();
  let svg = $derived(renderSvg(deriveRenderPlan(work)));
  // Preserve the source aspect ratio when the viewport changes.
  let ratio = $derived(work.canvas.width / work.canvas.height);

  // Each group describes a menu title and its options. Nested each blocks render the controls.
  // Presentation only. Editing behavior belongs to subsequent scoped PRs.
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
    <h1 id="editor-title">Create your composition</h1>
    <p>{work.title} · {work.year}</p>
    <p class="notice">Layout preview — editing and output controls are not available yet.</p>
  </header>
  <!-- Keep the preview first in DOM order for the narrow-screen layout. -->
  <div class="workspace">
    <section class="preview" aria-labelledby="preview-title">
      <div class="preview-heading">
        <h2 id="preview-title" class="visually-hidden">Your composition</h2>
        <!-- History controls remain disabled until their behavior is implemented. -->
        <div class="actions">
          {#each ["Undo", "Reset", "Hold to compare"] as action}
            <button type="button" disabled>{action}</button>
          {/each}
        </div>
        <nav class="actions study-links" aria-label="Editor navigation">
          <a href={galleryHref} data-recipe-gallery-link>View SVG study</a>
          <a href={galleryIndexHref}>Gallery</a>
        </nav>
      </div>
      <!-- Stage centers the painting; the custom property passes its ratio to CSS. -->
      <div class="editor-study__stage">
        <div class="editor-study__painting" style:--work-ratio={ratio}>
          <!-- Render SVG produced by the existing matrix package. -->
          {@html svg}
        </div>
      </div>
    </section>
    <aside class="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Composition tools</h2>
      <!-- Native disclosure elements support mouse and keyboard without extra JS. -->
      <div class="tool-group">
        <label for="texture">01 / Texture</label>
        <select id="texture" disabled><option>{work.title}</option></select>
      </div>
      <!-- Generate one disclosure per category and one button per option. -->
      {#each groups as group, i}
        {#if group.title === "Surface"}
          <div class="tool-group">
            <label for="surface">02 / Surface</label>
            <select id="surface" disabled>
              <option>Surface not yet available</option>
              {#each group.options as option}<option>{option}</option>{/each}
            </select>
          </div>
        {:else if group.title === "Format" || group.title === "Variations"}
          <div class="tool-group">
            <h3>0{i + 2} / {group.title}</h3>
            <div class="options chips">
              {#each group.options as option}
                <button type="button" disabled>{option}</button>
              {/each}
            </div>
          </div>
        {:else}
          <details>
            <summary>0{i + 2} / {group.title}</summary>
            <div class="group-content options">
              {#each group.options as option}
                {#if option === "Hue" || option === "Line weight"}
                  <label class="range-preview">{option}<input type="range" disabled /></label>
                {:else}
                  <button type="button" disabled>{option}</button>
                {/if}
              {/each}
            </div>
          </details>
        {/if}
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
  h1, h2, h3, p { margin: 0; }
  .editor-study__header { display: grid; gap: var(--nx-space-1); }
  h1 {
    font-family: var(--nx-font-headline);
    font-size: var(--nx-text-xl);
    line-height: var(--nx-leading-tight);
    letter-spacing: var(--nx-tracking-display);
  }
  h2 { font: 600 var(--nx-text-md)/var(--nx-leading-tight) var(--nx-font-subhead); }
  h3, label, summary { font: 600 var(--nx-text-sm)/var(--nx-leading-normal) var(--nx-font-subhead); }
  .notice { font: var(--nx-text-xs)/var(--nx-leading-normal) var(--nx-font-caption); color: var(--nx-color-muted); }
  .visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  /* Mobile first: keep the artwork above the tools. */
  .workspace { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--nx-space-3); min-height: 0; }
  .preview, .controls, .output { min-width: 0; min-height: 0; }
  .preview { display: grid; gap: var(--nx-space-2); grid-template-rows: auto minmax(0, 1fr); }
  .preview-heading, .output {
    display: flex; flex-wrap: wrap; align-items: center; gap: var(--nx-space-2);
    padding: var(--nx-space-2); border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--nx-color-paper);
  }
  .preview-heading { justify-content: space-between; }
  .controls {
    display: grid; align-content: start; gap: var(--nx-space-2);
    padding: var(--nx-space-3);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--nx-color-paper);
  }
  .tool-group { display: grid; gap: var(--nx-space-1); padding-block: var(--nx-space-1); border-top: var(--nx-stroke-armature) solid var(--nx-color-muted); }
  /* Size the SVG within both axes of the available stage. */
  .editor-study__stage {
    display: grid; place-items: center;
    padding: var(--nx-space-3);
    min-height: min(40dvh, 18rem);
    background: color-mix(in srgb, var(--nx-color-ink) 5%, var(--nx-color-canvas));
    container-type: size;
  }
  .editor-study__painting {
    width: min(100%, 34rem, calc(100cqh * var(--work-ratio)));
    aspect-ratio: var(--work-ratio);
    overflow: hidden;
    outline: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--white, var(--nx-color-paper));
  }
  .editor-study__painting :global(svg) { display: block; width: 100%; height: 100%; }
  details { border-top: var(--nx-stroke-armature) solid var(--nx-color-muted); }
  summary { box-sizing: border-box; min-height: var(--nx-touch-min); padding: var(--nx-space-2); cursor: pointer; }
  summary:focus-visible, a:focus-visible { outline: 2px solid var(--nx-color-focus); outline-offset: 2px; }
  .group-content { padding-bottom: var(--nx-space-2); }
  .actions, .options { display: flex; flex-wrap: wrap; gap: var(--nx-space-1); }
  .chips { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
  button, select, .study-links a {
    box-sizing: border-box;
    min-height: var(--nx-touch-min); min-width: var(--nx-touch-min); max-width: 100%;
    padding: var(--nx-space-1) var(--nx-space-2);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    border-radius: var(--nx-radius-chrome);
    background: var(--nx-color-canvas); color: var(--nx-color-muted);
    font: inherit; font-size: var(--nx-text-sm); overflow-wrap: anywhere;
  }
  .study-links a { display: inline-flex; align-items: center; color: var(--nx-color-ink); background: transparent; border-color: transparent; text-decoration: underline; }
  button:disabled, select:disabled { cursor: not-allowed; opacity: 1; }
  .range-preview { display: grid; width: 100%; }
  .range-preview input { min-height: var(--nx-touch-min); width: 100%; margin: 0; accent-color: var(--nx-color-ink); }
  .print { margin-inline-start: auto; border-color: var(--nx-color-ink); }
  .print-settings { border: 0; }
  .print-settings[open] { flex-basis: 100%; }
  /* Only the sidebar scrolls on sufficiently large desktop viewports. */
  @media (min-width: 52rem) and (min-height: 35rem) {
    .editor-study { height: 100%; grid-template-rows: auto minmax(0, 1fr); }
    .workspace {
      grid-template-columns: minmax(16rem, 1fr) minmax(0, 2fr);
      grid-template-rows: minmax(0, 1fr) auto;
      grid-template-areas: "controls preview" "controls output";
    }
    .controls { grid-area: controls; overflow-y: auto; }
    .preview { grid-area: preview; }
    .output { grid-area: output; }
    .editor-study__stage { min-height: 0; }
  }
</style>
