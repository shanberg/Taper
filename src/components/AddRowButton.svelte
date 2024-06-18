<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('addRow');
	}
</script>

<button title="Add a row" on:click={handleClick}></button>

<style>
	:root {
		--add-row-button-height: calc((1 / 7) * var(--control-height));
	}

	button {
		height: 100%;
		width: 100%;
		background-color: transparent;
		cursor: cell;
		border: 0;
		height: var(--add-row-button-height);
		margin: calc((1 / 4) * var(--control-height) * -1) 0;
		z-index: 10;
		position: relative;
		transition: all var(--control-transition-duration) cubic-bezier(0.165, 0.84, 0.44, 1);

		&:after {
			content: '';
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--color-fg);
			transition: inherit;
			transform: scaleY(0);
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
			transform: scaleY(1);
		}
	}
</style>
