<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import FormHeader from '../components/FormHeader.svelte';
	import ScheduleList from '../components/ScheduleList.svelte';
	import ScheduleRow from '../components/ScheduleRow.svelte';
	import { getLanguageFromKey, segmentIsOrAfterPlaceholder } from '../utils';

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

	$: selectedLanguage = getLanguageFromKey($appStore.schedule.languageKey);
	$: segments = $appStore.schedule.segments;
	$: startDate = $appStore.schedule.startDate;
</script>

<main>
	<FormHeader />

	<div class="body">
		{#each $appStore.schedule.segments as segment, index}
			<ScheduleRow {segment} {index} {segments} {startDate} {selectedLanguage} />
		{/each}
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
		flex-direction: column;
		gap: 1px;
		padding: 1rem;
	}
</style>
