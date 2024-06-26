import { preprocessMeltUI, sequence } from '@melt-ui/pp';
import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
/** @type {import('@sveltejs/kit').Config}*/
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sequence([
		preprocess({
			typescript: true
		}),
		preprocessMeltUI()
	]),
	kit: {
		adapter: adapter()
	}
};
export default config;
