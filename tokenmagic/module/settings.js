import { presets as defaultPresets, PresetsLibrary } from "../fx/presets/defaultpresets.js";
import { DataVersion } from "../migration/migration.js";
import { TokenMagic } from './tokenmagic.js';
import { AutoTemplateDND5E, dnd5eTemplates } from "./autoTemplate/dnd5e.js";
import { defaultOpacity, emptyPreset } from './constants.js';

const Magic = TokenMagic();

export class TokenMagicSettings extends FormApplication {
	static init() {
		const menuAutoTemplateSettings = {
			key: 'autoTemplateSettings',
			config: {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.name'),
				label: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.label'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.hint'),
				type: TokenMagicSettings,
				restricted: true,
			},
		};

		const settingAutoTemplateSettings = {
			key: 'autoTemplateSettings',
			config: {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.name'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.hint'),
				scope: 'world',
				config: false,
				default: {},
				type: Object,
			},
		};

		let hasAutoTemplates = false;
		switch (game.system.id) {
			case 'dnd5e':
				hasAutoTemplates = true;
				game.settings.registerMenu('tokenmagic', menuAutoTemplateSettings.key, menuAutoTemplateSettings.config);
				game.settings.register(
					'tokenmagic',
					settingAutoTemplateSettings.key,
					mergeObject(settingAutoTemplateSettings.config, {
						default: AutoTemplateDND5E.defaultConfiguration
					}, true, true),
				);
				break;
			default:
				break;
		}

		game.settings.register('tokenmagic', 'autoTemplateEnabled', {
			name: game.i18n.localize('TMFX.settings.autoTemplateEnabled.name'),
			hint: game.i18n.localize('TMFX.settings.autoTemplateEnabled.hint'),
			scope: 'client',
			config: hasAutoTemplates,
			default: hasAutoTemplates,
			type: Boolean,
			onChange: (value) => TokenMagicSettings.configureAutoTemplate(value),
		});

		game.settings.register('tokenmagic', 'defaultTemplateOnHover', {
			name: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.name'),
			hint: game.i18n.localize('TMFX.settings.defaultTemplateOnHover.hint'),
			scope: 'client',
			config: true,
			default: hasAutoTemplates,
			type: Boolean
		});

		game.settings.register("tokenmagic", "useAdditivePadding", {
			name: game.i18n.localize("TMFX.settings.useMaxPadding.name"),
			hint: game.i18n.localize("TMFX.settings.useMaxPadding.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "minPadding", {
			name: game.i18n.localize("TMFX.settings.minPadding.name"),
			hint: game.i18n.localize("TMFX.settings.minPadding.hint"),
			scope: "world",
			config: true,
			default: 50,
			type: Number
		});

		game.settings.register("tokenmagic", "fxPlayerPermission", {
			name: game.i18n.localize("TMFX.settings.fxPlayerPermission.name"),
			hint: game.i18n.localize("TMFX.settings.fxPlayerPermission.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "importOverwrite", {
			name: game.i18n.localize("TMFX.settings.importOverwrite.name"),
			hint: game.i18n.localize("TMFX.settings.importOverwrite.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "useZOrder", {
			name: game.i18n.localize("TMFX.settings.useZOrder.name"),
			hint: game.i18n.localize("TMFX.settings.useZOrder.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "disableAnimations", {
			name: game.i18n.localize("TMFX.settings.disableAnimations.name"),
			hint: game.i18n.localize("TMFX.settings.disableAnimations.hint"),
			scope: "client",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "disableCaching", {
			name: game.i18n.localize("TMFX.settings.disableCaching.name"),
			hint: game.i18n.localize("TMFX.settings.disableCaching.hint"),
			scope: "client",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "disableVideo", {
			name: game.i18n.localize("TMFX.settings.disableVideo.name"),
			hint: game.i18n.localize("TMFX.settings.disableVideo.hint"),
			scope: "world",
			config: true,
			default: false,
			type: Boolean
		});

		game.settings.register("tokenmagic", "presets", {
			name: "Token Magic FX presets",
			hint: "Token Magic FX presets",
			scope: "world",
			config: false,
			default: defaultPresets,
			type: Object
		});

		game.settings.register("tokenmagic", "migration", {
			name: "TMFX Data Version",
			hint: "TMFX Data Version",
			scope: "world",
			config: false,
			default: DataVersion.ARCHAIC,
			type: String
		});

		loadTemplates([
			'modules/tokenmagic/templates/settings/settings.html',
			'modules/tokenmagic/templates/settings/dnd5e/categories.html',
			'modules/tokenmagic/templates/settings/dnd5e/overrides.html',
		]);
	}

	static configureAutoTemplate(enabled = false) {
		switch (game.system.id) {
			case 'dnd5e':
				dnd5eTemplates.configure(enabled);
				break;
			default:
				break;
		}
	}

	/** @override */
	static get defaultOptions() {
		return {
			...super.defaultOptions,
			template: 'modules/tokenmagic/templates/settings/settings.html',
			height: 'auto',
			title: game.i18n.localize('TMFX.settings.autoTemplateSettings.dialog.title'),
			width: 600,
			classes: ['tokenmagic', 'settings'],
			tabs: [
				{
					navSelector: '.tabs',
					contentSelector: 'form',
					initial: 'name',
				},
			],
			submitOnClose: false,
		};
	}

	constructor(object = {}, options) {
		super(object, options);
	}

	getSettingsData() {
		let settingsData = {
			'autoTemplateEnable': game.settings.get('tokenmagic', 'autoTemplateEnabled'),
		}
		switch (game.system.id) {
			case 'dnd5e':
				settingsData['autoTemplateSettings'] = game.settings.get('tokenmagic', 'autoTemplateSettings');
				break;
			default:
				break;
		}
		return settingsData;
	}

	/** @override */
	getData() {
		let data = super.getData();
		data.hasAutoTemplates = false;
		data.emptyPreset = emptyPreset;
		switch (game.system.id) {
			case 'dnd5e':
				data.hasAutoTemplates = true
				data.dmgTypes = CONFIG.DND5E.damageTypes;
				data.templateTypes = CONFIG.MeasuredTemplate.types;
				break;
			default:
				break;
		}
		data.presets = Magic.getPresets(PresetsLibrary.TEMPLATE).sort(function (a, b) {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});
		data.system = { id: game.system.id, title: game.system.data.title };
		data.settings = this.getSettingsData();
		data.submitText = game.i18n.localize('TMFX.save');
		return data;
	}

	/** @override */
	async _updateObject(_, formData) {
		const data = expandObject(formData);
		for (let [key, value] of Object.entries(data)) {
			if (key == 'autoTemplateSettings' && value.overrides) {
				const compacted = {};
				Object.values(value.overrides).forEach((val, idx) => compacted[idx] = val);
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

	async _onAddOverride(event) {
		event.preventDefault();
		let idx = 0;
		const entries = event.target.closest('div.tab').querySelectorAll('div.override-entry');
		const last = entries[entries.length - 1];
		if (last) {
			idx = last.dataset.idx + 1;
		}
		let updateData = {}
		updateData[`autoTemplateSettings.overrides.${idx}.target`] = '';
		updateData[`autoTemplateSettings.overrides.${idx}.opacity`] = defaultOpacity;
		updateData[`autoTemplateSettings.overrides.${idx}.tint`] = null;
		updateData[`autoTemplateSettings.overrides.${idx}.preset`] = emptyPreset;
		updateData[`autoTemplateSettings.overrides.${idx}.texture`] = null;
		await this._onSubmit(event, { updateData: updateData, preventClose: true });
		this.render();
	}

	async _onRemoveOverride(event) {
		event.preventDefault();
		let idx = event.target.dataset.idx;
		const el = event.target.closest(`div[data-idx="${idx}"]`);
		if (!el) {
			return true;
		}
		el.remove();
		await this._onSubmit(event, { preventClose: true });
		this.render();
	}
}

Hooks.once("init", () => {
	// Extracted from https://github.com/leapfrogtechnology/just-handlebars-helpers/
	Handlebars.registerHelper('concat', function (...params) {
		// Ignore the object appended by handlebars.
		if (typeof params[params.length - 1] === 'object') {
			params.pop();
		}

		return params.join('');
	});
	TokenMagicSettings.init();
	TokenMagicSettings.configureAutoTemplate(game.settings.get('tokenmagic', 'autoTemplateEnabled'));
});
