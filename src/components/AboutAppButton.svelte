<script lang="ts">
	import { scale, fade } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { createDialog, melt } from '@melt-ui/svelte'
  import FilledSymbolsInfo from "svelte-healthicons/lib/FilledSymbolsInfo.svelte";
	import Link from './Link.svelte';
	import List from './List.svelte';
  import Button from './Button.svelte'
	import ListItem from './ListItem.svelte';
  const {
    elements: { trigger, portalled, overlay, content, description },
    states: { open }
  } = createDialog({
    forceVisible: true,
    defaultOpen: false
  })
</script>
 
<Button variant="text" action={trigger}>About <FilledSymbolsInfo class="icon" /></Button>

{#if $open}
  <div use:melt={$portalled} class="container">
    <div use:melt={$overlay} class="overlay" 
      in:fade={{ duration: 500, easing: quintOut }}
      out:fade={{ duration: 250, easing: quintOut }}
    />
    <div use:melt={$content} class="content" 
      in:scale={{ duration: 300, delay: 0, opacity: 0.5, start: 0.8, easing: quintOut }}
      out:scale={{ duration: 250, delay: 0, opacity: 0.0, start: 0.9, easing: quintOut }}
    >
      <main use:melt={$description}>
        <p>Taper is a simple tool for healthcare professionals to calcuate tapering schedules and translate them for use by patients.</p>
        <List>
          <ListItem>It is free and <Link target="_blank" href="https://github.com/shanberg/Taper">open source</Link>.</ListItem>
          <ListItem>It doesn't store any data, and will never request personally identifying information.</ListItem>
          <ListItem>It is made for healthcare professionals, not for patients.</ListItem>
        </List>
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

p {
  font-size: var(--font-size-large);
  margin-bottom: 1rem;
}

main {
  padding: 1.25rem;
}
</style>