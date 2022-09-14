import {FilterAdjustment} from "../fx/filters/FilterAdjustment.js";
import {FilterXBloom} from "../fx/filters/FilterAdvancedBloom.js";
import {FilterDistortion} from "../fx/filters/FilterDistortion.js";
import {FilterOldFilm} from "../fx/filters/FilterOldFilm.js";
import {FilterGlow} from "../fx/filters/FilterGlow.js";
import {FilterOutline} from "../fx/filters/FilterOutline.js";
import {FilterBevel} from "../fx/filters/FilterBevel.js";
import {FilterDropShadow} from "../fx/filters/FilterDropShadow.js";
import {FilterTwist} from "../fx/filters/FilterTwist.js";
import {FilterZoomBlur} from "../fx/filters/FilterZoomBlur.js";
import {FilterBlur} from "../fx/filters/FilterBlur.js";
import {FilterShockwave} from "../fx/filters/FilterShockWave.js";
import {FilterBulgePinch} from "../fx/filters/FilterBulgePinch.js";
import {FilterRemoveShadow} from "../fx/filters/FilterRemoveShadow.js";
import {FilterRays} from "../fx/filters/FilterRays.js";
import {FilterFog} from "../fx/filters/FilterFog.js";
import {FilterXFog} from "../fx/filters/FilterXFog.js";
import {FilterElectric} from "../fx/filters/FilterElectric.js";
import {FilterWaves} from "../fx/filters/FilterWaves.js";
import {FilterFire} from "../fx/filters/FilterFire.js";
import {FilterFumes} from "../fx/filters/FilterFumes.js";
import {FilterFlood} from "../fx/filters/FilterFlood.js";
import {FilterSmoke} from "../fx/filters/FilterSmoke.js";
import {FilterForceField} from "../fx/filters/FilterForceField.js";
import {FilterMirrorImages} from "../fx/filters/FilterMirrorImages.js";
import {FilterXRays} from "../fx/filters/FilterXRays.js";
import {FilterLiquid} from "../fx/filters/FilterLiquid.js";
import {FilterGleamingGlow} from "../fx/filters/FilterGleamingGlow.js";
import {FilterPixelate} from "../fx/filters/FilterPixelate.js";
import {FilterSpiderWeb} from "../fx/filters/FilterSpiderWeb.js";
import {FilterSolarRipples} from "../fx/filters/FilterSolarRipples.js";
import {FilterGlobes} from "../fx/filters/FilterGlobes.js";
import {FilterTransform} from "../fx/filters/FilterTransform.js";
import {FilterSplash} from "../fx/filters/FilterSplash.js";
import {FilterPolymorph} from "../fx/filters/FilterPolymorph.js";
import {FilterXFire} from "../fx/filters/FilterXFire.js";
import {FilterSprite} from "../fx/filters/FilterSprite.js";
import {FilterReplaceColor} from "../fx/filters/FilterReplaceColor.js";
import {FilterDDTint} from "../fx/filters/FilterDDTint.js";
import {Anime} from "../fx/Anime.js";
import {allPresets, PresetsLibrary} from "../fx/presets/defaultpresets.js";
import {tmfxDataMigration} from "../migration/migration.js";
import {emptyPreset} from "./constants.js";
import "./proto/PlaceableObjectProto.js";

/*

It's getting messy here !
I will fix it in a future version
(+ duplicated code to factorize and code to improve)

*/

const moduleTM = "module.tokenmagic";

// Filters Class Keys
export const FilterType = {
  adjustment: FilterAdjustment,
  distortion: FilterDistortion,
  oldfilm: FilterOldFilm,
  glow: FilterGlow,
  outline: FilterOutline,
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
  replaceColor: FilterReplaceColor,
  ddTint: FilterDDTint
};

export const PlaceableType = {
  TOKEN: Token.embeddedName,
  TILE: Tile.embeddedName,
  TEMPLATE: MeasuredTemplate.embeddedName,
  DRAWING: Drawing.embeddedName,
  NOT_SUPPORTED: null
};

function i18n(key) {
  return game.i18n.localize(key);
}

async function exportObjectAsJson(exportObj, exportName) {
  let jsonStr = JSON.stringify(exportObj, null, 4);

  const a = document.createElement("a");
  const file = new Blob([jsonStr], {type: "plain/text"});

  a.href = URL.createObjectURL(file);
  a.download = exportName + ".json";
  a.click();

  URL.revokeObjectURL(a.href);
}

export const SocketAction = {
  SET_FLAG: "TMFXSetFlag",
  SET_ANIME_FLAG: "TMFXSetAnimeFlag"
};

export function broadcast(placeable, flag, socketAction) {
  const data =
    {
      tmAction: socketAction,
      tmPlaceableId: placeable.id,
      tmPlaceableType: placeable._TMFXgetPlaceableType(),
      tmFlag: flag,
      tmViewedScene: game.user.viewedScene
    };
  game.socket.emit(moduleTM, data, resp => {
  });
}

export function isActiveModule(moduleName) {
  return game.modules.has(moduleName)
    && game.modules.get(moduleName).active === true;
}

export function getMinPadding() {
  return game.settings.get("tokenmagic", "minPadding");
}

export function isAdditivePaddingConfig() {
  return game.settings.get("tokenmagic", "useAdditivePadding");
}

export function isFilterCachingDisabled() {
  return game.settings.get("tokenmagic", "disableCaching");
}

export function isVideoDisabled() {
  return game.settings.get("tokenmagic", "disableVideo");
}

export function isTheOne() {
  const theOne = game.users.find((user) => user.isGM && user.active);
  return theOne && game.user === theOne;
}

export function mustBroadCast() {
  return game.settings.get("tokenmagic", "fxPlayerPermission") && !isTheOne();
}

export function autosetPaddingMode() {
  canvas.app.renderer.filter.useMaxPadding = !isAdditivePaddingConfig();
}

export function isZOrderConfig() {
  return game.settings.get("tokenmagic", "useZOrder");
}

export function isAnimationDisabled() {
  return game.settings.get("tokenmagic", "disableAnimations");
}

export function log(output) {
  let logged = "%cTokenMagic %c| " + output;
  console.log(logged, "color:#4BC470", "color:#B3B3B3");
}

export function warn(output) {
  let logged = "TokenMagic | " + output;
  console.warn(logged);
}

export function error(output) {
  let logged = "TokenMagic | " + output;
  console.error(logged);
}

export function fixPath(path) {
  /*
      /prefix/...               =>   ...
      /modules/tokenmagic/...   =>   modules/tokenmagic/...
  */
  if ( path ) {
    const base = "/modules/tokenmagic";
    const url = new URL(path, window.location.href);

    if ( url.origin === window.location.origin ) {
      let prefix = "/";

      try {
        if ( ROUTE_PREFIX ) {
          prefix = new URL(ROUTE_PREFIX, window.location.origin).pathname;
        }
      } catch(err) {
      }

      path = url.pathname;

      if ( prefix === "/" ) {
        path = path.slice(1);
      }
      else if ( path.startsWith(prefix) && (path.length === prefix.length || path[prefix.length] === "/") ) {
        path = path.slice(prefix.length + 1);
      }
      else if ( path.startsWith(base) && (path.length === base.length || path[base.length] === "/") ) {
        path = path.slice(1);
      }
    }
    else {
      path = url.href;
    }
  }

  return path;
}

export function getControlledPlaceables() {
  const authorizedLayers = [canvas.tokens, canvas.tiles, canvas.drawings];
  if ( authorizedLayers.some(layer => layer === canvas.activeLayer) ) {
    return canvas.activeLayer.placeables.filter(p => p.controlled === true) || [];
  }
  else return [];
}

export function getTargetedTokens() {
  return canvas.tokens.placeables.filter(placeable => placeable.isTargeted);
}

export function getPlaceableById(id, type) {
  let placeable = null;

  function findPlaceable(placeables, id) {
    let rplaceable = null;
    if ( !(placeables == null) && placeables.length > 0 ) {
      rplaceable = placeables.find(n => n.id === id);
    }
    return rplaceable;
  }

  switch ( type ) {
    case PlaceableType.TOKEN:
      placeable = findPlaceable(canvas.tokens.placeables, id);
      break;
    case PlaceableType.TILE:
      placeable = findPlaceable(canvas.tiles.placeables, id);
      break;
    case PlaceableType.TEMPLATE:
      placeable = findPlaceable(canvas.templates.placeables, id);
      break;
    case PlaceableType.DRAWING:
      placeable = findPlaceable(canvas.drawings.placeables, id);
      break;
  }

  return placeable;
}

