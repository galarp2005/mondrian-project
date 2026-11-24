<script>
  import { deriveRenderPlan, renderSvg } from "@mondrian/matrix";

  // Receive the measured work from Astro; matrix owns geometry and SVG generation.
  let { work } = $props();
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
    <p class="eyebrow">Create · Editor</p>
    <h1 id="editor-title">Create your composition</h1>
    <p>{work.title} · {work.year}</p>
    <p class="notice">Layout preview — editing and output controls are not available yet.</p>
  </header>
  <!-- Keep the preview first in DOM order for the narrow-screen layout. -->
  <div class="workspace">
    <section class="preview" aria-labelledby="preview-title">
      <div class="preview-heading">
        <h2 id="preview-title">Your composition</h2>
        <!-- History controls remain disabled until their behavior is implemented. -->
        <div class="actions">
          {#each ["Undo", "Reset", "Hold to compare"] as action}
            <button type="button" disabled>{action}</button>
          {/each}
        </div>
      </div>
      <!-- Stage centers the painting; the custom property passes its ratio to CSS. -->
      <div class="editor-study__stage">
        <div class="editor-study__painting" style:--work-ratio={ratio}>
          <!-- Render SVG produced by the existing matrix package. -->
          {@html svg}
        </div>
      </div>
      <p class="caption">Original measured SVG · Corner resizing and print surface pending</p>
    </section>
    <aside class="controls" aria-labelledby="controls-title">
      <h2 id="controls-title">Composition tools</h2>
      <!-- Native disclosure elements support mouse and keyboard without extra JS. -->
      <details open>
        <summary>Texture</summary>
        <div class="group-content">
          <p class="caption">Current source</p>
          <p>{work.title} · {work.year}</p>
          <button type="button" disabled>Choose texture</button>
        </div>
      </details>
      <!-- Generate one disclosure per category and one button per option. -->
      {#each groups as group}
        <details>
          <summary>{group.title}</summary>
          <div class="group-content">
            <div class="options">
              {#each group.options as option}
                <button type="button" disabled>{option}</button>
              {/each}
            </div>
          </div>
        </details>
      {/each}
    </aside>
    <!-- Reserve space for sharing, export and print; Seat 7 owns output integration. -->
    <section class="output" aria-labelledby="output-title">
      <h2 id="output-title">Your personal version</h2>
      <p class="caption">Sharing, local drafts and export will be enabled in later stages.</p>
      <div class="actions">
        <button type="button" disabled>Copy link</button>
        <button type="button" disabled>QR code</button>
      </div>
      <details>
        <summary>Export</summary>
        <div class="group-content options">
          {#each ["SVG", "PNG", "Standalone HTML", "CSV"] as format}
            <button type="button" disabled>{format}</button>
          {/each}
        </div>
      </details>
      <details>
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
  /* Shared design tokens control typography, spacing and chrome colours. */
  .editor-study {
    display: grid;
    gap: var(--nx-space-5);
    min-width: 0;
    font-family: var(--nx-font-body);
    color: var(--nx-color-ink);
    line-height: var(--nx-leading-normal);
  }
  .editor-study h1, .editor-study h2, .editor-study p { margin: 0; }
  .editor-study__header { display: grid; gap: var(--nx-space-2); }
  h1 {
    font-family: var(--nx-font-headline);
    font-size: clamp(var(--nx-text-xl), 4vw, var(--nx-text-2xl));
    line-height: var(--nx-leading-tight);
    letter-spacing: var(--nx-tracking-display);
  }
  h2 {
    font-family: var(--nx-font-subhead);
    font-size: var(--nx-text-lg);
    line-height: var(--nx-leading-tight);
  }
  .eyebrow, .caption, .notice {
    font-family: var(--nx-font-caption);
    font-size: var(--nx-text-sm);
    color: var(--nx-color-muted);
  }
  .eyebrow { text-transform: uppercase; letter-spacing: var(--nx-tracking-display); }
  /* Mobile first: a single flexible column in source order. */
  .workspace {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--nx-space-4);
    align-items: start;
  }
  .preview, .controls, .output { min-width: 0; display: grid; gap: var(--nx-space-3); }
  .preview-heading { display: grid; gap: var(--nx-space-3); }
  .controls, .output {
    padding: var(--nx-space-4);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--nx-color-paper);
  }
  /* Center the artwork and bound responsive padding between shared spacing tokens. */
  .editor-study__stage {
    display: grid;
    place-items: center;
    padding: clamp(var(--nx-space-3), 3vw, var(--nx-space-6));
    min-height: min(48dvh, 20rem);
    background: color-mix(in srgb, var(--nx-color-ink) 5%, var(--nx-color-canvas));
  }
  /* Use the smallest width limit to fit the available space and preserve aspect ratio. */
  .editor-study__painting {
    width: min(100%, 34rem, calc(60dvh * var(--work-ratio)));
    aspect-ratio: var(--work-ratio);
    overflow: hidden;
    outline: var(--nx-stroke-armature) solid var(--nx-color-muted);
    background: var(--white, var(--nx-color-paper));
  }
  /* Injected SVG markup is not scoped by Svelte; target it within the painting only. */
  .editor-study__painting :global(svg) { display: block; width: 100%; height: 100%; }
  details { border-top: var(--nx-stroke-armature) solid var(--nx-color-muted); }
  summary {
    box-sizing: border-box;
    min-height: var(--nx-touch-min);
    padding-block: var(--nx-space-3);
    cursor: pointer;
    font-family: var(--nx-font-subhead);
    font-weight: 600;
    overflow-wrap: anywhere;
  }
  /* Visible keyboard focus on native disclosure controls. */
  summary:focus-visible { outline: 2px solid var(--nx-color-focus); outline-offset: 2px; }
  .group-content { display: grid; gap: var(--nx-space-2); padding-bottom: var(--nx-space-3); }
  /* Flexbox wraps controls onto additional rows when space runs out. */
  .actions, .options { display: flex; flex-wrap: wrap; gap: var(--nx-space-2); }
  /* Include padding and border in button sizing and reserve the shared touch target. */
  button {
    box-sizing: border-box;
    min-height: var(--nx-touch-min);
    min-width: var(--nx-touch-min);
    max-width: 100%;
    padding: var(--nx-space-2) var(--nx-space-3);
    border: var(--nx-stroke-armature) solid var(--nx-color-muted);
    border-radius: var(--nx-radius-chrome);
    background: var(--nx-color-canvas);
    color: var(--nx-color-muted);
    font: inherit;
    font-size: var(--nx-text-sm);
    overflow-wrap: anywhere;
  }
  /* Keep unavailable controls legible; HTML disabled prevents activation. */
  button:disabled { cursor: not-allowed; opacity: 1; }
  .print { justify-self: stretch; border-color: var(--nx-color-ink); }
  /* Wider screens: place controls on the left and preview/output on the right. */
  @media (min-width: 52rem) {
    .workspace {
      grid-template-columns: minmax(15rem, 1fr) minmax(0, 2fr);
      grid-template-areas: "controls preview" "controls output";
    }
    .controls { grid-area: controls; }
    .preview { grid-area: preview; }
    .output { grid-area: output; }
    .editor-study__stage { min-height: min(65dvh, 34rem); }
  }
</style>
