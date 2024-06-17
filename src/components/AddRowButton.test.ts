import { test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import '@testing-library/jest-dom'; // for the "toBeInTheDocument" matcher
import AddRowButton from './AddRowButton.svelte';

test('dispatches addRow event on button click', async () => {
  // Render the component
  const { getByTitle, component } = render(AddRowButton);

  // Create a mock function to listen for the addRow event
  const addRowHandler = vi.fn();
  component.$on('addRow', addRowHandler);

  // Find the button by its title attribute
  const button = getByTitle('Add a row');

  // Simulate a click event on the button
  await fireEvent.click(button);

  // Assert that the addRow event was dispatched
  expect(addRowHandler).toHaveBeenCalled();
});