export function objectAssign(target, ...sources) {
  sources.forEach(source => {
    Object.keys(source).forEach(key => {
      const s_val = source[key];
      const t_val = target[key];
      target[key] = t_val && s_val && typeof t_val === "object" && typeof s_val === "object"
        ? objectAssign(t_val, s_val)
        : s_val;
    });
  });
  return target;
}

export function TokenMagic() {

  let _cachedContainer = new PIXI.Container;

  async function addFiltersOnSelected(paramsArray, replace = false) {

    if ( !Array.isArray(paramsArray) ) {
      paramsArray = getPreset(paramsArray);
    }

    const controlled = getControlledPlaceables();

    if ( !(controlled == null) && controlled.length > 0 ) {
      for ( const placeable of controlled ) {
        await addFilters(placeable, paramsArray, replace);
      }
    }
  }

  async function addUpdateFiltersOnSelected(paramsArray) {

    if ( !Array.isArray(paramsArray) ) {
      paramsArray = getPreset(paramsArray);
    }

    const controlled = getControlledPlaceables();

    if ( !(controlled == null) && controlled.length > 0 ) {
      for ( const placeable of controlled ) {
        await addUpdateFilters(placeable, paramsArray);
      }
    }
  }

  async function addUpdateFiltersOnTargeted(paramsArray) {

    if ( !Array.isArray(paramsArray) ) {
      paramsArray = getPreset(paramsArray);
    }

    const targeted = getTargetedTokens();

    if ( !(targeted == null) && targeted.length > 0 ) {
      for ( const token of targeted ) {
        await addUpdateFilters(token, paramsArray);
      }
    }
  }

  async function addFiltersOnTargeted(paramsArray, replace = false) {

    if ( !Array.isArray(paramsArray) ) {
      paramsArray = getPreset(paramsArray);
    }

    const targeted = getTargetedTokens();

    if ( !(targeted == null) && targeted.length > 0 ) {
      for ( const token of targeted ) {
        await addFilters(token, paramsArray, replace);
      }
    }
  }

  async function addFilters(placeable, paramsArray, replace = false) {

    if ( !Array.isArray(paramsArray) ) {
      paramsArray = getPreset(paramsArray);
    }
    if ( !(paramsArray instanceof Array && paramsArray.length > 0)
      || placeable == null ) return;

    let actualFlags = (replace ? null : placeable.document.getFlag("tokenmagic", "filters"));
    let newFlags = [];

    for ( const params of paramsArray ) {
      if ( !params.hasOwnProperty("filterType")
        || !FilterType.hasOwnProperty(params.filterType) ) {
        // one invalid ? all rejected.
        return;
      }

      if ( !params.hasOwnProperty("rank") ) {
        params.rank = placeable._TMFXgetMaxFilterRank();
      }

      if ( !params.hasOwnProperty("filterId") || params.filterId == null ) {
        params.filterId = randomID();
      }

      if ( !params.hasOwnProperty("enabled") || !(typeof params.enabled === "boolean") ) {
        params.enabled = true;
      }

      params.placeableId = placeable.id;
      params.filterInternalId = randomID();
      params.filterOwner = game.data.userId;
      params.placeableType = placeable._TMFXgetPlaceableType();
      params.updateId = randomID();

      newFlags.push({
        tmFilters: {
          tmFilterId: params.filterId,
          tmFilterInternalId: params.filterInternalId,
          tmFilterType: params.filterType,
          tmFilterOwner: params.filterOwner,
          tmParams: params
        }
      });
    }

    if ( !(actualFlags == null) ) {
      newFlags = actualFlags.concat(newFlags);
    }

    await placeable._TMFXsetFlag(newFlags);
  }

  async function addUpdateFilters(placeable, paramsArray) {

    if ( !paramsArray instanceof Array || paramsArray.length < 1 ) {
      return;
    }

    let flags = placeable.document.getFlag("tokenmagic", "filters");
    let workingFlags = [];
    if ( flags ) {
      flags.forEach(flag => {
        workingFlags.push(duplicate(flag));
      });
    }

    let newFlags = [];
    let updateParams;

    for ( const params of paramsArray ) {

      updateParams = false;
      params.updateId = randomID();

      workingFlags.forEach(flag => {
        if ( flag.tmFilters.tmFilterId === params.filterId
          && flag.tmFilters.tmFilterType === params.filterType ) {
          if ( flag.tmFilters.hasOwnProperty("tmParams") ) {
            objectAssign(flag.tmFilters.tmParams, params);
            updateParams = true;
          }
        }
      });

      if ( !updateParams ) {
        if ( !params.hasOwnProperty("filterType")
          || !FilterType.hasOwnProperty(params.filterType) ) {
          // one invalid ? all rejected (even the update)
          return;
        }

        if ( !params.hasOwnProperty("rank") ) {
          params.rank = placeable._TMFXgetMaxFilterRank();
        }

        if ( !params.hasOwnProperty("filterId") || params.filterId == null ) {
          params.filterId = randomID();
        }

        if ( !params.hasOwnProperty("enabled") || !(typeof params.enabled === "boolean") ) {
          params.enabled = true;
        }

        params.placeableId = placeable.id;
        params.filterInternalId = randomID();
        params.filterOwner = game.data.userId;
        params.placeableType = placeable._TMFXgetPlaceableType();

        newFlags.push({
          tmFilters: {
            tmFilterId: params.filterId,
            tmFilterInternalId: params.filterInternalId,
            tmFilterType: params.filterType,
            tmFilterOwner: params.filterOwner,
            tmParams: params
          }
        });
      }
    }

    if ( newFlags.length > 0 ) {
      workingFlags = newFlags.concat(workingFlags);
    }

    await placeable._TMFXsetFlag(workingFlags);
  }

  async function updateFilters(paramsArray) {
    if ( params == null
      || !params.hasOwnProperty("filterId") ) {
      return;
    }
    let placeableIdSet = new Set();
    let animations = Anime.getAnimeMap();
    if ( animations.size <= 0 ) {
      return;
    }

    animations.forEach((anime, id) => {
      let filterIdMatch = (params) => params.filterId === anime.puppet.filterId;
      if ( paramsArray.some(filterIdMatch) ) {
        placeableIdSet.add(anime.puppet.placeableId);
      }
    });

    if ( placeableIdSet.size <= 0 ) {
      return;
    }

    for ( const placeableId of placeableIdSet ) {
      // we must browse the collection of placeables whatever their types
      // we have just a filterId.
      let placeable = getPlaceableById(placeableId, PlaceableType.TOKEN);
      if ( placeable == null ) {
        placeable = getPlaceableById(placeableId, PlaceableType.TEMPLATE);
      }
      if ( placeable == null ) {
        placeable = getPlaceableById(placeableId, PlaceableType.TILE);
      }
      if ( placeable == null ) {
        placeable = getPlaceableById(placeableId, PlaceableType.DRAWING);
      }
      if ( !(placeable == null) && placeable instanceof PlaceableObject ) {
        await updateFiltersByPlaceable(placeable, paramsArray);
      }
    }
  }

  async function updateFiltersOnSelected(paramsArray) {
    let placeables = getControlledPlaceables();

    if ( placeables == null || placeables.length < 1 ) {
      return;
    }
    if ( typeof paramsArray === "string" ) {
      paramsArray = getPreset(paramsArray);
    }
    if ( !(paramsArray instanceof Array) || paramsArray.length < 1 ) {
      return;
    }

    for ( const placeable of placeables ) {
      await updateFiltersByPlaceable(placeable, paramsArray);
    }
  }

  async function updateFiltersOnTargeted(paramsArray) {
    let targeted = getTargetedTokens();

    if ( targeted == null || targeted.length < 1 ) {
      return;
    }

    if ( typeof paramsArray === "string" ) {
      paramsArray = getPreset(paramsArray);
    }

    if ( !(paramsArray instanceof Array) || paramsArray.length < 1 ) {
      return;
    }

    for ( const token of targeted ) {
      await updateFiltersByPlaceable(token, paramsArray);
    }
  }

  async function updateFiltersByPlaceable(placeable, paramsArray) {

    if ( !(paramsArray instanceof Array) || paramsArray.length < 1 ) {
      return;
    }

    let flags = placeable.document.getFlag("tokenmagic", "filters");
    if ( flags == null || !(flags instanceof Array) || flags.length < 1 ) {
      return;
    } // nothing to update...

    let workingFlags = [];
    flags.forEach(flag => {
      workingFlags.push(duplicate(flag));
    });

    for ( const params of paramsArray ) {
      params.updateId = randomID();
      workingFlags.forEach(flag => {
        if ( flag.tmFilters.tmFilterId === params.filterId
          && flag.tmFilters.tmFilterType === params.filterType ) {
          if ( flag.tmFilters.hasOwnProperty("tmParams") ) {
            objectAssign(flag.tmFilters.tmParams, params);
          }
        }
      });
    }
    await placeable._TMFXsetFlag(workingFlags);
  }

  // Deleting filters on targeted tokens
  async function deleteFiltersOnTargeted(filterId = null) {
    let targeted = getTargetedTokens();
    if ( !(targeted == null) && targeted.length > 0 ) {

      for ( const token of targeted ) {
        await deleteFilters(token, filterId);
      }
    }
  }

  // Deleting filters on selected placeable(s)
  async function deleteFiltersOnSelected(filterId = null) {
    let placeables = getControlledPlaceables();
    if ( !(placeables == null) && placeables.length > 0 ) {

      for ( const placeable of placeables ) {
        await deleteFilters(placeable, filterId);
      }
    }
  }

  // Deleting all filters on a placeable in parameter
  async function deleteFilters(placeable, filterId = null) {
    if ( placeable == null ) {
      return;
    }

    if ( filterId == null ) {
      await placeable._TMFXunsetFlag();
      await placeable._TMFXunsetAnimeFlag();
    }
    else if ( typeof filterId === "string" ) {

      let flags = placeable.document.getFlag("tokenmagic", "filters");
      if ( flags == null || !(flags instanceof Array) || flags.length < 1 ) {
        return;
      } // nothing to delete...

      let workingFlags = [];
      flags.forEach(flag => {
        if ( flag.tmFilters.tmFilterId !== filterId ) {
          workingFlags.push(duplicate(flag));
        }
      });

      if ( workingFlags.length > 0 ) await placeable._TMFXsetFlag(workingFlags);
      else await placeable._TMFXunsetFlag();

      flags = placeable.document.getFlag("tokenmagic", "animeInfo");
      if ( flags == null || !(flags instanceof Array) || flags.length < 1 ) {
        return;
      } // nothing to delete...

      workingFlags = [];
      flags.forEach(flag => {
        if ( flag.tmFilterId !== filterId ) {
          workingFlags.push(duplicate(flag));
        }
      });

      if ( workingFlags.length > 0 ) await placeable._TMFXsetAnimeFlag(workingFlags);
      else await placeable._TMFXunsetAnimeFlag();
    }
  }

  function hasFilterType(placeable, filterType) {
    if ( placeable == null
      || filterType == null
      || !(placeable instanceof PlaceableObject) ) {
      return null;
    }

    let flags = placeable.document.getFlag("tokenmagic", "filters");
    if ( flags == null || !(flags instanceof Array) || flags.length < 1 ) {
      return false;
    }

    const found = flags.find(flag => flag.tmFilters.tmFilterType === filterType);
    if ( found === undefined ) {
      return false;
    }
    return true;
  }

  function hasFilterId(placeable, filterId) {
    if ( placeable == null
      || !(placeable instanceof PlaceableObject) ) {
      return null;
    }
    let flags = placeable.document.getFlag("tokenmagic", "filters");
    return _checkFilterId(placeable, filterId, flags);
  }

  function _checkFilterId(placeable, filterId, flags) {
    if ( placeable == null
      || filterId == null
      || !(placeable instanceof PlaceableObject) ) {
      return null;
    }

    if ( flags == null || !(flags instanceof Array) || flags.length < 1 ) {
      return false;
    }

    const found = flags.find(flag => flag.tmFilters.tmFilterId === filterId);
    if ( found === undefined ) {
      return false;
    }
    return true;
  }

  function setFilter(placeable, filter) {
    placeable._TMFXsetRawFilters(filter);
  }

  function _loadPersistedValues(params, animeInfos) {

    if ( !params.hasOwnProperty("animated") ) {
      return;
    }
    if ( !animeInfos || animeInfos.length <= 0 ) {
      return;
    }

    for ( const effect of Object.keys(params.animated) ) {

      for ( const animeInfo of animeInfos.values() ) {

        if ( animeInfo.tmFilterId === params.filterId
          && animeInfo.tmFilterInternalId === params.filterInternalId
          && animeInfo.tmFilterEffect === effect ) {
          params.animated[effect].active = false;
          params[effect] = animeInfo.tmFilterEffectValue;

          // special case for halfCosOscillation
          if ( params.animated[effect].animType === "halfCosOscillation" ) {
            if ( params.animated[effect].val1 !== animeInfo.tmFilterEffectValue ) {
              params.animated[effect].val2 = params.animated[effect].val1;
              params.animated[effect].val1 = animeInfo.tmFilterEffectValue;
            }
          }
        }
      }
    }
  }

  function _assignFilters(placeable, filters, bulkLoading = false) {
    if ( filters == null || placeable == null ) {
      return;
    }
    // Assign all filters to the placeable
    let animeInfos = placeable.document.getFlag("tokenmagic", "animeInfo");
    for ( const filterInfo of filters ) {
      // if bulkloading is on, we update with terminal value if it exists
      if ( bulkLoading ) {
        let params = filterInfo.tmFilters.tmParams;
        _loadPersistedValues(params, animeInfos);
      }
      _assignFilter(placeable, filterInfo);
    }
  }

  function _assignFilter(placeable, filterInfo) {
    if ( filterInfo == null ) {
      return;
    }
    let workingFilterInfo = duplicate(filterInfo);
    workingFilterInfo.tmFilters.tmParams.placeableId = placeable.id;
    workingFilterInfo.tmFilters.tmParams.placeableType = placeable._TMFXgetPlaceableType();
    let filter = new FilterType[workingFilterInfo.tmFilters.tmFilterType](workingFilterInfo.tmFilters.tmParams);
    setFilter(placeable, filter);
  }

  function _loadFilters(placeables, bulkLoading = true) {
    if ( !(placeables == null) ) {
      placeables.slice().reverse().forEach((placeable) => {
        _singleLoadFilters(placeable, bulkLoading);
      });
    }
  }

  function _singleLoadFilters(placeable, bulkLoading = false) {

    let placeableType = placeable._TMFXgetPlaceableType();
    if ( placeableType === PlaceableType.TEMPLATE ) {
      let updateData = placeable.document.getFlag("tokenmagic", "templateData");
      if ( !(updateData == null) ) {
        placeable.document.tmfxTextureAlpha = placeable._TMFXgetSprite().alpha = updateData.opacity;
        placeable.document.tmfxTint = updateData.tint;
      }
    }

    let filters = placeable.document.getFlag("tokenmagic", "filters");
    if ( !(filters == null) ) {
      if ( placeableType === PlaceableType.TEMPLATE ) {
        // get the first filterId to assign tmfxPreset
        placeable.document.tmfxPreset = filters[0].tmFilters.tmFilterId;
      }
      _assignFilters(placeable, filters, bulkLoading);
    }
    placeable.loadingRequest = false;
  }

  function _fxPseudoEqual(flagObject, filterObject) {

    function isObject(object) {
      return object != null && typeof object === "object";
    }

    const flagKeys = Object.keys(flagObject);

    for ( const flagKey of flagKeys ) {

      let flagValue = flagObject[flagKey];
      const filterValue = filterObject[flagKey];
      const areObjects = isObject(flagValue) && isObject(filterValue);

      if ( areObjects && !_fxPseudoEqual(flagValue, filterValue) ) {
        return false;
      }

      // handling the Infinity exception with loops... thanks to JSON serialization...
      if ( !areObjects && flagKey === "loops" && flagValue === null ) {
        flagValue = Infinity; // not nice, but works ! :-)=
      }

      if ( !areObjects && flagValue !== filterValue ) {
        return false;
      }
    }
    return true;
  }

  function _updateTemplateData(data, options, placeableType) {
    if ( !options.hasOwnProperty("flags") || !options.flags.hasOwnProperty("tokenmagic") ) {
      return;
    }
    if ( data == null || !data.hasOwnProperty("_id") ) {
      return;
    }

    let placeable = getPlaceableById(data._id, placeableType);
    if ( placeable == null ) {
      return;
    }

    let updateData = placeable.document.getFlag("tokenmagic", "templateData");
    if ( !(updateData == null) ) {
      placeable._TMFXgetSprite().alpha = updateData.opacity;
    }
  }

  function _updateFilters(data, options, placeableType) {
    if ( !(options.hasOwnProperty("flags")
      && options.flags.hasOwnProperty("tokenmagic")
      && (options.flags.tokenmagic.hasOwnProperty("filters")
        || options.flags.tokenmagic.hasOwnProperty("-=filters"))) ) {
      return;
    }
    if ( data == null || !data.hasOwnProperty("_id") ) {
      return;
    }

    let placeable = getPlaceableById(data._id, placeableType);
    if ( placeable == null ) {
      return;
    }

    // Shortcut when all filters are deleted
    if ( options.flags.tokenmagic.hasOwnProperty("-=filters") ) {
      Anime.removeAnimation(data._id);                // removing animations on this placeable
      this._clearImgFiltersByPlaceable(placeable);    // clearing the filters (owned by tokenmagic)
      return;
    }

    let filters = placeable.document.getFlag("tokenmagic", "filters");
    if ( filters == null ) {
      return;
    }

    // CROSS-RESEARCH between the anime map and tokenmagic flags to add, delete or update filters on this placeable

    // we begin by detecting deleted filters
    for ( let anime of Anime.getAnimeMap().values() ) {
      // we test all the animes that are supposed to be on the placeable
      if ( anime.puppet.placeableId === placeable.id ) {
        // is the animation present in the tokenmagic flags for this placeable ?
        let foundFilter = false;
        filters.forEach((filterFlag) => {
          if ( anime.puppet.filterId === filterFlag.tmFilters.tmFilterId
            && anime.puppet.filterInternalId === filterFlag.tmFilters.tmFilterInternalId
            && anime.puppet.placeableId === filterFlag.tmFilters.tmParams.placeableId ) {
            // we find it !
            foundFilter = true;
          }
        });

        // Not found, the animation is removed from the AnimeMap as well as the filter on the placeable
        if ( !foundFilter ) {
          Anime.removeAnimationByFilterId(data._id, anime.puppet.filterId);
          this._clearImgFiltersByPlaceable(placeable, anime.puppet.filterId);
        }
      }
    }

    // we test each tokenmagic filter flag in the placeable
    filters.forEach((filterFlag) => {
      if ( filterFlag.tmFilters.hasOwnProperty("tmParams") ) {
        // we get the puppets in anime corresponding to this placeable
        let puppets = Anime.getPuppetsByParams(filterFlag.tmFilters.tmParams);
        if ( puppets.length > 0 ) {
          // we found corresponding filters
          for ( const puppet of puppets ) {
            // we update if needed
            if ( !_fxPseudoEqual(filterFlag.tmFilters.tmParams, puppet) ) {
              if ( !puppet.hasOwnProperty("updateId")
                || (puppet.hasOwnProperty("updateId")
                  && puppet.updateId !== filterFlag.tmFilters.tmParams.updateId) ) {
                puppet.setTMParams(duplicate(filterFlag.tmFilters.tmParams));
                puppet.normalizeTMParams();
              }
            }
          }
        }
        else {
          // this is a new filter, we assign it to the placeable
          _assignFilter(placeable, filterFlag);
        }

      }
    });
  }

  function _clearImgFiltersByPlaceable(placeable, filterId = null) {

    if ( placeable == null ) {
      return;
    }

    let filterById = (filterId != null && typeof filterId === "string");

    function destroyClearedFilters(theFilters) {
      if ( theFilters instanceof Array ) {
        let tmFilters = theFilters.filter(filter =>
          filterById
            ? filter.hasOwnProperty("filterId") && filter.filterId === filterId
            : filter.hasOwnProperty("filterId")
        );

        for ( const filter of tmFilters ) {
          filter.enabled = false;
          filter.destroy();
        }
      }
    }

    function filterTheFiltering(theFilters) {
      if ( theFilters instanceof Array ) {
        let tmFilters = theFilters.filter(filter =>
          filterById
            ? !(filter.hasOwnProperty("filterId") && filter.filterId === filterId)
            : !filter.hasOwnProperty("filterId")
        );
        return (tmFilters.length === 0 ? null : tmFilters);
      }
      return theFilters;
    }

    let sprite = placeable._TMFXgetSprite();
    if ( sprite != null ) {
      destroyClearedFilters(sprite.filters);
      sprite.filters = filterTheFiltering(sprite.filters);
    }
  }

  async function _importPresetContent(content, options = {}) {

    // In internal, we can force overwrite
    if ( !options.hasOwnProperty("overwrite") ) {
      options.overwrite = game.settings.get("tokenmagic", "importOverwrite");
    }

    ///////////////////////////////////////////////
    // Checking the imported object format

    log("import -> checking import file format...");
    if ( !(content instanceof Array) || content.length < 1 ) {
      error("import -> file format check KO !");
      error(i18n("TMFX.preset.import.format.failure"));
      return false;
    }
    log("import -> file format check OK !");
    // check object format end
    /////////////////////////////////////////////////

    let check = true;

    ///////////////////////////////////////////////
    // Checking the imported content
    log("import -> checking import file content...");
    for ( const element of content ) {
      if ( element.hasOwnProperty("name")
        && typeof element.name === "string"
        && element.hasOwnProperty("params")
        && element.params instanceof Array ) {

        for ( const effect of element.params ) {
          if ( !(effect.hasOwnProperty("filterType")
            && FilterType.hasOwnProperty(effect.filterType)) ) {
            check = false;
            break;
          }
        }
        if ( !check ) break;
      }
      else {
        check = false;
        break;
      }
    }

    if ( !check ) {
      error("import -> file content check KO !");
      error(i18n("TMFX.preset.import.format.failure"));
      return false;
    }
    log("import -> file content check OK !");

    // check content end
    /////////////////////////////////////////////////

    // The preset libray must be replaced ?
    if ( options.hasOwnProperty("replaceLibrary")
      && options.replaceLibrary ) {
      await game.settings.set("tokenmagic", "presets", content);
      log("import -> preset library replaced");
      log(i18n("TMFX.preset.import.success"));
      return true;
    }

    let pst = game.settings.get("tokenmagic", "presets");
    let it = 0;
    for ( const element of content ) {
      const preset = pst.find(el => el.name === element.name);
      if ( preset == null ) {
        log("import -> add: " + element.name);
        pst.push(element);
        it++;
      }
      else {
        if ( options.hasOwnProperty("overwrite")
          && options.overwrite ) {
          const index = pst.indexOf(preset);
          if ( index > -1 ) {
            log("import -> overwrite: " + element.name);
            pst[index] = element;
            it++;
          }
        }
        else {
          warn("import -> ignored: " + element.name + " -> already exists");
        }
      }
    }

    await game.settings.set("tokenmagic", "presets", pst);
    log("import -> " + it + " preset(s) added to the library");
    log(i18n("TMFX.preset.import.success"));
    return true;
  }

  async function _importTemplateSettingsContent(content, options = {}) {

    ///////////////////////////////////////////////
    // Checking the imported object format

    log("import -> checking import file format...");
    if ( !(content instanceof Object) ) {
      error("import -> file format check KO !");
      error(i18n("TMFX.preset.import.format.failure"));
      return false;
    }
    log("import -> file format check OK !");

    // check object format end
    /////////////////////////////////////////////////

    await game.settings.set("tokenmagic", "autoTemplateSettings", content);
    log("import -> automatic template settings replaced");
    log(i18n("TMFX.preset.import.success"));
    return true;
  }

  async function resetPresetLibrary() {
    if ( !game.user.isGM ) return;

    if ( confirm(i18n("TMFX.preset.reset.message")) ) {
      try {
        await game.settings.set("tokenmagic", "presets", allPresets);
        ui.notifications.info(i18n("TMFX.preset.reset.success"));
      } catch(e) {
        error(e.message);
      }
    }
  }

  async function importPresetLibraryFromURL(url, options = {}) {
    try {
      $.getJSON(url, async function(content) {
        return await _importPresetContent(content, options);
      });
    } catch(e) {
      error(e.message);
      error(i18n("TMFX.preset.import.failure"));
      return false;
    }
  }

  async function importPresetLibraryFromPath(path, options = {}) {
    try {
      const response = await fetch(path);
      const content = await response.json();

      return await _importPresetContent(content, options);

    } catch(e) {
      error(e.message);
      error(i18n("TMFX.preset.import.failure"));
      return false;
    }
  }

  async function importTemplateSettingsFromPath(path, options = {}) {
    try {
      const response = await fetch(path);
      const content = await response.json();

      return await _importTemplateSettingsContent(content, options);

    } catch(e) {
      error(e.message);
      error(i18n("TMFX.preset.import.failure"));
      return false;
    }
  }

  async function importPresetLibrary() {
    const path = "modules/tokenmagic/import";
    new FilePicker({
      type: "json",
      current: path,
      callback: importPresetLibraryFromPath
    }).browse();
  }

  function exportPresetLibrary(exportName = "tmfx-presets") {
    let pst = game.settings.get("tokenmagic", "presets");
    if ( pst == null || typeof pst !== "object" ) return false;
    exportObjectAsJson(pst, exportName);
  }

  async function importTemplateSettings() {
    const path = "modules/tokenmagic/import";
    new FilePicker({
      type: "json",
      current: path,
      callback: importTemplateSettingsFromPath
    }).browse();
  }

  function exportTemplateSettings(exportName = "tmfx-template-settings") {
    let pst = game.settings.get("tokenmagic", "autoTemplateSettings");
    if ( pst == null || typeof pst !== "object" ) return false;
    exportObjectAsJson(pst, exportName);
  }

  function getPresets(libraryName = PresetsLibrary.MAIN) {
    let pst = game.settings.get("tokenmagic", "presets");
    if ( pst == null || typeof pst !== "object" ) return [];
    return pst.filter(preset => preset.library === libraryName);
  }

  function _getPresetTemplateDefaultTexture(presetName, presetLibrary = PresetsLibrary.TEMPLATE) {
    let pst = game.settings.get("tokenmagic", "presets");
    const preset = pst.find(el => el["name"] === presetName && el["library"] === presetLibrary);
    if ( !(preset == null) && preset.hasOwnProperty("defaultTexture") ) return fixPath(preset.defaultTexture);
    else return null;
  }

  function getPreset(presetName) {

    let pName = null, pLibrary = null;
    let argIsObj = (presetName instanceof Object);
    const {name, library, ...adjustmentProp} = argIsObj ? presetName : {};
    if ( argIsObj ) {
      if ( presetName.hasOwnProperty("name") ) {
        pName = presetName.name;
      }
      if ( presetName.hasOwnProperty("library") ) {
        pLibrary = presetName.library;
      }
    }
    else {
      pName = presetName;
    }

    if ( pLibrary == null || typeof pLibrary !== "string" ) {
      pLibrary = PresetsLibrary.MAIN;
    }

    if ( typeof pName !== "string" ) return undefined;

    let pst = game.settings.get("tokenmagic", "presets");
    if ( pst == null || typeof pst !== "object" ) return undefined;

    const preset = pst.find(el => el["name"] === pName && el["library"] === pLibrary);
    if ( !(preset == null)
      && preset.hasOwnProperty("params")
      && preset.params instanceof Array ) {
      for ( const [filterProp, filterPropVal] of Object.entries(adjustmentProp) ) {
        //log(`getPreset ${filterProp}: ${filterPropVal}`);
        for ( const param of preset.params ) {
          if ( param.hasOwnProperty(filterProp) ) {
            param[filterProp] = filterPropVal;
          }
        }
      }
      return preset.params;
    }
    return undefined;
  }

  async function deletePreset(presetName, silent = false) {
    if ( !game.user.isGM ) {
      if ( !silent ) ui.notifications.warn(i18n("TMFX.preset.delete.permission.failure"));
      return false;
    }

    let pName = null, pLibrary = null;

    if ( presetName instanceof Object ) {
      if ( presetName.hasOwnProperty("name") ) {
        pName = presetName.name;
      }
      if ( presetName.hasOwnProperty("library") ) {
        pLibrary = presetName.library;
      }
    }
    else {
      pName = presetName;
    }

    if ( pLibrary == null || typeof pLibrary !== "string" ) {
      pLibrary = PresetsLibrary.MAIN;
    }

    if ( typeof pName !== "string" ) {
      if ( !silent ) ui.notifications.error(i18n("TMFX.preset.delete.params.failure"));
      return false;
    }

    let pst = game.settings.get("tokenmagic", "presets");
    if ( pst == null ) {
      if ( !silent ) ui.notifications.warn(i18n("TMFX.preset.delete.empty.failure"));
      return false;
    }

    let state = true;
    const preset = pst.find(el => el["name"] === pName && el["library"] === pLibrary);

    if ( preset == null ) {
      if ( !silent ) ui.notifications.warn(i18n("TMFX.preset.delete.notfound.failure"));
      state = false;
    }
    else {
      const index = pst.indexOf(preset);
      if ( index > -1 ) {
        pst.splice(index, 1);
        try {
          await game.settings.set("tokenmagic", "presets", pst);
          if ( !silent ) ui.notifications.info(i18n("TMFX.preset.delete.success"));
        } catch(e) {
          if ( !silent ) ui.notifications.error(e.message);
          console.error(e);
          state = false;
        }
      }
    }
    return state;
  }

  async function addPreset(presetName, params, silent = false) {
    if ( !game.user.isGM ) {
      if ( !silent ) ui.notifications.warn(i18n("TMFX.preset.add.permission.failure"));
      return false;
    }

    let pName = null, pLibrary = null, pDefaultTexture = null;
    if ( presetName instanceof Object ) {
      if ( presetName.hasOwnProperty("name") ) {
        pName = presetName.name;
      }
      if ( presetName.hasOwnProperty("library") ) {
        pLibrary = presetName.library;
      }
      if ( presetName.hasOwnProperty("defaultTexture") ) {
        pDefaultTexture = fixPath(presetName.defaultTexture);
      }
    }
    else {
      pName = presetName;
    }

    if ( pLibrary == null || typeof pLibrary !== "string" ) {
      pLibrary = PresetsLibrary.MAIN;
    }

    if ( typeof pDefaultTexture !== "string" ) {
      pDefaultTexture = null;
    }

    if ( typeof pName !== "string"
      && !(params instanceof Array) ) {
      if ( !silent ) ui.notifications.error(i18n("TMFX.preset.add.params.failure"));
      return false;
    }

    for ( const param of params ) {
      param.filterId = pName;
    }

    let pst = game.settings.get("tokenmagic", "presets");
    let presetObject = {};
    presetObject.name = pName;
    presetObject.library = pLibrary;
    presetObject.params = params;
    if ( pDefaultTexture != null ) {
      presetObject.defaultTexture = pDefaultTexture;
    }

    let state = true;
    if ( pst == null ) {
      pst = [presetObject];
    }
    else {
      const preset =
        pst.find(el => el["name"] === pName && el["library"] === pLibrary);
      if ( preset == null ) pst.push(presetObject);
      else {
        if ( !silent ) ui.notifications.warn(i18n("TMFX.preset.add.duplicate.failure"));
        state = false;
      }
    }

    if ( state ) {
      try {
        await game.settings.set("tokenmagic", "presets", pst);
        if ( !silent ) ui.notifications.info(i18n("TMFX.preset.add.success"));
      } catch(e) {
        if ( !silent ) ui.notifications.error(e.message);
        console.error(e);
        state = false;
      }
    }
    return state;
  }

  return {
    addFilters: addFilters,
    addFiltersOnSelected: addFiltersOnSelected,
    addFiltersOnTargeted: addFiltersOnTargeted,
    addUpdateFilters: addUpdateFilters,
    addUpdateFiltersOnSelected: addUpdateFiltersOnSelected,
    addUpdateFiltersOnTargeted: addUpdateFiltersOnTargeted,
    deleteFilters: deleteFilters,
    deleteFiltersOnSelected: deleteFiltersOnSelected,
    deleteFiltersOnTargeted: deleteFiltersOnTargeted,
    updateFilters: updateFilters,
    updateFiltersOnSelected: updateFiltersOnSelected,
    updateFiltersOnTargeted: updateFiltersOnTargeted,
    updateFiltersByPlaceable: updateFiltersByPlaceable,
    hasFilterType: hasFilterType,
    hasFilterId: hasFilterId,
    importTemplateSettings: importTemplateSettings,
    importTemplateSettingsFromPath: importTemplateSettingsFromPath,
    exportTemplateSettings: exportTemplateSettings,
    exportPresetLibrary: exportPresetLibrary,
    importPresetLibrary: importPresetLibrary,
    importPresetLibraryFromURL: importPresetLibraryFromURL,
    importPresetLibraryFromPath: importPresetLibraryFromPath,
    resetPresetLibrary: resetPresetLibrary,
    getPresets: getPresets,
    getPreset: getPreset,
    addPreset: addPreset,
    deletePreset: deletePreset,
    getControlledPlaceables: getControlledPlaceables,
    getTargetedTokens: getTargetedTokens,
    getPlaceableById: getPlaceableById,
    _assignFilters: _assignFilters,
    _loadFilters: _loadFilters,
    _clearImgFiltersByPlaceable: _clearImgFiltersByPlaceable,
    _getAnimeMap: Anime.getAnimeMap,
    _updateFilters: _updateFilters,
    _updateTemplateData: _updateTemplateData,
    _singleLoadFilters: _singleLoadFilters,
    _cachedContainer: _cachedContainer,
    _checkFilterId: _checkFilterId,
    _getPresetTemplateDefaultTexture: _getPresetTemplateDefaultTexture
  };
}

