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
import { Anime } from "../fx/Anime.js";
import "./proto/PlaceableObjectProto.js";

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
    xglow: FilterGleamingGlow
};

function i18n(key) {
    return game.i18n.localize(key);
}

export function registerSettings() {
    game.settings.register("tokenmagic", "useAdditivePadding", {
        name: i18n("TMFX.useMaxPadding.name"),
        hint: i18n("TMFX.useMaxPadding.hint"),
        scope: "world",
        config: true,
        default: true,
        type: Boolean
    });

    game.settings.register("tokenmagic", "minPadding", {
        name: i18n("TMFX.minPadding.name"),
        hint: i18n("TMFX.minPadding.hint"),
        scope: "world",
        config: true,
        default: 0,
        type: Number
    });
}

const sleep = m => new Promise(r => setTimeout(r, m));

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

export function autosetPaddingMode() {
    canvas.app.renderer.filter.useMaxPadding = !isAdditivePaddingConfig();
}

export function log(output) {
    let logged = "%cTokenMagic %c| " + output;
    console.log(logged, "color:#4BC470", "color:#B3B3B3");
}

export function getControlledPlaceables() {
    var controlled = [];
    switch (canvas.activeLayer.name) {
        case "TokenLayer":
            controlled = canvas.tokens.controlled;
            break;
        case "TilesLayer":
            controlled = canvas.tiles.controlled;
            break;
    }
    return controlled;
}

// Only for tokens
export function getTargetedTokens() {
    return canvas.tokens.placeables.filter(placeable => placeable.isTargeted);
}

