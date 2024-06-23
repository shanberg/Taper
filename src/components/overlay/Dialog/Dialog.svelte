<script lang="ts">
  import { createDialog, melt } from '@melt-ui/svelte';
  import { scale, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';

  const {
    elements: { trigger, portalled, overlay, content, title, description, close },
    states: { open }
  } = createDialog({
    forceVisible: true,
  });

  export const showDialog = () => open.set(true);
  export const hideDialog = () => open.set(false);
  export const toggleDialog = () => open.update(o => !o);
</script>

{#if open}
<div use:melt={$portalled} class="container">
  <div use:melt={$overlay} class="overlay" 
    in:fade={{ duration: 500, easing: quintOut }}
    out:fade={{ duration: 250, easing: quintOut }}
  />
  <div use:melt={$content} class="content" 
    in:scale={{ duration: 300, delay: 0, opacity: 0.5, start: 0.8, easing: quintOut }}
    out:scale={{ duration: 250, delay: 0, opacity: 0.0, start: 0.9, easing: quintOut }}
  >
    <header>
      <slot name="title"></slot>
    </header>
    <main>
      <slot name="description"></slot>
    </main>
  </div>
</div>
{/if}

<style>
.container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  display: flex;
  place-content: center;
  place-items: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: #000;
  opacity: 0.2;
  z-index: -1;
}

.content {
  height: max-content;
  width: 32rem;
  background: var(--color-background-form);
  box-shadow: 0 0 1.5rem #00000011;
  border-radius: 1rem;
}

header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-separator-border)
}

main {
  padding: 1rem;
}
</style>
