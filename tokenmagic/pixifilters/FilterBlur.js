import { Anime } from "./Anime.js";

export class FilterBlur extends PIXI.filters.BlurFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.blur = 2;
        this.quality = 4;
        this.resolution = 1;
        this.repeatEdgePixels = false;
        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
    }
}
