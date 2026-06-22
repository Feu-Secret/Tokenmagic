import { PlaceableType } from '../module/constants.js';
import { isTheOne } from '../module/util.js';

const { ForcedDeletion } = foundry.data.operators;
const { CanvasAnimation } = foundry.canvas.animation;

export class FilterOverrideManager {
	static #overrides = {};

	/**
	 * Overrides matching filter properties on the active canvas
	 * @param {string} filterId   target filter id, '*' is a wildcard applicable to all filter ids
	 * @param {string} filterType target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} properties      properties and their values to be overriden
	 */
	static async setOverride({
		filterId = '*',
		filterType = '*',
		scene = canvas.scene,
		preset,
		properties,
		global = false,
	} = {}) {
		if (properties) {
			if (global) {
				const globalOverrides = game.settings.get('tokenmagic', 'globalOverrides');
				globalOverrides[filterId] ??= {};
				globalOverrides[filterId][filterType] = properties;
				await game.settings.set('tokenmagic', 'globalOverrides', globalOverrides);
				return;
			}

			await scene?.update({ flags: { tokenmagic: { overrides: { [filterId]: { [filterType]: properties } } } } });
		}
	}

	/**
	 * Animate matching filter properties
	 * @param {string} filterId     target filter id, '*' is a wildcard applicable to all filter ids
	 * @param {string} filterType   target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} options
	 * @param {object} options.to   ending property values
	 * @param {number} options.duration time in milliseconds to transition from->to
	 * @param {string} options.easing   rate of change null|easeInOutCosine|easeOutCircle|easeInCircle
	 * @param {string} options.name		optional name for the animation, if another animation with the same name exists it will be terminated
	 */
	static async animate({ filterId = '*', filterType = '*', to, duration, easing, name, scene = canvas.scene } = {}) {
		const descriptor = {
			filterId,
			filterType,
			to,
			duration,
			easing,
			startTime: game.time.serverTime,
			id: name ?? foundry.utils.randomID(),
		};
		await scene.update({
			flags: {
				tokenmagic: {
					animated: {
						[descriptor.id]: descriptor,
					},
				},
			},
		});
	}

	static async #activateAnimations() {
		const animated = canvas.scene.getFlag('tokenmagic', 'animated');
		if (!animated) return;

		const promises = [];
		const ids = [];

		for (const [id, descriptor] of Object.entries(animated)) {
			if (CanvasAnimation.animations[id]) continue;
			const { filterId, filterType, to, duration, easing, startTime } = descriptor;
			const filters = TokenMagic.getActiveFilters({ filterId, filterType }).map((f) => f.filter);

			const animation = [];
			const time = game.time.serverTime - startTime;
			if (time > duration) continue; // TODO: delegate removal of the animation to someone

			for (const filter of filters) {
				for (let [prop, value] of Object.entries(to)) {
					if (typeof value === 'string' && value.startsWith('#')) value = Color.fromString(value);
					animation.push({ to: value, attribute: prop, parent: filter });
				}
			}

			if (animation.length) {
				promises.push(
					CanvasAnimation.animate(animation, {
						name: id,
						easing,
						duration,
						time,
					}),
				);
				ids.push(id);
			}
		}

		Promise.all(promises).then(() => {
			this.#cleanupAnimations(ids);
		});

