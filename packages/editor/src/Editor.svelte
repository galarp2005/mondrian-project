<script>
  import { onMount } from "svelte";
  import { deriveRenderPlan, renderSvg } from "@mondrian/matrix";

  // Astro passes the selected work and the URL of its generated catalog JSON.
  let { work, catalogUrl } = $props();

  // Show the measured SVG immediately; replace it when the catalog arrives.
  let svg = $state(renderSvg(deriveRenderPlan(work)));
  let error = $state("");
  let ratio = $derived(work.canvas.width / work.canvas.height);

  onMount(() => {
    let mounted = true;

    async function cargarCatalogo() {
      try {
        const response = await fetch(catalogUrl);
        if (!response.ok) {
          throw new Error(`Catalog request failed (HTTP ${response.status})`);
        }

        const plan = await response.json();
        if (!plan || !Array.isArray(plan.items)) {
          throw new Error("Catalog JSON is not a valid render plan");
        }

        if (mounted) svg = renderSvg(plan);
      } catch (err) {
        if (mounted) {
          console.error("Error al cargar el catalogo:", err);
          error = "No se pudo cargar el catalogo; se muestra la obra original.";
        }
      }
    }

    void cargarCatalogo();
    return () => { mounted = false; };
  });
</script>

<section class="editor-study">
  <header class="editor-study__header">
    <p class="editor-study__eyebrow">Editor · first study</p>
    <h1>{work.title}</h1>
    <p>Obra de {work.year}</p>
  </header>

  <div class="editor-study__stage">
    <div class="editor-study__painting" style:aspect-ratio={ratio}>
      {@html svg}
    </div>
  </div>
  {#if error}
    <p class="editor-study__error">{error}</p>
  {/if}
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

  .editor-study__error {
    margin: 0;
    font-size: 0.9rem;
  }
</style>
