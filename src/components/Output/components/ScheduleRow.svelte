<script lang="ts">
	import { appStore } from '../../../stores';
	import FormStep from '../../FormStep.svelte';
	import AddStepButton from '../../AddStepButton.svelte';
	import { TaperDate } from '../../../TaperDate';
	import { getPeriodsWithDosesForStep, stepIsOrAfterPlaceholder, isStepInvalid, formatStepText, calculateScheduleSummary } from '../../../utils';
	import List from '../../List.svelte';
	import ListItem from '../../ListItem.svelte';

	export let schedule: Schedule;
  export let index: number;
  export let selectedLanguage: Language;
	
	let stepStartDate: ScheduleDate;
	let stepEndDate: ScheduleDate;
	
	$: displayMode = schedule.displayMode;
	$: scheduleStartDate = schedule.startDate;
	$: steps = schedule.steps;
	$: step = schedule.steps[index];
	$: isStepPlaceholder = step.dose === 0 && step.daysForDose === 0;
	$: isInvalid = !isStepPlaceholder && isStepInvalid(step);
	$: isLastPlaceholderStep = index === steps.length - 1 && isStepPlaceholder;

	// Calculate the start and end dates
	$: {
		const taperStartDate = new TaperDate(scheduleStartDate);
		const totalDaysForStartDate =
			steps
				.slice(0, index)
				.reduce((acc: number, curr: { daysForDose: number }) => acc + curr.daysForDose - 1, 0) +
			index;
		taperStartDate.incrementByDays(totalDaysForStartDate);
		const taperEndDate = new TaperDate(taperStartDate.toScheduleDate());
		taperEndDate.incrementByDays(step.daysForDose - 1);

		stepStartDate = taperStartDate.toScheduleDate();
		stepEndDate = taperEndDate.toScheduleDate();
	}

</script>

<div class="row" class:isInvalid class:isStepPlaceholder class:isLastPlaceholderStep>
	<span class="written-plan">
		{formatStepText({ step, stepStartDate, stepEndDate, index, selectedLanguage })}
	</span>
</div>

<style>
	.row {
		display: flex;
    position: relative;
    gap: 0.5rem;
	}

	.written-plan {
		padding-block: 0.25rem;
	}

	.isInvalid .written-plan{
		color: var(--color-status-error);
	}
	
	.isStepPlaceholder .written-plan{
		color: var(--color-text-muted);
	}

	:where(.isInvalid, .isStepPlaceholder):not(.isLastPlaceholderStep) {
		& .written-plan {
			text-decoration: underline;
			text-decoration-style: wavy;
			text-decoration-skip-ink: none;
			text-decoration-thickness: 1px;
			text-underline-offset: 4px;
		}
	}
</style>
