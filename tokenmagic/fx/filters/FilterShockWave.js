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

        this.zOrder = 220;
        this.animated = {};
        this.setTMParams(params);
        if (!this.dummy) {
            this.anime = new Anime(this);
            this.normalizeTMParams();
        }
    }

    handleTransform() {
        let scale = this.targetPlaceable.data?.scale;
        if (scale == null) scale = 1;

        this.center[0] = (this.placeableImg.localTransform.tx
            * this.targetPlaceable.worldTransform.a
            * scale)
            + this.boundsPadding.x;
        this.center[1] = (this.placeableImg.localTransform.ty
            * this.targetPlaceable.worldTransform.a
            * scale)
            + this.boundsPadding.y;
    }
}
