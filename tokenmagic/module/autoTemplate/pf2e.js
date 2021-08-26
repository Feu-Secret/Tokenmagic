import {defaultOpacity, emptyPreset} from '../constants.js';

const defaultTraitValues = {
    acid: {
        tint: '#2d8000',
        opacity: 0.6,
        preset: 'Watery Surface 2'
    },
    cold: { 
        tint: '#47b3ff',
        preset: 'Thick Fog'
    },
    electricity: {
        preset: 'Shock'
    },
    fire: {
        preset: 'Flames'
    },
    force: {
        preset: 'Waves 3'
    },
    mental: {
        tint: '#8000ff',
        preset: 'Classic Rays'
    },
    negative: {
        tint: '#502673',
        preset: 'Smoke Filaments'
    },
    poison: {
        tint: '#00a80b',
        preset: 'Smoky Area'
    },
    positive: {
        preset: 'Annihilating Rays'
    },
    sonic: {
        tint: '#0060ff',
        preset: 'Waves'
    }
};

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
                    target: 'Web',
                    opacity: 0.5,
                    tint: '#808080',
                    preset: 'Spider Web 2',
                    texture: null,
                },
            },
        };

        Object.keys(CONFIG.PF2E.damageTraits).forEach((dmgType) => {
            const values = defaultTraitValues[dmgType];
            if (defaultConfig.categories[dmgType] == undefined) {
                const config = {opacity: defaultOpacity, tint: null};
                if (values) {
                    config.tint = values.tint ?? config.tint;
                    config.opacity = values.opacity ?? config.opacity;
                }

                defaultConfig.categories[dmgType] = config;
            }
            Object.keys(CONFIG.MeasuredTemplate.types).forEach((tplType) => {
                const config = {preset: emptyPreset, texture: null}
                config.preset = values?.preset ?? config.preset;
                defaultConfig.categories[dmgType][tplType] = config;
            });
        });

        return defaultConfig;
    }

    constructor() {
        this.enabled = false;
    }

    configure(enabled = false) {
        if (game.system.id === "pf2e") {
            this.enabled = enabled;
        }
    }
    
    getData() {
        return {
            hasAutoTemplates: true,
            dmgTypes: CONFIG.PF2E.damageTraits,
            templateTypes: CONFIG.MeasuredTemplate.types
        }
    }

    preCreateMeasuredTemplate(template) {
        let hasPreset = template.hasOwnProperty("tmfxPreset");
        if (hasPreset) {
            return template;
        }
        const settings = game.settings.get('tokenmagic', 'autoTemplateSettings');
        let updated = (settings.overrides ? fromOverrides(Object.values(settings.overrides), template) : false);
        if (!updated) {
            fromCategories(settings.categories, template);
        }
    }
}

function fromConfig(config, templateData) {
    const o = {tokenmagic: {options: {}}};
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
    mergeObject(templateData, {'flags.tokenmagic': o.tokenmagic});
}

function fromOverrides(overrides = [], templateData) {
    const name = templateData.flags.pf2e?.origin?.name;
    let config = overrides.find((el) => el.target.toLowerCase() === name?.toLowerCase());
    if (!config) {
        return false;
    }
    fromConfig(config, templateData);
    return true;
}

function fromCategories(categories = {}, templateData) {
    const traits = templateData.flags.pf2e?.origin?.traits ?? [];
    
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

    fromConfig(mergeObject(config, {opacity: dmgSettings.opacity, tint: dmgSettings.tint}, true, true), templateData);
    return true;
}

export const pf2eTemplates = new AutoTemplatePF2E();
