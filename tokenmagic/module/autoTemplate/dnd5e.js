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
				const config = { preset: emptyPreset, texture: null };
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
		this._enabled = false;
	}

	get enabled() {
		return this._enabled;
	}

	configure(enabled = false) {
		if (game.system.id !== 'dnd5e') return;

		if (!enabled) {
			if (this._enabled) {
				if (game.modules.get('lib-wrapper')?.active) {
					libWrapper.unregister('tokenmagic', 'game.dnd5e.canvas.AbilityTemplate.fromItem');
				} else {
					window.location.reload();
				}
			}
		} else {
			if (!this._enabled) {
				if (game.modules.get('lib-wrapper')?.active) {
					libWrapper.register('tokenmagic', 'game.dnd5e.canvas.AbilityTemplate.fromItem', fromItem, 'WRAPPER');
				} else {
					const origFromItem = game.dnd5e.canvas.AbilityTemplate.fromItem;
					game.dnd5e.canvas.AbilityTemplate.fromItem = function () {
						return fromItem.call(this, origFromItem.bind(this), ...arguments);
					};
				}
			}
		}

		this._enabled = enabled;
	}

	getData() {
		return {
			hasAutoTemplates: true,
			dmgTypes: CONFIG.DND5E.damageTypes,
			templateTypes: CONFIG.MeasuredTemplate.types,
		};
	}
}

function fromConfig(config, template) {
	const o = { tokenmagic: { options: {} } };
	if (config.preset && config.preset !== '' && config.preset !== emptyPreset) {
		o.tokenmagic.options.tmfxPreset = config.preset;
	}
	if (config.texture && config.texture !== '') {
		o.tokenmagic.options.tmfxTexture = config.texture;
	}
	if (config.tint && config.tint !== '') {
		o.tokenmagic.options.tmfxTint = config.tint;
	}
	o.tokenmagic.options.tmfxTextureAlpha = config.opacity;
	template.document.updateSource({ flags: { tokenmagic: o.tokenmagic } });
}

function fromOverrides(overrides = [], item, template) {
	let configs = overrides.filter((el) => el.target.toLowerCase() === item.name.toLowerCase());
	if (configs.length === 0) {
		return false;
	}
	// if there are multiple overrides for the same item, the random one is chosen
	let config = configs[Math.floor(Math.random() * configs.length)];
	fromConfig(config, template);
	return true;
}

function fromCategories(categories = {}, item, template) {
	if (!item.hasDamage) {
		return false;
	}

	let config, dmgSettings;

	// some items/spells have multiple damage types
	// this loop looks over all the types until it finds one with a valid fx preset
	for (const [_, dmgType] of item.system.damage.parts) {
		dmgSettings = categories[dmgType] || {};
		config = dmgSettings[template.document.t];

		if (config && config.preset !== emptyPreset) {
			break;
		}
	}
	if (!config) {
		return false;
	}
	fromConfig(mergeObject(config, { opacity: dmgSettings.opacity, tint: dmgSettings.tint }, true, true), template);
	return true;
}

function fromItem(wrapped, ...args) {
	const [item] = args;
	const template = wrapped(...args);
	if (!template) {
		return template;
	}
	let hasPreset = template.hasOwnProperty('tmfxPreset');
	if (hasPreset) {
		return template;
	}
	const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
	let updated = settings.overrides ? fromOverrides(Object.values(settings.overrides), item, template) : false;
	if (!updated) {
		fromCategories(settings.categories, item, template);
	}
	return template;
}

export const dnd5eTemplates = new AutoTemplateDND5E();
