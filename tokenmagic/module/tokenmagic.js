import { FilterAdjustment } from "../fx/filters/FilterAdjustment.js";
import { FilterXBloom } from "../fx/filters/FilterAdvancedBloom.js";
import { FilterDistortion } from "../fx/filters/FilterDistortion.js";
import { FilterOldFilm } from "../fx/filters/FilterOldFilm.js";
import { FilterGlow } from "../fx/filters/FilterGlow.js";
import { FilterOutline } from "../fx/filters/FilterOutline.js";
import { FilterBevel } from "../fx/filters/FilterBevel.js";
import { FilterDropShadow } from "../fx/filters/FilterDropShadow.js";
import { FilterTwist } from "../fx/filters/FilterTwist.js";
import { FilterZoomBlur } from "../fx/filters/FilterZoomBlur.js";
import { FilterBlur } from "../fx/filters/FilterBlur.js";
import { FilterShockwave } from "../fx/filters/FilterShockWave.js";
import { FilterBulgePinch } from "../fx/filters/FilterBulgePinch.js";
import { FilterRemoveShadow } from "../fx/filters/FilterRemoveShadow.js";
import { FilterRays } from "../fx/filters/FilterRays.js";
import { FilterFog } from "../fx/filters/FilterFog.js";
import { FilterXFog } from "../fx/filters/FilterXFog.js";
import { FilterElectric } from "../fx/filters/FilterElectric.js";
import { FilterWaves } from "../fx/filters/FilterWaves.js";
import { FilterFire } from "../fx/filters/FilterFire.js";
import { FilterFumes } from "../fx/filters/FilterFumes.js";
import { FilterFlood } from "../fx/filters/FilterFlood.js";
import { FilterSmoke } from "../fx/filters/FilterSmoke.js";
import { FilterForceField } from "../fx/filters/FilterForceField.js";
import { FilterMirrorImages } from "../fx/filters/FilterMirrorImages.js";
import { FilterXRays } from "../fx/filters/FilterXRays.js";
import { FilterLiquid } from "../fx/filters/FilterLiquid.js";
import { FilterGleamingGlow } from "../fx/filters/FilterGleamingGlow.js";
import { FilterPixelate } from "../fx/filters/FilterPixelate.js";
import { FilterSpiderWeb } from "../fx/filters/FilterSpiderWeb.js";
import { Anime } from "../fx/Anime.js";
import { presets as defaultPresets, PresetsLibrary } from "../fx/presets/defaultpresets.js";
import { tmfxDataMigration, DataVersion } from "../migration/migration.js";
import "./proto/PlaceableObjectProto.js";

