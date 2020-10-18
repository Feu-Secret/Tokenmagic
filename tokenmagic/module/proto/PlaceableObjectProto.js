import { PlaceableType, Magic, broadcast, SocketAction, mustBroadCast, isZOrderConfig, isVideoDisabled } from "../tokenmagic.js";
import { emptyPreset, autoMinRank } from '../constants.js';

export var gMaxRank = autoMinRank;

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

PlaceableObject.prototype._TMFXsetAnimeFlag = async function (flag) {
    if (mustBroadCast()) broadcast(this, flag, SocketAction.SET_ANIME_FLAG);
    else await this.setFlag("tokenmagic", "animeInfo", flag);
}

PlaceableObject.prototype._TMFXunsetFlag = async function () {
    if (mustBroadCast()) broadcast(this, null, SocketAction.SET_FLAG);
    else await this.unsetFlag("tokenmagic", "filters");
}

PlaceableObject.prototype._TMFXunsetAnimeFlag = async function () {
    if (mustBroadCast()) broadcast(this, null, SocketAction.SET_ANIME_FLAG);
    else await this.unsetFlag("tokenmagic", "animeInfo");
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
    var accPadding = 0;
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

PlaceableObject.prototype._TMFXgetMaxFilterRank = function () {
    const sprite = this._TMFXgetSprite();
    if (sprite == null) { return (gMaxRank++); }
    if (sprite.filters == null) {
        return (gMaxRank++);
    } else {
        let maxRank = Math.max(...sprite.filters.map(f => f.rank), autoMinRank);
        gMaxRank = Math.max(maxRank, gMaxRank) + 1;
        return gMaxRank;
    }
}

PlaceableObject.prototype._TMFXsetRawFilters = function (filters) {

    function insertFilter(filters) {
        function filterZOrderCompare(a, b) {
            if (a.zOrder < b.zOrder) return -1;
            if (a.zOrder > b.zOrder) return 1;
            return 0;
        }

        function filterRankCompare(a, b) {
            if (a.rank < b.rank) return -1;
            if (a.rank > b.rank) return 1;
            return 0;
        }

        if (!isZOrder) {
            if (!filters.hasOwnProperty("rank")) {
                let maxRank = Math.max(...sprite.filters.map(f => f.rank), autoMinRank);
                filters.rank = maxRank + 1;
            }
        }

        sprite.filters.push(filters);
        isZOrder ? sprite.filters.sort(filterZOrderCompare)
            : sprite.filters.sort(filterRankCompare);
    }

    function addFilter(filters) {
        if (!isZOrder && !filters.hasOwnProperty("rank")) {
            filters.rank = autoMinRank;
        }
        sprite.filters = [filters];
    }

    const isZOrder = isZOrderConfig();
    const sprite = this._TMFXgetSprite();
    if (sprite == null) { return false; }

    if (filters == null) {
        sprite.filters = null;
    } else {
        sprite.filters == null
            ? addFilter(filters)
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

MeasuredTemplate.prototype.refresh = (function () {
    const cachedMTR = MeasuredTemplate.prototype.refresh;
    return function () {
        if (this.template && !this.template._destroyed) {
            if (isVideoDisabled()) {
                return cachedMTR.apply(this);
            } else {
                // INTEGRATION FROM MESS
                // THANKS TO MOERILL !!
                let d = canvas.dimensions;
                this.position.set(this.data.x, this.data.y);

                // Extract and prepare data
                let { direction, distance, angle, width } = this.data;
                distance *= (d.size / d.distance);
                width *= (d.size / d.distance);
                direction = toRadians(direction);

                // Create ray and bounding rectangle
                this.ray = Ray.fromAngle(this.data.x, this.data.y, direction, distance);

                // Get the Template shape
                switch (this.data.t) {
                    case "circle":
                        this.shape = this._getCircleShape(distance);
                        break;
                    case "cone":
                        this.shape = this._getConeShape(direction, angle, distance);
                        break;
                    case "rect":
                        this.shape = this._getRectShape(direction, distance);
                        break;
                    case "ray":
                        this.shape = this._getRayShape(direction, distance, width);
                }

                // Draw the Template outline
                this.template.clear()
                    .lineStyle(this._borderThickness, this.borderColor, 0.75)
                    .beginFill(0x000000, 0.0);

                // Fill Color or Texture
                if (this.texture) {
                    let mat = PIXI.Matrix.IDENTITY;
                    // rectangle
                    if (this.shape.width && this.shape.height)
                        mat.scale(this.shape.width / this.texture.width, this.shape.height / this.texture.height);
                    else if (this.shape.radius) {
                        mat.scale(this.shape.radius * 2 / this.texture.height, this.shape.radius * 2 / this.texture.width)
                        // Circle center is texture start...
                        mat.translate(-this.shape.radius, -this.shape.radius);
                    } else if (this.data.t === "ray") {
                        const d = canvas.dimensions,
                            height = this.data.width * d.size / d.distance,
                            width = this.data.distance * d.size / d.distance;
                        mat.scale(width / this.texture.width, height / this.texture.height);
                        mat.translate(0, -height * 0.5);

                        mat.rotate(toRadians(this.data.direction));
                    } else {// cone
                        const d = canvas.dimensions;

                        // Extract and prepare data
                        let { direction, distance, angle } = this.data;
                        distance *= (d.size / d.distance);
                        direction = toRadians(direction);
                        const width = this.data.distance * d.size / d.distance;

                        const angles = [(angle / -2), (angle / 2)];
                        distance = distance / Math.cos(toRadians(angle / 2));

                        // Get the cone shape as a polygon
                        const rays = angles.map(a => Ray.fromAngle(0, 0, direction + toRadians(a), distance + 1));
                        const height = Math.sqrt((rays[0].B.x - rays[1].B.x) * (rays[0].B.x - rays[1].B.x)
                            + (rays[0].B.y - rays[1].B.y) * (rays[0].B.y - rays[1].B.y));
                        mat.scale(width / this.texture.width, height / this.texture.height);
                        mat.translate(0, -height / 2)
                        mat.rotate(toRadians(this.data.direction));
                    }
                    this.template.beginTextureFill({
                        texture: this.texture,
                        matrix: mat,
                        alpha: 1.0
                    });
                    // move into draw or so
                    const source = getProperty(this.texture, "baseTexture.resource.source")
                    if (source && (source.tagName === "VIDEO")) {
                        source.loop = true;
                        source.muted = true;
                        game.video.play(source);
                    }
                }
                else this.template.beginFill(0x000000, 0.0);

                // Draw the shape
                this.template.drawShape(this.shape);

                // Draw origin and destination points
                this.template.lineStyle(this._borderThickness, 0x000000)
                    .beginFill(0x000000, 0.5)
                    .drawCircle(0, 0, 6)
                    .drawCircle(this.ray.dx, this.ray.dy, 6);

                // Update visibility
                this.controlIcon.visible = this.layer._active;
                this.controlIcon.border.visible = this._hover;

                // Draw ruler text
                this._refreshRulerText();
                return this;
            }
        }
        return this;
    };
})();
