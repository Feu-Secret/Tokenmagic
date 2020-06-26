import { Anime } from "./Anime.js";

export class FilterDropShadow extends PIXI.filters.DropShadowFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.rotation = 45;
        this.distance = 5;
        this.color = 0x000000;
        this.alpha = 0.5;
        this.shadowOnly = false;
        this.blur = 2;
        this.quality = 3;
        this.padding = 10;
        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
    }
}