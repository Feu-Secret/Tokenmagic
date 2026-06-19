import { PlaceableType } from '../module/constants.js';

export class FilterOverrideManager {
	static #overrides = new Map();
	static #presets = new Map();

	/**
	 * Overrides matching filter properties on the active canvas
	 * @param {string} filterId   target filter id, '*' is a wildcard applicable to all filter ids
	 * @param {string} filterType target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} props      properties and their values to be overriden
	 */
	static setOverride(filterId = '*', filterType = '*', props) {
		const idEntry = this.#overrides.get(filterId) ?? new Map();
		const override = idEntry.get(filterType) ?? {};
		idEntry.set(filterType, Object.assign(override, props));
		this.#overrides.set(filterId, idEntry);
		this.updateLiveFilters(filterId, filterType, props);
	}

	/**
	 * Animate matching filter properties
	 * @param {string} filterId     target filter id, '*' is a wildcard applicable to all filter ids
	 * @param {string} filterType   target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} options
	 * @param {object} options.from starting property values
	 * @param {object} options.to   ending property values
	 * @param {number} options.duration time in milliseconds to transition from->to
	 * @param {string} options.easing   rate of change null|easeInOutCosine|easeOutCircle|easeInCircle
	 * @param {string} options.name		optional name for the animation, if another animation with the same name exists it will be terminated
	 */
	static animate(filterId = '*', filterType = '*', { from, to, duration, easing, name }) {
		this.setOverride(filterId, filterType, from);
		const override = this.#overrides.get(filterId).get(filterType);

		const animation = [];
		for (const [k, v] of Object.entries(from)) {
			if (k in to) animation.push({ from: v, to: to[k], attribute: k, parent: override });
		}

		foundry.canvas.animation.CanvasAnimation.animate(animation, {
			name,
			easing,
			duration,
			ontick: (animation) => {
				FilterOverrides.updateLiveFilters(filterId, filterType, override);
			},
		});
	}

	/**
	 * Register a property override preset, which can evoked via 'FilterOverrideManager.applyOverridePreset'
	 * @param {string} presetName name to be used to evoke the preset
	 * @param {string} filterType target filterType, '*' is a wildcard applicable to all filter types
	 * @param {object} props 	  properties and their values to be overriden
	 */
	static registerOverridePreset(presetName, filterType = '*', props) {
		this.#presets.set(presetName, { filterType, props });
	}

	/**
	 * Apply presets registered via 'FilterOverrideManager.registerOverridePreset'
	 * @param {string} filterId   target filter id, '*' is a wildcard applicable to all filter ids
	 * @param {string} presetName name of the preset to be applied
	 */
	static applyOverridePreset(filterId = '*', presetName) {
		const { filterType, props } = this.#presets.get(presetName) ?? {};
		if ('from' in props && 'to' in props) this.animateFilterProperties(filterId, filterType, props);
		else if (filterType) this.setOverride(filterId, filterType, props);
	}

	static clearFilterPropertyOverride(filterId = '*', filterType = '*', props) {
		const idEntry = this.#overrides.get(filterId);
		if (!idEntry) return;
		const override = idEntry.get(filterType);

		if (override) {
			if (props) {
				for (const k of Object.keys(props)) delete override[k];
				if (!Object.keys(override).length) this.#overrides.delete(filterId);
			} else {
				this.#overrides.delete(filterId);
			}
		}
	}

	static updateLiveFilters(filterId = '*', filterType = '*', props) {
		for (const documentName of Object.values(PlaceableType)) {
			const layer = canvas.getLayerByEmbeddedName(documentName);
			layer?.placeables.forEach((p) => {
				p._TMFXgetSprite()?.filters?.forEach((f) => {
					if ((f.filterId === filterId || filterId === '*') && (f.filterType === filterType || filterType === '*')) {
						Object.assign(f, props);
					}
				});
			});
		}
	}

	static applyOverrides(params) {
		const { filterId, filterType } = params;

		const cascade = [
			this.#overrides.get('*')?.get('*'),
			this.#overrides.get('*')?.get(filterType),
			this.#overrides.get(filterId)?.get('*'),
			this.#overrides.get(filterId)?.get(filterType),
		];

		Object.assign(params, ...cascade.filter(Boolean));

		return params;
	}
}
