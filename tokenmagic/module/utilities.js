/**
 * Modified Foundry's Hooks.call(...) function to support calling and awaiting of asynchronous hooks
 * @param {string} hook
 * @param  {...any} args
 * @returns
 */
export async function callAsyncHook(hook, ...args) {
	if (CONFIG.debug.hooks) {
		console.log(`DEBUG | Calling async ${hook} hook with args:`);
		console.log(args);
	}

	if (!(hook in Hooks.events)) return true;

	for (const entry of Array.from(Hooks.events[hook])) {
		const { hook, id, fn, once } = entry;
		if (once) Hooks.off(hook, id);
		try {
			const result = await entry.fn(...args);
			if (result === false) return false;
		} catch (err) {
			const msg = `Error thrown in hooked function '${fn?.name}' for hook '${hook}'`;
			console.warn(`${CONST.vtt} | ${msg}`);
			if (hook !== 'error') Hooks.onError('Hooks.callAsyncHook', err, { msg, hook, fn, log: 'error' });
		}
	}

	return true;
}

/**
 * Randomizes params using 'randomized' field.
 * 'randomized' is an object consisting of keys named after params to be randomized, which map either
 * to arrays or ranges which will be used to generate a random value.
 * e.g.
 * {
 *  param1: ['foo1', 'foo2', 'foo3'],
 *  param2: { list: ['foo1', 'foo2', 'foo3'], link: 'param5'},
 *  param3: { val1: 0, val2: 1, step: 0.1},
 *  param4: { val1: 0, val2: 10, step: 1, link: 'param6'},
 * }
 * 'link' will assign the same generated value to one other param.
 */
export function randomizeParams(params) {
	if (params.randomized.hasOwnProperty('active') && !params.randomized.active) return;

	for (const [param, opts] of Object.entries(params.randomized)) {
		if (opts.hasOwnProperty('active') && !opts.active) continue;

		let rVal;
		if (Array.isArray(opts) || opts.list?.length) {
			const list = opts.list ?? opts;
			rVal = list[Math.floor(Math.random() * list.length)];
		} else if (opts.color && opts.type !== 'any') {
			rVal = Color.mix(opts.val1, opts.val2, Math.random());
		} else {
			if (typeof opts.val1 === 'boolean') {
				rVal = Math.random() > 0.5;
			} else {
				const min = Math.min(opts.val1, opts.val2);
				const max = Math.max(opts.val1, opts.val2);
				const step = opts.step ?? 1;
				const steps = Math.floor((max - min) / step) + 1;
				const randomStep = Math.floor(Math.random() * steps);

				const precision = Math.max(
					(step.toString().split('.')[1] || '').length,
					(min.toString().split('.')[1] || '').length,
				);

				rVal = Number((min + randomStep * step).toFixed(precision));
			}
		}
		foundry.utils.setProperty(params, param, rVal);
		if (opts.hasOwnProperty('link')) foundry.utils.setProperty(params, opts.link, rVal);
	}
}

export async function exportObjectAsJson(exportObj, exportName) {
	let jsonStr = JSON.stringify(exportObj, null, 4);

	const a = document.createElement('a');
	const file = new Blob([jsonStr], { type: 'plain/text' });

	a.href = URL.createObjectURL(file);
	a.download = exportName + '.json';
	a.click();

	URL.revokeObjectURL(a.href);
}

export function isTheOne() {
	const theOne = game.users.find((user) => user.isGM && user.active);
	return theOne && game.user === theOne;
}
