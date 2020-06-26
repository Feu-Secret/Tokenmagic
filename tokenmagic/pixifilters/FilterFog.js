import { Anime } from "./Anime.js";
import { innerFog } from '../pixifilters/fragments/fog.js';

export class FilterFog extends PIXI.Filter {

    constructor(params) {
        let {
            time,
            color,
            density
        } = Object.assign({}, FilterFog.defaults, params);

        // using the default vertex shader and the specific fragment shader
        super(undefined, innerFog);

        this.uniforms.color = new Float32Array([1.0, 0.4, 0.1, 0.55]);
        this.uniforms.dimensions = new Float32Array(2);

        Object.assign(this, {
            time, color, density
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

    get density() {
        return this.uniforms.divisor;
    }

    set density(value) {
        this.uniforms.density = value;
    }

    apply(filterManager, input, output, clear) {
        this.uniforms.dimensions[0] = input.filterFrame.width;
        this.uniforms.dimensions[1] = input.filterFrame.height;
        filterManager.applyFilter(this, input, output, clear);
    }
}

FilterFog.defaults = {
    time: 0.0,
    color: 0xFFFFFF,
    density: 0.5,
};




