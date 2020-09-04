import { matrix } from '../glsl/fragmentshaders/matrix.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterTransform extends PIXI.Filter {

    constructor(params) {
        let {
            rotation,
            scaleX,
            scaleY,
            pivotX,
            pivotY,
            translationX,
            translationY
        } = Object.assign({}, FilterTransform.defaults, params);

        super(customVertex2D, matrix);

        this.uniforms.scale = new Float32Array([1.0, 1.0]);
        this.uniforms.pivot = new Float32Array([0.5, 0.5]);
        this.uniforms.translation = new Float32Array([0.0, 0.0]);

        Object.assign(this, {
            rotation,
            scaleX,
            scaleY,
            pivotX,
            pivotY,
            translationX,
            translationY
        });

        this.zOrder = 1000;
        this.animated = {};
        this.setTMParams(params);
        if (!this.dummy) {
            this.anime = new Anime(this);
            this.normalizeTMParams();
        }

    }

    get rotation() {
        return this.uniforms.rotation;
    }

    set rotation(value) {
        this.uniforms.rotation = value;
    }

    get scaleX() {
        return this.uniforms.scale[0];
    }

    set scaleX(value) {
        this.uniforms.scale[0] = value;
    }

    get scaleY() {
        return this.uniforms.scale[1];
    }

    set scaleY(value) {
        this.uniforms.scale[1] = value;
    }

    get pivotX() {
        return this.uniforms.pivot[0];
    }

    set pivotX(value) {
        this.uniforms.pivot[0] = value;
    }

    get pivotY() {
        return this.uniforms.pivot[1];
    }

    set pivotY(value) {
        this.uniforms.pivot[1] = value;
    }

    get translationX() {
        return this.uniforms.translation[0];
    }

    set translationX(value) {
        this.uniforms.translation[0] = value;
    }

    get translationY() {
        return this.uniforms.translation[1];
    }

    set translationY(value) {
        this.uniforms.translation[1] = value;
    }
}

FilterTransform.defaults = {
    rotation: 0.0,
    scaleX: 1,
    scaleY: 1,
    pivotX: 0.5,
    pivotY: 0.5,
    translationX: 0,
    translationY: 0,
};






