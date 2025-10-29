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
