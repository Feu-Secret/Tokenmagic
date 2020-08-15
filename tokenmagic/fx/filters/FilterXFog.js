import { xFog } from '../glsl/fragmentshaders/xfog.js';
import { customVertex2D } from '../glsl/vertexshaders/customvertex2D.js';
import { Anime } from "../Anime.js";

export class FilterXFog extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            color
        } = Object.assign({}, FilterXFog.defaults, params);

        // specific vertex and fragment shaders
        super(customVertex2D, xFog);

        this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);

        Object.assign(this, {
            time, color
        });

        this.animated = {};
        Object.assign(this, params);
        this.anime = new Anime(this);
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
}

FilterXFog.defaults = {
    time: 0.0,
    color: 0xFFFFFF,
};




