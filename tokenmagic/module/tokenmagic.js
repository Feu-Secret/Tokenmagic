import { FilterAdjustment } from "../pixifilters/FilterAdjustment.js";
import { FilterXBloom } from "../pixifilters/FilterAdvancedBloom.js";
import { FilterDistortion } from "../pixifilters/FilterDistortion.js";
import { FilterOldFilm } from "../pixifilters/FilterOldFilm.js";
import { FilterGlow } from "../pixifilters/FilterGlow.js";
import { FilterOutline } from "../pixifilters/FilterOutline.js";
import { FilterBevel } from "../pixifilters/FilterBevel.js";
import { FilterDropShadow } from "../pixifilters/FilterDropShadow.js";
import { FilterTwist } from "../pixifilters/FilterTwist.js";
import { FilterZoomBlur } from "../pixifilters/FilterZoomBlur.js";
import { FilterBlur } from "../pixifilters/FilterBlur.js";
import { FilterShockwave } from "../pixifilters/FilterShockWave.js";
import { FilterBulgePinch } from "../pixifilters/FilterBulgePinch.js";
import { FilterRemoveShadow } from "../pixifilters/FilterRemoveShadow.js";
import { FilterRays } from "../pixifilters/FilterRays.js";
import { FilterFog } from "../pixifilters/FilterFog.js";
import { Anime } from "../pixifilters/Anime.js";

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
    shockwave: FilterShockwave
};

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

// For later use
//export function broadcast(bcAction, bcPlaceable, bcFilterId) {

//    var data =
//    {
//        tmAction: bcAction,
//        tmPlaceableId: bcPlaceable.id,
//        tmFilterId: bcFilterId,
//        tmViewedScene: game.user.viewedScene
//    };
//    game.socket.emit(moduleTM, data, resp => { });
//}


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

            if (!params.hasOwnProperty("filterId")) {
                params.filterId = randomID();
            }

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
                tmFilterType: params.filterType,
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

    async function addFilters(placeable, paramsArray) {
        if (paramsArray instanceof Array && paramsArray.length > 0) {
            for (const params of paramsArray) {
                await addFilter(placeable, params);
            }
        }
    };

    // Deleting filters on selected placeable(s)
    async function deleteFiltersOnSelected() {
        var placeables = getControlledPlaceables();
        if (!(placeables == null) && placeables.length > 0) {

            for (const placeable of placeables) {
                await deleteFilters(placeable);
            }
        }
    }

    // Deleting all filters on a placeable in parameter
    async function deleteFilters(placeable) {
        if (!(placeable == null)) {
            await placeable.unsetFlag("tokenmagic", "filters");
        }
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
            if (filterInfo == null) { return; }
            var filter = new FilterType[filterInfo.tmFilters.tmFilterType](filterInfo.tmFilters.tmParams);
            setFilter(placeable, filter, filterInfo.tmFilters.tmParams);
        });
    };

    function _loadFilters(placeables) {
        if (!(placeables == null)) {
            placeables.forEach((placeable) => {
                var filters = placeable.getFlag("tokenmagic", "filters");
                if (!(filters == null)) {
                    this._assignFilters(placeable, filters);
                }
            });
        }
    };

    function _updateFilters(data, options, placeableType) {
        if (options.hasOwnProperty("flags") && options.flags.hasOwnProperty("tokenmagic")) {
            if (!(data == null || !data.hasOwnProperty("_id"))) {

                var placeable = getPlaceableById(data._id, placeableType);
                if (!(placeable == null)) {
                    Anime.removeAnimation(data._id);
                    this._clearImgFiltersByPlaceable(placeable);

                    if (!options.flags.tokenmagic.hasOwnProperty("-=filters")) {
                        var filters = placeable.getFlag("tokenmagic", "filters");
                        if (!(filters == null)) {
                            this._assignFilters(placeable, filters);
                        }
                    }
                }
            }
        }
    };

    // TODO : remove tokenmagic filters only !
    function _clearImgFiltersByPlaceable(placeable) {
        if (placeable == null) { return; }
        // Clean up
        if (placeable instanceof Token) {
            placeable.icon.filters = null;
        } else if (placeable instanceof Tile) {
            placeable.tile.img.filters = null;
        }
    };

    return {
        addFilter: addFilter,
        addFilters: addFilters,
        addFilterOnSelected: addFilterOnSelected,
        addFiltersOnSelected: addFiltersOnSelected,
        deleteFilters: deleteFilters,
        deleteFiltersOnSelected: deleteFiltersOnSelected,
        _assignFilters: _assignFilters,
        _loadFilters: _loadFilters,
        _clearImgFiltersByPlaceable: _clearImgFiltersByPlaceable,
        _getAnimeMap: Anime.getAnimeMap,
        _updateFilters: _updateFilters,
    };
}

export const Magic = TokenMagic();

// for later use
//function initSocket() {
//    game.socket.on(moduleTM, data => {

//        if (data == null || !data.hasOwnProperty("tmAction")) { return; }

//        switch (data.action) {
//            case "updateFilters":
//                break;
//            case "deleteFilters":
//                break;
//        }
//    });
//};

Hooks.on("ready", () => {
    log("Hook -> ready");
    window.TokenMagic = Magic;
    //initSocket();
});

Hooks.on("canvasInit", (canvas) => {
    log("Hook -> canvasInit");
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

Hooks.on("updateScene", (scene, data, options) => {
    log("Hook -> updateScene");
    Anime.resetAnimation();
});

Hooks.on("deleteToken", (parent, doc, options, userId) => {
    log("Hook -> deleteToken");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("updateToken", (scene, data, options) => {
    log("Hook -> updateToken");
    Magic._updateFilters(data, options, "Token");
});

Hooks.on("deleteTile", (parent, doc, options, userId) => {
    log("Hook -> deleteTile");
    if (!(doc == null || !doc.hasOwnProperty("_id"))) {
        Anime.removeAnimation(doc._id);
    }
});

Hooks.on("updateTile", (scene, data, options) => {
    log("Hook -> updateTile");
    Magic._updateFilters(data, options, "Tile");
});
