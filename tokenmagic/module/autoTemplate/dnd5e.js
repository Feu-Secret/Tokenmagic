import { defaultOpacity, emptyPreset } from '../constants.js';

export class AutoTemplateDND5E {
	static get defaultConfiguration() {
		const defaultConfig = {
			categories: {},
			overrides: {
				0: {
					target: 'Stinking Cloud',
					opacity: 0.5,
					tint: '#00a80b',
					preset: 'Smoky Area',
					texture: null,
				},
				1: {
					target: 'Web',
					opacity: 0.5,
					tint: '#808080',
					preset: 'Spider Web 2',
					texture: null,
				},
			},
		};

		Object.keys(CONFIG.DND5E.damageTypes).forEach((dmgType) => {
			if (defaultConfig.categories[dmgType] == undefined) {
				const config = { opacity: defaultOpacity, tint: null };
				switch (dmgType.toLowerCase()) {
					case 'acid':
						config.tint = '#2d8000';
						config.opacity = 0.6;
						break;
					case 'cold':
						config.tint = '#47b3ff';
						break;
					case 'necrotic':
						config.tint = '#502673';
						break;
					case 'poison':
						config.tint = '#00a80b';
						break;
					case 'psychic':
						config.tint = '#8000ff';
						break;
					case 'thunder':
						config.tint = '#0060ff';
						break;
					default:
						break;
				}
				defaultConfig.categories[dmgType] = config;
			}
			Object.keys(CONFIG.MeasuredTemplate.types).forEach((tplType) => {
				const config = { preset: emptyPreset, texture: null }
				switch (dmgType.toLowerCase()) {
					case 'acid':
						config.preset = 'Watery Surface 2';
						break;
					case 'cold':
						config.preset = 'Thick Fog';
						break;
					case 'fire':
						config.preset = 'Flames';
						break;
					case 'force':
						config.preset = 'Waves 3';
						break;
					case 'lightning':
						config.preset = 'Shock';
						break;
					case 'necrotic':
						config.preset = 'Smoke Filaments';
						break;
					case 'poison':
						config.preset = 'Smoky Area';
						break;
					case 'psychic':
						config.preset = 'Classic Rays';
						break;
					case 'radiant':
						config.preset = 'Annihilating Rays';
						break;
					case 'thunder':
						config.preset = 'Waves';
						break;
					default:
						break;
				}
				defaultConfig.categories[dmgType][tplType] = config;
			});
		});

		return defaultConfig;
	}

	constructor() {
		this._origFromItem = null;
		this._importedJS = null;
		this._abilityTemplate = null;
	}

	async configure(enabled = false) {
		if (!this._isDnd5e) return;

		if (!enabled) {
			if (this._origFromItem !== null) {
				// Restoring the original function when setting toggled off is unsafe
				// in the case that there is another module patching the same function
				// and they're loaded after us, so resort to refresh here.
				/*
					this._abilityTemplate.fromItem = this._origFromItem;
					this._origFromItem = null;
				*/
				window.location.reload();
			}
			return;
		}

		if (this._importedJS === null) {
			this._importedJS = (await import('../../../../systems/dnd5e/module/pixi/ability-template.js'));
		}
		if (this._abilityTemplate === null) {
			this._abilityTemplate = this._importedJS.default || this._importedJS.AbilityTemplate;
		}

		this._origFromItem = this._abilityTemplate.fromItem;
		this._abilityTemplate.fromItem = this._fromItemFn();
	}

	get _isDnd5e() {
		return game.system.id === 'dnd5e';
	}

	_fromConfig(config, template) {
		if (config.preset && config.preset !== '' && config.preset !== emptyPreset) {
			template.data.tmfxPreset = config.preset;
		}
		if (config.texture && config.texture !== '') {
			template.data.texture = config.texture;
		}
		if (config.tint && config.tint !== '') {
			template.data.tmfxTint = config.tint;
		}
		template.data.tmfxTextureAlpha = config.opacity;
	}

	_fromOverrides(overrides = [], item, template) {
		let config = overrides.find((el) => el.target.toLowerCase() === item.name.toLowerCase());
		if (!config) {
			return false;
		}
		this._fromConfig(config, template);
		return true;
	}

	_fromCategories(categories = {}, item, template) {
		if (!item.hasDamage) {
			return false;
		}
		let dmgSettings = categories[item.data.data.damage.parts[0][1]] || {};
		let config = dmgSettings[template.data.t];
		if (!config) {
			return false;
		}
		this._fromConfig(mergeObject(config, { opacity: dmgSettings.opacity, tint: dmgSettings.tint }, true, true), template);
		return true;
	}

	_fromItemFn() {
		const self = this;
		return function (item) {
			const template = self._origFromItem.apply(this, [item]);
			if (!template) {
				return template;
			}
			let hasPreset = template.hasOwnProperty("tmfxPreset");
			if (hasPreset) {
				return template;
			}
			const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
			let updated = self._fromOverrides(Object.values(settings.overrides), item, template);
			if (!updated) {
				self._fromCategories(settings.categories, item, template);
			}
			return template;
		}
	}
}

export const dnd5eTemplates = new AutoTemplateDND5E();