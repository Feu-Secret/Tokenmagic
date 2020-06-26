import { Anime } from "./Anime.js";

export class FilterDistortion extends PIXI.filters.DisplacementFilter {
    constructor(params) {
        // Loading distortion sprite
        var displacementSpriteMask;
        var spriteMaskPath;
        spriteMaskPath = (params.hasOwnProperty("maskPath") ? params.maskPath : "/modules/tokenmagic/pixifilters/assets/extrusion-1.png");
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

        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);

        this.sprite.anchor.set(this.anchorSet);
        this.sprite.texture.baseTexture.wrapMode = this.wrapMode;

        // Attaching the sprite
        if (!(params == null) || !params.hasOwnProperty("placeableId")) {
            var placeable = null;
            if (params.placeableType === "Token") {
                placeable = canvas.tokens.placeables.find(n => n.id === params.placeableId);
                if (!(placeable == null)) {
                    placeable.icon.addChild(this.sprite);
                    this.sprite.x = placeable.icon.width / 2;
                    this.sprite.y = placeable.icon.height / 2;
                }
            } else {
                placeable = canvas.tiles.placeables.find(n => n.id === params.placeableId);
                if (!(placeable == null)) {
                    placeable.tile.img.addChild(this.sprite);
                    this.sprite.x = placeable.tile.img.width / 2;
                    this.sprite.y = placeable.tile.img.height / 2;
                }
            }
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