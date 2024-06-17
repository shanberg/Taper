import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/svelte';
import '@testing-library/jest-dom';
import Message from './Message.svelte'; // Adjust the import path as necessary

describe('Message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders correctly', async () => {
    const { container } = render(Message);
    await waitFor(() => {
      expect(container.querySelector('.message')).toBeInTheDocument();
    });
    expect(container).toMatchSnapshot();
  });

  test('applies the loaded class when a message is present', async () => {
    const { container } = render(Message);
    await waitFor(() => {
      expect(container.querySelector('.message')).toHaveClass('loaded');
    });
  });

  test('displays the message content', async () => {
    const { container } = render(Message);
    await waitFor(() => {
      const messageElement = container.querySelector('.message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.innerHTML).not.toBe('');
    });
  });

  test('updates the message at the correct interval', async () => {
    const { container } = render(Message);

    await waitFor(() => {
      const messageElement = container.querySelector('.message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.innerHTML).not.toBe('');
    });

    vi.advanceTimersByTime(1000 * 60 * 60);

    await waitFor(() => {
      const messageElement = container.querySelector('.message');
      expect(messageElement).toBeInTheDocument();
      expect(messageElement?.innerHTML).not.toBe('');
    });
  });
});