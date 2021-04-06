import { polymorph } from '../glsl/fragmentshaders/polymorph.js';
import { customVertex2DSampler } from '../glsl/vertexshaders/customvertex2DSampler.js';
import { CustomFilter } from './CustomFilter.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterPolymorph extends CustomFilter {

    constructor(params) {
        let {
            imagePath,
            progress,
            magnify,
            type
        } = Object.assign({}, FilterPolymorph.defaults, params);

        const targetSpriteMatrix = new PIXI.Matrix();

        // using specific vertex shader and fragment shader
        super(customVertex2DSampler, polymorph);

        // vertex uniforms
        this.uniforms.targetUVMatrix = targetSpriteMatrix;

        // fragment uniforms
        this.uniforms.inputClampTarget = new Float32Array([0, 0, 0, 0]);

        // to store sprite matrix from the filter manager (and send to vertex)
        this.targetSpriteMatrix = targetSpriteMatrix;

        Object.assign(this, {
            imagePath, progress, magnify, type
        });

        this.zOrder = 1;
        this.animated = {};
        this.setTMParams(params);
        if (!this.dummy) {
            this.anime = new Anime(this);
            this.normalizeTMParams();
            this.assignTexture();
        }
    }

    get progress() {
        return (this.uniforms.progress * 100);
    }

    set progress(value) {
        this.uniforms.progress = Math.min(Math.max(value * 0.01, 0), 1);
    }

    get magnify() {
        return this.uniforms.magnify;
    }

    set magnify(value) {
        this.uniforms.magnify = Math.min(Math.max(value, 0.1), 100);
    }

    get type() {
        return this.uniforms.type;
    }

    set type(value) {
        this.uniforms.type = Math.floor(value);
    }

    get uSamplerTarget() {
        return this.uniforms.uSamplerTarget;
    }

    set uSamplerTarget(value) {
        this.uniforms.uSamplerTarget = value;
    }

    assignTexture() {
        if (this.hasOwnProperty("imagePath")) {
            let tex = PIXI.Texture.from(this.imagePath);
            let sprite = new PIXI.Sprite(tex);

            sprite.renderable = false;
            if (this.placeableImg.hasOwnProperty("_texture")) {
                sprite.width = this.placeableImg._texture.baseTexture.realWidth;
                sprite.height = this.placeableImg._texture.baseTexture.realHeight;
                sprite.anchor.set(0.5);
            } else {
                sprite.width = this.placeableImg.width;
                sprite.height = this.placeableImg.height;
            }

            this.targetSprite = sprite;
            this.uSamplerTarget = sprite._texture;
            this.placeableImg.addChild(sprite);
        }
    }

    // override
    apply(filterManager, input, output, clear) {
        const targetSprite = this.targetSprite;
        const tex = targetSprite._texture;

        if (tex.valid) {
            if (!tex.uvMatrix) tex.uvMatrix = new PIXI.TextureMatrix(tex, 0.0);
            tex.uvMatrix.update();

            this.uniforms.uSamplerTarget = tex;
            this.uniforms.targetUVMatrix =
                filterManager.calculateSpriteMatrix(this.targetSpriteMatrix, targetSprite)
                    .prepend(tex.uvMatrix.mapCoord);
            this.uniforms.inputClampTarget = tex.uvMatrix.uClampFrame;
        }

        super.apply(filterManager, input, output, clear);
    }

    // override
    destroy() {
        super.destroy();
        if (this.placeableImg) this.placeableImg.removeChild(this.targetSprite);
        this.targetSprite.destroy({ children: true, texture: false, baseTexture: false });
    }
}

FilterPolymorph.defaults = {
    progress: 0,
    magnify: 1,
    type: 1,
};




