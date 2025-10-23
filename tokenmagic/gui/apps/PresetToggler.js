const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export function activatePresetToggler(presets) {
	const activeInstance = foundry.applications.instances.get(PresetToggler.DEFAULT_OPTIONS.id);
	if (activeInstance) {
		activeInstance.close();
		return;
	}
	new PresetToggler(presets).render(true);
}

class PresetToggler extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(presets) {
		super({});
		this._presets = presets;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-toggler',
		window: {
			title: 'TMFX Presets',
		},
		classes: ['tokenmagic', 'toggler', 'flexcol'],
		actions: {
			toggle: PresetToggler._onTogglePreset,
			clear: PresetToggler._onClearAllPresets,
			toggleActiveOnly: PresetToggler._onToggleActiveOnly,
			clickControl: PresetToggler._onExecuteControlMacro,
		},
	};

	/** @override */
	static PARTS = {
		header: {
			template: `modules/tokenmagic/templates/apps/preset-toggle-header.hbs`,
		},
		presets: {
			template: `modules/tokenmagic/templates/apps/preset-toggle.hbs`,
			scrollable: ['.presets'],
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'presets':
				await this._preparePresetContext(context, options);
				break;
			case 'header':
				await this._prepareHeaderContext(context, options);
				break;
		}
		return context;
	}

	async _prepareHeaderContext(context, options) {
		context.activeOnly = this._activeOnly;
		context.searchQuery = this._searchQuery ?? '';

		// Provide opportunity for 3rd party modules to insert additional controls
		// Expected format: { icon: 'fa-icon', tooltip: 'Tooltip Text', uuid: 'Macro UUID' }
		const controls = [];
		Hooks.call('TokenMagic.getPresetTogglerControls', controls);
		context.controls = controls;
	}

	async _preparePresetContext(context, options) {
		const controlled = TokenMagic.getControlledPlaceables();

		let presets = this._presets ?? TokenMagic.getPresets();
		if (this._searchQuery?.trim()) {
			const terms = this._searchQuery
				.split(' ')
				.map((term) => term.trim())
				.filter(Boolean);
			if (terms.length) {
				presets = presets.filter((p) => {
					const name = p.name.toLocaleLowerCase();
					return terms.every((t) => name.includes(t));
				});
			}
		}

		presets = presets.map((p) => {
			return {
				name: p.name,
				id: p.params[0].filterId,
				active: controlled.some((c) => TokenMagic.hasFilterId(c, p.params[0].filterId)),
			};
		});
		if (this._activeOnly) presets = presets.filter((p) => p.active);

		context.presets = presets;
	}

	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);
		switch (partId) {
			case 'header':
				element.querySelector('input[type="search"]').addEventListener('input', this._onSearch.bind(this));
				break;
		}
	}

	_onSearch(event) {
		clearTimeout(this._searchTimeout);
		this._searchTimeout = setTimeout(() => {
			this._searchQuery = event.target.value;
			this.render({ parts: ['presets'] });
		}, 200);
	}

	/**
	 * Toggle a preset on controlled placeables
	 * @param {MouseEvent} event
	 * @param {HTMLElement} element
	 */
	static async _onTogglePreset(event, element) {
		const filterId = element.dataset.id;
		const controlled = TokenMagic.getControlledPlaceables();
		if (!controlled.length) return;

		const isActive = controlled.some((c) => TokenMagic.hasFilterId(c, filterId));

		if (isActive) {
			const filterIds = new Set(TokenMagic.getPreset(element.dataset.name).map((p) => p.filterId));

			for (const placeable of controlled) {
				for (const filterId of filterIds) {
					if (TokenMagic.hasFilterId(placeable, filterId)) {
						await TokenMagic.deleteFilters(placeable, filterId);
					}
				}
			}
		} else {
			const preset = TokenMagic.getPreset(element.dataset.name);
			for (const placeable of controlled) {
				if (!TokenMagic.hasFilterId(placeable, filterId)) {
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

	static _onExecuteControlMacro(event, element) {
		fromUuid(element.dataset.uuid).then((macro) => macro?.execute?.());
	}

	/** @override */
	async _onFirstRender(context, options) {
		await super._onFirstRender(context, options);
		this._hooks = [];
		for (const layer of ['Token', 'Tile', 'MeasuredTemplate', 'Drawing', 'Region']) {
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