export const Magic = TokenMagic();

async function compilingShaders() {
  // Caching filters to prevent freezing on first-time loading (shader compilation time)
  // https://www.html5gamedevs.com/topic/43652-shader-compile-performance/

  let params = {enabled: true, dummy: true};

  Magic._cachedContainer.filters = [];
  const filterTypes = Object.keys(FilterType);
  for ( const filterType of filterTypes ) {
    params.filterType = filterType;
    log(`Caching ${filterType}`);
    Magic._cachedContainer.filters.push(new FilterType[filterType](params));
  }

  log("Compiling shaders...");
  let tmpRenderTexture = new PIXI.RenderTexture.create({width: 4, height: 4});
  // A call to render triggers the compilation of all the shaders bound to the filters.
  canvas.app.renderer.render(Magic._cachedContainer, {renderTexture: tmpRenderTexture});
  log("Shaders compiled for the GPU and ready!");
}

function initSocketListener() {

  // Activate the listener only for the One
  const theOne = game.users.find((user) => user.isGM && user.active);
  if ( theOne && game.user !== theOne ) {
    return;
  }

  // Listener the listening
  game.socket.on(moduleTM, async (data) => {

    if ( data == null || !data.hasOwnProperty("tmAction") ) {
      return;
    }

    async function updateFlags(targetFlag) {
      // getting the scene coming from the socket
      let scene = game.scenes.get(data.tmViewedScene);
      if ( scene == null ) return;

      // preparing flag data (with -= if the data is null)
      let updateData;
      if ( data.tmFlag == null ) updateData = {[`flags.tokenmagic.-=${targetFlag}`]: null};
      else updateData = {[`flags.tokenmagic.${targetFlag}`]: data.tmFlag};
      updateData["_id"] = data.tmPlaceableId;

      // updating the placeable in the scene
      await scene.updateEmbeddedDocuments(data.tmPlaceableType, [updateData]);
    }

    switch ( data.tmAction ) {
      case SocketAction.SET_FLAG:
        await updateFlags(`filters`);
        break;

      case SocketAction.SET_ANIME_FLAG:
        await updateFlags(`animeInfo`);
        break;
    }
  });
}

