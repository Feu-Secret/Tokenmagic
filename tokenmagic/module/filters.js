import { FilterAdjustment } from '../fx/filters/FilterAdjustment.js';
import { FilterAscii } from '../fx/filters/FilterAscii.js';
import { FilterXBloom } from '../fx/filters/FilterAdvancedBloom.js';
import { FilterDot } from '../fx/filters/FilterDot.js';
import { FilterDistortion } from '../fx/filters/FilterDistortion.js';
import { FilterOldFilm } from '../fx/filters/FilterOldFilm.js';
import { FilterGlow } from '../fx/filters/FilterGlow.js';
import { FilterOutline } from '../fx/filters/FilterOutline.js';
import { FilterBevel } from '../fx/filters/FilterBevel.js';
import { FilterDropShadow } from '../fx/filters/FilterDropShadow.js';
import { FilterTwist } from '../fx/filters/FilterTwist.js';
import { FilterZoomBlur } from '../fx/filters/FilterZoomBlur.js';
import { FilterBlur } from '../fx/filters/FilterBlur.js';
import { FilterShockwave } from '../fx/filters/FilterShockWave.js';
import { FilterBulgePinch } from '../fx/filters/FilterBulgePinch.js';
import { FilterRemoveShadow } from '../fx/filters/FilterRemoveShadow.js';
import { FilterRays } from '../fx/filters/FilterRays.js';
import { FilterFog } from '../fx/filters/FilterFog.js';
import { FilterXFog } from '../fx/filters/FilterXFog.js';
import { FilterElectric } from '../fx/filters/FilterElectric.js';
import { FilterWaves } from '../fx/filters/FilterWaves.js';
import { FilterFire } from '../fx/filters/FilterFire.js';
import { FilterFumes } from '../fx/filters/FilterFumes.js';
import { FilterFlood } from '../fx/filters/FilterFlood.js';
import { FilterSmoke } from '../fx/filters/FilterSmoke.js';
import { FilterForceField } from '../fx/filters/FilterForceField.js';
import { FilterMirrorImages } from '../fx/filters/FilterMirrorImages.js';
import { FilterXRays } from '../fx/filters/FilterXRays.js';
import { FilterLiquid } from '../fx/filters/FilterLiquid.js';
import { FilterGleamingGlow } from '../fx/filters/FilterGleamingGlow.js';
import { FilterPixelate } from '../fx/filters/FilterPixelate.js';
import { FilterSpiderWeb } from '../fx/filters/FilterSpiderWeb.js';
import { FilterSolarRipples } from '../fx/filters/FilterSolarRipples.js';
import { FilterGlobes } from '../fx/filters/FilterGlobes.js';
import { FilterTransform } from '../fx/filters/FilterTransform.js';
import { FilterSplash } from '../fx/filters/FilterSplash.js';
import { FilterPolymorph } from '../fx/filters/FilterPolymorph.js';
import { FilterXFire } from '../fx/filters/FilterXFire.js';
import { FilterSprite } from '../fx/filters/FilterSprite.js';
import { FilterSpriteMask } from '../fx/filters/FilterSpriteMask.js';
import { FilterReplaceColor } from '../fx/filters/FilterReplaceColor.js';
import { FilterDDTint } from '../fx/filters/FilterDDTint.js';
import { FilterCRT } from '../fx/filters/FilterCRT.js';
import { FilterRGBSplit } from '../fx/filters/FilterRGBSplit.js';
import { FilterColorGradient } from '../fx/filters/FilterColorGradient.js';

export const FilterType = {
	adjustment: FilterAdjustment,
	ascii: FilterAscii,
	dot: FilterDot,
	distortion: FilterDistortion,
	crt: FilterCRT,
	oldfilm: FilterOldFilm,
	glow: FilterGlow,
	outline: FilterOutline,
	colorGradient: FilterColorGradient,
	bevel: FilterBevel,
	xbloom: FilterXBloom,
	shadow: FilterDropShadow,
	twist: FilterTwist,
	zoomblur: FilterZoomBlur,
	blur: FilterBlur,
	bulgepinch: FilterBulgePinch,
	zapshadow: FilterRemoveShadow,
	ray: FilterRays,
	fog: FilterFog,
	xfog: FilterXFog,
	electric: FilterElectric,
	wave: FilterWaves,
	shockwave: FilterShockwave,
	fire: FilterFire,
	fumes: FilterFumes,
	smoke: FilterSmoke,
	flood: FilterFlood,
	images: FilterMirrorImages,
	field: FilterForceField,
	xray: FilterXRays,
	liquid: FilterLiquid,
	xglow: FilterGleamingGlow,
	pixel: FilterPixelate,
	web: FilterSpiderWeb,
	ripples: FilterSolarRipples,
	globes: FilterGlobes,
	transform: FilterTransform,
	splash: FilterSplash,
	polymorph: FilterPolymorph,
	xfire: FilterXFire,
	sprite: FilterSprite,
	spriteMask: FilterSpriteMask,
	replaceColor: FilterReplaceColor,
	ddTint: FilterDDTint,
	rgbSplit: FilterRGBSplit,
};
