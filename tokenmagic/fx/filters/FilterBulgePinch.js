import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterBulgePinch extends PIXI.filters.BulgePinchFilter {
    constructor(params) {
        super();

        this.strength = 0;
        this.radiusPercent = 100;
        this.zOrder = 100;

        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();

        // Anchor point
        this.center = [0.5, 0.5];
    }

    handleTransform() {

        this.radius = (Math.max(this.placeableImg.width, this.placeableImg.height)
            * this.placeableImg.parent.worldTransform.a
            * this.radiusPercent) / 200;
    }
}
