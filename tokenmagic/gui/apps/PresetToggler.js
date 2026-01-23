import { PresetsLibrary } from '../../fx/presets/defaultpresets';
import { PlaceableType } from '../../module/constants';
import { PresetSearch } from './PresetSearch';

export function presetToggler() {
	const activeInstance = foundry.applications.instances.get(PresetToggler.DEFAULT_OPTIONS.id);
	if (activeInstance) {
		activeInstance.close();
		return;
	}
	new PresetToggler().render(true);
}

class PresetToggler extends PresetSearch {
	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-preset-toggler',
		window: {
			title: 'TokenMagicFX Preset Toggler',
		},
		classes: ['tokenmagic', 'toggler', 'flexcol'],
		actions: {
			select: PresetToggler._onTogglePreset,
			clear: PresetToggler._onClearAllPresets,
			activeOnly: PresetToggler._onToggleActiveOnly,
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);
		switch (partId) {
			case 'header':
				context.activeOnly = this._activeOnly;
				break;
			case 'controls':
				context.controls.push({
					action: 'activeOnly',
					tooltip: 'Toggle active only display',
					icon: 'fa-solid fa-power-off',
					active: Boolean(this._activeOnly),
				});
				context.controls.push({
					action: 'clear',
					tooltip: 'Clear All Filters',
					icon: 'fa-solid fa-eraser',
				});
				break;
			case 'presets':
				if (this._activeOnly) context.filters = context.filters.filter((p) => p.active);
				break;
		}
		return context;
	}

	/**
	 * Toggle a preset on controlled placeables
	 * @param {MouseEvent} event
	 * @param {HTMLElement} element
	 */
	static async _onTogglePreset(event, element) {
		const controlled = TokenMagic.getControlledPlaceables();
		if (!controlled.length) return;

		const { filterId: name, filterType: library } = event.target.closest('.filter').dataset;

		const preset = TokenMagic.getPresets(library).find((p) => p.name === name);
		if (!preset?.params?.length) return;

		const { filterId } = preset.params[0];
		const isActive = controlled.some((c) => TokenMagic.hasFilterId(c, filterId));
		const presetQuery = { name, library };
		const texture = preset.defaultTexture;

		if (isActive) {
			const filterIds = new Set(TokenMagic.getPreset(presetQuery).map((p) => p.filterId));

			for (const placeable of controlled) {
				for (const filterId of filterIds) {
					if (TokenMagic.hasFilterId(placeable, filterId)) {
						await TokenMagic.deleteFilters(placeable, filterId);
						if (
							placeable.document.documentName === 'MeasuredTemplate' &&
							!placeable.document.flags['tokenmagic']?.filters
						) {
							await placeable.document.update({ ['-=texture']: null });
						}
					}
				}
			}
		} else {
			const preset = TokenMagic.getPreset(presetQuery);
			for (const placeable of controlled) {
				if (!TokenMagic.hasFilterId(placeable, filterId)) {
					if (texture && placeable.document.documentName === 'MeasuredTemplate') {
						await placeable.document.update({ texture });
					}
					await TokenMagic.addUpdateFilters(placeable, preset);
				}
			}
		}

		this.render({ parts: ['presets'] });
	}

	static async _onClearAllPresets(event, element) {
		await TokenMagic.deleteFiltersOnSelected();
		this.render({ parts: ['presets'] });
	}

	static _onToggleActiveOnly(event, element) {
		this._activeOnly = !this._activeOnly;
		this.render(true);
	}

	/** @override */
	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		this._hooks = [];
		for (const layer of Object.values(PlaceableType)) {
			if (!layer) continue;
			const hook = `control${layer}`;
			const id = Hooks.on(hook, () => {
				clearTimeout(this._controlHookTimeout);
				this._controlHookTimeout = setTimeout(() => this.render({ parts: ['presets'] }), 200);
			});
			this._hooks.push({ hook, id });
		}
	}

	/** @override */
	async close(options = {}) {
		await super.close(options);
		this._hooks?.forEach((h) => {
			Hooks.off(h.hook, h.id);
		});
	}
}
