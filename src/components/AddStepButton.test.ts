// AddStepButton.test.ts
import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom'; // for the "toBeInTheDocument" matcher
import AddStepButton from './AddStepButton.svelte';

test('dispatches addStep event on button click', async () => {
	// Render the component
	const { getByTitle, component } = render(AddStepButton);

	// Create a mock function to listen for the addStep event
	const addStepHandler = vi.fn();
	component.$on('addStep', addStepHandler);

	// Find the button by its title attribute
	const button = getByTitle('Add a step');

	// Simulate a click event on the button
	await fireEvent.click(button);

	// Assert that the addStep event was dispatched
	expect(addStepHandler).toHaveBeenCalled();
});
