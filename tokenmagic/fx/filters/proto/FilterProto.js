import { objectAssign, getPlaceableById, getMinPadding, PlaceableType, Magic } from "../../../module/tokenmagic.js";
import "../../../module/proto/PlaceableObjectProto.js";

PIXI.Filter.prototype.setTMParams = function (params) {
    this.autoDisable = false;
    this.autoDestroy = false;
    this.autoFit = false;
    this.padding = 0;
    this.gridPadding = 0;
    this.dummy = false;
    objectAssign(this, params);
    if (!this.dummy) {
        this.originalPadding = Math.max(this.padding, getMinPadding());
        this.assignPlaceable();
        this.activateTransform();
    }
}

PIXI.Filter.prototype.getPlaceable = function () {
    return getPlaceableById(this.placeableId, this.placeableType);
}

PIXI.Filter.prototype.getPlaceableType = function () {
    return this.placeableType;
}

PIXI.Filter.prototype.calculatePadding = function () {
    if (this.gridPadding > 0) {
        var imgSize = Math.max(this.placeableImg.width, this.placeableImg.height);
        var toSize = (canvas.dimensions.size >= imgSize
            ? canvas.dimensions.size - imgSize
            : imgSize % canvas.dimensions.size);

        this.currentPadding =
            (this.placeableImg.parent.worldTransform.a * (this.gridPadding - 1)
                * canvas.dimensions.size)
            + ((toSize * this.placeableImg.parent.worldTransform.a) / 2);

    } else {

        this.currentPadding =
            this.placeableImg.parent.worldTransform.a
            * this.originalPadding;
    }
}

PIXI.Filter.prototype.assignPlaceable = function () {

    let placeable = this.getPlaceable();
    placeable != null
        ? this.placeableImg = placeable._TMFXgetSprite()
        : this.placeableImg = null;
}

PIXI.Filter.prototype.assignPlaceable = function () {
    this.placeableImg = this.getPlaceable();
}

PIXI.Filter.prototype.activateTransform = function () {
    this.preComputation = this.filterTransform;
    this.filterTransform();
}

PIXI.Filter.prototype.filterTransform = function () {
    this.calculatePadding();

    if (this.hasOwnProperty("zIndex")) {
        this.placeableImg.parent.zIndex = this.zIndex;
    }

    this.padding = this.currentPadding;

    if ("handleTransform" in this) {
        this.handleTransform();
    }
}

PIXI.Filter.prototype.normalizeTMParams = function () {

    if (this.hasOwnProperty("animated") && !(this.animated == null)) {

        // Normalize animations properties
        Object.keys(this.animated).forEach((effect) => {
            if (!(this.animated[effect].hasOwnProperty("active"))
                || this.animated[effect].active == null
                || typeof this.animated[effect].active != "boolean") {
                this.animated[effect].active = true;
            }
            if (!(this.animated[effect].hasOwnProperty("loops"))
                || this.animated[effect].loops == null
                || typeof this.animated[effect].loops != "number"
                || this.animated[effect].loops <= 0) {
                this.animated[effect].loops = Infinity;
            }
            if (!(this.animated[effect].hasOwnProperty("loopDuration"))
                || this.animated[effect].loopDuration == null
                || typeof this.animated[effect].loopDuration != "number"
                || this.animated[effect].loopDuration <= 0) {
                this.animated[effect].loopDuration = 3000;
            }
            if (!(this.animated[effect].hasOwnProperty("pauseBetweenDuration"))
                || this.animated[effect].pauseBetweenDuration == null
                || typeof this.animated[effect].pauseBetweenDuration != "number"
                || this.animated[effect].pauseBetweenDuration <= 0) {
                this.animated[effect].pauseBetweenDuration = 0;
            }
            if (!(this.animated[effect].hasOwnProperty("syncShift"))
                || this.animated[effect].syncShift == null
                || typeof this.animated[effect].syncShift != "number"
                || this.animated[effect].syncShift < 0) {
                this.animated[effect].syncShift = 0;
            }
            if (!(this.animated[effect].hasOwnProperty("val1"))
                || this.animated[effect].val1 == null
                || typeof this.animated[effect].val1 != "number") {
                this.animated[effect].val1 = 0;
            }
            if (!(this.animated[effect].hasOwnProperty("val2"))
                || this.animated[effect].val2 == null
                || typeof this.animated[effect].val2 != "number") {
                this.animated[effect].val2 = 0;
            }
            if (!(this.animated[effect].hasOwnProperty("animType"))
                || this.anime[this.animated[effect].animType] === undefined) {
                this.animated[effect].animType = null;
            }
            if (!(this.animated[effect].hasOwnProperty("speed"))
                || this.animated[effect].speed == null
                || typeof this.animated[effect].speed != "number") {
                this.animated[effect].speed = 0;
            }
            if (!(this.animated[effect].hasOwnProperty("chaosFactor"))
                || this.animated[effect].chaosFactor == null
                || typeof this.animated[effect].chaosFactor != "number") {
                this.animated[effect].chaosFactor = 0.25;
            }
            if (!(this.animated[effect].hasOwnProperty("wantInteger"))
                || this.animated[effect].wantInteger == null
                || typeof this.animated[effect].wantInteger != "boolean") {
                this.animated[effect].wantInteger = false;
            }

            if (!this.anime.hasInternals(effect)) {
                this.anime.initInternals(effect);
            }

            this.anime.animated = this.animated;
        });
    }
}