		return Promise.all(promises);
	}

	static #cleanupAnimations(forceDelete = []) {
		if (isTheOne()) {
			const animated = canvas.scene.getFlag('tokenmagic', 'animated');
			if (!animated) return;

			const update = {};
			for (const { id, startTime, duration, filterId, filterType, to } of Object.values(animated)) {
				if (game.time.serverTime >= startTime + duration || forceDelete.includes(id)) {
					foundry.utils.setProperty(update, `flags.tokenmagic.animated.${id}`, _del);
					foundry.utils.setProperty(update, `flags.tokenmagic.overrides.${filterId}.${filterType}`, to);
				}
			}

			if (!foundry.utils.isEmpty(update)) {
				canvas.scene.update(update);
			}
		}
	}

	/**
	 * Updates active scene filters with the provided properties
	 * @param {object} options
	 * @param {string} options.filterId target filterId
	 * @param {string} options.filterType target filterType
	 * @param {object} options.properties properties and values to be set for the target filters
	 */
	static updateActiveFilters({ filterId = '*', filterType = '*', properties } = {}) {
		for (const documentName of Object.values(PlaceableType)) {
			const layer = canvas.getLayerByEmbeddedName(documentName);
			layer?.placeables.forEach((p) => {
				p._TMFXgetSprite()?.filters?.forEach((f) => {
					if ((f.filterId === filterId || filterId === '*') && (f.filterType === filterType || filterType === '*')) {
						Object.assign(f, properties);
					}
				});
			});
		}
	}

	static buildFilterContext(filter) {
		const placeable = filter.targetPlaceable;
		return {
			filter: filter,
			filterId: filter.filterId,
			filterType: filter.filterType,
			placeable,
			document: placeable.document,
			center: placeable.center,
			bounds: placeable.bounds,
		};
	}

	/**
	 * Register a property override preset, which can evoked via 'FilterOverrideManager.applyPreset'
	 * @param {string} presetName 		  name to be used to evoke the preset
	 * @param {object} options
	 * @param {string} options.filterType target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} options.properties properties and their values to be overriden
	 */
	static async registerPreset(presetName, { filterType = '*', properties } = {}) {
		const presets = game.settings.get('tokenmagic', 'overridePresets');
		presets[presetName] = { filterType, properties };
		return await game.settings.set('tokenmagic', 'overridePresets', presets);
	}

	/**
	 * Apply presets registered via 'FilterOverrideManager.registerPreset'
	 * @param {string} presetName name of the preset to be applied
	 * @param {object} options
	 * @param {string} options.filterId   target filter id, '*' is a wildcard applicable to all filter ids
	 */
	static applyPreset(presetName, { filterId = '*' } = {}) {
		const presets = game.settings.get('tokenmagic', 'overridePresets');

		const { filterType, properties } = presets[presetName] ?? {};
		if ('to' in properties) this.animate({ filterId, filterType, properties });
		else if (filterType) this.setOverride({ filterId, filterType, ...properties });
	}

	/**
	 * Clear property overrides.
	 * @param {*} param0
	 * @returns
	 */
	static clearOverrides({ filterId = '*', filterType = '*', scene = canvas.scene, properties } = {}) {
		if (!properties?.length) return;

		const overrides = scene.getFlag('tokenmagic', 'overrides');
		if (!overrides[filterId]?.[filterType]) return;

		const update = {};
		for (const prop of properties) {
			foundry.utils.setProperty(update, `flags.tokenmagic.overrides.${filterId}.${filterType}.${prop}`, _del);
		}
		if (!foundry.utils.isEmpty(update)) return scene.update(update);
	}

	static clearAllSceneOverrides(scene = canvas.scene) {
		if (!scene) return;
		return scene.unsetFlag('tokenmagic', 'overrides');
	}

	static clearAllGlobalOverrides() {
		return game.settings.set('tokenmagic', 'globalOverrides', {});
	}

	/**
	 * Applies overrides onto the provided parameters
	 * @param {object} params
	 * @returns
	 */
	static applyOverrides(params) {
		const { filterId, filterType } = params;

		const cascade = [
			this.#overrides['*']?.['*'],
			this.#overrides['*']?.[filterType],
			this.#overrides[filterId]?.['*'],
			this.#overrides[filterId]?.[filterType],
		];

		const override = Object.assign({}, ...cascade.filter(Boolean));
		for (const [k, v] of Object.entries(override)) {
			if (typeof v === 'string' && v.startsWith('#')) {
				override[k] = Color.fromString(v);
			}
		}

		Object.assign(params, override);

		return params;
	}

	static init() {
		Hooks.on('updateScene', (scene, change, context) => {
			if (canvas.scene?.id !== scene.id || !change.flags?.tokenmagic) return;

			if (change.flags.tokenmagic.overrides) {
				this.#loadOverrides();
				for (const [filterId, byType] of Object.entries(this.#overrides)) {
					for (let [filterType, properties] of Object.entries(byType)) {
						properties = { ...properties };
						for (const [k, v] of Object.entries(properties)) {
							if (typeof v === 'string' && v.startsWith('#')) {
								properties[k] = Color.fromString(v);
							}
						}
						this.updateActiveFilters({ filterId, filterType, properties });
					}
				}
			}
			if (change.flags.tokenmagic.animated) {
				this.#activateAnimations();
			}
		});

		Hooks.on('canvasInit', (...args) => FilterOverrideManager.canvasInit(...args));
	}

	static canvasInit(canvas) {
		this.#loadOverrides();
		this.#cleanupAnimations();
	}

	static #loadOverrides() {
		const sceneOverrides = canvas.scene.getFlag('tokenmagic', 'overrides') ?? {};
		const globalOverrides = game.settings.get('tokenmagic', 'globalOverrides');
		this.#overrides = foundry.utils.mergeObject(sceneOverrides, globalOverrides, { inplace: false });
	}

	static onGlobalOverrideChange() {
		this.#loadOverrides();

		for (const [filterId, byType] of Object.entries(this.#overrides)) {
			for (let [filterType, properties] of Object.entries(byType)) {
				properties = { ...properties };
				for (const [k, v] of Object.entries(properties)) {
					if (typeof v === 'string' && v.startsWith('#')) {
						properties[k] = Color.fromString(v);
					}
				}
				this.updateActiveFilters({ filterId, filterType, properties });
			}
		}
	}
}
