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
			Object.values(CONST.MEASURED_TEMPLATE_TYPES).forEach((tplType) => {
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
				libWrapper.unregister('tokenmagic', 'game.dnd5e.canvas.AbilityTemplate.fromActivity');
			}
		} else {
			if (!this._enabled) {
				libWrapper.register('tokenmagic', 'game.dnd5e.canvas.AbilityTemplate.fromActivity', fromActivity, 'WRAPPER');
			}
		}

		this._enabled = enabled;
	}

	getData() {
		return {
			hasAutoTemplates: true,
			dmgTypes: CONFIG.DND5E.damageTypes,
			templateTypes: CONST.MEASURED_TEMPLATE_TYPES,
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
	template.updateSource({ flags: { tokenmagic: o.tokenmagic } });
}

function fromOverrides(overrides = [], activity, template) {
	if (!activity.item) return false;
	let configs = overrides.filter((el) => el.target.toLowerCase() === activity.item.name.toLowerCase());
	if (configs.length === 0) {
		return false;
	}
	// if there are multiple overrides for the same item, the random one is chosen
	let config = configs[Math.floor(Math.random() * configs.length)];
	fromConfig(config, template);
	return true;
}

function fromCategories(categories = {}, activity, template) {
	if (!activity.item) return false;

	let item = activity.item;
	if (!(item.hasAttack || item.hasSave) && !item.system.damage?.base?.types.size) {
		return false;
	}

	let config, dmgSettings;

	let dmgTypes = [];
	if(item.system?.damage?.base?.types) {
		dmgTypes = item.system.damage.base.types;
	} 
	if(!dmgTypes.length && item.system.activities) {
		const saves = item.system.activities.getByType("save")
		if(saves.length) {
			dmgTypes = saves.flatMap(save => save.damage.parts.flatMap(part => Array.from(part.types)))
		}
	}

	// some items/spells have multiple damage types
	// this loop looks over all the types until it finds one with a valid fx preset
	for (const dmgType of dmgTypes) {
		dmgSettings = categories[dmgType] || {};
		config = dmgSettings[template.t];

		if (config && config.preset !== emptyPreset) {
			break;
		}
	}
	if (!config) {
		return false;
	}
	fromConfig(
		foundry.utils.mergeObject(config, { opacity: dmgSettings.opacity, tint: dmgSettings.tint }, true, true),
		template
	);
	return true;
}

function fromActivity(wrapped, ...args) {
	const [activity] = args;
	const activityTemplates = wrapped(...args);
	if (!activityTemplates) {
		return activityTemplates;
	}

	for (const activityTemplate of activityTemplates) {
		const template = activityTemplate.document;

		let hasPreset = template.hasOwnProperty('tmfxPreset');
		if (hasPreset) continue;

		const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
		let updated = settings.overrides ? fromOverrides(Object.values(settings.overrides), activity, template) : false;
		if (!updated) {
			fromCategories(settings.categories, activity, template);
		}
	}

	return activityTemplates;
}

export const dnd5eTemplates = new AutoTemplateDND5E();