async function requestLoadFilters(placeable, startTimeout = 0) {
  let reqTimer;
  placeable.loadingRequest = true;

  function launchRequest(placeable) {
    reqTimer = setTimeout(() => {
      if ( placeable == null ) return;
      let check = placeable._TMFXcheckSprite();
      if ( check == null ) {
        placeable.loadingRequest = false;
        return;
      }
      else if ( check ) Magic._singleLoadFilters(placeable);
      else launchRequest(placeable);
    }, 35);
  }

  function setRequestTimeOut() {
    setTimeout(() => {
      clearTimeout(reqTimer);
    }, 2000);
  }

  setTimeout(() => {
    setRequestTimeOut();
    launchRequest(placeable);
  }, startTimeout);
}

function getAnchor(direction, angle, shapeType) {
  if ( shapeType === "circle" || shapeType === "rect" ) return {x: 0.5, y: 0.5};

  // Compute emanation anchor point from the orthonormal bounding rect containing the polygon.
  // Not complete (to rework later), but ok with cardinal and half-cardinal directions
  let dirRad = direction * Math.PI / 180;
  let angleRad = angle * Math.PI / 180;

  let cosRa1 = Math.cos(dirRad - (angleRad / 2));
  let rsinRa1 = -Math.sin(dirRad - (angleRad / 2));
  let cosRa2 = Math.cos(dirRad + (angleRad / 2));
  let rsinRa2 = -Math.sin(dirRad + (angleRad / 2));

  let x = 0, y = 1;

  if ( cosRa1 < 0 && cosRa2 < 0 ) {
    x = 1;
  }
  else if ( cosRa1 < 0 || cosRa2 < 0 ) {
    x = (Math.sin(-dirRad - (Math.PI / 2)) + 1) / 2;
  }

  if ( rsinRa1 < 0 && rsinRa2 < 0 ) {
    y = 0;
  }
  else if ( rsinRa1 < 0 || rsinRa2 < 0 ) {
    y = (Math.cos(-dirRad - (Math.PI / 2)) + 1) / 2;
  }

  return {x: x, y: y};
}

