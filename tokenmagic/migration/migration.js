import { TokenMagic } from '../module/tokenmagic.js';
import { PresetsLibrary, templatePresets } from '../fx/presets/defaultpresets.js';
import { defaultOpacity, TEMPLATE_TO_REGION_TYPE } from '../module/constants.js';
import { TokenMagicSettings } from '../module/settings.js';
import { error, isTheOne, log, warn } from '../module/util.js';

const Magic = TokenMagic();

// TODO create a generic function to import JSON by version

export const DataVersion = {
	ARCHAIC: '',
	V030: '0.3.0',
	V040: '0.4.0',
	V040b: '0.4.0b',
	V041: '0.4.1',
	V043: '0.4.3',
	V044: '0.4.4',
	V050: '0.5.0',
	V051: '0.5.1',
	V052: '0.5.2',
};

const TEXTURE_MAPPINGS = {
	'modules/tokenmagic/fx/assets/templates/black-tone-pure.png': {
		defaultColor: '#000000',
		defaultOpacity: 1.0,
	},
	'modules/tokenmagic/fx/assets/templates/black-tone-vstrong-opacity.png': {
		defaultColor: '#000000',
		defaultOpacity: 1.0,
	},
	'modules/tokenmagic/fx/assets/templates/black-tone-strong-opacity.png': {
		defaultColor: '#000000',
		defaultOpacity: 0.9,
	},
	'modules/tokenmagic/fx/assets/templates/white-tone-strong-opacity.png': {
		defaultColor: '#ffffff',
		defaultOpacity: 1.0,
	},
};

// migration function - will evolve constantly
export async function tmfxDataMigration() {
	if (isTheOne()) {
		var dataVersionNow;
		try {
			dataVersionNow = game.settings.get('tokenmagic', 'migration');
		} catch (e) {
			dataVersionNow = DataVersion.ARCHAIC;
		}
		if (dataVersionNow < DataVersion.V030) {
			await updatePresetsV030();
		}
		if (dataVersionNow < DataVersion.V040) {
			await updatePresetsV040();
		}
		if (dataVersionNow < DataVersion.V040b) {
			await updatePresetsV040b();
		}
		if (dataVersionNow < DataVersion.V041) {
			await updatePresetsV041();
		}
		if (dataVersionNow < DataVersion.V043) {
			await updatePresetsV043();
		}
		if (dataVersionNow < DataVersion.V044) {
			await updatePresetsV044();
		}
		if (dataVersionNow < DataVersion.V050) {
			await updatePresetsV050();
		}
		if (dataVersionNow < DataVersion.V051) {
			await updateTemplateSettingsV051();
		}
		if (dataVersionNow < DataVersion.V052) {
			await updatePresetsV052();
		}
	}
}

