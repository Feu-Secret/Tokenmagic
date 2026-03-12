import { PresetsLibrary } from '../../../fx/presets/defaultpresets';
import { FILTER_PARAM_CONTROLS } from '../data/fxControls';
import { submitPresetToGallery } from './FilterEditor';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export function presetSearch(options = {}) {
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
			width: 350,
			height: 500,
		},
		classes: ['tokenmagic', 'search', 'flexcol'],
		actions: {
			delete: PresetSearch._onDeletePreset,
			edit: PresetSearch._onEditPreset,
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
			scrollable: [''],
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
						tooltip: game.i18n.localize('TMFX.app.searchPreset.controls.templateToggle'),
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
					const filterTypes = p.params.map((param) => param.filterType.toLocaleLowerCase());
					return terms.every((t) => name.includes(t) || filterTypes.some((type) => type.includes(t)));
				});
			}
		}

		const controls = [
			{
				class: 'edit',
				action: 'edit',
				tooltip: game.i18n.localize('SIDEBAR.Edit'),
				icon: 'fa-solid fa-pen-to-square',
			},
			{
				class: 'delete',
				action: 'delete',
				tooltip: game.i18n.localize('SIDEBAR.Delete'),
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
		const dragData = { type: 'TMFX Preset', name, library };
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

	static async _onEditPreset(event, element) {
		const { filterId: name, filterType: library } = element.closest('.filter').dataset;
		const preset = TokenMagic.getPresets(library).find((p) => p.name === name);
		if (preset) new PresetEdit({ preset, parentApp: this }).render(true);
	}
}

export class PresetEdit extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor({ preset, parentApp }) {
		super({});
		this._preset = foundry.utils.deepClone(preset);
		this._parentApp = parentApp;
	}

	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-preset-edit',
		tag: 'form',
		window: {
			resizable: false,
			contentClasses: ['standard-form'],
			controls: [
				{
					icon: 'fa-solid fa-cloud-arrow-up',
					label: 'Upload to Gallery',
					action: 'upload',
					visible: game.user.isGM,
				},
			],
		},
		form: {
			handler: PresetEdit._onSubmit,
			submitOnChange: false,
			closeOnSubmit: true,
		},
		position: {
			width: 450,
			height: 'auto',
		},
		classes: ['tokenmagic', 'flexcol'],
		actions: {
			delete: PresetSearch._onDeletePreset,
			edit: PresetSearch._onEditPreset,
			toggleTemplates: PresetSearch._onToggleTemplates,
			upload: PresetEdit._onUpload,
		},
	};

	get title() {
		return this._preset.name;
	}

	/** @override */
	static PARTS = {
		main: {
			template: `modules/tokenmagic/templates/apps/preset-search/preset-edit.hbs`,
		},
		footer: { template: 'templates/generic/form-footer.hbs' },
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		switch (partId) {
			case 'main':
				context.name = this._preset.name;
				context.library = this._preset.library;
				context.defaultTexture = this._preset.defaultTexture;
				context.params = JSON.stringify(this._preset.params, null, 2);
				break;
			case 'footer':
				context.buttons = [
					{ type: 'submit', icon: 'fa-solid fa-floppy-disk', label: game.i18n.localize('TMFX.save'), action: 'save' },
				];
				break;
		}
		return context;
	}

	static async _onSubmit(event, form, formData) {
		const name = formData.object.name.trim();
		const defaultTexture = formData.object.defaultTexture?.trim();
		if (this._preset.name === name && this._preset.defaultTexture === defaultTexture) return;
		if (!name) return;

		await TokenMagic.deletePreset({ name: this._preset.name, library: this._preset.library }, true);
		await TokenMagic.addPreset({ name, library: this._preset.library, defaultTexture }, this._preset.params, true);
		if (this._parentApp.state === ApplicationV2.RENDER_STATES.RENDERED) {
			this._parentApp.render({ parts: ['presets'] });
		}
	}

	static async _onUpload(event, element) {
		submitPresetToGallery(this._preset);
	}
}