function onMeasuredTemplateConfig(data, html) {

  if ( !isVideoDisabled() ) {
    html[0].querySelector(".file-picker").dataset.type = "imagevideo";
  }

  function compare(a, b) {
    if ( a.name < b.name ) return -1;
    if ( a.name > b.name ) return 1;
    return 0;
  }

  let tmTemplate = data.object;

  if ( isNewerVersion(game.version, "0.8") ) {
    tmTemplate = tmTemplate.object;
  }

  let opacity = tmTemplate.template.alpha;
  let tint = "";
  let currentPreset = emptyPreset;

  // getting custom data
  let tmfxTemplateData = tmTemplate.document.getFlag("tokenmagic", "templateData");
  if ( !(tmfxTemplateData == null) && tmfxTemplateData instanceof Object ) {
    opacity = tmTemplate.document.tmfxTextureAlpha = tmfxTemplateData.opacity;
    tint = tmTemplate.document.tmfxTint = (tmfxTemplateData.tint ? PIXI.utils.hex2string(tmfxTemplateData.tint) : "");

    if ( tmfxTemplateData.preset !== undefined )
      currentPreset = tmfxTemplateData.preset;
  }
  let filters = tmTemplate.document.getFlag("tokenmagic", "filters");
  let presets = Magic.getPresets(PresetsLibrary.TEMPLATE);

  if ( filters && (filters instanceof Array) && filters.length >= 1 )
    currentPreset = filters[0].tmFilters.tmFilterId;

  // forming our injected html
  let tmfxValues = "";
  let selected = "";
  tmfxValues += `<option value="${emptyPreset}"></option>`;
  presets.sort(compare).forEach(preset => {
    selected = ((preset.name === currentPreset) ? " selected" : "");
    tmfxValues += `<option value="${preset.name}"${selected}>${preset.name}</option>`;
  });

  let divPreset = `
    <div class="form-group">
        <label>${i18n("TMFX.template.opacity")}</label>
        <div class="form-fields">
            <input type="range" name="flags.tokenmagic.templateData.opacity" value="${opacity}" min="0.0" max="1.0" step="0.05" data-dtype="Number"/>
            <span class="range-value">${opacity}</span>
        </div>
    </div>

    <div class="form-group">
        <label>${i18n("TMFX.template.fx")}</label>
        <select class="tmfx" name="flags.tokenmagic.templateData.preset" data-dtype="String">
        ${tmfxValues}
        </select>
    </div>

    <div class="form-group">
        <label>${i18n("TMFX.template.tint")}</label>
        <div class="form-fields">
            <input class="color" type="text" name="flags.tokenmagic.templateData.tint" value="${tint}"/>
            <input type="color" value="${tint}" data-edit="flags.tokenmagic.templateData.tint"/>
        </div>
    </div>
    `;

  // injecting
  const htmlForm = html.find(".form-group");
  htmlForm.last().after(divPreset);

  $(html).css({"min-height": "525px"});
}

