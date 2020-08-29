import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterPixelate extends PIXI.filters.PixelateFilter {
    constructor(params) {
        super();
        this.enabled = false;
        this.animated = {};
        this.sizeX = 5;
        this.sizeY = 5;
        this.zOrder = 20;
        this.setTMParams(params);
        if (!this.dummy) {
            this.anime = new Anime(this);
            this.normalizeTMParams();
        }
    }

    //get sizeX() {
    //    return this.size.x;
    //}

    //set sizeX(value) {
    //    this.size.x = value;
    //}

    //get sizeY() {
    //    return this.size.y;
    //}

    //set sizeY(value) {
    //    this.size.y = value;
    //}

    handleTransform() {
        if (!this.dummy) {
            this.size.x = this.sizeX * this.placeableImg.parent.worldTransform.a;
            this.size.y = this.sizeY * this.placeableImg.parent.worldTransform.a;
        }
    }
}
