// Component.test.ts
import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Badge from './Badge.svelte'; // Adjust the import path as necessary

describe('Component', () => {
	it('should render', () => {
		const { container } = render(Badge);
		expect(container).toBeInTheDocument();
	});
});
