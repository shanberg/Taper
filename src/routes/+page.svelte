<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import FormHeader from '../components/FormHeader.svelte';
	import ScheduleTable from '../components/ScheduleTable.svelte';
	import Plan from '../components/Plan.svelte';

	function handleKeyDown(e: KeyboardEvent) {
		const { ctrlKey, metaKey, shiftKey, key } = e;

		if (key === 'z' && (ctrlKey || metaKey)) {
			e.preventDefault();
			if (shiftKey) {
				appStore.redo();
			} else {
				appStore.undo();
			}
		} else if (key === 'y' && (ctrlKey || metaKey)) {
			e.preventDefault();
			appStore.redo();
		}
	}

	onMount(() => {
		if (typeof window !== 'undefined') {
			window.addEventListener('keydown', handleKeyDown);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('keydown', handleKeyDown);
		}
	});
</script>

<main>
	<FormHeader />

	<div class="body">
		<ScheduleTable />
		<Plan />
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		border-radius: calc(2 * var(--control-radius));
		overflow: clip;
		background: var(--color-bg-form);
		box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.025);
		width: 720px;
	}

	.body {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		padding: 1rem;
		min-width: 38rem;
	}
</style>
