<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import layout from '@styles/layout.module.css'
	import { getLanguageFromKey } from '../utils';
	import { FormHeader } from '../components/FormHeader';
	import { Output } from '../components/Output';
	import Heading from '../components/Heading.svelte';
	import ScheduleRow from '../components/ScheduleRow.svelte';
	import Message from '../components/Message.svelte';
	import AboutAppButton from '../components/AboutAppButton.svelte';

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
</script>

<main>
	<header class={layout.hstack}>
		<Heading level={1}>Taper</Heading>
		<Message />
		<AboutAppButton />
	</header>
	<FormHeader />
	<div class="body">
		<div class={`${layout.hstack} form-schedule-header`}>
			<div class="dose">mg</div>
			<div class="days">days</div>
			<div class="schedule">Schedule</div>
		</div>
		{#each schedule.segments as _, index}
			<ScheduleRow {schedule} {index} {selectedLanguage} />
		{/each}
	</div>

	<Output />
</main>

<style>
	.form-schedule-header {
		font-weight: bold;
		gap: 1px;
		padding-block-end: 0.25rem;

		& .dose {
			width: 5.25rem;
		}
		& .days {
			width: 5.25rem;
		}
		& .schedule {
			margin-left: 2rem;
		}
	}

	header {
		align-self: stretch;
		justify-content: space-between;
		align-items: center;
		padding: 0.25rem 1rem;
		border-bottom: 1px solid var(--color-separator-border);
	}

	main {
		display: flex;
		flex-direction: column;
		border-radius: calc(2 * var(--control-border-radius));
		overflow: clip;
		background: var(--color-background-form);
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
