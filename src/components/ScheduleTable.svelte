<script lang="ts">
	import { appStore } from '../stores';
	import FormSegment from '../components/FormSegment.svelte';
	import AddSegmentButton from '../components/AddSegmentButton.svelte';
	import { isSegmentPlaceholder, segmentIsOrAfterPlaceholder } from '../utils';

	$: lastSegmentIsPlaceholder = isSegmentPlaceholder(
		$appStore.schedule.segments[$appStore.schedule.segments.length - 1]
	);

	function insertPlaceholderSegmentAtEnd() {
		appStore.insertPlaceholderSegmentBeforeIndex($appStore.schedule.segments.length);
	}
</script>

<table class="form">
	<thead>
		<tr>
			<th class="dose">mg</th>
			<th class="days">days</th>
			<th></th>
		</tr>
	</thead>
	<tbody>
		{#each $appStore.schedule.segments as segment, index}
			{#if !segmentIsOrAfterPlaceholder(segment, $appStore.schedule.segments)}
				<tr>
					<td class="add-segment-button-td" colspan="2" data-insert-before={index}>
						<AddSegmentButton
							on:addSegment={() => appStore.insertPlaceholderSegmentBeforeIndex(index)}
						/>
					</td>
				</tr>
			{/if}
			<FormSegment
				segments={$appStore.schedule.segments}
				{segment}
				{index}
				on:removeSegment={() => appStore.deleteSegmentAtIndex(index)}
				on:change={(event) => appStore.editSegmentAtIndex(index, event.detail)}
			/>
		{/each}
		{#if !lastSegmentIsPlaceholder}
			<tr>
				<td class="add-segment-button-td" colspan="2">
					<AddSegmentButton on:addSegment={insertPlaceholderSegmentAtEnd} />
				</td>
			</tr>
		{/if}
	</tbody>
</table>

<style>
	.form {
		flex: 0 0 11.5rem;
	}

	.form {
		border-collapse: collapse;
		font-feature-settings: 'tnum' 1;
		flex: 0 0 auto;

		& th {
			font-weight: var(--font-weight-heading);
		}

		& td,
		& th {
			padding: 0;
			height: calc(var(--font-size-md) * 2);
			box-shadow: none;
			text-align: start;
		}

		& td.dose {
			width: 5rem;

			& input {
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
			}
		}

		& td.days {
			width: 5rem;

			& input {
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
			}
		}

		& td.delete {
			width: 1em;
		}
	}

	td.add-segment-button-td {
		padding: 0;
		height: 1px !important;
		font: 0 / 0 a;
	}
</style>