export function getPlaceableById(id, type) {
    let placeable;
    let placeables;

    switch (type) {
        case "Token":
            placeables = canvas.tokens.placeables;
            break;
        case "Tile":
            placeables = canvas.tiles.placeables;
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

// NOTES FOR DEV : API will be extended in a near future, to allow more control over filters
export function TokenMagic() {

    // Add a filter on selected placeable(s)
    async function addFilterOnSelected(params) {
        if (params == null
            || !params.hasOwnProperty("filterType")
            || !FilterType.hasOwnProperty(params.filterType)) {
            return;
        }

        var controlled = getControlledPlaceables();

        if (!(controlled == null) && controlled.length > 0) {
            for (const placeable of controlled) {
                await addFilter(placeable, params);
            }
        }
    };

    async function addFiltersOnSelected(paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await addFilterOnSelected(params);
            }
        }
    };

    async function addFilterOnTargeted(params) {
        if (params == null
            || !params.hasOwnProperty("filterType")
            || !FilterType.hasOwnProperty(params.filterType)) {
            return;
        }

        var targeted = getTargetedTokens();

        if (!(targeted == null) && targeted.length > 0) {
            for (const token of targeted) {
                await addFilter(token, params);
            }
        }
    }

    async function addFiltersOnTargeted(paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await addFilterOnTargeted(params);
            }
        }
    }

    // Add a filter on a placeable
    async function addFilter(placeable, params) {
        if (placeable == null
            || params == null
            || !params.hasOwnProperty("filterType")
            || !FilterType.hasOwnProperty(params.filterType)) {
            return;
        }

        if (!params.hasOwnProperty("filterId") || params.filterId == null) {
            params.filterId = randomID();
        }

        if (!params.hasOwnProperty("enabled") || !typeof params.enabled === "boolean") {
            params.enabled = true;
        }

        params.placeableId = placeable.id;
        params.filterInternalId = randomID();
        params.filterOwner = game.data.userId;

        // TODO : to rework
        if (placeable instanceof Token) {
            params.placeableType = "Token";
        } else if (placeable instanceof Tile) {
            params.placeableType = "Tile";
        } else {
            params.placeableType = "";
        }

        var placeableNewFlag = [{
            tmFilters: {
                tmFilterId: params.filterId,
                tmFilterInternalId: params.filterInternalId,
                tmFilterType: params.filterType,
                tmFilterOwner: params.filterOwner,
                tmParams: params
            }
        }];

        var placeableFlag = null;
        var placeableActualFlag = placeable.getFlag("tokenmagic", "filters");

        if (placeableActualFlag == null) {
            placeableFlag = placeableNewFlag;
        } else {
            placeableFlag = placeableActualFlag.concat(placeableNewFlag);
        }

        await placeable.setFlag("tokenmagic", "filters", placeableFlag);
    };

    async function addUpdateFilters(placeable, paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await addUpdateFilter(placeable, params);
            }
        }
    };

    async function addUpdateFilter(placeable, params) {
        if (placeable == null
            || params == null
            || !params.hasOwnProperty("filterType")
            || !FilterType.hasOwnProperty(params.filterType)) {
            return;
        }

        if (params.hasOwnProperty("filterId") && placeable.TMFXhasFilterId(params.filterId)) {
            await updateFilterByPlaceable(params, placeable);
        } else {
            await addFilter(placeable, params);
        }
    };

    async function addFilters(placeable, paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await addFilter(placeable, params);
            }
        }
    };

    async function updateFilters(paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await updateFilter(params);
            }
        }
    }

    async function updateFilter(params) {
        if (params == null
            || !params.hasOwnProperty("filterId")) {
            return;
        }
        var placeableIdSet = new Set();
        var animations = Anime.getAnimeMap();
        if (animations.size <= 0) { return; }

        animations.forEach((anime, id) => {
            if (anime.puppet.filterId === params.filterId) {
                placeableIdSet.add(anime.puppet.placeableId);
            }
        });

        if (placeableIdSet.size <= 0) { return; }

        for (const placeableId of placeableIdSet) {
            // TODO : to improve
            var placeable = getPlaceableById(placeableId, "Token");
            if (placeable == null) {
                placeable = getPlaceableById(placeableId, "Tile");
            }
            if (!(placeable == null) && placeable instanceof PlaceableObject) {
                await updateFilterByPlaceable(params, placeable);
            }
        }
    };

    async function updateFiltersOnSelected(paramsArray) {
        var placeables = getControlledPlaceables();

        if (placeables == null || placeables.length < 1) { return; }
        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        for (const placeable of placeables) {
            for (const params of paramsArray) {
                await updateFilterByPlaceable(params, placeable);
            }
        }
    }

    async function updateFiltersOnTargeted(paramsArray) {
        var placeables = getTargetedTokens();

        if (placeables == null || placeables.length < 1) { return; }
        if (!paramsArray instanceof Array || paramsArray.length < 1) { return; }

        for (const placeable of placeables) {
            for (const params of paramsArray) {
                await updateFilterByPlaceable(params, placeable);
            }
        }
    }

    async function updateFiltersByPlaceable(placeable, paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await updateFilterByPlaceable(params, placeable);
            }
        }
    }

    async function updateFilterByPlaceable(params, placeable) {
        var flags = placeable.getFlag("tokenmagic", "filters");
        if (flags == null || !flags instanceof Array || flags.length < 1) { return; } // nothing to update...

        var workingFlags = new Array();
        flags.forEach(flag => {
            workingFlags.push(duplicate(flag));
        });

        workingFlags.forEach(flag => {
            if (flag.tmFilters.tmFilterId === params.filterId) {
                if (flag.tmFilters.hasOwnProperty("tmParams")) {
                    objectAssign(flag.tmFilters.tmParams, params);
                }
            }
        });
        await placeable.setFlag("tokenmagic", "filters", workingFlags);
    };


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

        if (filterId == null) {
            await placeable.unsetFlag("tokenmagic", "filters");
        } else if (typeof filterId === "string") {

            var flags = placeable.getFlag("tokenmagic", "filters");
            if (flags == null || !flags instanceof Array || flags.length < 1) { return; } // nothing to delete...

            var workingFlags = new Array();
            flags.forEach(flag => {
                if (flag.tmFilters.tmFilterId != filterId) {
                    workingFlags.push(duplicate(flag));
                }
            });

            if (workingFlags.length > 0) {
                await placeable.setFlag("tokenmagic", "filters", workingFlags);
            } else {
                await placeable.unsetFlag("tokenmagic", "filters");
            }
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
            || filterId == null
            || !(placeable instanceof PlaceableObject)) { return null; }

        var flags = placeable.getFlag("tokenmagic", "filters");
        if (flags == null || !flags instanceof Array || flags.length < 1) { return false; }

        const found = flags.find(flag => flag.tmFilters.tmFilterId === filterId);
        if (found === undefined) {
            return false;
        }
        return true;
    };

    // TODO : to improve
    function setFilter(placeable, filter, params = {}) {

        params.placeableId = placeable.id;

        if (placeable instanceof Token) {
            params.placeableType = "Token";
            if (placeable.icon.filters == null) {
                placeable.icon.filters = [filter];
            } else {
                placeable.icon.filters.push(filter);
            }
        } else if (placeable instanceof Tile) {
            params.placeableType = "Tile";
            if (placeable.tile.img.filters == null) {
                placeable.tile.img.filters = [filter];
            } else {
                placeable.tile.img.filters.push(filter);
            }
        }
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
                var filters = placeable.getFlag("tokenmagic", "filters");
                if (!(filters == null)) {
                    _assignFilters(placeable, filters);
                }
            });
        }
    };

    function _singleLoadFilters(placeable) {
        var filters = placeable.getFlag("tokenmagic", "filters");
        if (!(filters == null)) {
            _assignFilters(placeable, filters);
        }
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

    function _updateFilters(data, options, placeableType) {
        if (!options.hasOwnProperty("flags") || !options.flags.hasOwnProperty("tokenmagic")) { return; }
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

        // The clean up
        if (placeable instanceof Token) {
            placeable.icon.filters = filterTheFiltering(placeable.icon.filters);
        } else if (placeable instanceof Tile) {
            placeable.tile.img.filters = filterTheFiltering(placeable.tile.img.filters);
        }
    };

    return {
        addFilter: addFilter,
        addFilters: addFilters,
        addFilterOnSelected: addFilterOnSelected,
        addFiltersOnSelected: addFiltersOnSelected,
        addFiltersOnTargeted: addFiltersOnTargeted,
        addUpdateFilters: addUpdateFilters,
        addUpdateFilter: addUpdateFilter,
        deleteFilters: deleteFilters,
        deleteFiltersOnSelected: deleteFiltersOnSelected,
        deleteFiltersOnTargeted: deleteFiltersOnTargeted,
        updateFilter: updateFilter,
        updateFilters: updateFilters,
        updateFiltersOnSelected: updateFiltersOnSelected,
        updateFiltersOnTargeted: updateFiltersOnTargeted,
        updateFiltersByPlaceable: updateFiltersByPlaceable,
        updateFilterByPlaceable: updateFilterByPlaceable,
        hasFilterType: hasFilterType,
        hasFilterId: hasFilterId,
        _assignFilters: _assignFilters,
        _loadFilters: _loadFilters,
        _clearImgFiltersByPlaceable: _clearImgFiltersByPlaceable,
        _getAnimeMap: Anime.getAnimeMap,
        _updateFilters: _updateFilters,
        _singleLoadFilters: _singleLoadFilters,
    };
}

