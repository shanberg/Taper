<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { isSegmentInvalid, isSegmentPlaceholder } from '../utils';
	import { pressable } from 'styled-system/patterns'
	import { NumberInput, HStack } from './'
	export let segments: Segment[];
	export let segment: Segment;
	export let index: number;

	const dispatch = createEventDispatcher();
	$: isOnlyRealSegment = segments?.length === 2;
	$: isPlaceholder = isSegmentPlaceholder(segment);
	$: isInvalid = !isPlaceholder && isSegmentInvalid(segment);
	$: isLastSegment = index === segments.length - 1

	function handleClickDelete() {
		dispatch('removeSegment', index);
	}
</script>

<HStack 
	gap="1px"
	flex="0 0 12rem"
	class="segment"
	data-invalid={isInvalid}
	data-placeholder={isPlaceholder}
	data-last-segment={isLastSegment}
>
	<div class="dose">
		<label for="dose-{index}">
			<NumberInput
				min={1}
				id="dose-{index}"
				step={segment.dose > 5 ? 1 : 0.25}
				inputmode="decimal"
				pattern="[1-9]\d*"
				aria-label="dose-{index}"
				color={isInvalid ? "status.error" : isPlaceholder ? "fgMuted" : undefined}
				backgroundColor={isInvalid ? "status.errorBgMuted" : isPlaceholder ? "transparent" : undefined}
				bind:value={segment.dose}
				on:change={() => dispatch('change', segment)}
			/>
		</label>
	</div>
	<div class="days">
		<label for="days-{index}">
			<NumberInput
				min={1}
				id="days-{index}"
				inputmode="decimal"
				pattern="[1-9]\d*"
				aria-label="days-{index}"
				color={isInvalid ? "status.error" : isPlaceholder ? "fgMuted" : undefined}
				backgroundColor={isInvalid ? "status.errorBgMuted" : isPlaceholder ? "transparent" : undefined}
				bind:value={segment.daysForDose}
				on:change={() => dispatch('change', segment)}
			/>
		</label>
	</div>
	<button
		{...(isLastSegment || isOnlyRealSegment) ? { disabled: true } : {}}
		title="Remove this step"
		class={`${pressable({
			visibility: isLastSegment ? "hidden" : undefined,
			flex: "0 0 1.5rem",
			height: "100%",
			opacity: 0.25,
			padding: 0,
			background: "none",
			_hover: {
				opacity: 1,
			},
			_focus: {
				opacity: 1,
			}
		})} remove-btn`}
		on:click={handleClickDelete}>×</button
	>
</HStack>
