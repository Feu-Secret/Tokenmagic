import { defaultOpacity, emptyPreset } from '../constants.js';

export class AutoTemplateTheWitcherTRPG {
	static get defaultConfiguration() {
		const defaultConfig = {
			categories: {},
			overrides: {
				0: {
					target: 'Игни',
					opacity: 0.5,
					tint: '#00a80b',
					preset: 'Flames',
					texture: null,
				},
			},
		};

		Object.keys(CONFIG.witcher.meleeSkills).forEach((meleeSkillType) => {
			if (defaultConfig.categories[meleeSkillType] == undefined) {
				const config = { opacity: defaultOpacity, tint: null };
				switch (meleeSkillType.toLowerCase()) {
					case 'brawling':
						config.tint = '#2d8000';
						config.opacity = 0.6;
						break;
					case 'melee':
						config.tint = '#47b3ff';
						break;
					case 'small blades':
						config.tint = '#502673';
						break;
					case 'staff/spear':
						config.tint = '#00a80b';
						break;
					case 'swordsmanship':
						config.tint = '#8000ff';
						break;
					case 'athletics':
						config.tint = '#0060ff';
						break;
					default:
						break;
				}
				defaultConfig.categories[meleeSkillType] = config;
			}
			Object.keys(CONFIG.MeasuredTemplate.types).forEach((tplType) => {
				const config = { preset: emptyPreset, texture: null };
				switch (meleeSkillType.toLowerCase()) {
					case 'acid':
						config.preset = 'slashing';
						break;
					case 'cold':
						config.preset = 'bludgeoning';
						break;
					case 'fire':
						config.preset = 'piercing';
						break;
					case 'force':
						config.preset = 'elemental';
						break;
					default:
						break;
				}
				defaultConfig.categories[meleeSkillType][tplType] = config;
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
		if (game.system.id !== 'TheWitcherTRPG') return;
		this._enabled = enabled;
	}

	getData() {
		return {
			hasAutoTemplates: true,
			meleeSkills: CONFIG.witcher.meleeSkills,
			templateTypes: CONFIG.MeasuredTemplate.types,
		};
	}

	preCreateMeasuredTemplate(template) {
		let hasPreset = template.hasOwnProperty('tmfxPreset');
		if (hasPreset) {
			return template;
		}
		const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
		let updated = settings.overrides ? fromOverrides(Object.values(settings.overrides), template) : false;
		if (!updated) {
			fromCategories(settings.categories, template);
		}
	}
}

function fromConfig(config, templateData) {
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
	mergeObject(templateData, { 'flags.tokenmagic': o.tokenmagic });
}

function fromOverrides(overrides = [], templateData) {
	const name = templateData.flags.witcher?.origin?.name;
	let config = overrides.find((el) => el.target.toLowerCase() === name?.toLowerCase());
	if (!config) {
		return false;
	}
	fromConfig(config, templateData);
	return true;
}

function fromCategories(categories = {}, templateData) {
	const traits = templateData.flags.witcher?.origin?.traits ?? [];

	let config, dmgSettings;
	for (const trait of traits) {
		dmgSettings = categories[trait] || {};
		config = dmgSettings[templateData.t];

		if (config && config.preset !== emptyPreset) {
			break;
		}
	}

	if (!config) {
		return false;
	}

	fromConfig(mergeObject(config, { opacity: dmgSettings.opacity, tint: dmgSettings.tint }, true, true), templateData);
	return true;
}

export const witcherTemplates = new AutoTemplateTheWitcherTRPG();
