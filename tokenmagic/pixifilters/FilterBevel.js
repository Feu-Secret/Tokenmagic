import { Anime } from "./Anime.js";

export class FilterBevel extends PIXI.filters.BevelFilter {
    constructor(params) {
        super();
        this.blendMode = PIXI.BLEND_MODES.NORMAL;
        this.padding = 10;
        this.enabled = false;
        this.rotation = 0;
        this.thickness = 5;
        this.lightColor = 0xFFFFFF;
        this.lightAlpha = 0.95;
        this.shadowColor = 0x000000;
        this.shadowAlpha = 0.95;
        this.quality = 1;
        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
    }
}
