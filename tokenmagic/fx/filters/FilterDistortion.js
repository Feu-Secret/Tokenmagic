import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterDistortion extends PIXI.filters.DisplacementFilter {
    constructor(params) {
        // Loading distortion sprite
        var displacementSpriteMask;
        var spriteMaskPath;
        spriteMaskPath = (params.hasOwnProperty("maskPath") ? params.maskPath : "/modules/tokenmagic/fx/assets/distortion-1.png");
        displacementSpriteMask = new PIXI.Sprite.from(spriteMaskPath);
        super(displacementSpriteMask);

        // Configuring distortion sprite
        this.sprite = displacementSpriteMask;
        this.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.anchorSet = 0.5;
        this.transition = null;
        this.padding = 15; // conf
        this.enabled = false;
        this.maskSpriteScaleX = 4;
        this.maskSpriteScaleY = 4;
        this.maskSpriteSkewX = 0;
        this.maskSpriteSkewY = 0;
        this.maskSpriteRotation = 0;
        this.zOrder = 4000;

        this.animated = {};
        this.setTMParams(params);
        if (!this.dummy) {
            this.anime = new Anime(this);
            this.normalizeTMParams();
            this.sprite.anchor.set(this.anchorSet);
            this.sprite.texture.baseTexture.wrapMode = this.wrapMode;
            this.placeableImg.addChild(this.sprite);
            this.sprite.x = this.placeableImg.width / 2;
            this.sprite.y = this.placeableImg.height / 2;
        }
    }

    set maskSpriteX(value) {
        this.maskSprite.x = value;
    }

    set maskSpriteY(value) {
        this.maskSprite.y = value;
    }

    get maskSpriteX() {
        return this.maskSprite.x;
    }

    get maskSpriteY() {
        return this.maskSprite.y;
    }

    set maskSpriteScaleX(value) {
        this.sprite.scale.x = value;
    }

    set maskSpriteScaleY(value) {
        this.sprite.scale.y = value;
    }

    get maskSpriteScaleX() {
        return this.sprite.scale.x;
    }

    get maskSpriteScaleY() {
        return this.sprite.scale.y;
    }

    set maskSpriteRotation(value) {
        this.sprite.rotation = value;
    }

    get maskSpriteRotation() {
        return this.sprite.rotation;
    }

    set maskSpriteSkewX(value) {
        this.sprite.skew.x = value;
    }

    get maskSpriteSkewX() {
        return this.sprite.skew.x;
    }

    set maskSpriteSkewY(value) {
        this.sprite.skew.y = value;
    }

    get maskSpriteSkewY() {
        return this.sprite.skew.y;
    }
}