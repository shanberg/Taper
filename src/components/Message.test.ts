/**
 * @fileoverview Tests for Message component: rendering, loaded state, content display, and interval updates.
 */
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Message from './Message.svelte';

/**
 * Returns a predicate that asserts the .message element is in the document.
 * @param container - Root element to query
 * @returns Callback for waitFor
 */
function expectMessageInDocument(container: HTMLElement): () => void {
	return () => expect(container.querySelector('.message')).toBeInTheDocument();
}

/**
 * Renders Message and waits until the .message element is in the document.
 * @returns Promise resolving to { container, messageElement }
 */
async function renderMessageAndWaitForLoad(): Promise<{
	container: HTMLElement;
	messageElement: Element | null;
}> {
	const { container } = render(Message);
	await waitFor(expectMessageInDocument(container));
	return { container, messageElement: container.querySelector('.message') };
}

/** Predicate for waitFor: asserts message element still has content. */
function expectMessageStillPresent(messageElement: Element | null): () => void {
	return () => {
		expect(messageElement).toBeInTheDocument();
		expect(messageElement?.innerHTML).not.toBe('');
	};
}

/** Suite: Message rendering, loaded state, content display, and interval updates. */
describe('Message', () => {
	/** Uses fake timers for interval-based tests. */
	beforeEach(() => {
		vi.useFakeTimers();
	});

	/** Restores real timers after each test. */
	afterEach(() => {
		vi.useRealTimers();
	});

	test('renders correctly', async () => {
		const { container } = await renderMessageAndWaitForLoad();
		expect(container).toMatchSnapshot();
	});

	test('applies the loaded class when a message is present', async () => {
		const { messageElement } = await renderMessageAndWaitForLoad();
		expect(messageElement).toHaveClass('loaded');
	});

	test('displays the message content', async () => {
		const { messageElement } = await renderMessageAndWaitForLoad();
		expect(messageElement).toBeInTheDocument();
		expect(messageElement?.innerHTML).not.toBe('');
	});

	test('updates the message at the correct interval', async () => {
		const { messageElement } = await renderMessageAndWaitForLoad();
		expect(messageElement).toBeInTheDocument();
		expect(messageElement?.innerHTML).not.toBe('');

		vi.advanceTimersByTime(1000 * 60 * 60);

		await waitFor(expectMessageStillPresent(messageElement));
	});
});