export const Magic = TokenMagic();

Hooks.once("init", () => {
    registerSettings();
});

Hooks.on("ready", () => {
    log("Hook -> ready");
    window.TokenMagic = Magic;
});

Hooks.on("canvasInit", (canvas) => {
    log("Hook -> canvasInit");
    autosetPaddingMode();
    Anime.desactivateAnimation();
    Anime.resetAnimation();
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

    Anime.activateAnimation();
});

Hooks.on("deleteScene", (scene, data, options) => {
    log("Hook -> deleteScene");

    if (!(scene == null) && scene.id === game.user.viewedScene) {
        Anime.desactivateAnimation();
        Anime.resetAnimation();
    }
});

Hooks.on("deleteToken", (parent, doc, options, userId) => {
    log("Hook -> deleteToken");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("createToken", (scene, data, options) => {
    log("Hook -> createToken");

    if (!(scene == null)
        && scene.id === game.user.viewedScene
        && data.hasOwnProperty("flags")
        && data.flags.hasOwnProperty("tokenmagic")
        && data.flags.tokenmagic.hasOwnProperty("filters")) {

        var placeable = getPlaceableById(data._id, "Token");

        (async () => {
            await sleep(100);
            Magic._singleLoadFilters(placeable);
        })();
    }
});

Hooks.on("updateToken", (scene, data, options) => {
    log("Hook -> updateToken");

    if (options.hasOwnProperty("img") || options.hasOwnProperty("tint")
        || options.hasOwnProperty("height") || options.hasOwnProperty("width") ) {

        var placeable = getPlaceableById(data._id, "Token");

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        // clearing the filters (owned by tokenmagic)
        Magic._clearImgFiltersByPlaceable(placeable);

        (async () => {
            await sleep(100);
            Magic._singleLoadFilters(placeable);
        })();

    } else {
        Magic._updateFilters(data, options, "Token");
    }
});

Hooks.on("deleteTile", (parent, doc, options, userId) => {
    log("Hook -> deleteTile");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("updateTile", (scene, data, options) => {
    log("Hook -> updateTile");

    if (options.hasOwnProperty("img") || options.hasOwnProperty("tint")) {

        var placeable = getPlaceableById(data._id, "Tile");

        // removing animations on this placeable
        Anime.removeAnimation(data._id);

        (async () => {
            await sleep(100);
            Magic._singleLoadFilters(placeable);
        })();

    } else {
        Magic._updateFilters(data, options, "Tile");
    }
});

Hooks.on("closeSettingsConfig", () => {
    autosetPaddingMode();
});
