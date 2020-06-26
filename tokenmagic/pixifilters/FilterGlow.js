import { Anime } from "./Anime.js";

export class FilterGlow extends PIXI.filters.GlowFilter {
    constructor(params) {
        super();
        this.padding = 15;
        this.enabled = false;
        this.distance = 10;
        this.innerStrength = 0;
        this.outerStrength = 6.5;
        this.color = 0x0020ff;
        this.quality = 1;
        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
    }
}
