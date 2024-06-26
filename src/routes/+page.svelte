<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { appStore } from '../stores';
	import layout from '@styles/layout.module.css'
	import { getLanguageFromKey } from '../utils';
	import { FormHeader } from '../components/FormHeader';
	import { Output } from '../components/Output';
	import { Heading, inputStyles } from '../components';
	import FormScheduleRow from '../components/FormScheduleRow.svelte';
	import Message from '../components/Message.svelte';
	import AboutAppButton from '../components/AboutAppButton.svelte';
	import { STEP_TYPES } from '../consts';

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

	const handleChangeStepType = (e: Event) => {
		const target = e.target as HTMLInputElement;
		appStore.changeStepType(target.value as StepType);
	};

	$: schedule = $appStore.schedule;
</script>

<main>
	<header class={layout.hstack}>
		<Heading level={1}>Taper</Heading>
		<Message />
		<AboutAppButton />
	</header>
	<FormHeader />
	<div class="body">
		<div class={`${layout.hstack} steps`}>
			<Heading level={2}>Steps</Heading>
			<select class={inputStyles.input} value="mg">
				<option value="mg">Milligrams (mg)</option>
				<option disabled value="ml">Millileters (ml)</option>
			</select>
			<select class={inputStyles.input} value={schedule.stepType} on:change={handleChangeStepType}>
				{#each STEP_TYPES as stepType}
					<option value={stepType}>{stepType}</option>
				{/each}
			</select>
		</div>
		<div class={`${layout.hstack} form-schedule-header`}>
			<div class="dose">Dose 1</div>
			<div class="dose2">Dose 2</div>
			<div class="days">
				Days
			</div>
			<div class="schedule">Steps</div>
		</div>
		{#each schedule.steps as _, index}
			<FormScheduleRow {schedule} {index} />
		{/each}
	</div>
	<!-- <Output /> -->
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

	.steps {
		& select {
			width: unset;
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
