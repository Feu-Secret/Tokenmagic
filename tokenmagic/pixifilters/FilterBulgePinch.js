import { Anime } from "./Anime.js";

export class FilterBulgePinch extends PIXI.filters.BulgePinchFilter {
    constructor(params) {
        super();
        this.enabled = false;

        this.strength = 0;
        this.radiusPercent = 100;
        this.padding = 0;

        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
        this.placeableImg = null;
        this.preComputation = this.handleTransform;

        // Anchor point
        this.center = [0.5, 0.5];

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

    // Headache guaranteed !
    // TODO : To improve and factorize (but there, I'm fed up !)
    handleTransform() {
        if (this.hasOwnProperty("zIndex")) {
            this.placeableImg.parent.zIndex = this.zIndex;
        }
        this.radius = (Math.max(this.placeableImg.width, this.placeableImg.height)
            * this.placeableImg.parent.worldTransform.a
            * this.radiusPercent) / 200;

        var placeableWidth = this.placeableImg.parent.width * this.placeableImg.parent.worldTransform.a;
        var placeableHeight = this.placeableImg.parent.width * this.placeableImg.parent.worldTransform.a;

        this.center = [0.5, 0.5];

        // Anchor point takes into account only visible parts.
        // To avoid undesirables effects, we must recompute the center when the image has parts outside the screen.
        // TODO : take into account the additive padding (with an IFilterInterface)
        if ((this.placeableImg.parent.worldTransform.tx + placeableWidth + this.padding) > canvas.app.screen.width) {
            let invisibleWidth = (this.placeableImg.parent.worldTransform.tx + placeableWidth + this.padding) - canvas.app.screen.width;
            let visibleWidth = placeableWidth - invisibleWidth + this.padding;
            this.center[0] = (0.5 * (visibleWidth + (invisibleWidth / 2))) / visibleWidth
        }

        if ((this.placeableImg.parent.worldTransform.ty + placeableHeight + this.padding) > canvas.app.screen.height) {
            let invisibleHeight = (this.placeableImg.parent.worldTransform.ty + placeableHeight + this.padding) - canvas.app.screen.height;
            let visibleHeight = placeableHeight - invisibleHeight + this.padding;
            this.center[1] = (0.5 * (visibleHeight + (invisibleHeight / 2))) / visibleHeight
        }

        if ((this.placeableImg.parent.worldTransform.tx - this.padding) < 0) {
            let invisibleWidth = this.placeableImg.parent.worldTransform.tx - this.padding;
            let visibleWidth = placeableWidth + invisibleWidth + this.padding;
            this.center[0] = (0.5 * (visibleWidth + (invisibleWidth / 2))) / visibleWidth
        }

        if ((this.placeableImg.parent.worldTransform.ty - this.padding) < 0) {
            let invisibleHeight = this.placeableImg.parent.worldTransform.ty - this.padding;
            let visibleHeight = placeableHeight + invisibleHeight + this.padding;
            this.center[1] = (0.5 * (visibleHeight + (invisibleHeight / 2))) / visibleHeight
        }
    }
}
