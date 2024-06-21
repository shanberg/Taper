// AddSegmentButton.test.ts
import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom'; // for the "toBeInTheDocument" matcher
import AddSegmentButton from './AddSegmentButton.svelte';

test('dispatches addSegment event on button click', async () => {
	// Render the component
	const { getByTitle, component } = render(AddSegmentButton);

	// Create a mock function to listen for the addSegment event
	const addSegmentHandler = vi.fn();
	component.$on('addSegment', addSegmentHandler);

	// Find the button by its title attribute
	const button = getByTitle('Add a segment');

	// Simulate a click event on the button
	await fireEvent.click(button);

	// Assert that the addSegment event was dispatched
	expect(addSegmentHandler).toHaveBeenCalled();
});