Hooks.on("ready", () => {
  log("Hook -> ready");
  tmfxDataMigration();
  initSocketListener();
  window.TokenMagic = Magic;

  if ( !game.modules.get("lib-wrapper")?.active && game.user.isGM )
    ui.notifications.warn("The 'Token Magic FX' module recommends to install and activate the 'libWrapper' module.");

  Hooks.on("renderMeasuredTemplateConfig", onMeasuredTemplateConfig);
});

Hooks.on("canvasInit", (canvas) => {
  log("Hook -> canvasInit");
  autosetPaddingMode();
  Anime.deactivateAnimation();
  Anime.resetAnimation();
});

Hooks.once("canvasInit", (canvas) => {
  if ( !isFilterCachingDisabled() ) {
    log("Init -> canvasInit -> caching shaders");
    compilingShaders();
  }
});

Hooks.on("canvasReady", (canvas) => {
  log("Hook -> canvasReady");

  if ( !window.hasOwnProperty("TokenMagic") ) {
    window.TokenMagic = Magic;
  }
  if ( canvas == null ) {
    return;
  }

  const tokens = canvas.tokens.placeables;
  Magic._loadFilters(tokens);
  const tiles = canvas.tiles.placeables;
  Magic._loadFilters(tiles);
  const drawings = canvas.drawings.placeables;
  Magic._loadFilters(drawings);
  const templates = canvas.templates.placeables;
  Magic._loadFilters(templates);

  Anime.activateAnimation();
});

