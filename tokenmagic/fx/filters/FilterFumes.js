import { fumes } from '../glsl/fragmentshaders/fumes.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterFumes extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            color,
            blend,
            dimX,
            dimY
        } = Object.assign({}, FilterFumes.defaults, params);

        // using specific vertex shader and fragment shader
        super(customVertex2D, fumes);

        this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
        this.uniforms.dimensions = new Float32Array([1.0, 1.0]);

        Object.assign(this, {
            time, color, blend, dimX, dimY
        });

        this.animated = {};
        this.setTMParams(params);
        this.anime = new Anime(this);
        this.normalizeTMParams();
    }

    get time() {
        return this.uniforms.time;
    }

    set time(value) {
        this.uniforms.time = value;
    }

    get color() {
        return PIXI.utils.rgb2hex(this.uniforms.color);
    }

    set color(value) {
        PIXI.utils.hex2rgb(value, this.uniforms.color);
    }

    get blend() {
        return this.uniforms.blend;
    }

    set blend(value) {
        this.uniforms.blend = Math.floor(value);
    }

    get dimX() {
        return this.uniforms.dimensions[0];
    }

    set dimX(value) {
        this.uniforms.dimensions[0] = value;
    }

    get dimY() {
        return this.uniforms.dimensions[1];
    }

    set dimY(value) {
        this.uniforms.dimensions[1] = value;
    }
}

FilterFumes.defaults = {
    time: 0,
    color: 0xFFFFFF,
    blend: 2,
    dimX: 1,
    dimY: 1,
};




