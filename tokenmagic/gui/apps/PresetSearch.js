import { PresetsLibrary } from '../../fx/presets/defaultpresets';
import { FILTER_PARAM_CONTROLS } from './data/fxControls';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

// TODO
// drag listener
// delete

export function presetSearch(options) {
	const activeInstance = foundry.applications.instances.get(PresetSearch.DEFAULT_OPTIONS.id);
	if (activeInstance) {
		activeInstance.close();
		return;
	}
	new PresetSearch(options).render(true);
}

export class PresetSearch extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(options = {}) {
		super(options);
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-preset-search',
		window: {
			title: 'TokenMagicFX Presets',
			resizable: true,
		},
		position: {
			width: 300,
			height: 500,
		},
		classes: ['tokenmagic', 'search', 'flexcol'],
		actions: {
			delete: PresetSearch._onDeletePreset,
			toggleTemplates: PresetSearch._onToggleTemplates,
		},
	};

	/** @override */
	static PARTS = {
		search: {
			template: `modules/tokenmagic/templates/apps/preset-search/header-search.hbs`,
		},
		controls: {
			template: `modules/tokenmagic/templates/apps/preset-search/header-controls.hbs`,
		},
		presets: {
			template: `modules/tokenmagic/templates/apps/filter-editor/filter-list.hbs`,
			scrollable: ['.filter-list'],
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'search':
				context.searchQuery = this._searchQuery ?? '';
				break;
			case 'controls':
				context.controls = [
					{
						action: 'toggleTemplates',
						tooltip: 'Toggle Template presets',
						icon: 'fa-fw fa-solid fa-ruler-combined',
						active: Boolean(this._templates),
					},
				];
				break;
			case 'presets':
				await this._preparePresetContext(context, options);
				break;
		}
		return context;
	}

	async _preparePresetContext(context, options) {
		const controlled = TokenMagic.getControlledPlaceables();
		const library = this._templates ? PresetsLibrary.TEMPLATE : PresetsLibrary.MAIN;

		this._presets = TokenMagic.getPresets(library);

		let presets = this._presets;
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

		const controls = [
			{
				class: 'delete',
				action: 'delete',
				tooltip: 'Delete',
				icon: 'fa-solid fa-trash',
			},
		];

		presets = presets.map((p) => {
			const types = p.params.map((param) => param.filterType);
			let thumbnail;
			if (types.length > 1) thumbnail = 'icons/commodities/cloth/cloth-rolls-rgb.webp';
			else thumbnail = FILTER_PARAM_CONTROLS[types[0]]?._thumb ?? FILTER_PARAM_CONTROLS.common._thumb;

			return {
				label: p.name,
				subtext: types.join(', '),
				filterId: p.name,
				filterType: library,
				active: controlled.some((c) => TokenMagic.hasFilterId(c, p.params[0].filterId)),
				controls,
				thumbnail,
			};
		});

		context.filters = presets;
	}

	/** @override */
	_attachPartListeners(partId, element, options) {
		super._attachPartListeners(partId, element, options);
		switch (partId) {
			case 'search':
				element.querySelector('input[type="search"]').addEventListener('input', this._onSearch.bind(this));
				break;
			case 'presets':
				element.querySelectorAll('.filter').forEach((el) => {
					el.addEventListener('dragstart', this._onDragStart.bind(this));
				});
				break;
		}
	}

	_onDragStart(event) {
		const { filterId: name, filterType: library } = event.target.closest('.filter').dataset;
		const dragData = { type: 'TMFX-Preset', name, library };
		event.dataTransfer.setData('text/plain', JSON.stringify(dragData));
	}

	_onSearch(event) {
		clearTimeout(this._searchTimeout);
		this._searchTimeout = setTimeout(() => {
			this._searchQuery = event.target.value;
			this.render({ parts: ['presets'] });
		}, 200);
	}

	static _onToggleTemplates(event, element) {
		this._templates = !this._templates;
		this.render({ parts: ['controls', 'presets'] });
	}

	static async _onDeletePreset(event, element) {
		const { filterId: name, filterType: library } = element.closest('.filter').dataset;

		const confirmation = await foundry.applications.api.DialogV2.confirm({
			window: { title: 'Delete Preset' },
			content: `<p style="color: red;"><strong>This operation cannot be undone. Do you wish to continue?</strong></p>`,
		});

		if (confirmation) {
			await TokenMagic.deletePreset({ name, library });
			this.render({ parts: ['presets'] });
		}
	}
}