Hooks.on("deleteScene", (scene, data, options) => {
  //log("Hook -> deleteScene");
  if ( !(scene == null) && scene.id === game.user.viewedScene ) {
    Anime.deactivateAnimation();
    Anime.resetAnimation();
  }
});

Hooks.on("deleteToken", (parent, doc, options, userId) => {
  //log("Hook -> deleteToken");
  if ( !(doc == null || !doc.hasOwnProperty("_id")) ) {
    Anime.removeAnimation(doc._id);
  }
});

Hooks.on("createToken", (scene, data, options) => {
  //log("Hook -> createToken");
  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( !(scene == null)
    && scene.id === game.user.viewedScene
    && data.hasOwnProperty("flags")
    && data.flags.hasOwnProperty("tokenmagic")
    && data.flags.tokenmagic.hasOwnProperty("filters") ) {

    let placeable = getPlaceableById(data._id, PlaceableType.TOKEN);

    // request to load filters (when pixi containers are ready)
    requestLoadFilters(placeable, 250);
  }
});

Hooks.on("createTile", (scene, data, options) => {
  //log("Hook -> createTile");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( !(scene == null)
    && scene.id === game.user.viewedScene
    && data.hasOwnProperty("flags")
    && data.flags.hasOwnProperty("tokenmagic")
    && data.flags.tokenmagic.hasOwnProperty("filters") ) {

    const placeable = getPlaceableById(data._id, PlaceableType.TILE);

    // request to load filters (when pixi containers are ready)
    requestLoadFilters(placeable, 250);
  }
});

Hooks.on("createDrawing", (scene, data, options) => {
  //log("Hook -> createDrawing");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( !(scene == null)
    && scene.id === game.user.viewedScene
    && data.hasOwnProperty("flags")
    && data.flags.hasOwnProperty("tokenmagic")
    && data.flags.tokenmagic.hasOwnProperty("filters") ) {

    let placeable = getPlaceableById(data._id, PlaceableType.DRAWING);

    // request to load filters (when pixi containers are ready)
    requestLoadFilters(placeable, 250);
  }
});

Hooks.on("updateToken", (scene, data, options) => {
  //log("Hook -> updateToken");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( scene.id !== game.user.viewedScene ) return;

  if ( options.hasOwnProperty("img") || options.hasOwnProperty("tint")
    || options.hasOwnProperty("height") || options.hasOwnProperty("width")
    || options.hasOwnProperty("name") ) {

    let placeable = getPlaceableById(data._id, PlaceableType.TOKEN);

    // removing animations on this placeable
    Anime.removeAnimation(data._id);

    // clearing the filters (owned by tokenmagic)
    Magic._clearImgFiltersByPlaceable(placeable);

    // querying filters reload (when pixi containers are ready)
    requestLoadFilters(placeable, 250);
  }
  else {
    Magic._updateFilters(data, options, PlaceableType.TOKEN);
  }
});

Hooks.on("deleteTile", (parent, doc, options, userId) => {
  //log("Hook -> deleteTile");
  if ( !(doc == null || !doc.hasOwnProperty("_id")) ) {
    Anime.removeAnimation(doc._id);
  }
});

Hooks.on("updateTile", (scene, data, options) => {
  //log("Hook -> updateTile");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( scene.id !== game.user.viewedScene ) return;

  if ( options.hasOwnProperty("img") || options.hasOwnProperty("overhead") ) {

    const placeable = getPlaceableById(data._id, PlaceableType.TILE);

    // removing animations on this placeable
    Anime.removeAnimation(data._id);

    // querying filters reload (when pixi containers are ready)
    requestLoadFilters(placeable, 250);

  }
  else {
    Magic._updateFilters(data, options, PlaceableType.TILE);
  }
});

Hooks.on("deleteDrawing", (parent, doc, options, userId) => {
  //log("Hook -> deleteDrawing");
  if ( !(doc == null || !doc.hasOwnProperty("_id")) ) {
    Anime.removeAnimation(doc._id);
  }
});

Hooks.on("updateDrawing", (scene, data, options, action) => {
  //log("Hook -> updateDrawing");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( scene.id !== game.user.viewedScene ) return;

  if ( !(options.flags?.tokenmagic) || options.x || options.y ) {

    let placeable = getPlaceableById(data._id, PlaceableType.DRAWING);

    // removing animations on this placeable
    Anime.removeAnimation(data._id);

    // clearing the filters (owned by tokenmagic)
    Magic._clearImgFiltersByPlaceable(placeable);

    // querying filters reload (when pixi containers are ready)
    requestLoadFilters(placeable, 250);

  }
  else {
    Magic._updateFilters(data, options, PlaceableType.DRAWING);
  }
});

