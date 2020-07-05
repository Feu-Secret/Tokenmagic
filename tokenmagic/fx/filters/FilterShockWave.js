import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterShockwave extends PIXI.filters.ShockwaveFilter {
    constructor(params) {
        super();
        this.enabled = false;

        this.time = 0;
        this.amplitude = 5;
        this.wavelength = 100;
        this.speed = 50.0;
        this.brightness = 1.5;
        this.radius = 200;

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
        this.center[0] = this.placeableImg.localTransform.tx * this.placeableImg.parent.worldTransform.a;
        this.center[1] = this.placeableImg.localTransform.ty * this.placeableImg.parent.worldTransform.a;
    }
}
