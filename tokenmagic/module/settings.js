import { presets as defaultPresets } from '../fx/presets/defaultpresets.js';
import { DataVersion } from '../migration/migration.js';
import { TokenMagic, fixPath } from './tokenmagic.js';
import { AutoTemplateDND5E } from '../gui/apps/autoTemplate/dnd5e.js';
import { AutoTemplatePF2E } from '../gui/apps/autoTemplate/pf2e.js';
import { AutoTemplateTheWitcherTRPG } from '../gui/apps/autoTemplate/TheWitcherTRPG.js';
import { emptyPreset } from './constants.js';
import { FilterOverrideManager } from '../fx/FilterOverrides.js';

const Magic = TokenMagic();

export class TokenMagicSettings {
	static init() {
		const autoTemplateClass = this.getSystemTemplateClass();
		const hasAutoTemplates = !!autoTemplateClass;
		if (autoTemplateClass) {
			game.settings.registerMenu('tokenmagic', 'autoTemplateSettings', {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.name'),
				label: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.label'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.button.hint'),
				type: autoTemplateClass,
				restricted: true,
			});
			game.settings.register('tokenmagic', 'autoTemplateSettings', {
				name: game.i18n.localize('TMFX.settings.autoTemplateSettings.name'),
				hint: game.i18n.localize('TMFX.settings.autoTemplateSettings.hint'),
				scope: 'world',
				config: false,
				default: autoTemplateClass.defaultConfiguration,
				type: Object,
			});
		}

		game.settings.register('tokenmagic', 'autoTemplateEnabled', {
			name: game.i18n.localize('TMFX.settings.autoTemplateEnabled.name'),
			hint: game.i18n.localize('TMFX.settings.autoTemplateEnabled.hint'),
			scope: 'world',
			config: hasAutoTemplates,
			default: hasAutoTemplates,
			type: Boolean,
			onChange: (value) => TokenMagicSettings.configureAutoTemplate(value),
		});

		game.settings.register('tokenmagic', 'useAdditivePadding', {
			name: game.i18n.localize('TMFX.settings.useMaxPadding.name'),
			hint: game.i18n.localize('TMFX.settings.useMaxPadding.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'minPadding', {
			name: game.i18n.localize('TMFX.settings.minPadding.name'),
			hint: game.i18n.localize('TMFX.settings.minPadding.hint'),
			scope: 'world',
			config: true,
			default: 50,
			type: Number,
		});

		game.settings.register('tokenmagic', 'fxPlayerPermission', {
			name: game.i18n.localize('TMFX.settings.fxPlayerPermission.name'),
			hint: game.i18n.localize('TMFX.settings.fxPlayerPermission.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'importOverwrite', {
			name: game.i18n.localize('TMFX.settings.importOverwrite.name'),
			hint: game.i18n.localize('TMFX.settings.importOverwrite.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'useZOrder', {
			name: game.i18n.localize('TMFX.settings.useZOrder.name'),
			hint: game.i18n.localize('TMFX.settings.useZOrder.hint'),
			scope: 'world',
			config: true,
			default: false,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'disableAnimations', {
			name: game.i18n.localize('TMFX.settings.disableAnimations.name'),
			hint: game.i18n.localize('TMFX.settings.disableAnimations.hint'),
			scope: 'client',
			config: true,
			default: false,
			type: Boolean,
			requiresReload: true,
		});

		game.settings.register('tokenmagic', 'disableCaching', {
			name: game.i18n.localize('TMFX.settings.disableCaching.name'),
			hint: game.i18n.localize('TMFX.settings.disableCaching.hint'),
			scope: 'client',
			config: true,
			default: true,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'presets', {
			name: 'Token Magic FX presets',
			hint: 'Token Magic FX presets',
			scope: 'world',
			config: false,
			default: defaultPresets,
			type: Object,
		});

		game.settings.register('tokenmagic', 'migration', {
			name: 'TMFX Data Version',
			hint: 'TMFX Data Version',
			scope: 'world',
			config: false,
			default: DataVersion.ARCHAIC,
			type: String,
		});

		game.settings.register('tokenmagic', 'alwaysDisplayEditorControl', {
			name: game.i18n.localize('TMFX.settings.alwaysDisplayEditorControl.name'),
			hint: game.i18n.localize('TMFX.settings.alwaysDisplayEditorControl.hint'),
			scope: 'world',
			config: true,
			default: true,
			type: Boolean,
		});

		game.settings.register('tokenmagic', 'globalOverrides', {
			name: 'Global Filter Param Overrides',
			scope: 'world',
			config: false,
			default: {},
			type: Object,
			onChange: () => FilterOverrideManager._loadOverrides(),
		});

		game.settings.register('tokenmagic', 'overridePresets', {
			name: 'Override Presets',
			scope: 'world',
			config: false,
			default: {},
			type: Object,
		});
	}

	static configureAutoTemplate(enabled = false) {
		this.getSystemTemplates()?.configure(enabled);
	}

	static getSystemTemplates() {
		if (this._autoTemplate) return this._autoTemplate;

		const cls = this.getSystemTemplateClass();
		this._autoTemplate = cls ? new cls() : null;

		return this._autoTemplate;
	}

	static getSystemTemplateClass() {
		switch (game.system.id) {
			case 'dnd5e':
				return AutoTemplateDND5E;
			case 'pf2e':
				return AutoTemplatePF2E;
			case 'TheWitcherTRPG':
				return AutoTemplateTheWitcherTRPG;
			default:
				return null;
		}
	}
}

Hooks.once('init', () => {
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