Hooks.on("preUpdateMeasuredTemplate", async (scene, measuredTemplate, updateData, options) => {
  //log("Hook -> preUpdateMeasuredTemplate");

  if ( isNewerVersion(game.version, "0.8") ) {
    updateData = measuredTemplate;
    measuredTemplate = scene;
    scene = scene.parent;
  }

  function getTint() {
    if ( updateData.flags?.tokenmagic?.templateData?.tint !== undefined ) {
      return updateData.flags.tokenmagic.templateData.tint;
    }
    else if ( measuredTemplate.flags?.tokenmagic?.tint !== undefined ) {
      return measuredTemplate.flags.tokenmagic.tint;
    }
    else return "";
  }

  function getFX() {
    if ( updateData.flags?.tokenmagic?.templateData?.preset !== undefined ) {
      return updateData.flags.tokenmagic.templateData.preset;
    }
    else if ( measuredTemplate.flags?.tokenmagic?.templateData?.preset !== undefined ) {
      return measuredTemplate.flags.tokenmagic.templateData.preset;
    }
    else if ( measuredTemplate.tmfxPreset !== undefined ) {
      return measuredTemplate.tmfxPreset;
    }
    else return emptyPreset;
  }

  function getDirection() {
    if ( updateData.direction ) {
      return updateData.direction;
    }
    else if ( measuredTemplate.direction ) {
      return measuredTemplate.direction;
    }
    else return 0;
  }

  function getAngle() {
    if ( updateData.angle ) {
      return updateData.angle;
    }
    else if ( measuredTemplate.angle ) {
      return measuredTemplate.angle;
    }
    else return 0;
  }

  function getShapeType() {
    if ( updateData.t ) {
      return updateData.t;
    }
    else if ( measuredTemplate.t ) {
      return measuredTemplate.t;
    }
    else return "ITSBAD";
  }

  let measuredTemplateInstance = canvas.templates.get(measuredTemplate._id);
  let templateTint = getTint();
  let presetUpdate = (updateData.flags?.tokenmagic?.templateData?.preset !== undefined);
  let tintUpdate = (updateData.flags?.tokenmagic?.templateData?.tint !== undefined);
  let directionUpdate = updateData.hasOwnProperty("direction");
  let angleUpdate = updateData.hasOwnProperty("angle");
  let typeUpdate = updateData.hasOwnProperty("t");

  if ( tintUpdate )
    updateData.flags.tokenmagic.templateData.tint = (templateTint !== "" ? Color.from(templateTint).valueOf() : null);

  if ( presetUpdate || tintUpdate || directionUpdate || typeUpdate || angleUpdate ) {
    let templateFX = getFX();
    if ( templateFX !== emptyPreset ) {
      let anchor = getAnchor(getDirection(), getAngle(), getShapeType());
      let presetOptions =
        {
          name: templateFX,
          library: PresetsLibrary.TEMPLATE,
          anchorX: anchor.x,
          anchorY: anchor.y
        };
      if ( templateTint && templateTint !== "" ) {
        presetOptions.color = Color.from(templateTint).valueOf();
      }
      let preset = Magic.getPreset(presetOptions);
      if ( !(preset == null) ) {
        if ( presetUpdate ) await measuredTemplateInstance.TMFXaddFilters(preset, true);
        else await measuredTemplateInstance.TMFXaddUpdateFilters(preset);
      }
    }
    else await measuredTemplateInstance.TMFXdeleteFilters();
  }
});

Hooks.on("updateMeasuredTemplate", (scene, data, options) => {
  //log("Hook -> updateMeasuredTemplate");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( scene.id !== game.user.viewedScene ) return;

  let placeable = getPlaceableById(data._id, PlaceableType.TEMPLATE);
  if ( options.hasOwnProperty("texture") ) {
    // removing animations on this placeable
    Anime.removeAnimation(data._id);

    // clearing the filters (owned by tokenmagic)
    Magic._clearImgFiltersByPlaceable(placeable);

    // querying filters reload (when pixi containers are ready)
    requestLoadFilters(placeable, 250);

  }
  else {
    if ( !placeable.loadingRequest ) {
      Magic._updateFilters(data, options, PlaceableType.TEMPLATE);
      Magic._updateTemplateData(data, options, PlaceableType.TEMPLATE);
    }
  }
});

Hooks.on("deleteMeasuredTemplate", (parent, doc, options, userId) => {
  //log("Hook -> deleteMeasuredTemplate");
  if ( !(doc == null || !doc.hasOwnProperty("_id")) ) {
    Anime.removeAnimation(doc._id);
  }
});

Hooks.on("createMeasuredTemplate", (scene, data, options) => {
  //log("Hook -> createMeasuredTemplate");

  if ( isNewerVersion(game.version, "0.8") ) {
    [data, options] = [scene, data];
    scene = scene.parent;
  }

  if ( !(scene == null)
    && scene.id === game.user.viewedScene
    && data.hasOwnProperty("flags")
    && data.flags.hasOwnProperty("tokenmagic")
    && data.flags.tokenmagic.hasOwnProperty("filters") ) {

    let placeable = getPlaceableById(data._id, PlaceableType.TEMPLATE);

    // request to load filters (when pixi containers are ready)
    requestLoadFilters(placeable, 250);
  }
});

Hooks.on("preCreateMeasuredTemplate", (document, updateData) => {
  // This would ideally be `preCreateMeasuredTemplate` and/or merged with the createMeasuredTemplate

  const hasFlags = document.flags;
  let hasPreset = false;
  let hasTint = false;
  let hasOpacity = false;
  let hasFlagsNoOptions = false;

  if ( hasFlags && document.flags.tokenmagic?.options ) {
    const opt = document.flags.tokenmagic.options;
    if ( opt.tmfxPreset ) {
      document.tmfxPreset = opt.tmfxPreset;
      hasPreset = true;
    }
    if ( opt.tmfxTint ) {
      document.tmfxTint = opt.tmfxTint;
      hasTint = true;
    }
    if ( opt.tmfxTextureAlpha ) {
      document.tmfxTextureAlpha = opt.tmfxTextureAlpha;
      hasOpacity = true;
    }
    if ( opt.tmfxTexture ) {
      document.texture = opt.tmfxTexture;
      document.updateSource({texture: opt.tmfxTexture});
    }
  }
  else hasFlagsNoOptions = true;

  let hasTexture = document.texture && document.texture !== "";
  let newFilters = [];

  let tmfxBaseFlags = {tokenmagic: {filters: null, templateData: null, options: null}};
  if ( hasFlags && hasFlagsNoOptions ) {
    // the measured template comes with tokenmagic flags ? It is a copy ! We do nothing.
    if ( document.flags.tokenmagic ) {
      return;
    }
    document.flags = mergeObject(document.flags, tmfxBaseFlags, true, true);
  }

  // normalizing color to value if needed
  if ( hasTint && typeof document.tmfxTint !== "number" ) {
    document.tmfxTint = Color.from(document.tmfxTint).valueOf();
  }

  let tmfxFiltersData = null;

  // FX to add ?
  if ( hasPreset ) {

    // Compute shader anchor point
    let anchor = getAnchor(document.direction, document.angle, document.t);

    // Constructing the preset search object
    let pstSearch =
      {
        name: document.tmfxPreset,
        library: PresetsLibrary.TEMPLATE,
        anchorX: anchor.x,
        anchorY: anchor.y
      };

    // Adding tint if needed
    if ( hasTint ) pstSearch.color = document.tmfxTint;

    // Retrieving the preset
    let preset = Magic.getPreset(pstSearch);

    if ( !(preset == null) && preset instanceof Array ) {

      let defaultTex = Magic._getPresetTemplateDefaultTexture(pstSearch.name);
      if ( !(defaultTex == null) && !hasTexture ) {
        document.updateSource({texture: defaultTex});
      }

      let persist = true;

      // Constructing the filter flag parameters
      for ( const params of preset ) {

        if ( !params.filterType || !FilterType.hasOwnProperty(params.filterType) ) {
          // one invalid ? all rejected.
          persist = false;
          break;
        }

        // getPreset MUST provide a filter id
        if ( !params.filterId ) {
          persist = false;
          break;
        }

        if ( !params.enabled || !(typeof params.enabled === "boolean") ) {
          params.enabled = true;
        }

        params.placeableId = null;
        params.filterInternalId = randomID();
        params.filterOwner = game.data.userId;
        params.placeableType = PlaceableType.TEMPLATE;

        newFilters.push({
          tmFilters: {
            tmFilterId: params.filterId,
            tmFilterInternalId: params.filterInternalId,
            tmFilterType: params.filterType,
            tmFilterOwner: params.filterOwner,
            tmParams: params
          }
        });
      }

      if ( persist ) tmfxFiltersData = newFilters;
    }
  }
  else {
    document.tmfxPreset = emptyPreset;
  }

  if ( !hasOpacity ) document.tmfxTextureAlpha = 1;
  if ( !hasTint ) document.tmfxTint = null;

  let tmfxFlags = {
    templateData: {
      opacity: document.tmfxTextureAlpha,
      tint: document.tmfxTint
    },
    filters: tmfxFiltersData,
    options: null
  };
  document.updateSource({flags: {tokenmagic: tmfxFlags}});
});

Hooks.on("closeSettingsConfig", () => {
  autosetPaddingMode();
});
