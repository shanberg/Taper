<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('addSegment');
	}
</script>

<button title="Add a segment" on:click={handleClick}></button>

<style>
	:root {
		--add-segment-button-height: calc((1 / 5) * var(--control-height));
	}

	button {
		background-color: transparent;
		cursor: cell;
		appearance: none;
		border: 0;
		width: calc(12rem - 1.5rem);
		height: 0;
		z-index: 10;
		left: 0;
		top: -1.5px;
		z-index: 10;
		position: absolute;
		transition: all var(--control-transition-duration) cubic-bezier(0.165, 0.84, 0.44, 1);

		&:before {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			height: var(--add-segment-button-height);
			transform: translateY(-50%);
			opacity: 0;
		}

		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			height: var(--add-segment-button-height);
			background-color: var(--color-fg);
			transition: inherit;
			transform: translateY(-50%) scaleY(0);
			border-radius: 10px;
			opacity: 0;
		}
	}

	button:hover,
	button:focus {
		outline: none;

		&:after {
			background-color: var(--color-fg);
			opacity: 1;
			transform: translateY(-50%) scaleY(1);
		}
	}
</style>
