/* -------------------------------------------- */
/*  Regions Management                         */
/* -------------------------------------------- */

import { Anime } from '../../fx/Anime.js';
import { PresetsLibrary } from '../../fx/presets/defaultpresets.js';
import { emptyPreset, PlaceableType } from '../constants.js';
import { TokenMagicSettings } from '../settings.js';
import { Magic } from '../tokenmagic.js';
import { getPlaceableById, requestLoadFilters } from '../util.js';

Hooks.on('createRegion', (document) => {
	if (document.parent.id !== game.user.viewedScene) return;

	if (document.flags?.tokenmagic?.filters) {
		let placeable = getPlaceableById(document._id, PlaceableType.REGION);
		requestLoadFilters(placeable, 250);
	}
});

/* -------------------------------------------- */

Hooks.on('deleteRegion', (_, document) => {
	if (!(document == null || !document._id)) {
		Anime.removeAnimation(document._id);
	}
});

/* -------------------------------------------- */

Hooks.on('updateRegion', (document, options) => {
	if (document.parent.id !== game.user.viewedScene) return;
	const placeable = document.object;
	if (!placeable) return;

	if (
		options.flags?.tokenmagic instanceof foundry.data.operators.ForcedDeletion ||
		options.flags?.tokenmagic?.filters instanceof foundry.data.operators.ForcedDeletion ||
		options.shapes
	) {
		Anime.removeAnimation(document._id); // removing animations on this placeable
		Magic._clearImgFiltersByPlaceable(placeable); // clearing the filters (owned by tokenmagic)
		requestLoadFilters(placeable, 250);
	} else {
		if (!placeable.loadingRequest) {
			Magic._updateFilters(document, options, PlaceableType.REGION);

			const sprite = placeable._TMFXgetSprite();
			if (sprite) {
				const filters = document.getFlag('tokenmagic', 'filters');
				if (filters) sprite.setShaderClass(foundry.canvas.rendering.shaders.RegionShader);
				else sprite.setShaderClass(foundry.canvas.rendering.shaders.HighlightRegionShader);
				sprite.alpha = document.getFlag('tokenmagic', 'regionData')?.alpha ?? 0.5;
			}
		}
	}
});

/* -------------------------------------------- */

Hooks.on('preCreateRegion', (document) => {
	// Do nothing if we're on a 3D Canvas scene
	if (game.Levels3DPreview?._active) return;

	// Apply auto-preset if needed
	const templates = TokenMagicSettings.getSystemTemplates();
	if (templates?.enabled) {
		templates.preCreateRegion?.(document);
	}

	const hasFlags = document.flags;
	let hasPreset = false;
	let hasTint = false;
	let hasOpacity = false;
	let hasFlagsNoOptions = false;
	let hasRegionColor = false;
	let regionOpacity;
	let tmfxTint;

	if (hasFlags && document.flags.tokenmagic?.options) {
		const opt = document.flags.tokenmagic.options;
		if (opt.tmfxPreset) {
			document.tmfxPreset = opt.tmfxPreset;
			hasPreset = true;
		}
		if (opt.tmfxTint) {
			tmfxTint = opt.tmfxTint;
			hasTint = true;
		}
		if (opt.tmfxRegionOpacity) {
			regionOpacity = opt.tmfxRegionOpacity;
			hasOpacity = true;
		}
		if (opt.tmfxRegionColor) {
			document.color = Color.fromString(opt.tmfxRegionColor);
			document.updateSource({ color: opt.tmfxRegionColor });
			hasRegionColor = true;
		}
	} else hasFlagsNoOptions = true;

	let hasTexture = document.texture && document.texture !== '';
	let newFilters = [];

	let tmfxBaseFlags = { tokenmagic: { filters: null, templateData: null, options: null } };
	if (hasFlags && hasFlagsNoOptions) {
		// the measured template comes with tokenmagic flags ? It is a copy ! We do nothing.
		if (document.flags.tokenmagic) {
			return;
		}
		document.flags = foundry.utils.mergeObject(document.flags, tmfxBaseFlags, true, true);
	}

	// normalizing color to value if needed
	if (hasTint && typeof tmfxTint !== 'number') {
		tmfxTint = Color.from(tmfxTint).valueOf();
	}

	let tmfxFiltersData = null;

	// FX to add ?
	if (hasPreset) {
		// Constructing the preset search object
		let pstSearch = {
			name: document.tmfxPreset,
			library: PresetsLibrary.REGION,
		};

		// Adding tint if needed
		if (hasTint) pstSearch.color = tmfxTint;

		// Retrieving the preset
		let preset = Magic.getPreset(pstSearch);

		if (!(preset == null) && preset instanceof Array) {
			let { defaultOpacity, defaultColor } = Magic._getPresetTemplateDefaults(pstSearch.name);

			if (!(defaultColor == null) && !hasRegionColor) {
				document.updateSource({ color: defaultColor });
			}

			let persist = true;

			// Constructing the filter flag parameters
			for (const params of preset) {
				if (!params.filterType || !Magic.filterTypes.hasOwnProperty(params.filterType)) {
					// one invalid ? all rejected.
					persist = false;
					break;
				}

				// getPreset MUST provide a filter id
				if (!params.filterId) {
					persist = false;
					break;
				}

				if (!params.enabled || !(typeof params.enabled === 'boolean')) {
					params.enabled = true;
				}

				params.placeableId = null;
				params.filterInternalId = foundry.utils.randomID();
				params.filterOwner = game.data.userId;
				params.placeableType = PlaceableType.REGION;

				newFilters.push({
					tmFilters: {
						tmFilterId: params.filterId,
						tmFilterInternalId: params.filterInternalId,
						tmFilterType: params.filterType,
						tmFilterOwner: params.filterOwner,
						tmParams: params,
					},
				});
			}

			if (persist) tmfxFiltersData = newFilters;
		}
	} else {
		document.tmfxPreset = emptyPreset;
	}

	if (!hasOpacity) regionOpacity = 1;

	let tmfxFlags = {
		regionData: {
			opacity: regionOpacity,
		},
		filters: tmfxFiltersData,
		options: null,
	};
	document.updateSource({ flags: { tokenmagic: tmfxFlags } });
});

/* -------------------------------------------- */

Hooks.on('renderRegionConfig', async (regionConfig, html) => {
	if (html.querySelector('[name="flags.tokenmagic.regionData.alpha"]')) return;

	const region = regionConfig.document;

	let tmfxRegionData = region.getFlag('tokenmagic', 'regionData');
	let alpha = tmfxRegionData?.alpha ?? region.object?._TMFXgetSprite()?.alpha ?? 0.5;

	const alphaRangePicker = await foundry.applications.handlebars.renderTemplate(
		'modules/tokenmagic/templates/settings/regionAlpha.hbs',
		{ alpha },
	);

	const temp = document.createElement('div');
	temp.innerHTML = alphaRangePicker;

	html.querySelector('[name="color"]')?.closest('.form-group')?.after(temp.children[0]);
});
