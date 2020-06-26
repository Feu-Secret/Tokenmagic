import { Anime } from "./Anime.js";
import { cosmicRayFrag } from '../pixifilters/fragments/cosmicray.js';

export class FilterRays extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            color,
            divisor,
            alpha
        } = Object.assign({}, FilterRays.defaults, params);

        // using the default vertex shader and the specific fragment shader
        super(undefined, cosmicRayFrag);

        this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            time, color, divisor, alpha
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

    get divisor() {
        return this.uniforms.divisor;
    }

    set divisor(value) {
        this.uniforms.divisor = value;
    }

    get alpha() {
        return this.uniforms.color[3];
    }

    set alpha(value) {
        if (value >= 0 && value <= 1) {
            this.uniforms.color[3] = value;
        }
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.filterFrame.width;
        this.uniforms.dimensions[1] = input.filterFrame.height;
        filterManager.applyFilter(this, input, output, clear);
    }
}

FilterRays.defaults = {
    time: 0.0,
    color: 0xFF8010,
    divisor: 16,
    alpha: 0.55,
};




