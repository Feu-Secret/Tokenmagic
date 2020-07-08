import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterBulgePinch extends PIXI.filters.BulgePinchFilter {
    constructor(params) {
        super();
        this.enabled = false;

        this.strength = 0;
        this.radiusPercent = 100;
        this.padding = 0;

        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();

        this.placeableImg = null;
        this.preComputation = this.handleTransform;

        // Anchor point
        this.center = [0.5, 0.5];

        // Get placeable to compute center
        if (!(params == null) || !params.hasOwnProperty("placeableId")) {
            if (params.placeableType === "Token") {
                let parent = canvas.tokens.placeables.find(n => n.id === params.placeableId);
                if (!(parent == null)) {
                    this.placeableImg = parent.icon;
                }
            } else {
                let parent = canvas.tiles.placeables.find(n => n.id === params.placeableId);
                if (!(parent == null)) {
                    this.placeableImg = parent.tile.img;
                }
            }
            this.handleTransform();
        }
    }

    handleTransform() {
        if (this.hasOwnProperty("zIndex")) {
            this.placeableImg.parent.zIndex = this.zIndex;
        }
        this.radius = (Math.max(this.placeableImg.width, this.placeableImg.height)
            * this.placeableImg.parent.worldTransform.a
            * this.radiusPercent) / 200;
    }
}
