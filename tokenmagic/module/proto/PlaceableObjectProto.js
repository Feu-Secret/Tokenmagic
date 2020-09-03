import { PlaceableType, Magic, broadcast, SocketAction, mustBroadCast, isZOrderConfig } from "../tokenmagic.js";
import { emptyPreset } from '../constants.js';

PlaceableObject.prototype.TMFXaddFilters = async function (paramsArray, replace = false) {
    await Magic.addFilters(this, paramsArray, replace);
}

PlaceableObject.prototype.TMFXupdateFilters = async function (paramsArray) {
    await Magic.updateFiltersByPlaceable(this, paramsArray);
}

PlaceableObject.prototype.TMFXaddUpdateFilters = async function (paramsArray) {
    await Magic.addUpdateFilters(this, paramsArray);
}

PlaceableObject.prototype.TMFXdeleteFilters = async function (filterId = null) {
    await Magic.deleteFilters(this, filterId);
}

PlaceableObject.prototype.TMFXhasFilterType = function (filterType) {
    return Magic.hasFilterType(this, filterType);
}

PlaceableObject.prototype.TMFXhasFilterId = function (filterId) {
    return Magic.hasFilterId(this, filterId);
}

PlaceableObject.prototype._TMFXsetFlag = async function (flag) {
    if (mustBroadCast()) broadcast(this, flag, SocketAction.SET_FLAG);
    else await this.setFlag("tokenmagic", "filters", flag);
}

PlaceableObject.prototype._TMFXunsetFlag = async function () {
    if (mustBroadCast()) broadcast(this, null, SocketAction.SET_FLAG);
    else await this.unsetFlag("tokenmagic", "filters");
}

PlaceableObject.prototype._TMFXgetSprite = function () {

    switch (this.constructor.embeddedName) {
        case PlaceableType.TOKEN:
            return this.icon;
            break;
        case PlaceableType.TILE:
            return this.tile.img;
            break;
        case PlaceableType.TEMPLATE:
            return this.template;
            break;
        case PlaceableType.DRAWING:
            return this.drawing || this.img;
            break;
        default:
            return null;
    }
}

PlaceableObject.prototype._TMFXgetPlaceablePadding = function () {
    // get the placeable padding, by taking into account all filters and options
    let accPadding = 0;
    const filters = this._TMFXgetSprite().filters;
    if (filters instanceof Array) {
        // "for (const) of" has performance advantage
        for (const filter of filters) {
            if (canvas.app.renderer.filter.useMaxPadding) {
                accPadding = Math.max(accPadding, filter.padding);
            } else {
                accPadding += filter.padding;
            }
        }
    }
    return accPadding;
}

PlaceableObject.prototype._TMFXcheckSprite = function () {

    switch (this.constructor.embeddedName) {
        case PlaceableType.TOKEN:
            return (this.hasOwnProperty("icon")
                && !(this.icon == null));
            break;
        case PlaceableType.TILE:
            return (this.hasOwnProperty("tile")
                && this.tile.hasOwnProperty("img")
                && !(this.tile.img == null));
            break;
        case PlaceableType.TEMPLATE:
            return (this.hasOwnProperty("template")
                && !(this.template == null));
            break;
        case PlaceableType.DRAWING:
            return (this.hasOwnProperty("drawing")
                && !(this.drawing == null))
                || (this.hasOwnProperty("img")
                    && !(this.img == null));
            break;
        default:
            return null;
    }
}

PlaceableObject.prototype._TMFXsetRawFilters = function (filters) {

    function insertFilter(filters) {
        function filterZOrderCompare(a, b) {
            if (a.zOrder < b.zOrder) return -1;
            if (a.zOrder > b.zOrder) return 1;
            return 0;
        }
        sprite.filters.push(filters);
        if (isZOrderConfig()) sprite.filters.sort(filterZOrderCompare);
    }

    const sprite = this._TMFXgetSprite();
    if (sprite == null) { return false; }

    if (filters == null) {
        sprite.filters = null;
    } else {
        sprite.filters == null
            ? sprite.filters = [filters]
            : insertFilter(filters);
    }

    return true;
}

PlaceableObject.prototype._TMFXunsetRawFilters = function () {
    return this._TMFXsetRawFilters(null);
}

PlaceableObject.prototype._TMFXgetPlaceableType = function () {
    if ([PlaceableType.TOKEN, PlaceableType.TILE, PlaceableType.TEMPLATE, PlaceableType.DRAWING]
        .includes(this.constructor.embeddedName)) return this.constructor.embeddedName;

    return PlaceableType.NOT_SUPPORTED;
}

MeasuredTemplate.prototype.refresh = (function () {
    const cachedMTR = MeasuredTemplate.prototype.refresh;
    return function () {
        if (this.template && !this.template._destroyed) {
            return cachedMTR.apply(this);
        }
        return this;
    };
})();

MeasuredTemplate.prototype.update = (function () {
    const cachedMTU = MeasuredTemplate.prototype.update;
    return async function (data, options) {
        const hasTexture = data.hasOwnProperty("texture");
        const hasPresetData = data.hasOwnProperty("tmfxPreset");
        if (hasPresetData && data.tmfxPreset !== emptyPreset) {
            let defaultTexture = Magic._getPresetTemplateDefaultTexture(data.tmfxPreset);
            if (!(defaultTexture == null)) {
                if (data.texture === '' || data.texture.includes('/modules/tokenmagic/fx/assets/templates/'))
                    data.texture = defaultTexture;
            }

        } else if (hasTexture && data.texture.includes('/modules/tokenmagic/fx/assets/templates/')
            && hasPresetData && data.tmfxPreset === emptyPreset) {
            data.texture = '';
        }

        return await cachedMTU.apply(this, [data, options]);
    };
})();