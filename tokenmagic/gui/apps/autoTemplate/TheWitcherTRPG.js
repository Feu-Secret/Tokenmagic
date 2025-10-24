import { defaultOpacity, emptyPreset } from '../../../module/constants.js';
import { TemplateSettings } from './TemplateSettings.js';

export class AutoTemplateTheWitcherTRPG extends TemplateSettings {
	constructor() {
		super();
		this._enabled = false;
	}

	/** @override */
	static PARTS = {
		tabs: { template: 'templates/generic/tab-navigation.hbs' },
		categories: { template: 'modules/tokenmagic/templates/settings/generic/categories.hbs' },
		overrides: { template: 'modules/tokenmagic/templates/settings/generic/overrides.hbs' },
	};

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

		Object.keys(CONFIG.WITCHER.meleeSkills).forEach((meleeSkillType) => {
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
			Object.values(CONST.MEASURED_TEMPLATE_TYPES).forEach((tplType) => {
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

	get enabled() {
		return this._enabled;
	}

	configure(enabled = false) {
		if (game.system.id !== 'TheWitcherTRPG') return;
		this._enabled = enabled;
	}

	/** @override */
	async _preparePartContext(partId, context, options) {
		await super._preparePartContext(partId, context, options);
		switch (partId) {
			case 'categories':
				this._prepareCategoriesContext(context, options);
				break;
		}
		return context;
	}

	_prepareCategoriesContext(context, options) {
		const dmgTypes = {};
		for (const type of CONFIG.WITCHER.meleeSkills.sort((k1, k2) => k1.localeCompare(k2))) {
			dmgTypes[type] = { label: type.charAt(0).toUpperCase() + type.slice(1) };
		}
		context.dmgTypes = dmgTypes;
		context.templateTypes = CONST.MEASURED_TEMPLATE_TYPES;
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
	foundry.utils.mergeObject(templateData, { 'flags.tokenmagic': o.tokenmagic });
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

	fromConfig(
		foundry.utils.mergeObject(config, { opacity: dmgSettings.opacity, tint: dmgSettings.tint }, true, true),
		templateData
	);
	return true;
}
