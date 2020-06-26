import { Anime } from "./Anime.js";

export class FilterTwist extends PIXI.filters.TwistFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.radiusPercent = 50;
        this.angle = 4;
        this.padding = 20;
        this.centerPointShift = [0, 0];
        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
        this.placeableImg = null;
        this.offset = [0, 0];
        this.preComputation = this.handleTransform;

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

    play() {
        this.enabled = true;
    }

    stop() {
        this.enabled = false;
    }

    handleTransform() {
        this.offset[0] = this.placeableImg.worldTransform.tx;
        this.offset[1] = this.placeableImg.worldTransform.ty;
        this.radius =
            (Math.max(this.placeableImg.width, this.placeableImg.height)
                * this.placeableImg.parent.worldTransform.a
                * this.radiusPercent) / 200;
    }
}
