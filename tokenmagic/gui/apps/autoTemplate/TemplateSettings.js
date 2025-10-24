import { PresetsLibrary } from '../../../fx/presets/defaultpresets.js';
import { defaultOpacity, emptyPreset } from '../../../module/constants.js';
import { Magic } from '../../../module/tokenmagic.js';

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class TemplateSettings extends HandlebarsApplicationMixin(ApplicationV2) {
	/** @override */
	static DEFAULT_OPTIONS = {
		id: 'tmfx-template-settings',
		tag: 'form',
		window: {
			icon: 'fa-solid fa-fire',
			title: 'TMFX.settings.autoTemplateSettings.dialog.title',
			contentClasses: ['standard-form'],
		},
		classes: ['tokenmagic', 'settings'],
		position: {
			width: 600,
		},
		form: {
			handler: TemplateSettings._onSubmit,
			submitOnChange: true,
			closeOnSubmit: false,
		},
		actions: {
			addOverride: TemplateSettings._onAddOverride,
			removeOverride: TemplateSettings._onRemoveOverride,
		},
	};

	/** @override */
	static TABS = {
		main: {
			tabs: [
				{ id: 'categories', icon: 'fa-regular fa-book-open' },
				{ id: 'overrides', icon: 'fa-solid fa-circle-plus' },
			],
			initial: 'categories',
			labelPrefix: 'TMFX.settings.autoTemplateSettings.tabs',
		},
	};

	/** @override */
	async _preparePartContext(partId, context, options) {
		context.partId = partId;
		if (partId in context.tabs) context.tab = context.tabs[partId];
		return context;
	}

	/** @override */
	async _prepareContext(options) {
		const context = await super._prepareContext(options);

		return Object.assign(context, {
			emptyPreset,
			presets: [
				{ name: emptyPreset },
				...Magic.getPresets(PresetsLibrary.TEMPLATE).sort(function (a, b) {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				}),
			],
			system: { id: game.system.id, title: game.system.title },
			settings: {
				autoTemplateEnable: game.settings.get('tokenmagic', 'autoTemplateEnabled'),
				autoTemplateSettings: game.settings.get('tokenmagic', 'autoTemplateSettings'),
			},
			submitText: game.i18n.localize('TMFX.save'),
		});
	}

	static async _onSubmit(event, form, formData) {
		const data = foundry.utils.expandObject(formData.object);

		for (let [key, value] of Object.entries(data)) {
			if (key === 'autoTemplateSettings' && value.overrides) {
				const compacted = {};
				Object.values(value.overrides).forEach((val, idx) => (compacted[idx] = val));
				value.overrides = compacted;
			}
			await game.settings.set('tokenmagic', key, value);
		}
	}

	/** @override */
	activateListeners(html) {
		super.activateListeners(html);

		html.find('button.add-override').click(this._onAddOverride.bind(this));
		html.find('button.remove-override').click(this._onRemoveOverride.bind(this));
	}

	static async _onAddOverride(event) {
		const autoTemplateSettings = await game.settings.get('tokenmagic', 'autoTemplateSettings');

		let idx;

		const lastKey = Object.keys(autoTemplateSettings.overrides)
			.map((k) => Number(k))
			.sort()
			.at(-1);
		if (lastKey == null) idx = 0;
		else idx = lastKey + 1;

		autoTemplateSettings.overrides[idx] = {
			target: '',
			opacity: defaultOpacity,
			tint: null,
			preset: emptyPreset,
			texture: null,
		};

		await game.settings.set('tokenmagic', 'autoTemplateSettings', autoTemplateSettings);
		this.render(true);
	}

	static async _onRemoveOverride(event) {
		event.target.closest('.override-entry').remove();
		await this.submit();
		this.render();
	}
}
