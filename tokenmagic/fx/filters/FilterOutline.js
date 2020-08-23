import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterOutline extends PIXI.filters.OutlineFilter {
    constructor(params) {
        super();
        this.blendMode = PIXI.BLEND_MODES.NORMAL;
        this.padding = 5;
        this.enabled = false;
        this.thickness = 3;
        this.color = 0x000000;
        this.quality = 1;
        this.zOrder = 6;
        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();
    }
}