// migrating to the new presets data
async function updatePresetsV030() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.3.0 - Launching presets data migration...`);

		let foundTemplateLibrary = false;

		for (const preset of presets) {
			if (!preset.hasOwnProperty('library')) {
				preset.library = PresetsLibrary.MAIN;
				log(`Migration 0.3.0 - Adding ${preset.name} to ${PresetsLibrary.MAIN}`);
			} else if (preset.library === PresetsLibrary.REGION && !foundTemplateLibrary) {
				foundTemplateLibrary = true;
				log(`Migration 0.3.0 - Found template presets. Templates will not be added.`);
			}
		}

		if (!foundTemplateLibrary) log(`Migration 0.3.0 - Merging templates presets.`);

		let newPresets = foundTemplateLibrary ? presets : presets.concat(templatePresets);

		try {
			await game.settings.set('tokenmagic', 'presets', newPresets);
			await game.settings.set('tokenmagic', 'migration', DataVersion.V030);
			log(`Migration 0.3.0 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.3.0 - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV040() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.4.0 - Launching presets data migration...`);

		// Adding zOrder for the template presets only
		// Does not break visuals
		for (const preset of presets) {
			if (preset.library === 'tmfx-template') {
				log(`Migration 0.4.0 - Checking template preset ${preset.name}...`);
				let zOrder = 1;
				for (const filter of preset.params) {
					if (!filter.hasOwnProperty('zOrder')) {
						filter.zOrder = zOrder;
						log(`Migration 0.4.0 - Updating ${filter.filterType} in ${preset.name}...`);
						zOrder++;
					}
				}
			}
		}

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.4.0 - Importing new template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v040.json', {
				overwrite: false,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V040);
			log(`Migration 0.4.0 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.4.0 - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV040b() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.4.0b - Launching presets data migration...`);

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.4.0b - updating template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v040b.json', {
				overwrite: true,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V040b);
			log(`Migration 0.4.0b - Migration successful!`);
		} catch (e) {
			error(`Migration 0.4.0b - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV041() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.4.1 - Launching presets data migration...`);

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.4.1 - updating template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v041.json', {
				overwrite: true,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V041);
			log(`Migration 0.4.1 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.4.1 - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV043() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.4.3 - Launching presets data migration...`);

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.4.3 - updating template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v043.json', {
				overwrite: true,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V043);
			log(`Migration 0.4.3 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.4.3 - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV044() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.4.4 - Launching presets data migration...`);

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.4.4 - updating template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v044.json', {
				overwrite: true,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V044);
			log(`Migration 0.4.4 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.4.4 - Migration failed.`);
			error(e);
		}
	}
}

async function updatePresetsV050() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.5.0 - Launching presets data migration...`);

		try {
			for (const preset of presets) {
				if (preset.library === 'tmfx-template') {
					preset.library = PresetsLibrary.REGION;
					if (TEXTURE_MAPPINGS[preset.defaultTexture]) {
						Object.assign(preset, TEXTURE_MAPPINGS[preset.defaultTexture]);
					}
				}
			}

			await game.settings.set('tokenmagic', 'presets', presets);
			await game.settings.set('tokenmagic', 'migration', DataVersion.V050);

			log(`Migration 0.5.0 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.5.0 - Migration failed.`);
			error(e);
		}
	}
}

async function updateTemplateSettingsV051() {
	const templates = TokenMagicSettings.getSystemTemplates();
	if (!templates) {
		await game.settings.set('tokenmagic', 'migration', DataVersion.V051);
		return;
	}

	const autoTemplateSettings = game.settings.get('tokenmagic', 'autoTemplateSettings');
	if (foundry.utils.isEmpty(autoTemplateSettings)) return;

	try {
		if (autoTemplateSettings.categories) {
			for (const [type, config] of Object.entries(autoTemplateSettings.categories)) {
				if (!config) continue;

				for (const [templateType, templateConfig] of Object.entries(config)) {
					if (TEMPLATE_TO_REGION_TYPE[templateType]) {
						delete config[templateType];
						config[TEMPLATE_TO_REGION_TYPE[templateType]] = templateConfig;

						const { defaultColor } = TEXTURE_MAPPINGS[templateConfig.texture] ?? {};
						if (defaultColor) templateConfig.color = defaultColor;
					}
				}
			}
		}

		if (autoTemplateSettings.overrides) {
			for (const override of Object.values(autoTemplateSettings.overrides)) {
				const { defaultColor } = TEXTURE_MAPPINGS[override.texture] ?? {};
				if (defaultColor) override.color = defaultColor;
			}
		}

		await game.settings.set('tokenmagic', 'autoTemplateSettings', autoTemplateSettings);
		await game.settings.set('tokenmagic', 'migration', DataVersion.V051);

		log(`Migration 0.5.1 - Migration successful!`);
	} catch (e) {
		error(`Migration 0.5.1 - Auto-Template Migration failed.`);
		error(e);
	}
}

async function updatePresetsV052() {
	var presets = game.settings.get('tokenmagic', 'presets');

	if (!(presets == null)) {
		log(`Migration 0.5.2 - Launching presets data migration...`);

		try {
			await game.settings.set('tokenmagic', 'presets', presets);
			log(`Migration 0.5.2 - updating template presets...`);
			await Magic.importPresetLibraryFromPath('modules/tokenmagic/import/TMFX-update-presets-v052.json', {
				overwrite: true,
			});
			await game.settings.set('tokenmagic', 'migration', DataVersion.V052);
			log(`Migration 0.5.2 - Migration successful!`);
		} catch (e) {
			error(`Migration 0.5.2 - Migration failed.`);
			error(e);
		}
	}
}