/*

It's getting messy here ! 
I will fix it in a future version (+ duplicated code to factorize)

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

    const a = document.createElement('a');
    const file = new Blob([jsonStr], { type: 'plain/text' });

    a.href = URL.createObjectURL(file);
    a.download = exportName + '.json';
    a.click();

    URL.revokeObjectURL(a.href);
}

function registerSettings() {
    game.settings.register("tokenmagic", "useAdditivePadding", {
        name: i18n("TMFX.useMaxPadding.name"),
        hint: i18n("TMFX.useMaxPadding.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register("tokenmagic", "minPadding", {
        name: i18n("TMFX.minPadding.name"),
        hint: i18n("TMFX.minPadding.hint"),
        scope: "world",
        config: true,
        default: 50,
        type: Number
    });

    game.settings.register("tokenmagic", "fxPlayerPermission", {
        name: i18n("TMFX.fxPlayerPermission.name"),
        hint: i18n("TMFX.fxPlayerPermission.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register("tokenmagic", "importOverwrite", {
        name: i18n("TMFX.importOverwrite.name"),
        hint: i18n("TMFX.importOverwrite.hint"),
        scope: "world",
        config: true,
        default: false,
        type: Boolean
    });

    game.settings.register("tokenmagic", "presets", {
        name: "Token Magic FX presets",
        hint: "Token Magic FX presets",
        scope: "world",
        config: false,
        default: defaultPresets,
        type: Object
    });

    game.settings.register("tokenmagic", "migration", {
        name: "TMFX Data Version",
        hint: "TMFX Data Version",
        scope: "world",
        config: false,
        default: DataVersion.ARCHAIC,
        type: String
    });
}

export const SocketAction = {
    SET_FLAG: "TMFXSetFlag"
};

export function broadcast(placeable, flag, socketAction) {

    var data =
    {
        tmAction: socketAction,
        tmPlaceableId: placeable.id,
        tmPlaceableType: placeable._TMFXgetPlaceableType(),
        tmFlag: flag,
        tmViewedScene: game.user.viewedScene
    };
    game.socket.emit(moduleTM, data, resp => { });
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

export var isFurnaceDrawingsActive = () => {
    // module exeption for the Furnace by KaKaRoTo
    if (isActiveModule("furnace")
        && game.settings.get("furnace", "enableDrawingTools")) {
        return true;
    }
    return false;
};

export function isTheOne() {
    const theOne = game.users.find((user) => user.isGM && user.active);
    if (theOne && game.user !== theOne) {
        return false;
    } else return true
}

export function mustBroadCast() {
    return game.settings.get("tokenmagic", "fxPlayerPermission") && !isTheOne();
}

export function autosetPaddingMode() {
    canvas.app.renderer.filter.useMaxPadding = !isAdditivePaddingConfig();
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

export function getControlledPlaceables() {
    var controlled = [];
    switch (canvas.activeLayer.name) {
        case TokenLayer.name:
            controlled = canvas.tokens.controlled;
            break;
        case TilesLayer.name:
            controlled = canvas.tiles.controlled;
            break;
        case DrawingsLayer.name:
            controlled = canvas.drawings.controlled;
            break;
    }
    return controlled;
}

export function getTargetedTokens() {
    return canvas.tokens.placeables.filter(placeable => placeable.isTargeted);
}

export function getPlaceableById(id, type) {
    let placeable = null;
    let placeables = null;

    switch (type) {
        case PlaceableType.TOKEN:
            placeables = canvas.tokens.placeables;
            break;
        case PlaceableType.TILE:
            placeables = canvas.tiles.placeables;
            break;
        case PlaceableType.TEMPLATE:
            placeables = canvas.templates.placeables;
            break;
        case PlaceableType.DRAWING:
            placeables = canvas.drawings.placeables;
            break;
    }

    if (!(placeables == null) && placeables.length > 0) {
        placeable = placeables.find(n => n.id === id);
    }

    return placeable;
}

export function objectAssign(target, ...sources) {
    sources.forEach(source => {
        Object.keys(source).forEach(key => {
            const s_val = source[key]
            const t_val = target[key]
            target[key] = t_val && s_val && typeof t_val === 'object' && typeof s_val === 'object'
                ? objectAssign(t_val, s_val)
                : s_val
        });
    });
    return target;
}

export function TokenMagic() {

    var _cachedFilters = {};

    async function addFiltersOnSelected(paramsArray, replace = false) {

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }

        var controlled = getControlledPlaceables();

        if (!(controlled == null) && controlled.length > 0) {
            for (const placeable of controlled) {
                await addFilters(placeable, paramsArray, replace);
            }
        }
    };

    async function addUpdateFiltersOnSelected(paramsArray) {

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }

        var controlled = getControlledPlaceables();

        if (!(controlled == null) && controlled.length > 0) {
            for (const placeable of controlled) {
                await addUpdateFilters(placeable, paramsArray);
            }
        }
    };

    async function addUpdateFiltersOnTargeted(paramsArray) {

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }

        var targeted = getTargetedTokens();

        if (!(targeted == null) && targeted.length > 0) {
            for (const token of targeted) {
                await addUpdateFilters(token, paramsArray);
            }
        }
    };

    async function addFiltersOnTargeted(paramsArray, replace = false) {

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }

        var targeted = getTargetedTokens();

        if (!(targeted == null) && targeted.length > 0) {
            for (const token of targeted) {
                await addFilters(token, paramsArray, replace);
            }
        }
    }

    async function addFilters(placeable, paramsArray, replace = false) {

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }
        if (!(paramsArray instanceof Array && paramsArray.length > 0)
            || placeable == null) return;

        var actualFlags = (replace ? null : placeable.getFlag("tokenmagic", "filters"));
        var newFlags = [];

        for (const params of paramsArray) {
            if (!params.hasOwnProperty("filterType")
                || !FilterType.hasOwnProperty(params.filterType)) {
                // one invalid ? all rejected.
                return;
            }

            if (!params.hasOwnProperty("filterId") || params.filterId == null) {
                params.filterId = randomID();
            }

            if (!params.hasOwnProperty("enabled") || !(typeof params.enabled === "boolean")) {
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

        if (!(actualFlags == null)) {
            newFlags = actualFlags.concat(newFlags);
        }

        await placeable._TMFXsetFlag(newFlags);
    }

    async function addUpdateFilters(placeable, paramsArray) {

        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        var flags = placeable.getFlag("tokenmagic", "filters");
        var workingFlags = [];
        if (flags) {
            flags.forEach(flag => {
                workingFlags.push(duplicate(flag));
            });
        }

        var newFlags = [];
        var updateParams;

        for (const params of paramsArray) {

            updateParams = false;

            workingFlags.forEach(flag => {
                if (flag.tmFilters.tmFilterId === params.filterId
                    && flag.tmFilters.tmFilterType === params.filterType) {
                    if (flag.tmFilters.hasOwnProperty("tmParams")) {
                        objectAssign(flag.tmFilters.tmParams, params);
                        updateParams = true;
                    }
                }
            });

            if (!updateParams) {
                if (!params.hasOwnProperty("filterType")
                    || !FilterType.hasOwnProperty(params.filterType)) {
                    // one invalid ? all rejected (even the update)
                    return;
                }

                if (!params.hasOwnProperty("filterId") || params.filterId == null) {
                    params.filterId = randomID();
                }

                if (!params.hasOwnProperty("enabled") || !(typeof params.enabled === "boolean")) {
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

        if (newFlags.length > 0) {
            workingFlags = newFlags.concat(workingFlags);
        }

        await placeable._TMFXsetFlag(workingFlags);
    };

    async function updateFilters(paramsArray) {
        if (params == null
            || !params.hasOwnProperty("filterId")) {
            return;
        }
        var placeableIdSet = new Set();
        var animations = Anime.getAnimeMap();
        if (animations.size <= 0) { return; }

        animations.forEach((anime, id) => {
            var filterIdMatch = (params) => params.filterId === anime.puppet.filterId;
            if (paramsArray.some(filterIdMatch)) {
                placeableIdSet.add(anime.puppet.placeableId);
            }
        });

        if (placeableIdSet.size <= 0) { return; }

        for (const placeableId of placeableIdSet) {
            // we must browse the collection of placeables whatever their types
            // we have just a filterId.
            var placeable = getPlaceableById(placeableId, PlaceableType.TOKEN);
            if (placeable == null) {
                placeable = getPlaceableById(placeableId, PlaceableType.TEMPLATE);
            }
            if (placeable == null) {
                placeable = getPlaceableById(placeableId, PlaceableType.TILE);
            }
            if (placeable == null) {
                placeable = getPlaceableById(placeableId, PlaceableType.DRAWING);
            }
            if (!(placeable == null) && placeable instanceof PlaceableObject) {
                await updateFiltersByPlaceable(placeable, paramsArray);
            }
        }
    };

    async function updateFiltersOnSelected(paramsArray) {
        var placeables = getControlledPlaceables();

        if (placeables == null || placeables.length < 1) { return; }
        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }
        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        for (const placeable of placeables) {
            await updateFiltersByPlaceable(placeable, paramsArray);
        }
    }

    async function updateFiltersOnTargeted(paramsArray) {
        var targeted = getTargetedTokens();

        if (targeted == null || targeted.length < 1) { return; }

        if (typeof paramsArray === "string") {
            paramsArray = getPreset(paramsArray);
        }

        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        for (const token of targeted) {
            await updateFiltersByPlaceable(token, paramsArray);
        }
    }

    async function updateFiltersByPlaceable(placeable, paramsArray) {

        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        var flags = placeable.getFlag("tokenmagic", "filters");
        if (flags == null || !flags instanceof Array || flags.length < 1) { return; } // nothing to update...

        var workingFlags = new Array();
        flags.forEach(flag => {
            workingFlags.push(duplicate(flag));
        });

        for (const params of paramsArray) {
            workingFlags.forEach(flag => {
                if (flag.tmFilters.tmFilterId === params.filterId
                    && flag.tmFilters.tmFilterType === params.filterType) {
                    if (flag.tmFilters.hasOwnProperty("tmParams")) {
                        objectAssign(flag.tmFilters.tmParams, params);
                    }
                }
            });
        }
        await placeable._TMFXsetFlag(workingFlags);
    }

    // Deleting filters on targeted tokens
    async function deleteFiltersOnTargeted(filterId = null) {
        var targeted = getTargetedTokens();
        if (!(targeted == null) && targeted.length > 0) {

            for (const token of targeted) {
                await deleteFilters(token, filterId);
            }
        }
    };

    // Deleting filters on selected placeable(s)
    async function deleteFiltersOnSelected(filterId = null) {
        var placeables = getControlledPlaceables();
        if (!(placeables == null) && placeables.length > 0) {

            for (const placeable of placeables) {
                await deleteFilters(placeable, filterId);
            }
        }
    };

    // Deleting all filters on a placeable in parameter
    async function deleteFilters(placeable, filterId = null) {
        if (placeable == null) { return; }

        if (filterId == null) await placeable._TMFXunsetFlag();
        else if (typeof filterId === "string") {

            var flags = placeable.getFlag("tokenmagic", "filters");
            if (flags == null || !flags instanceof Array || flags.length < 1) { return; } // nothing to delete...

            var workingFlags = new Array();
            flags.forEach(flag => {
                if (flag.tmFilters.tmFilterId != filterId) {
                    workingFlags.push(duplicate(flag));
                }
            });

            if (workingFlags.length > 0) await placeable._TMFXsetFlag(workingFlags);
            else await placeable._TMFXunsetFlag();
        }
    };

    function hasFilterType(placeable, filterType) {
        if (placeable == null
            || filterType == null
            || !(placeable instanceof PlaceableObject)) { return null; }

        var flags = placeable.getFlag("tokenmagic", "filters");
        if (flags == null || !flags instanceof Array || flags.length < 1) { return false; }

        const found = flags.find(flag => flag.tmFilters.tmFilterType === filterType);
        if (found === undefined) {
            return false;
        }
        return true;
    };

    function hasFilterId(placeable, filterId) {
        if (placeable == null
            || !(placeable instanceof PlaceableObject)) { return null; }
        var flags = placeable.getFlag("tokenmagic", "filters");
        return _checkFilterId(placeable, filterId, flags);
    };

    function _checkFilterId(placeable, filterId, flags) {
        if (placeable == null
            || filterId == null
            || !(placeable instanceof PlaceableObject)) { return null; }

        if (flags == null || !flags instanceof Array || flags.length < 1) { return false; }

        const found = flags.find(flag => flag.tmFilters.tmFilterId === filterId);
        if (found === undefined) {
            return false;
        }
        return true;
    }

    function setFilter(placeable, filter, params = {}) {

        params.placeableId = placeable.id;
        params.placeableType = placeable._TMFXgetPlaceableType();
        placeable._TMFXsetRawFilters(filter);
    };

    function _assignFilters(placeable, filters) {
        if (filters == null || placeable == null) { return; }
        // Assign all filters to the placeable
        filters.forEach((filterInfo) => {
            _assignFilter(placeable, filterInfo);
        });
    };

    function _assignFilter(placeable, filterInfo) {
        if (filterInfo == null) { return; }
        var workingFilterInfo = duplicate(filterInfo);
        workingFilterInfo.tmFilters.tmParams.placeableId = placeable.id;
        var filter = new FilterType[workingFilterInfo.tmFilters.tmFilterType](workingFilterInfo.tmFilters.tmParams);
        setFilter(placeable, filter, filterInfo.tmFilters.tmParams);
    }

    function _loadFilters(placeables) {
        if (!(placeables == null)) {
            placeables.forEach((placeable) => {
                _singleLoadFilters(placeable);
            });
        }
    };

    function _singleLoadFilters(placeable) {

        var updateData = placeable.getFlag("tokenmagic", "templateData");
        if (!(updateData == null)) {
            placeable._TMFXgetSprite().alpha = updateData.opacity;
        }

        var filters = placeable.getFlag("tokenmagic", "filters");
        if (!(filters == null)) {
            _assignFilters(placeable, filters);
        }
        placeable.loadingRequest = false;
    };

    function _fxPseudoEqual(flagObject, filterObject) {

        function isObject(object) {
            return object != null && typeof object === 'object';
        };

        const flagKeys = Object.keys(flagObject);

        for (const flagKey of flagKeys) {

            const flagValue = flagObject[flagKey];
            const filterValue = filterObject[flagKey];
            const areObjects = isObject(flagValue) && isObject(filterValue);

            if (areObjects && !_fxPseudoEqual(flagValue, filterValue)) {
                return false;
            }

            // handling the Infinity exception with loops... thanks to JSON serialization...
            if (!areObjects && flagKey === "loops" && flagValue === null) {
                flagValue = Infinity; // not nice, but works ! :-)=
            }

            if (!areObjects && flagValue !== filterValue) {
                return false;
            }
        }
        return true;
    };

    function _updateTemplateData(data, options, placeableType) {
        if (!options.hasOwnProperty("flags") || !options.flags.hasOwnProperty("tokenmagic")) { return; }
        if (data == null || !data.hasOwnProperty("_id")) { return; }

        var placeable = getPlaceableById(data._id, placeableType);
        if (placeable == null) { return; }

        var updateData = placeable.getFlag("tokenmagic", "templateData");
        if (!(updateData == null)) {
            placeable._TMFXgetSprite().alpha = updateData.opacity;
        }
    }

    function _updateFilters(data, options, placeableType) {
        if (!(options.hasOwnProperty("flags")
            && options.flags.hasOwnProperty("tokenmagic")
            && (options.flags.tokenmagic.hasOwnProperty("filters")
                || options.flags.tokenmagic.hasOwnProperty("-=filters")))) { return; }
        if (data == null || !data.hasOwnProperty("_id")) { return; }

        var placeable = getPlaceableById(data._id, placeableType);
        if (placeable == null) { return; }

        // Shortcut when all filters are deleted
        if (options.flags.tokenmagic.hasOwnProperty("-=filters")) {
            Anime.removeAnimation(data._id);                // removing animations on this placeable
            this._clearImgFiltersByPlaceable(placeable);    // clearing the filters (owned by tokenmagic)
            return;
        }

        var filters = placeable.getFlag("tokenmagic", "filters");
        if (filters == null) { return; }

        // Handling deleted filters
        for (let anime of Anime.getAnimeMap().values()) {
            var foundFilter = false;
            filters.forEach((filterFlag) => {
                if (anime.puppet.filterId === filterFlag.tmFilters.tmFilterId
                    && anime.puppet.filterInternalId === filterFlag.tmFilters.tmFilterInternalId
                    && anime.puppet.placeableId === filterFlag.tmFilters.tmParams.placeableId) {
                    foundFilter = true;
                }
            });

            if (!foundFilter) {
                Anime.removeAnimationByFilterId(data._id, anime.puppet.filterId);
                this._clearImgFiltersByPlaceable(placeable, anime.puppet.filterId);
            }
        }

        filters.forEach((filterFlag) => {
            if (filterFlag.tmFilters.hasOwnProperty("tmParams")) {
                var puppets = Anime.getPuppetsByParams(filterFlag.tmFilters.tmParams);
                if (puppets.length > 0) {
                    // Handling modified filters
                    for (const puppet of puppets) {
                        if (!_fxPseudoEqual(filterFlag.tmFilters.tmParams, puppet)) {
                            puppet.setTMParams(duplicate(filterFlag.tmFilters.tmParams));
                            puppet.normalizeTMParams();
                        }
                    }
                } else {
                    // Handling new filters
                    _assignFilter(placeable, filterFlag);
                }

            }
        });
    };

    function _clearImgFiltersByPlaceable(placeable, filterId = null) {

        if (placeable == null) { return; }

        var filterById = (filterId != null && typeof filterId === "string");

        function filterTheFiltering(theFilters) {
            if (theFilters instanceof Array) {
                var tmFilters = theFilters.filter(filter =>
                    filterById
                        ? !(filter.hasOwnProperty("filterId") && filter.filterId === filterId)
                        : !filter.hasOwnProperty("filterId")
                );
                return (tmFilters.length === 0 ? null : tmFilters);
            }
            return theFilters;
        };

        var sprite = placeable._TMFXgetSprite();
        if (sprite != null) {
            sprite.filters = filterTheFiltering(sprite.filters);
        }
    };

    async function _importContent(content, options = {}) {

        options.overwrite = game.settings.get("tokenmagic", "importOverwrite");

        ///////////////////////////////////////////////
        // Checking the imported object format

        log("import -> checking import file format...");
        if (!(content instanceof Array) || content.length < 1) {
            error("import -> file format check KO !");
            error(i18n("TMFX.preset.import.format.failure"));
            return false;
        }
        log("import -> file format check OK !");
        // check object format end
        /////////////////////////////////////////////////

        var check = true;

        ///////////////////////////////////////////////
        // Checking the imported content
        log("import -> checking import file content...");
        for (const element of content) {
            if (element.hasOwnProperty("name")
                && typeof element.name === "string"
                && element.hasOwnProperty("params")
                && element.params instanceof Array) {

                for (const effect of element.params) {
                    if (!(effect.hasOwnProperty("filterType")
                        && FilterType.hasOwnProperty(effect.filterType))) {
                        check = false;
                        break;
                    }
                }
                if (!check) break;
            } else {
                check = false;
                break;
            }
        }

        if (!check) {
            error("import -> file content check KO !");
            error(i18n("TMFX.preset.import.format.failure"));
            return false;
        }
        log("import -> file content check OK !");

        // check content end
        /////////////////////////////////////////////////

        // The preset libray must be replaced ?
        if (options.hasOwnProperty("replaceLibrary")
            && options.replaceLibrary) {
            await game.settings.set("tokenmagic", "presets", content);
            log("import -> preset library replaced");
            log(i18n("TMFX.preset.import.success"));
            return true;
        }

        var pst = game.settings.get("tokenmagic", "presets");
        var it = 0;
        for (const element of content) {
            const preset = pst.find(el => el.name === element.name);
            if (preset == null) {
                log("import -> add: " + element.name);
                pst.push(element);
                it++;
            } else {
                if (options.hasOwnProperty("overwrite")
                    && options.overwrite) {
                    const index = pst.indexOf(preset);
                    if (index > -1) {
                        log("import -> overwrite: " + element.name);
                        pst[index] = element;
                        it++;
                    }
                } else {
                    warn("import -> ignored: " + element.name + " -> already exists");
                }
            }
        }

        await game.settings.set("tokenmagic", "presets", pst);
        log("import -> " + it + " preset(s) added to the library");
        log(i18n("TMFX.preset.import.success"));
        return true;
    }

    async function resetPresetLibrary() {
        if (!game.user.isGM) return;

        if (confirm(i18n("TMFX.preset.reset.message"))) {
            try {
                await game.settings.set("tokenmagic", "presets", defaultPresets);
                ui.notifications.info(i18n("TMFX.preset.reset.success"));
            } catch (e) {
                error(e.message);
            }
        }
    }

    async function importPresetLibraryFromURL(url) {
        try {
            $.getJSON(url, async function (content) {
                return await _importContent(content);
            });
        } catch (e) {
            error(e.message);
            error(i18n("TMFX.preset.import.failure"));
            return false;
        }
    }

    async function importPresetLibraryFromPath(path) {
        try {
            const response = await fetch(path);
            const content = await response.json();

            return await _importContent(content);

        } catch (e) {
            error(e.message);
            error(i18n("TMFX.preset.import.failure"));
            return false;
        }
    };

    async function importPresetLibrary() {
        const path = '/modules/tokenmagic/import';
        new FilePicker({
            type: "json",
            current: path,
            callback: importPresetLibraryFromPath,
        }).browse();
    }

    function exportPresetLibrary(exportName = "token-magic-fx-presets") {
        var pst = game.settings.get("tokenmagic", "presets");
        if (pst == null || typeof pst !== "object") return false;
        exportObjectAsJson(pst, exportName);
    }

    function getPresets(libraryName = PresetsLibrary.MAIN) {
        var pst = game.settings.get("tokenmagic", "presets");
        if (pst == null || typeof pst !== "object") return [];
        return pst.filter(preset => preset.library === libraryName);
    };

    function _getPresetTemplateDefaultTexture(presetName, presetLibrary) {
        var pst = game.settings.get("tokenmagic", "presets");
        const preset = pst.find(el => el['name'] === presetName && el['library'] === PresetsLibrary.TEMPLATE);
        if (!(preset == null) && preset.hasOwnProperty("defaultTexture")) return preset.defaultTexture;
        else return null;
    }

    function getPreset(presetName) {

        let pName = null, pLibrary = null;
        let argIsObj = (presetName instanceof Object);
        const { name, library, ...adjustmentProp } = argIsObj ? presetName : {};
        if (argIsObj) {
            if (presetName.hasOwnProperty("name")) {
                pName = presetName.name;
            }
            if (presetName.hasOwnProperty("library")) {
                pLibrary = presetName.library;
            }
        } else {
            pName = presetName;
        }

        if (pLibrary == null || typeof pLibrary !== "string") {
            pLibrary = PresetsLibrary.MAIN;
        }

        if (typeof pName !== "string") return undefined;

        var pst = game.settings.get("tokenmagic", "presets");
        if (pst == null || typeof pst !== "object") return undefined;

        const preset = pst.find(el => el['name'] === pName && el['library'] === pLibrary);
        if (!(preset == null)
            && preset.hasOwnProperty("params")
            && preset.params instanceof Array) {
            for (const [filterProp, filterPropVal] of Object.entries(adjustmentProp)) {
                //log(`getPreset ${filterProp}: ${filterPropVal}`);
                for (const param of preset.params) {
                    if (param.hasOwnProperty(filterProp)) {
                        param[filterProp] = filterPropVal;
                    }
                }
            }
            return preset.params;
        }
        return undefined;
    };

    async function deletePreset(presetName, silent = false) {
        if (!game.user.isGM) {
            if (!silent) ui.notifications.warn(i18n("TMFX.preset.delete.permission.failure"));
            return false;
        }

        let pName = null, pLibrary = null;

        if (presetName instanceof Object) {
            if (presetName.hasOwnProperty("name")) {
                pName = presetName.name;
            }
            if (presetName.hasOwnProperty("library")) {
                pLibrary = presetName.library;
            }
        } else {
            pName = presetName;
        }

        if (pLibrary == null || typeof pLibrary !== "string") {
            pLibrary = PresetsLibrary.MAIN;
        }

        if (typeof pName !== "string") {
            if (!silent) ui.notifications.error(i18n("TMFX.preset.delete.params.failure"));
            return false;
        }

        var pst = game.settings.get("tokenmagic", "presets");
        if (pst == null) {
            if (!silent) ui.notifications.warn(i18n("TMFX.preset.delete.empty.failure"));
            return false;
        }

        var state = true;
        const preset = pst.find(el => el['name'] === pName && el['library'] === pLibrary);

        if (preset == null) {
            if (!silent) ui.notifications.warn(i18n("TMFX.preset.delete.notfound.failure"));
            state = false;
        } else {
            const index = pst.indexOf(preset);
            if (index > -1) {
                pst.splice(index, 1);
                try {
                    await game.settings.set("tokenmagic", "presets", pst);
                    if (!silent) ui.notifications.info(i18n("TMFX.preset.delete.success"));
                } catch (e) {
                    if (!silent) ui.notifications.error(e.message);
                    console.error(e);
                    state = false;
                }
            }
        }
        return state;
    }

    async function addPreset(presetName, params, silent = false) {
        if (!game.user.isGM) {
            if (!silent) ui.notifications.warn(i18n("TMFX.preset.add.permission.failure"));
            return false;
        }

        let pName = null, pLibrary = null;
        if (presetName instanceof Object) {
            if (presetName.hasOwnProperty("name")) {
                pName = presetName.name;
            }
            if (presetName.hasOwnProperty("library")) {
                pLibrary = presetName.library;
            }
        } else {
            pName = presetName;
        }

        if (pLibrary == null || typeof pLibrary !== "string") {
            pLibrary = PresetsLibrary.MAIN;
        }

        if (typeof pName !== "string"
            && !(params instanceof Array)) {
            if (!silent) ui.notifications.error(i18n("TMFX.preset.add.params.failure"));
            return false;
        }

        for (const param of params) {
            param.filterId = pName;
        }

        var pst = game.settings.get("tokenmagic", "presets");
        var presetObject = {};
        presetObject.name = pName;
        presetObject.library = pLibrary;
        presetObject.params = params;

        var state = true;
        if (pst == null) {
            pst = [presetObject];
        } else {
            const preset =
                pst.find(el => el['name'] === pName && el['library'] === pLibrary);
            if (preset == null) pst.push(presetObject);
            else {
                if (!silent) ui.notifications.warn(i18n("TMFX.preset.add.duplicate.failure"));
                state = false;
            }
        }

        if (state) {
            try {
                await game.settings.set("tokenmagic", "presets", pst);
                if (!silent) ui.notifications.info(i18n("TMFX.preset.add.success"));
            } catch (e) {
                if (!silent) ui.notifications.error(e.message);
                console.error(e);
                state = false;
            }
        }
        return state;
    };

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
        exportPresetLibrary: exportPresetLibrary,
        importPresetLibrary: importPresetLibrary,
        importPresetLibraryFromURL: importPresetLibraryFromURL,
        importPresetLibraryFromPath: importPresetLibraryFromPath,
        resetPresetLibrary: resetPresetLibrary,
        getPresets: getPresets,
        getPreset: getPreset,
        addPreset: addPreset,
        deletePreset: deletePreset,
        _assignFilters: _assignFilters,
        _loadFilters: _loadFilters,
        _clearImgFiltersByPlaceable: _clearImgFiltersByPlaceable,
        _getAnimeMap: Anime.getAnimeMap,
        _updateFilters: _updateFilters,
        _updateTemplateData: _updateTemplateData,
        _singleLoadFilters: _singleLoadFilters,
        _cachedFilters: _cachedFilters,
        _checkFilterId: _checkFilterId,
        _getPresetTemplateDefaultTexture: _getPresetTemplateDefaultTexture,
    };
}

export const Magic = TokenMagic();

async function cacheFilters() {
    // Only caching filters with heavy shaders that takes time to compile
    // https://www.html5gamedevs.com/topic/43652-shader-compile-performance/
    let params =
    {
        filterType: "field",
        enabled: true,
        dummy: true
    };
    Magic._cachedFilters.filterForceField = new FilterForceField(params);

    params.filterType = "electric";
    Magic._cachedFilters.filterElectric = new FilterElectric(params);

    params.filterType = "xglow";
    Magic._cachedFilters.filterGleamingGlow = new FilterGleamingGlow(params);

    params.filterType = "fire";
    Magic._cachedFilters.filterFire = new FilterFire(params);

    params.filterType = "smoke";
    Magic._cachedFilters.filterSmoke = new FilterSmoke(params);

    params.filterType = "images";
    Magic._cachedFilters.filterImages = new FilterMirrorImages(params);
}

function initSocketListener() {

    // Activate the listener only for the One
    const theOne = game.users.find((user) => user.isGM && user.active);
    if (theOne && game.user !== theOne) {
        return;
    }

    // Listener the listening
    game.socket.on(moduleTM, async (data) => {

        if (data == null || !data.hasOwnProperty("tmAction")) { return; }

        switch (data.tmAction) {
            case SocketAction.SET_FLAG:
                // getting the scene coming from the socket
                var scene = game.scenes.get(data.tmViewedScene);
                if (scene == null) return;

                // preparing flag data (with -= if the data is null)
                var updateData;
                if (data.tmFlag == null) updateData = { [`flags.tokenmagic.-=filters`]: null }
                else updateData = { [`flags.tokenmagic.filters`]: data.tmFlag };
                updateData["_id"] = data.tmPlaceableId;

                // updating the placeable in the scene
                await scene.updateEmbeddedEntity(data.tmPlaceableType, updateData);
                break;
        }
    });
};

function initFurnaceDrawingsException() {
    if (isFurnaceDrawingsActive) {
        DrawingConfig.prototype.refresh = (function () {
            const cachedDCR = DrawingConfig.prototype.refresh;
            return async function (html) {

                // Clear animations and filters if needed
                let tmfxUpdate = false;
                if (this.object.data.hasOwnProperty("flags")
                    && this.object.data.flags.hasOwnProperty("tokenmagic")
                    && this.object.data.flags.tokenmagic.hasOwnProperty("filters")) {
                    tmfxUpdate = true;
                    Anime.removeAnimation(this.object.id);
                    Magic._clearImgFiltersByPlaceable(this.object);
                }

                // Furnace function apply (updating data and full redraw : destruction/reconstruction)
                cachedDCR.apply(this, arguments);

                // Reapply the filters if needed
                if (tmfxUpdate) {
                    Magic._singleLoadFilters(this.object);
                }

            };
        })();
    }
}

async function requestLoadFilters(placeable, startTimeout = 0) {
    var reqTimer;
    placeable.loadingRequest = true;

    function launchRequest(placeable) {
        reqTimer = setTimeout(() => {
            if (placeable == null) return;
            var check = placeable._TMFXcheckSprite();
            if (check == null) {
                placeable.loadingRequest = false;
                return;
            }
            else if (check) Magic._singleLoadFilters(placeable);
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
};

function onMeasuredTemplateConfig(data, html) {

    function compare(a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    }

    const tmTemplate = data.object;
    var opacity = tmTemplate.template.alpha;
    var tint = "";

    // getting custom data
    var tmfxTemplateData = tmTemplate.getFlag("tokenmagic", "templateData");
    if (!(tmfxTemplateData == null) && tmfxTemplateData instanceof Object) {
        opacity = tmTemplate.data.tmfxTextureAlpha = tmfxTemplateData.opacity;
        tint = tmTemplate.data.tmfxTint = (tmfxTemplateData.tint ? PIXI.utils.hex2string(tmfxTemplateData.tint) : "");
    }
    var flag = tmTemplate.getFlag("tokenmagic", "filters");
    var presets = Magic.getPresets(PresetsLibrary.TEMPLATE);

    // forming our injected html
    var tmfxValues;
    var selected = '';
    tmfxValues += '<option value="NOFX">-- No FX --</option>';
    presets.sort(compare).forEach(preset => {
        if (flag) (Magic._checkFilterId(tmTemplate, preset.name, flag) ? selected = ' selected' : selected = '');
        tmfxValues += `<option value="TMFX_${preset.name}"${selected}>${preset.name}</option>`;
    });

    var divPreset = `
    <div class="form-group">
        <label>${i18n('TMFX.template.opacity')}</label>
        <div class="form-fields">
            <input type="range" name="tmfxTextureAlpha" value="${opacity}" min="0.0" max="1.0" step="0.05" data-dtype="Number"/>
            <span class="range-value">${opacity}</span>
        </div>
    </div>

    <div class="form-group">
        <label>${i18n('TMFX.template.fx')}</label>
        <select class="tmfx" name="tmfxPreset" data-dtype="String">
        ${tmfxValues}
        </select>
    </div>

    <div class="form-group">
        <label>${i18n('TMFX.template.tint')}</label>
        <div class="form-fields">
            <input class="color" type="text" name="tmfxTint" value="${tint}"/>
            <input type="color" value="${tint}" data-edit="tmfxTint"/>
        </div>
    </div>
    `;

    // injecting
    const htmlForm = html.find('.form-group');
    htmlForm.last().after(divPreset);

    $(html).css({ 'min-height': '490px' });
}

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("ready", () => {
    log("Hook -> ready");
    tmfxDataMigration();
    initSocketListener();
    initFurnaceDrawingsException();
    window.TokenMagic = Magic;
    Hooks.on("renderMeasuredTemplateConfig", onMeasuredTemplateConfig);
});

Hooks.on("canvasInit", (canvas) => {
    log("Hook -> canvasInit");
    autosetPaddingMode();
    Anime.desactivateAnimation();
    Anime.resetAnimation();
});

Hooks.once("canvasReady", (canvas) => {
    //log("Init -> canvasReady -> caching shaders");
    cacheFilters();
});

Hooks.on("canvasReady", (canvas) => {
    log("Hook -> canvasReady");

    if (!window.hasOwnProperty("TokenMagic")) {
        window.TokenMagic = Magic;
    }
    if (canvas == null) { return; }

    var tokens = canvas.tokens.placeables;
    Magic._loadFilters(tokens);
    var tiles = canvas.tiles.placeables;
    Magic._loadFilters(tiles);
    var drawings = canvas.drawings.placeables;
    Magic._loadFilters(drawings);
    var templates = canvas.templates.placeables;
    Magic._loadFilters(templates);

    Anime.activateAnimation();
});

Hooks.on("deleteScene", (scene, data, options) => {
    //log("Hook -> deleteScene");

    if (!(scene == null) && scene.id === game.user.viewedScene) {
        Anime.desactivateAnimation();
        Anime.resetAnimation();
    }
});

Hooks.on("deleteToken", (parent, doc, options, userId) => {
    //log("Hook -> deleteToken");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("createToken", (scene, data, options) => {
    //log("Hook -> createToken");

    if (!(scene == null)
        && scene.id === game.user.viewedScene
        && data.hasOwnProperty("flags")
        && data.flags.hasOwnProperty("tokenmagic")
        && data.flags.tokenmagic.hasOwnProperty("filters")) {

        var placeable = getPlaceableById(data._id, PlaceableType.TOKEN);

        // request to load filters (when pixi containers are ready)
        requestLoadFilters(placeable, 250);
    }
});

Hooks.on("createTile", (scene, data, options) => {
    //log("Hook -> createTile");

    if (!(scene == null)
        && scene.id === game.user.viewedScene
        && data.hasOwnProperty("flags")
        && data.flags.hasOwnProperty("tokenmagic")
        && data.flags.tokenmagic.hasOwnProperty("filters")) {

        var placeable = getPlaceableById(data._id, PlaceableType.TILE);

        // request to load filters (when pixi containers are ready)
        requestLoadFilters(placeable, 250);
    }
});

Hooks.on("createDrawing", (scene, data, options) => {
    //log("Hook -> createDrawing");

    if (!(scene == null)
        && scene.id === game.user.viewedScene
        && data.hasOwnProperty("flags")
        && data.flags.hasOwnProperty("tokenmagic")
        && data.flags.tokenmagic.hasOwnProperty("filters")) {

        var placeable = getPlaceableById(data._id, PlaceableType.DRAWING);

        // request to load filters (when pixi containers are ready)
        requestLoadFilters(placeable, 250);
    }
});

Hooks.on("updateToken", (scene, data, options) => {
    //log("Hook -> updateToken");

    if (scene.id !== game.user.viewedScene) return;

    if (options.hasOwnProperty("img") || options.hasOwnProperty("tint")
        || options.hasOwnProperty("height") || options.hasOwnProperty("width")
        || options.hasOwnProperty("name")) {

        var placeable = getPlaceableById(data._id, PlaceableType.TOKEN);

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        // clearing the filters (owned by tokenmagic)
        Magic._clearImgFiltersByPlaceable(placeable);

        // querying filters reload (when pixi containers are ready)
        requestLoadFilters(placeable, 250);

    } else {
        Magic._updateFilters(data, options, PlaceableType.TOKEN);
    }
});

Hooks.on("deleteTile", (parent, doc, options, userId) => {
    //log("Hook -> deleteTile");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("updateTile", (scene, data, options) => {
    //log("Hook -> updateTile");

    if (scene.id !== game.user.viewedScene) return;

    if (options.hasOwnProperty("img") || options.hasOwnProperty("tint")) {

        var placeable = getPlaceableById(data._id, PlaceableType.TILE);

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        // querying filters reload (when pixi containers are ready)
        requestLoadFilters(placeable, 250);

    } else {
        Magic._updateFilters(data, options, PlaceableType.TILE);
    }
});

Hooks.on("deleteDrawing", (parent, doc, options, userId) => {
    //log("Hook -> deleteDrawing");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("updateDrawing", (scene, data, options, action) => {
    //log("Hook -> updateDrawing");

    if (scene.id !== game.user.viewedScene) return;

    if ((action.hasOwnProperty("diff") && action.diff
        && !(options.hasOwnProperty("flags") && options.flags.hasOwnProperty("tokenmagic")))
        || (options.hasOwnProperty("x") || options.hasOwnProperty("y"))) {

        var placeable = getPlaceableById(data._id, PlaceableType.DRAWING);

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        // clearing the filters (owned by tokenmagic)
        Magic._clearImgFiltersByPlaceable(placeable);

        // querying filters reload (when pixi containers are ready)
        requestLoadFilters(placeable, 250);

    } else {
        Magic._updateFilters(data, options, PlaceableType.DRAWING);
    }
});

Hooks.on("preUpdateMeasuredTemplate", async (scene, measuredTemplate, updateData, options) => {
    //log("Hook -> preUpdateMeasuredTemplate");

    function getTint() {
        if (updateData.hasOwnProperty("tmfxTint")) {
            return updateData.tmfxTint;
        } else if (measuredTemplate.hasOwnProperty("tmfxTint")) {
            return measuredTemplate.tmfxTint;
        } else return "";
    }

    function getFX() {
        if (updateData.hasOwnProperty("tmfxPreset")) {
            return updateData.tmfxPreset;
        } else if (measuredTemplate.hasOwnProperty("tmfxPreset")) {
            return measuredTemplate.tmfxPreset;
        } else return "NOFX";
    }

    function getDirection() {
        if (updateData.hasOwnProperty("direction")) {
            return updateData.direction;
        } else if (measuredTemplate.hasOwnProperty("direction")) {
            return measuredTemplate.direction;
        } else return 0;
    }

    function getAngle() {
        if (updateData.hasOwnProperty("angle")) {
            return updateData.angle;
        } else if (measuredTemplate.hasOwnProperty("angle")) {
            return measuredTemplate.angle;
        } else return 0;
    }

    function getShapeType() {
        if (updateData.hasOwnProperty("t")) {
            return updateData.t;
        } else if (measuredTemplate.hasOwnProperty("t")) {
            return measuredTemplate.t;
        } else return "ITSBAD";
    }

    function getAnchorFromDirection() {

        let shapeType = getShapeType();
        if (shapeType === "circle" || shapeType === "rect") return { x: 0.5, y: 0.5 };

        // Compute emanation anchor point from the orthonormal bounding rect containing the polygon. 
        let direction = getDirection();
        let angle = getAngle();

        let dirRad = direction * Math.PI / 180;
        let angleRad = angle * Math.PI / 180;

        let cosRa1 = Math.cos(dirRad - (angleRad / 2));
        let rsinRa1 = -Math.sin(dirRad - (angleRad / 2));
        let cosRa2 = Math.cos(dirRad + (angleRad / 2));
        let rsinRa2 = -Math.sin(dirRad + (angleRad / 2));

        let x = 0, y = 1;

        if (cosRa1 < 0 && cosRa2 < 0) {
            x = 1;
        } else if (cosRa1 < 0 || cosRa2 < 0) {
            x = (Math.sin(-dirRad - (Math.PI / 2)) + 1) / 2;
        }

        if (rsinRa1 < 0 && rsinRa2 < 0) {
            y = 0;
        } else if (rsinRa1 < 0 || rsinRa2 < 0) {
            y = (Math.cos(-dirRad - (Math.PI / 2)) + 1) / 2;
        }

        return { x: x, y: y };
    }

    let measuredTemplateInstance = canvas.templates.get(measuredTemplate._id);
    let templateTint = getTint();
    let updateTmfxData = {};
    let presetUpdate = updateData.hasOwnProperty("tmfxPreset");
    let tintUpdate = updateData.hasOwnProperty("tmfxTint");
    let textureUpdate = updateData.hasOwnProperty("tmfxTextureAlpha");
    let directionUpdate = updateData.hasOwnProperty("direction");
    let angleUpdate = updateData.hasOwnProperty("angle");
    let typeUpdate = updateData.hasOwnProperty("t");

    if (textureUpdate)
        updateTmfxData.opacity = updateData.tmfxTextureAlpha;

    if (tintUpdate)
        updateTmfxData.tint = (templateTint !== '' ? colorStringToHex(templateTint) : null);

    if (Object.keys(updateTmfxData).length > 0)
        await measuredTemplateInstance.setFlag("tokenmagic", "templateData", updateTmfxData);

    if (presetUpdate || tintUpdate
        || directionUpdate || typeUpdate || angleUpdate) {

        let templateFX = getFX();
        if (templateFX !== "NOFX") {
            let anchor = getAnchorFromDirection();
            let presetOptions =
            {
                name: templateFX.slice(5),
                library: PresetsLibrary.TEMPLATE,
                anchorX: anchor.x,
                anchorY: anchor.y
            };
            if (templateTint !== "") {
                presetOptions.color = colorStringToHex(templateTint);
            }
            var preset = Magic.getPreset(presetOptions);
            if (!(preset == null)) {
                if (presetUpdate) setTimeout(() => { measuredTemplateInstance.TMFXaddFilters(preset, true) }, 150);
                else setTimeout(() => { measuredTemplateInstance.TMFXaddUpdateFilters(preset) }, 150);
            }
        }
        else setTimeout(() => { measuredTemplateInstance.TMFXdeleteFilters() }, 150);
    }
});

Hooks.on("updateMeasuredTemplate", (scene, data, options) => {
    //log("Hook -> updateMeasuredTemplate");

    if (scene.id !== game.user.viewedScene) return;

    var placeable = getPlaceableById(data._id, PlaceableType.TEMPLATE);
    if (options.hasOwnProperty("texture")) {
        //var placeable = getPlaceableById(data._id, PlaceableType.TEMPLATE);

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        // clearing the filters (owned by tokenmagic)
        Magic._clearImgFiltersByPlaceable(placeable);

        // querying filters reload (when pixi containers are ready)
        requestLoadFilters(placeable, 250);

    } else {
        if (!placeable.loadingRequest) {
            Magic._updateFilters(data, options, PlaceableType.TEMPLATE);
            Magic._updateTemplateData(data, options, PlaceableType.TEMPLATE);
        }
    }
});

Hooks.on("deleteMeasuredTemplate", (parent, doc, options, userId) => {
    //log("Hook -> deleteMeasuredTemplate");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("createMeasuredTemplate", (scene, data, options) => {
    //log("Hook -> createMeasuredTemplate");

    if (!(scene == null)
        && scene.id === game.user.viewedScene
        && data.hasOwnProperty("flags")
        && data.flags.hasOwnProperty("tokenmagic")
        && data.flags.tokenmagic.hasOwnProperty("filters")) {

        var placeable = getPlaceableById(data._id, PlaceableType.TEMPLATE);

        // request to load filters (when pixi containers are ready)
        requestLoadFilters(placeable, 250);
    }
});

Hooks.on("closeSettingsConfig", () => {
    autosetPaddingMode();
});