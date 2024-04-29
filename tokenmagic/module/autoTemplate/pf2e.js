import { defaultOpacity, emptyPreset } from '../constants.js';

export class AutoTemplatePF2E {
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
					target: 'Sanguine Mist',
					opacity: 0.6,
					tint: '#c41212',
					preset: 'Smoky Area',
				},
				2: {
					target: 'Web',
					opacity: 0.5,
					tint: '#808080',
					preset: 'Spider Web 2',
					texture: null,
				},
				3: {
					target: 'Incendiary Aura',
					opacity: 0.2,
					tint: '#b12910',
					preset: 'Smoke Filaments',
					texture: null,
				},
			},
		};

		Object.keys(CONFIG.PF2E.damageTraits).forEach((dmgType) => {
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
					case 'electricity':
						break;
					case 'fire':
						break;
					case 'force':
						break;
					case 'mental':
						config.tint = '#8000ff';
						break;
					case 'negative':
						config.tint = '#502673';
						break;
					case 'poison':
						config.tint = '#00a80b';
						break;
					case 'positive':
						break;
					case 'sonic':
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
					case 'electricity':
						config.preset = 'Shock';
						break;
					case 'fire':
						config.preset = 'Flames';
						break;
					case 'force':
						config.preset = 'Waves 3';
						break;
					case 'mental':
						config.preset = 'Classic Rays';
						break;
					case 'negative':
						config.preset = 'Smoke Filaments';
						break;
					case 'poison':
						config.preset = 'Smoky Area';
						break;
					case 'positive':
						config.preset = 'Annihilating Rays';
						break;
					case 'sonic':
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

	configure(enabled = false) {
		if (game.system.id !== 'pf2e') return;
		this._enabled = enabled;
	}

	get enabled() {
		return this._enabled;
	}

	set enabled(value) {}

	getData() {
		return {
			hasAutoTemplates: true,
			dmgTypes: CONFIG.PF2E.damageTraits,
			templateTypes: CONFIG.MeasuredTemplate.types,
		};
	}

	preCreateMeasuredTemplate(template) {
		let hasPreset = template.hasOwnProperty('tmfxPreset');
		if (hasPreset) {
			return template;
		}

		const origin = template.flags?.pf2e?.origin;
		const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
		let updated = settings.overrides ? fromOverrides(Object.values(settings.overrides), origin, template) : false;
		if (!updated) {
			fromCategories(settings.categories, origin, template);
		}
		return template;
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

function fromOverrides(overrides = [], origin, template) {
	const { name, slug } = origin;

	let configs = overrides.filter((el) => el.target.toLowerCase() === name?.toLowerCase());
	if (configs.length === 0) {
		return false;
	}
	// if there are multiple overrides for the same item, the random one is chosen
	let config = configs[Math.floor(Math.random() * configs.length)];
	fromConfig(config, template);
	return true;
}

function fromCategories(categories = {}, origin, template) {
	if (!origin.traits?.length) {
		return false;
	}

	let config, dmgSettings;

	// some templates may have multiple traits
	// this loop looks over all of them until it finds one with a valid fx preset
	for (const trait of origin.traits) {
		dmgSettings = categories[trait.toLowerCase()] || {};
		config = dmgSettings[template.t];

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

export const pf2eTemplates = new AutoTemplatePF2E();
