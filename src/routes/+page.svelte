<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import layout from '../styles/layout.module.css'
	import FormHeader from '../components/FormHeader.svelte';
	import ScheduleRow from '../components/ScheduleRow.svelte';
	import CopyToClipboardButton from '../components/CopyToClipboardButton.svelte';
	import { getFormattedListForCopyPaste, getLanguageFromKey } from '../utils';
	import FormToolbar from '../components/FormToolbar.svelte';

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

	$: schedule = $appStore.schedule;
	$: selectedLanguage = getLanguageFromKey(schedule.languageKey);
	$: copyableText = getFormattedListForCopyPaste(schedule);
</script>

<main>
	<FormHeader />
	<FormToolbar>
		<CopyToClipboardButton textToCopy={copyableText} />
	</FormToolbar>

	<div class="body">
		<div class={`${layout.hstack} form-schedule-header`}><div class="dose">mg</div><div class="days">days</div><div class="schedule">Schedule</div></div>
		{#each schedule.segments as _, index}
			<ScheduleRow {schedule} {index} {selectedLanguage} />
		{/each}
	</div>
</main>

<style>
	.form-schedule-header {
		font-weight: bold;

		& .dose {
			width: 5rem;
		}
		& .days {
			width: 6rem;
		}
	}

	main {
		display: flex;
		flex-direction: column;
		border-radius: calc(2 * var(--control-radius));
		overflow: clip;
		background: var(--color-bg-form);
		box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.025);
		width: 820px;
	}

	.body {
		display: flex;
		flex-direction: column;
		gap: 1px;
		padding: 1rem;
	}
</style>
