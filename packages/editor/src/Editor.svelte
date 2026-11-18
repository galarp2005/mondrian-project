<script>
  import { deriveRenderPlan, renderSvg } from "@mondrian/matrix";

  // Astro passes us one measured work from its content collection.
  let { work } = $props();

  // The geometry and SVG generation belong to matrix, not the editor UI.
  let svg = $derived(renderSvg(deriveRenderPlan(work)));
  let ratio = $derived(work.canvas.width / work.canvas.height);
</script>

<section class="editor-study" aria-labelledby="editor-title">
  <header class="editor-study__header">
    <p class="editor-study__eyebrow">Editor · first study</p>
    <h1 id="editor-title">{work.title}</h1>
    <p>Measured SVG study after Mondrian · {work.year}</p>
  </header>

  <div class="editor-study__stage">
    <div
      class="editor-study__painting"
      style:aspect-ratio={ratio}
      role="group"
      aria-label="Study of {work.title}"
      data-editor-canvas
    >
      {@html svg}
    </div>
  </div>

  <p class="editor-study__note">
    This is the first editor milestone: the original composition rendered with
    shared matrix geometry. Controls will arrive in separate tasks.
  </p>
</section>

<style>
  .editor-study {
    display: grid;
    gap: 1.5rem;
    width: min(100%, 60rem);
    margin: 0 auto;
  }

  .editor-study__header {
    display: grid;
    gap: 0.4rem;
  }

  .editor-study__eyebrow {
    margin: 0;
    font-size: 0.85rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .editor-study__header h1,
  .editor-study__header p {
    margin: 0;
  }

  .editor-study__stage {
    display: grid;
    place-items: center;
    padding: clamp(1rem, 3vw, 2.5rem);
    background: var(--nx-color-paper);
    min-height: 24rem;
  }

  .editor-study__painting {
    width: min(100%, 32rem);
    max-height: 70dvh;
    overflow: hidden;
    background: var(--white);
    box-shadow: 0 0 0 1px var(--gray);
  }

  .editor-study__painting :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  .editor-study__note {
    margin: 0;
    max-width: 44rem;
  }
</style>
