// svelte.config.js
import adapter from '@sveltejs/adapter-auto';
// import { sveltePreprocess } from 'svelte-preprocess';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import autoprefixer from 'autoprefixer';


/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess({
		typescript: true,
		postcss: {
			plugins: [
				postcssImport,
				postcssNested,
				autoprefixer,
			],
		},
	}),

	kit: {
		adapter: adapter(),
		alias: {
			'styled-system': './styled-system/*'
		},
		typescript: {
			config: (config) => {
				config.include.push("../styled-system");
				return config;
			},
		}
	}
};

export default config;


