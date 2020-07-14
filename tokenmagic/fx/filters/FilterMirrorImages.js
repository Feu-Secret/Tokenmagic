import { mirrorImages } from '../glsl/fragmentshaders/mirrorimages.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { Anime } from "../Anime.js";
import "./proto/FilterProto.js";

export class FilterMirrorImages extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            blend,
            alpha,
        } = Object.assign({}, FilterMirrorImages.defaults, params);

        // using specific vertex shader and fragment shader
        super(customVertex2D, mirrorImages);

        //this.uniforms.color = new Float32Array([1.0, 1.0, 1.0]);
        //this.uniforms.scale = new Float32Array([1.0, 1.0]);

        Object.assign(this, {
            time, blend, alpha
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

    get alpha() {
        return this.uniforms.alpha;
    }

    set alpha(value) {
        this.uniforms.alpha = value;
    }

    get blend() {
        return this.uniforms.blend;
    }

    set blend(value) {
        this.uniforms.blend = Math.floor(value);
    }
}

FilterMirrorImages.defaults = {
    time: 0,
    blend: 2,
    alpha: 0.5,
};




