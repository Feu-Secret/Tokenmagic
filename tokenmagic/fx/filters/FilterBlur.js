import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterBlur extends PIXI.filters.BlurFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.blur = 2;
        this.quality = 4;
        this.resolution = 1;
        this.zOrder = 8;
        this.repeatEdgePixels = false;
        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();
    }
}
