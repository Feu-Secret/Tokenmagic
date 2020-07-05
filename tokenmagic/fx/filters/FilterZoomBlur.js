import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterZoomBlur extends PIXI.filters.ZoomBlurFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.strength = 0.1;
        this.radiusPercent = 50;
        this.innerRadiusPercent = 10;
        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();

        this.placeableImg = null;
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
        this.center[0] =
            this.padding +
            ((this.placeableImg.localTransform.tx * this.placeableImg.parent.worldTransform.a)
                * this.placeableImg.parent.data.scale);
        this.center[1] =
            this.padding +
            ((this.placeableImg.localTransform.ty * this.placeableImg.parent.worldTransform.a)
                * this.placeableImg.parent.data.scale);
        this.radius =
            (Math.max(this.placeableImg.width, this.placeableImg.height)
                * this.placeableImg.parent.worldTransform.a
                * this.radiusPercent) / 200;
        this.innerRadius =
            (Math.max(this.placeableImg.width, this.placeableImg.height)
                * this.placeableImg.parent.worldTransform.a
                * this.innerRadiusPercent) / 200;
    }
}
