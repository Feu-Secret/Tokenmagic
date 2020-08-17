import { PlaceableType, Magic, broadcast, SocketAction, mustBroadCast, isTheOne } from "../tokenmagic.js";
import { PresetsLibrary } from "../../fx/presets/defaultpresets.js";

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

    let sprite;
    sprite = this._TMFXgetSprite();
    if (sprite == null) { return false; }

    if (filters == null) {
        sprite.filters = null;
    } else {
        sprite.filters == null
            ? sprite.filters = [filters]
            : sprite.filters.push(filters);
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

MeasuredTemplate.prototype.update = (function () {
    const cachedMTU = MeasuredTemplate.prototype.update;
    return async function (data, options) {
        let hasTexture = data.hasOwnProperty("texture");
        let hasPresetData = data.hasOwnProperty("tmfxPreset");
        if (hasPresetData && data.tmfxPreset !== 'NOFX') {
            let defaultTexture = Magic._getPresetTemplateDefaultTexture(data.tmfxPreset.slice(5));
            if (!(defaultTexture == null)) {
                if (data.texture === '' || data.texture.includes('/modules/tokenmagic/fx/assets/templates/'))
                    data.texture = defaultTexture;
            }

        } else if (hasTexture && data.texture.includes('/modules/tokenmagic/fx/assets/templates/')
            && hasPresetData && data.tmfxPreset === 'NOFX') {
            data.texture = '';
        }

        await cachedMTU.apply(this, arguments);
    };
})();